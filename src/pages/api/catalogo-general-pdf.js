// src/pages/api/catalogo-general-pdf.js
// Redirige al PDF pre-generado en Cloudinary.
// Para actualizar: node scripts/generate-general-pdfs.mjs
export const prerender = false;

const CLOUD_NAME = process.env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfuzfdrat';

export async function GET({ url }) {
  const lang  = (url.searchParams.get('lang')  || 'es').toLowerCase();
  const theme =  url.searchParams.get('theme') || 'dark';
  const filename = `Catalogo-General-${lang.toUpperCase()}-${theme}`;
  const cloudinaryUrl = `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload/catalogo-general/${filename}.pdf`;
  return Response.redirect(cloudinaryUrl, 307);
}
