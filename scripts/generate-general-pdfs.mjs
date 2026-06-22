// scripts/generate-general-pdfs.mjs
// Genera los 5 PDFs del catalogo general (es,en,pt,zh,ar) localmente.
// Usa Puppeteer local (sin timeout de Vercel).
// Output: public/downloads/catalogo-general-{lang}.pdf
//
// Uso: node scripts/generate-general-pdfs.mjs

import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const LANGS = ['es', 'en', 'pt', 'zh', 'ar'];
const OUT_DIR = join(process.cwd(), 'public', 'downloads');

// Dynamic import: la API es un modulo ESM de Astro
async function main() {
  // Importamos las funciones directamente (sin Astro runtime)
  const { CATALOGS } = await import('../src/lib/catalogs.js');
  const { getCatalog } = await import('../src/lib/catalog-store.js');
  const { buildHTML, setCatFolders, preloadImages } = await import('../src/lib/catalogo-builder.js');

  // Chrome local
  const LOCAL_CHROME = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  ];

  let chromePath = process.env.CHROME_PATH;
  if (!chromePath || !existsSync(chromePath)) {
    for (const p of LOCAL_CHROME) {
      if (existsSync(p)) { chromePath = p; break; }
    }
  }
  if (!chromePath) {
    console.error('Chrome no encontrado. Define CHROME_PATH.');
    process.exit(1);
  }

  const puppeteer = (await import('puppeteer-core')).default;
  console.log('Chrome:', chromePath);

  for (const lang of LANGS) {
    console.log(`\nGenerando ${lang}...`);

    // Fase 1: preloadImages para todas las divisiones
    const catJobs = [];
    for (const cat of CATALOGS) {
      try {
        const raw = await getCatalog(cat.slug);
        if (!raw.coverImg) raw.coverImg = cat.coverImgFolder + '/portada.webp';
        if (!raw.cover) raw.cover = { t1: { es: cat.title }, t2: { es: '' }, division: { es: cat.division } };
        if (!raw.intro) raw.intro = { p1: { es: '' }, bioTitle: { es: '' }, p2: { es: '' } };
        if (!raw.styles) raw.styles = {};
        setCatFolders(cat.imgFolder, cat.coverImgFolder);
        const data = await preloadImages(raw);
        const html = buildHTML('dark', lang, data);
        catJobs.push({ slug: cat.slug, html });
        console.log('  ' + cat.slug + ' OK');
      } catch (e) {
        console.error('  ' + cat.slug + ' ERROR:', e.message);
      }
    }

    if (!catJobs.length) {
      console.error('  Ninguna division generada para ' + lang);
      continue;
    }

    // Fase 2: Combinar HTMLs
    const bodies = [];
    const styles = [];
    for (const job of catJobs) {
      const bm = job.html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      const sm = job.html.match(/<style[^>]*>([\s\S]*)<\/style>/i);
      if (bm) bodies.push(bm[1]);
      if (sm) styles.push(sm[1].replace(/@page\s*\{[^}]*\}/g, ''));
    }

    const uniqueCSS = [...new Set(styles)].join('\n');
    const extraCSS = '.pg.cover::after,.pg.cover.manyprods::after{content:none!important} .pg:last-child{page-break-after:auto}';
    const combinedHTML = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>${uniqueCSS} ${extraCSS}</style></head><body>${bodies.join('')}</body></html>`;

    // Fase 3: Puppeteer
    const browser = await puppeteer.launch({
      executablePath: chromePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1.0 });
      await page.setContent(combinedHTML, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      await page.evaluate(() => Promise.all(
        Array.from(document.images).filter(img => !img.complete).map(img =>
          new Promise(resolve => {
            const t = setTimeout(resolve, 10_000);
            const done = () => { clearTimeout(t); resolve(); };
            img.onload = done; img.onerror = done;
          })
        )
      ));
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

      const pdf = await page.pdf({
        width: '1280px', height: '720px',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      });

      const outFile = join(OUT_DIR, `catalogo-general-${lang}.pdf`);
      writeFileSync(outFile, pdf);
      console.log(`  -> ${outFile} (${(pdf.length / 1024 / 1024).toFixed(1)} MB)`);
    } finally {
      await browser.close();
    }
  }

  console.log('\nListo. Archivos en public/downloads/');
}

main().catch(e => { console.error(e); process.exit(1); });
