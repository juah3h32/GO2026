// Agrega 2 fichas al catalogo de sacos: Saco de Rafia con Liner y Saco de Rafia Pigmentado.
// Actualiza seed JSON + Turso (digital-saco). Uso: node scripts/add-saco-products.mjs
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@libsql/client';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SEED = join(ROOT, 'src/data/catalogo-saco.json');
const SLUG = 'digital-saco';

for (const line of readFileSync(join(ROOT, '.env'), 'utf-8').split('\n')) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const ml = (es, en, pt, zh, ar) => ({ es, en, pt, zh, ar });
const t = (s) => ({ es: s, en: s, pt: s, zh: s, ar: s });

const L = {
  ancho: ml('Ancho', 'Width', 'Largura', '宽度', 'العرض'),
  largo: ml('Largo', 'Length', 'Comprimento', '长度', 'الطول'),
  pesoTej: ml('Peso del tejido', 'Fabric weight', 'Peso do tecido', '织物重量', 'وزن النسيج'),
  pesoLam: ml('Peso del laminado', 'Lamination weight', 'Peso da laminação', '覆膜重量', 'وزن التغليف'),
  costura: ml('Costura', 'Stitching', 'Costura', '缝合', 'الخياطة'),
  dobladillo: ml('Dobladillo', 'Hem', 'Bainha', '折边', 'الحاشية'),
  fuelles: ml('Fuelles', 'Gussets', 'Foles', '侧褶', 'الطيات الجانبية'),
  resist: ml('Resistencia del tejido', 'Fabric strength', 'Resistência do tecido', '织物强度', 'مقاومة النسيج'),
  tinta: ml('Tinta', 'Ink', 'Tinta', '油墨', 'الحبر'),
};

// Specs identicos para ambos productos
const SPECS = [
  { c: L.ancho,      min: '13.78',  max: '31.50',  tol: t('±1'),   uni: 'Inches',   met: '', hl: false },
  { c: L.largo,      min: '19.29',  max: '45.28',  tol: t('±1'),   uni: 'Inches',   met: '', hl: false },
  { c: L.pesoTej,    min: '48',     max: '100',    tol: t('±2'),   uni: 'G/m2',     met: '', hl: false },
  { c: L.pesoLam,    min: '14',     max: '35',     tol: t('±2'),   uni: 'G/m2',     met: '', hl: false },
  { c: L.costura,    min: '13',     max: '16',     tol: t('±1'),   uni: 'Stitches', met: '', hl: false },
  { c: L.dobladillo, min: '0.79',   max: '1.18',   tol: t('±0.5'), uni: 'Inches',   met: '', hl: false },
  { c: L.fuelles,    min: '2.76',   max: '7.87',   tol: t('±0.5'), uni: 'Inches',   met: '', hl: false },
  { c: L.resist,     min: '264.55', max: '440.92', tol: t('±20%'), uni: 'lbf',      met: '', hl: false },
  { c: L.tinta,      min: '1',      max: '12',     tol: t('N/A'),  uni: 'Pieces',   met: '', hl: false },
];

const fichaLiner = {
  nombre: ml('SACO DE RAFIA CON LINER', 'RAFFIA BAG WITH LINER', 'SACO DE RÁFIA COM LINER', '带内衬拉菲袋', 'كيس رافيا ببطانة'),
  img: '', lado: '',
  desc: ml(
    'Los sacos con liner suelen estar laminados y funcionan como una barrera adicional al laminado, proporcionando una mayor impermeabilidad al producto envasado. Este tipo de saco se utiliza especialmente para fertilizantes finos, donde es fundamental evitar fugas o brindar una protección adicional contra la humedad. Industria: fertilizantes.',
    'Bags with a liner are usually laminated and act as an additional barrier to the lamination, providing greater impermeability to the packaged product. This type of bag is especially used for fine fertilizers, where it is essential to prevent leaks or provide extra protection against moisture. Industry: fertilizers.',
    'Os sacos com liner costumam ser laminados e funcionam como uma barreira adicional à laminação, proporcionando maior impermeabilidade ao produto embalado. Esse tipo de saco é especialmente utilizado para fertilizantes finos, onde é fundamental evitar vazamentos ou oferecer proteção adicional contra a umidade. Indústria: fertilizantes.',
    '带内衬的袋子通常经过覆膜处理，作为覆膜之外的额外屏障，为包装产品提供更强的防潮性能。此类袋子特别适用于细颗粒肥料，对于防止泄漏或提供额外的防潮保护至关重要。行业：肥料。',
    'عادةً ما تكون الأكياس ذات البطانة مغلفة وتعمل كحاجز إضافي للتغليف، مما يوفر مقاومة أكبر للرطوبة للمنتج المعبأ. يُستخدم هذا النوع من الأكياس خصيصًا للأسمدة الدقيقة، حيث من الضروري منع التسرب أو توفير حماية إضافية ضد الرطوبة. الصناعة: الأسمدة.'
  ),
  specs: SPECS,
  visual: { scale: 1, offsetX: 0, offsetY: 0, rotate: 0 },
};

