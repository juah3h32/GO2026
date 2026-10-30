// src/pages/api/admin/product-videos.js
// CRUD minimo de los 10 slots de video del carrusel de productos (Bunny Stream
// + respaldo local ya existente en public/videos/carrusel).
import { readProductVideos, setProductVideo } from '../../../lib/analytics-db.js';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';

export const prerender = false;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

function canEditProductVideos(role) {
  if (!role) return false;
  if (role.isAdminRole) return true;
  return Array.isArray(role.tabs) && role.tabs.includes('productos_videos');
}

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { action } = body;

    const role = await verifyAdminToken(request);
    if (!canEditProductVideos(role)) return json({ ok: false, error: 'No autorizado' }, 401);

    if (action === 'list') {
      const videos = await readProductVideos();
      return json({ ok: true, videos });
    }

    if (action === 'update') {
      const { slotKey, bunnyVideoId } = body;
      if (!slotKey || !bunnyVideoId) return json({ ok: false, error: 'slotKey y bunnyVideoId requeridos.' }, 400);
      await setProductVideo(slotKey, bunnyVideoId);
      return json({ ok: true });
    }

    return json({ ok: false, error: 'Acción desconocida.' }, 400);
  } catch (err) {
    console.error('[api/admin/product-videos] Error:', err);
    return json({ ok: false, error: err.message }, 500);
  }
}
