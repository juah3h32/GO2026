// src/pages/api/voice-calls.js
export const prerender = false;

import { saveVoiceCall, readVoiceCalls } from '../../lib/analytics-db.js';
import { verifyAdminToken } from '../../lib/verifyAdminToken.ts';

export async function POST({ request }) {
  try {
    const body = await request.json().catch(() => ({}));

    // ── Guardar llamada (público — llamado desde el cliente al colgar) ──────
    if (body.action === 'save') {
      const { lang = 'es', duration = 0, turns = [] } = body;
      if (Array.isArray(turns) && turns.length > 0) {
        await saveVoiceCall({ lang, duration, turns });
      }
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── Listar llamadas (requiere auth de admin) ───────────────────────────
    if (body.action === 'list') {
      const adminRole = await verifyAdminToken(request);
      if (!adminRole) {
        return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), {
          status: 401, headers: { 'Content-Type': 'application/json' },
        });
      }
      const result = await readVoiceCalls({
        limit:  body.limit  || 60,
        offset: body.offset || 0,
      });
      return new Response(JSON.stringify({ ok: true, ...result }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: false, error: 'Unknown action' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[voice-calls]', err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
