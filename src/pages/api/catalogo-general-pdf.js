// src/pages/api/catalogo-general-pdf.js
// PDF unico con TODAS las divisiones — Catalogo General Grupo Ortiz.
export const prerender = false;
export const config = { maxDuration: 300 };

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { translations } from '../../i18n';
import { CATALOGS } from '../../lib/catalogs.js';
import { buildHTML, setCatFolders, preloadImages } from '../../lib/catalogo-builder.js';
import { getCatalog } from '../../lib/catalog-store.js';

// ── Morganite font para portada del catalogo general ──
function getMorganiteFontFace() {
  try {
    const abs = join(process.cwd(), 'public', 'fonts', 'Morganite-ExtraBold.ttf');
    if (!existsSync(abs)) return '';
    const b64 = readFileSync(abs).toString('base64');
    return `@font-face{font-family:'Morganite';src:url('data:font/ttf;base64,${b64}') format('truetype');font-weight:800;font-style:normal;}`;
  } catch { return ''; }
}

// ── CSS compartido (sin @page que ya viene en cada buildHTML) ────────
function wrapCSS(theme, lang) {
  const isDark = theme === 'dark';
  const isRTL = lang === 'ar';
  const BG = isDark ? '#1b1b1c' : '#f5f5f7';
  const TEXT = isDark ? '#ffffff' : '#1b1b1c';
  const MUTED = isDark ? '#c9c9cc' : '#6f6f72';
  const ORANGE = '#fb670b';
  return `
    .pg.gc { display: flex; align-items: center; justify-content: center; background: ${BG}; }
    .gchero { text-align: center; width: 100%; display: flex; flex-direction: column; align-items: center; }
    .gclogo { font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 18px; letter-spacing: .16em; text-indent: .16em; color: ${MUTED}; margin-bottom: 8px; }
    .gctitle { font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 96px; letter-spacing: .02em; color: ${ORANGE}; margin: 0; line-height: .9; }
    .gcsub { font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 28px; letter-spacing: .08em; text-indent: .08em; color: ${MUTED}; margin-top: 8px; text-transform: uppercase; }
    .gcsel { font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 52px; letter-spacing: .06em; color: ${TEXT}; margin-top: 4px; line-height: 1; text-transform: uppercase; }
    .gcd { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 16px; margin-top: 44px; max-width: 820px; }
    .di { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border: 1px solid rgba(0,0,0,.08); border-radius: 12px; background: ${isDark ? 'rgba(255,255,255,.04)' : '#fff'}; }
    .din { font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 28px; color: ${ORANGE}; min-width: 36px; text-align: right; }
    .dit { display: flex; flex-direction: column; }
    .dname { font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: .04em; text-transform: uppercase; }
    .dsub { font-size: 10px; color: ${MUTED}; }
    .gcfooter { font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 32px; letter-spacing: .12em; text-indent: .12em; color: ${MUTED}; margin-top: 40px; text-transform: uppercase; text-align: center; }
    .gcyear { position: absolute; right: 44px; bottom: 10px; font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 140px; color: ${ORANGE}; opacity: .1; line-height: 1; }
  `;
}

// ── Chromium ──────────────────────────────────────────────────────────
const LOCAL_CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome-stable', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
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

const ORANGE = '#fb670b';

