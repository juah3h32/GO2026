// src/pages/api/admin/catalog-images.js
// Lista / elimina imagenes de Bunny Storage (carpeta catalogos/) para el
// editor. Solo admin. Antes usaba la Admin API de Cloudinary — migrado
// porque esa cuenta quedo deshabilitada.
export const prerender = false;

import { listBunnyStorageDir, deleteFromBunnyStorage, bunnyStoragePublicUrl, storagePathFromPublicUrl } from '../../../lib/bunny-storage-client.js';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';

function canEditCatalog(role) {
  if (!role) return false;
  if (role.isAdminRole) return true;
  return Array.isArray(role.tabs) && role.tabs.includes('catalogo');
}
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

export async function GET({ request, url }) {
  try {
    const role = await verifyAdminToken(request).catch(() => null);
    if (!canEditCatalog(role)) return json({ ok: false, error: 'No autorizado' }, 401);

    // Por defecto solo la carpeta "catalogos" (el editor pide ?folder=catalogos).
    const folder = (url.searchParams.get('folder') || 'catalogos').replace(/^\/+|\/+$/g, '');

    // Bunny Storage lista por directorio (no por prefijo global como Vercel
    // Blob) — primero listamos las subcarpetas (una por categoria/portada),
    // luego los archivos de cada una.
    const entries = await listBunnyStorageDir(folder);
    const subdirs = entries.filter(e => e.IsDirectory).map(e => e.ObjectName);

    const perSubdir = await Promise.all(subdirs.map(async (sub) => {
      const files = await listBunnyStorageDir(`${folder}/${sub}`);
      return files.filter(f => !f.IsDirectory).map(f => ({
        url: bunnyStoragePublicUrl(`${folder}/${sub}/${f.ObjectName}`),
        public_id: `${folder}/${sub}/${f.ObjectName}`,
        created_at: f.DateCreated,
        folder: sub,
      }));
    }));
    const images = perSubdir.flat();

    images.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
    const folders = Array.from(new Set(images.map(i => i.folder))).sort();
    return json({ ok: true, images, folders });
  } catch (err) {
    return json({ ok: false, error: err.message }, 500);
  }
}

// Elimina una imagen de Bunny Storage por URL (o pathname, equivalente al
// antiguo public_id de Cloudinary).
export async function POST({ request }) {
  try {
    const role = await verifyAdminToken(request).catch(() => null);
    if (!canEditCatalog(role)) return json({ ok: false, error: 'No autorizado' }, 401);

    const body = await request.json();
    const target = (body.url && storagePathFromPublicUrl(body.url)) || body.public_id;
    if (body.action !== 'delete' || !target) return json({ ok: false, error: 'url requerido' }, 400);

    await deleteFromBunnyStorage(target);
    return json({ ok: true, deleted: true });
  } catch (err) {
    return json({ ok: false, error: err.message }, 500);
  }
}
