// Reemplaza polipropileno→polietileno en catalog_kv digital-bolsas (Turso).
// Uso: node scripts/fix-bolsas-polietileno.mjs
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SLUG = 'digital-bolsas';

for (const line of readFileSync(join(ROOT, '.env'), 'utf-8').split('\n')) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const r = await client.execute({ sql: 'SELECT json FROM catalog_kv WHERE key = ?', args: [SLUG] });

if (!r.rows.length) {
  console.log('digital-bolsas no encontrado en Turso — seed se usará al primer acceso.');
  process.exit(0);
}

let raw = r.rows[0].json;
const before = (raw.match(/polipropileno|Polipropileno|polypropylene|Polypropylene/gi) || []).length;

raw = raw
  .replace(/polipropileno/gi, m => m[0] === 'P' ? 'Polietileno' : 'polietileno')
  .replace(/polypropylene/gi, m => m[0] === 'P' ? 'Polyethylene' : 'polyethylene');

await client.execute({
  sql: `INSERT INTO catalog_kv (key, json, updated_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET json=excluded.json, updated_at=excluded.updated_at`,
  args: [SLUG, raw, Date.now()],
});
console.log(`Turso actualizado: ${before} reemplazos en digital-bolsas.`);
process.exit(0);
