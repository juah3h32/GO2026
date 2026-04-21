// src/lib/notify.js
// Notificaciones WhatsApp para nuevos candidatos — mismo estilo blanco que los reportes
import { readCandidateNotifications, touchCandidateNotifLastSent } from './analytics-db.js';
import puppeteer    from 'puppeteer-core';
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
    const p = join(process.cwd(), 'public/images/logoN.png');
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
    const chromium = await import('@sparticuz/chromium');
    return { executablePath: await chromium.default.executablePath(), args: [...chromium.default.args, '--no-sandbox'] };
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

// ── Wahooks: enviar mensaje de texto — endpoint /send con { chatId, text } ───
export async function sendWAText(phone, message) {
  const token        = import.meta.env.WAHOOKS_TOKEN;
  const connectionId = import.meta.env.WAHOOKS_CONNECTION_ID;
  if (!token || !connectionId) throw new Error('Wahooks no configurado');

  const chatId = `${String(phone).replace(/\D/g, '')}@s.whatsapp.net`;
  const res = await fetch(
    `https://api.wahooks.com/api/connections/${connectionId}/send`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body:    JSON.stringify({ chatId, text: message }),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Wahooks texto HTTP ${res.status}: ${body.slice(0, 120)}`);
  }
}

// ── Wahooks: enviar PDF (sin caption — el mensaje ya fue enviado antes) ───────
async function sendWAPDF(phone, pdfBuffer, filename) {
  const token        = import.meta.env.WAHOOKS_TOKEN;
  const connectionId = import.meta.env.WAHOOKS_CONNECTION_ID;
  if (!token || !connectionId) throw new Error('Wahooks no configurado');

  const chatId = `${String(phone).replace(/\D/g, '')}@s.whatsapp.net`;
  const res = await fetch(
    `https://api.wahooks.com/api/connections/${connectionId}/send-document`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body:    JSON.stringify({ chatId, data: pdfBuffer.toString('base64'), mimetype: 'application/pdf', filename }),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Wahooks PDF HTTP ${res.status}: ${body.slice(0, 120)}`);
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
        results.push({ config: config.name, phone, name: rName, ok: true });
      } catch (err) {
        console.error(`[notify] Error → ${phone}:`, err.message);
        results.push({ config: config.name, phone, name: rName, ok: false, error: err.message });
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
