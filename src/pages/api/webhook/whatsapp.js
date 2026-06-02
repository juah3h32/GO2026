// src/pages/api/webhook/whatsapp.js
// Recibe mensajes de WAGO/WAHA.
// - Números autorizados (wa_authorized) → motor de comandos privados
// - Resto → chatbot BotGO de clientes
export const prerender = false;

import { createHmac } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join }       from 'node:path';
import { saveWAIncoming, updateWAIncomingReply, getWAAuthorizedByPhone, getWagoConfig } from '../../../lib/analytics-db.js';
import { sendWAText, sendWAPDF, generateReportPDF } from '../../../lib/notify.js';
import { ejecutarComando } from '../../../lib/wa-commands.js';
import { ejecutarAsistente } from '../../../lib/wa-assistant.js';

function getLogoBase64() {
  try {
    const p = join(process.cwd(), 'public/images/logo/logoN.png');
    if (!existsSync(p)) return null;
    return `data:image/png;base64,${readFileSync(p).toString('base64')}`;
  } catch { return null; }
}

async function resolveWebhookSecret() {
  try {
    const cfg = await getWagoConfig();
    if (cfg?.webhookSecret) return cfg.webhookSecret;
  } catch {}
  return process.env.WAGO_WEBHOOK_SECRET || null;
}

// GET — verificación de plataforma (challenge)
export async function GET({ url }) {
  const challenge = url.searchParams.get('challenge') || url.searchParams.get('hub.challenge');
  if (challenge) return new Response(challenge, { status: 200 });
  return new Response(JSON.stringify({ ok: true, endpoint: 'BotGO WhatsApp Webhook' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// POST — mensajes entrantes
export async function POST({ request }) {
  const secret = await resolveWebhookSecret();
  let body;

  if (secret) {
    const wagoSig = request.headers.get('x-wago-signature');
    const wagoTs  = request.headers.get('x-wago-timestamp') || '';

    if (wagoSig) {
      // WAGO HMAC-SHA256: sha256=HMAC(secret, "${timestamp}.${rawBody}")
      let rawText;
      try { rawText = await request.text(); }
      catch { return new Response('Bad Request', { status: 400 }); }

      const expected = 'sha256=' + createHmac('sha256', secret)
        .update(`${wagoTs}.${rawText}`)
        .digest('hex');

      if (wagoSig !== expected) return new Response('Unauthorized', { status: 401 });

      try { body = JSON.parse(rawText); }
      catch { return new Response('Bad Request', { status: 400 }); }
    } else {
      // Fallback: header simple (x-webhook-secret o authorization)
      const hdr = request.headers.get('x-webhook-secret') || request.headers.get('authorization') || '';
      if (!hdr.includes(secret)) return new Response('Unauthorized', { status: 401 });
      try { body = await request.json(); }
      catch { return new Response('Bad Request', { status: 400 }); }
    }
  } else {
    try { body = await request.json(); }
    catch { return new Response('Bad Request', { status: 400 }); }
  }

  const msg = parseIncoming(body);
  if (!msg || msg.fromMe) {
    return new Response(JSON.stringify({ ok: true, ignored: true }), { headers: { 'Content-Type': 'application/json' } });
  }

  // Guardar mensaje entrante
  let savedId;
  try { savedId = await saveWAIncoming(msg); } catch (e) { console.error('[webhook/wa] DB:', e.message); }

  // Verificar si es número autorizado
  const authorized = await getWAAuthorizedByPhone(msg.phone).catch(() => null);

  let replyText = null;
  let replyPdfData = null;

  if (authorized) {
    // ── Asistente IA (cerebro) para números autorizados ──────────────────────
    try {
      let result = null;

      // 1. Asistente IA — entiende lenguaje natural y consulta datos reales
      try {
        result = await ejecutarAsistente(msg.body, authorized.permissions, msg.phone);
      } catch (e) { console.error('[webhook/wa] Asistente IA:', e.message); }

      // 2. Fallback: motor de comandos rígidos si la IA no responde
      if (!result) {
        result = await ejecutarComando(msg.body, authorized.permissions);
      }

      if (result && typeof result === 'object') {
        replyText    = result.text    || null;
        replyPdfData = result.pdfData || null;
      } else {
        replyText = String(result || '');
      }
    } catch (e) {
      console.error('[webhook/wa] Comando error:', e.message);
      replyText = 'Error al procesar el comando. Intenta de nuevo.';
    }
  } else {
    // ── BotGO (chatbot de clientes) ──────────────────────────────────────────
    try {
      const host     = request.headers.get('host') || 'localhost:4321';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      const origin   = process.env.PUBLIC_SITE_URL || `${protocol}://${host}`;

      const chatRes = await fetch(`${origin}/api/chat`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages:  [{ role: 'user', content: msg.body }],
          sessionId: `wa_${msg.phone}`,
          lang:      'es',
        }),
      });
      if (chatRes.ok) {
        const d   = await chatRes.json();
        // Limpiar tags de acción del chat antes de enviar por WhatsApp
        replyText = (d.reply || '').replace(/\[ACCION:[^\]]+\]/g, '').trim();
      }
    } catch (e) { console.error('[webhook/wa] Chat error:', e.message); }
  }

  // Enviar respuesta de texto
  if (replyText) {
    // Guardar reply en DB PRIMERO, independiente del envío
    if (savedId) await updateWAIncomingReply(savedId, replyText).catch(() => {});
    try {
      await sendWAText(msg.phone, replyText);
    } catch (e) { console.error('[webhook/wa] Send error:', e.message); }
  }

  // Enviar PDF si el comando lo generó (solo para números autorizados)
  if (replyPdfData && authorized) {
    try {
      const logoBase64 = getLogoBase64();
      const { buffer, filename } = await generateReportPDF(replyPdfData, logoBase64);
      await sendWAPDF(msg.phone, buffer, filename);
    } catch (e) { console.error('[webhook/wa] PDF error:', e.message); }
  }

  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}

