// src/pages/api/admin/biblioteca-bunny-sign.js
// Crea el objeto de video en Bunny Stream y firma una subida TUS directa
// desde el navegador (igual razon que Cloudinary: el archivo nunca pasa
// por una function de Vercel, solo la firma).
import { createHash } from 'crypto';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';

function canEditBiblioteca(role) {
  if (!role) return false;
  if (role.isAdminRole) return true;
  return Array.isArray(role.tabs) && role.tabs.includes('biblioteca');
}

const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

export const prerender = false;

export async function POST({ request }) {
  try {
    const role = await verifyAdminToken(request).catch(() => null);
    if (!canEditBiblioteca(role)) return json({ ok: false, error: 'No autorizado' }, 401);

    const libraryId = process.env.PUBLIC_BUNNY_LIBRARY_ID || import.meta.env?.PUBLIC_BUNNY_LIBRARY_ID;
    const apiKey     = process.env.BUNNY_STREAM_API_KEY     || import.meta.env?.BUNNY_STREAM_API_KEY;
    if (!libraryId || !apiKey) return json({ ok: false, error: 'Bunny Stream no configurado' }, 500);

    const body = await request.json().catch(() => ({}));
    const title = (body?.title || 'biblioteca-video').slice(0, 120);

    const createRes = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
      method: 'POST',
      headers: { AccessKey: apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!createRes.ok) {
      const errText = await createRes.text().catch(() => '');
      return json({ ok: false, error: `Bunny create video fallo: ${createRes.status} ${errText}` }, 502);
    }
    const created = await createRes.json();
    const videoId = created.guid;

    const expiration = Math.floor(Date.now() / 1000) + 3600; // 1h
    const signature = createHash('sha256').update(`${libraryId}${apiKey}${expiration}${videoId}`).digest('hex');

    return json({
      ok: true,
      videoId,
      libraryId,
      expiration,
      signature,
      tusEndpoint: 'https://video.bunnycdn.com/tusupload',
    });
  } catch (error) {
    return json({ ok: false, error: error.message }, 500);
  }
}

// Consulta el estado de un video ya subido (duracion, miniatura) mientras
// Bunny lo termina de procesar — el admin hace polling corto tras el upload.
export async function GET({ request, url }) {
  try {
    const role = await verifyAdminToken(request).catch(() => null);
    if (!canEditBiblioteca(role)) return json({ ok: false, error: 'No autorizado' }, 401);

    const libraryId = process.env.PUBLIC_BUNNY_LIBRARY_ID || import.meta.env?.PUBLIC_BUNNY_LIBRARY_ID;
    const apiKey     = process.env.BUNNY_STREAM_API_KEY     || import.meta.env?.BUNNY_STREAM_API_KEY;
    const pullZone   = process.env.PUBLIC_BUNNY_PULLZONE_HOSTNAME || import.meta.env?.PUBLIC_BUNNY_PULLZONE_HOSTNAME;
    const videoId = url.searchParams.get('videoId');
    if (!videoId) return json({ ok: false, error: 'videoId requerido' }, 400);

    const r = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`, {
      headers: { AccessKey: apiKey },
    });
    if (!r.ok) return json({ ok: false, error: `Bunny status fallo: ${r.status}` }, 502);
    const v = await r.json();

    return json({
      ok: true,
      duracion: v.length || 0,
      poster: v.length ? `https://${pullZone}/${videoId}/thumbnail.jpg` : '',
      listo: (v.status || 0) >= 3, // 3 = Finished segun docs de Bunny Stream
    });
  } catch (error) {
    return json({ ok: false, error: error.message }, 500);
  }
}
