// src/pages/api/catalogo-pdf.js
// Genera el PDF del catalogo digital (division Stretch Film) con Puppeteer
// — mismo stack que los reportes (send-now): @sparticuz/chromium-min + page.pdf.
// Publico (descarga directa). Fuente de datos: src/lib/catalogo-stretch.js.
export const prerender = false;
export const config = { maxDuration: 60 };

import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import { translations } from '../../i18n';
import { getCatalog } from '../../lib/catalog-store.js';
import { getCatalogMeta } from '../../lib/catalogs.js';

const ORANGE = '#fb670b';
let CURRENT_FOLDER = 'stretch';
let COVER_FOLDER = 'catalogos';

// Helper de traduccion
const T = (obj, lang) => obj && obj[lang] ? obj[lang] : (obj && obj.es ? obj.es : obj);

// ── Chromium (igual que send-now.js) ──────────────────────────────────────────
const LOCAL_CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
];
const CHROMIUM_PACK_URL = process.env.CHROMIUM_PACK_URL
  || 'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar';

async function getBrowserConfig() {
  const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (isServerless) {
    const chromium = (await import('@sparticuz/chromium-min')).default;
    return {
      executablePath: await chromium.executablePath(CHROMIUM_PACK_URL),
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
      headless: chromium.headless,
    };
  }
  const fromEnv = process.env.CHROME_PATH;
  if (fromEnv && existsSync(fromEnv)) return { executablePath: fromEnv, args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true };
  for (const p of LOCAL_CHROME) if (existsSync(p)) return { executablePath: p, args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true };
  throw new Error('Chrome no encontrado. Define CHROME_PATH o instala Google Chrome.');
}

