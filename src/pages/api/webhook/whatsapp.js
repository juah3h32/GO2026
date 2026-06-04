/*!
 * GO2026 — Sitio Web Oficial de Grupo Ortiz
 * Copyright (c) 2026 JUAN PABLO CORONA CORONA — Desarrollador Web.
 * Todos los derechos reservados. Licencia propietaria (ver LICENSE).
 * Prohibida su copia, modificacion o distribucion sin autorizacion escrita.
 */
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
import { claimWAIncoming, resetWAReply, updateWAIncomingReply, getWAAuthorizedByPhone, getWagoConfig, logSystemEvent } from '../../../lib/analytics-db.js';
import { sendWAText, sendWADocument, generateReportPDF, uploadPDFToCloudinary, sendTyping, transcribeAudio } from '../../../lib/notify.js';
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

  const host     = request.headers.get('host') || 'localhost:4321';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  let   origin   = process.env.PUBLIC_SITE_URL || `${protocol}://${host}`;
  const portMatch = host.match(/:(\d+)$/);
  if (portMatch && !process.env.PUBLIC_SITE_URL) origin = `http://127.0.0.1:${portMatch[1]}`;

  await handleIncomingMessage(msg, origin);
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}

// ── Procesa un mensaje entrante: guarda, responde (IA/chatbot), envía, reportes ──
// Reutilizado por el webhook (push) y por wa-poll (pull, fallback si WAHooks no entrega).
// Dedup INTELIGENTE: salta solo si el mensaje YA tiene respuesta. Si quedó sin
// responder (fallo/timeout previo), lo reintenta — así no se pierde ninguna respuesta.
// Devuelve un string de estado para diagnóstico.
export async function handleIncomingMessage(msg, origin) {
  if (!msg || msg.fromMe) return 'ignored';

  // Nota de voz: transcribir a texto y continuar como si fuera un mensaje escrito.
  if (!msg.body && msg.isAudio && msg.mediaUrl) {
    const transcript = await transcribeAudio(msg.mediaUrl, msg.mediaMime).catch(() => '');
    if (transcript) msg.body = transcript;
  }
  if (!msg.body) return 'ignored';

  // CLAIM ATÓMICO: solo UN proceso responde cada mensaje. Si otro poll/cron ya lo
  // tiene (o ya respondió), salimos sin reenviar. Elimina respuestas duplicadas.
  const claim = await claimWAIncoming({ phone: msg.phone, body: msg.body, msgId: msg.msgId })
    .catch(() => ({ id: null, claimed: false }));
  if (!claim.claimed) return 'busy-or-done';
  const savedId = claim.id;

  // Comportamiento humano: mostrar "escribiendo…" mientras procesa
  sendTyping(msg.phone || msg.chatId, true).catch(() => {});

  // Verificar si es número autorizado
  const authorized = await getWAAuthorizedByPhone(msg.phone).catch(() => null);

  let replyText = null;
  let replyPdfData = null;
  let replyReportRequest = null;

  if (authorized) {
    // ── Menu de funciones: directo, sin pasar por la IA ───────────────────────
    // "menu", "ayuda", "comandos", "que puedes hacer" → manual completo.
    const secretCmd = (process.env.WA_SECRET_COMMAND || '.jp').toLowerCase();
    const bodyNorm  = String(msg.body).trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/^[¿¡\s]+/, '');
    const esMenu    = bodyNorm === secretCmd
      || /^(menu|ayuda|help|comandos|funciones|opciones)[?!.]*$/.test(bodyNorm)
      || /^(que puedes hacer|que sabes hacer|que puedo pedirte|que haces)[?!.]*$/.test(bodyNorm);
    if (esMenu) {
      sendTyping(msg.phone || msg.chatId, false).catch(() => {});
      const manual = buildCapabilitiesManual(authorized);
      try {
        await sendWAText(msg.phone || msg.chatId, manual);
        if (savedId) await updateWAIncomingReply(savedId, manual).catch(() => {});
      } catch (e) { console.error('[webhook/wa] manual:', e.message); }
      return 'manual';
    }

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
  sendTyping(msg.phone || msg.chatId, false).catch(() => {});

  // Enviar respuesta de texto.
  // CLAVE: enviar PRIMERO y marcar en DB SOLO si el envío tuvo éxito. Si falla,
  // bot_reply queda vacío y el siguiente poll lo reintenta (no se pierde la respuesta).
  // No enviar mensajes vacíos / solo espacios (causaba "mensajes en blanco").
  if (replyText && !String(replyText).trim()) replyText = null;

  let sendStatus = 'no-reply';
  if (replyText) {
    try {
      await sendWAText(msg.phone || msg.chatId, replyText);
      sendStatus = 'sent';
      if (savedId) await updateWAIncomingReply(savedId, replyText).catch(() => {});
    } catch (e) {
      console.error('[webhook/wa] Send error:', e.message);
      sendStatus = `send-failed: ${e.message}`;
      logSystemEvent({ level: 'error', category: 'whatsapp', source: 'webhook/send', message: `Fallo al enviar respuesta WhatsApp: ${e.message}` }).catch(() => {});
      // Liberar el claim para reintentar en el siguiente poll.
      if (savedId) await resetWAReply(savedId).catch(() => {});
    }
  } else {
    // No se generó respuesta de texto y no hay reporte/PDF → liberar el claim.
    if (savedId && !replyReportRequest && !replyPdfData) await resetWAReply(savedId).catch(() => {});
  }

  // ── Reporte ejecutivo COMPLETO (mismo PDF del panel) ────────────────────────
  // Se genera vía /api/reports/send-now (mismo HTML del dashboard, render Chromium),
  // se sube a Cloudinary y se ENVÍA EL PDF COMO ARCHIVO (no link). Por periodo pedido.
  if (replyReportRequest && authorized) {
    try {
      const secret   = process.env.CRON_SECRET_EXTERNAL || import.meta.env?.CRON_SECRET_EXTERNAL || '';

      const r = await fetch(`${origin}/api/reports/send-now`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'x-cron-secret': secret },
        body:    JSON.stringify({ ...replyReportRequest, deliver: 'cloudinary', phones: [] }),
      });
      const d = await r.json();
      if (d.ok && d.url) {
        // SIEMPRE enviar el PDF como ARCHIVO adjunto (idéntico al export del dashboard).
        // NUNCA mandar el link. Reintenta hasta 3 veces si el envío de documento falla.
        const fname = d.filename || `Reporte_${replyReportRequest.report_type || ''}.pdf`;
        let docOk = false;
        for (let i = 0; i < 3 && !docOk; i++) {
          try { await sendWADocument(msg.phone || msg.chatId, d.url, fname); docOk = true; }
          catch (docErr) { console.error(`[webhook/wa] send-document intento ${i + 1}:`, docErr.message); }
        }
        if (!docOk) await sendWAText(msg.phone || msg.chatId, 'No pude enviar el PDF en este momento. Pídemelo de nuevo, por favor.');
      } else {
        throw new Error(d.error || 'send-now sin url');
      }
    } catch (e) {
      console.error('[webhook/wa] Reporte error:', e.message);
      logSystemEvent({ level: 'error', category: 'reportes', source: 'webhook/reporte', message: `Fallo al generar/enviar reporte PDF: ${e.message}` }).catch(() => {});
      await sendWAText(msg.phone || msg.chatId, `No pude generar el PDF.\nDetalle: ${e.message}`).catch(() => {});
    }
  }

  // Fallback simple (comando rígido sin IA): genera PDF compacto con pdf-lib → Cloudinary.
  // Si el PDF/upload falla → reporte como texto.
  else if (replyPdfData && authorized) {
    try {
      const logoBase64 = getLogoBase64();
      const { buffer, filename } = await generateReportPDF(replyPdfData, logoBase64);
      const url = await uploadPDFToCloudinary(buffer, filename);
      let docOk = false;
      for (let i = 0; i < 3 && !docOk; i++) {
        try { await sendWADocument(msg.phone || msg.chatId, url, filename, `*${replyPdfData.titulo || 'Reporte'}*`); docOk = true; }
        catch (e) { console.error(`[webhook/wa] send-document(pdfData) intento ${i + 1}:`, e.message); }
      }
      if (!docOk) await sendWAText(msg.phone || msg.chatId, 'No pude enviar el PDF. Pídemelo de nuevo, por favor.');
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
        await sendWAText(msg.phone || msg.chatId, lines.filter(l => l !== null).join('\n'));
      } catch (e2) { console.error('[webhook/wa] Fallback texto error:', e2.message); }
    }
  }

  return sendStatus;
}