// ── Portada del Catalogo General ──────────────────────────────────────
function generalCoverHTML(lang, theme) {
  const isDark = theme === 'dark';
  const BG = isDark ? '#1b1b1c' : '#f5f5f7';
  const TEXT = isDark ? '#ffffff' : '#1b1b1c';
  const MUTED = isDark ? '#c9c9cc' : '#6f6f72';
  const DIV_BG = isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.03)';
  const DIV_BORDER = isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)';

  const labels = {
    es: { title: 'CATÁLOGO GENERAL', subtitle: 'TODAS LAS DIVISIONES GRUPO ORTIZ', sel: 'SELECCIONES', footer: 'Soluciones en Polímeros Plásticos' },
    en: { title: 'GENERAL CATALOG', subtitle: 'ALL DIVISIONS GRUPO ORTIZ', sel: 'SELECTIONS', footer: 'Plastic Polymer Solutions' },
    pt: { title: 'CATÁLOGO GERAL', subtitle: 'TODAS AS DIVISÕES GRUPO ORTIZ', sel: 'SELEÇÕES', footer: 'Soluções em Polímeros Plásticos' },
    zh: { title: '总目录', subtitle: '所有部门 · Grupo Ortiz', sel: '精选', footer: '塑料聚合物解决方案' },
    ar: { title: 'الكتالوج العام', subtitle: 'جميع الأقسام · Grupo Ortiz', sel: 'تشكيلات', footer: 'حلول البوليمرات البلاستيكية' }
  };
  const l = labels[lang] || labels.es;

  const divisions = CATALOGS.map((c, i) =>
    `<div class="di">
      <span class="din">${String(i + 1).padStart(2, '0')}</span>
      <div class="dit"><span class="dname">${c.title}</span><span class="dsub">${c.division}</span></div>
    </div>`
  ).join('');

  return `<div class="pg gc">
    <div class="gc-bg"></div>
    <div class="gchero">
      <div class="gclogo">GRUPO ORTIZ</div>
      <h1 class="gctitle">${l.title}</h1>
      <div class="gcsub">${l.subtitle}</div>
      <div class="gcd">${divisions}</div>
      <div class="gcfooter">${l.footer}</div>
    </div>
    <div class="gcyear">2026</div>
  </div>`;
}

