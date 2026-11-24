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
import { claimWAIncoming, resetWAReply, updateWAIncomingReply, getWAAuthorizedByPhone, getWagoConfig, getConfig, setConfig, countRecentBotReplies, getRecentWAHistory, stageWACv, logSystemEvent } from '../../../lib/analytics-db.js';
import { parseCatalogIntent, validateCatalogChange } from '../../../lib/wa-catalog-parser.js';
import { applyCatalogChange } from '../../../lib/wa-catalog-sync.js';
import { handleCatalogCommand } from '../../../lib/wa-catalog-handler.js';
import { sendWAText, sendWAPDF, generateReportPDF, sendTyping, transcribeAudio } from '../../../lib/notify.js';
import { ejecutarComando } from '../../../lib/wa-commands.js';
import { ejecutarAsistente } from '../../../lib/wa-assistant.js';

function getLogoBase64() {
  try {
    const p = join(process.cwd(), 'public/images/logo/logoN.png');
    if (!existsSync(p)) return null;
    return `data:image/png;base64,${readFileSync(p).toString('base64')}`;
  } catch { return null; }
}

// ── Pausa del bot por número (handoff humano + anti-loop bot-contra-bot) ─────
// Reutiliza global_config (key/value) con una key por telefono — sin tocar esquema.
const HUMAN_PAUSE_MS = 30 * 60 * 1000; // 30 min: tiempo que el bot calla si un humano ya respondió a mano
const FLOOD_WINDOW_MIN  = 3;  // ventana para contar auto-respuestas seguidas a un mismo numero
const FLOOD_MAX_REPLIES = 6;  // mas de esto en la ventana = probable loop con otro bot

function pauseKey(phone) {
  return `wa_pause_${String(phone || '').replace(/[^a-zA-Z0-9]/g, '')}`;
}

// Marca el número como "en pausa" (humano atendiendo o loop detectado) por HUMAN_PAUSE_MS.
async function pauseBotFor(phone) {
  if (!phone) return;
  try { await setConfig(pauseKey(phone), String(Date.now() + HUMAN_PAUSE_MS)); } catch {}
}

