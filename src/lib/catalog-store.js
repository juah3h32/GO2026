// src/lib/catalog-store.js
// Fuente de verdad de los catalogos en Turso (clave = slug). Persiste en Vercel.
// Si Turso no esta, cae al seed del registro.
import { createClient } from '@libsql/client';
import { getCatalogMeta } from './catalogs.js';

let ensured = false;

function db() {
  const url = process.env.TURSO_DATABASE_URL || import.meta.env?.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN || import.meta.env?.TURSO_AUTH_TOKEN;
  if (!url || !authToken) throw new Error('Turso no configurado');
  return createClient({ url, authToken });
}

async function ensure(client) {
  if (ensured) return;
  await client.execute(`CREATE TABLE IF NOT EXISTS catalog_kv (
    key TEXT PRIMARY KEY,
    json TEXT NOT NULL,
    updated_at INTEGER
  )`);
  ensured = true;
}

function seedOf(slug) {
  const meta = getCatalogMeta(slug);
  return JSON.parse(JSON.stringify(meta?.seed || {}));
}

const LANGS = ['es', 'en', 'pt', 'zh', 'ar'];
function isMultiLang(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  return LANGS.some(l => l in obj);
}
function mergeLangs(dest, src) {
  if (src === null || src === undefined) return dest;
  if (Array.isArray(dest) && Array.isArray(src)) {
    const mapped = dest.map((item, i) => i < src.length ? mergeLangs(item, src[i]) : item);
    // BUG-4 fix: append new seed items added after first admin save
    return src.length > dest.length ? mapped.concat(src.slice(dest.length)) : mapped;
  }
  if (isMultiLang(dest) || isMultiLang(src)) {
    const r = { ...dest };
    for (const l of LANGS) { if (!(l in r) && l in src) r[l] = src[l]; }
    return r;
  }
  if (dest && typeof dest === 'object' && !Array.isArray(dest) && src && typeof src === 'object') {
    const r = { ...dest };
    // claves ya en Turso: se mergean recursivas (Turso gana en las hojas)
    // claves nuevas del seed que Turso aun no tiene: se rellenan (no se pierden)
    for (const k of Object.keys(src)) { r[k] = (k in r) ? mergeLangs(r[k], src[k]) : src[k]; }
    return r;
  }
  return dest;
}

export async function getCatalog(slug = 'digital-stretch-film') {
  try {
    const client = db();
    await ensure(client);
    const r = await client.execute({ sql: 'SELECT json FROM catalog_kv WHERE key = ?', args: [slug] });
    if (r.rows.length) {
      const stored = JSON.parse(r.rows[0].json);
      return mergeLangs(stored, seedOf(slug));
    }
    const seed = seedOf(slug);
    await client.execute({
      sql: 'INSERT OR REPLACE INTO catalog_kv (key, json, updated_at) VALUES (?, ?, ?)',
      args: [slug, JSON.stringify(seed), Date.now()]
    });
    return seed;
  } catch (e) {
    console.error('[catalog-store] getCatalog fallback a seed:', e.message);
    return seedOf(slug);
  }
}

export async function saveCatalog(slug, obj) {
  const client = db();
  await ensure(client);
  await client.execute({
    sql: 'INSERT OR REPLACE INTO catalog_kv (key, json, updated_at) VALUES (?, ?, ?)',
    args: [slug, JSON.stringify(obj), Date.now()]
  });
  return true;
}
