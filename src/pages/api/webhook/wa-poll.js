// src/pages/api/webhook/wa-poll.js
// Fallback de entrada: jala mensajes nuevos desde WAHooks y los procesa.
// Necesario porque la cola de webhooks (push) de WAHooks puede no entregar.
// Protegido con CRON_SECRET_EXTERNAL. Llamar cada ~1 min (cron Vercel o externo).
export const prerender = false;

import { getWagoConfig, waIncomingExistsByMsgId } from '../../../lib/analytics-db.js';
import { parseIncoming, handleIncomingMessage } from './whatsapp.js';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });

// Solo mensajes de los últimos N minutos (evita responder backlog/historial viejo).
const WINDOW_SEC = 15 * 60;
const MAX_PER_RUN = 5;

// fetch con timeout — WAHooks es intermitente (502/lento); no colgar la función.
async function fetchT(u, opts = {}, ms = 6000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  try { return await fetch(u, { ...opts, signal: ac.signal }); }
  finally { clearTimeout(t); }
}

async function authOk(request, url) {
  const secret = process.env.CRON_SECRET_EXTERNAL || import.meta.env?.CRON_SECRET_EXTERNAL || '';
  const hdr = request.headers.get('x-cron-secret')
           || (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const qp  = url.searchParams.get('secret') || '';
  if (secret && (hdr === secret || qp === secret)) return true;
  // Dashboard con sesión admin también puede dispararlo
  const role = await verifyAdminToken(request).catch(() => null);
  return !!role;
}

async function run(request, url) {
  if (!(await authOk(request, url))) return json({ ok: false, error: 'No autorizado' }, 401);

  const cfg = await getWagoConfig().catch(() => null);
  if (!cfg?.url || !cfg?.token || !cfg?.connectionId) {
    return json({ ok: false, error: 'WhatsApp no configurado' }, 503);
  }

  const base = `${cfg.url.replace(/\/$/, '')}/api/connections/${cfg.connectionId}`;
  const headers = { 'Authorization': `Bearer ${cfg.token}` };
  const origin = process.env.PUBLIC_SITE_URL
    || `https://${request.headers.get('host') || 'grupo-ortiz.com'}`;
  const nowSec = Math.floor(Date.now() / 1000);

  // 1. Chats recientes
  let chats;
  try {
    const r = await fetchT(`${base}/chats?limit=20`, { headers });
    if (!r.ok) return json({ ok: false, error: `chats HTTP ${r.status}` }, 502);
    chats = await r.json();
  } catch (e) { return json({ ok: false, error: `chats: ${e.message}` }, 502); }
  if (!Array.isArray(chats)) chats = [];

  // Solo chats con actividad dentro de la ventana
  const recent = chats.filter(c => {
    const t = Number(c.conversationTimestamp || 0);
    return t > 0 && (nowSec - t) <= WINDOW_SEC;
  });

  let processed = 0, scanned = 0;
  for (const chat of recent) {
    if (processed >= MAX_PER_RUN) break;
    const chatId = chat.id;
    if (!chatId) continue;

    let msgs;
    try {
      const r = await fetchT(
        `${base}/chats/${encodeURIComponent(chatId)}/messages?limit=10&downloadMedia=false`,
        { headers });
      if (!r.ok) continue;
      msgs = await r.json();
    } catch { continue; }
    if (!Array.isArray(msgs)) continue;

    // Procesar de más viejo a más nuevo para mantener orden de conversación
    for (const m of msgs.slice().reverse()) {
      if (processed >= MAX_PER_RUN) break;
      scanned++;
      if (m?.fromMe) continue;
      const ts = Number(m?.timestamp || 0);
      if (ts > 0 && (nowSec - ts) > WINDOW_SEC) continue;

      const parsed = parseIncoming({ event: 'message', payload: m });
      if (!parsed || parsed.fromMe || !parsed.body) continue;

      // Dedup antes de procesar (handleIncomingMessage también deduplica)
      if (parsed.msgId && await waIncomingExistsByMsgId(parsed.msgId).catch(() => false)) continue;

      try { await handleIncomingMessage(parsed, origin); processed++; }
      catch (e) { console.error('[wa-poll] proceso:', e.message); }
    }
  }

  return json({ ok: true, chats: chats.length, recent: recent.length, scanned, processed });
}

export async function GET({ request, url }) { return run(request, url); }
export async function POST({ request, url }) { return run(request, url); }
