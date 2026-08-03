// src/pages/api/admin/redes-numbers.js
// CRUD de numeros de WhatsApp para pulseras NFC + numero principal de /redes
export const prerender = false;

import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';
import {
  getRedesNumbers, addRedesNumber, updateRedesNumber, deleteRedesNumber, setDefaultRedesNumber,
} from '../../../lib/analytics-db.js';

export async function POST({ request }) {
  const adminRole = await verifyAdminToken(request);
  if (!adminRole) return json({ ok: false, error: 'No autorizado' }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'Bad request' }, 400); }

  if (body.action === 'list') {
    const rows = await getRedesNumbers();
    return json({ ok: true, numbers: rows });
  }

  if (body.action === 'add') {
    const { label, phone } = body;
    if (!phone || !label) return json({ ok: false, error: 'nombre y phone requeridos' }, 400);

    const base = String(label).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'pulsera';
    const existing = new Set((await getRedesNumbers()).map(n => n.slug));
    let slug = base;
    let i = 2;
    while (existing.has(slug)) { slug = `${base}-${i}`; i++; }

    try {
      await addRedesNumber({ slug, label, phone });
      return json({ ok: true });
    } catch (e) {
      const msg = String(e.message || '').includes('UNIQUE') ? 'Ese numero ya esta registrado' : (e.message || 'Error al agregar');
      return json({ ok: false, error: msg }, 400);
    }
  }

  if (body.action === 'update') {
    const { id, label, phone, active } = body;
    if (!id || !phone) return json({ ok: false, error: 'id y phone requeridos' }, 400);
    await updateRedesNumber({ id, label: label || '', phone, active: active !== false });
    return json({ ok: true });
  }

  if (body.action === 'delete') {
    if (!body.id) return json({ ok: false, error: 'id requerido' }, 400);
    await deleteRedesNumber(body.id);
    return json({ ok: true });
  }

  if (body.action === 'set_default') {
    if (!body.id) return json({ ok: false, error: 'id requerido' }, 400);
    await setDefaultRedesNumber(body.id);
    return json({ ok: true });
  }

  return json({ ok: false, error: 'Unknown action' }, 400);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
