// Elimina el simbolo ® de TODOS los catalogos: archivos JSON (seed) y Turso (vivo).
// Recorre recursivamente cada string. Uso: node scripts/strip-registered-mark.mjs
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

let count = 0;
function strip(v) {
  if (typeof v === 'string') { if (v.includes('®')) count++; return v.replace(/®/g, ''); }
  if (Array.isArray(v)) return v.map(strip);
  if (v && typeof v === 'object') { const o = {}; for (const k in v) o[k] = strip(v[k]); return o; }
  return v;
}

// 1) JSON seed
const dataDir = join(ROOT, 'src/data');
for (const f of readdirSync(dataDir).filter(n => /^catalogo-.*\.json$/.test(n))) {
  count = 0;
  const obj = strip(JSON.parse(readFileSync(join(dataDir, f), 'utf-8')));
  writeFileSync(join(dataDir, f), JSON.stringify(obj, null, 2) + '\n');
  console.log(`JSON ${f}: ${count} ® eliminados`);
}

// 2) Turso (vivo)
const client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const rows = await client.execute('SELECT key, json FROM catalog_kv');
for (const r of rows.rows) {
  count = 0;
  const obj = strip(JSON.parse(r.json));
  if (count > 0) {
    await client.execute({ sql: 'INSERT OR REPLACE INTO catalog_kv (key, json, updated_at) VALUES (?, ?, ?)', args: [r.key, JSON.stringify(obj), Date.now()] });
    console.log(`TURSO ${r.key}: ${count} ® eliminados`);
  } else {
    console.log(`TURSO ${r.key}: sin ®`);
  }
}
console.log('done');
