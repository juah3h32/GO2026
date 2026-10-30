// src/pages/api/admin/catalog-images.js
// Lista / elimina imagenes de Vercel Blob (carpeta catalogos/) para el editor.
// Solo admin. Antes usaba la Admin API de Cloudinary — migrado porque esa
// cuenta quedo deshabilitada. Usa CATALOG_BLOB_TOKEN (store publico dedicado,
// distinto del BLOB_READ_WRITE_TOKEN original que apunta a un store privado).
export const prerender = false;

import { list, del } from '@vercel/blob';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';

function canEditCatalog(role) {
  if (!role) return false;
  if (role.isAdminRole) return true;
  return Array.isArray(role.tabs) && role.tabs.includes('catalogo');
}
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

const carpetaDe = (pathname) => (pathname && pathname.indexOf('/') >= 0) ? pathname.slice(0, pathname.lastIndexOf('/')) : '(raiz)';

export async function GET({ request, url }) {
  try {
    const role = await verifyAdminToken(request).catch(() => null);
    if (!canEditCatalog(role)) return json({ ok: false, error: 'No autorizado' }, 401);
    const token = process.env.CATALOG_BLOB_TOKEN;
    if (!token) return json({ ok: false, error: 'Vercel Blob no configurado' }, 500);

    // Por defecto solo la carpeta "catalogos" (el editor pide ?folder=catalogos).
    const folder = (url.searchParams.get('folder') || 'catalogos').replace(/^\/+|\/+$/g, '');

    let images = [];
    let cursor;
    let pages = 0;
    do {
      const res = await list({ prefix: folder ? `${folder}/` : undefined, cursor, limit: 100, token });
      res.blobs.forEach(b => images.push({
        url: b.url,
        public_id: b.pathname,
        created_at: b.uploadedAt,
        folder: carpetaDe(b.pathname),
      }));
      cursor = res.cursor;
      pages++;
    } while (cursor && pages < 5);

    images.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
    const folders = Array.from(new Set(images.map(i => i.folder))).sort();
    return json({ ok: true, images, folders });
  } catch (err) {
    return json({ ok: false, error: err.message }, 500);
  }
}

// Elimina una imagen de Vercel Blob por URL (o pathname, equivalente al
// antiguo public_id de Cloudinary).
export async function POST({ request }) {
  try {
    const role = await verifyAdminToken(request).catch(() => null);
    if (!canEditCatalog(role)) return json({ ok: false, error: 'No autorizado' }, 401);
    const token = process.env.CATALOG_BLOB_TOKEN;
    if (!token) return json({ ok: false, error: 'Vercel Blob no configurado' }, 500);

    const body = await request.json();
    const target = body.url || body.public_id;
    if (body.action !== 'delete' || !target) return json({ ok: false, error: 'url requerido' }, 400);

    await del(target, { token });
    return json({ ok: true, deleted: true });
  } catch (err) {
    return json({ ok: false, error: err.message }, 500);
  }
}
