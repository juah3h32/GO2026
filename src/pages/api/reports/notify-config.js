// src/pages/api/reports/notify-config.js
// CRUD para configuraciones de notificación de nuevos candidatos
import {
  saveCandidateNotification,
  readCandidateNotifications,
  updateCandidateNotification,
  deleteCandidateNotification,
} from '../../../lib/analytics-db.js';
import { sendTestNotification } from '../../../lib/notify.js';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';

export const prerender = false;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET({ request }) {
  try {
    const adminRole = await verifyAdminToken(request);
    if (!adminRole) return json({ ok: false, error: 'No autorizado' }, 401);

    const configs = await readCandidateNotifications();
    return json({ ok: true, configs });
  } catch (err) {
    console.error('[notify-config GET]', err);
    return json({ ok: false, error: err.message }, 500);
  }
}

export async function POST({ request }) {
  try {
    const adminRole = await verifyAdminToken(request);
    if (!adminRole) return json({ ok: false, error: 'No autorizado' }, 401);

    const body   = await request.json();
    const { action } = body;

    // ── create ────────────────────────────────────────────────────────────────
    if (action === 'create') {
      const { name, phones, caption_template = '', active = true } = body;
      if (!name?.trim()) return json({ ok: false, error: 'Nombre requerido' }, 400);
      if (!phones?.length) return json({ ok: false, error: 'Al menos un número requerido' }, 400);
      const result = await saveCandidateNotification({ name: name.trim(), phones, caption_template, active });
      return json({ ok: true, id: result.id });
    }

    // ── update ────────────────────────────────────────────────────────────────
    if (action === 'update') {
      const { id, name, phones, caption_template = '', active } = body;
      if (!id) return json({ ok: false, error: 'ID requerido' }, 400);
      await updateCandidateNotification({ id, name: name?.trim() || '', phones: phones || [], caption_template, active: !!active });
      return json({ ok: true });
    }

    // ── delete ────────────────────────────────────────────────────────────────
    if (action === 'delete') {
      if (!body.id) return json({ ok: false, error: 'ID requerido' }, 400);
      await deleteCandidateNotification(body.id);
      return json({ ok: true });
    }

    // ── test — genera PDF de prueba y lo envía personalizado ─────────────────
    if (action === 'test') {
      const { id, phones, caption_template = '' } = body;
      if (!phones?.length) return json({ ok: false, error: 'Sin números configurados' }, 400);
      const results = await sendTestNotification(phones, caption_template, id);
      const allOk   = results.every(r => r.ok);
      const failed  = results.find(r => !r.ok);
      return json(
        { ok: allOk, results, error: failed?.error },
        allOk ? 200 : 207
      );
    }

    return json({ ok: false, error: 'Acción desconocida' }, 400);

  } catch (err) {
    console.error('[notify-config POST]', err);
    return json({ ok: false, error: err.message }, 500);
  }
}
