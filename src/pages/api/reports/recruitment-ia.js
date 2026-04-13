// src/pages/api/reports/recruitment-ia.js
// Reporte IA de Reclutamiento — analiza y rankea candidatos por vacante usando Claude
import { readRecruitmentLeads, readVacantes } from '../../../lib/analytics-db.js';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import puppeteer from 'puppeteer-core';
import * as _pdfParseModule from 'pdf-parse';

export const prerender = false;

// ── Normaliza export CJS/ESM de pdf-parse ─────────────────────────────────────
const pdfParse = (() => {
  const m = _pdfParseModule;
  if (typeof m?.default?.default === 'function') return m.default.default; // doble-wrap Vite
  if (typeof m?.default === 'function')           return m.default;         // ESM normal
  if (typeof m === 'function')                    return m;                 // CJS directo
  return null;
})();

// ── Helpers ───────────────────────────────────────────────────────────────────
function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

// ── Logo ──────────────────────────────────────────────────────────────────────
function getLogoBase64() {
  try {
    const p = join(process.cwd(), 'public/images/logo.png');
    if (!existsSync(p)) return null;
    return `data:image/png;base64,${readFileSync(p).toString('base64')}`;
  } catch { return null; }
}

// ── Chrome / Puppeteer ────────────────────────────────────────────────────────
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
  throw new Error('Chrome no encontrado. Define CHROME_PATH o instala Google Chrome.');
}

async function makePDF(html) {
  const { executablePath, args } = await getBrowserConfig();
  let browser;
  try {
    browser = await puppeteer.launch({ executablePath, args, headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    const pdf = await page.pdf({
      preferCSSPageSize: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    return Buffer.from(pdf);
  } finally {
    await browser?.close();
  }
}

// ── Extracción de contenido de CV ─────────────────────────────────────────────

const CV_VISION_PROMPT = `Extrae TODA la información de este CV. Devuelve el siguiente formato:
NOMBRE: [nombre completo]
EXPERIENCIA: [cada empresa, puesto y duración — incluye fechas o años si aparecen]
EDUCACIÓN: [nivel, institución, carrera]
PROGRAMAS/SOFTWARE: [TODOS los que mencione: Excel, SAP, Word, AutoCAD, CONTPAQi, etc.]
HABILIDADES: [habilidades técnicas y blandas]
AÑOS_EXPERIENCIA: [total estimado de años laborales]
Sé exhaustivo. No omitas ningún programa, herramienta ni habilidad mencionada.`;

// ── Redimensiona imagen con sharp ─────────────────────────────────────────────
async function comprimirImagen(base64, mimeType) {
  try {
    const { default: sharp } = await import('sharp');
    const buf     = Buffer.from(base64, 'base64');
    const resized = await sharp(buf)
      .resize(1600, 2200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82 })
      .toBuffer();
    return { base64: resized.toString('base64'), mimeType: 'image/jpeg' };
  } catch {
    return { base64, mimeType };
  }
}

// ── Convierte primera página de PDF a imagen JPEG usando Puppeteer ────────────
async function pdfPageToImage(base64, nombre = '') {
  const tmpPath = join(tmpdir(), `cv_${Date.now()}_${Math.random().toString(36).slice(2)}.pdf`);
  let browser;
  try {
    writeFileSync(tmpPath, Buffer.from(base64, 'base64'));

    const { executablePath, args } = await getBrowserConfig();
    browser = await puppeteer.launch({ executablePath, args, headless: true });

    const page = await browser.newPage();
    // Tamaño A4 a 96dpi * 1.5 escala
    await page.setViewport({ width: 1240, height: 1754, deviceScaleFactor: 1.5 });
    await page.goto(`file://${tmpPath}`, { waitUntil: 'load', timeout: 30_000 });
    // Esperar que el visor de PDF de Chrome renderice
    await new Promise(r => setTimeout(r, 2000));

    // Screenshot sin clip — evita errores si Chrome redimensiona internamente
    const shot = await page.screenshot({ type: 'jpeg', quality: 85 });
    console.log(`[pdf→img] "${nombre}" capturado con Puppeteer`);
    return Buffer.from(shot).toString('base64');
  } catch (e) {
    console.warn(`[pdf→img] Error convirtiendo "${nombre}":`, e.message);
    return null;
  } finally {
    await browser?.close();
    try { unlinkSync(tmpPath); } catch {}
  }
}

// ── Vision extract — envía imagen a GPT-4o-mini con reintentos ────────────────
async function visionExtract(base64, mimeType, apiKey, nombre = '') {
  const { base64: b64, mimeType: mime } = await comprimirImagen(base64, mimeType);

  for (let intento = 1; intento <= 3; intento++) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model:      'gpt-4o-mini',
          max_tokens: 700,
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: CV_VISION_PROMPT },
              { type: 'image_url', image_url: { url: `data:${mime};base64,${b64}`, detail: 'high' } },
            ],
          }],
        }),
      });

      if (res.status === 429) {
        const wait = intento * 2000;
        console.warn(`[cv-vision] Rate limit "${nombre}", reintento ${intento} en ${wait}ms`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }

      const j = await res.json();
      if (j.error) {
        console.warn(`[cv-vision] API error "${nombre}":`, j.error.message);
        return null;
      }
      const text = j.choices?.[0]?.message?.content?.trim() || null;
      if (text) console.log(`[cv-vision] OK "${nombre}" — ${text.length} chars`);
      return text;
    } catch (e) {
      console.warn(`[cv-vision] Excepción "${nombre}" intento ${intento}:`, e.message);
      if (intento < 3) await new Promise(r => setTimeout(r, 1500));
    }
  }
  return null;
}

