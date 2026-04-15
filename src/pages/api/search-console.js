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
    const { startDate, endDate } = await request.json();

    if (!startDate || !endDate) {
      return new Response(JSON.stringify({ ok: false, error: 'Faltan startDate/endDate' }), { status: 400 });
    }

    const token = await getAccessToken();
    // Filtro: solo tráfico de México
    const mxFilter = {
      dimensionFilterGroups: [{
        filters: [{ dimension: 'country', operator: 'equals', expression: 'mex' }]
      }]
    };
    const base = { startDate, endDate, ...mxFilter };

    // Todas las consultas en paralelo (countries sin filtro MX para ver todos los países)
    const [queriesRes, pagesRes, dailyRes, countriesRes] = await Promise.all([
      scQuery(token, { ...base, dimensions: ['query'],   rowLimit: 8 }),
      scQuery(token, { ...base, dimensions: ['page'],    rowLimit: 5 }),
      scQuery(token, { ...base, dimensions: ['date'],    rowLimit: 500 }),
      scQuery(token, { startDate, endDate, dimensions: ['country'], rowLimit: 8 }),
    ]);

    // Totales desde daily (más preciso)
    const dailyRows = dailyRes.rows || [];
    const totalClicks      = dailyRows.reduce((s, r) => s + r.clicks, 0);
    const totalImpressions = dailyRows.reduce((s, r) => s + r.impressions, 0);
    const avgCtr           = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(1) : '0.0';
    const avgPos           = dailyRows.length > 0
      ? (dailyRows.reduce((s, r) => s + r.position, 0) / dailyRows.length).toFixed(1)
      : '—';

    // Últimos 14 días para la gráfica
    const dailyByDate = {};
    dailyRows.forEach(r => { dailyByDate[r.keys[0]] = r.clicks; });
    const now = new Date();
    const last14 = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(now); d.setDate(d.getDate() - (13 - i));
      return d.toISOString().slice(0, 10);
    });
    const dailyClicks = last14.map(date => ({ date, clicks: dailyByDate[date] || 0 }));

    return new Response(JSON.stringify({
      ok: true,
      startDate, endDate,
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
      topCountries: (countriesRes.rows || []).slice(0, 5).map(r => ({
        country:     r.keys[0],
        clicks:      r.clicks,
        impressions: r.impressions,
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
