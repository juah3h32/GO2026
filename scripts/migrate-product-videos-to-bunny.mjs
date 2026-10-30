// scripts/migrate-product-videos-to-bunny.mjs
// Migracion unica: sube los videos de productos a Bunny Stream desde los
// archivos LOCALES (public/videos/carrusel/*.mp4 — el respaldo que ya existe),
// porque la cuenta de Cloudinary esta deshabilitada ("cloud_name dfuzfdrat is
// disabled") y no sirve ninguno de estos videos en este momento.
// Guarda el bunny_video_id resultante en Turso (tabla product_videos).
//
// Uso: node scripts/migrate-product-videos-to-bunny.mjs
import 'dotenv/config';
import { createClient } from '@libsql/client';
import { readFile } from 'fs/promises';
import path from 'path';

const BUNNY_LIBRARY_ID = process.env.PUBLIC_BUNNY_LIBRARY_ID;
const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY;

if (!BUNNY_LIBRARY_ID || !BUNNY_API_KEY) {
  console.error('Faltan env vars: PUBLIC_BUNNY_LIBRARY_ID / BUNNY_STREAM_API_KEY');
  process.exit(1);
}

const V = (...p) => path.join(process.cwd(), 'public', 'videos', ...p);
const CARRUSEL_DIR = V('carrusel');
const HOME_DIR = V('home');

