// src/lib/gopulse.js
// Sincroniza suscriptores hacia GO Pulse (gopulsenews.com). Server-to-server,
// best-effort — nunca debe romper el guardado local del suscriptor.

const GOPULSE_URL = 'https://gopulsenews.com/api/v1/integration/subscribe';

export async function syncSubscriberToGoPulse(email, nombre = '', source = 'web_form') {
  const apiKey = process.env.GOPULSE_API_KEY;
  if (!apiKey) { console.warn('⚠️ GOPULSE_API_KEY no configurada — se omite sync'); return { ok: false, reason: 'sin_api_key' }; }

  const clean = String(email || '').trim().toLowerCase();
  if (!clean) return { ok: false, reason: 'sin_email' };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(GOPULSE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
      body: JSON.stringify({ email: clean, name: String(nombre || '').trim(), source }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (res.status === 200) {
      console.log(`📰 GoPulse: ${clean} sincronizado`);
      return { ok: true, status: res.status };
    }
    if (res.status === 429) {
      const espera = res.headers.get('Retry-After') || '60';
      console.warn(`⚠️ GoPulse rate limit — reintentar en ${espera}s`);
      return { ok: false, status: res.status, reason: 'rate_limit' };
    }
    const body = await res.text().catch(() => '');
    console.warn(`⚠️ GoPulse ${res.status}: ${body}`);
    return { ok: false, status: res.status, reason: body };
  } catch (e) {
    console.warn('⚠️ GoPulse sync falló:', e.message);
    return { ok: false, reason: e.message };
  }
}
