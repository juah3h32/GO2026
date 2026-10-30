// src/pages/api/admin/catalog-image.js
// Sube imagen del catalogo. Solo admin.
//  - Vercel Blob: carpeta catalogos/<categoria> (o catalogos/portada) — antes
//    era Cloudinary, migrado porque esa cuenta quedo deshabilitada. Usa un
//    store PUBLICO dedicado (CATALOG_BLOB_TOKEN) — el BLOB_READ_WRITE_TOKEN
//    original apunta a un store privado, no sirve para servir imagenes al
//    publico ni para que Puppeteer las lea al generar el PDF.
//  - Local (dev): public/images/<categoria> para fichas, public/images/catalogos para portada.
// Devuelve el nombre de archivo que la pagina usa en img/coverImg.
import fs from 'fs';
import path from 'path';
import { put } from '@vercel/blob';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';

function canEditCatalog(role) {
  if (!role) return false;
  if (role.isAdminRole) return true;
  return Array.isArray(role.tabs) && role.tabs.includes('catalogo');
}
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

async function uploadToBlob(buffer, mime, folder, filename) {
  const token = process.env.CATALOG_BLOB_TOKEN;
  if (!token) throw new Error('Vercel Blob no configurado (falta CATALOG_BLOB_TOKEN)');
  const blob = await put(`${folder}/${filename}`, buffer, {
    access: 'public',
    contentType: mime,
    token,
    addRandomSuffix: false,
  });
  return blob.url;
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

    // 2) Vercel Blob: catalogos/<categoria|portada>
    let cloudUrl = null, cloudErr = null;
    try {
      cloudUrl = await uploadToBlob(buffer, mime, `catalogos/${isCover ? 'portada' : category}`, filename);
    } catch (e) { cloudErr = e.message; }

    if (!localOk && !cloudUrl) return json({ error: 'No se pudo guardar (local: ' + localErr + ' | cloud: ' + cloudErr + ')' }, 500);

    return json({ ok: true, filename, localDir, localOk, cloudUrl, cloudErr });
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}
