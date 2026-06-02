// src/lib/notify.js
// Notificaciones WhatsApp para nuevos candidatos — mismo estilo blanco que los reportes
import { readCandidateNotifications, touchCandidateNotifLastSent, getWagoConfig } from './analytics-db.js';
import { existsSync, readFileSync } from 'fs';
import { join }     from 'path';

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

// ── Generar PDF de reporte BotGO ──────────────────────────────────────────────
export async function generateReportPDF(pdfData, logoBase64) {
  const { titulo, periodo, stats = [], extra = '', extra2 = '' } = pdfData;
  const logoHtml = logoBase64
    ? `<img src="${logoBase64}" alt="Logo" style="width:36px;height:36px;object-fit:contain;">`
    : `<span style="font-family:'Barlow Condensed',Helvetica,sans-serif;font-size:22px;font-weight:900;color:${WHITE};letter-spacing:-0.05em;">GO</span>`;

  const now = new Date().toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City', day:'2-digit', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit',
  });

  const statCards = stats.map(s => `
    <div style="background:${BG};border-radius:10px;padding:14px 16px;text-align:center;">
      <div style="font-family:'Barlow',sans-serif;font-size:7px;font-weight:700;letter-spacing:0.20em;text-transform:uppercase;color:${GRAY_LIGHT};margin-bottom:6px;">${esc(s.label)}</div>
      <div style="font-family:'DM Mono','Courier New',monospace;font-size:22px;font-weight:700;color:${BLACK};">${esc(s.value)}</div>
    </div>`).join('');

  const extraHtml = extra ? `
    <div style="background:${WHITE};border-radius:12px;border:1px solid ${CREAM_DARK};padding:16px 20px;margin-top:12px;">
      <div style="font-size:7px;font-weight:700;letter-spacing:0.20em;text-transform:uppercase;color:${GRAY_LIGHT};margin-bottom:10px;">Productos top</div>
      <pre style="font-family:'Barlow',sans-serif;font-size:12px;color:${BLACK};white-space:pre-wrap;margin:0;">${esc(extra)}</pre>
    </div>` : '';

  const extra2Html = extra2 ? `
    <div style="background:${WHITE};border-radius:12px;border:1px solid ${CREAM_DARK};padding:16px 20px;margin-top:12px;">
      <div style="font-size:7px;font-weight:700;letter-spacing:0.20em;text-transform:uppercase;color:${GRAY_LIGHT};margin-bottom:10px;">Búsquedas frecuentes</div>
      <pre style="font-family:'Barlow',sans-serif;font-size:12px;color:${BLACK};white-space:pre-wrap;margin:0;">${esc(extra2)}</pre>
    </div>` : '';

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700;800&family=Barlow+Condensed:wght@700;900&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0}@page{size:A4;margin:0}body{font-family:'Barlow',Helvetica,sans-serif;background:${BG};padding:28px;}</style></head><body>
  <div style="background:linear-gradient(135deg,${ORANGE} 0%,${ORANGE_DARK} 100%);border-radius:14px;padding:22px 24px;display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;box-shadow:0 4px 20px rgba(251,103,11,0.28);">
    <div style="display:flex;align-items:center;gap:14px;">
      <div style="width:48px;height:48px;background:rgba(255,255,255,0.18);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;">${logoHtml}</div>
      <div>
        <div style="font-size:7px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.65);margin-bottom:3px;">BotGO · Grupo Ortiz</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:900;color:${WHITE};letter-spacing:-0.02em;line-height:1;text-transform:uppercase;">${esc(titulo)}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.78);font-weight:500;margin-top:2px;">${esc(periodo)}</div>
      </div>
    </div>
    <div style="background:rgba(255,255,255,0.16);border:1px solid rgba(255,255,255,0.24);border-radius:18px;padding:6px 14px;">
      <div style="font-size:8px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.85);">${esc(now)}</div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(${Math.min(stats.length, 3)},1fr);gap:10px;margin-bottom:4px;">${statCards}</div>
  ${extraHtml}${extra2Html}
  <div style="margin-top:14px;display:flex;justify-content:space-between;padding:0 2px;">
    <span style="font-size:7px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${GRAY_LIGHT};">BotGO · Grupo Ortiz · Reporte automático</span>
    <span style="font-size:7px;font-weight:600;color:${GRAY_LIGHT};">${esc(now)}</span>
  </div>
</body></html>`;

  const safe = s => (s||'').replace(/[^a-zA-Z0-9]/g,'_').slice(0,20);
  const filename = `Reporte_${safe(titulo)}.pdf`;
  const buffer   = await generatePDF(html);
  return { buffer, filename };
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

// ── WAGO: enviar mensaje de texto — endpoint /send con { chatId, text } ───
export async function sendWAText(phone, message) {
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

// ── WAGO: enviar PDF (sin caption — el mensaje ya fue enviado antes) ───────
export async function sendWAPDF(phone, pdfBuffer, filename) {
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
  for (const s of subs) {
    try {
      await sendWAText(s.phone, buildMsg(s.name || ''));
      sent++;
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
  return notifyCategoria('clientes', (nombre) => {
    const saludo = nombre ? `*${nombre}*, hay` : 'Hay';
    return `${saludo} un nuevo registro de distribuidor, te comparto la info:\n\n` +
      `- Nombre: *${l.nombre || '—'}*\n` +
      (l.empresa ? `- Empresa: ${l.empresa}\n` : '') +
      (l.whatsapp ? `- WhatsApp: ${l.whatsapp}\n` : '') +
      (l.email ? `- Email: ${l.email}\n` : '') +
      (l.productos ? `- Interesado en: ${Array.isArray(l.productos) ? l.productos.join(', ') : l.productos}\n` : '') +
      (l.comentarios ? `- Comentario: ${String(l.comentarios).slice(0, 200)}\n` : '') +
      `\nPuedes darle seguimiento desde el panel de Distribuidores.`;
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
