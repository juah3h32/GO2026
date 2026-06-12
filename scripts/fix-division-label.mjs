// La portada ya muestra el nombre grande (ej CUERDA). El subtitulo no debe repetirlo:
// cover.division pasa a ser solo "DIVISION" (localizado). JSON seed + Turso vivo.
// Uso: node scripts/fix-division-label.mjs
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@libsql/client';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
for (const line of readFileSync(join(ROOT, '.env'), 'utf-8').split('\n')) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const DIVISION = { es: 'DIVISIÓN', en: 'DIVISION', pt: 'DIVISÃO', zh: '部门', ar: 'قسم' };

// 1) JSON seed
const dataDir = join(ROOT, 'src/data');
for (const f of readdirSync(dataDir).filter(n => /^catalogo-.*\.json$/.test(n))) {
  const obj = JSON.parse(readFileSync(join(dataDir, f), 'utf-8'));
  if (!obj.cover) obj.cover = {};
  obj.cover.division = { ...DIVISION };
  writeFileSync(join(dataDir, f), JSON.stringify(obj, null, 2) + '\n');
  console.log(`JSON ${f}: division -> solo DIVISION`);
}

// 2) Turso vivo
const client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const rows = await client.execute('SELECT key, json FROM catalog_kv');
for (const r of rows.rows) {
  const obj = JSON.parse(r.json);
  if (!obj.cover) obj.cover = {};
  obj.cover.division = { ...DIVISION };
  await client.execute({ sql: 'INSERT OR REPLACE INTO catalog_kv (key, json, updated_at) VALUES (?, ?, ?)', args: [r.key, JSON.stringify(obj), Date.now()] });
  console.log(`TURSO ${r.key}: division -> solo DIVISION`);
}
console.log('done');
