// src/pages/api/biblioteca.js
import { saveBibliotecaVideo, readBibliotecaVideos, updateBibliotecaVideo, deleteBibliotecaVideo, toggleBibliotecaVideo } from '../../lib/analytics-db.js';
import { verifyAdminToken } from '../../lib/verifyAdminToken.ts';

export const prerender = false;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

export async function GET() {
  try {
    const videos = await readBibliotecaVideos(true);
    return json({ ok: true, videos });
  } catch (err) {
    console.error('[biblioteca GET]', err);
    return json({ ok: false, error: `DB error: ${err?.message || err}` }, 500);
  }
}

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { action } = body;

    const adminRole = await verifyAdminToken(request);
    if (!adminRole) return json({ ok: false, error: 'No autorizado' }, 401);

    if (action === 'list') {
      const videos = await readBibliotecaVideos(false);
      return json({ ok: true, videos });
    }

    if (action === 'create') {
      const { categoria, cliente, empresa, titulo, ubicacion, producto, cloudinaryId, poster, activo, destacado, duracion, orden } = body;
      if (!cloudinaryId) return json({ ok: false, error: 'Falta el video.' }, 400);
      if (!cliente?.trim()) return json({ ok: false, error: 'El título del video es obligatorio.' }, 400);
      const result = await saveBibliotecaVideo({ categoria, cliente, empresa, titulo, ubicacion, producto, cloudinaryId, poster, activo, destacado, duracion, orden });
      return json({ ok: true, id: result.id });
    }

    if (action === 'update') {
      const { id, categoria, cliente, empresa, titulo, ubicacion, producto, cloudinaryId, poster, activo, destacado, duracion, orden } = body;
      if (!id) return json({ ok: false, error: 'ID requerido.' }, 400);
      if (!cliente?.trim()) return json({ ok: false, error: 'El título del video es obligatorio.' }, 400);
      await updateBibliotecaVideo({ id, categoria, cliente, empresa, titulo, ubicacion, producto, cloudinaryId, poster, activo, destacado, duracion, orden });
      return json({ ok: true });
    }

    if (action === 'delete') {
      if (!body.id) return json({ ok: false, error: 'ID requerido.' }, 400);
      await deleteBibliotecaVideo(body.id);
      return json({ ok: true });
    }

    if (action === 'toggle') {
      const { id, activo } = body;
      if (!id) return json({ ok: false, error: 'ID requerido.' }, 400);
      await toggleBibliotecaVideo(id, activo);
      return json({ ok: true });
    }

    return json({ ok: false, error: 'Acción desconocida.' }, 400);
  } catch (err) {
    console.error('❌ [api/biblioteca] Error:', err);
    return json({ ok: false, error: err.message }, 500);
  }
}
