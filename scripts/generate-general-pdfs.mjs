// scripts/generate-general-pdfs.mjs
// Genera los 10 PDFs del catalogo general (5 langs x 2 temas) y los sube a Cloudinary.
// Al subir con el mismo public_id Cloudinary sobreescribe — actualiza en tiempo real.
//
// Uso completo:           node scripts/generate-general-pdfs.mjs
// Solo un idioma/tema:    node scripts/generate-general-pdfs.mjs --lang=es --theme=dark

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { v2 as cloudinary } from 'cloudinary';

const LANGS  = ['es', 'en', 'pt', 'zh', 'ar'];
const THEMES = ['light', 'dark'];

const argLang  = process.argv.find(a => a.startsWith('--lang='))?.split('=')[1];
const argTheme = process.argv.find(a => a.startsWith('--theme='))?.split('=')[1];
const langs    = argLang  ? [argLang]  : LANGS;
const themes   = argTheme ? [argTheme] : THEMES;

cloudinary.config({
  cloud_name: process.env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfuzfdrat',
  api_key:    process.env.PUBLIC_CLOUDINARY_API_KEY    || '824916971229492',
  api_secret: process.env.CLOUDINARY_API_SECRET        || '6yZBA-JXp6EZ1AsIS_flhItPjNQ',
  secure:     true,
});

const LOCAL_CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
];

function getMorganiteFontFace() {
  try {
    const abs = join(process.cwd(), 'public', 'fonts', 'Morganite-ExtraBold.ttf');
    if (!existsSync(abs)) return '';
    const b64 = readFileSync(abs).toString('base64');
    return `@font-face{font-family:'Morganite';src:url('data:font/ttf;base64,${b64}') format('truetype');font-weight:800;font-style:normal;}`;
  } catch { return ''; }
}

