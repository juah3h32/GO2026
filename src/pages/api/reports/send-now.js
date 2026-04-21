// src/pages/api/reports/send-now.js
// Genera el PDF exacto (mismo HTML que el botón de descarga) y lo envía via Wahooks
import { getTurso }                                          from '../../../lib/turso';
import { buildReportHTML }                                   from '../../../components/ReportGenerator.jsx';
import { readAllData, readLeads, readRecruitmentLeads }      from '../../../lib/analytics-db.js';
import { verifyAdminToken }                                  from '../../../lib/verifyAdminToken.ts';
import puppeteer                                             from 'puppeteer-core';
import { existsSync, readFileSync }                          from 'fs';
import { join }                                              from 'path';

export const prerender = false;


// ── Filtrar datos por rango (igual que analytics.js) ─────────────────────────
function filterByDateRange(data, from, to, leads = []) {
  if (!from && !to) return data;
  const fromTs = from ? new Date(from).setHours(0,  0,  0,   0) : null;
  const toTs   = to   ? new Date(to  ).setHours(23, 59, 59, 999) : null;

  const filterDaily = (daily = {}) => {
    const result = {};
    Object.entries(daily).forEach(([k, v]) => {
      const ts = new Date(k).getTime();
      if (fromTs && ts < fromTs) return;
      if (toTs   && ts > toTs)   return;
      result[k] = v;
    });
    return result;
  };

  const filteredDaily = filterDaily(data.daily || {});
  const days = Object.values(filteredDaily);

  const totalMessages = days.reduce((s, d) => s + (d.messages || 0), 0);
  const totalSessions = days.reduce((s, d) => s + (d.sessions || 0), 0);
  const totalWhatsApp = days.reduce((s, d) => s + (d.wa       || 0), 0);
  const totalPDFs     = days.reduce((s, d) => s + (d.pdf      || 0), 0);

  const rawFiltered = (data.lastMessages || []).filter(item => {
    const ts = new Date((item.ts || item.timestamp || 0)).getTime();
    if (fromTs && ts < fromTs) return false;
    if (toTs   && ts > toTs)   return false;
    return true;
  });

  const intents  = {};
  const productsFromMsgs = {};
  rawFiltered.forEach(item => {
    if (item.intent)  intents[item.intent] = (intents[item.intent] || 0) + 1;
    if (item.product || item.prod) {
      const p = item.product || item.prod;
      productsFromMsgs[p] = (productsFromMsgs[p] || 0) + 1;
    }
  });

  // 🔥 SOLUCIÓN: Contar productos reales desde los leads (historial completo)
  const productsFromLeads = {};
  leads.forEach(l => {
    const ts = new Date(l.ts || 0).getTime();
    // Respetar el rango de fechas
    if (fromTs && ts < fromTs) return;
    if (toTs   && ts > toTs)   return;
    
    // Contar los productos separados por coma
    (l.productos || '').split(',').forEach(p => {
      const t = p.trim();
      if (t) productsFromLeads[t] = (productsFromLeads[t] || 0) + 1;
    });
  });

  // Si encontró productos en los leads usa esos, sino hace un fallback
  const finalProducts = Object.keys(productsFromLeads).length > 0 
    ? productsFromLeads 
    : (Object.keys(productsFromMsgs).length ? productsFromMsgs : data.products);

  return {
    ...data,
    daily:         filteredDaily,
    totalMessages,
    totalSessions,
    totalWhatsApp,
    totalPDFs,
    intents:  Object.keys(intents).length  ? intents  : data.intents,
    products: finalProducts, // <--- Aquí se inyectan los productos correctos
  };
}

// ── Filtrar leads por rango de fechas ─────────────────────────────────────────
function filterLeadsByPeriod(leads, from, to) {
  if (!from && !to) return leads;
  const fromTs = from ? new Date(from + 'T00:00:00').getTime() : null;
  const toTs   = to   ? new Date(to   + 'T23:59:59').getTime() : null;
  return leads.filter(l => {
    const ts = new Date(l.ts || 0).getTime();
    if (fromTs && ts < fromTs) return false;
    if (toTs   && ts > toTs)   return false;
    return true;
  });
}

