// src/pages/api/webhook/whatsapp.js
// Recibe mensajes de WAGO/WAHA.
// - Números autorizados (wa_authorized) → motor de comandos privados
// - Resto → chatbot BotGO de clientes
export const prerender = false;

import { createHmac, timingSafeEqual } from 'node:crypto';

// Comparación en tiempo constante — evita timing attacks al verificar firmas.
function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

// Rechaza webhooks con timestamp fuera de ±5 min (anti-replay).
const MAX_SKEW_SEC = 300;
function freshTimestamp(ts) {
  const n = Number(ts);
  if (!Number.isFinite(n) || n <= 0) return false;
  // acepta segundos o milisegundos
  const sec = n > 1e12 ? Math.floor(n / 1000) : n;
  const now = Math.floor(Date.now() / 1000);
  return Math.abs(now - sec) <= MAX_SKEW_SEC;
}
import { existsSync, readFileSync } from 'node:fs';
import { join }       from 'node:path';
import { saveWAIncoming, updateWAIncomingReply, getWAAuthorizedByPhone, getWagoConfig } from '../../../lib/analytics-db.js';
import { sendWAText, generateReportPDF, uploadPDFToCloudinary, sendTyping } from '../../../lib/notify.js';
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
  // WAHA (motor directo) no firma con HMAC. Si está configurado WAHA_URL,
  // confiamos en el origen (red local Docker→host) y saltamos verificación.
  const usingWaha = !!(process.env.WAHA_URL || import.meta.env?.WAHA_URL);
  let body;

  // WAGO y WAHooks usan el mismo esquema: sha256=HMAC(secret, "${timestamp}.${rawBody}")
  const wagoSig  = request.headers.get('x-wago-signature') || request.headers.get('x-wahooks-signature');
  const wahaHmac = request.headers.get('x-webhook-hmac');

  if (secret && wagoSig) {
    const wagoTs = request.headers.get('x-wago-timestamp') || request.headers.get('x-wahooks-timestamp') || '';
    // Anti-replay: exige timestamp fresco (la firma incluye el timestamp).
    if (!freshTimestamp(wagoTs)) return new Response('Unauthorized', { status: 401 });

    let rawText;
    try { rawText = await request.text(); }
    catch { return new Response('Bad Request', { status: 400 }); }

    const expected = 'sha256=' + createHmac('sha256', secret)
      .update(`${wagoTs}.${rawText}`)
      .digest('hex');

    if (!safeEqual(wagoSig, expected)) return new Response('Unauthorized', { status: 401 });

    try { body = JSON.parse(rawText); }
    catch { return new Response('Bad Request', { status: 400 }); }
  } else if (secret && wahaHmac) {
    // WAHA HMAC: x-webhook-hmac = HMAC(key, rawBody) en hex.
    // Algoritmo en x-webhook-hmac-algorithm (default sha512).
    const algo = (request.headers.get('x-webhook-hmac-algorithm') || 'sha512').toLowerCase();
    if (!['sha256', 'sha512'].includes(algo)) return new Response('Unauthorized', { status: 401 });

    let rawText;
    try { rawText = await request.text(); }
    catch { return new Response('Bad Request', { status: 400 }); }

    const expected = createHmac(algo, secret).update(rawText).digest('hex');
    if (!safeEqual(wahaHmac, expected)) return new Response('Unauthorized', { status: 401 });

    try { body = JSON.parse(rawText); }
    catch { return new Response('Bad Request', { status: 400 }); }
  } else if (secret && !usingWaha) {
    // Fallback: header simple. Igualdad exacta en tiempo constante (no .includes — evita bypass).
    const hdr = request.headers.get('x-webhook-secret')
             || (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
    if (!safeEqual(hdr, secret)) return new Response('Unauthorized', { status: 401 });
    try { body = await request.json(); }
    catch { return new Response('Bad Request', { status: 400 }); }
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

  // Comportamiento humano: mostrar "escribiendo…" mientras procesa
  sendTyping(msg.chatId || msg.phone, true).catch(() => {});

  // Verificar si es número autorizado
  const authorized = await getWAAuthorizedByPhone(msg.phone).catch(() => null);

  let replyText = null;
  let replyPdfData = null;
  let replyReportRequest = null;

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
        replyText          = result.text          || null;
        replyPdfData       = result.pdfData       || null;
        replyReportRequest = result.reportRequest || null;
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

  // Detener "escribiendo…" antes de enviar la respuesta
  sendTyping(msg.chatId || msg.phone, false).catch(() => {});

  // Enviar respuesta de texto
  if (replyText) {
    // Guardar reply en DB PRIMERO, independiente del envío
    if (savedId) await updateWAIncomingReply(savedId, replyText).catch(() => {});
    try {
      await sendWAText(msg.chatId || msg.phone, replyText);
    } catch (e) { console.error('[webhook/wa] Send error:', e.message); }
  }

  // ── Reporte ejecutivo COMPLETO (mismo PDF del panel) ────────────────────────
  // Se genera vía /api/reports/send-now (buildReportHTML + Puppeteer), se sube a
  // Cloudinary y se comparte el link. Filtra por el periodo que pidió el usuario.
  if (replyReportRequest && authorized) {
    try {
      const host     = request.headers.get('host') || 'localhost:4321';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      let   origin   = process.env.PUBLIC_SITE_URL || `${protocol}://${host}`;
      // Self-call robusto: si el host trae puerto (dev/local, incl. host.docker.internal
      // que el proceso node del host NO resuelve), usar loopback al mismo puerto.
      const portMatch = host.match(/:(\d+)$/);
      if (portMatch && !process.env.PUBLIC_SITE_URL) origin = `http://127.0.0.1:${portMatch[1]}`;
      const secret   = process.env.CRON_SECRET_EXTERNAL || import.meta.env?.CRON_SECRET_EXTERNAL || '';

      const r = await fetch(`${origin}/api/reports/send-now`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'x-cron-secret': secret },
        body:    JSON.stringify({ ...replyReportRequest, deliver: 'cloudinary', phones: [] }),
      });
      const d = await r.json();
      if (d.ok && d.url) {
        await sendWAText(msg.chatId || msg.phone, `Tu reporte en PDF:\n${d.url}`);
      } else {
        throw new Error(d.error || 'send-now sin url');
      }
    } catch (e) {
      console.error('[webhook/wa] Reporte error:', e.message);
      await sendWAText(msg.chatId || msg.phone, `No pude generar el PDF.\nDetalle: ${e.message}`).catch(() => {});
    }
  }

  // Fallback simple (comando rígido sin IA): genera PDF compacto con pdf-lib → Cloudinary.
  // Si el PDF/upload falla → reporte como texto.
  else if (replyPdfData && authorized) {
    try {
      const logoBase64 = getLogoBase64();
      const { buffer, filename } = await generateReportPDF(replyPdfData, logoBase64);
      const url = await uploadPDFToCloudinary(buffer, filename);
      await sendWAText(msg.chatId || msg.phone, `*${replyPdfData.titulo || 'Reporte'}* en PDF:\n${url}`);
    } catch (e) {
      console.error('[webhook/wa] PDF error:', e.message, '— enviando reporte como texto');
      try {
        const p = replyPdfData;
        const lines = [
          `*${p.titulo || 'Reporte'}*`,
          p.periodo ? `_${p.periodo}_` : null,
          '',
          ...(p.stats || []).map(s => `- ${s.label}: *${s.value}*`),
        ];
        if (p.extra)  lines.push('', p.extra);
        if (p.extra2) lines.push('', p.extra2);
        await sendWAText(msg.chatId || msg.phone, lines.filter(l => l !== null).join('\n'));
      } catch (e2) { console.error('[webhook/wa] Fallback texto error:', e2.message); }
    }
  }

  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}

// ── Parsear distintos formatos de webhook ─────────────────────────────────────
function parseIncoming(body) {
  const evt = body?.event || body?.eventType || '';

  // WAGA normalizado: { event:'message', payload:{ key:{remoteJid,fromMe}, message:{conversation} } }
  // Formato Evolution API reescrito por WAGO events.controller
  if ((evt === 'message' || evt === 'message.received' || evt === 'MESSAGES_UPSERT') && body?.payload) {
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
    // WhatsApp NOWEB usa @lid (Linked ID) en vez del número real.
    // El número telefónico real viene en _data.key.remoteJidAlt.
    const fromRaw = p.from || '';
    const realJid = p._data?.key?.remoteJidAlt || '';
    // phone = número real para identificar admins; chatId = @lid para responder
    const phone = cleanPhone(realJid || fromRaw);
    return {
      phone,
      chatId: fromRaw || realJid,     // responder al @lid original
      body: String(text), fromMe: !!p.fromMe, msgId: p.id || '', timestamp: p.timestamp || 0,
    };
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
