// src/lib/notify.js
// Notificaciones WhatsApp para nuevos candidatos — mismo estilo blanco que los reportes
import { readCandidateNotifications, touchCandidateNotifLastSent, getWagoConfig } from './analytics-db.js';
import { existsSync, readFileSync } from 'fs';
import { join }     from 'path';
import { createHash } from 'crypto';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// ── Paleta idéntica a ReportGenerator.jsx ────────────────────────────────────
const ORANGE      = '#FB670B';
const BLACK       = '#262626';
const GRAY_D      = '#535353';
const CREAM       = '#ECEBE0';
const WHITE       = '#FFFFFF';
const GRAY_MID    = '#8A8A7A';
const GRAY_LIGHT  = '#C4C3B5';
const CREAM_DARK  = '#D8D6C5';
const BG          = '#F4F3EB';
const ORANGE_DARK = '#D4530A';

export const DEFAULT_CAPTION =
  'Hola {name}, nuevo candidato para *{puesto}*: *{candidato}*.\n\n' +
  'Te comparto el perfil en el archivo adjunto. Puedes agregar notas y actualizar su estatus desde el panel.';

// ── Logo desde el filesystem ──────────────────────────────────────────────────
function getLogoBase64() {
  try {
    const p = join(process.cwd(), 'public/images/logo/logoN.png');
    if (!existsSync(p)) return null;
    return `data:image/png;base64,${readFileSync(p).toString('base64')}`;
  } catch { return null; }
}

// ── Configuración de Chrome (mismo que send-now.js) ───────────────────────────
const LOCAL_CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];
async function getBrowserConfig() {
  const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (isServerless) {
    // chromium no disponible en este entorno
    throw new Error("PDF generation not available in production");
  }
  const fromEnv = process.env.CHROME_PATH;
  if (fromEnv && existsSync(fromEnv)) return { executablePath: fromEnv, args: ['--no-sandbox', '--disable-setuid-sandbox'] };
  for (const p of LOCAL_CHROME) {
    if (existsSync(p)) return { executablePath: p, args: ['--no-sandbox', '--disable-setuid-sandbox'] };
  }
  throw new Error('Chrome no encontrado. Define CHROME_PATH o instala Google Chrome.');
}

