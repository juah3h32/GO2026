// src/lib/catalogs.js
// Registro de catalogos. Agregar un catalogo nuevo = 1 entrada aqui + su seed JSON.
import stretchSeed from '../data/catalogo-stretch.json';
import acolchadoSeed from '../data/catalogo-acolchado.json';
import arpillaSeed from '../data/catalogo-arpilla.json';
import cuerdaSeed from '../data/catalogo-cuerda.json';
import rafiaSeed from '../data/catalogo-rafia.json';
import flexibleSeed from '../data/catalogo-flexible.json';
import sacoSeed from '../data/catalogo-saco.json';
import esquineroSeed from '../data/catalogo-esquinero.json';
import naturizableSeed from '../data/catalogo-naturizable.json';
import bolsasSeed from '../data/catalogo-bolsas.json';

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
