// src/lib/catalogs.js
// Registro de catalogos. Agregar un catalogo nuevo = 1 entrada aqui + su seed JSON.
import stretchSeed from '../data/catalogo-stretch.json' with { type: 'json' };
import acolchadoSeed from '../data/catalogo-acolchado.json' with { type: 'json' };
import arpillaSeed from '../data/catalogo-arpilla.json' with { type: 'json' };
import cuerdaSeed from '../data/catalogo-cuerda.json' with { type: 'json' };
import rafiaSeed from '../data/catalogo-rafia.json' with { type: 'json' };
import flexibleSeed from '../data/catalogo-flexible.json' with { type: 'json' };
import sacoSeed from '../data/catalogo-saco.json' with { type: 'json' };
import esquineroSeed from '../data/catalogo-esquinero.json' with { type: 'json' };
import naturizableSeed from '../data/catalogo-naturizable.json' with { type: 'json' };
import bolsasSeed from '../data/catalogo-bolsas.json' with { type: 'json' };

export const CATALOGS = [
  {
    slug: 'digital-stretch-film',
    title: 'Stretch Film',
    division: 'Division Stretch',
    imgFolder: 'stretch',     // carpeta local de imagenes de fichas
    coverImgFolder: 'catalogos',
    seed: stretchSeed
  },
  {
    slug: 'digital-acolchado',
    title: 'Acolchado',
    division: 'Division Acolchado',
    imgFolder: 'acolchado',
    coverImgFolder: 'acolchado',
    seed: acolchadoSeed
  },
  { slug: 'digital-arpilla',     title: 'Arpilla',     division: 'Division Arpilla',     imgFolder: 'arpillas',    coverImgFolder: 'arpillas',    seed: arpillaSeed },
  { slug: 'digital-cuerda',      title: 'Cuerda',      division: 'Division Cuerda',      imgFolder: 'cuerdas',     coverImgFolder: 'cuerdas',     seed: cuerdaSeed },
  { slug: 'digital-rafia',       title: 'Rafia',       division: 'Division Rafia',       imgFolder: 'rafias',      coverImgFolder: 'rafias',      seed: rafiaSeed },
  { slug: 'digital-flexible',    title: 'Empaque Flexible', division: 'Division Flexible', imgFolder: 'flexible', coverImgFolder: 'flexible', seed: flexibleSeed },
  { slug: 'digital-saco',        title: 'Saco',        division: 'Division Saco',        imgFolder: 'sacos',       coverImgFolder: 'sacos',       seed: sacoSeed },
  { slug: 'digital-esquinero',   title: 'Esquinero',   division: 'Division Esquinero',   imgFolder: 'esquinero',   coverImgFolder: 'esquinero',   seed: esquineroSeed },
  { slug: 'digital-naturizable', title: 'Naturizable', division: 'Division Naturizable', imgFolder: 'naturizable', coverImgFolder: 'naturizable', seed: naturizableSeed },
  { slug: 'digital-bolsas',      title: 'Bolsas',      division: 'Division Bolsas',      imgFolder: 'bolsas',      coverImgFolder: 'bolsas',      seed: bolsasSeed }
  // Para agregar otro catalogo:
  // { slug: 'xxx', title: '...', division: '...', imgFolder: 'xxx', coverImgFolder: 'xxx',
  //   seed: (import del archivo src/data/catalogo-xxx.json) }
];

export function getCatalogMeta(slug) {
  return CATALOGS.find(c => c.slug === slug) || CATALOGS[0];
}

export function listCatalogsMeta() {
  return CATALOGS.map(c => ({ slug: c.slug, title: c.title, division: c.division, products: (c.seed?.fichas || []).length }));
}

// Titulo de cada division traducido — usado en picker de divisiones y portada del PDF general.
export const DIV_TITLES = {
  'digital-stretch-film':  { es: 'Stretch Film',       en: 'Stretch Film',          pt: 'Stretch Film',          zh: '拉伸膜',       ar: 'فيلم تمديد' },
  'digital-acolchado':     { es: 'Acolchado',           en: 'Padding',               pt: 'Acolchoado',            zh: '填充垫',       ar: 'مبطن' },
  'digital-arpilla':       { es: 'Arpilla',             en: 'Mesh Bag',              pt: 'Arpilha',               zh: '网袋',         ar: 'كيس شبكي' },
  'digital-cuerda':        { es: 'Cuerda',              en: 'Rope',                  pt: 'Corda',                 zh: '绳索',         ar: 'حبل' },
  'digital-rafia':         { es: 'Rafia',               en: 'Raffia',                pt: 'Ráfia',                 zh: '拉菲草',       ar: 'رافيا' },
  'digital-flexible':      { es: 'Empaque Flexible',    en: 'Flexible Packaging',    pt: 'Embalagem Flexível',    zh: '软包装',       ar: 'تغليف مرن' },
  'digital-saco':          { es: 'Saco',                en: 'Woven Bag',             pt: 'Saco',                  zh: '编织袋',       ar: 'كيس' },
  'digital-esquinero':     { es: 'Esquinero',           en: 'Corner Guard',          pt: 'Cantoneira',            zh: '护角',         ar: 'حامي الزوايا' },
  'digital-naturizable':   { es: 'Naturizable',         en: 'Biodegradable',         pt: 'Naturizável',           zh: '可降解',       ar: 'قابل للتحلل' },
  'digital-bolsas':        { es: 'Bolsas',              en: 'Bags',                  pt: 'Bolsas',                zh: '袋子',         ar: 'أكياس' },
};

