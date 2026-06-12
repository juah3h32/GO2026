// src/pages/api/admin/catalog-image.js
// Sube imagen del catalogo. Solo admin.
//  - Cloudinary: carpeta catalogos/<categoria> (o catalogos/portada).
//  - Local (dev): public/images/<categoria> para fichas, public/images/catalogos para portada.
// Devuelve el nombre de archivo que la pagina usa en img/coverImg.
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';

function canEditCatalog(role) {
  if (!role) return false;
  if (role.isAdminRole) return true;
  return Array.isArray(role.tabs) && role.tabs.includes('catalogo');
}
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

async function uploadToCloudinary(buffer, mime, folder, publicId) {
  const cloudName = process.env.PUBLIC_CLOUDINARY_CLOUD_NAME || import.meta.env?.PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey    = process.env.PUBLIC_CLOUDINARY_API_KEY    || import.meta.env?.PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET        || import.meta.env?.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) throw new Error('Cloudinary no configurado');

  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`;
  const signature = createHash('sha1').update(toSign + apiSecret).digest('hex');

  const form = new FormData();
  form.append('file', new Blob([buffer], { type: mime }), publicId);
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('public_id', publicId);
  form.append('folder', folder);
  form.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: form });
  if (!res.ok) { const b = await res.text(); throw new Error(`Cloudinary HTTP ${res.status}: ${b.slice(0, 160)}`); }
  const data = await res.json();
  return data.secure_url;
}

export async function POST({ request }) {
  try {
    const role = await verifyAdminToken(request).catch(() => null);
    if (!canEditCatalog(role)) return json({ error: 'No autorizado' }, 401);

    const form = await request.formData();
    const file = form.get('file');
    const target = String(form.get('target') || ''); // 'cover' | indice de ficha
    const category = String(form.get('category') || 'stretch').toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'stretch';

    if (!file || typeof file === 'string') return json({ error: 'Sin archivo' }, 400);
    const mime = file.type || '';
    const ext = /png/.test(mime) ? 'png' : /webp/.test(mime) ? 'webp' : /jpe?g/.test(mime) ? 'jpg' : '';
    if (!ext) return json({ error: 'Formato no soportado (usa PNG, JPG o WEBP)' }, 400);

    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length > 6 * 1024 * 1024) return json({ error: 'Imagen muy grande (max 6MB)' }, 413);

    const isCover = target === 'cover';
    const localDir = isCover ? 'catalogos' : category;            // public/images/<localDir>
    const base = (isCover ? `${category}-portada` : `${category}-${target}`).replace(/[^a-z0-9_-]/gi, '-');
    const stamp = Date.now();
    const filename = `${base}-${stamp}.${ext}`;

    // 1) Copia local (solo funciona donde el FS es escribible: dev)
    let localOk = false, localErr = null;
    try {
      const dir = path.resolve('./public/images/' + localDir);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, filename), buffer);
      localOk = true;
    } catch (e) { localErr = e.message; }

    // 2) Cloudinary: catalogos/<categoria|portada>
    let cloudUrl = null, cloudErr = null;
    try {
      cloudUrl = await uploadToCloudinary(buffer, mime, `catalogos/${isCover ? 'portada' : category}`, `${base}-${stamp}`);
    } catch (e) { cloudErr = e.message; }

    if (!localOk && !cloudUrl) return json({ error: 'No se pudo guardar (local: ' + localErr + ' | cloud: ' + cloudErr + ')' }, 500);

    return json({ ok: true, filename, localDir, localOk, cloudUrl, cloudErr });
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}