function wrapCSS(theme, lang) {
  const isDark = theme === 'dark';
  const BG     = isDark ? '#1b1b1c' : '#f5f5f7';
  const TEXT   = isDark ? '#ffffff' : '#1b1b1c';
  const MUTED  = isDark ? '#c9c9cc' : '#6f6f72';
  const ORANGE = '#fb670b';
  return `
    .pg.gc { display: flex; align-items: center; justify-content: center; background: ${BG}; }
    .gchero { text-align: center; width: 100%; display: flex; flex-direction: column; align-items: center; }
    .gclogo { font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 18px; letter-spacing: .16em; text-indent: .16em; color: ${MUTED}; margin-bottom: 8px; }
    .gctitle { font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 96px; letter-spacing: .02em; color: ${ORANGE}; margin: 0; line-height: .9; }
    .gcsub { font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 28px; letter-spacing: .08em; text-indent: .08em; color: ${MUTED}; margin-top: 8px; text-transform: uppercase; }
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

function generalCoverHTML(lang, theme, CATALOGS) {
  const isDark = theme === 'dark';
  const BG     = isDark ? '#1b1b1c' : '#f5f5f7';
  const MUTED  = isDark ? '#c9c9cc' : '#6f6f72';
  const ORANGE = '#fb670b';
  const labels = {
    es: { title: 'CATÁLOGO GENERAL',  subtitle: 'TODAS LAS DIVISIONES GRUPO ORTIZ', footer: 'Soluciones en Polímeros Plásticos' },
    en: { title: 'GENERAL CATALOG',   subtitle: 'ALL DIVISIONS GRUPO ORTIZ',         footer: 'Plastic Polymer Solutions' },
    pt: { title: 'CATÁLOGO GERAL',    subtitle: 'TODAS AS DIVISÕES GRUPO ORTIZ',     footer: 'Soluções em Polímeros Plásticos' },
    zh: { title: '总目录',             subtitle: '所有部门 · Grupo Ortiz',             footer: '塑料聚合物解决方案' },
    ar: { title: 'الكتالوج العام',    subtitle: 'جميع الأقسام · Grupo Ortiz',        footer: 'حلول البوليمرات البلاستيكية' },
  };
  const l = labels[lang] || labels.es;
  const divisions = CATALOGS.map((c, i) =>
    `<div class="di"><span class="din">${String(i + 1).padStart(2, '0')}</span><div class="dit"><span class="dname">${c.title}</span><span class="dsub">${c.division}</span></div></div>`
  ).join('');
  return `<div class="pg gc"><div class="gchero"><div class="gclogo">GRUPO ORTIZ</div><h1 class="gctitle">${l.title}</h1><div class="gcsub">${l.subtitle}</div><div class="gcd">${divisions}</div><div class="gcfooter">${l.footer}</div></div><div class="gcyear">2026</div></div>`;
}

async function uploadToCloudinary(pdfBuffer, lang, theme) {
  const publicId = `catalogo-general/Catalogo-General-${lang.toUpperCase()}-${theme}`;
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'raw', public_id: publicId, overwrite: true, invalidate: true },
      (err, result) => err ? reject(err) : resolve(result)
    );
    stream.end(pdfBuffer);
  });
}

async function main() {
  const { CATALOGS }                                = await import('../src/lib/catalogs.js');
  const { getCatalog }                              = await import('../src/lib/catalog-store.js');
  const { buildHTML, setCatFolders, preloadImages } = await import('../src/lib/catalogo-builder.js');

  let chromePath = process.env.CHROME_PATH;
  if (!chromePath || !existsSync(chromePath)) {
    for (const p of LOCAL_CHROME) { if (existsSync(p)) { chromePath = p; break; } }
  }
  if (!chromePath) { console.error('Chrome no encontrado.'); process.exit(1); }

  const puppeteer = (await import('puppeteer-core')).default;
  console.log(`Chrome: ${chromePath}`);
  console.log(`Generando ${langs.length * themes.length} PDFs (langs=[${langs}] themes=[${themes}])\n`);

  let ok = 0, fail = 0;

  for (const lang of langs) {
    // Preload de datos y HTML — una vez por idioma, reutilizar para ambos temas
    console.log(`[${lang}] Cargando datos de catalogo...`);
    const catJobs = [];
    for (let i = 0; i < CATALOGS.length; i += 3) {
      const batch = CATALOGS.slice(i, i + 3);
      const results = await Promise.all(batch.map(async (cat) => {
        try {
          const raw = await getCatalog(cat.slug);
          if (!raw.coverImg) raw.coverImg = cat.coverImgFolder + '/portada.webp';
          if (!raw.cover)   raw.cover   = { t1: { es: cat.title }, t2: { es: '' }, division: { es: cat.division } };
          if (!raw.intro)   raw.intro   = { p1: { es: '' }, bioTitle: { es: '' }, p2: { es: '' } };
          if (!raw.styles)  raw.styles  = {};
          setCatFolders(cat.imgFolder, cat.coverImgFolder);
          const data = await preloadImages(raw);
          return { cat, data };
        } catch (e) {
          console.error(`  ${cat.slug} ERROR: ${e.message}`);
          return null;
        }
      }));
      catJobs.push(...results.filter(Boolean));
    }

    for (const theme of themes) {
      try {
        console.log(`  [${lang}-${theme}] Renderizando...`);

        const bodies = [generalCoverHTML(lang, theme, CATALOGS)];
        const styles = [getMorganiteFontFace() + wrapCSS(theme, lang)];

        for (const { cat, data } of catJobs) {
          setCatFolders(cat.imgFolder, cat.coverImgFolder);
          const html = buildHTML(theme, lang, data);
          const bm = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
          const sm = html.match(/<style[^>]*>([\s\S]*)<\/style>/i);
          if (bm) bodies.push(bm[1]);
          if (sm) styles.push(sm[1].replace(/@page\s*\{[^}]*\}/g, ''));
        }

        const isRTL    = lang === 'ar';
        const fontLink = lang === 'zh'
          ? '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;800&display=swap" rel="stylesheet">'
          : lang === 'ar'
          ? '<link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&display=swap" rel="stylesheet">'
          : '';
        const uniqueCSS = [...new Set(styles)].join('\n');
        const extraCSS  = '.pg.cover::after,.pg.cover.manyprods::after{content:none!important} .pg:last-child{page-break-after:auto}';
        const html = `<!doctype html><html lang="${lang}" dir="${isRTL ? 'rtl' : 'ltr'}"><head><meta charset="utf-8">${fontLink}<style>${uniqueCSS} ${extraCSS}</style></head><body>${bodies.join('')}</body></html>`;

        const browser = await puppeteer.launch({ executablePath: chromePath, args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true });
        let pdf;
        try {
          const page = await browser.newPage();
          await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1.0 });
          await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60_000 });
          await page.evaluate(() => Promise.all(
            Array.from(document.images).filter(i => !i.complete).map(i =>
              new Promise(r => { const t = setTimeout(r, 5_000); i.onload = i.onerror = () => { clearTimeout(t); r(); }; })
            )
          ));
          await page.evaluate(() => {
            const avail = 720 - 90 - 40, INNER_W = 1120;
            document.querySelectorAll('.pg.prod .copy h2').forEach(h => {
              const max = h.parentElement.clientWidth;
              let fs = parseFloat(getComputedStyle(h).fontSize), g = 0;
              while (h.scrollWidth > max && fs > 24 && g++ < 120) { fs -= 2; h.style.fontSize = fs + 'px'; }
            });
            document.querySelectorAll('.pg.prod .pg-fit').forEach(fit => {
              if (fit.scrollHeight <= avail) return;
              const s = avail / fit.scrollHeight, extra = INNER_W / s - INNER_W;
              fit.style.width = (INNER_W / s) + 'px';
              fit.style.marginLeft = fit.style.marginRight = (-extra / 2) + 'px';
              fit.style.transform = `scale(${s})`;
            });
          });
          pdf = Buffer.from(await page.pdf({ width: '1280px', height: '720px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } }));
        } finally {
          await browser.close();
        }

        const result = await uploadToCloudinary(pdf, lang, theme);
        console.log(`  [${lang}-${theme}] OK — ${(pdf.length / 1024 / 1024).toFixed(1)} MB → ${result.secure_url}`);
        ok++;
      } catch (e) {
        console.error(`  [${lang}-${theme}] ERROR: ${e.message}`);
        fail++;
      }
    }
  }

  console.log(`\nListo: ${ok} subidos, ${fail} errores.`);
}

main().catch(e => { console.error(e); process.exit(1); });
