// src/pages/api/admin/catalog-images.js
// Lista imagenes existentes en Cloudinary (carpeta catalogos/) para elegir desde el editor.
// Solo admin. Usa Cloudinary Admin API (Basic auth apiKey:apiSecret).
export const prerender = false;

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

    const cloudName = process.env.PUBLIC_CLOUDINARY_CLOUD_NAME || import.meta.env?.PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey    = process.env.PUBLIC_CLOUDINARY_API_KEY    || import.meta.env?.PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET        || import.meta.env?.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) return json({ ok: false, error: 'Cloudinary no configurado' }, 500);

    // Prefijo: por categoria si viene, si no toda la carpeta catalogos
    const category = (url.searchParams.get('category') || '').toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const prefix = category ? `catalogos/${category}` : 'catalogos';

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const api = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?type=upload&prefix=${encodeURIComponent(prefix)}&max_results=200`;
    const res = await fetch(api, { headers: { Authorization: `Basic ${auth}` } });
    if (!res.ok) { const b = await res.text(); return json({ ok: false, error: `Cloudinary HTTP ${res.status}: ${b.slice(0, 160)}` }, 502); }
    const data = await res.json();
    const images = (data.resources || []).map(r => ({
      url: r.secure_url,
      public_id: r.public_id,
      created_at: r.created_at,
    }));
    // Mas recientes primero
    images.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
    return json({ ok: true, images });
  } catch (err) {
    return json({ ok: false, error: err.message }, 500);
  }
}
