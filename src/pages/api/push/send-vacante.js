// src/pages/api/push/send-vacante.js
// Endpoint HTTP para disparar push manualmente (admin o testing).
export const prerender = false;

import { sendPushToAll } from '../../../lib/push.js';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';

export async function POST({ request }) {
  try {
    const adminRole = await verifyAdminToken(request);
    if (!adminRole) return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

    let payload = {};
    try { payload = await request.json(); } catch {}

    const result = await sendPushToAll({
      title: payload.title || 'Nueva vacante disponible',
      body:  payload.body  || 'Grupo Ortiz tiene nuevas oportunidades en Morelia.',
      url:   payload.url   || '/es/vacantes',
    });

    return new Response(JSON.stringify({ ok: true, ...result }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[push/send-vacante]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
}
