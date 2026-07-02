// scripts/fix-images.mjs
// Corrige los campos img de todos los catálogos cross-referenciando archivos existentes en disco.
// Uso: node scripts/fix-images.mjs [--turso]
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@libsql/client';

const DATA_DIR = join(process.cwd(), 'src', 'data');
const IMG_DIR = join(process.cwd(), 'public', 'images');

// ── Mapeo de slugs a carpetas ──────────────────────────────────
const CATALOGS = [
  { slug: 'digital-stretch-film', json: 'catalogo-stretch.json', folder: 'stretch' },
  { slug: 'digital-acolchado',    json: 'catalogo-acolchado.json', folder: 'acolchado' },
  { slug: 'digital-arpilla',      json: 'catalogo-arpilla.json', folder: 'arpillas' },
  { slug: 'digital-cuerda',       json: 'catalogo-cuerda.json', folder: 'cuerdas' },
  { slug: 'digital-rafia',        json: 'catalogo-rafia.json', folder: 'rafias' },
  { slug: 'digital-flexible',     json: 'catalogo-flexible.json', folder: 'flexible' },
  { slug: 'digital-saco',         json: 'catalogo-saco.json', folder: 'sacos' },
  { slug: 'digital-esquinero',    json: 'catalogo-esquinero.json', folder: 'esquinero' },
  { slug: 'digital-naturizable',  json: 'catalogo-naturizable.json', folder: 'naturizable' },
  { slug: 'digital-bolsas',       json: 'catalogo-bolsas.json', folder: 'bolsas' },
];

// ── Mapeo manual: nombre de producto → archivo correcto ─────────
// Basado en los nombres originales de las imágenes en disco.
const STRETCH_MAP = {
  'stretch premium': 'premium.png',
  'automático': 'stretch2.png',
  'manual preestirado': 'manual.png',
  'manual banding': 'banding.png',
  'coreles': 'coreles.png',
  'manual rígido': 'rigido.png',
};

const CUERDA_MAP = {
  'cuerda ferretera': 'CuerdaT1.png',
  'cuerda invernadero': 'CuerdaNegra.png',
  'cuerda ecológica': 'CuerdaEco.png',
  'cuerda reforzada': 'CuerdaReforzada.png',
  'cuerda negra colorida': 'CuerdaColorida.png',
};

const RAFIA_MAP = {
  'rafia de atar': 'atar.png',
  'rafia ecológica': 'Eco.png',
  'rafia fibrilada negra': 'negra.png',
  'rafia soplada': 'soplada.png',
};

const FLEXIBLE_MAP = {
  'bobina impresa': 'bobina.png',
  'bolsa genérica tipo stand-up': 'standup.png',
  'bolsa tipo stand x organics': 'organics.png',
  'bolsa personalizada': 'personalizada.png',
  'bolsa vacío': 'vacio.png',
};

const SACO_MAP = {
  'saco de rafia sin laminar': 'sacos-de-rafia.png',
  'saco transparente': 'saco-transparente.png',
  'saco de rafia ecológico': 'saco-ecologico.png',
  'saco de rafia laminado microperforación': 'saco-laminado-perforado.png',
  'saco laminado': 'saco-laminado.png',
  'saco con fuelle': 'saco-fuelle.png',
  'saco con válvula': 'saco-valvula.png',
  'saco jumbo': 'saco-jumbo.png',
  'saco de rafia con liner': 'saco-liner.png',
  'saco de rafia pigmentado': 'saco-pigmentado.png',
};

const ARPILLA_MAP = {
  'arpilla circular': 'arpilla.png',
  'arpilla monofilamento circular': 'arpilla2.png',
  'arpilla costura lateral': 'arpilla3.png',
  'arpilla etiqueta laminada': 'arpilla4.png',
};

const ESQUINERO_MAP = {
  'esquinero kraft café': 'esquinero.png',
  'esquinero kraft blanco': 'esquinerob.png',
};

const NATURIZABLE_MAP = {
  'charola 855': 'charola.png',
  'vaso de celulosa': 'vaso.png',
  'contenedores': 'contenedor.png',
};

const BOLSAS_MAP = {
  'bolsa 15×25 cm': '15x25.png',
  'bolsa 18×25 cm': '18X25.png',
  'bolsa 20×30 cm': '20X30.png',
  'bolsa 25×35 cm': '25x35.png',
  'bolsa 30×40 cm': '30X40.png',
  'bolsa 35×45 cm': '35X45.png',
  'bolsa 40×60 cm': '40X60.png',
  'bolsa 50×70 cm': '50X70.png',
  'bolsa 60×90 cm': '60X90.png',
};

const MAPS = {
  stretch: STRETCH_MAP, acolchado: null, arpillas: ARPILLA_MAP,
  cuerdas: CUERDA_MAP, rafias: RAFIA_MAP, flexible: FLEXIBLE_MAP,
  sacos: SACO_MAP, esquinero: ESQUINERO_MAP, naturizable: NATURIZABLE_MAP,
  bolsas: BOLSAS_MAP,
};

