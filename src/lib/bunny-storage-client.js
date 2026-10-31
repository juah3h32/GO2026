// src/lib/bunny-storage-client.js
// Cliente server-side para Bunny Storage (producto distinto de Bunny Stream —
// Stream es solo video, Storage es archivos/imagenes genericos + CDN via Pull
// Zone). Usado para imagenes de catalogo (antes Cloudinary, deshabilitado).
const STORAGE_HOSTNAME = process.env.BUNNY_CATALOG_STORAGE_HOSTNAME; // ej ny.storage.bunnycdn.com
const STORAGE_ZONE = process.env.BUNNY_CATALOG_STORAGE_ZONE;         // ej go2026-catalogo
const STORAGE_PASSWORD = process.env.BUNNY_CATALOG_STORAGE_PASSWORD; // password/AccessKey del storage zone
const PULLZONE_HOSTNAME = process.env.PUBLIC_BUNNY_CATALOG_PULLZONE_HOSTNAME; // ej go2026-catalogo.b-cdn.net

function assertConfigured() {
  if (!STORAGE_HOSTNAME || !STORAGE_ZONE || !STORAGE_PASSWORD || !PULLZONE_HOSTNAME) {
    throw new Error('Bunny Storage no configurado (faltan BUNNY_CATALOG_STORAGE_* / PUBLIC_BUNNY_CATALOG_PULLZONE_HOSTNAME)');
  }
}

// Todas las operaciones de este cliente estan confinadas a catalogos/ — evita
// que un path con ".." o similar escape fuera de esa carpeta via la Storage
// API (a diferencia de Vercel Blob, aqui el path si tiene semantica real de
// directorio). Rechaza ".."/"."/segmentos vacios y exige el prefijo catalogos/.
function sanitizeStoragePath(storagePath) {
  const clean = String(storagePath || '').replace(/^\/+|\/+$/g, '');
  const segments = clean.split('/');
  if (!clean || segments.some(s => s === '' || s === '.' || s === '..')) {
    throw new Error(`Ruta de almacenamiento invalida: ${storagePath}`);
  }
  if (segments[0] !== 'catalogos') {
    throw new Error(`Ruta fuera de catalogos/: ${storagePath}`);
  }
  return clean;
}

function publicUrl(storagePath) {
  return `https://${PULLZONE_HOSTNAME}/${storagePath}`;
}

export async function uploadToBunnyStorage(buffer, mime, storagePath) {
  assertConfigured();
  storagePath = sanitizeStoragePath(storagePath);
  const res = await fetch(`https://${STORAGE_HOSTNAME}/${STORAGE_ZONE}/${storagePath}`, {
    method: 'PUT',
    headers: { AccessKey: STORAGE_PASSWORD, 'Content-Type': mime || 'application/octet-stream' },
    body: buffer,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Bunny Storage upload fallo (${res.status}): ${text.slice(0, 160)}`);
  }
  return publicUrl(storagePath);
}

// Lista los archivos de una carpeta (no recursivo — Bunny Storage lista por
// directorio, no por prefijo como Vercel Blob).
export async function listBunnyStorageDir(dirPath) {
  assertConfigured();
  const clean = sanitizeStoragePath(dirPath);
  const res = await fetch(`https://${STORAGE_HOSTNAME}/${STORAGE_ZONE}/${clean}/`, {
    headers: { AccessKey: STORAGE_PASSWORD, Accept: 'application/json' },
  });
  if (res.status === 404) return [];
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Bunny Storage list fallo (${res.status}): ${text.slice(0, 160)}`);
  }
  return res.json();
}

export async function deleteFromBunnyStorage(storagePath) {
  assertConfigured();
  const clean = sanitizeStoragePath(storagePath);
  const res = await fetch(`https://${STORAGE_HOSTNAME}/${STORAGE_ZONE}/${clean}`, {
    method: 'DELETE',
    headers: { AccessKey: STORAGE_PASSWORD },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Bunny Storage delete fallo (${res.status}): ${text.slice(0, 160)}`);
  }
  return true;
}

export function bunnyStoragePublicUrl(storagePath) {
  assertConfigured();
  return publicUrl(storagePath);
}

// Deriva el storagePath (ej "catalogos/stretch/archivo.jpg") a partir de la
// URL publica que guardamos en Turso — necesario para borrar por URL.
export function storagePathFromPublicUrl(url) {
  if (!url || !PULLZONE_HOSTNAME) return null;
  const prefix = `https://${PULLZONE_HOSTNAME}/`;
  return url.startsWith(prefix) ? url.slice(prefix.length) : null;
}
