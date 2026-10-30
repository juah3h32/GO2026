#!/usr/bin/env node
// scripts/sync-local-videos.mjs
//
// Levanta el sitio en dev, recorre las paginas publicas, y descarga a
// public/videos/ cualquier video de Cloudinary que tenga un fallback local
// (data-local-fallback / data-src+data-local-fallback) definido pero cuyo
// archivo NO exista todavia en disco.
//
// Uso: node scripts/sync-local-videos.mjs [--dry]

import { spawn } from 'node:child_process';
import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const PORT = 4329;
const BASE = `http://localhost:${PORT}`;
const DRY  = process.argv.includes('--dry');

const LANGS = ['es', 'en', 'pt', 'ar', 'zh'];
const PAGES = [
  '', 'about', 'catalogo', 'productos', 'naturizable', 'rafias', 'sacos',
  'stretch-film', 'arpillas', 'cuerdas', 'esquineros', 'bolsas', 'vacantes',
  'social', 'empaques-flexibles', 'acolchado',
];

function log(...a) { console.log('[sync-videos]', ...a); }

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

function startServer() {
  return spawn('npx', ['astro', 'dev', '--port', String(PORT)], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function waitForServer(proc) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout esperando astro dev')), 45000);
    let buf = '';
    proc.stdout.on('data', (d) => {
      buf += d.toString();
      if (/ready in|Local\s+http/i.test(buf)) { clearTimeout(timer); resolve(); }
    });
    proc.stderr.on('data', (d) => { buf += d.toString(); });
    proc.on('exit', (code) => { clearTimeout(timer); reject(new Error(`astro dev salio con codigo ${code}: ${buf.slice(-500)}`)); });
  });
}

// Extrae pares [urlCloudinary, rutaLocal] de un bloque <video>...</video>
function extractPairsFromHtml(html) {
  const pairs = [];
  const videoBlockRe = /<video\b([^>]*)>([\s\S]*?)<\/video>/gi;
  let m;
  while ((m = videoBlockRe.exec(html))) {
    const attrs = m[1];
    const inner = m[2];

    const localMatch =
      attrs.match(/data-local-fallback="([^"]*)"/) ||
      attrs.match(/data-fallback="([^"]*)"/);
    if (!localMatch || !localMatch[1]) continue;
    const local = localMatch[1];
    if (!local.startsWith('/videos/')) continue;

    // src puede estar en el propio <video>, en data-src (lazy), o en un <source> hijo
    const srcMatch =
      attrs.match(/(?:^|\s)src="([^"]*cloudinary[^"]*)"/) ||
      attrs.match(/data-src="([^"]*cloudinary[^"]*)"/) ||
      inner.match(/<source[^>]*src="([^"]*cloudinary[^"]*)"/i);
    if (!srcMatch) continue;

    pairs.push({ cloud: srcMatch[1].replace(/&amp;/g, '&'), local });
  }
  return pairs;
}

async function fetchHtml(url) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) {
      if (process.env.DEBUG_SYNC) log('  fetch', url, '->', res.status);
      return null;
    }
    return await res.text();
  } catch (e) {
    if (process.env.DEBUG_SYNC) log('  fetch', url, '-> ERROR', e.message);
    return null;
  }
}

async function downloadTo(url, localPath) {
  const abs = path.join(ROOT, 'public', localPath.replace(/^\//, ''));
  if (await exists(abs)) return 'ya-existe';
  if (DRY) return 'faltante (dry-run, no se descarga)';

  await mkdir(path.dirname(abs), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) return `error HTTP ${res.status}`;
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(abs, buf);
  return `descargado (${(buf.length / 1024 / 1024).toFixed(1)} MB)`;
}

async function main() {
  log('iniciando servidor dev en puerto', PORT, '...');
  const proc = startServer();
  proc.on('error', (e) => { log('error lanzando astro dev:', e.message); });

  try {
    await waitForServer(proc);
    log('servidor listo. escaneando paginas...');

    const seen = new Map(); // local -> cloud url (dedupe)
    for (const lang of LANGS) {
      for (const page of PAGES) {
        const url = `${BASE}/${lang}/${page}`;
        const html = await fetchHtml(url);
        if (!html) continue;
        for (const { cloud, local } of extractPairsFromHtml(html)) {
          if (!seen.has(local)) seen.set(local, cloud);
        }
      }
    }

    log(`encontrados ${seen.size} videos con fallback local declarado.`);

    let ok = 0, downloaded = 0, missing = 0, failed = 0;
    for (const [local, cloud] of seen) {
      const result = await downloadTo(cloud, local);
      if (result === 'ya-existe') { ok++; log('OK      ', local); }
      else if (result.startsWith('descargado')) { downloaded++; log('BAJADO  ', local, '-', result); }
      else if (result.startsWith('faltante')) { missing++; log('FALTA   ', local, '<-', cloud); }
      else { failed++; log('ERROR   ', local, '-', result); }
    }

    log('---');
    log(`ya en local: ${ok} | descargados: ${downloaded} | faltantes (dry-run): ${missing} | fallidos: ${failed}`);
  } finally {
    proc.kill('SIGTERM');
  }
}

main().catch((e) => {
  console.error('[sync-videos] fallo:', e.message);
  process.exit(1);
});