// ── Logo desde el sistema de archivos (más rápido que fetch HTTP) ─────────────
function getLogoBase64() {
  try {
    const p = join(process.cwd(), 'public/images/logoN.png');
    if (!existsSync(p)) return null;
    return `data:image/png;base64,${readFileSync(p).toString('base64')}`;
  } catch { return null; }
}

// ── Construye periodMeta igual que el botón de descarga ───────────────────────
function getPeriodMeta(period, period_from, period_to) {
  const now   = new Date();
  const toStr = d => d.toISOString().split('T')[0];
  const today = toStr(now);
  if (period === 'custom' && period_from && period_to) {
    return { preset: 'custom', from: period_from, to: period_to };
  }
  switch (period) {
    case 'today': return { preset: 'today', from: today, to: today };
    case '24h':   { const f = new Date(now); f.setDate(f.getDate() - 1);  return { preset: '24h', from: toStr(f), to: today }; }
    case '7d':    { const f = new Date(now); f.setDate(f.getDate() - 7);  return { preset: '7d',  from: toStr(f), to: today }; }
    case '28d':   { const f = new Date(now); f.setDate(f.getDate() - 28); return { preset: '28d', from: toStr(f), to: today }; }
    case '30d':   { const f = new Date(now); f.setDate(f.getDate() - 30); return { preset: '30d', from: toStr(f), to: today }; }
    case '3m':    { const f = new Date(now); f.setDate(f.getDate() - 91); return { preset: '3m',  from: toStr(f), to: today }; }
    case 'month': {
      const f = new Date(now.getFullYear(), now.getMonth(), 1);
      const t = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { preset: 'month', from: toStr(f), to: toStr(t) };
    }
    default: return { preset: 'all', from: null, to: null };
  }
}

// ── Rutas locales de Chrome ───────────────────────────────────────────────────
const LOCAL_CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
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
  throw new Error('Chrome no encontrado. Define la variable CHROME_PATH o instala Google Chrome.');
}