// ── Parsear distintos formatos de webhook ─────────────────────────────────────
function parseIncoming(body) {
  const evt = body?.event || body?.eventType || '';

  // WAGA normalizado: { event:'message', payload:{ key:{remoteJid,fromMe}, message:{conversation} } }
  // Formato Evolution API reescrito por WAGO events.controller
  if ((evt === 'message' || evt === 'MESSAGES_UPSERT') && body?.payload) {
    const p = body.payload;

    // Evolution API via WAGO (rewritten payload): payload.key.remoteJid, payload.message.conversation
    if (p?.key?.remoteJid) {
      const fromMe = !!p.key.fromMe;
      const text   = p.message?.conversation
                  || p.message?.extendedTextMessage?.text
                  || p.body || p.text || '';
      if (!text || fromMe) return null;
      return { phone: cleanPhone(p.key.remoteJid), body: String(text), fromMe, msgId: p.key.id || '', timestamp: p.messageTimestamp || 0 };
    }

    // WAHA formato original: payload.from, payload.body
    const text = p.body || p.text || '';
    if (!text) return null;
    return { phone: cleanPhone(p.from || ''), body: String(text), fromMe: !!p.fromMe, msgId: p.id || '', timestamp: p.timestamp || 0 };
  }

  // Genérico / WAGO directo
  const from = body?.from || body?.sender || body?.message?.from;
  const text = body?.body || body?.text || body?.message?.body || body?.message?.text;
  if (!from || !text) return null;
  return { phone: cleanPhone(String(from)), body: String(text), fromMe: !!(body?.fromMe || body?.message?.fromMe), msgId: body?.id || '', timestamp: body?.timestamp || 0 };
}

function cleanPhone(raw) {
  return raw.replace('@s.whatsapp.net', '').replace('@c.us', '').replace(/\D/g, '');
}