// slot_key -> archivo local de respaldo. Cubre TODO el sitio: home, carrusel
// de productos, y los fondos propios de cada pagina de producto individual
// (prefijo pg-), nosotros, catalogo, vacantes e impacto social.
const SLOTS = [
  // Home
  { slot: 'hero',                 dir: HOME_DIR,     file: 'hero.mp4' },
  { slot: 'global',               dir: HOME_DIR,     file: 'camion.mp4' },
  { slot: 'home-4k',              dir: HOME_DIR,     file: '4K.mp4' },
  // Carrusel de productos (home/productos/naturizable)
  { slot: 'stretch-film',         dir: CARRUSEL_DIR, file: 'stretch-film.mp4' },
  { slot: 'arpillas',             dir: CARRUSEL_DIR, file: 'arpillas.mp4' },
  { slot: 'cuerdas',              dir: CARRUSEL_DIR, file: 'cuerdas.mp4' },
  { slot: 'rafias',               dir: CARRUSEL_DIR, file: 'rafia.mp4' },
  { slot: 'sacos',                dir: CARRUSEL_DIR, file: 'sacos.mp4' },
  { slot: 'esquineros',           dir: CARRUSEL_DIR, file: 'esquineros.mp4' },
  { slot: 'empaques-flexibles',   dir: CARRUSEL_DIR, file: 'bobina-impresa.mp4' },
  { slot: 'naturizable',          dir: CARRUSEL_DIR, file: 'charola.mp4' },
  { slot: 'bolsas',               dir: CARRUSEL_DIR, file: 'bolsa4.mp4' },
  { slot: 'acolchado',            dir: CARRUSEL_DIR, file: 'acolchadoV.mp4' },
  // Nosotros / Catalogo / Vacantes / Impacto social
  { slot: 'about-nosotros',       dir: V('nosotros'), file: 'background.mp4' },
  // catalogo-hero: NO se incluye — ese video vive en codigo muerto de
  // catalogo.astro (la pagina hace un Astro.redirect() antes de llegar a
  // usarlo), ninguna pagina real lo consume.
  { slot: 'vacantes-hero',        dir: V('vacantes'), file: 'video.mp4' },
  { slot: 'social-hero',          dir: HOME_DIR,       file: 'waves2.mp4' },
  { slot: 'social-oceanos',       dir: HOME_DIR,       file: 'waves.mp4' },
  { slot: 'impacto-oceancleanup', dir: V('impacto'),  file: 'oceancleanup.mp4' },
  { slot: 'impacto-tomford',      dir: V('impacto'),  file: 'tomford.mp4' },
  { slot: 'impacto-hogar',        dir: V('impacto'),  file: 'hogar.mp4' },
  // Paginas de producto individual (fondo propio, distinto del carrusel)
  { slot: 'pg-stretch-film',             dir: V('stretch'),   file: 'fondo.mp4' },
  { slot: 'pg-sacos-slaminar',           dir: V('saco'),      file: 'slaminar.mp4' },
  { slot: 'pg-sacos-transp',             dir: V('saco'),      file: 'transp.mp4' },
  { slot: 'pg-sacos-eco',                dir: V('saco'),      file: 'eco.mp4' },
  { slot: 'pg-flexible-bobinaf',         dir: V('flexible'),  file: 'bobinaf.mp4' },
  { slot: 'pg-flexible-standup',         dir: V('flexible'),  file: 'standup.mp4' },
  { slot: 'pg-flexible-standup-origanics', dir: V('flexible'), file: 'standup-origanics.mp4' },
  { slot: 'pg-flexible-bolsa-alto-vacio', dir: V('flexible'), file: 'bolsa-alto-vacio.mp4' },
  { slot: 'pg-esquineros',               dir: V('esquinero'), file: 'esquinero.mp4' },
  { slot: 'pg-arpilla-circular',         dir: V('arpilla'),   file: 'circular.mp4' },
  { slot: 'pg-arpilla-mono',             dir: V('arpilla'),   file: 'mono.mp4' },
  { slot: 'pg-arpilla-costura',          dir: V('arpilla'),   file: 'costura.mp4' },
  { slot: 'pg-arpilla-etiqueta',         dir: V('arpilla'),   file: 'etiqueta.mp4' },
  { slot: 'pg-cuerda-1',                 dir: V('cuerdas'),   file: 'cuerda-1.mp4' },
  { slot: 'pg-cuerda-i',                 dir: V('cuerdas'),   file: 'CuerdaI.mp4' },
  { slot: 'pg-cuerda-e',                 dir: V('cuerdas'),   file: 'CuerdaE.mp4' },
  { slot: 'pg-rafia-n',                  dir: V('rafia'),     file: 'fondoN.mp4' },
  { slot: 'pg-rafia-e',                  dir: V('rafia'),     file: 'fondoE.mp4' },
  { slot: 'pg-rafia-r',                  dir: V('rafia'),     file: 'fondoR.mp4' },
  { slot: 'pg-bolsas',                   dir: V('bolsas'),    file: 'video.mp4' },
  { slot: 'pg-acolchado',                dir: V('acolchado'), file: 'FONDOACOLCHADO.mp4' },
];

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function ensureTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS product_videos (
      slot_key        TEXT PRIMARY KEY,
      bunny_video_id  TEXT NOT NULL DEFAULT '',
      updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

async function createBunnyVideo(title) {
  const r = await fetch(`https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`, {
    method: 'POST',
    headers: { AccessKey: BUNNY_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!r.ok) throw new Error(`create video fallo (${r.status}): ${await r.text()}`);
  const j = await r.json();
  return j.guid;
}

async function uploadBunnyVideo(videoId, buffer) {
  const r = await fetch(`https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${videoId}`, {
    method: 'PUT',
    headers: { AccessKey: BUNNY_API_KEY, 'Content-Type': 'application/octet-stream' },
    body: buffer,
  });
  if (!r.ok) throw new Error(`upload fallo (${r.status}): ${await r.text()}`);
}

async function migrateOne({ slot, dir, file }) {
  const filePath = path.join(dir, file);
  process.stdout.write(`[${slot}] leyendo ${file}... `);
  const buffer = await readFile(filePath);
  console.log(`${(buffer.length / 1024 / 1024).toFixed(1)}MB`);

  process.stdout.write(`[${slot}] subiendo a Bunny... `);
  const videoId = await createBunnyVideo(slot);
  await uploadBunnyVideo(videoId, buffer);
  console.log(`listo (${videoId})`);

  await db.execute({
    sql: `INSERT INTO product_videos (slot_key, bunny_video_id, updated_at) VALUES (?, ?, datetime('now'))
          ON CONFLICT(slot_key) DO UPDATE SET bunny_video_id=excluded.bunny_video_id, updated_at=excluded.updated_at`,
    args: [slot, videoId],
  });
}

async function main() {
  await ensureTable();
  const existing = await db.execute(`SELECT slot_key FROM product_videos WHERE bunny_video_id != ''`);
  const already = new Set(existing.rows.map(r => r.slot_key));
  const onlyNew = process.argv.includes('--only-new');

  for (const slot of SLOTS) {
    if (onlyNew && already.has(slot.slot)) {
      console.log(`[${slot.slot}] ya migrado, salto (--only-new)`);
      continue;
    }
    try {
      await migrateOne(slot);
    } catch (e) {
      console.error(`[${slot.slot}] ERROR: ${e.message}`);
    }
  }
  console.log('Migracion terminada.');
}

main();
