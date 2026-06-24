// Agrega Bolsa Vacío (Vacuum Bags) al catálogo digital-flexible.
// El seed JSON ya fue actualizado — este script sincroniza Turso.
// Uso: node scripts/add-flexible-vacuumbag.mjs
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

const NUEVA_FICHA = {
  nombre: { es: 'BOLSA VACÍO', en: 'VACUUM BAGS', pt: 'BOLSA A VÁCUO', zh: '真空袋', ar: 'أكياس التفريغ' },
  img: '',
  lado: '',
  desc: {
    es: 'Las bolsas de vacío están diseñadas para maximizar la frescura y la vida útil de productos delicados. Son ideales para alimentos perecederos como carnes, quesos, embutidos y productos frescos, protegiéndolos eficazmente del oxígeno, la humedad y otros contaminantes.',
    en: 'Vacuum bags are designed to maximize the freshness and shelf life of delicate products. They are ideal for perishable foods such as meats, cheeses, sausages and fresh products, protecting them effectively from oxygen, moisture and other contaminants.',
    pt: 'As bolsas a vácuo são projetadas para maximizar a frescura e a vida útil de produtos delicados. São ideais para alimentos perecíveis como carnes, queijos, embutidos e produtos frescos, protegendo-os eficazmente do oxigênio, da umidade e outros contaminantes.',
    zh: '真空袋专为最大化精致产品的新鲜度和保质期而设计，适用于肉类、奶酪、香肠和新鲜产品等易腐食品，有效防止氧气、湿气及其他污染物的侵害。',
    ar: 'صُممت أكياس التفريغ لتعظيم الطازجية وإطالة العمر الافتراضي للمنتجات الرقيقة. وهي مثالية للأطعمة القابلة للتلف كالحوم والأجبان والنقانق والمنتجات الطازجة، حمايةً فعّالة من الأكسجين والرطوبة والملوثات.',
  },
  sections: [
    {
      title: { es: 'Ventajas', en: 'Advantages', pt: 'Vantagens', zh: '优势', ar: 'المزايا' },
      items: [
        { es: 'Preservación prolongada de los alimentos.', en: 'Prolonged food preservation.', pt: 'Preservação prolongada dos alimentos.', zh: '食物长期保鲜。', ar: 'حفظ الطعام لفترة طويلة.' },
        { es: 'Protección contra la humedad, el oxígeno y los contaminantes.', en: 'Protection against moisture, oxygen and contaminants.', pt: 'Proteção contra umidade, oxigênio e contaminantes.', zh: '防潮、防氧及防污染。', ar: 'الحماية من الرطوبة والأكسجين والملوثات.' },
        { es: 'Reducción de desperdicios y vida útil extendida.', en: 'Waste reduction and extended shelf life.', pt: 'Redução de desperdícios e vida útil estendida.', zh: '减少浪费，延长保质期。', ar: 'تقليل الهدر وإطالة العمر الافتراضي.' },
        { es: 'Almacenamiento compacto y eficiente.', en: 'Compact and efficient storage.', pt: 'Armazenamento compacto e eficiente.', zh: '紧凑高效的存储方式。', ar: 'تخزين مضغوط وفعّال.' },
      ],
    },
    {
      title: { es: 'Desventajas', en: 'Disadvantages', pt: 'Desvantagens', zh: '劣势', ar: 'العيوب' },
      items: [
        { es: 'Requiere maquinaria especializada para el sellado al vacío.', en: 'Requires specialized machinery for vacuum sealing.', pt: 'Requer maquinaria especializada para selagem a vácuo.', zh: '需要专用真空封口设备。', ar: 'يتطلب معدات متخصصة لإغلاق التفريغ.' },
        { es: 'No todos los productos son compatibles con este tipo de embalaje.', en: 'Not all products are compatible with this type of packaging.', pt: 'Nem todos os produtos são compatíveis com este tipo de embalagem.', zh: '并非所有产品均适用此类包装。', ar: 'ليست جميع المنتجات متوافقة مع هذا النوع من التغليف.' },
        { es: 'Mayor costo inicial en comparación con el embalaje convencional.', en: 'Higher initial cost compared to conventional packaging.', pt: 'Maior custo inicial em comparação com a embalagem convencional.', zh: '与传统包装相比，初期成本较高。', ar: 'تكلفة أولية أعلى مقارنة بالتغليف التقليدي.' },
      ],
    },
  ],
  specs: [],
  matrix: { title: '', note: '', headers: [], rows: [] },
  visual: { scale: 1, offsetX: 0, offsetY: 0, rotate: 0 },
};

function addNew(obj) {
  if (!Array.isArray(obj.fichas)) obj.fichas = [];
  const existe = obj.fichas.some(f => f.nombre?.es === NUEVA_FICHA.nombre.es);
  if (!existe) {
    obj.fichas.push(JSON.parse(JSON.stringify(NUEVA_FICHA)));
    obj.productos = obj.fichas.map(f => f.nombre);
    return true;
  }
  return false;
}

const client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
await client.execute(`CREATE TABLE IF NOT EXISTS catalog_kv (key TEXT PRIMARY KEY, json TEXT NOT NULL, updated_at INTEGER)`);
const r = await client.execute({ sql: 'SELECT json FROM catalog_kv WHERE key = ?', args: [SLUG] });
if (!r.rows.length) { console.log('Catálogo no encontrado en Turso — se creará al primer acceso desde seed.'); process.exit(0); }
const obj = JSON.parse(r.rows[0].json);
const added = addNew(obj);
if (!added) { console.log('BOLSA VACÍO ya existe en Turso, nada que hacer.'); process.exit(0); }
await client.execute({
  sql: `INSERT INTO catalog_kv (key, json, updated_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET json=excluded.json, updated_at=excluded.updated_at`,
  args: [SLUG, JSON.stringify(obj), Date.now()],
});
console.log('Turso actualizado: BOLSA VACÍO agregada. Total fichas:', obj.fichas.length);
process.exit(0);