const fichaPigment = {
  nombre: ml('SACO DE RAFIA PIGMENTADO', 'PIGMENTED RAFFIA BAG', 'SACO DE RÁFIA PIGMENTADO', '染色拉菲袋', 'كيس رافيا ملون'),
  img: '', lado: '',
  desc: ml(
    'Los sacos de rafia pigmentada son conocidos por su alta resistencia, durabilidad y capacidad para preservar las características de los productos envasados, incluso en condiciones exigentes. Industrias: granos, sales minerales y azúcares, alimento para animales, harinas, semillas y fertilizantes.',
    'Pigmented raffia bags are known for their high strength, durability, and ability to preserve the characteristics of packaged products, even under demanding conditions. Industries: grains, mineral salts and sugars, animal feed, flours, seeds and fertilizers.',
    'Os sacos de ráfia pigmentada são conhecidos por sua alta resistência, durabilidade e capacidade de preservar as características dos produtos embalados, mesmo em condições exigentes. Indústrias: grãos, sais minerais e açúcares, ração animal, farinhas, sementes e fertilizantes.',
    '染色拉菲袋以其高强度、耐用性以及在严苛条件下仍能保持包装产品特性的能力而闻名。行业：谷物、矿物盐和糖、动物饲料、面粉、种子和肥料。',
    'تُعرف أكياس الرافيا الملونة بمتانتها العالية وقدرتها على الحفاظ على خصائص المنتجات المعبأة، حتى في الظروف الصعبة. الصناعات: الحبوب، الأملاح المعدنية والسكريات، أعلاف الحيوانات، الدقيق، البذور والأسمدة.'
  ),
  specs: SPECS.map(s => ({ ...s })),
  visual: { scale: 1, offsetX: 0, offsetY: 0, rotate: 0 },
};

function addNew(obj) {
  if (!Array.isArray(obj.fichas)) obj.fichas = [];
  const existe = (nm) => obj.fichas.some(f => (f.nombre && f.nombre.es) === nm);
  let added = 0;
  if (!existe(fichaLiner.nombre.es)) { obj.fichas.push(JSON.parse(JSON.stringify(fichaLiner))); added++; }
  if (!existe(fichaPigment.nombre.es)) { obj.fichas.push(JSON.parse(JSON.stringify(fichaPigment))); added++; }
  // Mantener la lista de portada (productos) en sync con las fichas
  obj.productos = obj.fichas.map(f => f.nombre);
  return added;
}

// 1) Seed
const seed = JSON.parse(readFileSync(SEED, 'utf-8'));
const a1 = addNew(seed);
writeFileSync(SEED, JSON.stringify(seed, null, 2) + '\n');
console.log('Seed actualizado (+' + a1 + ' fichas):', SEED);

// 2) Turso
const client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
await client.execute(`CREATE TABLE IF NOT EXISTS catalog_kv (key TEXT PRIMARY KEY, json TEXT NOT NULL, updated_at INTEGER)`);
const r = await client.execute({ sql: 'SELECT json FROM catalog_kv WHERE key = ?', args: [SLUG] });
let obj = r.rows.length ? JSON.parse(r.rows[0].json) : JSON.parse(JSON.stringify(seed));
const a2 = addNew(obj);
await client.execute({
  sql: `INSERT INTO catalog_kv (key, json, updated_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET json=excluded.json, updated_at=excluded.updated_at`,
  args: [SLUG, JSON.stringify(obj), Date.now()],
});
console.log('Turso actualizado (+' + a2 + ' fichas): digital-saco. Total fichas:', obj.fichas.length);
process.exit(0);