// ── Extrae texto de PDF: texto nativo primero, luego imagen+vision ────────────
async function extractPDFText(base64, apiKey, nombre = '') {
  // 1. Texto nativo con pdf-parse
  if (typeof pdfParse === 'function') {
    try {
      const buf  = Buffer.from(base64, 'base64');
      const data = await pdfParse(buf);
      const raw  = data.text.replace(/\s+/g, ' ').trim();
      if (raw.length >= 80) {
        console.log(`[pdf-parse] OK "${nombre}" — ${raw.length} chars`);
        return raw.slice(0, 4500);
      }
      console.warn(`[pdf-parse] Texto insuficiente "${nombre}" (${raw.length} chars) — PDF escaneado`);
    } catch (e) {
      console.warn(`[pdf-parse] Error en "${nombre}":`, e.message);
    }
  } else {
    console.warn('[pdf-parse] Módulo no cargado correctamente — saltando a imagen');
  }

  // 2. PDF escaneado → imagen → vision
  console.log(`[pdf→vision] Convirtiendo "${nombre}" a imagen para GPT vision...`);
  const imgBase64 = await pdfPageToImage(base64, nombre);
  if (imgBase64) return visionExtract(imgBase64, 'image/jpeg', apiKey, nombre);

  console.warn(`[pdf→vision] No se pudo convertir "${nombre}" a imagen`);
  return null;
}

// ── Extrae contenido del CV según tipo (PDF o imagen) ─────────────────────────
async function extractCVContent(c, apiKey) {
  if (!c.cv_base64) return null;
  const tipo   = (c.cv_tipo || '').toLowerCase();
  const nombre = c.cv_nombre || String(c.id);

  if (tipo.includes('pdf') || tipo === 'application/pdf') {
    return extractPDFText(c.cv_base64, apiKey, nombre);
  }

  if (tipo.match(/image|jpg|jpeg|png|webp|gif|bmp|tiff|heic/)) {
    return visionExtract(c.cv_base64, c.cv_tipo || 'image/jpeg', apiKey, nombre);
  }

  // Tipo desconocido — intentar como imagen, luego como PDF
  console.warn(`[cv] Tipo desconocido "${tipo}" para "${nombre}" — probando imagen`);
  const porImagen = await visionExtract(c.cv_base64, 'image/jpeg', apiKey, nombre);
  if (porImagen) return porImagen;
  return extractPDFText(c.cv_base64, apiKey, nombre);
}

// ── Caché de análisis ─────────────────────────────────────────────────────────
const _analysisCache = new Map();

function _hashCandidates(candidates) {
  return candidates
    .map(c => `${c.id}:${c.cv_nombre ? '1' : '0'}:${c.created_at || c.ts || ''}`)
    .join('|');
}

