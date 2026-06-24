// Corrige desc de BOLSA VACÍO en Turso para incluir "polietileno".
// Uso: node scripts/fix-vacuumbag-polietileno.mjs
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SLUG = 'digital-flexible';

for (const line of readFileSync(join(ROOT, '.env'), 'utf-8').split('\n')) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const NEW_DESC = {
  es: 'Las bolsas de vacío de polietileno están diseñadas para maximizar la frescura y la vida útil de productos delicados. Son ideales para alimentos perecederos como carnes, quesos, embutidos y productos frescos, protegiéndolos eficazmente del oxígeno, la humedad y otros contaminantes.',
  en: 'Polyethylene vacuum bags are designed to maximize the freshness and shelf life of delicate products. They are ideal for perishable foods such as meats, cheeses, sausages and fresh products, protecting them effectively from oxygen, moisture and other contaminants.',
  pt: 'As bolsas a vácuo de polietileno são projetadas para maximizar a frescura e a vida útil de produtos delicados. São ideais para alimentos perecíveis como carnes, queijos, embutidos e produtos frescos, protegendo-os eficazmente do oxigênio, da umidade e outros contaminantes.',
  zh: '聚乙烯真空袋专为最大化精致产品的新鲜度和保质期而设计，适用于肉类、奶酪、香肠和新鲜产品等易腐食品，有效防止氧气、湿气及其他污染物的侵害。',
  ar: 'صُممت أكياس تفريغ البولي إيثيلين لتعظيم الطازجية وإطالة العمر الافتراضي للمنتجات الرقيقة. وهي مثالية للأطعمة القابلة للتلف كالحوم والأجبان والنقانق والمنتجات الطازجة، حمايةً فعّالة من الأكسجين والرطوبة والملوثات.',
};

const client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const r = await client.execute({ sql: 'SELECT json FROM catalog_kv WHERE key = ?', args: [SLUG] });
if (!r.rows.length) { console.log('Catálogo no encontrado en Turso.'); process.exit(1); }

const obj = JSON.parse(r.rows[0].json);
const ficha = obj.fichas?.find(f => f.nombre?.es === 'BOLSA VACÍO');
if (!ficha) { console.log('BOLSA VACÍO no encontrada en Turso.'); process.exit(1); }

ficha.desc = NEW_DESC;

await client.execute({
  sql: `INSERT INTO catalog_kv (key, json, updated_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET json=excluded.json, updated_at=excluded.updated_at`,
  args: [SLUG, JSON.stringify(obj), Date.now()],
});
console.log('Turso actualizado: desc BOLSA VACÍO con polietileno.');
process.exit(0);
