// Alinea las medidas del catalogo digital de stretch (Amplitud, Grosor, Largo)
// con las cards de la pagina de productos. Actualiza seed JSON + Turso.
// Uso: node scripts/fix-stretch-specs.mjs
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@libsql/client';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SEED = join(ROOT, 'src/data/catalogo-stretch.json');
const SLUG = 'digital-stretch-film';

for (const line of readFileSync(join(ROOT, '.env'), 'utf-8').split('\n')) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

// Medidas correctas por modelo (orden de fichas): [Amplitud, Grosor, Largo]
const M = [
  { amp: ['19', '30'], gro: ['40', '110'], lar: ['1000', '15000'], pes: ['10', '40'] }, // Stretch Premium
  { amp: ['18', '30'], gro: ['50', '110'], lar: ['2000', '15000'], pes: ['10', '49'] }, // Automatico
  { amp: ['16', '17'], gro: ['40', '120'], lar: ['7000', '25000'], pes: ['10', '40'] }, // Manual Preestirado
  { amp: ['3', '12'],  gro: ['40', '120'], lar: ['7000', '25000'], pes: ['10', '40'] }, // Manual Banding
  { amp: ['18', '20'], gro: ['60', '80'],  lar: ['1000', '2000'],  pes: ['3', '10'] },  // Coreles
  { amp: ['17', '30'], gro: ['40', '90'],  lar: ['1000', '15000'], pes: ['10', '40'] }, // Manual Rigido
];

function apply(fichas) {
  fichas.forEach((f, i) => {
    if (!M[i]) return;
    (f.specs || []).forEach((s) => {
      const c = (s.c && s.c.es ? s.c.es : s.c) || '';
      if (/amplitud/i.test(c)) { s.min = M[i].amp[0]; s.max = M[i].amp[1]; }
      else if (/grosor/i.test(c)) { s.min = M[i].gro[0]; s.max = M[i].gro[1]; }
      else if (/^largo/i.test(c)) { s.min = M[i].lar[0]; s.max = M[i].lar[1]; }
      else if (/peso/i.test(c)) { s.min = M[i].pes[0]; s.max = M[i].pes[1]; s.uni = 'kg'; }
    });
  });
}

// 1) Seed
const seed = JSON.parse(readFileSync(SEED, 'utf-8'));
apply(seed.fichas || []);
writeFileSync(SEED, JSON.stringify(seed, null, 2) + '\n');
console.log('Seed actualizado:', SEED);

// 2) Turso
const client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
await client.execute(`CREATE TABLE IF NOT EXISTS catalog_kv (key TEXT PRIMARY KEY, json TEXT NOT NULL, updated_at INTEGER)`);
const r = await client.execute({ sql: 'SELECT json FROM catalog_kv WHERE key = ?', args: [SLUG] });
let obj = r.rows.length ? JSON.parse(r.rows[0].json) : JSON.parse(JSON.stringify(seed));
if (!Array.isArray(obj.fichas) || !obj.fichas.length) obj.fichas = seed.fichas;
apply(obj.fichas);
await client.execute({
  sql: `INSERT INTO catalog_kv (key, json, updated_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET json=excluded.json, updated_at=excluded.updated_at`,
  args: [SLUG, JSON.stringify(obj), Date.now()],
});
console.log('Turso actualizado: digital-stretch-film');
process.exit(0);
