// Sincroniza el campo `intro` de cada catalogo (JSON seed -> Turso).
// Preserva todos los demas campos del registro en Turso (productos, fichas, matrix, styles, imagenes).
// Uso: node scripts/sync-intros-turso.mjs
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@libsql/client';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Cargar .env manualmente
for (const line of readFileSync(join(ROOT, '.env'), 'utf-8').split('\n')) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const SLUG_FILE = {
  'digital-stretch-film': 'catalogo-stretch.json',
  'digital-acolchado': 'catalogo-acolchado.json',
  'digital-arpilla': 'catalogo-arpilla.json',
  'digital-cuerda': 'catalogo-cuerda.json',
  'digital-rafia': 'catalogo-rafia.json',
  'digital-flexible': 'catalogo-flexible.json',
  'digital-saco': 'catalogo-saco.json',
  'digital-esquinero': 'catalogo-esquinero.json',
  'digital-naturizable': 'catalogo-naturizable.json',
  'digital-bolsas': 'catalogo-bolsas.json',
};

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

await client.execute(`CREATE TABLE IF NOT EXISTS catalog_kv (key TEXT PRIMARY KEY, json TEXT NOT NULL, updated_at INTEGER)`);

for (const [slug, file] of Object.entries(SLUG_FILE)) {
  const seed = JSON.parse(readFileSync(join(ROOT, 'src/data', file), 'utf-8'));
  const r = await client.execute({ sql: 'SELECT json FROM catalog_kv WHERE key = ?', args: [slug] });
  if (!r.rows.length) {
    console.log(`SKIP ${slug} (sin registro en Turso; usara seed)`);
    continue;
  }
  const live = JSON.parse(r.rows[0].json);
  const before = JSON.stringify(live.intro);
  live.intro = seed.intro; // solo intro
  if (JSON.stringify(live.intro) === before) {
    console.log(`OK   ${slug} (intro ya igual)`);
    continue;
  }
  await client.execute({
    sql: 'INSERT OR REPLACE INTO catalog_kv (key, json, updated_at) VALUES (?, ?, ?)',
    args: [slug, JSON.stringify(live), Date.now()],
  });
  console.log(`SYNC ${slug} -> intro actualizado`);
}
console.log('done');
