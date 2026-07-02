// src/pages/api/catalogo-general-pdf.js
// Genera la portada del catalogo general (1 pagina A4 landscape) con Puppeteer.
// El frontend la fusiona con los PDFs individuales via pdf-lib.
export const prerender = false;
export const config = { maxDuration: 60 };

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { CATALOGS, getDivTitle, DIVISION_WORD } from '../../lib/catalogs.js';

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

function asset(relPath, mime) {
  try {
    const abs = join(process.cwd(), 'public', relPath);
    if (!existsSync(abs)) return '';
    return `data:${mime};base64,${readFileSync(abs).toString('base64')}`;
  } catch { return ''; }
}

function getMorganiteFont() {
  const b64 = asset('fonts/Morganite-ExtraBold.ttf', 'font/ttf');
  return b64 ? `@font-face{font-family:'Morganite';src:url('${b64}') format('truetype');font-weight:800;font-style:normal;}` : '';
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

  const divisionWord = DIVISION_WORD[lang] || DIVISION_WORD.es;
  const divisions = CATALOGS.map((c, i) =>
    `<div class="di"><span class="din">${String(i + 1).padStart(2, '0')}</span><div class="dit"><span class="dname">${getDivTitle(c.slug, lang)}</span><span class="dsub">${divisionWord}</span></div></div>`
  ).join('');

  // Texto unicode plano (sin CJK/AR) — Morganite no tiene esos glifos, hace falta
  // un fallback web-font explicito o el texto se ve en blanco en Chromium serverless.
  const textChars = [...new Set([l.title, l.subtitle, l.footer, divisionWord,
    ...CATALOGS.map(c => getDivTitle(c.slug, lang))].join(''))]
    .filter(ch => ch.charCodeAt(0) > 0x2000) // solo glifos no-latinos
    .join('');

  const langFont = lang === 'zh' ? 'Noto Sans SC' : lang === 'ar' ? 'Noto Naskh Arabic' : '';
  // Google Fonts pedido con &text= = solo trae los glifos realmente usados (subset on-the-fly,
  // rapido y completo). El subset local NotoSansSC-*.woff2 no cubre estos caracteres especificos.
  const fontLink = lang === 'zh'
    ? `<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;800&text=${encodeURIComponent(textChars)}&display=block" rel="stylesheet">`
    : lang === 'ar'
    ? `<link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&text=${encodeURIComponent(textChars)}&display=block" rel="stylesheet">`
    : '';
  // Cadena de fallback: Morganite para latin/numeros, fuente del idioma para CJK/AR.
  const TXT_FONT = `'Morganite'${langFont ? `, '${langFont}'` : ''}, sans-serif`;

  const css = `
    ${getMorganiteFont()}
    @page { size: 1280px 720px; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { margin: 0; background: ${BG}; color: ${TEXT}; font-family: ${langFont ? `'${langFont}', ` : ''}Arial, Helvetica, sans-serif; }
    .pg { position: relative; width: 1280px; height: 720px; overflow: hidden; background: ${BG};
          display: flex; align-items: center; justify-content: center; }
    .gchero { text-align: center; width: 100%; display: flex; flex-direction: column; align-items: center; }
    .gclogo { font-family: ${TXT_FONT}; font-weight: 800; font-size: 18px;
              letter-spacing: .16em; color: ${MUTED}; margin-bottom: 8px; }
    .gctitle { font-family: ${TXT_FONT}; font-weight: 800; font-size: 96px;
               letter-spacing: .02em; color: ${ORANGE}; margin: 0; line-height: .9; }
    .gcsub { font-family: ${TXT_FONT}; font-weight: 800; font-size: 28px;
             letter-spacing: .08em; color: ${MUTED}; margin-top: 8px; text-transform: uppercase; }
    .gcd { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 16px;
           margin-top: 44px; max-width: 820px; }
    .di { display: flex; align-items: center; gap: 8px; padding: 10px 16px;
          border: 1px solid rgba(${isDark ? '255,255,255' : '0,0,0'},.08);
          border-radius: 12px; background: ${isDark ? 'rgba(255,255,255,.04)' : '#fff'}; }
    .din { font-family: ${TXT_FONT}; font-weight: 800; font-size: 28px;
           color: ${ORANGE}; min-width: 36px; text-align: right; }
    .dit { display: flex; flex-direction: column; }
    .dname { font-family: ${TXT_FONT}; font-weight: 800; font-size: 20px;
             letter-spacing: .04em; text-transform: uppercase; color: ${TEXT}; }
    .dsub { font-size: 10px; color: ${MUTED}; }
    .gcfooter { font-family: ${TXT_FONT}; font-weight: 800; font-size: 32px;
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
      // networkidle0 (no domcontentloaded): para zh/ar el <link> de Google Fonts es una
      // peticion de red externa — con domcontentloaded el @font-face no llega a registrarse
      // todavia cuando se evalua document.fonts.ready (race: ready resuelve vacio = texto en blanco).
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 15_000 });
      try { await Promise.race([page.evaluate(() => document.fonts.ready), new Promise(r => setTimeout(r, 6000))]); } catch (_) {}
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
