// src/pages/api/catalogo-general-pdf.js
// Genera la portada del catalogo general (1 pagina A4 landscape) con Puppeteer.
// El frontend la fusiona con los PDFs individuales via pdf-lib.
export const prerender = false;
export const config = { maxDuration: 60 };

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { CATALOGS } from '../../lib/catalogs.js';

const LOCAL_CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
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
  if (fromEnv && existsSync(fromEnv)) return { executablePath: fromEnv, args: ['--no-sandbox'], headless: true };
  for (const p of LOCAL_CHROME) if (existsSync(p)) return { executablePath: p, args: ['--no-sandbox'], headless: true };
  throw new Error('Chrome no encontrado.');
}

function getMorganiteFont() {
  try {
    const abs = join(process.cwd(), 'public', 'fonts', 'Morganite-ExtraBold.ttf');
    if (!existsSync(abs)) return '';
    const b64 = readFileSync(abs).toString('base64');
    return `@font-face{font-family:'Morganite';src:url('data:font/ttf;base64,${b64}') format('truetype');font-weight:800;font-style:normal;}`;
  } catch { return ''; }
}

function buildCoverHTML(lang, theme) {
  const isDark = theme === 'dark';
  const BG    = isDark ? '#1b1b1c' : '#f5f5f7';
  const TEXT  = isDark ? '#ffffff' : '#1b1b1c';
  const MUTED = isDark ? '#c9c9cc' : '#6f6f72';
  const ORANGE = '#fb670b';

  const labels = {
    es: { title: 'CATÁLOGO GENERAL',  subtitle: 'TODAS LAS DIVISIONES GRUPO ORTIZ', footer: 'Soluciones en Polímeros Plásticos' },
    en: { title: 'GENERAL CATALOG',   subtitle: 'ALL DIVISIONS GRUPO ORTIZ',         footer: 'Plastic Polymer Solutions' },
    pt: { title: 'CATÁLOGO GERAL',    subtitle: 'TODAS AS DIVISÕES GRUPO ORTIZ',     footer: 'Soluções em Polímeros Plásticos' },
    zh: { title: '总目录',             subtitle: '所有部门 · Grupo Ortiz',             footer: '塑料聚合物解决方案' },
    ar: { title: 'الكتالوج العام',    subtitle: 'جميع الأقسام · Grupo Ortiz',        footer: 'حلول البوليمرات البلاستيكية' },
  };
  const l = labels[lang] || labels.es;
  const isRTL = lang === 'ar';

  const fontLink = lang === 'zh'
    ? '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;800&display=swap" rel="stylesheet">'
    : lang === 'ar'
    ? '<link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&display=swap" rel="stylesheet">'
    : '';

  const divisions = CATALOGS.map((c, i) =>
    `<div class="di"><span class="din">${String(i + 1).padStart(2, '0')}</span><div class="dit"><span class="dname">${c.title}</span><span class="dsub">${c.division}</span></div></div>`
  ).join('');

  const css = `
    ${getMorganiteFont()}
    @page { size: 1280px 720px; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { margin: 0; background: ${BG}; color: ${TEXT}; font-family: Arial, Helvetica, sans-serif; }
    .pg { position: relative; width: 1280px; height: 720px; overflow: hidden; background: ${BG};
          display: flex; align-items: center; justify-content: center; }
    .gchero { text-align: center; width: 100%; display: flex; flex-direction: column; align-items: center; }
    .gclogo { font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 18px;
              letter-spacing: .16em; color: ${MUTED}; margin-bottom: 8px; }
    .gctitle { font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 96px;
               letter-spacing: .02em; color: ${ORANGE}; margin: 0; line-height: .9; }
    .gcsub { font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 28px;
             letter-spacing: .08em; color: ${MUTED}; margin-top: 8px; text-transform: uppercase; }
    .gcd { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 16px;
           margin-top: 44px; max-width: 820px; }
    .di { display: flex; align-items: center; gap: 8px; padding: 10px 16px;
          border: 1px solid rgba(${isDark ? '255,255,255' : '0,0,0'},.08);
          border-radius: 12px; background: ${isDark ? 'rgba(255,255,255,.04)' : '#fff'}; }
    .din { font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 28px;
           color: ${ORANGE}; min-width: 36px; text-align: right; }
    .dit { display: flex; flex-direction: column; }
    .dname { font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 20px;
             letter-spacing: .04em; text-transform: uppercase; color: ${TEXT}; }
    .dsub { font-size: 10px; color: ${MUTED}; }
    .gcfooter { font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 32px;
                letter-spacing: .12em; color: ${MUTED}; margin-top: 40px; text-transform: uppercase; }
    .gcyear { position: absolute; right: 44px; bottom: 10px; font-family: 'Morganite', sans-serif;
              font-weight: 800; font-size: 140px; color: ${ORANGE}; opacity: .1; line-height: 1;
              user-select: none; pointer-events: none; }
  `;

  return `<!doctype html><html lang="${lang}" dir="${isRTL ? 'rtl' : 'ltr'}">
<head><meta charset="utf-8">${fontLink}<style>${css}</style></head>
<body>
  <div class="pg">
    <div class="gchero">
      <div class="gclogo">GRUPO ORTIZ</div>
      <h1 class="gctitle">${l.title}</h1>
      <div class="gcsub">${l.subtitle}</div>
      <div class="gcd">${divisions}</div>
      <div class="gcfooter">${l.footer}</div>
    </div>
    <div class="gcyear">2026</div>
  </div>
</body></html>`;
}

export async function GET({ url }) {
  try {
    const lang  = (url.searchParams.get('lang') || 'es').toLowerCase();
    const theme = url.searchParams.get('theme') || 'dark';

    const html = buildCoverHTML(lang, theme);
    const { executablePath, args, headless } = await getBrowserConfig();
    const puppeteer = (await import('puppeteer-core')).default;
    const browser = await puppeteer.launch({ executablePath, args, headless });

    let pdf;
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1.5 });
      const waitUntil = (lang === 'zh' || lang === 'ar') ? 'networkidle2' : 'domcontentloaded';
      await page.setContent(html, { waitUntil, timeout: 15_000 });
      pdf = Buffer.from(await page.pdf({
        width: '1280px', height: '720px',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      }));
    } finally {
      await browser.close();
    }

    return new Response(pdf, {
      status: 200,
      headers: { 'Content-Type': 'application/pdf', 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    console.error('[catalogo-general-pdf]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
