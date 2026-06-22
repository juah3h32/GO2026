// src/lib/catalogo-builder.js
// Funciones compartidas de generacion HTML para catalogos digitales.
// Importado por catalogo-pdf.js y catalogo-general-pdf.js.
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import { translations } from '../i18n';

const ORANGE = '#fb670b';
let CURRENT_FOLDER = 'stretch';
let COVER_FOLDER = 'catalogos';
let CAT_STYLES = {};

const stripR = (s) => typeof s === 'string' ? s.replace(/®/g, '') : s;
const T = (obj, lang) => {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    const v = obj[lang];
    if (v !== undefined && v !== null && v !== '') return stripR(v);
    return stripR((obj.es !== undefined && obj.es !== null && obj.es !== '') ? obj.es : (Object.values(obj)[0] || ''));
  }
  return obj == null ? '' : stripR(obj);
};

export function setCatFolders(imgF, covF) { CURRENT_FOLDER = imgF || 'stretch'; COVER_FOLDER = covF || 'catalogos'; }

// ── Optimizacion Cloudinary ──────────────────────────────────────────
// Reduce el peso de las imagenes 70-80% sin perdida visible en PDF (1280x720).
// f_auto = mejor formato (webp/avif), w_N = ancho maximo, q_auto:eco = calidad optima.
function optimizeCloudinaryURL(url, maxWidth = 800) {
  if (!url || typeof url !== 'string') return url;
  if (!/res\.cloudinary\.com/.test(url)) return url;
  // Inserta transform params entre /upload/ y el resto
  return url.replace(
    /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload)\/(v\d+\/)?(.+)$/,
    `$1/f_auto,w_${maxWidth},q_auto:eco/$2$3`
  );
}