// Palabra generica "DIVISION" traducida — usada como subtitulo en la portada del PDF general.
export const DIVISION_WORD = { es: 'DIVISIÓN', en: 'DIVISION', pt: 'DIVISÃO', zh: '部门', ar: 'قسم' };

export function getDivTitle(slug, lang) {
  return DIV_TITLES[slug]?.[lang] || DIV_TITLES[slug]?.es || slug;
}

// Etiqueta plural de cada pagina de producto (para anchor text de "productos relacionados").
export const PRODUCT_PAGE_LABELS = {
  'sacos':               { es: 'Sacos',              en: 'Woven Bags',      pt: 'Sacos',               zh: '编织袋',   ar: 'أكياس' },
  'arpillas':            { es: 'Arpillas',            en: 'Mesh Bags',       pt: 'Arpilhas',            zh: '网袋',     ar: 'أكياس شبكية' },
  'bolsas':              { es: 'Bolsas',              en: 'Bags',            pt: 'Bolsas',              zh: '袋子',     ar: 'أكياس' },
  'cuerdas':             { es: 'Cuerdas',             en: 'Ropes',           pt: 'Cordas',              zh: '绳索',     ar: 'حبال' },
  'rafias':              { es: 'Rafias',              en: 'Raffia',          pt: 'Ráfias',              zh: '拉菲草',   ar: 'رافيا' },
  'esquineros':          { es: 'Esquineros',          en: 'Corner Guards',   pt: 'Cantoneiras',         zh: '护角',     ar: 'حماية الزوايا' },
  'stretch-film':        { es: 'Stretch Film',        en: 'Stretch Film',    pt: 'Stretch Film',        zh: '拉伸膜',   ar: 'فيلم تمديد' },
  'acolchado':           { es: 'Acolchado',           en: 'Padding',         pt: 'Acolchoado',          zh: '填充垫',   ar: 'مبطن' },
  'naturizable':         { es: 'Naturizable',         en: 'Biodegradable',   pt: 'Naturizável',         zh: '可降解',   ar: 'قابل للتحلل' },
  'empaques-flexibles':  { es: 'Empaques Flexibles',  en: 'Flexible Packaging', pt: 'Embalagens Flexíveis', zh: '软包装', ar: 'تغليف مرن' },
};

// Mapa de productos complementarios — usado para internal linking contextual
// ("productos relacionados") entre las 10 paginas de producto.
export const RELATED_PRODUCTS = {
  'sacos':              ['rafias', 'arpillas', 'cuerdas'],
  'arpillas':           ['sacos', 'rafias', 'empaques-flexibles'],
  'bolsas':             ['empaques-flexibles', 'naturizable', 'stretch-film'],
  'cuerdas':            ['rafias', 'esquineros', 'sacos'],
  'rafias':             ['sacos', 'arpillas', 'cuerdas'],
  'esquineros':         ['cuerdas', 'stretch-film', 'empaques-flexibles'],
  'stretch-film':       ['empaques-flexibles', 'esquineros', 'naturizable'],
  'acolchado':          ['empaques-flexibles', 'naturizable', 'bolsas'],
  'naturizable':        ['bolsas', 'empaques-flexibles', 'acolchado'],
  'empaques-flexibles': ['bolsas', 'stretch-film', 'naturizable'],
};

export const LOCALITY_TAG_TEXT = {
  es: 'Hecho en Morelia, Michoacán',
  en: 'Made in Morelia, Michoacán',
  pt: 'Feito em Morelia, Michoacán',
  zh: '产自莫雷利亚，米却肯州',
  ar: 'صُنع في موريليا، ميتشواكان',
};

export const RELATED_PRODUCTS_HEADING = {
  es: 'Productos relacionados en Morelia',
  en: 'Related products in Morelia',
  pt: 'Produtos relacionados em Morelia',
  zh: '莫雷利亚相关产品',
  ar: 'منتجات ذات صلة في موريليا',
};

export function getRelatedProducts(slug, lang) {
  return (RELATED_PRODUCTS[slug] || []).map((s) => ({
    slug: s,
    label: PRODUCT_PAGE_LABELS[s]?.[lang] || PRODUCT_PAGE_LABELS[s]?.es || s,
  }));
}