// ── Generar PDF con Puppeteer ─────────────────────────────────────────────────
async function generatePDF(html) {
  const { executablePath, args } = await getBrowserConfig();
  let puppeteer;
  try { puppeteer = (await import('puppeteer-core')).default; }
  catch { throw new Error('puppeteer-core no disponible en este entorno'); }
  let browser;
  try {
    browser = await puppeteer.launch({ executablePath, args, headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 1200, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle2', timeout: 45_000 });
    const pdf = await page.pdf({
      preferCSSPageSize: true, printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    return Buffer.from(pdf);
  } finally {
    await browser?.close();
  }
}

// ── HTML del perfil — paleta blanca igual que los reportes ───────────────────
function esc(s) {
  return String(s || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function buildCandidateProfileHTML(c, logoBase64) {
  const logoHtml = logoBase64
    ? `<img src="${logoBase64}" alt="Logo" style="width:36px;height:36px;object-fit:contain;">`
    : `<span style="font-family:'Barlow Condensed',Helvetica,sans-serif;font-size:22px;font-weight:900;color:${WHITE};letter-spacing:-0.05em;">GO</span>`;

  const estado = [c.estado || c.estado_rep, c.colonia].filter(Boolean).join(' / ') || '—';
  const nota   = c.comentarios || c.mensaje || '';
  const cvName = c.cvNombre || c.cv_nombre || '';

  const now = new Date().toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  // Campo con etiqueta + valor
  const field = (label, value, mono = false) => `
    <div style="display:flex;flex-direction:column;gap:3px;">
      <div style="font-family:'Barlow',Helvetica,sans-serif;font-size:7.5px;font-weight:700;
        letter-spacing:0.22em;text-transform:uppercase;color:${GRAY_LIGHT};">${esc(label)}</div>
      <div style="font-family:${mono ? "'Courier New',monospace" : "'Barlow',Helvetica,sans-serif"};
        font-size:13px;font-weight:600;color:${value ? BLACK : GRAY_LIGHT};
        font-style:${value ? 'normal' : 'italic'};">
        ${esc(value) || 'No proporcionado'}
      </div>
    </div>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Perfil · ${esc(c.nombre)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700;800&family=Barlow+Condensed:wght@700;800;900&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    @page{size:A4;margin:0}
    body{
      font-family:'Barlow',Helvetica,sans-serif;
      background:${BG};
      min-height:100vh;
      padding:32px;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div style="background:linear-gradient(135deg,${ORANGE} 0%,${ORANGE_DARK} 100%);
    border-radius:16px;padding:26px 28px;display:flex;align-items:center;
    justify-content:space-between;gap:20px;margin-bottom:14px;
    box-shadow:0 4px 20px rgba(251,103,11,0.28);">
    <div style="display:flex;align-items:center;gap:16px;">
      <div style="width:52px;height:52px;background:rgba(255,255,255,0.18);
        border-radius:12px;display:flex;align-items:center;justify-content:center;
        flex-shrink:0;overflow:hidden;">
        ${logoHtml}
      </div>
      <div>
        <div style="font-family:'Barlow',Helvetica,sans-serif;font-size:8px;font-weight:700;
          letter-spacing:0.28em;text-transform:uppercase;color:rgba(255,255,255,0.65);
          margin-bottom:4px;">Nuevo Perfil de Candidato</div>
        <div style="font-family:'Barlow Condensed',Helvetica,sans-serif;font-size:32px;
          font-weight:800;color:${WHITE};letter-spacing:-0.02em;line-height:1;
          text-transform:uppercase;">${esc(c.nombre) || 'Sin nombre'}</div>
        <div style="font-family:'Barlow',Helvetica,sans-serif;font-size:13px;
          color:rgba(255,255,255,0.78);font-weight:500;margin-top:3px;">
          ${esc(c.puesto) || 'Puesto no especificado'}
        </div>
      </div>
    </div>
    <div style="background:rgba(255,255,255,0.16);border:1px solid rgba(255,255,255,0.24);
      border-radius:20px;padding:7px 16px;flex-shrink:0;">
      <div style="font-family:'Barlow',Helvetica,sans-serif;font-size:9px;font-weight:700;
        letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.85);">Nuevo</div>
    </div>
  </div>

  <!-- INFO PERSONAL -->
  <div style="background:${WHITE};border-radius:14px;border:1px solid ${CREAM_DARK};
    padding:22px 24px;margin-bottom:12px;box-shadow:0 1px 4px rgba(38,38,38,0.04);">
    <div style="font-family:'Barlow',Helvetica,sans-serif;font-size:8px;font-weight:700;
      letter-spacing:0.28em;text-transform:uppercase;color:${GRAY_LIGHT};
      margin-bottom:18px;padding-bottom:10px;border-bottom:1px solid ${CREAM};">
      Información del Candidato
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px 28px;">
      ${field('Edad',     c.edad)}
      ${field('Estado / Colonia', estado)}
      ${field('Correo electrónico', c.email, true)}
      ${field('Teléfono / WhatsApp', c.whatsapp || c.telefono, true)}
    </div>
  </div>

  ${cvName ? `
  <!-- CV -->
  <div style="background:${WHITE};border-radius:14px;border:1px solid ${CREAM_DARK};
    padding:18px 24px;margin-bottom:12px;display:flex;align-items:center;gap:16px;
    box-shadow:0 1px 4px rgba(38,38,38,0.04);">
    <div style="width:40px;height:40px;background:#F0FDF4;border:1px solid #BBF7D0;
      border-radius:10px;display:flex;align-items:center;justify-content:center;
      font-size:20px;flex-shrink:0;">📎</div>
    <div>
      <div style="font-family:'Barlow',Helvetica,sans-serif;font-size:8px;font-weight:700;
        letter-spacing:0.22em;text-transform:uppercase;color:${GRAY_LIGHT};margin-bottom:4px;">
        Currículum Vitae adjunto</div>
      <div style="font-family:'Barlow',Helvetica,sans-serif;font-size:13px;font-weight:600;
        color:${BLACK};">${esc(cvName)}</div>
      <div style="font-family:'Barlow',Helvetica,sans-serif;font-size:11px;color:#16A34A;
        font-weight:500;margin-top:2px;">Disponible en el sistema</div>
    </div>
  </div>` : ''}

  ${nota ? `
  <!-- NOTA -->
  <div style="background:${WHITE};border-radius:14px;border:1px solid ${CREAM_DARK};
    padding:18px 24px;margin-bottom:12px;box-shadow:0 1px 4px rgba(38,38,38,0.04);">
    <div style="font-family:'Barlow',Helvetica,sans-serif;font-size:8px;font-weight:700;
      letter-spacing:0.28em;text-transform:uppercase;color:${GRAY_LIGHT};margin-bottom:12px;">
      Nota del candidato</div>
    <div style="font-family:'Barlow',Helvetica,sans-serif;font-size:13px;color:${GRAY_D};
      line-height:1.7;white-space:pre-wrap;border-left:3px solid ${ORANGE};
      padding-left:14px;">${esc(nota)}</div>
  </div>` : ''}

  <!-- FOOTER -->
  <div style="display:flex;align-items:center;justify-content:space-between;
    padding:14px 4px 0;">
    <span style="font-family:'Barlow',Helvetica,sans-serif;font-size:8px;font-weight:600;
      letter-spacing:0.14em;text-transform:uppercase;color:${GRAY_LIGHT};">
      BotGO · Grupo Ortiz · Reclutamiento
    </span>
    <span style="font-family:'Barlow',Helvetica,sans-serif;font-size:8px;font-weight:600;
      color:${GRAY_LIGHT};">${esc(now)}</span>
  </div>

</body>
</html>`;
}

// ── Nombre de archivo PDF ─────────────────────────────────────────────────────
function buildFilename(nombre, puesto) {
  const safe = s => (s || '').replace(/[^a-zA-Z0-9À-ÿ]/g, '_').replace(/_+/g, '_').slice(0, 28);
  return `Perfil_${safe(nombre)}_${safe(puesto)}.pdf`;
}

// ── Hex → rgb() de pdf-lib ────────────────────────────────────────────────────
function hexRgb(h) {
  const n = parseInt(String(h).replace('#', ''), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

// Quita caracteres fuera de WinAnsi (emoji, CJK) que romperían pdf-lib.
function winAnsi(s) {
  return String(s || '').replace(/[^\x09\x0A\x0D\x20-\xFF]/g, '');
}

// Ajuste de texto a un ancho máximo, respetando saltos de línea existentes.
function wrapText(text, font, size, maxW) {
  const out = [];
  for (const raw of winAnsi(text).split('\n')) {
    const words = raw.split(' ');
    let line = '';
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (line && font.widthOfTextAtSize(test, size) > maxW) { out.push(line); line = w; }
      else line = test;
    }
    out.push(line);
  }
  return out;
}

// ── Generar PDF de reporte BotGO (pdf-lib, sin Chrome → corre en serverless) ──
export async function generateReportPDF(pdfData, logoBase64) {
  const { titulo, periodo, stats = [], extra = '', extra2 = '' } = pdfData;

  const now = new Date().toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City', day:'2-digit', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit',
  });

  const doc  = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const mono = await doc.embedFont(StandardFonts.Courier);

  const M = 40;
  let y = height - M;

  // ── Header naranja ──
  const headH = 88;
  page.drawRectangle({ x: M, y: y - headH, width: width - 2*M, height: headH, color: hexRgb(ORANGE) });

  let textX = M + 18;
  if (logoBase64 && logoBase64.startsWith('data:image/png')) {
    try {
      const img = await doc.embedPng(Buffer.from(logoBase64.split(',')[1], 'base64'));
      const s = 46;
      page.drawImage(img, { x: M + 18, y: y - headH/2 - s/2, width: s, height: s });
      textX = M + 18 + s + 14;
    } catch { /* sin logo */ }
  }

  page.drawText('BOTGO - GRUPO ORTIZ', { x: textX, y: y - 24, size: 7, font: bold, color: rgb(1,1,1) });
  page.drawText(winAnsi(titulo || 'Reporte').toUpperCase(), { x: textX, y: y - 48, size: 20, font: bold, color: rgb(1,1,1) });
  if (periodo) page.drawText(winAnsi(periodo), { x: textX, y: y - 66, size: 10, font, color: rgb(1,1,1) });
  const dw = font.widthOfTextAtSize(winAnsi(now), 8);
  page.drawText(winAnsi(now), { x: width - M - 14 - dw, y: y - 24, size: 8, font, color: rgb(1,1,1) });

  y -= headH + 26;

  // ── Tarjetas de métricas (grid hasta 3 columnas) ──
  const cols  = Math.min(stats.length || 1, 3);
  const gap   = 12;
  const cardW = (width - 2*M - gap*(cols-1)) / cols;
  const cardH = 60;
  stats.forEach((s, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const cx  = M + col*(cardW+gap);
    const cy  = y - row*(cardH+gap);
    page.drawRectangle({ x: cx, y: cy - cardH, width: cardW, height: cardH, color: hexRgb(CREAM), borderColor: hexRgb(CREAM_DARK), borderWidth: 1 });
    page.drawText(winAnsi(s.label).toUpperCase().slice(0,26), { x: cx + 12, y: cy - 21, size: 7, font: bold, color: hexRgb(GRAY_MID) });
    page.drawText(winAnsi(s.value).slice(0,18),               { x: cx + 12, y: cy - 46, size: 17, font: mono, color: hexRgb(BLACK) });
  });
  const rows = Math.ceil((stats.length || 0) / cols) || 0;
  y -= rows*(cardH+gap) + 14;

  // ── Bloques de texto extra ──
  const drawBlock = (title, body) => {
    if (!body) return;
    const lines  = wrapText(body, font, 11, width - 2*M - 28);
    const blockH = 32 + lines.length*15 + 10;
    page.drawRectangle({ x: M, y: y - blockH, width: width - 2*M, height: blockH, color: rgb(1,1,1), borderColor: hexRgb(CREAM_DARK), borderWidth: 1 });
    page.drawText(winAnsi(title).toUpperCase(), { x: M + 14, y: y - 20, size: 7, font: bold, color: hexRgb(GRAY_MID) });
    let ly = y - 38;
    for (const ln of lines) { page.drawText(ln, { x: M + 14, y: ly, size: 11, font, color: hexRgb(GRAY_D) }); ly -= 15; }
    y -= blockH + 12;
  };
  drawBlock('Productos top', extra);
  drawBlock('Busquedas frecuentes', extra2);

  // ── Footer ──
  page.drawText('BotGO - Grupo Ortiz - Reporte automatico', { x: M, y: M, size: 7, font, color: hexRgb(GRAY_LIGHT) });

  const bytes    = await doc.save();
  const safe     = s => (s||'').replace(/[^a-zA-Z0-9]/g,'_').slice(0,20);
  const filename = `Reporte_${safe(titulo)}.pdf`;
  return { buffer: Buffer.from(bytes), filename };
}

// ── Subir PDF a Cloudinary (raw) y devolver link directo ─────────────────────
// Alternativa al envío de documento por WAGO (función de pago).
// Requiere: PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.
export async function uploadPDFToCloudinary(buffer, filename) {
  const cloudName = process.env.PUBLIC_CLOUDINARY_CLOUD_NAME || import.meta.env?.PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey    = process.env.PUBLIC_CLOUDINARY_API_KEY    || import.meta.env?.PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET        || import.meta.env?.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) throw new Error('Cloudinary no configurado');

  const publicId  = (filename || 'reporte').replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60);
  const folder    = 'botgo-reportes';
  const timestamp = Math.floor(Date.now() / 1000);

  // Firma: params a firmar en orden alfabético (sin file/api_key/resource_type), + api_secret → SHA1
  const toSign    = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`;
  const signature = createHash('sha1').update(toSign + apiSecret).digest('hex');

  const form = new FormData();
  form.append('file', new Blob([buffer], { type: 'application/pdf' }), `${publicId}.pdf`);
  form.append('api_key',   apiKey);
  form.append('timestamp', String(timestamp));
  form.append('public_id', publicId);
  form.append('folder',    folder);
  form.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
    method: 'POST',
    body:   form,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cloudinary HTTP ${res.status}: ${body.slice(0, 160)}`);
  }
  const data = await res.json();
  return data.secure_url;
}

// ── Resolver credenciales WAGO: DB primero, .env como fallback ───────────────
async function resolveWagoCredentials() {
  try {
    const cfg = await getWagoConfig();
    if (cfg?.url && cfg?.token && cfg?.connectionId) return cfg;
  } catch { /* fallback a .env */ }
  const url          = process.env.WAGO_URL           || import.meta.env?.WAGO_URL;
  const token        = process.env.WAGO_TOKEN         || import.meta.env?.WAGO_TOKEN;
  const connectionId = process.env.WAGO_CONNECTION_ID || import.meta.env?.WAGO_CONNECTION_ID;
  const webhookSecret = process.env.WAGO_WEBHOOK_SECRET || import.meta.env?.WAGO_WEBHOOK_SECRET;
  if (!url || !token || !connectionId) return null;
  return { url, token, connectionId, webhookSecret };
}

// ── Normalizar número mexicano a JID de WhatsApp ─────────────────────────────
// Celulares MX en WhatsApp usan 521 + 10 dígitos. Acepta:
//   10 dígitos        → 521 + 10
//   52 + 10 (12 díg)  → 521 + 10
//   521 + 10 (13 díg) → tal cual
//   otros países      → tal cual
export function toWhatsAppJid(phone) {
  let n = String(phone).replace(/\D/g, '');
  if (n.length === 10) n = '521' + n;
  else if (n.length === 12 && n.startsWith('52') && !n.startsWith('521')) n = '521' + n.slice(2);
  return `${n}@s.whatsapp.net`;
}

// ── WAHA directo (motor NOWEB) — endpoint /api/sendText ──────────────────────
// Si WAHA_URL está definido, se usa WAHA en vez de WAGO/Evolution.
function wahaConfig() {
  const url = process.env.WAHA_URL || import.meta.env?.WAHA_URL;
  if (!url) return null;
  const apiKey  = process.env.WAHA_API_KEY  || import.meta.env?.WAHA_API_KEY  || 'devkey';
  const session = process.env.WAHA_SESSION  || import.meta.env?.WAHA_SESSION  || 'default';
  return { url, apiKey, session };
}

// WAHA usa chatId formato 521...@c.us — pero si ya viene un chatId completo
// (@c.us, @g.us o @lid), se usa tal cual para responder al remitente correcto.
function toWahaChatId(phone) {
  const s = String(phone);
  if (s.includes('@')) return s;  // ya es un chatId (incluye @lid de WhatsApp NOWEB)
  let n = s.replace(/\D/g, '');
  if (n.length === 10) n = '521' + n;
  else if (n.length === 12 && n.startsWith('52') && !n.startsWith('521')) n = '521' + n.slice(2);
  return `${n}@c.us`;
}

async function sendViaWaha(cfg, phone, message) {
  const res = await fetch(`${cfg.url}/api/sendText`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'X-Api-Key': cfg.apiKey },
    body:    JSON.stringify({ session: cfg.session, chatId: toWahaChatId(phone), text: message }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`WAHA texto HTTP ${res.status}: ${body.slice(0, 120)}`);
  }
}

