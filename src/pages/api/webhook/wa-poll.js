// src/pages/api/webhook/wa-poll.js
// Fallback de entrada: jala mensajes nuevos desde WAHooks y los procesa.
// Necesario porque la cola de webhooks (push) de WAHooks puede no entregar.
// Protegido con CRON_SECRET_EXTERNAL. Llamar cada ~1 min (cron Vercel o externo).
export const prerender = false;

import { getWagoConfig, getWAIncomingByMsgId, getWAAuthorized } from '../../../lib/analytics-db.js';
import { parseIncoming, handleIncomingMessage } from './whatsapp.js';
import { toWhatsAppJid } from '../../../lib/notify.js';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });

// Solo mensajes de los últimos N minutos (evita responder backlog/historial viejo).
const WINDOW_SEC = 15 * 60;
// 1 por corrida: cada respuesta gasta ~8s IA + ~9s WAF; el cron corre cada minuto,
// así que los mensajes en cola se atienden en corridas sucesivas sin arriesgar timeout.
const MAX_PER_RUN = 1;

// fetch con timeout — WAHooks es intermitente (502/lento); no colgar la función.
async function fetchT(u, opts = {}, ms = 12000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  try { return await fetch(u, { ...opts, signal: ac.signal }); }
  finally { clearTimeout(t); }
}

// reintenta una operación flaky (WAHooks 502/abort) hasta n veces
async function retry(fn, n = 3) {
  let last;
  for (let i = 0; i < n; i++) {
    try { const r = await fn(); if (r && r.ok) return r; last = r; }
    catch (e) { last = e; }
  }
  if (last instanceof Error) throw last;
  return last;
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
  // User-Agent de navegador: algunos WAF (Cloudflare) bloquean fetch sin UA desde datacenters.
  const headers = {
    'Authorization': `Bearer ${cfg.token}`,
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    'Accept': 'application/json',
  };

  // Sonda de diagnóstico: mide si Vercel alcanza WAHooks (endpoint liviano).
  if (url.searchParams.get('probe') === '1') {
    const t0 = Date.now();
    try {
      const r = await fetchT(`${base}`, { headers }, 14000);
      const txt = (await r.text()).slice(0, 120);
      return json({ ok: true, probe: { status: r.status, ms: Date.now() - t0, body: txt } });
    } catch (e) {
      return json({ ok: false, probe: { error: e.message, ms: Date.now() - t0 } });
    }
  }
  const origin = process.env.PUBLIC_SITE_URL
    || `https://${request.headers.get('host') || 'grupo-ortiz.com'}`;
  const nowSec = Math.floor(Date.now() / 1000);

  // Jalar directo los chats de los números autorizados (endpoint /chats global de
  // WAHooks cuelga desde la red de Vercel; el de un chat puntual es liviano).
  // Ventana configurable por query (solo para pruebas con secret)
  const winOverride = Number(url.searchParams.get('window'));
  const windowSec = Number.isFinite(winOverride) && winOverride > 0 ? winOverride : WINDOW_SEC;

  const auth = await getWAAuthorized().catch(() => []);
  const chatIds = auth
    .filter(a => a.active && a.phone)
    .map(a => toWhatsAppJid(a.phone));        // {phone}@s.whatsapp.net
  if (!chatIds.length) return json({ ok: true, note: 'sin numeros autorizados', processed: 0 });

  let processed = 0, scanned = 0, errors = 0;
  const errDetail = [];
  const dbg = { notFromMe: 0, inWindow: 0, parsed: 0, notReplied: 0 };
  for (const chatId of chatIds) {
    if (processed >= MAX_PER_RUN) break;

    let msgs;
    try {
      const r = await retry(() => fetchT(
        `${base}/chats/${encodeURIComponent(chatId)}/messages?limit=10&downloadMedia=true`,
        { headers }, 20000), 2);
      if (!r || !r.ok) { errors++; errDetail.push(`HTTP ${r?.status}`); continue; }
      msgs = await r.json();
    } catch (e) { errors++; errDetail.push(e.message); continue; }
    if (!Array.isArray(msgs)) continue;

    // Procesar de más viejo a más nuevo para mantener orden de conversación
    for (const m of msgs.slice().reverse()) {
      if (processed >= MAX_PER_RUN) break;
      scanned++;
      if (m?.fromMe) continue;
      dbg.notFromMe++;
      const ts = Number(m?.timestamp || 0);
      if (ts > 0 && (nowSec - ts) > windowSec) continue;
      dbg.inWindow++;

      const parsed = parseIncoming({ event: 'message', payload: m });
      if (!parsed || parsed.fromMe || !parsed.body) continue;
      dbg.parsed++;

      // Saltar solo si YA tiene respuesta; si quedó sin responder, reintentar.
      if (parsed.msgId) {
        const row = await getWAIncomingByMsgId(parsed.msgId).catch(() => null);
        if (row?.hasReply) continue;
      }
      dbg.notReplied++;

      try {
        const st = await handleIncomingMessage(parsed, origin);
        processed++;
        if (st && st !== 'sent' && st !== 'already-replied') errDetail.push(st);
      } catch (e) { errDetail.push(`proc: ${e.message}`); }
    }
  }

  // Monitoreo: si hay fallas críticas/seguridad nuevas, Claude diagnostica y
  // avisa por WhatsApp a los admins (anti-spam 30 min). No bloquea la respuesta.
  try {
    const { checkAndAlert } = await import('../../../lib/health-alert.js');
    await checkAndAlert();
  } catch {}

  return json({ ok: true, chats: chatIds.length, scanned, processed, errors, dbg, errDetail: errDetail.slice(0, 3) });
}

export async function GET({ request, url }) { return run(request, url); }
export async function POST({ request, url }) { return run(request, url); }
