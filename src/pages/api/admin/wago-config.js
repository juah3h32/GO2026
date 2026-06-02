// src/pages/api/admin/wago-config.js
// Guarda / lee la clave de integración WAGO desde la DB (no del .env)
export const prerender = false;

import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';
import { getWagoConfig, saveWagoConfig } from '../../../lib/analytics-db.js';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

// GET — leer config actual (sin exponer token completo)
export async function GET({ request }) {
  const role = await verifyAdminToken(request);
  if (!role) return json({ ok: false, error: 'No autorizado' }, 401);

  const cfg = await getWagoConfig().catch(() => null);
  if (!cfg) return json({ ok: true, configured: false });

  return json({
    ok: true,
    configured: !!(cfg.url && cfg.token && cfg.connectionId),
    url:          cfg.url,
    tokenPrefix:  cfg.token ? cfg.token.slice(0, 10) + '…' : '',
    connectionId: cfg.connectionId,
    webhookSecretSet: !!cfg.webhookSecret,
  });
}

// POST — guardar desde clave integrada o campos sueltos
export async function POST({ request }) {
  const role = await verifyAdminToken(request);
  if (!role) return json({ ok: false, error: 'No autorizado' }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'Bad request' }, 400); }

  // Modo clave integrada: "wago_v1_<url-encoded-json>"
  if (body.integrationKey) {
    const key = String(body.integrationKey).trim();

    if (!key.startsWith('wago_v1_')) {
      // Dar error descriptivo según el formato que pegaron
      if (/^[a-f0-9]{32,}$/i.test(key)) {
        return json({ ok: false, error: 'Eso es la firma del webhook (signing secret), no la clave de integración. Ve a WAGO → tu conexión → Credenciales → "Generar clave de integración".' }, 400);
      }
      if (key.startsWith('wh_')) {
        return json({ ok: false, error: 'Eso es un token de API, no la clave de integración. Ve a WAGO → tu conexión → Credenciales → "Generar clave de integración".' }, 400);
      }
      return json({ ok: false, error: 'Formato incorrecto. La clave de integración empieza con wago_v1_' }, 400);
    }

    let decoded;
    try {
      const raw = key.replace(/^wago_v1_/, '');
      let jsonStr;
      try { jsonStr = decodeURIComponent(raw); }
      catch { jsonStr = Buffer.from(raw, 'base64').toString('utf8'); }
      decoded = JSON.parse(jsonStr);
    } catch {
      return json({ ok: false, error: 'Clave inválida o corrupta. Generá una nueva en WAGO.' }, 400);
    }
    const { url, token, connectionId, webhookSecret } = decoded;
    if (!url || !token || !connectionId || !webhookSecret) {
      return json({ ok: false, error: 'Clave incompleta. Generá una nueva en WAGO → Credenciales → Generar clave de integración.' }, 400);
    }
    await saveWagoConfig({ url, token, connectionId, webhookSecret });
    return json({ ok: true, connectionId });
  }

  // Modo manual: campos sueltos
  const { url, token, connectionId, webhookSecret } = body;
  if (!url || !token || !connectionId || !webhookSecret) {
    return json({ ok: false, error: 'url, token, connectionId y webhookSecret son requeridos' }, 400);
  }
  await saveWagoConfig({ url, token, connectionId, webhookSecret });
  return json({ ok: true, connectionId });
}

// DELETE — borrar config
export async function DELETE({ request }) {
  const role = await verifyAdminToken(request);
  if (!role) return json({ ok: false, error: 'No autorizado' }, 401);
  await saveWagoConfig({ url: '', token: '', connectionId: '', webhookSecret: '' });
  return json({ ok: true });
}