// true si el número sigue dentro de la ventana de pausa.
async function isBotPausedFor(phone) {
  if (!phone) return false;
  try {
    const until = Number(await getConfig(pauseKey(phone))) || 0;
    return until > Date.now();
  } catch { return false; }
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
  if (msg?.fromMe) {
    // El dueño/admin contestó a mano desde la app de WhatsApp: pausamos el bot
    // para este número un rato, para que no responda encima del humano.
    pauseBotFor(msg.phone).catch(() => {});
  }
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
  if (msg?.fromMe) pauseBotFor(msg.phone).catch(() => {});
  if (!msg || msg.fromMe) return 'ignored';

  // Nota de voz: transcribir a texto y continuar como si fuera un mensaje escrito.
  if (!msg.body && msg.isAudio && msg.mediaUrl) {
    const transcript = await transcribeAudio(msg.mediaUrl, msg.mediaMime).catch(() => '');
    if (transcript) msg.body = transcript;
  }

  // CV adjunto por WhatsApp (PDF/imagen mandado como documento, con o sin caption).
  // Se descarga y se deja "en espera" por teléfono — cuando el PASO 9 guarde el
  // registro (chat.js), lo recoge y lo adjunta, igual que ya pasa en el flujo web.
  if (msg.isDocument && (msg.mediaUrl || msg.mediaBase64)) {
    try {
      const MAX_CV_BYTES = 6 * 1024 * 1024; // mismo límite que el resto del sitio
      let buf = null;
      if (msg.mediaBase64) {
        buf = Buffer.from(msg.mediaBase64, 'base64');
      } else {
        const cvRes = await fetch(msg.mediaUrl);
        if (cvRes.ok) buf = Buffer.from(await cvRes.arrayBuffer());
      }
      if (buf && buf.length > 0 && buf.length <= MAX_CV_BYTES) {
        await stageWACv(msg.phone, {
          cvBase64: buf.toString('base64'),
          cvTipo:   msg.mediaMime || 'application/octet-stream',
          cvNombre: msg.mediaFileName || msg.docCaption || `cv_whatsapp_${msg.phone}.pdf`,
        }).catch(() => {});
      }
    } catch (e) { console.error('[webhook/wa] CV download error:', e.message); }

    // Si lo mandó sin caption de texto, confirmamos recepción aquí mismo (no lo
    // dejamos "ignorado" en silencio) y seguimos esperando el resto del flujo.
    if (!msg.body) {
      const claimCV = await claimWAIncoming({ phone: msg.phone, body: '[cv-adjunto]', msgId: msg.msgId })
        .catch(() => ({ id: null, claimed: false }));
      if (!claimCV.claimed) return 'busy-or-done';
      const ack = 'Recibí tu CV, gracias 📎 En un momento seguimos con tu registro.';
      try {
        await sendWAText(msg.phone || msg.chatId, ack);
        if (claimCV.id) await updateWAIncomingReply(claimCV.id, ack).catch(() => {});
      } catch (e) { console.error('[webhook/wa] CV ack error:', e.message); }
      return 'cv-staged';
    }
  }

  // Sticker / reacción / imagen-video sin texto / etc. — no se calla: se avisa que
  // solo entendemos texto o notas de voz, para que la conversación no "se pierda".
  if (!msg.body && msg.isUnsupported) {
    const claimUn = await claimWAIncoming({ phone: msg.phone, body: '[no-texto]', msgId: msg.msgId })
      .catch(() => ({ id: null, claimed: false }));
    if (!claimUn.claimed) return 'busy-or-done';
    const friendly = 'Por aquí solo puedo leer texto o notas de voz 🙂 ¿me escribes lo que necesitas?';
    try {
      await sendWAText(msg.phone || msg.chatId, friendly);
      if (claimUn.id) await updateWAIncomingReply(claimUn.id, friendly).catch(() => {});
      return 'sent-fallback-unsupported';
    } catch (e) {
      console.error('[webhook/wa] Fallback no-texto error:', e.message);
      if (claimUn.id) await resetWAReply(claimUn.id).catch(() => {});
      return 'send-failed';
    }
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

    // ── Catálogos: edición remota vía WhatsApp ────────────────────────────────
    const hasPermCatalog = Array.isArray(authorized?.permissions)
      ? (authorized.permissions.includes('*') || authorized.permissions.includes('catalogo_write'))
      : false;
    console.log('[webhook/catalog] phone:', msg.phone, 'hasPerm:', hasPermCatalog, 'perms:', JSON.stringify(authorized?.permissions));
    if (hasPermCatalog) {
      try {
        const catalogResult = await handleCatalogCommand(msg.phone, msg.body);
        console.log('[webhook/catalog] result:', catalogResult?.action, !!catalogResult?.message);
        if (catalogResult?.message) {
          replyText = catalogResult.message;
        }
      } catch (e) {
        console.error('[webhook/catalog] ERROR:', e.message, e.stack);
      }
    }

    // ── Asistente IA (cerebro) para números autorizados ──────────────────────
    // Solo corre si catálogos no manejaron el mensaje
    if (!replyText) try {
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
    // Pausa global: si esta activada, el bot NO responde a numeros del publico
    // (no autorizados). El mensaje igual queda registrado para verlo en el panel.
    const pausado = await getConfig('bot_general_paused').catch(() => null);
    const pausadoPorNumero = await isBotPausedFor(msg.phone).catch(() => false);
    if (pausado === '1' || pausado === 1 || pausado === true) {
      console.log('[webhook/wa] Automatizacion pausada — no se responde a', msg.phone);
    } else if (pausadoPorNumero) {
      console.log('[webhook/wa] Numero en pausa (humano atendiendo o loop detectado) — no se responde a', msg.phone);
    } else {
      // Anti-loop: si le respondimos demasiadas veces seguidas a este numero en
      // poco tiempo, probablemente del otro lado tambien hay un bot auto-respondiendo
      // (ping-pong infinito). Nos detenemos y pausamos el numero para revision manual.
      const recientes = await countRecentBotReplies(msg.phone, FLOOD_WINDOW_MIN).catch(() => 0);
      if (recientes >= FLOOD_MAX_REPLIES) {
        console.log('[webhook/wa] Posible loop bot-contra-bot con', msg.phone, `(${recientes} respuestas en ${FLOOD_WINDOW_MIN} min) — pausando`);
        await pauseBotFor(msg.phone);
        logSystemEvent({
          level: 'warn', category: 'whatsapp', source: 'webhook/flood',
          message: `Posible loop de bot con ${msg.phone}: ${recientes} auto-respuestas en ${FLOOD_WINDOW_MIN} min. Se pausó el número.`,
        }).catch(() => {});
      } else {
        try {
          // Reconstruye el historial real de la conversación (WhatsApp solo manda el
          // último mensaje por request) para que el bot NO pierda el flujo de
          // reclutamiento ni el contexto de producto entre un mensaje y el siguiente.
          const historial = await getRecentWAHistory(msg.phone, 12).catch(() => []);
          const chatRes = await fetch(`${origin}/api/chat`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages:  [...historial, { role: 'user', content: msg.body }],
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
    }
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
  // Se genera vía /api/reports/send-now (mismo HTML del dashboard, render Chromium)
  // y se ENVÍA EL PDF COMO ARCHIVO directo por WhatsApp (base64). SIN Cloudinary.
  if (replyReportRequest && authorized) {
    try {
      const secret   = process.env.CRON_SECRET_EXTERNAL || import.meta.env?.CRON_SECRET_EXTERNAL || '';

      // send-now genera el PDF y lo manda como documento (base64) a este número.
      const r = await fetch(`${origin}/api/reports/send-now`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'x-cron-secret': secret },
        body:    JSON.stringify({ ...replyReportRequest, phones: [msg.phone || msg.chatId] }),
      });
      const d = await r.json();
      const enviado = d.ok && Array.isArray(d.results) && d.results.some(x => x.ok);
      if (!enviado) {
        throw new Error(d.error || d.results?.find(x => !x.ok)?.error || 'no se pudo enviar el PDF');
      }
    } catch (e) {
      console.error('[webhook/wa] Reporte error:', e.message);
      logSystemEvent({ level: 'error', category: 'reportes', source: 'webhook/reporte', message: `Fallo al generar/enviar reporte PDF: ${e.message}` }).catch(() => {});
      await sendWAText(msg.phone || msg.chatId, `No pude generar el PDF.\nDetalle: ${e.message}`).catch(() => {});
    }
  }

  // Fallback simple (comando rígido sin IA): genera PDF compacto con pdf-lib y lo
  // manda directo por WhatsApp (base64). SIN Cloudinary. Si falla → reporte como texto.
  else if (replyPdfData && authorized) {
    try {
      const logoBase64 = getLogoBase64();
      const { buffer, filename } = await generateReportPDF(replyPdfData, logoBase64);
      let docOk = false;
      for (let i = 0; i < 3 && !docOk; i++) {
        try { await sendWAPDF(msg.phone || msg.chatId, buffer, filename); docOk = true; }
        catch (e) { console.error(`[webhook/wa] sendWAPDF(pdfData) intento ${i + 1}:`, e.message); }
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

  if (has('catalogo_write') || has('*')) {
    L.push('');
    L.push('*CATÁLOGOS DIGITALES*');
    L.push('- "editar rafia, cambiar descripcion"');
    L.push('- "modificar cuerda titulo"');
    L.push('- Catálogos: rafia, cuerda, arpilla, bolsa, saco, stretch, flexible, esquinero, naturizable, acolchado');
    L.push('- _Muestra valor actual → pide nuevo texto → confirma antes de guardar_');
  }

  if (has('vacantes_write') || has('candidates_write') || has('distribuidores_write')) {
    L.push('');
    L.push('*ACCIONES (modifican la pagina)*');
    if (has('vacantes_write')) {
      L.push('- *Vacantes:* "crea una vacante de operador", "publica la vacante X", "cierra la vacante X", "borra la vacante X"');
      L.push('- *Beneficios:* "cambia los beneficios de vacantes"');
      L.push('- *Push:* "avisa a todos que hay vacante nueva" (notificacion masiva)');
    }
    if (has('candidates_write'))     L.push('- *Candidatos:* "marca a Juan como contactado"');
    if (has('distribuidores_write')) L.push('- *Distribuidores:* "marca a David como revisado"');
    L.push('_Publicar, borrar y push piden tu confirmacion._');
  }

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
    // Nota: verificado contra el codigo fuente real de WAHA (que es lo que WAHooks
    // hospeda — wahooks.com, confirmado "Usage based hosted WAHA" en su repo) que
    // los webhooks de "message" NUNCA traen `key.remoteJid` — ese shape es de
    // Baileys/Evolution crudo, de un proveedor anterior. Esta rama casi seguro no
    // se activa con el proveedor actual; se deja como fallback defensivo simple.
    if (p?.key?.remoteJid) {
      const fromMe = !!p.key.fromMe;
      const text   = p.message?.conversation
                  || p.message?.extendedTextMessage?.text
                  || p.body || p.text || '';
      if (!text) {
        // Sticker, reacción, imagen/video/ubicación/contacto/encuesta sin texto, etc.
        // Antes esto se descartaba en silencio (return null) — el usuario lo vivía
        // como "el bot se perdió". Si SÍ hay un mensaje reconocible (solo no es texto),
        // se deja pasar marcado isUnsupported para que el bot avise en vez de callar.
        if (!p.message || !Object.keys(p.message).length) return null;
        // Nota: antes se descartaba aqui mismo si fromMe (return null). Ahora se deja
        // pasar con fromMe:true para que el caller pueda detectar que un humano
        // respondio manualmente y pausar el bot para este numero.
        return { phone: cleanPhone(p.key.remoteJid), body: '', fromMe, msgId: p.key.id || '', timestamp: p.messageTimestamp || 0, isUnsupported: true };
      }
      return { phone: cleanPhone(p.key.remoteJid), body: String(text), fromMe, msgId: p.key.id || '', timestamp: p.messageTimestamp || 0 };
    }

    // WAHA formato original (payload.from, payload.body, payload.media{url,filename,mimetype})
    // — ESTE es el shape real que WAHooks/WAHA entrega para un evento "message"
    // (confirmado contra gateway/WAHA-SHAPES.md del repo de WAHooks: campo plano
    // `from`/`body`/`hasMedia`/`media`, sin "type" — por eso la detección de
    // audio/documento se basa en el mimetype, no en un campo `type` que no existe).
    const text = p.body || p.text || '';
    const mime = p.media?.mimetype || p._data?.message?.audioMessage?.mimetype || p._data?.message?.documentMessage?.mimetype || '';
    const isAudio = (String(p.type || '').match(/audio|ptt|voice/i) || /audio/i.test(mime)) && !p.fromMe;
    // Documento, o foto/imagen que bien puede ser una foto del CV (se excluye webp: es el formato de los stickers).
    const isDoc   = (String(p.type || '').match(/document/i) || /application|pdf|msword|officedocument/i.test(mime) || /^image\/(jpe?g|png)/i.test(mime)) && !p.fromMe;
    const mediaUrl = p.media?.url || p._data?.message?.documentMessage?.url || p._data?.message?.audioMessage?.url || '';
    // docCaption = texto/caption del mensaje (sigue siendo la conversación con el bot).
    // mediaFileName = nombre REAL del archivo (WAHA lo entrega en media.filename) —
    // separado del caption para no pisar la respuesta del usuario con el nombre del PDF.
    const docCaption    = String(p._data?.message?.documentMessage?.caption || p._data?.message?.imageMessage?.caption || text || '');
    const mediaFileName = p.media?.filename || '';
    // WhatsApp NOWEB usa @lid (Linked ID) en vez del número real.
    // El número telefónico real viene en _data.key.remoteJidAlt.
    const fromRaw = p.from || '';
    const realJid = p._data?.key?.remoteJidAlt || '';
    // phone = número real para identificar admins; chatId = @lid para responder
    const phone = cleanPhone(realJid || fromRaw);
    if (!text && !isAudio && !isDoc) {
      // Sticker/reacción/imagen sin caption/etc. — igual que arriba, no se calla si
      // hay algo reconocible del mensaje (tipo, media o payload crudo).
      if (!p.type && !p.media && !p._data?.message) return null;
      return { phone, chatId: fromRaw || realJid, body: '', fromMe: !!p.fromMe, msgId: p.id || '', timestamp: p.timestamp || 0, isUnsupported: true };
    }
    return {
      phone,
      chatId: fromRaw || realJid,     // responder al @lid original
      body: String(isDoc ? docCaption : text), fromMe: !!p.fromMe, msgId: p.id || '', timestamp: p.timestamp || 0,
      isAudio: !!isAudio, isDocument: !!isDoc, mediaUrl, mediaMime: mime, docCaption, mediaFileName,
    };
  }

  // Genérico / WAGO directo
  const from = body?.from || body?.sender || body?.message?.from;
  const text = body?.body || body?.text || body?.message?.body || body?.message?.text || '';
  const isDoc = (body?.message?.documentMessage || body?.document) && !body?.fromMe;
  const mediaUrl = body?.message?.documentMessage?.url || body?.media?.url || '';
  const docCaption = body?.message?.documentMessage?.caption || '';
  if (!from) return null;
  if (!text && !isDoc) {
    if (!body?.message) return null;
    return { phone: cleanPhone(String(from)), body: '', fromMe: !!(body?.fromMe || body?.message?.fromMe), msgId: body?.id || '', timestamp: body?.timestamp || 0, isUnsupported: true };
  }
  return { phone: cleanPhone(String(from)), body: String(isDoc ? docCaption || text : text), fromMe: !!(body?.fromMe || body?.message?.fromMe), msgId: body?.id || '', timestamp: body?.timestamp || 0,
    isDocument: !!isDoc, mediaUrl, mediaMime: body?.message?.documentMessage?.mimetype || '', docCaption };
}

export function cleanPhone(raw) {
  return raw.replace('@s.whatsapp.net', '').replace('@c.us', '').replace(/\D/g, '');
}
