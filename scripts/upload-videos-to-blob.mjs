// scripts/upload-videos-to-blob.mjs
//
// Sube todo public/videos/**/*.mp4 a Vercel Blob, para que el fallback de
// video (Cloudinary caido) tambien funcione en produccion — public/videos/
// esta en .gitignore y NUNCA se despliega a Vercel via git.
//
// Setup unico (una sola vez):
//   1. Vercel dashboard → proyecto → Storage → Create Database → Blob.
//   2. Copiar el token "BLOB_READ_WRITE_TOKEN" a .env (local) y a las
//      variables de entorno del proyecto en Vercel (Production + Preview).
//   3. Copiar la URL publica del store (https://<id>.public.blob.vercel-storage.com)
//      a PUBLIC_VIDEO_FALLBACK_BASE en .env y en Vercel.
//
// Uso:
//   node scripts/upload-videos-to-blob.mjs           # sube lo que falte o cambio
//   node scripts/upload-videos-to-blob.mjs --dry      # solo lista, no sube

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const VIDEOS_DIR = join(ROOT, 'public', 'videos');
const DRY = process.argv.includes('--dry');

for (const line of readFileSync(join(ROOT, '.env'), 'utf-8').split('\n')) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, '');
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('[upload-videos] falta BLOB_READ_WRITE_TOKEN en .env — ver instrucciones al inicio de este archivo.');
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue; // .DS_Store, etc.
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (name.toLowerCase().endsWith('.mp4')) out.push(full);
  }
  return out;
}

async function main() {
  const { put } = await import('@vercel/blob');
  const files = walk(VIDEOS_DIR);
  console.log(`[upload-videos] ${files.length} archivos .mp4 encontrados en public/videos/`);

  let ok = 0, failed = 0;
  for (const file of files) {
    const rel = relative(join(ROOT, 'public'), file).split('\\').join('/'); // videos/xxx/yyy.mp4
    if (DRY) { console.log('  subiria:', rel); ok++; continue; }

    try {
      const buf = readFileSync(file);
      const blob = await put(rel, buf, {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'video/mp4',
      });
      console.log('  OK', rel, '->', blob.url);
      ok++;
    } catch (e) {
      console.error('  ERROR', rel, '-', e.message);
      failed++;
    }
  }

  console.log(`[upload-videos] listo. ok=${ok} fallidos=${failed}`);
  if (ok > 0 && !DRY) {
    console.log('[upload-videos] PUBLIC_VIDEO_FALLBACK_BASE debe ser la URL base del store (sin /videos al final), ej:');
    console.log('  https://<store-id>.public.blob.vercel-storage.com');
  }
}

main().catch((e) => {
  console.error('[upload-videos] fallo:', e.message);
  process.exit(1);
});
