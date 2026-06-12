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

export async function getCatalog(slug = 'stretch') {
  try {
    const client = db();
    await ensure(client);
    const r = await client.execute({ sql: 'SELECT json FROM catalog_kv WHERE key = ?', args: [slug] });
    if (r.rows.length) return JSON.parse(r.rows[0].json);
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
