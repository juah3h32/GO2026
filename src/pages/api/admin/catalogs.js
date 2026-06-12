// src/pages/api/admin/catalogs.js
// Lista de catalogos disponibles (para el dashboard). Solo admin.
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';
import { listCatalogsMeta, getCatalogMeta } from '../../../lib/catalogs.js';

function canEditCatalog(role) {
  if (!role) return false;
  if (role.isAdminRole) return true;
  return Array.isArray(role.tabs) && role.tabs.includes('catalogo');
}

export async function GET({ request }) {
  const role = await verifyAdminToken(request).catch(() => null);
  if (!canEditCatalog(role)) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

  const list = listCatalogsMeta().map(m => {
    const meta = getCatalogMeta(m.slug);
    const cover = meta?.seed?.coverImg || '';
    const folder = meta?.coverImgFolder || 'catalogos';
    const coverUrl = /^https?:\/\//.test(cover) ? cover : (cover ? (cover.startsWith('/') ? cover : `/images/${folder}/${cover}`) : '');
    return { ...m, coverUrl };
  });
  return new Response(JSON.stringify({ catalogs: list }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