// ── Buscar archivo en carpeta (case-insensitive, multiples extensiones) ──
function findFile(folder, baseName) {
  const folderPath = join(IMG_DIR, folder);
  if (!existsSync(folderPath)) return null;

  // Si es ruta completa (Cloudinary URL o path absoluto), devolverla tal cual
  if (baseName.startsWith('http') || baseName.startsWith('/')) {
    // Verificar si existe localmente primero
    const localName = baseName.split('/').pop();
    if (localName && existsSync(join(folderPath, localName))) return localName;
    return null;
  }

  // Buscar por nombre exacto primero
  if (existsSync(join(folderPath, baseName))) return baseName;

  // Buscar con diferentes extensiones
  const nameWithoutExt = baseName.replace(/\.[^.]+$/, '');
  const files = readdirSync(folderPath);
  for (const f of files) {
    const fBase = f.replace(/\.[^.]+$/, '');
    if (fBase.toLowerCase() === nameWithoutExt.toLowerCase()) return f;
  }

  return null;
}

// ── Main ────────────────────────────────────────────────────────
function main() {
  let totalFixed = 0;

  for (const cat of CATALOGS) {
    const filePath = join(DATA_DIR, cat.json);
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    const fichas = data.fichas || [];
    const folder = cat.folder;
    const manualMap = MAPS[folder] || {};
    const folderPath = join(IMG_DIR, folder);

    let fixed = 0;
    const availableFiles = existsSync(folderPath) ? readdirSync(folderPath) : [];

    for (let i = 0; i < fichas.length; i++) {
      const f = fichas[i];
      const currentImg = f.img || '';
      const nombreEs = (f.nombre?.es || f.nombre || '').toLowerCase().trim();

      // Si ya tiene imagen válida, verificar que el archivo exista
      if (currentImg && !currentImg.startsWith('http') && !currentImg.startsWith('/')) {
        if (existsSync(join(folderPath, currentImg))) continue; // OK
      }
      if (currentImg && (currentImg.startsWith('http') || currentImg.startsWith('//'))) {
        continue; // Cloudinary URL, no tocar
      }

      // Intentar mapeo manual primero
      let bestMatch = manualMap[nombreEs] || null;

      // Si no hay mapeo manual, buscar por nombre de producto
      if (!bestMatch) {
        const searchTerms = nombreEs.replace(/[^a-z0-9áéíóúñü\s]/g, '').split(/\s+/).filter(w => w.length > 2);
        for (const file of availableFiles) {
          const fileLower = file.toLowerCase().replace(/\.[^.]+$/, '');
          const matchCount = searchTerms.filter(t => fileLower.includes(t)).length;
          if (matchCount >= 2 || (searchTerms.length === 1 && matchCount === 1)) {
            // Solo si el nombre del archivo contiene la mayoría de términos
            if (matchCount >= searchTerms.length * 0.6) {
              bestMatch = file;
              break;
            }
          }
        }
      }

      // Si no encuentra, buscar Cloudinary uploads: {folder}-{idx}-*
      if (!bestMatch) {
        const cloudPrefix = `${folder}-${i + 1}-`;
        for (const file of availableFiles) {
          if (file.startsWith(cloudPrefix)) {
            bestMatch = file;
            break;
          }
        }
      }

      if (bestMatch) {
        fichas[i].img = bestMatch;
        fixed++;
        console.log(`${cat.json}[${i}] ${f.nombre?.es}: "${currentImg || '(empty)'}" → "${bestMatch}"`);
      } else if (!currentImg || currentImg === '') {
        console.log(`${cat.json}[${i}] ${f.nombre?.es}: SIN IMAGEN (no match in ${availableFiles.length} files)`);
      }
    }

    if (fixed > 0) {
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`  💾 ${cat.json}: ${fixed} imágenes corregidas\n`);
      totalFixed += fixed;
    } else {
      console.log(`${cat.json}: ✅ OK\n`);
    }
  }

  console.log(`📊 Total imágenes corregidas: ${totalFixed}`);

  // Sync a Turso si se pide
  if (process.argv.includes('--turso') && totalFixed > 0) {
    syncTurso();
  }
}

async function syncTurso() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    console.log('\n⚠ TURSO no configurado. Corre con --turso después de setear las env vars.');
    return;
  }
  const db = createClient({ url, authToken });
  console.log('\n🔄 Sincronizando a Turso...');
  for (const cat of CATALOGS) {
    const filePath = join(DATA_DIR, cat.json);
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    await db.execute({
      sql: 'INSERT OR REPLACE INTO catalog_kv (key, json, updated_at) VALUES (?, ?, ?)',
      args: [cat.slug, JSON.stringify(data), Date.now()],
    });
    console.log(`  ✅ ${cat.slug}`);
  }
  console.log('✅ Sincronización completa.');
}

main();
