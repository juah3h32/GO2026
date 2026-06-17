// src/pages/api/admin/catalog-images.js
// Lista / elimina imagenes de Cloudinary (carpeta catalogos/) para el editor.
// Solo admin. Usa Cloudinary Admin API (Basic auth apiKey:apiSecret).
export const prerender = false;

import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';

function canEditCatalog(role) {
  if (!role) return false;
  if (role.isAdminRole) return true;
  return Array.isArray(role.tabs) && role.tabs.includes('catalogo');
}
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

function creds() {
  const cloudName = process.env.PUBLIC_CLOUDINARY_CLOUD_NAME || import.meta.env?.PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey    = process.env.PUBLIC_CLOUDINARY_API_KEY    || import.meta.env?.PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET        || import.meta.env?.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, auth: Buffer.from(`${apiKey}:${apiSecret}`).toString('base64') };
}

export async function GET({ request, url }) {
  try {
    const role = await verifyAdminToken(request).catch(() => null);
    if (!canEditCatalog(role)) return json({ ok: false, error: 'No autorizado' }, 401);
    const c = creds();
    if (!c) return json({ ok: false, error: 'Cloudinary no configurado' }, 500);

    // Por defecto solo la carpeta "catalogos" (el editor pide ?folder=catalogos).
    const folder = (url.searchParams.get('folder') || 'catalogos').replace(/^\/+|\/+$/g, '');

    const carpetaDe = (pid) => (pid && pid.indexOf('/') >= 0) ? pid.slice(0, pid.lastIndexOf('/')) : '(raiz)';
    let images = [];
    let cursor = '';
    let pages = 0;
    do {
      const q = (folder ? `&prefix=${encodeURIComponent(folder)}` : '') + (cursor ? `&next_cursor=${encodeURIComponent(cursor)}` : '');
      const api = `https://api.cloudinary.com/v1_1/${c.cloudName}/resources/image?type=upload&max_results=100${q}`;
      const res = await fetch(api, { headers: { Authorization: `Basic ${c.auth}` } });
      if (!res.ok) { const b = await res.text(); return json({ ok: false, error: `Cloudinary HTTP ${res.status}: ${b.slice(0, 160)}` }, 502); }
      const data = await res.json();
      (data.resources || []).forEach(r => images.push({ url: r.secure_url, public_id: r.public_id, created_at: r.created_at, folder: carpetaDe(r.public_id) }));
      cursor = data.next_cursor || '';
      pages++;
    } while (cursor && pages < 5);

    images.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
    const folders = Array.from(new Set(images.map(i => i.folder))).sort();
    return json({ ok: true, images, folders });
  } catch (err) {
    return json({ ok: false, error: err.message }, 500);
  }
}

// Elimina una imagen de Cloudinary por public_id
export async function POST({ request }) {
  try {
    const role = await verifyAdminToken(request).catch(() => null);
    if (!canEditCatalog(role)) return json({ ok: false, error: 'No autorizado' }, 401);
    const c = creds();
    if (!c) return json({ ok: false, error: 'Cloudinary no configurado' }, 500);

    const body = await request.json();
    if (body.action !== 'delete' || !body.public_id) return json({ ok: false, error: 'public_id requerido' }, 400);

    const api = `https://api.cloudinary.com/v1_1/${c.cloudName}/resources/image/upload?public_ids[]=${encodeURIComponent(body.public_id)}`;
    const res = await fetch(api, { method: 'DELETE', headers: { Authorization: `Basic ${c.auth}` } });
    if (!res.ok) { const b = await res.text(); return json({ ok: false, error: `Cloudinary HTTP ${res.status}: ${b.slice(0, 160)}` }, 502); }
    const data = await res.json();
    const ok = data.deleted && data.deleted[body.public_id] === 'deleted';
    return json({ ok: true, deleted: ok, raw: data.deleted || {} });
  } catch (err) {
    return json({ ok: false, error: err.message }, 500);
  }
}