// ── Generar PDF con Puppeteer ─────────────────────────────────────────────────
async function generatePDF(html) {
  const { executablePath, args } = await getBrowserConfig();
  let browser;
  try {
    browser = await puppeteer.launch({ executablePath, args, headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    // networkidle2 es más rápido que networkidle0 y suficiente para renderizar fuentes
    await page.setContent(html, { waitUntil: 'networkidle2', timeout: 45_000 });
    const pdf = await page.pdf({
      preferCSSPageSize: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    const b = Buffer.from(pdf);
    console.log(`[send-now] PDF listo: ${(b.length / 1024).toFixed(0)} KB`);
    return b;
  } finally {
    await browser?.close();
  }
}

// ── Enviar PDF vía Wahooks send-document ──────────────────────────────────────
async function sendPDFViaWahooks(phone, pdfBuffer, filename) {
  const token        = import.meta.env.WAHOOKS_TOKEN;
  const connectionId = import.meta.env.WAHOOKS_CONNECTION_ID;

  if (!token || !connectionId) {
    return { ok: false, error: 'Wahooks no configurado (WAHOOKS_TOKEN / WAHOOKS_CONNECTION_ID)' };
  }

  const cleanPhone = String(phone).replace(/\D/g, '');
  const chatId     = `${cleanPhone}@s.whatsapp.net`;
  const data       = pdfBuffer.toString('base64');

  try {
    const res      = await fetch(`https://api.wahooks.com/api/connections/${connectionId}/send-document`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body:    JSON.stringify({ chatId, data, mimetype: 'application/pdf', filename }),
    });
    const bodyText = await res.text();
    console.log(`[send-now] Wahooks ${phone} → HTTP ${res.status}: ${bodyText.slice(0, 120)}`);
    if (!res.ok) return { ok: false, error: `Wahooks HTTP ${res.status}: ${bodyText.slice(0, 120)}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ── Nombre del archivo PDF ────────────────────────────────────────────────────
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const TYPE_LABEL = { general: 'General', distribuidor: 'Distribuidores', reclutamiento: 'Reclutamiento', resumen: 'Resumen', candidatos_ia: 'Reclutamiento_IA' };

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function buildFilename(report_type, period, period_from, period_to) {
  const tipo  = TYPE_LABEL[report_type] || 'General';
  const now   = new Date();
  let periodoLabel;

  if (period === '7d') {
    const semana = getWeekNumber(now);
    periodoLabel = `Semana ${semana}`;
  } else if (period === 'month') {
    periodoLabel = MESES[now.getMonth()];
  } else if (period === 'today') {
    periodoLabel = `${String(now.getDate()).padStart(2,'0')} ${MESES[now.getMonth()].slice(0,3)}`;
  } else if (period === '30d') {
    periodoLabel = `Ultimos 30 dias`;
  } else if (period === 'custom' && period_from && period_to) {
    const fmt = s => {
      const d = new Date(s + 'T00:00:00');
      return `${String(d.getDate()).padStart(2,'0')} ${MESES[d.getMonth()].slice(0,3)}`;
    };
    periodoLabel = `${fmt(period_from)} al ${fmt(period_to)}`;
  } else {
    periodoLabel = now.toISOString().split('T')[0];
  }

  // "Semana 15 - Reclutamiento.pdf" → slug para nombre de archivo
  const safe = s => s.replace(/[^a-zA-Z0-9À-ÿ ]/g, '').replace(/\s+/g, '_');
  return `${safe(periodoLabel)}_${safe(tipo)}.pdf`;
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST({ request }) {
  // Acepta auth de usuario (cookie JWT) O llamada interna del cron (header secreto)
  const internalSecret = import.meta.env.CRON_SECRET_EXTERNAL || process.env.CRON_SECRET_EXTERNAL;
  const cronHeader     = request.headers.get('x-cron-secret');
  const isCronCall     = internalSecret && cronHeader === internalSecret;

  if (!isCronCall) {
    const role = await verifyAdminToken(request);
    if (!role) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      schedule_id,
      report_type  = 'general',
      period       = '7d',
      period_from  = null,
      period_to    = null,
      phones       = [],
    } = body;

    const periodMeta = getPeriodMeta(period, period_from, period_to);
    const { from, to } = periodMeta;

    // 1 + 2. Construir HTML según tipo de reporte
    let html;

    if (report_type === 'candidatos_ia') {
      // Reporte IA: delega al endpoint especializado para obtener el HTML con análisis
      const origin = new URL(request.url).origin;
      const iaRes  = await fetch(`${origin}/api/reports/recruitment-ia`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'x-cron-secret': internalSecret || '' },
        body:    JSON.stringify({ format: 'html' }),
      });
      const iaJson = await iaRes.json();
      if (!iaJson.ok) throw new Error(iaJson.error || 'Error generando reporte IA');
      html = iaJson.html;
   } else {
      // Reportes estándar: leer DB directamente (evita llamada HTTP interna con auth)
      const [rawData, allLeads, candidates, logoBase64] = await Promise.all([
        readAllData().catch(() => ({})),
        readLeads().catch(() => []),
        readRecruitmentLeads().catch(() => []),
        Promise.resolve(getLogoBase64()),
      ]);
      const data  = filterByDateRange(rawData, from, to);
      const leads = filterLeadsByPeriod(allLeads, from, to);

      // Variables exclusivas para el reporte "resumen"
      let analysis = null;
      let scData = null;

      if (report_type === 'resumen') {
        // 1. Obtener datos de Google Search Console
        try {
          const today = new Date().toISOString().slice(0, 10);
          const daysAgo = n => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };
          const scStartDate = from || daysAgo(30);
          const scEndDate = to || today;

          const scRes = await fetch(`${origin}/api/search-console`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ startDate: scStartDate, endDate: scEndDate })
          });
          scData = await scRes.json();
        } catch (e) {
          console.error('[send-now] Error Search Console:', e);
          scData = { ok: false };
        }

        // 2. Generar Análisis IA
        try {
          const tp = Object.entries(data?.products || {}).sort(([, a], [, b]) => b - a).slice(0, 5).map(([k, v]) => `${k}:${v}`).join(', ');
          const tk = Object.entries(data?.keywords || {}).sort(([, a], [, b]) => b - a).slice(0, 8).map(([k, v]) => `${k}:${v}`).join(', ');
          const msgs = (data?.lastMessages || []).slice(-20).map(m => m.user).join(' | ');
          
          const prompt = `Eres analista ejecutivo de ventas de Grupo Ortiz (empaques industriales, México).
Analiza los datos del chatbot BotGO del período "${periodMeta.preset}" y genera un resumen ejecutivo en español (máximo 180 palabras).
DATOS:
Sesiones:${data.totalSessions || 0}|Mensajes:${data.totalMessages || 0}|WhatsApp:${data.totalWhatsApp || 0}|PDFs:${data.totalPDFs || 0}
Productos top: ${tp || 'sin datos'}
Keywords top: ${tk || 'sin datos'}
Intenciones: Compra=${data.intents?.compra || 0}, Info=${data.intents?.info || 0}, PDF=${data.intents?.pdf || 0}, Empleo=${data.intents?.reclutamiento || 0}
Consultas recientes: ${msgs.substring(0, 400) || 'sin datos'}
INSTRUCCIONES:
- Escribe exactamente 4 bullets con los hallazgos más importantes
- Cada bullet empieza con "- " (guión espacio)
- Incluye: comportamiento general, producto estrella, oportunidades, recomendación comercial
- Usa números concretos de los datos
- NO uses asteriscos, negritas ni markdown
- Empieza DIRECTAMENTE con el primer bullet, sin título ni introducción`;

          const aiRes = await fetch(`${origin}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], language: 'es', isVoice: false, noLog: true })
          });
          const aiJson = await aiRes.json();
          analysis = (aiJson.reply || '').trim() || null;
        } catch (e) {
          console.error('[send-now] Error IA Análisis:', e);
        }
      }

      // 3. Pasamos analysis y scData al generador (el scData es el 8vo parámetro)
      html = buildReportHTML(data, periodMeta, analysis, logoBase64, leads, candidates, report_type, scData);
    }
    const filename = buildFilename(report_type, period, period_from, period_to);

    // 3. Generar PDF
    let pdfBuffer;
    try {
      pdfBuffer = await generatePDF(html);
    } catch (pdfErr) {
      console.error('[send-now] Error PDF:', pdfErr);
      return new Response(
        JSON.stringify({ ok: false, error: 'Error generando PDF: ' + String(pdfErr) }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Enviar a cada número
    const results = [];
    for (const entry of phones) {
      const phone = typeof entry === 'string' ? entry : entry?.phone;
      if (!phone) { results.push({ phone: '?', ok: false, error: 'Falta número' }); continue; }
      const result = await sendPDFViaWahooks(phone, pdfBuffer, filename);
      results.push({ phone, ...result });
    }

    // 5. Actualizar last_sent
    if (schedule_id) {
      try {
        const db = getTurso();
        await db.execute({
          sql:  'UPDATE report_schedules SET last_sent=? WHERE id=?',
          args: [new Date().toISOString(), schedule_id],
        });
      } catch (e) { console.error('[send-now] last_sent:', e); }
    }

    const allOk = results.every(r => r.ok);
    return new Response(JSON.stringify({ ok: allOk, results }), {
      status:  allOk ? 200 : 207,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[send-now]', err);
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
