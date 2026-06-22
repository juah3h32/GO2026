// src/pages/api/catalogo-general-html.js
// HTML combinado con TODAS las divisiones — para impresion cliente (window.print).
// Sin Puppeteer. El navegador del cliente renderiza y genera el PDF.
export const prerender = false;

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { CATALOGS } from '../../lib/catalogs.js';
import { buildHTML, setCatFolders } from '../../lib/catalogo-builder.js';
import { getCatalog } from '../../lib/catalog-store.js';

// ── Morganite font ──
function getMorganiteFontFace() {
  try {
    const abs = join(process.cwd(), 'public', 'fonts', 'Morganite-ExtraBold.ttf');
    if (!existsSync(abs)) return '';
    const b64 = readFileSync(abs).toString('base64');
    return `@font-face{font-family:'Morganite';src:url('data:font/ttf;base64,${b64}') format('truetype');font-weight:800;font-style:normal;}`;
  } catch { return ''; }
}

// ── CSS portada ──
function wrapCSS(theme, lang) {
  const isDark = theme === 'dark';
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

// ── Portada ──
function generalCoverHTML(lang, theme) {
  const labels = {
    es: { title: 'CATÁLOGO GENERAL', subtitle: 'TODAS LAS DIVISIONES GRUPO ORTIZ', footer: 'Soluciones en Polímeros Plásticos' },
    en: { title: 'GENERAL CATALOG', subtitle: 'ALL DIVISIONS GRUPO ORTIZ', footer: 'Plastic Polymer Solutions' },
    pt: { title: 'CATÁLOGO GERAL', subtitle: 'TODAS AS DIVISÕES GRUPO ORTIZ', footer: 'Soluções em Polímeros Plásticos' },
    zh: { title: '总目录', subtitle: '所有部门 · Grupo Ortiz', footer: '塑料聚合物解决方案' },
    ar: { title: 'الكتالوج العام', subtitle: 'جميع الأقسام · Grupo Ortiz', footer: 'حلول البوليمرات البلاستيكية' }
  };
  const l = labels[lang] || labels.es;
  const divisions = CATALOGS.map((c, i) =>
    `<div class="di"><span class="din">${String(i + 1).padStart(2, '0')}</span><div class="dit"><span class="dname">${c.title}</span><span class="dsub">${c.division}</span></div></div>`
  ).join('');

  return `<div class="pg gc">
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

export async function GET({ url }) {
  try {
    const lang = url.searchParams.get('lang') || 'es';
    const theme = url.searchParams.get('theme') || 'dark';
    const isRTL = lang === 'ar';

    const fontLink = lang === 'zh'
      ? '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;800&display=swap" rel="stylesheet">'
      : lang === 'ar'
      ? '<link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&display=swap" rel="stylesheet">'
      : '';

    // Construir todas las divisiones en paralelo
    const catJobs = await Promise.all(CATALOGS.map(async (cat) => {
      try {
        const raw = await getCatalog(cat.slug);
        if (!raw.coverImg) raw.coverImg = cat.coverImgFolder + '/portada.webp';
        if (!raw.cover) raw.cover = { t1: { es: cat.title }, t2: { es: '' }, division: { es: cat.division } };
        if (!raw.intro) raw.intro = { p1: { es: '' }, bioTitle: { es: '' }, p2: { es: '' } };
        if (!raw.styles) raw.styles = {};
        setCatFolders(cat.imgFolder, cat.coverImgFolder);
        return buildHTML(theme, lang, raw);
      } catch (e) {
        console.error('[catalogo-general-html] Build error ' + cat.slug, e);
        return null;
      }
    }));

    // Combinar HTMLs
    const bodies = [];
    const styles = [];

    // Portada
    styles.push(getMorganiteFontFace() + wrapCSS(theme, lang));
    bodies.push(generalCoverHTML(lang, theme));

    for (const html of catJobs.filter(Boolean)) {
      const bm = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      const sm = html.match(/<style[^>]*>([\s\S]*)<\/style>/i);
      if (bm) bodies.push(bm[1]);
      if (sm) styles.push(sm[1].replace(/@page\s*\{[^}]*\}/g, ''));
    }

    const uniqueCSS = [...new Set(styles)].join('\n');
    const extraCSS = '.pg.cover::after,.pg.cover.manyprods::after{content:none!important} .pg:last-child{page-break-after:auto}';

    const combinedHTML = `<!doctype html><html lang="${lang}" dir="${isRTL ? 'rtl' : 'ltr'}">
<head><meta charset="utf-8">
<link rel="preconnect" href="https://res.cloudinary.com" crossorigin>
${fontLink}
<style>${uniqueCSS} ${extraCSS}</style>
<style>@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }</style>
</head>
<body>${bodies.join('')}</body>
<script>window.onload=function(){setTimeout(function(){window.print();},400);}</script>
</html>`;

    return new Response(combinedHTML, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    console.error('[catalogo-general-html]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
