// src/pages/api/admin/preview-identity.js
// Interruptor del link publico /preview-identidad. Mientras este apagado,
// esa ruta muestra la pantalla de mantenimiento (502) aunque alguien
// descubra la URL. Config en global_config['preview_identity_enabled'].
import { getConfig, setConfig } from '../../../lib/analytics-db.js';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';

export const prerender = false;

const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

export async function GET({ request }) {
  const role = await verifyAdminToken(request).catch(() => null);
  if (!role) return json({ ok: false, error: 'No autorizado' }, 401);
  const enabled = (await getConfig('preview_identity_enabled').catch(() => null)) === '1';
  return json({ ok: true, enabled });
}

export async function POST({ request }) {
  const role = await verifyAdminToken(request).catch(() => null);
  if (!role || !role.canDownload) return json({ ok: false, error: 'No autorizado' }, 401);
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'Bad request' }, 400); }
  if (typeof body.enabled !== 'boolean') return json({ ok: false, error: 'Parametros invalidos' }, 400);

  await setConfig('preview_identity_enabled', body.enabled ? '1' : '0');
  return json({ ok: true, enabled: body.enabled });
}
