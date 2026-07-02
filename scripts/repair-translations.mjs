// scripts/repair-translations.mjs
// Repara fugas de español a chino/árabe en campos de texto visibles (no tolerancias).
// Usa Google Translate. Campos numéricos/de tolerancia se omiten (son universales).
// Uso: TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... node scripts/repair-translations.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@libsql/client';

const LANGS = ['es', 'en', 'pt', 'zh', 'ar'];
const TARGET_LANGS = ['zh', 'ar'];
const DATA_DIR = join(process.cwd(), 'src', 'data');

// ── Cliente Turso ──────────────────────────────────────────────
function getTurso() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) return null;
  return createClient({ url, authToken });
}

// ── Google Translate ───────────────────────────────────────────
async function googleTranslate(text, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // La respuesta es [[["translated text","original",...]],...]
    const parts = (data[0] || []).map(seg => seg[0] || '').join('');
    return parts || null;
  } catch (e) {
    console.error(`  ⚠ Google Translate ${targetLang}: ${e.message}`);
    return null;
  }
}

async function translateText(text) {
  const zh = await googleTranslate(text, 'zh');
  const ar = await googleTranslate(text, 'ar');
  if (!zh || !ar) return null;
  return { es: text, zh, ar };
}

// ── Determinar si un texto es técnico/numérico (no necesita traducción) ──
function isTechnical(text) {
  if (!text || typeof text !== 'string') return true;
  const t = text.trim();
  if (!t) return true;
  // Solo números/símbolos/tolerancias
  if (/^[±+\-\d.,%\s]+$/.test(t)) return true;
  // N/A, N/D, etc.
  if (/^[Nn]\/[AaDd]\s*$/.test(t)) return true;
  // Unidades de medida solas
  if (/^(In|Ft|Lb|Gauges|Gfr|Lbf|Psi|Mpa|mm|cm|m|kg|g)\s*$/i.test(t)) return true;
  // Muy corto y solo letras mayúsculas (puede ser sigla o código)
  if (t.length <= 2 && /^[A-Z]+$/.test(t)) return true;
  return false;
}

// ── Campos que SÍ deben traducirse (visibles al usuario) ──
const TEXT_PATHS = [
  /^cover\.t1$/,
  /^cover\.t2$/,
  /^cover\.division$/,
  /^intro\.p1$/,
  /^intro\.p2$/,
  /^intro\.bioTitle$/,
  /^productos\[\d+\]$/,
  /^fichas\[\d+\]\.nombre$/,
  /^fichas\[\d+\]\.desc$/,
  /^fichas\[\d+\]\.specs\[\d+\]\.c$/,   // nombre de característica
];

function shouldFix(path) {
  return TEXT_PATHS.some(p => p.test(path));
}

// ── Detectar fugas ─────────────────────────────────────────────
function isMultiLang(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  return LANGS.some(l => l in obj);
}

function findLeaks(obj, path = '') {
  const leaks = [];
  if (isMultiLang(obj)) {
    const es = obj.es;
    for (const l of TARGET_LANGS) {
      if (obj[l] === es && es && es.length > 0 && !isTechnical(es) && shouldFix(path)) {
        leaks.push({ path, lang: l, es, current: obj[l] });
      }
    }
  } else if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) {
      leaks.push(...findLeaks(v, path ? `${path}.${k}` : k));
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      leaks.push(...findLeaks(item, `${path}[${i}]`));
    });
  }
  return leaks;
}

// ── Aplicar reparación ─────────────────────────────────────────
function setAtPath(obj, path, lang, value) {
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (!current[key]) return;
    current = current[key];
  }
  const last = parts[parts.length - 1];
  if (current && current[last] && typeof current[last] === 'object') {
    current[last][lang] = value;
  }
}