// ── Genera el PDF completo — render por division + merge con pdf-lib ──
async function renderPageHTML(browser, html, viewport = { width: 1280, height: 720 }) {
  const page = await browser.newPage();
  try {
    await page.setViewport({ ...viewport, deviceScaleFactor: 1.0 });
    await page.setContent(html, { waitUntil: 'networkidle2', timeout: 60_000 });
    // Esperar que todas las imagenes (Cloudinary) esten decodificadas
    await page.evaluate(() => Promise.all(
      Array.from(document.images).filter(img => !img.complete).map(img =>
        new Promise(resolve => { img.onload = img.onerror = resolve; })
      )
    ));
    try { await page.evaluateHandle('document.fonts.ready'); } catch (e) {}

    // Auto-fit para productos que no caben en 720px
    await page.evaluate(() => {
      const PAGE_H = 720, PAD_TOP = 90, PAD_BOTTOM = 40, INNER_W = 1120;
      const avail = PAGE_H - PAD_TOP - PAD_BOTTOM;
      document.querySelectorAll('.pg.prod .copy h2').forEach((h) => {
        const max = h.parentElement.clientWidth;
        let fs = parseFloat(getComputedStyle(h).fontSize), guard = 0;
        while (h.scrollWidth > max && fs > 24 && guard++ < 120) { fs -= 2; h.style.fontSize = fs + 'px'; }
      });
      document.querySelectorAll('.pg.prod .pg-fit').forEach((fit) => {
        if (fit.scrollHeight <= avail) return;
        const s = avail / fit.scrollHeight;
        const extra = INNER_W / s - INNER_W;
        fit.style.width = (INNER_W / s) + 'px';
        fit.style.marginLeft = (-extra / 2) + 'px';
        fit.style.marginRight = (-extra / 2) + 'px';
        fit.style.transform = `scale(${s})`;
      });
    });

    return await page.pdf({ width: '1280px', height: '720px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  } finally {
    await page.close();
  }
}

function wrapDivisionHTML(catHTML, lang, isRTL, fontLink) {
  const bodyMatch = catHTML.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const styleMatch = catHTML.match(/<style[^>]*>([\s\S]*)<\/style>/i);
  const css = styleMatch ? styleMatch[1].replace(/@page\s*\{[^}]*\}/g, '') : '';
  const body = bodyMatch ? bodyMatch[1] : catHTML;
  return `<!doctype html><html lang="${lang}" dir="${isRTL ? 'rtl' : 'ltr'}"><head><meta charset="utf-8">${fontLink}<style>${css} .pg.cover::after,.pg.cover.manyprods::after{content:none!important} .pg:last-child{page-break-after:auto}</style></head><body>${body}</body></html>`;
}

async function generateCombinedPDF(lang, theme) {
  const isRTL = lang === 'ar';
  const fontLink = lang === 'zh'
    ? '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;800&display=swap" rel="stylesheet">'
    : lang === 'ar'
    ? '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&display=swap" rel="stylesheet">'
    : '';

  // ── Fase 1: TODO en paralelo — chromium + datos Turso + buildHTML ──
  const [browserCfg, catJobs] = await Promise.all([
    getBrowserConfig(),
    Promise.all(CATALOGS.map(async (cat) => {
      try {
        const raw = await getCatalog(cat.slug);
        if (!raw.coverImg) raw.coverImg = cat.coverImgFolder + '/portada.webp';
        if (!raw.cover) raw.cover = { t1: { es: cat.title }, t2: { es: '' }, division: { es: cat.division } };
        if (!raw.intro) raw.intro = { p1: { es: '' }, bioTitle: { es: '' }, p2: { es: '' } };
        if (!raw.styles) raw.styles = {};
        setCatFolders(cat.imgFolder, cat.coverImgFolder);
        // Sin preloadImages: las imagenes quedan como URLs de Cloudinary.
        // Puppeteer las carga via networkidle2 + image wait en renderPageHTML.
        const html = buildHTML(theme, lang, raw);
        return { slug: cat.slug, html: wrapDivisionHTML(html, lang, isRTL, fontLink) };
      } catch (e) {
        console.error('[catalogo-general] Build error ' + cat.slug, e);
        return null;
      }
    }))
  ]);

  const { executablePath, args, headless } = browserCfg;
  const puppeteer = (await import('puppeteer-core')).default;
  const browser = await puppeteer.launch({ executablePath, args, headless });

  const pdfBuffers = [];
  try {
    // Portada general (sin imagenes externas — render inmediato)
    const coverFont = getMorganiteFontFace();
    const coverCSS = `<style>${coverFont}${wrapCSS(theme, lang)}</style>`;
    const coverDoc = `<!doctype html><html lang="${lang}" dir="${isRTL ? 'rtl' : 'ltr'}"><head><meta charset="utf-8">${fontLink}${coverCSS}</head><body>${generalCoverHTML(lang, theme)}</body></html>`;

    const allJobs = [{ slug: 'portada', html: coverDoc }, ...catJobs.filter(Boolean)];

    // Renderizar en paralelo — batches de 4
    const CONCURRENCY = 4;
    for (let i = 0; i < allJobs.length; i += CONCURRENCY) {
      const batch = allJobs.slice(i, i + CONCURRENCY);
      const results = await Promise.all(batch.map(job =>
        renderPageHTML(browser, job.html).then(buf => {
          console.log('[catalogo-general]', job.slug, 'OK', (buf.length / 1024 / 1024).toFixed(1) + 'MB');
          return buf;
        }).catch(e => {
          console.error('[catalogo-general] Render error ' + job.slug, e);
          return null;
        })
      ));
      for (const buf of results) if (buf) pdfBuffers.push(buf);
    }
  } finally {
    await browser.close();
  }

  if (!pdfBuffers.length) throw new Error('No se pudo generar ninguna pagina del catalogo general');

  // ── Merge con pdf-lib + numeracion ──
  const { PDFDocument, StandardFonts } = await import('pdf-lib');
  const merged = await PDFDocument.create();
  const font = await merged.embedFont(StandardFonts.Helvetica);

  for (const buf of pdfBuffers) {
    const src = await PDFDocument.load(buf);
    const pages = await merged.copyPages(src, src.getPageIndices());
    for (const p of pages) merged.addPage(p);
  }

  const total = merged.getPageCount();
  for (let i = 0; i < total; i++) {
    merged.getPage(i).drawText(`${i + 1} / ${total}`, {
      x: 1230, y: 16, size: 9, font,
      color: { r: 0, g: 0, b: 0, opacity: 0.25 },
    });
  }

  return Buffer.from(await merged.save());
}

export async function GET({ url }) {
  try {
    const lang = url.searchParams.get('lang') || 'es';
    const theme = url.searchParams.get('theme') || 'dark';

    const pdf = await generateCombinedPDF(lang, theme);
    const date = new Date().toISOString().slice(0, 10);
    const filename = `Catalogo-General-Grupo-Ortiz-${date}.pdf`;

    return new Response(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(pdf.length),
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err) {
    console.error('[catalogo-general-pdf]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