// ── Manual de capacidades (comando secreto) ───────────────────────────────────
function buildCapabilitiesManual(authorized) {
  const perms = authorized?.permissions || [];
  const has = (p) => perms.includes('*') || perms.includes(p);
  const L = [];
  L.push('*BotGO — Asistente de Grupo Ortiz*');
  L.push(`Hola ${authorized?.name || ''}. Esto es lo que puedo hacer por ti:`);
  L.push('');

  L.push('*CONSULTAS (escríbeme natural)*');
  if (has('reports')) {
    L.push('- *Métricas:* "cómo va todo", "estadísticas de hoy", "panorama del mes"');
    L.push('- *Comparar:* "compara mayo con abril"');
    L.push('- *PDFs:* "qué pdf se envió más", "ranking de catálogos del mes"');
  }
  if (has('distribuidores')) L.push('- *Distribuidores:* "distribuidores de mayo", "últimos contactos"');
  if (has('candidates'))     L.push('- *Reclutamiento:* "candidatos de hoy", "qué vacante tiene más postulaciones"');
  if (has('candidates'))     L.push('- *Mercado laboral:* "busca en el mercado gerente de planta" — sueldos, vacantes similares y dónde hay candidatos');
  if (has('vacantes'))       L.push('- *Vacantes:* "qué vacantes hay abiertas"');
  if (has('messages'))       L.push('- *Consultas web:* "últimos mensajes de clientes"');

  L.push('');
  L.push('*REPORTES PDF (te llega el archivo)*');
  L.push('- "mándame el reporte resumen de mayo en pdf"');
  L.push('- "el comparativo de marzo a abril en pdf"');
  L.push('- Por mes, rango de fechas o todo el año al día de hoy');

  L.push('');
  L.push('*MONITOREO — ANALYTIC BOT JP (solo lectura)*');
  L.push('- "análisis del día" — revisa Web, Seguridad, Backend y Datos');
  L.push('- "revisa todas las páginas" — busca rutas o recursos rotos');
  L.push('- "¿cómo está el sistema?" — errores y eventos de seguridad');
  L.push('- "analiza la velocidad" — PageSpeed de Google: rendimiento, SEO y qué mejorar');
  L.push('- Te aviso solo si algo se rompe o hay riesgo de seguridad');

  L.push('');
  L.push('*OTROS*');
  L.push('- Entiendo *notas de voz* (las transcribo y respondo)');
  L.push('- Pregúntame "¿qué es GO?" para info de la empresa');
  L.push(`- Escribe *menu* o *${(process.env.WA_SECRET_COMMAND || '.jp')}* para ver este menú`);

  L.push('');
  L.push('_Solo números autorizados acceden a datos internos._');
  L.push('_Sistema desarrollado por Juan Pablo Corona Corona._');
  return L.join('\n');
}

// ── Parsear distintos formatos de webhook ─────────────────────────────────────
export function parseIncoming(body) {
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
    // Detección de nota de voz / audio (sin texto pero con media de audio).
    const mime = p.media?.mimetype || p._data?.message?.audioMessage?.mimetype || '';
    const isAudio = (String(p.type || '').match(/audio|ptt|voice/i) || /audio/i.test(mime)) && !p.fromMe;
    const mediaUrl = p.media?.url || '';
    if (!text && !isAudio) return null;
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
      isAudio: !!isAudio, mediaUrl, mediaMime: mime,
    };
  }

  // Genérico / WAGO directo
  const from = body?.from || body?.sender || body?.message?.from;
  const text = body?.body || body?.text || body?.message?.body || body?.message?.text;
  if (!from || !text) return null;
  return { phone: cleanPhone(String(from)), body: String(text), fromMe: !!(body?.fromMe || body?.message?.fromMe), msgId: body?.id || '', timestamp: body?.timestamp || 0 };
}

export function cleanPhone(raw) {
  return raw.replace('@s.whatsapp.net', '').replace('@c.us', '').replace(/\D/g, '');
}