// ── Indicador "escribiendo…" — el usuario ve que el asistente está trabajando ─
export async function sendTyping(phone, on = true) {
  const cfg = wahaConfig();
  if (!cfg) return; // solo WAHA soporta presencia de forma simple
  const chatId = toWahaChatId(phone);
  const endpoint = on ? 'startTyping' : 'stopTyping';
  try {
    await fetch(`${cfg.url}/api/${endpoint}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'X-Api-Key': cfg.apiKey },
      body:    JSON.stringify({ session: cfg.session, chatId }),
    });
  } catch { /* no crítico */ }
}

// ── Marcar mensaje como leído (visto azul) — comportamiento humano anti-spam ──
export async function sendSeen(phone, messageId) {
  const cfg = wahaConfig();
  if (!cfg) return;
  try {
    await fetch(`${cfg.url}/api/sendSeen`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'X-Api-Key': cfg.apiKey },
      body:    JSON.stringify({ session: cfg.session, chatId: toWahaChatId(phone), messageId }),
    });
  } catch { /* no crítico */ }
}

// ── Enviar mensaje de texto — WAHA directo o WAGO/Evolution ──────────────────
export async function sendWAText(phone, message) {
  const waha = wahaConfig();
  if (waha) return sendViaWaha(waha, phone, message);

  const creds = await resolveWagoCredentials();
  const { url, token, connectionId } = creds || {};
  if (!url || !token || !connectionId) throw new Error('WAGO no configurado');

  const chatId = toWhatsAppJid(phone);
  const res = await fetch(
    `${url}/api/connections/${connectionId}/send`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body:    JSON.stringify({ chatId, text: message }),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`WAGO texto HTTP ${res.status}: ${body.slice(0, 120)}`);
  }
}

// ── Enviar PDF — WAHA directo o WAGO/Evolution ───────────────────────────────
export async function sendWAPDF(phone, pdfBuffer, filename) {
  const waha = wahaConfig();
  if (waha) {
    const res = await fetch(`${waha.url}/api/sendFile`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'X-Api-Key': waha.apiKey },
      body:    JSON.stringify({
        session: waha.session, chatId: toWahaChatId(phone),
        file: { mimetype: 'application/pdf', filename, data: pdfBuffer.toString('base64') },
      }),
    });
    if (res.ok) return;
    // Fallback: aviso de texto
    await sendViaWaha(waha, phone, `Reporte PDF disponible: ${filename}`);
    return;
  }

  const creds = await resolveWagoCredentials();
  const { url, token, connectionId } = creds || {};
  if (!url || !token || !connectionId) throw new Error('WAGO no configurado');

  const chatId = toWhatsAppJid(phone);

  // Intenta enviar como documento
  const res = await fetch(
    `${url}/api/connections/${connectionId}/send-document`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body:    JSON.stringify({ chatId, data: pdfBuffer.toString('base64'), mimetype: 'application/pdf', filename }),
    }
  );
  if (res.ok) return;

  // Fallback: aviso de texto si send-document no es soportado
  console.warn(`[notify] send-document falló (${res.status}) — enviando aviso de texto`);
  const resTxt = await fetch(`${url}/api/connections/${connectionId}/send`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body:    JSON.stringify({ chatId, text: `📎 Perfil PDF disponible: ${filename}` }),
  });
  if (!resTxt.ok) {
    const body = await resTxt.text();
    throw new Error(`WAGO fallback HTTP ${resTxt.status}: ${body.slice(0, 120)}`);
  }
}

// ── Aplica variables al template de caption ───────────────────────────────────
function buildMessage(template, recipientName, candidato, puesto) {
  return (template || DEFAULT_CAPTION)
    .replace(/\{name\}/gi,      recipientName || '')
    .replace(/\{candidato\}/gi, candidato     || '')
    .replace(/\{puesto\}/gi,    puesto        || '');
}

// ── Notificar nuevo candidato — 1) mensaje personalizado  2) PDF ─────────────
export async function notifyNewVacante(candidate) {
  // Notificación automática a números autorizados con categoría 'rh'
  notifyCategoriaRH(candidate).catch(e => console.warn('notif categoría rh:', e.message));

  const configs = await readCandidateNotifications();
  const active  = configs.filter(c => c.active && c.phones?.length);
  if (active.length === 0) return { sent: 0, results: [] };

  // Generar PDF una sola vez
  const logoBase64 = getLogoBase64();
  const html       = buildCandidateProfileHTML(candidate, logoBase64);
  const filename   = buildFilename(candidate.nombre, candidate.puesto);

  let pdfBuffer;
  try {
    pdfBuffer = await generatePDF(html);
    console.log(`[notify] PDF listo: ${(pdfBuffer.length / 1024).toFixed(0)} KB`);
  } catch (pdfErr) {
    console.error('[notify] Error generando PDF:', pdfErr.message);
    throw pdfErr;
  }

  const results = [];

  for (const config of active) {
    for (const entry of config.phones) {
      const phone = typeof entry === 'string' ? entry : entry?.phone;
      const rName = typeof entry === 'string' ? '' : (entry?.name || '');
      if (!phone) continue;

      const message = buildMessage(config.caption_template, rName, candidate.nombre, candidate.puesto);

      try {
        // 1 — texto personalizado primero
        await sendWAText(phone, message);
        // 2 — PDF del perfil (mensaje separado, sin caption)
        await sendWAPDF(phone, pdfBuffer, filename);
        // 🔒 LOG SEGURO: no exponer teléfono real, usar hash
        const phoneHash = Buffer.from(phone).toString('base64').slice(0, 8);
        results.push({ config: config.name, phone: `****${phoneHash}`, name: rName, ok: true });
      } catch (err) {
        const phoneHash = Buffer.from(phone).toString('base64').slice(0, 8);
        console.error(`[notify] Error → ****${phoneHash}:`, err.message);
        results.push({ config: config.name, phone: `****${phoneHash}`, name: rName, ok: false, error: err.message });
      }
    }
    try { await touchCandidateNotifLastSent(config.id); } catch {}
  }

  const sent = results.filter(r => r.ok).length;
  console.log(`[notify] Enviadas: ${sent}/${results.length}`);
  return { sent, results };
}

// ── Prueba: perfil ficticio ────────────────────────────────────────────────────
export async function sendTestNotification(phones, captionTemplate, configId) {
  const testCandidate = {
    nombre:      'Juan Pérez (Prueba)',
    puesto:      'Operador de Producción',
    edad:        '28',
    estado_rep:  'Jalisco',
    colonia:     'Centro',
    email:       'jprueba@example.com',
    telefono:    '3312345678',
    cvNombre:    'CV_Juan_Perez.pdf',
    comentarios: 'Esta es una notificación de prueba del sistema BotGO.',
  };

  const logoBase64 = getLogoBase64();
  const html       = buildCandidateProfileHTML(testCandidate, logoBase64);
  const filename   = buildFilename(testCandidate.nombre, testCandidate.puesto);
  const pdfBuffer  = await generatePDF(html);

  const results = [];
  for (const entry of phones) {
    const phone = typeof entry === 'string' ? entry : entry?.phone;
    const rName = typeof entry === 'string' ? '' : (entry?.name || '');
    if (!phone) continue;

    const message = buildMessage(captionTemplate, rName, testCandidate.nombre, testCandidate.puesto);

    try {
      await sendWAText(phone, message);
      await sendWAPDF(phone, pdfBuffer, filename);
      results.push({ phone, name: rName, ok: true });
    } catch (err) {
      results.push({ phone, name: rName, ok: false, error: err.message });
    }
  }

  if (configId) {
    try { await touchCandidateNotifLastSent(configId); } catch {}
  }

  return results;
}

// ── Notificaciones automáticas por categoría ──────────────────────────────────
// Envía a todos los números autorizados con la categoría dada.
// Mensaje personalizado con el nombre de cada destinatario.
async function notifyCategoria(categoria, buildMsg) {
  let subs = [];
  try {
    const { getWAAuthorizedByCategory } = await import('./analytics-db.js');
    subs = await getWAAuthorizedByCategory(categoria);
  } catch (e) { console.error('[notify-cat] DB:', e.message); return { sent: 0 }; }
  if (!subs.length) return { sent: 0 };

  let sent = 0;
  for (let i = 0; i < subs.length; i++) {
    const s = subs[i];
    try {
      await sendWAText(s.phone, buildMsg(s.name || ''));
      sent++;
      // Anti-spam: delay aleatorio humano entre destinatarios (no ráfaga).
      // El primero sale inmediato; entre los siguientes 1.5-3.5s.
      if (i < subs.length - 1) {
        await new Promise(r => setTimeout(r, 1500 + Math.floor(Math.random() * 2000)));
      }
    } catch (e) { console.error(`[notify-cat:${categoria}] →${String(s.phone).slice(-4)}:`, e.message); }
  }
  console.log(`[notify-cat:${categoria}] enviadas ${sent}/${subs.length}`);
  return { sent };
}

// Nuevo candidato → categoría 'rh'
export async function notifyCategoriaRH(c) {
  return notifyCategoria('rh', (nombre) => {
    const saludo = nombre ? `*${nombre}*, hay` : 'Hay';
    return `${saludo} un nuevo registro de candidato, te lo comparto:\n\n` +
      `- Nombre: *${c.nombre || '—'}*\n` +
      `- Puesto: ${c.puesto || '—'}\n` +
      (c.edad ? `- Edad: ${c.edad}\n` : '') +
      ((c.estado_rep || c.estado) ? `- Estado: ${c.estado_rep || c.estado}${c.colonia ? ' / ' + c.colonia : ''}\n` : '') +
      (c.telefono || c.whatsapp ? `- Teléfono: ${c.telefono || c.whatsapp}\n` : '') +
      (c.email ? `- Email: ${c.email}\n` : '') +
      ((c.cvNombre || c.cv_nombre) ? `- CV: adjunto en el panel\n` : '') +
      `\nPuedes gestionarlo desde el panel de Reclutamiento.`;
  });
}

// Nuevo distribuidor → categoría 'clientes'
export async function notifyCategoriaClientes(l) {
  const producto = l.productos || l.producto || '';
  const prodTxt  = Array.isArray(producto) ? producto.join(', ') : producto;
  return notifyCategoria('clientes', (nombre) => {
    const saludo = nombre ? `*${nombre}*, hay` : 'Hay';
    return `${saludo} un nuevo registro de distribuidor, te comparto la info:\n\n` +
      `- Nombre: *${l.nombre || '—'}*\n` +
      (l.empresa ? `- Empresa: ${l.empresa}\n` : '') +
      (l.whatsapp ? `- WhatsApp: ${l.whatsapp}\n` : '') +
      (l.email ? `- Email: ${l.email}\n` : '') +
      // Producto de interés destacado — para enrutar al asesor correcto
      `- *Producto de interés: ${prodTxt || 'no especificado'}*\n` +
      (l.comentarios ? `- Comentario: ${String(l.comentarios).slice(0, 200)}\n` : '') +
      `\nCanaliza este contacto con el asesor del producto. Seguimiento en el panel de Distribuidores.`;
  });
}

// ── Notificar contacto en inglés al número de EE.UU. ─────────────────────────
// Se dispara cuando alguien escribe en inglés y realiza alguna acción clave.
export async function notifyEnglishLead({ nombre, telefono, email, interes, mensaje }) {
  const phone = (import.meta.env.ENGLISH_LEAD_PHONE || '+12104293789').replace(/[\s\-]/g, '');
  const lines = [
    `🇺🇸 *New English Contact — Grupo Ortiz*`,
    nombre   ? `👤 Name: ${nombre}`                          : null,
    telefono ? `📱 Phone: ${telefono}`                       : null,
    email    ? `📧 Email: ${email}`                          : null,
    interes  ? `🎯 Interested in: ${interes}`                : null,
    mensaje  ? `💬 Message: ${String(mensaje).slice(0, 300)}` : null,
  ].filter(Boolean).join('\n');
  try {
    await sendWAText(phone, lines);
    console.log('[notify-en] Alerta inglés enviada a', phone);
  } catch (err) {
    console.error('[notify-en] Error:', err.message);
  }
}

// ── Notificar candidatos en lista de espera cuando se publica una vacante ─────
// Envía WhatsApp directo al candidato (no al equipo RH)
export async function notifyEsperaVacante({ candidatos, vacante, urlVacantes = '' }) {
  const results = [];
  for (const c of candidatos) {
    const phone = (c.telefono || '').replace(/\D/g, '');
    if (!phone || phone.length < 8) {
      results.push({ id: c.id, nombre: c.nombre, ok: false, error: 'Sin teléfono' });
      continue;
    }
    const nombre   = c.nombre || 'Candidato';
    const puesto   = vacante.titulo || c.puesto || 'el puesto';
    const empresa  = vacante.empresa || 'Grupo Ortiz';
    const linkLine = urlVacantes ? `\n\nConsulta la vacante aquí: ${urlVacantes}` : '';
    const mensaje  =
      `¡Hola ${nombre}! 🎉\n\n` +
      `*${empresa}* acaba de publicar la vacante de *${puesto}* por la que dejaste tus datos en nuestra lista de espera.\n\n` +
      `¿Sigues en búsqueda de empleo? Entra a nuestro chat para postularte de manera rápida.${linkLine}\n\n` +
      `_Este mensaje fue enviado automáticamente por el sistema de reclutamiento de ${empresa}._`;
    try {
      await sendWAText(phone, mensaje);
      results.push({ id: c.id, nombre, ok: true });
    } catch (err) {
      results.push({ id: c.id, nombre, ok: false, error: err.message });
    }
  }
  return results;
}