// ── Concurrency limiter ──────────────────────────────────────────────
async function batchPromises(tasks, limit = 6) {
  const results = new Array(tasks.length);
  let idx = 0;
  async function worker() {
    while (idx < tasks.length) {
      const i = idx++;
      try { results[i] = await tasks[i](); } catch (e) { results[i] = null; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, () => worker()));
  return results;
}

// Descarga una URL externa optimizada y la convierte a data-URI. Fallback: URL original.
async function urlToBase64(url, maxWidth = 500) {
  if (!url || !/^https?:\/\//.test(url)) return url;
  const optUrl = optimizeCloudinaryURL(url, maxWidth);
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(optUrl, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return url;
    const buf = await res.arrayBuffer();
    const mime = res.headers.get('content-type') || 'image/jpeg';
    return `data:${mime};base64,${Buffer.from(buf).toString('base64')}`;
  } catch { return url; }
}

// Precarga todas las imagenes externas (Cloudinary) del data a base64
// con concurrencia limitada y URLs optimizadas. Para Puppeteer sin peticiones de red.
export async function preloadImages(data) {
  const out = { ...data };
  if (out.coverImg && /^https?:\/\//.test(out.coverImg)) {
    out.coverImg = await urlToBase64(out.coverImg, 700); // portada: mas ancho
  }
  if (Array.isArray(out.fichas) && out.fichas.length) {
    const tasks = out.fichas.map((f, i) => {
      const url = (f.img && /^https?:\/\//.test(f.img)) ? f.img : null;
      return url ? () => urlToBase64(url, 500).then(b64 => { out.fichas[i] = { ...f, img: b64 }; }) : () => Promise.resolve();
    });
    await batchPromises(tasks, 6);
  }
  return out;
}

function asset(relPath, mime) {
  try {
    const abs = join(process.cwd(), 'public', relPath);
    if (!existsSync(abs)) return '';
    return `data:${mime};base64,${readFileSync(abs).toString('base64')}`;
  } catch { return ''; }
}
function img(name) {
  if (!name) return '';
  if (/^data:/.test(name)) return name; // ya es base64 (preloaded)
  if (/^https?:\/\//.test(name)) return optimizeCloudinaryURL(name, 500); // URL externa → optimizada para Puppeteer
  if (name.startsWith('/')) return asset(name.replace(/^\//, ''), 'image/png');
  const folder = name.includes('portada') ? COVER_FOLDER : CURRENT_FOLDER;
  return asset(`images/${folder}/${name}`, 'image/png');
}
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

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

function header(t) {
  return `<div class="bar">
    <div class="logo">
      <span class="l1">${esc(t.catalogTitlePart1 || "CATÁLOGO DE")}</span>
      <span class="l2">» <i>${esc(t.catalogTitlePart2 || "PRODUCTOS")}</i></span>
    </div>
    <div class="site"><span class="line"></span>GRUPO-ORTIZ.COM</div>
  </div>`;
}

function tabla(f, t, fi) {
  const { specs = [], single, cols = {} } = f;
  if (single) {
    const head = specs.map((s, j) => `<th class="${j % 2 === 0 ? 'o' : 'g'}"${styleStr(`fichas.${fi}.specs.${j}.c`)}>${esc(s.c)}</th>`).join('');
    const body = specs.map((s) => `<td class="n">${esc(s.min)}${s.uni ? (' ' + esc(s.uni)) : ''}</td>`).join('');
    return `<table class="t th"><thead><tr>${head}</tr></thead><tbody><tr>${body}</tr></tbody></table>`;
  }
  const rows = specs.map((s, j) => `
    <tr class="${s.hl ? 'hl' : ''}">
      <td class="c"${styleStr(`fichas.${fi}.specs.${j}.c`)}>${esc(s.c)}</td>
      <td class="n">${esc(s.min)}</td>
      <td class="n">${esc(s.max)}</td>
      ${cols.tol ? `<td class="n">${esc(s.tol)}</td>` : ''}
      ${cols.uni ? `<td class="n">${esc(s.uni)}</td>` : ''}
      ${cols.met ? `<td class="n" style="font-size: 10px;">${esc(s.met)}</td>` : ''}
    </tr>`).join('');
  return `<table class="t">
    <thead>
      <tr>
        <th class="o" rowspan="2">${esc(t.characteristics || "CARACTERÍSTICAS")}</th>
        <th class="g" colspan="2">${esc(t.measurement || "MEDICIÓN")}</th>
        ${cols.tol ? `<th class="o" rowspan="2">${esc(t.tolerances || "TOLERANCIAS")}</th>` : ''}
        ${cols.uni ? `<th class="g" rowspan="2">${esc(t.unit || "UNIDAD")}</th>` : ''}
        ${cols.met ? `<th class="o" rowspan="2">${esc(t.testMethod || "MÉTODO DE PRUEBA")}</th>` : ''}
      </tr>
      <tr>
        <th class="g" style="font-size: 8px;">${esc(t.min || "MÍNIMO")}</th>
        <th class="g" style="font-size: 8px;">${esc(t.max || "MÁXIMO")}</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody></table>`;
}

function matrixTabla(m) {
  const head = (m.headers || []).map((h, hi) => `<th class="${hi === 0 ? 'o' : 'g'}">${esc(h)}</th>`).join('');
  const body = (m.rows || []).map(r =>
    `<tr><td class="c">${esc(r.label)}</td>${(r.cells || []).map(c => `<td class="n">${esc(c)}</td>`).join('')}</tr>`
  ).join('');
  return `<div class="mtable">
    ${m.title ? `<div class="mtitle">${esc(m.title)}</div>` : ''}
    <table class="t mt">${head ? `<thead><tr>${head}</tr></thead>` : ''}<tbody>${body}</tbody></table>
    ${m.note ? `<div class="mnote">${esc(m.note)}</div>` : ''}
  </div>`;
}

function colorTabla(ct, ctl) {
  const body = (ct.rows || []).map(r =>
    `<tr><td class="c">${esc(r.color)}</td><td class="n">${esc(r.in)}</td><td class="n">${esc(r.yd)}</td></tr>`
  ).join('');
  return `<table class="t ct"><thead><tr><th class="o">${esc(ctl.color)}</th><th class="g">${esc(ctl.in)}</th><th class="g">${esc(ctl.yd)}</th></tr></thead><tbody>${body}</tbody></table>`;
}

function paginaProducto(f, i, t, isDark, ctl) {
  const mediaOverlay = f.soon ? `<div class="soon-overlay">
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    <span>${esc(t.soon || "PRÓXIMAMENTE")}</span>
  </div>` : '';
  const media = `<div class="media ${f.soon ? 'media-soon' : ''}"><div class="media-tf" style="transform: translate(${f.visual?.offsetX || 0}%, ${f.visual?.offsetY || 0}%) scale(${f.visual?.scale || 1}) rotate(${f.visual?.rotate || 0}deg); overflow: ${f.visual?.clip ? 'hidden' : 'visible'};"><img src="${img(f.img)}" alt="" style="transform: scale(${f.visual?.zoom || 1});${(f.visual?.clipTop || f.visual?.clipBottom) ? ` clip-path: inset(${f.visual?.clipTop || 0}% 0 ${f.visual?.clipBottom || 0}% 0);` : ''}"/></div>${mediaOverlay}</div>`;
  const copy = `<div class="copy"><h2${styleStr(`fichas.${i}.nombre`)}>${esc(f.nombre)}</h2><p${styleStr(`fichas.${i}.desc`)}>${esc(f.desc)}</p></div>`;
  const soonNote = f.soon ? `<div class="soon-note">${esc(t.soonNote || "")}</div>` : '';
  const tables = [];
  if (!f.soon) {
    if (f.specs && f.specs.length) tables.push(tabla(f, t, i));
    if (f.colorTable && f.colorTable.rows && f.colorTable.rows.length) tables.push(colorTabla(f.colorTable, ctl));
    if (f.matrix && f.matrix.rows && f.matrix.rows.length) tables.push(matrixTabla(f.matrix));
  }
  return `<div class="pg prod">
    ${header(t)}
    <div class="pg-fit">
      <div class="head">${copy}${media}</div>
      ${soonNote}
      ${tables.join('')}
    </div>
  </div>`;
}

export function buildHTML(theme = 'dark', lang = 'es', data = {}) {
  const font = asset('fonts/Morganite-ExtraBold.ttf', 'font/ttf');
  const fontFace = font ? `@font-face{font-family:'Morganite';src:url('${font}') format('truetype');font-weight:800;font-style:normal;}` : '';
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
  const UI = {
    es: { soon: 'PRÓXIMAMENTE', soonNote: 'Este producto estará disponible pronto.' },
    en: { soon: 'COMING SOON', soonNote: 'This product will be available soon.' },
    pt: { soon: 'EM BREVE', soonNote: 'Este produto estará disponível em breve.' },
    zh: { soon: '即将推出', soonNote: '该产品即将上市。' },
    ar: { soon: 'قريباً', soonNote: 'سيتوفر هذا المنتج قريباً.' }
  };
  const ui = UI[lang] || UI.es;
  const base = translations[lang] || translations.es;
  const t = { soon: ui.soon, soonNote: ui.soonNote, ...(base.digital_catalog || {}), ...(base.common || {}) };
  const introTr = { p1: T(intro.p1, lang), bioTitle: T(intro.bioTitle, lang), p2: T(intro.p2, lang) };
  const coverTr = { t1: T(cover.t1, lang), t2: T(cover.t2, lang), division: T(cover.division, lang) };
  const productosTr = (Array.isArray(fichas) && fichas.length) ? fichas.map(f => T(f.nombre, lang)) : productos.map(p => T(p, lang));
  const _ne = (v) => v !== '' && v !== null && v !== undefined;
  const fichasTr = (fichas || []).map(f => {
    const specs = (f.specs || []).map(s => ({
      ...s, c: T(s.c, lang), min: T(s.min, lang), max: T(s.max, lang),
      tol: T(s.tol, lang), uni: T(s.uni, lang), met: T(s.met, lang)
    }));
    const cols = { min: specs.some(s => _ne(s.min)), max: specs.some(s => _ne(s.max)), tol: specs.some(s => _ne(s.tol)), uni: specs.some(s => _ne(s.uni)), met: specs.some(s => _ne(s.met)) };
    const single = cols.min && !cols.max;
    const matrix = (f.matrix && Array.isArray(f.matrix.rows) && f.matrix.rows.length) ? {
      title: T(f.matrix.title, lang), note: T(f.matrix.note, lang),
      headers: (f.matrix.headers || []).map(h => T(h, lang)),
      rows: f.matrix.rows.map(r => ({ label: T(r.label, lang), cells: (r.cells || []).map(c => T(c, lang)) }))
    } : null;
    const colorTable = (f.colorTable && Array.isArray(f.colorTable.rows) && f.colorTable.rows.length) ? {
      rows: f.colorTable.rows.map(r => ({ color: T(r.color, lang), in: T(r.in, lang), yd: T(r.yd, lang) }))
    } : null;
    return { ...f, nombre: T(f.nombre, lang), desc: T(f.desc, lang), specs, cols, single, matrix, colorTable };
  });
  const CT_LABELS = {
    es: { color: 'Color', in: 'Medidas (pulgadas)', yd: 'Medidas (yardas)' },
    en: { color: 'Color', in: 'Measures (inches)', yd: 'Measures (yards)' },
    pt: { color: 'Cor', in: 'Medidas (polegadas)', yd: 'Medidas (jardas)' },
    zh: { color: '颜色', in: '尺寸（英寸）', yd: '尺寸（码）' },
    ar: { color: 'اللون', in: 'القياسات (بوصة)', yd: 'القياسات (ياردة)' }
  };
  const ctl = CT_LABELS[lang] || CT_LABELS.es;
  const lista = productosTr.map(p => `<li>- ${esc(p)}</li>`).join('');
  const manyProds = productosTr.length > 3;
  const prodsBlock = `<div class="prods${manyProds ? ' prods-row' : ''}"><span>${esc(t.products || "Productos")}:</span><ul>${lista}</ul></div>`;
  const isDark = theme === 'dark';
  const BG = isDark ? '#1b1b1c' : '#f5f5f7';
  const BG2 = isDark ? '#232324' : '#ffffff';
  const TEXT = isDark ? '#ffffff' : '#1b1b1c';
  const MUTED = isDark ? '#c9c9cc' : '#6f6f72';
  const BORDER = isDark ? '#444' : '#ddd';
  const ROW_ALT = isDark ? '#232324' : '#fcfcfc';
  const portada = `<div class="pg cover${manyProds ? ' manyprods' : ''}">
    <div class="bar"><div></div><div class="site"><span class="line"></span>GRUPO-ORTIZ.COM</div></div>
    <div class="cover-grid">
      <div class="cover-left">
        <h1>
          <span class="o" style="${styleStr('cover.t1')}">${esc(coverTr.t1 || '')}</span>
          ${coverTr.t2 ? `<span class="gray" style="${styleStr('cover.t2')}">${esc(coverTr.t2)}</span>` : ''}
        </h1>
        <div class="divis" style="${styleStr('cover.division')}">${esc(coverTr.division || t.division || "DIVISIÓN")}</div>
        <p${styleStr('intro.p1')}>${esc(introTr.p1)}</p>
        <p class="bio"${styleStr('intro.bioTitle')}>${esc(introTr.bioTitle)}</p>
        <p${styleStr('intro.p2')}>${esc(introTr.p2)}</p>
      </div>
      <div class="cover-right">
        <div class="cover-imgbox">
          <div class="cover-imgtf" style="transform: translate(${vc.offsetX}%, ${vc.offsetY}%) scale(${vc.scale}) rotate(${vc.rotate || 0}deg); overflow: ${vc.clip ? 'hidden' : 'visible'};">
            <img src="${img(coverImg)}" alt="" style="transform: scale(${vc.zoom || 1});${(vc.clipTop || vc.clipBottom) ? ` clip-path: inset(${vc.clipTop || 0}% 0 ${vc.clipBottom || 0}% 0);` : ''}"/>
          </div>
        </div>
        ${manyProds ? '' : prodsBlock}
      </div>
    </div>
    ${manyProds ? prodsBlock : ''}
  </div>`;
  const productPages = fichasTr.map((f, i) => paginaProducto(f, i, t, isDark, ctl)).join('');
  return `<!doctype html><html lang="${lang}" dir="${isRTL ? 'rtl' : 'ltr'}"><head><meta charset="utf-8">${fontLink}<style>
    ${fontFace}
    @page { size: 1280px 720px; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body, td, th, p, li, span, div { font-family: ${cjkAr}Arial, Helvetica, sans-serif; }
    .logo, .l1, .l2, .divis, .cover-left h1, .cover-left h1 span, .copy h2 { font-family: 'Morganite', ${cjkAr}sans-serif; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; }
    .pg { position: relative; width: 1280px; height: 720px; background: ${BG}; color: ${TEXT};
          overflow: hidden; padding: 80px 80px 44px; page-break-after: always; }
    .pg:last-child { page-break-after: auto; }
    .pg.cover::after { content: '2026'; position: absolute; right: 44px; bottom: 10px; color: ${ORANGE}; font-family: 'Morganite', ${cjkAr}sans-serif; font-weight: 800; font-size: 56px; line-height: 1; letter-spacing: .04em; z-index: 8; }
    .pg.prod { display: flex; flex-direction: column; justify-content: center; padding: 90px 80px 40px; isolation: isolate; }
    .pg-fit { display: flex; flex-direction: column; gap: 24px; transform-origin: center center; }
    .bar { position: absolute; top: 40px; left: 80px; right: 80px; display: flex; justify-content: space-between; align-items: flex-start; }
    .logo { display: flex; flex-direction: column; line-height: .8; font-family: 'Morganite', sans-serif; font-weight: 800; }
    .l1 { font-size: 20px; letter-spacing: .04em; color: ${TEXT}; }
    .l2 { font-size: 30px; letter-spacing: .04em; color: ${ORANGE}; }
    .site { display: flex; align-items: center; gap: 10px; font-size: 13px; letter-spacing: .14em; color: ${MUTED}; margin-top: 10px; }
    .line { width: 50px; height: 2px; background: ${ORANGE}; }
    .cover-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 40px; height: 100%; align-items: center; }
    .cover-left { max-width: 100%; }
    .cover-left h1 { font-family: 'Morganite', ${cjkAr}sans-serif; font-weight: 800; font-size: 160px; line-height: .8; letter-spacing: .01em; margin: 0; display: flex; flex-wrap: wrap; gap: 0 .22em; max-width: 100%; }
    .cover-left h1 span { display: inline; }
    .o { color: ${ORANGE}; } .gray { color: #9a9a9c; }
    .divis { font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 42px; letter-spacing: .04em; margin: 8px 0 24px; }
    .cover-left p { font-size: 15px; line-height: 1.5; color: ${MUTED}; margin: 0 0 12px; max-width: 70%; }
    .cover-left .bio { color: ${ORANGE}; font-weight: 700; margin-top: 12px; margin-bottom: 8px; font-size: 18px; }
    .cover-right { position: relative; height: 100%; }
    .cover-imgbox { position: absolute; right: -106px; top: 46%; transform: translateY(-50%); width: 585px; display: flex; justify-content: flex-end; z-index: 1; }
    .cover-imgtf { width: 100%; }
    .cover-imgtf img { width: 100%; height: auto; display: block; filter: drop-shadow(0 30px 60px rgba(0,0,0,${isDark ? 0.6 : 0.25})); }
    .prods { position: absolute; right: 0; bottom: 34px; text-align: right; z-index: 2; }
    .prods span { color: #9a9a9c; font-size: 15px; font-weight: 700; }
    .prods ul { list-style: none; margin: 10px 0 0; padding: 0; }
    .prods li { font-size: 15px; color: ${MUTED}; padding: 4px 0; font-weight: 600; }
    .cover.manyprods .cover-imgbox { top: 35%; }
    .prods-row { position: absolute; left: 80px; right: 80px; bottom: 40px; top: auto; text-align: left; z-index: 5; display: flex; align-items: baseline; gap: 8px 18px; flex-wrap: wrap; }
    .prods-row ul { display: flex; flex-wrap: wrap; gap: 4px 22px; margin: 0; padding: 0; list-style: none; }
    .prods-row li { padding: 0; }
    .head { display: grid; grid-template-columns: minmax(0,1.2fr) minmax(0,1fr); gap: 50px; align-items: center; margin: 0; height: 288px; }
    .media { position: relative; z-index: -1; height: 100%; display: flex; align-items: center; justify-content: flex-end; min-height: 288px; contain: layout; }
    .media-tf { width: 100%; height: 100%; display: flex; align-items: center; justify-content: flex-end; }
    .media img { width: 100%; max-width: 424px; max-height: 307px; object-fit: contain; filter: drop-shadow(0 25px 40px rgba(0,0,0,${isDark ? 0.6 : 0.2})); pointer-events: none; }
    .copy { position: relative; z-index: 2; }
    .copy h2 { font-family: 'Morganite', sans-serif; font-weight: 800; font-size: 84px; line-height: .85; margin: 0 0 16px; color: ${TEXT}; white-space: nowrap; }
    .copy p { font-size: 16px; line-height: 1.5; color: ${MUTED}; margin: 0; max-width: 95%; }
    .t { width: 100%; border-collapse: collapse; font-size: 14.5px; position: relative; z-index: 3; background: ${BG}; }
    .t th, .t td { padding: 9px 14px; text-align: center; border: 1px solid ${BORDER}; }
    .t thead th { font-weight: 800; color: #fff; font-size: 14.5px; letter-spacing: .02em; }
    .t .o { background: ${ORANGE}; } .t .g { background: #333; }
    .t tbody td { background: ${BG2}; color: ${TEXT}; }
    .t tbody tr:nth-child(even) td { background: ${ROW_ALT}; }
    .t .c { text-align: left; color: ${TEXT}; font-weight: 400; text-transform: capitalize; }
    .t .n { color: ${TEXT}; font-weight: 400; }
    .t .hl td { background: rgba(251,103,11,0.04); }
    .t .hl .c { color: ${ORANGE}; font-weight: 600; }
    .t.th { table-layout: fixed; }
    .t.th thead th { font-size: 13px; padding: 12px 10px; }
    .t.th tbody td { padding: 16px 10px; font-weight: 600; font-size: 16px; }
    .mtable { width: 100%; }
    .mtitle { background: ${ORANGE}; color: #fff; font-weight: 800; text-align: center; padding: 9px 10px; font-size: 14px; letter-spacing: .02em; border: 1px solid ${BORDER}; border-bottom: none; }
    .t.mt { font-size: 11.5px; table-layout: auto; }
    .t.mt th, .t.mt td { padding: 8px 8px; }
    .t.mt .c { text-align: left; white-space: nowrap; font-weight: 600; }
    .mnote { font-style: italic; color: ${MUTED}; font-size: 12px; margin-top: 8px; }
    .t.ct { font-size: 12px; }
    .t.ct .c { text-align: left; white-space: nowrap; font-weight: 600; }
    .media-soon img { filter: blur(5px) grayscale(0.2); }
    .soon-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.35); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #fff; z-index: 5; border-radius: 12px; }
    .soon-overlay span { font-family: 'Morganite', sans-serif; font-size: 38px; letter-spacing: .1em; font-weight: 800; }
    .soon-note { font-size: 16px; color: ${ORANGE}; font-weight: 700; margin-top: -10px; margin-bottom: 10px; }
  </style></head><body>${portada}${productPages}</body></html>`;
}
