// src/pages/api/catalogo-general-html.js
// HTML combinado con TODAS las divisiones — para impresion cliente (window.print).
// Sin Puppeteer. El navegador del cliente renderiza y genera el PDF.
export const prerender = false;

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { CATALOGS, getDivTitle, DIVISION_WORD } from '../../lib/catalogs.js';
import { buildHTML } from '../../lib/catalogo-builder.js';
import { getCatalog } from '../../lib/catalog-store.js';

// ── Fonts (self-hosteadas, sin red) ──
function asset(relPath, mime) {
  try {
    const abs = join(process.cwd(), 'public', relPath);
    if (!existsSync(abs)) return '';
    return `data:${mime};base64,${readFileSync(abs).toString('base64')}`;
  } catch { return ''; }
}

function getMorganiteFontFace() {
  const b64 = asset('fonts/Morganite-ExtraBold.ttf', 'font/ttf');
  return b64 ? `@font-face{font-family:'Morganite';src:url('${b64}') format('truetype');font-weight:800;font-style:normal;}` : '';
}

// ── CSS portada ──
function wrapCSS(theme, lang) {
  const isDark = theme === 'dark';
  const BG = isDark ? '#1b1b1c' : '#f5f5f7';
  const TEXT = isDark ? '#ffffff' : '#1b1b1c';
  const MUTED = isDark ? '#c9c9cc' : '#6f6f72';
  const ORANGE = '#fb670b';
  const langFont = lang === 'zh' ? 'Noto Sans SC' : lang === 'ar' ? 'Noto Naskh Arabic' : '';
  // Cadena de fallback: Morganite para latin/numeros, fuente del idioma para CJK/AR.
  const TXT_FONT = `'Morganite'${langFont ? `, '${langFont}'` : ''}, sans-serif`;
  return `
    .pg.gc { display: flex; align-items: center; justify-content: center; background: ${BG}; }
    .gchero { text-align: center; width: 100%; display: flex; flex-direction: column; align-items: center; font-family: ${langFont ? `'${langFont}', ` : ''}Arial, Helvetica, sans-serif; }
    .gclogo { font-family: ${TXT_FONT}; font-weight: 800; font-size: 18px; letter-spacing: .16em; text-indent: .16em; color: ${MUTED}; margin-bottom: 8px; }
    .gctitle { font-family: ${TXT_FONT}; font-weight: 800; font-size: 96px; letter-spacing: .02em; color: ${ORANGE}; margin: 0; line-height: .9; }
    .gcsub { font-family: ${TXT_FONT}; font-weight: 800; font-size: 28px; letter-spacing: .08em; text-indent: .08em; color: ${MUTED}; margin-top: 8px; text-transform: uppercase; }
    .gcd { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 16px; margin-top: 44px; max-width: 820px; }
    .di { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border: 1px solid rgba(0,0,0,.08); border-radius: 12px; background: ${isDark ? 'rgba(255,255,255,.04)' : '#fff'}; }
    .din { font-family: ${TXT_FONT}; font-weight: 800; font-size: 28px; color: ${ORANGE}; min-width: 36px; text-align: right; }
    .dit { display: flex; flex-direction: column; }
    .dname { font-family: ${TXT_FONT}; font-weight: 800; font-size: 20px; letter-spacing: .04em; text-transform: uppercase; }
    .dsub { font-size: 10px; color: ${MUTED}; }
    .gcfooter { font-family: ${TXT_FONT}; font-weight: 800; font-size: 32px; letter-spacing: .12em; text-indent: .12em; color: ${MUTED}; margin-top: 40px; text-transform: uppercase; text-align: center; }
    .gcyear { position: absolute; right: 44px; bottom: 10px; font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 140px; color: ${ORANGE}; opacity: .1; line-height: 1; }
  `;
}

// ── Portada ──
const COVER_LABELS = {
  es: { title: 'CATÁLOGO GENERAL', subtitle: 'TODAS LAS DIVISIONES GRUPO ORTIZ', footer: 'Soluciones en Polímeros Plásticos' },
  en: { title: 'GENERAL CATALOG', subtitle: 'ALL DIVISIONS GRUPO ORTIZ', footer: 'Plastic Polymer Solutions' },
  pt: { title: 'CATÁLOGO GERAL', subtitle: 'TODAS AS DIVISÕES GRUPO ORTIZ', footer: 'Soluções em Polímeros Plásticos' },
  zh: { title: '总目录', subtitle: '所有部门 · Grupo Ortiz', footer: '塑料聚合物解决方案' },
  ar: { title: 'الكتالوج العام', subtitle: 'جميع الأقسام · Grupo Ortiz', footer: 'حلول البوليمرات البلاستيكية' }
};

function generalCoverHTML(lang, theme) {
  const l = COVER_LABELS[lang] || COVER_LABELS.es;
  const divisionWord = DIVISION_WORD[lang] || DIVISION_WORD.es;
  const divisions = CATALOGS.map((c, i) =>
    `<div class="di"><span class="din">${String(i + 1).padStart(2, '0')}</span><div class="dit"><span class="dname">${getDivTitle(c.slug, lang)}</span><span class="dsub">${divisionWord}</span></div></div>`
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

    // Google Fonts pedido con &text= = solo trae los glifos realmente usados (subset on-the-fly).
    let fontLink = '';
    if (lang === 'zh' || lang === 'ar') {
      const l = COVER_LABELS[lang];
      const divisionWord = DIVISION_WORD[lang] || DIVISION_WORD.es;
      const textChars = [...new Set([l.title, l.subtitle, l.footer, divisionWord,
        ...CATALOGS.map(c => getDivTitle(c.slug, lang))].join(''))]
        .filter(ch => ch.charCodeAt(0) > 0x2000)
        .join('');
      fontLink = lang === 'zh'
        ? `<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;800&text=${encodeURIComponent(textChars)}&display=block" rel="stylesheet">`
        : `<link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&text=${encodeURIComponent(textChars)}&display=block" rel="stylesheet">`;
    }

    // Construir todas las divisiones en paralelo
    const catJobs = await Promise.all(CATALOGS.map(async (cat) => {
      try {
        const raw = await getCatalog(cat.slug);
        if (!raw.coverImg) raw.coverImg = cat.coverImgFolder + '/portada.webp';
        if (!raw.cover) raw.cover = { t1: { es: cat.title }, t2: { es: '' }, division: { es: cat.division } };
        if (!raw.intro) raw.intro = { p1: { es: '' }, bioTitle: { es: '' }, p2: { es: '' } };
        if (!raw.styles) raw.styles = {};
        return buildHTML(theme, lang, raw, cat.imgFolder, cat.coverImgFolder);
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
<body>${bodies.join('')}
<script>window.onload=function(){setTimeout(function(){window.print();},600);}</script>
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
