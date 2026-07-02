// scripts/sync-safe.mjs
// Sync seguro: solo actualiza campos específicos (img, traducciones) preservando el resto de Turso.
// Uso: node scripts/sync-safe.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@libsql/client';

const DATA_DIR = join(process.cwd(), 'src', 'data');

const db = createClient({
  url: 'libsql://analytics-botgo-juanpa.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzI0OTQ5MzMsImlkIjoiMDE5Y2IwZWEtMjcwMS03MTBiLWI1N2ItY2NiZTA4YmIzYmZlIiwicmlkIjoiMzVkODFiOTktM2NhZi00YjQ2LWFmOWEtZDUwN2NiMzRjOTAyIn0.a3rs0GF2vs4sGYi6yzdsxxV4PT5jdDTtlpmfQsExzTqseQRTbfFbxOWjJ4GF2suJCD1MDmKbdpEoy4CCeUL3Ag'
});

const CATALOGS = [
  'catalogo-stretch.json', 'catalogo-acolchado.json', 'catalogo-arpilla.json',
  'catalogo-cuerda.json', 'catalogo-rafia.json', 'catalogo-flexible.json',
  'catalogo-saco.json', 'catalogo-esquinero.json', 'catalogo-naturizable.json',
  'catalogo-bolsas.json'
];

const slugMap = {
  'catalogo-stretch.json': 'digital-stretch-film',
  'catalogo-acolchado.json': 'digital-acolchado',
  'catalogo-arpilla.json': 'digital-arpilla',
  'catalogo-cuerda.json': 'digital-cuerda',
  'catalogo-rafia.json': 'digital-rafia',
  'catalogo-flexible.json': 'digital-flexible',
  'catalogo-saco.json': 'digital-saco',
  'catalogo-esquinero.json': 'digital-esquinero',
  'catalogo-naturizable.json': 'digital-naturizable',
  'catalogo-bolsas.json': 'digital-bolsas',
};

// Solo estos campos se actualizan desde el JSON seed. TODO lo demás se preserva de Turso.
const SAFE_FIELDS = {
  // cover
  'cover.t1': true,
  'cover.t2': true,
  'cover.division': true,
  // intro
  'intro.p1': true,
  'intro.p2': true,
  'intro.bioTitle': true,
  // productos (lista de nombres)
  'productos': true,
  // fichas: solo img, nombre, desc, specs.c/tol (texto traducido)
  'fichas.*.img': true,
  'fichas.*.nombre': true,
  'fichas.*.desc': true,
  'fichas.*.specs.*.c': true,
  'fichas.*.specs.*.tol': true,
  'fichas.*.sections': true,
  'fichas.*.colorTable': true,
  'fichas.*.matrix': true,
  'fichas.*.soon': true,
};

function deepSet(turso, seed, path = '') {
  if (seed === null || seed === undefined) return;
  if (turso === null || turso === undefined) return;

  if (Array.isArray(seed) && Array.isArray(turso)) {
    for (let i = 0; i < Math.min(seed.length, turso.length); i++) {
      deepSet(turso[i], seed[i], path ? `${path}[${i}]` : `[${i}]`);
    }
    // Agregar items nuevos del seed que no existen en turso
    for (let i = turso.length; i < seed.length; i++) {
      turso.push(JSON.parse(JSON.stringify(seed[i])));
      console.log(`  + nuevo ${path}[${i}]`);
    }
    return;
  }

  if (seed && typeof seed === 'object' && turso && typeof turso === 'object' && !Array.isArray(seed)) {
    for (const key of Object.keys(seed)) {
      const childPath = path ? `${path}.${key}` : key;

      // Si es campo seguro (texto/imagen), copiar del seed
      if (SAFE_FIELDS[childPath] || Object.keys(SAFE_FIELDS).some(p => {
        // Match con wildcards: fichas.*.img, fichas.*.specs.*.c
        const regex = new RegExp('^' + p.replace(/\./g, '\\.').replace(/\*/g, '\\d+') + '$');
        return regex.test(childPath);
      })) {
        turso[key] = JSON.parse(JSON.stringify(seed[key]));
        continue;
      }

      // Si es objeto multi-lang (es/en/pt/zh/ar), actualizar solo idiomas
      const LANGS = ['es', 'en', 'pt', 'zh', 'ar'];
      const isMultiLang = seed[key] && typeof seed[key] === 'object' && !Array.isArray(seed[key]) && LANGS.some(l => l in seed[key]);

      if (isMultiLang && turso[key] && typeof turso[key] === 'object') {
        // Solo actualizar idiomas específicos del seed, preservar el resto
        for (const lang of LANGS) {
          if (seed[key][lang] !== undefined) {
            if (!turso[key]) turso[key] = {};
            turso[key][lang] = seed[key][lang];
          }
        }
        continue;
      }

      // Recursivo para objetos anidados
      if (seed[key] && typeof seed[key] === 'object' && turso[key] && typeof turso[key] === 'object') {
        deepSet(turso[key], seed[key], childPath);
      }
    }
  }
}

async function main() {
  for (const file of CATALOGS) {
    const slug = slugMap[file];
    const seedPath = join(DATA_DIR, file);
    const seed = JSON.parse(readFileSync(seedPath, 'utf-8'));

    // Leer Turso actual
    const r = await db.execute({ sql: 'SELECT json FROM catalog_kv WHERE key = ?', args: [slug] });
    if (!r.rows.length) {
      console.log(`${slug}: no está en Turso — insertando completo`);
      await db.execute({
        sql: 'INSERT INTO catalog_kv (key, json, updated_at) VALUES (?, ?, ?)',
        args: [slug, JSON.stringify(seed), Date.now()],
      });
      continue;
    }

    const turso = JSON.parse(r.rows[0].json);

    // Merge seguro: seed → turso (solo campos seguros)
    deepSet(turso, seed);

    // Guardar en Turso
    await db.execute({
      sql: 'UPDATE catalog_kv SET json = ?, updated_at = ? WHERE key = ?',
      args: [JSON.stringify(turso), Date.now(), slug],
    });

    console.log(`${slug}: merge seguro ✅`);
  }
  console.log('\n✅ Sync seguro completo. Visual settings preservados.');
}

main().catch(e => { console.error(e); process.exit(1); });
