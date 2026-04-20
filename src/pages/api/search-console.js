// src/pages/api/search-console.js
// Obtiene datos de Google Search Console para grupo-ortiz.com
// Auth: Service Account (GSC_CLIENT_EMAIL + GSC_PRIVATE_KEY en .env)
// Agregar cuenta de servicio como usuario de Solo lectura en Search Console.

export const prerender = false;

const SITE_URL = 'https://grupo-ortiz.com/';

// ── JWT para Service Account ──────────────────────────────────────────────────
async function getAccessToken() {
  const email = import.meta.env.GSC_CLIENT_EMAIL;
  const key   = import.meta.env.GSC_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!email || !key) throw new Error('Credenciales GSC no configuradas. Agrega GSC_CLIENT_EMAIL y GSC_PRIVATE_KEY en .env');

  const now   = Math.floor(Date.now() / 1000);
  const claim = { iss: email, scope: 'https://www.googleapis.com/auth/webmasters.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 };

  // Codificar JWT
  const b64url = s => btoa(unescape(encodeURIComponent(JSON.stringify(s)))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const header  = b64url({ alg:'RS256', typ:'JWT' });
  const payload = b64url(claim);
  const signing = `${header}.${payload}`;

  // Importar clave privada RSA
  const pemBody = key.replace(/-----BEGIN PRIVATE KEY-----/, '').replace(/-----END PRIVATE KEY-----/, '').replace(/\s+/g, '');
  const keyData = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey('pkcs8', keyData, { name:'RSASSA-PKCS1-v1_5', hash:'SHA-256' }, false, ['sign']);

  const sigBuf  = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(signing));
  const sig     = btoa(String.fromCharCode(...new Uint8Array(sigBuf))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const jwt     = `${signing}.${sig}`;

  // Cambiar JWT por access token
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  });
  const json = await res.json();
  if (!json.access_token) throw new Error(json.error_description || 'Error obteniendo token GSC');
  return json.access_token;
}

// ── Query helper ──────────────────────────────────────────────────────────────
async function scQuery(token, body) {
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Error GSC: ${res.status}`);
  }
  return res.json();
}

export async function POST({ request }) {
  try {
    const body = await request.json();
    // Fechas nulas → últimos 16 meses (igual que GSC por defecto)
    const today = new Date().toISOString().slice(0, 10);
    const sd = body.startDate || new Date(Date.now() - 487 * 86400000).toISOString().slice(0, 10);
    const ed = body.endDate   || today;

    const token = await getAccessToken();
    // Sin filtro de país — igual que la vista por defecto de GSC (tráfico global)
    const base = { startDate: sd, endDate: ed };

    // Todas las consultas en paralelo
    const [queriesRes, pagesRes, dailyRes, countriesRes, devicesRes] = await Promise.all([
      scQuery(token, { ...base, dimensions: ['query'],   rowLimit: 15 }),
      scQuery(token, { ...base, dimensions: ['page'],    rowLimit: 10 }),
      scQuery(token, { ...base, dimensions: ['date'],    rowLimit: 1000 }),
      scQuery(token, { ...base, dimensions: ['country'], rowLimit: 10 }),
      scQuery(token, { ...base, dimensions: ['device'],  rowLimit: 10 }),
    ]);

    // Totales desde daily (misma fuente que GSC)
    const dailyRows = dailyRes.rows || [];
    const totalClicks      = dailyRows.reduce((s, r) => s + r.clicks, 0);
    const totalImpressions = dailyRows.reduce((s, r) => s + r.impressions, 0);
    const avgCtr           = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(1) : '0.0';
    const avgPos           = dailyRows.length > 0
      ? (dailyRows.reduce((s, r) => s + r.position, 0) / dailyRows.length).toFixed(1)
      : '—';

    // dailyClicks: cubre TODO el período seleccionado (no solo los últimos 14 días)
    const dailyByDate = {};
    dailyRows.forEach(r => { dailyByDate[r.keys[0]] = { clicks: r.clicks, impressions: r.impressions, ctr: r.ctr * 100, position: r.position }; });
    const startMs  = new Date(sd).getTime();
    const endMs    = new Date(ed).getTime();
    const diffDays = Math.round((endMs - startMs) / 86400000) + 1;
    // Para períodos > 90 días agrupa por semana; ≤ 90 días muestra cada día
    const useWeekly = diffDays > 90;
    const step      = useWeekly ? 7 : 1;
    const nPoints   = useWeekly ? Math.ceil(diffDays / 7) : diffDays;
    const dailyClicks = Array.from({ length: Math.min(nPoints, 120) }, (_, i) => {
      const offset = i * step;
      const d      = new Date(startMs + offset * 86400000);
      const date   = d.toISOString().slice(0, 10);
      if (useWeekly) {
        let sumC=0, sumI=0, sumCtr=0, sumPos=0, cnt=0;
        for (let j = 0; j < 7; j++) {
          const wd = new Date(startMs + (offset + j) * 86400000);
          const pt = dailyByDate[wd.toISOString().slice(0, 10)];
          if (pt) { sumC += pt.clicks; sumI += pt.impressions; sumCtr += pt.ctr; sumPos += pt.position; cnt++; }
        }
        return { date, clicks: sumC, impressions: sumI, ctr: cnt>0 ? +(sumCtr/cnt).toFixed(2) : 0, position: cnt>0 ? +(sumPos/cnt).toFixed(2) : 0 };
      }
      const pt = dailyByDate[date];
      return { date, clicks: pt?.clicks||0, impressions: pt?.impressions||0, ctr: pt ? +(pt.ctr).toFixed(2) : 0, position: pt ? +(pt.position).toFixed(2) : 0 };
    });

    return new Response(JSON.stringify({
      ok: true,
      startDate: sd, endDate: ed,
      totalClicks,
      totalImpressions,
      avgCtr,
      avgPos,
      topQueries: (queriesRes.rows || []).slice(0, 8).map(r => ({
        query:       r.keys[0],
        clicks:      r.clicks,
        impressions: r.impressions,
        ctr:         (r.ctr * 100).toFixed(1),
        position:    r.position.toFixed(1),
      })),
      topPages: (pagesRes.rows || []).slice(0, 5).map(r => ({
        page:        r.keys[0].replace('https://grupo-ortiz.com', '') || '/',
        clicks:      r.clicks,
        impressions: r.impressions,
      })),
      topCountries: (countriesRes.rows || []).slice(0, 8).map(r => ({
        country:     r.keys[0],
        clicks:      r.clicks,
        impressions: r.impressions,
      })),
      topDevices: (devicesRes.rows || []).map(r => ({
        device:      r.keys[0],
        clicks:      r.clicks,
        impressions: r.impressions,
        ctr:         (r.ctr * 100).toFixed(1),
      })),
      dailyClicks,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[search-console]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
