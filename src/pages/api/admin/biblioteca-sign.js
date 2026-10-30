// src/pages/api/admin/biblioteca-sign.js
// Firma para subir video DIRECTO del navegador a Cloudinary (resource_type=video).
// Los videos pesan mas de lo que soporta una function de Vercel (~4.5MB) y mas
// del limite de multipart del middleware (6MB) — por eso el archivo nunca pasa
// por nuestro servidor, solo la firma (JSON minusculo).
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

    const cloudName = process.env.PUBLIC_CLOUDINARY_CLOUD_NAME || import.meta.env?.PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey    = process.env.PUBLIC_CLOUDINARY_API_KEY    || import.meta.env?.PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET        || import.meta.env?.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) return json({ ok: false, error: 'Cloudinary no configurado' }, 500);

    const timestamp = Math.floor(Date.now() / 1000);
    const publicId  = `biblioteca-${timestamp}-${Math.random().toString(36).slice(2, 8)}`;
    const folder    = 'GO/biblioteca';

    const toSign    = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`;
    const signature = createHash('sha1').update(toSign + apiSecret).digest('hex');

    return json({ ok: true, cloudName, apiKey, timestamp, publicId, folder, signature });
  } catch (error) {
    return json({ ok: false, error: error.message }, 500);
  }
}
