// src/pages/api/admin/radar-key.js
// Espejo GO Radar §9/T8 — alta y baja de la llave MAESTRA con la que Radar
// llama a este sitio (src/pages/api/partner/v1/*). Solo Admin. La llave en
// texto plano solo se regresa una vez, al crearla — igual patrón que
// generatePassword en admin/users.js.
export const prerender = false;

import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';
import { createRadarKey, revokeRadarKey } from '../../../lib/analytics-db.js';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

export async function POST({ request }) {
  const role = await verifyAdminToken(request);
  if (!role?.isAdminRole) return json({ ok: false, error: 'Solo Admin.' }, 403);

  const body = await request.json().catch(() => ({}));
  const { action } = body;

  if (action === 'create') {
    const { label } = body;
    const { id, rawKey } = await createRadarKey(label || 'GO Radar — llave maestra');
    return json({ ok: true, id, rawKey });
  }

  if (action === 'revoke') {
    if (!body.id) return json({ ok: false, error: 'id requerido.' }, 400);
    await revokeRadarKey(body.id);
    return json({ ok: true });
  }

  return json({ ok: false, error: 'Acción desconocida.' }, 400);
}