// ── Main ────────────────────────────────────────────────────────
async function main() {
  const allFiles = [
    'catalogo-acolchado.json', 'catalogo-arpilla.json', 'catalogo-bolsas.json',
    'catalogo-cuerda.json', 'catalogo-esquinero.json', 'catalogo-flexible.json',
    'catalogo-naturizable.json', 'catalogo-rafia.json', 'catalogo-saco.json',
    'catalogo-stretch.json'
  ];

  let totalFixed = 0;
  let totalLeaks = 0;

  for (const file of allFiles) {
    const filePath = join(DATA_DIR, file);
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    const allLeaks = findLeaks(data);

    // Filtrar tolerancias y valores técnicos
    const leaks = allLeaks.filter(l => !isTechnical(l.es));
    totalLeaks += allLeaks.length;

    if (leaks.length === 0) {
      console.log(`${file}: ✅ OK (${allLeaks.length} tolerancias ignoradas)`);
      continue;
    }

    console.log(`${file}: 🔧 ${leaks.length} fugas de texto (${allLeaks.length - leaks.length} técnicas ignoradas)`);

    // Agrupar por texto español único
    const byEs = new Map();
    for (const leak of leaks) {
      const key = leak.es;
      if (!byEs.has(key)) byEs.set(key, []);
      byEs.get(key).push(leak);
    }

    // Traducir cada texto único
    const translations = new Map();
    const uniqueTexts = [...byEs.keys()];
    for (let i = 0; i < uniqueTexts.length; i++) {
      const text = uniqueTexts[i];
      const pct = `[${i + 1}/${uniqueTexts.length}]`;
      console.log(`  ${pct} "${text.substring(0, 50)}${text.length > 50 ? '…' : ''}"`);
      const result = await translateText(text);
      if (result) {
        translations.set(text, result);
        console.log(`    zh: ${result.zh.substring(0, 50)}${result.zh.length > 50 ? '…' : ''}`);
        console.log(`    ar: ${result.ar.substring(0, 50)}${result.ar.length > 50 ? '…' : ''}`);
      } else {
        console.log(`    ❌ Falló`);
      }
      // Rate limit
      if (i < uniqueTexts.length - 1) await new Promise(r => setTimeout(r, 400));
    }

    // Aplicar
    let fileFixed = 0;
    for (const [esText, leaked] of byEs) {
      const fixed = translations.get(esText);
      if (!fixed) continue;
      for (const leak of leaked) {
        setAtPath(data, leak.path, leak.lang, fixed[leak.lang]);
        fileFixed++;
      }
    }

    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`  💾 ${fileFixed} campos reparados\n`);
    totalFixed += fileFixed;
  }

  console.log(`📊 Total fugas detectadas: ${totalLeaks}`);
  console.log(`📊 Campos de texto reparados: ${totalFixed}`);

  // ── Sync a Turso ───────────────────────────────────────────
  if (totalFixed > 0) {
    const db = getTurso();
    if (db) {
      console.log('\n🔄 Sincronizando a Turso...');
      const slugMap = {
        'catalogo-acolchado.json': 'digital-acolchado',
        'catalogo-arpilla.json': 'digital-arpilla',
        'catalogo-bolsas.json': 'digital-bolsas',
        'catalogo-cuerda.json': 'digital-cuerda',
        'catalogo-esquinero.json': 'digital-esquinero',
        'catalogo-flexible.json': 'digital-flexible',
        'catalogo-naturizable.json': 'digital-naturizable',
        'catalogo-rafia.json': 'digital-rafia',
        'catalogo-saco.json': 'digital-saco',
        'catalogo-stretch.json': 'digital-stretch-film',
      };

      for (const [file, slug] of Object.entries(slugMap)) {
        const filePath = join(DATA_DIR, file);
        if (!readFileSync(filePath)) continue;
        const data = JSON.parse(readFileSync(filePath, 'utf-8'));
        const now = Date.now();
        await db.execute({
          sql: 'INSERT OR REPLACE INTO catalog_kv (key, json, updated_at) VALUES (?, ?, ?)',
          args: [slug, JSON.stringify(data), now],
        });
        console.log(`  ✅ Turso: ${slug}`);
      }
      console.log('✅ Sincronización completa.');
    } else {
      console.log('\n⚠ TURSO no configurado — JSON reparado en disco.');
    }
  }
}

main().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
