// Corrige la ficha tecnica de Acolchado: specs oficiales + espesor en milesimas (mil) y g/m2.
// Actualiza el seed JSON y Turso (clave digital-acolchado). Uso: node scripts/fix-acolchado-specs.mjs
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@libsql/client';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SEED = join(ROOT, 'src/data/catalogo-acolchado.json');
const SLUG = 'digital-acolchado';

for (const line of readFileSync(join(ROOT, '.env'), 'utf-8').split('\n')) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const ml = (es, en, pt, zh, ar) => ({ es, en, pt, zh, ar });
const t = (s) => ({ es: s, en: s, pt: s, zh: s, ar: s }); // tolerancias iguales en todos los idiomas

const C = {
  ancho:   ml('Ancho', 'Width', 'Largura', '宽度', 'العرض'),
  espesor: ml('Espesor', 'Thickness', 'Espessura', '厚度', 'السماكة'),
  largo:   ml('Largo', 'Length', 'Comprimento', '长度', 'الطول'),
  uv:      ml('Protección UV', 'UV Protection', 'Proteção UV', '紫外线防护', 'الحماية من الأشعة فوق البنفسجية'),
  opac:    ml('Opacidad', 'Opacity', 'Opacidade', '不透明度', 'التعتيم'),
};

const SPECS = [
  { c: C.ancho,   min: '0.60', max: '1.5',  tol: t('±0.02'), uni: 'm',    met: '—',           hl: false },
  { c: C.espesor, min: '63',   max: '100',  tol: t('±5%'),   uni: 'g/m2', met: '—',           hl: false },
  { c: C.largo,   min: '500',  max: '2000', tol: t('±2%'),   uni: 'm',    met: '—',           hl: false },
  { c: C.uv,      min: '12',   max: '36',   tol: t(''),      uni: 'meses', met: '—',           hl: false },
  { c: C.opac,    min: '99.9', max: '100',  tol: t(''),      uni: '%',    met: '—',           hl: false },
];

// 1) Seed JSON
const seed = JSON.parse(readFileSync(SEED, 'utf-8'));
if (!Array.isArray(seed.fichas) || !seed.fichas.length) { console.error('Seed sin fichas'); process.exit(1); }
seed.fichas[0].specs = SPECS;
writeFileSync(SEED, JSON.stringify(seed, null, 2) + '\n');
console.log('Seed actualizado:', SEED);

// 2) Turso (preserva el resto del registro)
const client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
await client.execute(`CREATE TABLE IF NOT EXISTS catalog_kv (key TEXT PRIMARY KEY, json TEXT NOT NULL, updated_at INTEGER)`);
const r = await client.execute({ sql: 'SELECT json FROM catalog_kv WHERE key = ?', args: [SLUG] });
let obj;
if (r.rows.length) { obj = JSON.parse(r.rows[0].json); }
else { obj = JSON.parse(JSON.stringify(seed)); }
if (!Array.isArray(obj.fichas) || !obj.fichas.length) obj.fichas = seed.fichas;
obj.fichas[0].specs = SPECS;
await client.execute({
  sql: `INSERT INTO catalog_kv (key, json, updated_at) VALUES (?,?,?)
        ON CONFLICT(key) DO UPDATE SET json=excluded.json, updated_at=excluded.updated_at`,
  args: [SLUG, JSON.stringify(obj), Date.now()],
});
console.log('Turso actualizado: digital-acolchado (6 specs, espesor mil + g/m2)');
process.exit(0);