// ── AI analysis ───────────────────────────────────────────────────────────────
async function analyzeWithAI(candidates, vacantes) {
  const apiKey = import.meta.env.OPENAI_API_KEY;
  if (!apiKey) { console.error('[recruitment-ia] OPENAI_API_KEY no configurada'); return null; }

  const limited = candidates.slice(0, 60);

  const cacheKey = _hashCandidates(limited);
  const cached   = _analysisCache.get(cacheKey);
  if (cached) {
    console.log('[recruitment-ia] Usando análisis cacheado');
    return cached.scores;
  }

  // Extraer CVs en lotes de 3
  const conCV = limited.filter(c => c.cv_base64);
  const sinCV = limited.filter(c => !c.cv_base64);
  const cvMap = {};
  const LOTE  = 3;
  const PAUSA = 800;

  for (let i = 0; i < conCV.length; i += LOTE) {
    const lote       = conCV.slice(i, i + LOTE);
    const resultados = await Promise.all(lote.map(c => extractCVContent(c, apiKey)));
    lote.forEach((c, idx) => { if (resultados[idx]) cvMap[String(c.id)] = resultados[idx]; });
    if (i + LOTE < conCV.length) await new Promise(r => setTimeout(r, PAUSA));
  }

  console.log(`[recruitment-ia] CVs leídos: ${Object.keys(cvMap).length}/${conCV.length} (${sinCV.length} sin CV)`);

  const vacList = vacantes.length
    ? vacantes.map(v => {
        let entry = `• VACANTE "${v.titulo}"`;
        if (v.area)        entry += ` | Área: ${v.area}`;
        if (v.tipo)        entry += ` | Tipo: ${v.tipo}`;
        if (v.salario)     entry += ` | Salario: ${v.salario}`;
        if (v.descripcion) entry += `\n  Descripción: ${v.descripcion.slice(0, 300)}`;
        if (v.requisitos)  entry += `\n  Requisitos: ${v.requisitos.slice(0, 500)}`;
        return entry;
      }).join('\n\n')
    : '(sin vacantes activas actualmente)';

  const candList = limited.map(c => {
    const cvText   = cvMap[String(c.id)];
    const esEspera = c.en_lista_espera === 1 || c.en_lista_espera === true;
    const msg      = (c.mensaje || '').trim().slice(0, 200);

    let line = `ID:${c.id} | ${c.nombre || 'Sin nombre'} | Puesto solicitado: "${c.puesto || '-'}"`;
    line += ` | Edad: ${c.edad || 'no indicada'} | Estado: ${c.estado_rep || 'no indicado'}`;
    if (esEspera) line += ' | [LISTA_ESPERA]';

    if (cvText) {
      line += `\n  [CV LEÍDO]: ${cvText.slice(0, 1800)}`;
    } else if (c.cv_nombre) {
      line += `\n  [CV ADJUNTO no legible: ${c.cv_nombre}]`;
    } else {
      line += `\n  [SIN CV]`;
    }

    if (msg) line += `\n  [MENSAJE]: "${msg}"`;
    return line;
  }).join('\n\n');

  const prompt = `Eres Director de Recursos Humanos con 20 años de experiencia en la industria manufacturera mexicana. Trabajas para Grupo Ortiz (fabricante de empaques industriales, Morelia, Michoacán).

VACANTES ACTIVAS:
${vacList}

---
INSTRUCCIÓN ESPECIAL — REQUISITOS DE CADA PUESTO:
Para cada vacante, ADEMÁS de los requisitos indicados arriba, aplica tu conocimiento experto del mercado laboral mexicano para determinar qué habilidades técnicas, software y experiencia son estándar e indispensables para ese tipo de puesto en la industria manufacturera. Por ejemplo:
- Contador/Contabilidad: SAP, CONTPAQi, XML, SAT/IMSS, Excel avanzado, cierre contable
- Almacenista/Logística: WMS, manejo de montacargas, inventarios FIFO, Excel básico
- Mantenimiento: PLC, neumática, hidráulica, lectura de planos, herramienta especializada
- Ventas: CRM, negociación, prospección, manejo de cartera, métricas de venta
- Producción/Operativo: 5S, seguridad industrial, tolerancias, control de calidad
Adapta estos criterios según el puesto exacto de cada vacante.

---
CANDIDATOS (${limited.length}):
${candList}

---
REGLAS DE EVALUACIÓN:

CANDIDATOS CON CV:
- Extrae y valora TODA la experiencia, empresas, años trabajados y programas/software que mencione el CV
- Compara directamente contra los requisitos del puesto y los estándares del mercado
- Si el CV menciona programas específicos requeridos (SAP, Excel, AutoCAD, etc.) suma puntos
- Si tiene experiencia en empresas del giro manufacturero/industrial, es ventaja importante

CANDIDATOS SIN CV:
- Analiza su MENSAJE para extraer menciones de experiencia, años, empresas, habilidades
- Evalúa su edad en relación con los años de experiencia esperados para el puesto:
  • Puesto operativo básico: 18-25 años sin CV es aceptable si el mensaje muestra interés
  • Supervisión/técnico: esperar ≥3 años de experiencia mencionada o inferible por edad
  • Especialista/admin: penalizar ausencia de CV pero no descartar si el mensaje es sólido
- Edad como indicador de experiencia potencial (si no hay CV ni mensaje descriptivo):
  • 18-24 años sin CV en puesto operativo: puntuación 2-3 (perfil junior, válido)
  • 25-35 años sin CV: puntuación 2 (se espera más respaldo)
  • >35 años sin CV: penalizar más, un profesional experimentado debe tener CV

CANDIDATOS EN LISTA_ESPERA:
- No los penalices por no haber vacante activa hoy
- Evalúa su perfil con la misma rigurosidad; indica en comentario que están en espera

PUNTUACIÓN:
- 5 = Perfil ideal: cumple todos los requisitos técnicos, experiencia verificada, excelente fit
- 4 = Muy bueno: cumple la mayoría de requisitos, experiencia relevante, recomendar entrevistar
- 3 = Aceptable: cumple requisitos básicos, algunas dudas o le falta algo importante
- 2 = Débil: perfil incompleto o experiencia insuficiente para el puesto
- 1 = No aplica: puesto completamente diferente o perfil incompatible

---
Para CADA candidato devuelve exactamente:
- id: número del ID
- puntuacion: 1-5 (determinista — no cambies si se re-genera con los mismos datos)
- recomendacion: exactamente "Entrevistar" | "En espera" | "Descartar"
- nota: 1 frase (máx 90 chars) con la razón principal de la puntuación
- comentario: 2-3 frases detalladas: menciona experiencia/programas específicos del CV si fue leído, indica qué cumple y qué falta, fortalezas concretas
- top: true SOLO si es el MEJOR candidato para su vacante (máx 1 por vacante, nunca si puntuacion <= 2)

Devuelve ÚNICAMENTE el array JSON, sin texto adicional, sin markdown, sin explicaciones:
[{"id":1,"puntuacion":4,"recomendacion":"Entrevistar","nota":"5 años en almacén, manejo de inventarios y Excel confirmados en CV","comentario":"Su CV muestra 5 años como Almacenista en empresa manufacturera. Domina Excel y manejo de inventarios FIFO. Vive en Morelia con disponibilidad inmediata — perfil sólido para la vacante.","top":false}]`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model:       'gpt-4o',
        max_tokens:  4000,
        temperature: 0,
        seed:        42,
        messages:    [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) { console.error('[recruitment-ia] OpenAI HTTP', res.status); return null; }
    const j     = await res.json();
    const raw   = (j.choices?.[0]?.message?.content || '').trim();
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) { console.error('[recruitment-ia] JSON no encontrado en respuesta'); return null; }
    const scores = JSON.parse(match[0]);

    _analysisCache.set(cacheKey, { scores, ts: Date.now() });
    if (_analysisCache.size > 10) {
      const oldest = [..._analysisCache.keys()][0];
      _analysisCache.delete(oldest);
    }

    return scores;
  } catch (e) {
    console.error('[recruitment-ia] AI error:', e);
    return null;
  }
}

