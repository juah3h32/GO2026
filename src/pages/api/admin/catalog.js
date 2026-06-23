// src/pages/api/admin/catalog.js
// Catalogo en Turso. Solo admin (token JWT valido).
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';
import { getCatalog, saveCatalog } from '../../../lib/catalog-store.js';

async function triggerPdfRegeneration(slug) {
  const pat = process.env.GITHUB_PAT;
  if (!pat) return;
  await fetch('https://api.github.com/repos/juah3h32/GO2026/dispatches', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${pat}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({ event_type: 'catalogo-updated', client_payload: { slug } }),
  });
}

function canEditCatalog(role) {
  if (!role) return false;
  if (role.isAdminRole) return true;
  return Array.isArray(role.tabs) && role.tabs.includes('catalogo');
}
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });
const unauthorized = () => json({ error: 'No autorizado' }, 401);

export async function GET({ request, url }) {
  try {
    const role = await verifyAdminToken(request).catch(() => null);
    if (!canEditCatalog(role)) return unauthorized();
    const slug = url.searchParams.get('slug') || 'stretch';
    const data = await getCatalog(slug);
    return json(data);
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}

export async function POST({ request, url }) {
  try {
    const role = await verifyAdminToken(request).catch(() => null);
    if (!canEditCatalog(role)) return unauthorized();

    const body = await request.json();
    if (!body || typeof body !== 'object' || !Array.isArray(body.fichas)) {
      return json({ error: 'Formato de catálogo inválido' }, 400);
    }
    const slug = (body.__slug) || url.searchParams.get('slug') || 'stretch';
    delete body.__slug;
    await saveCatalog(slug, body);
    triggerPdfRegeneration(slug).catch(() => {});
    return json({ success: true, message: 'Catálogo actualizado' });
  } catch (error) {
    console.error('Error al guardar catálogo:', error);
    return json({ error: error.message }, 500);
  }
}