// ── Assets a base64 (no hay base URL en setContent) ───────────────────────────
function asset(relPath, mime) {
  try {
    const abs = join(process.cwd(), 'public', relPath);
    if (!existsSync(abs)) return '';
    return `data:${mime};base64,${readFileSync(abs).toString('base64')}`;
  } catch { return ''; }
}
function img(name) {
  if (!name) return '';
  if (/^https?:\/\//.test(name)) return name; // URL (Cloudinary): Puppeteer la carga
  if (name.startsWith('/')) return asset(name.replace(/^\//, ''), 'image/png');
  const folder = name.includes('portada') ? COVER_FOLDER : CURRENT_FOLDER;
  return asset(`images/${folder}/${name}`, 'image/png');
}
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// Estilos de texto guardados por campo (data-cd-path). Se setea en buildHTML.
let CAT_STYLES = {};
function styleStr(path) {
  const s = CAT_STYLES[path]; if (!s) return '';
  const p = [];
  if (s.fontSize) p.push('font-size:' + s.fontSize);
  if (s.fontWeight) p.push('font-weight:' + s.fontWeight);
  if (s.fontStyle) p.push('font-style:' + s.fontStyle);
  if (s.textAlign) p.push('text-align:' + s.textAlign);
  if (s.color) p.push('color:' + s.color);
  return p.length ? ` style="${p.join(';')}"` : '';
}

// ── Header repetido (logo + sitio) ────────────────────────────────────────────
function header(t) {
  return `<div class="bar">
    <div class="logo">
      <span class="l1">${esc(t.catalogTitlePart1 || "CATÁLOGO DE")}</span>
      <span class="l2">» <i>${esc(t.catalogTitlePart2 || "PRODUCTOS")}</i></span>
    </div>
    <div class="site"><span class="line"></span>GRUPO-ORTIZ.COM</div>
  </div>`;
}

function tabla(specs, t, fi) {
  const rows = specs.map((s, j) => `
    <tr class="${s.hl ? 'hl' : ''}">
      <td class="c"${styleStr(`fichas.${fi}.specs.${j}.c`)}>${esc(s.c)}</td>
      <td class="n">${esc(s.min)}</td>
      <td class="n">${esc(s.max)}</td>
      <td class="n">${esc(s.tol)}</td>
      <td class="n">${esc(s.uni)}</td>
      <td class="n" style="font-size: 10px;">${esc(s.met)}</td>
    </tr>`).join('');
  return `<table class="t">
    <thead>
      <tr>
        <th class="o" rowspan="2">${esc(t.characteristics || "CARACTERÍSTICAS")}</th>
        <th class="g" colspan="2">${esc(t.measurement || "MEDICIÓN")}</th>
        <th class="o" rowspan="2">${esc(t.tolerances || "TOLERANCIAS")}</th>
        <th class="g" rowspan="2">${esc(t.unit || "UNIDAD")}</th>
        <th class="o" rowspan="2">${esc(t.testMethod || "MÉTODO DE PRUEBA")}</th>
      </tr>
      <tr>
        <th class="g" style="font-size: 8px;">${esc(t.min || "MÍNIMO")}</th>
        <th class="g" style="font-size: 8px;">${esc(t.max || "MÁXIMO")}</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody></table>`;
}

function paginaProducto(f, i, t, isDark) {
  const media = `<div class="media"><div class="media-tf" style="transform: translate(${f.visual?.offsetX || 0}%, ${f.visual?.offsetY || 0}%) scale(${f.visual?.scale || 1}) rotate(${f.visual?.rotate || 0}deg);"><img src="${img(f.img)}" alt=""/></div></div>`;
  const copy = `<div class="copy"><h2${styleStr(`fichas.${i}.nombre`)}>${esc(f.nombre)}</h2><p${styleStr(`fichas.${i}.desc`)}>${esc(f.desc)}</p></div>`;
  return `<div class="pg prod">
    ${header(t)}
    <div class="head">${copy}${media}</div>
    ${tabla(f.specs, t, i)}
  </div>`;
}

export function buildHTML(theme = 'dark', lang = 'es', data = {}) {
  const font = asset('fonts/Morganite-ExtraBold.ttf', 'font/ttf');
  const fontFace = font ? `@font-face{font-family:'Morganite';src:url('${font}') format('truetype');font-weight:800;font-style:normal;}` : '';

  // Fuentes para idiomas no-latinos (se cargan via red durante la generacion del PDF)
  const isRTL = lang === 'ar';
  const cjkAr = lang === 'zh' ? "'Noto Sans SC', " : lang === 'ar' ? "'Noto Naskh Arabic', " : '';
  const fontLink = lang === 'zh'
    ? '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;800&display=swap" rel="stylesheet">'
    : lang === 'ar'
    ? '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&display=swap" rel="stylesheet">'
    : '';

  const intro = data.intro, productos = data.productos, fichas = data.fichas, coverImg = data.coverImg, cover = data.cover || {};
  const vc = data.visualCover || { scale: 1, offsetX: 0, offsetY: 0, rotate: 0 };
  CAT_STYLES = data.styles || {};

  const t = translations[lang] || translations.es;
  
  // Traducir datos
  const introTr = {
    p1: T(intro.p1, lang),
    bioTitle: T(intro.bioTitle, lang),
    p2: T(intro.p2, lang)
  };
  const coverTr = {
    t1: T(cover.t1, lang),
    t2: T(cover.t2, lang),
    division: T(cover.division, lang)
  };
  const productosTr = productos.map(p => T(p, lang));
  const fichasTr = fichas.map(f => ({
    ...f,
    nombre: T(f.nombre, lang),
    desc: T(f.desc, lang),
    specs: f.specs.map(s => ({ ...s, c: T(s.c, lang), tol: T(s.tol, lang) }))
  }));

  const lista = productosTr.map(p => `<li>- ${esc(p)}</li>`).join('');

  const isDark = theme === 'dark';
  const BG = isDark ? '#1b1b1c' : '#f5f5f7';
  const BG2 = isDark ? '#232324' : '#ffffff';
  const TEXT = isDark ? '#ffffff' : '#1b1b1c';
  const MUTED = isDark ? '#c9c9cc' : '#6f6f72';
  const BORDER = isDark ? '#444' : '#ddd';
  const ROW_ALT = isDark ? '#232324' : '#fcfcfc';

  const portada = `<div class="pg cover">
    ${header(t)}
    <div class="cover-grid">
      <div class="cover-left">
        <h1>
          <span class="o">${esc(coverTr.t1 || '')}</span> 
          ${coverTr.t2 ? `<span class="gray">${esc(coverTr.t2)}</span>` : ''}
        </h1>
        <div class="divis">${esc(coverTr.division || t.division || "DIVISIÓN")}</div>
        <p${styleStr('intro.p1')}>${esc(introTr.p1)}</p>
        <p class="bio"${styleStr('intro.bioTitle')}>${esc(introTr.bioTitle)}</p>
        <p${styleStr('intro.p2')}>${esc(introTr.p2)}</p>
      </div>
      <div class="cover-right">
        <div class="cover-imgbox">
          <div class="cover-imgtf" style="transform: translate(${vc.offsetX}%, ${vc.offsetY}%) scale(${vc.scale}) rotate(${vc.rotate || 0}deg);">
            <img src="${img(coverImg)}" alt=""/>
          </div>
        </div>
        <div class="prods"><span>${esc(t.products || "Productos")}:</span><ul>${lista}</ul></div>
      </div>
    </div>
  </div>`;

  const productPages = fichasTr.map((f, i) => paginaProducto(f, i, t, isDark)).join('');

  return `<!doctype html><html lang="${lang}" dir="${isRTL ? 'rtl' : 'ltr'}"><head><meta charset="utf-8">${fontLink}<style>
    ${fontFace}
    @page { size: 1280px 720px; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body, td, th, p, li, span, div { font-family: ${cjkAr}Arial, Helvetica, sans-serif; }
    .logo, .l1, .l2, .divis, .cover-left h1, .cover-left h1 span, .copy h2 { font-family: 'Morganite', ${cjkAr}sans-serif; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; }
    .pg { position: relative; width: 1280px; height: 720px; background: ${BG}; color: ${TEXT};
          overflow: hidden; padding: 100px 64px 44px; page-break-after: always; }
    .pg:last-child { page-break-after: auto; }
    /* Fichas: contenido centrado verticalmente para espacios simetricos */
    .pg.prod { display: flex; flex-direction: column; justify-content: center; gap: 26px; }
    .bar { position: absolute; top: 34px; left: 64px; right: 64px; display: flex; justify-content: space-between; align-items: flex-start; }
    .logo { display: flex; flex-direction: column; line-height: .8; font-family: 'Morganite', sans-serif; font-weight: 800; }
    .l1 { font-size: 18px; letter-spacing: .04em; color: ${TEXT}; }
    .l2 { font-size: 26px; letter-spacing: .04em; color: ${ORANGE}; }
    .site { display: flex; align-items: center; gap: 10px; font-size: 11px; letter-spacing: .14em; color: ${MUTED}; margin-top: 8px; }
    .line { width: 44px; height: 2px; background: ${ORANGE}; }

    /* Portada */
    .cover-grid { display: grid; grid-template-columns: 1.65fr 1fr; gap: 36px; height: 100%; align-items: center; }
    .cover-left { max-width: 100%; }
    .cover-left h1 { font-family: 'Morganite', ${cjkAr}sans-serif; font-weight: 800; font-size: 136px; line-height: .82; letter-spacing: .01em; margin: 0; white-space: nowrap; }
    .cover-left h1 span { display: inline; }
    .o { color: ${ORANGE}; } .gray { color: #9a9a9c; }
    .divis { font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 32px; letter-spacing: .04em; margin: 6px 0 20px; }
    .cover-left p { font-size: 13.5px; line-height: 1.55; color: ${MUTED}; margin: 0 0 12px; max-width: 92%; }
    .cover-left .bio { color: ${ORANGE}; font-weight: 700; margin-top: 10px; margin-bottom: 6px; }
    .cover-right { position: relative; height: 100%; }
    .cover-imgbox { position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 520px; display: flex; justify-content: flex-end; z-index: 1; }
    .cover-imgtf { width: 100%; display: flex; justify-content: flex-end; }
    .cover-imgtf img { width: 100%; max-height: 500px; object-fit: contain; filter: drop-shadow(0 30px 60px rgba(0,0,0,${isDark ? 0.6 : 0.25})); }
    .prods { position: absolute; right: 0; bottom: 34px; text-align: right; z-index: 2; }
    .prods span { color: #9a9a9c; font-size: 13px; }
    .prods ul { list-style: none; margin: 8px 0 0; padding: 0; }
    .prods li { font-size: 13px; color: ${MUTED}; padding: 3px 0; }

    /* Paginas de producto */
    .head { display: grid; grid-template-columns: 1.25fr 1fr; gap: 40px; align-items: center; margin: 0; height: 250px; }
    .media { position: relative; z-index: 0; height: 100%; display: flex; align-items: center; justify-content: center; }
    .media-tf { width: 100%; display: flex; align-items: center; justify-content: center; }
    .media img { max-width: 100%; max-height: 230px; width: auto; object-fit: contain; filter: drop-shadow(0 25px 40px rgba(0,0,0,${isDark ? 0.6 : 0.2})); pointer-events: none; }
    .copy { position: relative; z-index: 2; }
    .copy h2 { font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 62px; line-height: .92; margin: 0 0 14px; color: ${TEXT}; }
    .copy p { font-size: 13px; line-height: 1.5; color: ${MUTED}; margin: 0; max-width: 95%; }

    /* Tabla */
    .t { width: 100%; border-collapse: collapse; font-size: 12.5px; position: relative; z-index: 3; background: ${BG}; }
    .t th, .t td { padding: 7px 12px; text-align: center; border: 1px solid ${BORDER}; }
    .t thead th { font-weight: 800; color: #fff; font-size: 12.5px; letter-spacing: .02em; }
    .t .o { background: ${ORANGE}; } .t .g { background: #333; }
    .t tbody td { background: ${BG2}; color: ${TEXT}; }
    .t tbody tr:nth-child(even) td { background: ${ROW_ALT}; }
    .t .c { text-align: left; color: ${TEXT}; font-weight: 400; text-transform: capitalize; }
    .t .n { color: ${TEXT}; font-weight: 400; }
    .t .hl td { background: rgba(251,103,11,0.04); }
    .t .hl .c { color: ${ORANGE}; font-weight: 600; }
  </style></head><body>${portada}${productPages}</body></html>`;
}

async function generatePDF(html) {
  const { executablePath, args, headless } = await getBrowserConfig();
  let browser;
  try {
    const puppeteer = (await import('puppeteer-core')).default;
    browser = await puppeteer.launch({ executablePath, args, headless });
    const page = await browser.newPage();
    // Mismo soporte que los reportes de resumen (vector, nitido).
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle2', timeout: 45_000 });
    const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    return Buffer.from(pdf);
  } finally {
    await browser?.close();
  }
}

// PDF FIEL: captura cada slide del deck tal cual se ve en la web y los une.
// Ancho de escritorio estandar para que el espaciado/tamaños (clamp por vw) salgan como en la web.
const SHOT_W = 1440, SHOT_H = 1280;
async function generatePDFFromSlides(target) {
  const { executablePath, args, headless } = await getBrowserConfig();
  let browser;
  try {
    const puppeteer = (await import('puppeteer-core')).default;
    browser = await puppeteer.launch({ executablePath, args, headless });
    const page = await browser.newPage();
    await page.setViewport({ width: SHOT_W, height: SHOT_H, deviceScaleFactor: 3 });
    await page.goto(target, { waitUntil: 'networkidle2', timeout: 60_000 });
    try { await page.evaluateHandle('document.fonts.ready'); } catch (e) {}

    const n = await page.evaluate(() => window.__cdN || 0);
    if (!n) throw new Error('modo captura no disponible');

    const shots = [];
    for (let i = 0; i < n; i++) {
      await page.evaluate(async (j) => {
        window.__cdGo(j);
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
        var slide = document.querySelectorAll('.cd-slide')[j];
        var imgs = slide ? Array.prototype.slice.call(slide.querySelectorAll('img')) : [];
        await Promise.all(imgs.map(function (im) { return im.complete ? null : new Promise(function (res) { im.addEventListener('load', res); im.addEventListener('error', res); }); }));
      }, i);
      await new Promise(r => setTimeout(r, 300));
      const b64 = await page.screenshot({ type: 'png', encoding: 'base64', clip: { x: 0, y: 0, width: SHOT_W, height: SHOT_H } });
      shots.push(b64);
    }

    const pages = shots.map(b => `<div class="p"><img src="data:image/png;base64,${b}"/></div>`).join('');
    const doc = `<!doctype html><html><head><style>
      @page { size: ${SHOT_W}px ${SHOT_H}px; margin: 0; }
      * { margin: 0; padding: 0; }
      .p { width: ${SHOT_W}px; height: ${SHOT_H}px; page-break-after: always; overflow: hidden; }
      .p:last-child { page-break-after: auto; }
      .p img { width: ${SHOT_W}px; height: ${SHOT_H}px; display: block; }
    </style></head><body>${pages}</body></html>`;
    await page.setContent(doc, { waitUntil: 'load' });
    const pdf = await page.pdf({ width: `${SHOT_W}px`, height: `${SHOT_H}px`, printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    return Buffer.from(pdf);
  } finally {
    await browser?.close();
  }
}

export async function GET({ url }) {
  try {
    const theme = url.searchParams.get('theme') || 'dark';
    const lang = url.searchParams.get('lang') || 'es';
    const slug = url.searchParams.get('catalog') || 'digital-stretch-film';
    
    const meta = getCatalogMeta(slug);
    CURRENT_FOLDER = meta.imgFolder || 'stretch';
    COVER_FOLDER = meta.coverImgFolder || 'catalogos';

    const data = await getCatalog(slug);
    const html = buildHTML(theme, lang, data);
    const pdf = await generatePDF(html);
    
    const filename = slug === 'digital-acolchado' ? 'Catalogo-Acolchado-Grupo-Ortiz.pdf' : 'Catalogo-Stretch-Film-Grupo-Ortiz.pdf';

    return new Response(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err) {
    console.error('[catalogo-pdf]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