// ── HTML builder ──────────────────────────────────────────────────────────────
export function buildRecruitmentIAHTML(candidates, vacantes, aiScores, logoBase64, puestoFiltro = '') {
  const now = new Date().toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const scoreMap = {};
  if (Array.isArray(aiScores)) for (const s of aiScores) if (s?.id != null) scoreMap[String(s.id)] = s;
  const sc   = id => scoreMap[String(id)];
  const aiOk = Object.keys(scoreMap).length > 0;

  const vacGroups    = {};
  const puestoGroups = {};

  for (const c of candidates) {
    const puesto  = (c.puesto || '').trim().toLowerCase();
    const matched = vacantes.find(v => {
      const vt    = v.titulo.toLowerCase();
      const words = vt.split(/\s+/).filter(w => w.length > 3);
      return puesto && (vt.includes(puesto) || puesto.includes(vt) || words.some(w => puesto.includes(w)));
    });
    if (matched) {
      if (!vacGroups[matched.id]) vacGroups[matched.id] = { vacante: matched, list: [] };
      vacGroups[matched.id].list.push(c);
    } else {
      const key = c.puesto?.trim() || 'Sin especificar';
      if (!puestoGroups[key]) puestoGroups[key] = [];
      puestoGroups[key].push(c);
    }
  }

  const sortByScore = arr =>
    [...arr].sort((a, b) => (sc(b.id)?.puntuacion ?? 0) - (sc(a.id)?.puntuacion ?? 0));

  const sColor = s => !s ? '#9CA3AF' : s >= 4 ? '#16A34A' : s >= 3 ? '#B45309' : '#DC2626';
  const sBg    = s => !s ? '#F5F5F5' : s >= 4 ? '#F0FDF4' : s >= 3 ? '#FFFBEB' : '#FEF2F2';
  const rColor = r => r === 'Entrevistar' ? '#16A34A' : r === 'En espera' ? '#B45309' : r ? '#DC2626' : '#CCC';

  const thead = `
    <thead>
      <tr style="background:#F3F4F6;border-bottom:2px solid #E5E7EB;">
        <th style="padding:7px 11px;text-align:left;font-size:8px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.07em;font-weight:700;">#</th>
        <th style="padding:7px 11px;text-align:left;font-size:8px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.07em;font-weight:700;">Candidato</th>
        <th style="padding:7px 11px;text-align:left;font-size:8px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.07em;font-weight:700;">Puesto solicitado</th>
        <th style="padding:7px 11px;text-align:center;font-size:8px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.07em;font-weight:700;">CV</th>
        <th style="padding:7px 11px;text-align:center;font-size:8px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.07em;font-weight:700;">Score</th>
        <th style="padding:7px 11px;text-align:center;font-size:8px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.07em;font-weight:700;">Rec.</th>
        <th style="padding:7px 11px;text-align:left;font-size:8px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.07em;font-weight:700;">Análisis IA</th>
      </tr>
    </thead>`;

  const row = (c, i) => {
    const s_         = sc(c.id);
    const s          = s_?.puntuacion;
    const rec        = s_?.recomendacion;
    const nota       = s_?.nota;
    const comentario = s_?.comentario;
    const isTop      = !!s_?.top;
    const cvLeido    = !!(s_ && c.cv_base64);
    const rowBg      = isTop ? '#FFFBEB' : (i % 2 === 0 ? '#FAFAFA' : '#FFF');
    return `
      <tr style="background:${rowBg};border-bottom:1px solid ${isTop ? '#FDE68A' : '#F0F0F0'};">
        <td style="padding:9px 11px;font-size:10.5px;color:#9CA3AF;">${i + 1}</td>
        <td style="padding:9px 11px;">
          <div style="display:flex;align-items:center;gap:6px;">
            <div style="font-size:11.5px;font-weight:${isTop ? '700' : '600'};color:${isTop ? '#92400E' : '#111'};">${c.nombre || '—'}</div>
            ${isTop ? `<span style="background:#F59E0B;color:#FFF;font-size:7px;font-weight:800;letter-spacing:0.08em;padding:2px 5px;border-radius:3px;white-space:nowrap;">MEJOR</span>` : ''}
          </div>
          ${(c.edad || c.estado_rep) ? `<div style="font-size:9px;color:#AAA;margin-top:1px;">${[c.edad ? `${c.edad} años` : null, c.estado_rep].filter(Boolean).join(' · ')}</div>` : ''}
        </td>
        <td style="padding:9px 11px;font-size:10.5px;color:#555;">${c.puesto || '—'}</td>
        <td style="padding:9px 11px;text-align:center;">
          ${c.cv_nombre && c.cv_base64
            ? `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
                <a href="data:${c.cv_tipo || 'application/pdf'};base64,${c.cv_base64}" download="${c.cv_nombre}" style="text-decoration:none;">
                  <span style="background:#EFF6FF;color:#2563EB;border:1px solid #BFDBFE;border-radius:4px;padding:3px 7px;font-size:8px;font-weight:700;letter-spacing:0.04em;cursor:pointer;display:inline-block;">⬇ CV</span>
                </a>
                ${cvLeido ? `<span style="font-size:7px;color:#16A34A;font-weight:600;">leído por IA</span>` : ''}
               </div>`
            : c.cv_nombre
              ? `<span style="background:#F3F4F6;color:#9CA3AF;border-radius:4px;padding:2px 6px;font-size:8px;font-weight:600;">CV</span>`
              : `<span style="color:#DDD;font-size:10px;">—</span>`}
        </td>
        <td style="padding:9px 11px;text-align:center;">
          ${s
            ? `<span style="background:${sBg(s)};color:${sColor(s)};border:1px solid ${sColor(s)}35;border-radius:5px;padding:3px 9px;font-size:13px;font-weight:700;line-height:1;">${s}<span style="font-size:8.5px;opacity:0.6">/5</span></span>`
            : `<span style="color:#DDD;font-size:10px;">—</span>`}
        </td>
        <td style="padding:9px 11px;text-align:center;">
          ${rec
            ? `<span style="color:${rColor(rec)};font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">${rec}</span>`
            : `<span style="color:#DDD;font-size:10px;">—</span>`}
        </td>
        <td style="padding:9px 11px;max-width:190px;">
          ${nota ? `<div style="font-size:9px;font-weight:600;color:#374151;margin-bottom:${comentario ? '4px' : '0'};">${nota}</div>` : ''}
          ${comentario ? `<div style="font-size:8.5px;color:#6B7280;line-height:1.5;border-top:${nota ? '1px solid #F0F0F0' : 'none'};padding-top:${nota ? '4px' : '0'};">${comentario}</div>` : (!nota ? '—' : '')}
        </td>
      </tr>`;
  };

  const section = (title, subtitle, rawList, color = '#FB670B') => {
    const list = sortByScore(rawList);
    return `
      <div style="margin-bottom:22px;page-break-inside:avoid;">
        <div style="background:${color};color:#FFF;padding:10px 15px;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div style="font-size:12px;font-weight:700;letter-spacing:-0.01em;">${title}</div>
            ${subtitle ? `<div style="font-size:9px;opacity:0.72;margin-top:1px;">${subtitle}</div>` : ''}
          </div>
          <div style="background:rgba(255,255,255,0.18);border-radius:4px;padding:2px 9px;font-size:10px;font-weight:700;">${list.length} candidato${list.length !== 1 ? 's' : ''}</div>
        </div>
        <table style="width:100%;border-collapse:collapse;background:#FFF;border:1px solid #E5E7EB;border-top:none;border-radius:0 0 8px 8px;overflow:hidden;">
          ${thead}
          <tbody>${list.map((c, i) => row(c, i)).join('')}</tbody>
        </table>
      </div>`;
  };

  const topCount  = candidates.filter(c => sc(c.id)?.recomendacion === 'Entrevistar').length;
  const conCv     = candidates.filter(c => c.cv_nombre).length;
  const cvsLeidos = Array.isArray(aiScores) ? candidates.filter(c => c.cv_base64 && scoreMap[String(c.id)]).length : 0;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4 portrait; margin: 20px 24px; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #1A1A1A; background: #FFF; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>

<!-- HEADER -->
<div style="background:#1A1A1A;color:#FFF;padding:18px 22px;border-radius:9px;margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;">
  <div style="display:flex;align-items:center;gap:14px;">
    ${logoBase64
      ? `<img src="${logoBase64}" alt="Grupo Ortiz" style="height:32px;width:auto;" />`
      : `<div style="font-size:18px;font-weight:800;color:#FB670B;letter-spacing:-0.04em;">GO</div>`}
    <div>
      <div style="font-size:15px;font-weight:700;letter-spacing:-0.02em;">Reporte IA · Reclutamiento</div>
      <div style="font-size:9.5px;opacity:0.45;margin-top:2px;">${puestoFiltro ? `Puesto: ${puestoFiltro} · ` : ''}Análisis inteligente de candidatos · Grupo Ortiz</div>
    </div>
  </div>
  <div style="text-align:right;">
    <div style="font-size:9px;opacity:0.4;">Generado el</div>
    <div style="font-size:11px;font-weight:600;color:#FB670B;margin-top:1px;">${now}</div>
  </div>
</div>

<!-- KPIs -->
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-bottom:16px;">
  ${[
    { l: 'Total candidatos',               v: candidates.length, c: '#FB670B' },
    { l: 'Vacantes activas',               v: vacantes.length,   c: '#2563EB' },
    { l: 'A entrevistar',                  v: topCount,          c: '#16A34A' },
    { l: `CVs leídos / ${conCv} adjuntos`, v: cvsLeidos,         c: '#7C3AED' },
  ].map(k => `
    <div style="background:#FAFAFA;border:1px solid #E5E7EB;border-top:3px solid ${k.c};border-radius:7px;padding:12px 14px;">
      <div style="font-size:8.5px;color:#AAA;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:5px;">${k.l}</div>
      <div style="font-size:26px;font-weight:700;color:${k.c};letter-spacing:-0.03em;">${k.v}</div>
    </div>`).join('')}
</div>

<!-- AI DISCLAIMER / ERROR -->
${aiOk
  ? `<div style="background:#FFF7F0;border:1px solid rgba(251,103,11,0.22);border-left:3px solid #FB670B;border-radius:5px;padding:9px 13px;margin-bottom:18px;font-size:9.5px;color:#5A3010;line-height:1.55;">
      <strong>Análisis generado por Inteligencia Artificial.</strong> Las puntuaciones y recomendaciones son orientativas. El criterio del equipo de RH debe prevalecer en la decisión final.${cvsLeidos > 0 ? ` Se leyeron ${cvsLeidos} CV${cvsLeidos !== 1 ? 's' : ''} (PDF e imágenes) para enriquecer el análisis.` : ''}${candidates.length > 60 ? ` Se analizaron los 60 candidatos más recientes de ${candidates.length} registrados.` : ''}
    </div>`
  : `<div style="background:#FEF2F2;border:1px solid #FECACA;border-left:3px solid #DC2626;border-radius:5px;padding:9px 13px;margin-bottom:18px;font-size:9.5px;color:#7F1D1D;line-height:1.55;">
      <strong>El análisis de IA no pudo completarse.</strong> Se muestran los candidatos sin puntuación. Intenta generar el reporte nuevamente.
    </div>`}

<!-- A ENTREVISTAR -->
${(() => {
  const lista = candidates
    .filter(c => sc(c.id)?.recomendacion === 'Entrevistar')
    .sort((a, b) => (sc(b.id)?.puntuacion ?? 0) - (sc(a.id)?.puntuacion ?? 0));
  if (!lista.length) return '';
  const rows = lista.map((c, i) => {
    const s_         = sc(c.id);
    const isTop      = !!s_?.top;
    const cvLeido    = !!(s_ && c.cv_base64);
    const comentario = s_?.comentario;
    return `
      <tr style="background:${isTop ? '#FFFBEB' : (i % 2 === 0 ? '#F0FDF4' : '#FFF')};border-bottom:1px solid #D1FAE5;">
        <td style="padding:8px 11px;font-size:10.5px;color:#9CA3AF;">${i + 1}</td>
        <td style="padding:8px 11px;">
          <div style="display:flex;align-items:center;gap:6px;">
            <div style="font-size:11.5px;font-weight:700;color:#111;">${c.nombre || '—'}</div>
            ${isTop ? `<span style="background:#F59E0B;color:#FFF;font-size:7px;font-weight:800;letter-spacing:0.08em;padding:2px 5px;border-radius:3px;">MEJOR</span>` : ''}
          </div>
          ${(c.edad || c.estado_rep) ? `<div style="font-size:9px;color:#AAA;margin-top:1px;">${[c.edad ? `${c.edad} años` : null, c.estado_rep].filter(Boolean).join(' · ')}</div>` : ''}
          ${c.telefono ? `<div style="font-size:9px;color:#2563EB;margin-top:2px;font-weight:600;">${c.telefono}</div>` : ''}
        </td>
        <td style="padding:8px 11px;font-size:10.5px;color:#555;">${c.puesto || '—'}</td>
        <td style="padding:8px 11px;text-align:center;">
          ${c.cv_nombre && c.cv_base64
            ? `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
                <a href="data:${c.cv_tipo || 'application/pdf'};base64,${c.cv_base64}" download="${c.cv_nombre}" style="text-decoration:none;">
                  <span style="background:#EFF6FF;color:#2563EB;border:1px solid #BFDBFE;border-radius:4px;padding:3px 7px;font-size:8px;font-weight:700;cursor:pointer;display:inline-block;">⬇ CV</span>
                </a>
                ${cvLeido ? `<span style="font-size:7px;color:#16A34A;font-weight:600;">leído por IA</span>` : ''}
               </div>`
            : c.cv_nombre
              ? `<span style="background:#F3F4F6;color:#9CA3AF;border-radius:4px;padding:2px 6px;font-size:8px;font-weight:600;">CV</span>`
              : `<span style="color:#DDD;font-size:10px;">—</span>`}
        </td>
        <td style="padding:8px 11px;text-align:center;">
          <span style="background:${sBg(s_?.puntuacion)};color:${sColor(s_?.puntuacion)};border:1px solid ${sColor(s_?.puntuacion)}35;border-radius:5px;padding:3px 9px;font-size:13px;font-weight:700;">${s_?.puntuacion ?? '—'}<span style="font-size:8px;opacity:0.6">/5</span></span>
        </td>
        <td style="padding:8px 11px;max-width:220px;">
          ${s_?.nota ? `<div style="font-size:9px;font-weight:600;color:#15803D;margin-bottom:${comentario ? '4px' : '0'};">${s_?.nota}</div>` : ''}
          ${comentario ? `<div style="font-size:8.5px;color:#374151;line-height:1.55;${s_?.nota ? 'border-top:1px solid #D1FAE5;padding-top:4px;' : ''}">${comentario}</div>` : ''}
        </td>
      </tr>`;
  }).join('');
  return `
    <div style="margin-bottom:22px;page-break-inside:avoid;">
      <div style="background:linear-gradient(135deg,#15803D,#16A34A);color:#FFF;padding:10px 15px;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:13px;font-weight:800;letter-spacing:-0.01em;">Candidatos a entrevistar</div>
          <div style="font-size:9px;opacity:0.75;margin-top:1px;">Recomendados por la IA — contactar con prioridad</div>
        </div>
        <div style="background:rgba(255,255,255,0.2);border-radius:4px;padding:2px 9px;font-size:10px;font-weight:700;">${lista.length} candidato${lista.length !== 1 ? 's' : ''}</div>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#FFF;border:1.5px solid #BBF7D0;border-top:none;border-radius:0 0 8px 8px;overflow:hidden;">
        <thead>
          <tr style="background:#F0FDF4;border-bottom:2px solid #BBF7D0;">
            <th style="padding:7px 11px;text-align:left;font-size:8px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.07em;font-weight:700;">#</th>
            <th style="padding:7px 11px;text-align:left;font-size:8px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.07em;font-weight:700;">Candidato</th>
            <th style="padding:7px 11px;text-align:left;font-size:8px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.07em;font-weight:700;">Puesto solicitado</th>
            <th style="padding:7px 11px;text-align:center;font-size:8px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.07em;font-weight:700;">CV</th>
            <th style="padding:7px 11px;text-align:center;font-size:8px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.07em;font-weight:700;">Score</th>
            <th style="padding:7px 11px;text-align:left;font-size:8px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.07em;font-weight:700;">Análisis IA</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
})()}

<!-- MEJORES CANDIDATOS -->
${(() => {
  const tops = candidates
    .filter(c => sc(c.id)?.top)
    .sort((a, b) => (sc(b.id)?.puntuacion ?? 0) - (sc(a.id)?.puntuacion ?? 0));
  if (!tops.length) return '';
  const cards = tops.map(c => {
    const s_      = sc(c.id);
    const puesto  = (c.puesto || '').trim().toLowerCase();
    const matched = vacantes.find(v => {
      const vt    = v.titulo.toLowerCase();
      const words = vt.split(/\s+/).filter(w => w.length > 3);
      return puesto && (vt.includes(puesto) || puesto.includes(vt) || words.some(w => puesto.includes(w)));
    });
    const vacLabel = matched ? matched.titulo : (c.puesto || 'Sin vacante');
    return `
      <div style="background:#FFF;border:1.5px solid #FDE68A;border-top:3px solid #F59E0B;border-radius:8px;padding:13px 15px;display:flex;flex-direction:column;gap:5px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <div style="font-size:8px;color:#B45309;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">Vacante</div>
          <span style="background:#F59E0B;color:#FFF;font-size:7px;font-weight:800;letter-spacing:0.1em;padding:2px 6px;border-radius:3px;">MEJOR</span>
        </div>
        <div style="font-size:10px;color:#78350F;font-weight:600;line-height:1.3;">${vacLabel}</div>
        <div style="border-top:1px solid #FDE68A;margin-top:4px;padding-top:6px;">
          <div style="font-size:12.5px;font-weight:700;color:#111;letter-spacing:-0.01em;">${c.nombre || '—'}</div>
          <div style="font-size:9px;color:#999;margin-top:1px;">${[c.edad ? `${c.edad} años` : null, c.estado_rep].filter(Boolean).join(' · ') || '—'}</div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:2px;flex-wrap:wrap;">
          <span style="background:${sBg(s_?.puntuacion)};color:${sColor(s_?.puntuacion)};border:1px solid ${sColor(s_?.puntuacion)}40;border-radius:4px;padding:2px 8px;font-size:11px;font-weight:700;">${s_?.puntuacion ?? '—'}/5</span>
          ${c.cv_nombre ? `<span style="background:#EFF6FF;color:#2563EB;border:1px solid #BFDBFE;border-radius:4px;padding:2px 6px;font-size:8px;font-weight:700;">CV</span>` : ''}
          <span style="color:${rColor(s_?.recomendacion)};font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">${s_?.recomendacion || '—'}</span>
        </div>
        ${s_?.nota ? `<div style="font-size:8.5px;color:#666;line-height:1.5;border-top:1px solid #FEF3C7;margin-top:4px;padding-top:5px;">"${s_?.nota}"</div>` : ''}
      </div>`;
  }).join('');
  const cols = Math.min(tops.length, 3);
  return `
    <div style="margin-bottom:22px;page-break-inside:avoid;">
      <div style="background:linear-gradient(135deg,#B45309,#D97706);color:#FFF;padding:10px 15px;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:13px;font-weight:800;letter-spacing:-0.01em;">Mejores candidatos por vacante</div>
          <div style="font-size:9px;opacity:0.75;margin-top:1px;">Selección de la IA — candidato destacado por puesto</div>
        </div>
        <div style="background:rgba(255,255,255,0.2);border-radius:4px;padding:2px 9px;font-size:10px;font-weight:700;">${tops.length} destacado${tops.length !== 1 ? 's' : ''}</div>
      </div>
      <div style="background:#FFFBEB;border:1.5px solid #FDE68A;border-top:none;border-radius:0 0 8px 8px;padding:14px;">
        <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:10px;">
          ${cards}
        </div>
      </div>
    </div>`;
})()}

<!-- SECCIONES POR VACANTE -->
${Object.values(vacGroups).map(g => section(g.vacante.titulo, g.vacante.area || '', g.list, '#FB670B')).join('')}

<!-- SECCIONES SIN VACANTE ACTIVA -->
${Object.entries(puestoGroups).map(([k, l]) => section(k, 'Sin vacante activa relacionada', l, '#6B7280')).join('')}

<!-- ANEXO: CVs adjuntos -->
${(() => {
  const conCvList = candidates.filter(c => c.cv_base64 && c.cv_nombre);
  if (!conCvList.length) return '';
  const pages = conCvList.map(c => {
    const mimeType = c.cv_tipo || 'application/pdf';
    const isPdf    = mimeType.toLowerCase().includes('pdf');
    const dataUri  = `data:${mimeType};base64,${c.cv_base64}`;
    const s_       = sc(c.id);
    return `
      <div style="page-break-before:always;padding-top:12px;">
        <div style="background:#1A1A1A;color:#FFF;padding:10px 15px;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div style="font-size:12px;font-weight:700;">CV · ${c.nombre || '—'}</div>
            <div style="font-size:8.5px;opacity:0.55;margin-top:2px;">${c.puesto || '—'}${c.edad ? ` · ${c.edad} años` : ''}${c.estado_rep ? ` · ${c.estado_rep}` : ''}</div>
            <div style="font-size:8px;opacity:0.38;margin-top:1px;">${c.cv_nombre}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            ${s_?.puntuacion ? `<span style="background:${sBg(s_?.puntuacion)};color:${sColor(s_?.puntuacion)};border-radius:5px;padding:3px 10px;font-size:13px;font-weight:700;">${s_?.puntuacion}/5</span>` : ''}
            <a href="${dataUri}" download="${c.cv_nombre}" style="background:#2563EB;color:#FFF;text-decoration:none;border-radius:5px;padding:5px 11px;font-size:9px;font-weight:700;letter-spacing:0.04em;">⬇ Descargar CV</a>
          </div>
        </div>
        <div style="border:1px solid #E5E7EB;border-top:none;border-radius:0 0 8px 8px;overflow:hidden;background:#FAFAFA;">
          ${isPdf
            ? `<div style="padding:32px 24px;text-align:center;">
                 <div style="font-size:40px;margin-bottom:12px;">📄</div>
                 <div style="font-size:13px;font-weight:600;color:#374151;margin-bottom:6px;">${c.cv_nombre}</div>
                 <div style="font-size:10px;color:#9CA3AF;margin-bottom:18px;">Archivo PDF · haz clic para descargar y abrir</div>
                 <a href="${dataUri}" download="${c.cv_nombre}" style="background:#2563EB;color:#FFF;text-decoration:none;border-radius:6px;padding:10px 22px;font-size:11px;font-weight:700;display:inline-block;">⬇ Descargar CV de ${c.nombre || 'candidato'}</a>
                 ${s_?.comentario ? `<div style="margin-top:20px;background:#FFF;border:1px solid #E5E7EB;border-radius:6px;padding:12px 16px;text-align:left;font-size:9.5px;color:#374151;line-height:1.6;max-width:480px;margin-left:auto;margin-right:auto;"><strong style="color:#111;">Análisis IA:</strong> ${s_.comentario}</div>` : ''}
               </div>`
            : `<img src="${dataUri}" alt="CV de ${c.nombre}" style="width:100%;display:block;max-width:100%;" />`}
        </div>
      </div>`;
  }).join('');
  return `
    <div style="margin-top:24px;">
      <div style="background:#2563EB;color:#FFF;padding:10px 15px;border-radius:8px;margin-bottom:0;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:13px;font-weight:800;">Anexo — CVs adjuntos de candidatos</div>
          <div style="font-size:9px;opacity:0.75;margin-top:1px;">${conCvList.length} CV${conCvList.length !== 1 ? 's' : ''} · haz clic en "Descargar CV" en cada página</div>
        </div>
      </div>
    </div>
    ${pages}`;
})()}

<!-- FOOTER -->
<div style="margin-top:18px;padding-top:10px;border-top:1px solid #E5E7EB;display:flex;align-items:center;justify-content:space-between;">
  <span style="font-size:8px;color:#CCC;">Generado por BotGO · Grupo Ortiz · ${now}</span>
  <span style="font-size:8px;color:#CCC;">Reporte confidencial — uso interno de Recursos Humanos</span>
</div>

</body>
</html>`;
}

// ── Match candidato ↔ vacante ─────────────────────────────────────────────────
function candidatoMatchVacante(c, vacante) {
  const puesto = (c.puesto || '').toLowerCase().trim();
  const titulo = (vacante.titulo || '').toLowerCase().trim();
  const words  = titulo.split(/\s+/).filter(w => w.length > 3);
  return puesto && (titulo.includes(puesto) || puesto.includes(titulo) || words.some(w => puesto.includes(w)));
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST({ request }) {
  try {
    const body   = await request.json().catch(() => ({}));
    const { format = 'pdf', vacanteId = '', puesto: puestoFiltro = '' } = body;

    let [allCandidates, vacantes] = await Promise.all([
      readRecruitmentLeads().catch(() => []),
      readVacantes(true).catch(() => []),
    ]);

    let candidates;
    let puestoLabel = '';

    if (vacanteId === 'otro') {
      candidates  = allCandidates.filter(c => c.en_lista_espera === 1 || c.en_lista_espera === true);
      puestoLabel = 'Lista de espera';
    } else if (vacanteId) {
      const vacante = vacantes.find(v => String(v.id) === String(vacanteId));
      if (!vacante) return json({ ok: false, error: `Vacante ID ${vacanteId} no encontrada.` }, 404);
      candidates  = allCandidates.filter(c => candidatoMatchVacante(c, vacante));
      puestoLabel = vacante.titulo;
    } else if (puestoFiltro) {
      candidates  = allCandidates.filter(c => (c.puesto || '').toLowerCase().includes(puestoFiltro.toLowerCase()));
      puestoLabel = puestoFiltro;
    } else {
      candidates = allCandidates;
    }

    if (!candidates.length) {
      return json({ ok: false, error: puestoLabel ? `Sin candidatos para "${puestoLabel}".` : 'No hay candidatos registrados.' });
    }

    const logoBase64 = getLogoBase64();
    const aiScores   = await analyzeWithAI(candidates, vacantes);
    const html       = buildRecruitmentIAHTML(candidates, vacantes, aiScores, logoBase64, puestoLabel);

    if (format === 'html') {
      return json({ ok: true, html });
    }

    const pdfBuffer = await makePDF(html);
    const dateStr   = new Date().toISOString().split('T')[0];
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="Reporte_IA_Reclutamiento_${dateStr}.pdf"`,
        'Content-Length':      String(pdfBuffer.length),
      },
    });

  } catch (err) {
    console.error('[recruitment-ia]', err);
    return json({ ok: false, error: String(err) }, 500);
  }
}