// src/pages/api/catalogo-pdf.js
// Genera el PDF del catalogo digital con Puppeteer.
// HTML compartido viene de catalogo-builder.js (no importar como modulo junto con GET/POST).
export const prerender = false;
export const config = { maxDuration: 60 };

import { existsSync } from 'fs';
import { getCatalog } from '../../lib/catalog-store.js';
import { getCatalogMeta } from '../../lib/catalogs.js';
import { verifyAdminToken } from '../../lib/verifyAdminToken.ts';
import { buildHTML, setCatFolders, preloadImages } from '../../lib/catalogo-builder.js';

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

async function generatePDF(html) {
  const { executablePath, args, headless } = await getBrowserConfig();
  let browser;
  try {
    const puppeteer = (await import('puppeteer-core')).default;
    browser = await puppeteer.launch({ executablePath, args, headless });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    // Imagenes ya son base64 inline — no hay peticiones externas, domcontentloaded es suficiente.
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    try { await page.evaluateHandle('document.fonts.ready'); } catch (e) {}
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
    const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    return Buffer.from(pdf);
  } finally {
    await browser?.close();
  }
}

// PDF FIEL: captura cada slide del deck tal cual se ve en la web y los une.
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
    setCatFolders(meta.imgFolder, meta.coverImgFolder);

    const rawData = await getCatalog(slug);
    const data = await preloadImages(rawData);
    const html = buildHTML(theme, lang, data);
    if (url.searchParams.get('debug') === 'html') return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    const pdf = await generatePDF(html);

    const cleanTitle = (meta.title || 'Productos').replace(/\s+/g, '-');
    const filename = `Catalogo-${cleanTitle}-Grupo-Ortiz.pdf`;

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

// POST: vista previa del PDF con datos en vivo del editor (SIN guardar en Turso).
// Solo admin. body: { slug, lang, theme, data, format } — format 'html' (rapido) o 'pdf'.
export async function POST({ request }) {
  try {
    const role = await verifyAdminToken(request).catch(() => null);
    const ok = role && (role.isAdminRole || (Array.isArray(role.tabs) && role.tabs.includes('catalogo')));
    if (!ok) return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

    const body = await request.json();
    const theme = body.theme || 'dark';
    const lang = body.lang || 'es';
    const slug = body.slug || 'digital-stretch-film';
    const rawData = body.data || await getCatalog(slug);

    const meta = getCatalogMeta(slug);
    setCatFolders(meta.imgFolder, meta.coverImgFolder);

    const data = await preloadImages(rawData);
    const html = buildHTML(theme, lang, data);
    if ((body.format || 'html') === 'html') {
      return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
    }
    const pdf = await generatePDF(html);
    return new Response(pdf, { status: 200, headers: { 'Content-Type': 'application/pdf', 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('[catalogo-pdf POST]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
