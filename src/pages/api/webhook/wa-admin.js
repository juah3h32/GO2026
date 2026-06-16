// src/pages/api/webhook/wa-admin.js
// Endpoint admin: mensajes entrantes + gestión de números autorizados + envío manual
export const prerender = false;

import { verifyAdminToken }  from '../../../lib/verifyAdminToken.ts';
import { getWAIncoming, getWAAuthorized, addWAAuthorized, updateWAAuthorized, deleteWAAuthorized, getConfig, setConfig } from '../../../lib/analytics-db.js';
import { sendWAText }        from '../../../lib/notify.js';

export async function POST({ request }) {
  const adminRole = await verifyAdminToken(request);
  if (!adminRole) return json({ ok: false, error: 'No autorizado' }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'Bad request' }, 400); }

  // ── Mensajes entrantes ────────────────────────────────────────────────────
  if (body.action === 'list') {
    const rows = await getWAIncoming({ limit: body.limit || 60, offset: body.offset || 0 });
    return json({ ok: true, messages: rows });
  }

  // ── Envío manual ──────────────────────────────────────────────────────────
  if (body.action === 'send') {
    const { phone, text } = body;
    if (!phone || !text) return json({ ok: false, error: 'phone y text requeridos' }, 400);
    try {
      await sendWAText(phone, text);
      return json({ ok: true });
    } catch (e) {
      let msg = e.message || 'Error desconocido';
      if (msg.includes('500') || msg.includes('Connection Closed') || msg.includes('timeout')) {
        msg = 'WhatsApp desconectado en WAGO. Ve al dashboard de WAGO y escanea el QR de nuevo.';
      } else if (msg.includes('503') || msg.includes('No worker')) {
        msg = 'El servidor de WhatsApp (WAGO) no está disponible. Verifica que Docker esté corriendo.';
      } else if (msg.includes('429')) {
        msg = 'Límite de mensajes alcanzado. Espera unos minutos.';
      }
      return json({ ok: false, error: msg }, 200);
    }
  }

  // ── Números autorizados ───────────────────────────────────────────────────
  if (body.action === 'authorized_list') {
    const rows = await getWAAuthorized();
    return json({ ok: true, authorized: rows });
  }

  if (body.action === 'authorized_add') {
    const { phone, name, permissions, categories } = body;
    if (!phone) return json({ ok: false, error: 'phone requerido' }, 400);
    await addWAAuthorized({ phone, name: name || '', permissions: permissions || [], categories: categories || [] });
    return json({ ok: true });
  }

  if (body.action === 'authorized_update') {
    const { id, name, permissions, active, categories } = body;
    if (!id) return json({ ok: false, error: 'id requerido' }, 400);
    await updateWAAuthorized({ id, name: name || '', permissions: permissions || [], active: active !== false, categories: categories || [] });
    return json({ ok: true });
  }

  if (body.action === 'authorized_delete') {
    if (!body.id) return json({ ok: false, error: 'id requerido' }, 400);
    await deleteWAAuthorized(body.id);
    return json({ ok: true });
  }

  // ── Pausa global de la automatizacion del bot (numeros del publico) ─────────
  if (body.action === 'bot_pause_get') {
    const v = await getConfig('bot_general_paused').catch(() => null);
    return json({ ok: true, paused: v === '1' });
  }

  if (body.action === 'bot_pause_set') {
    await setConfig('bot_general_paused', body.paused ? '1' : '0');
    return json({ ok: true, paused: !!body.paused });
  }

  return json({ ok: false, error: 'Unknown action' }, 400);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
