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

const CARRUSEL_DIR = path.join(process.cwd(), 'public', 'videos', 'carrusel');
const HOME_DIR = path.join(process.cwd(), 'public', 'videos', 'home');

// slot_key -> archivo local de respaldo (carrusel de productos + home)
const SLOTS = [
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
  { slot: 'hero',                 dir: HOME_DIR,     file: 'hero.mp4' },
  { slot: 'global',               dir: HOME_DIR,     file: 'camion.mp4' },
  { slot: 'home-4k',              dir: HOME_DIR,     file: '4K.mp4' },
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
