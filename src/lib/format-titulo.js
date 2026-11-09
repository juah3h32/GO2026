// src/lib/format-titulo.js
// Normaliza títulos de vacantes a formato oración (primera letra mayúscula,
// resto minúsculas). Las vacantes creadas vía API de partner (GO Radar, etc.)
// llegan con el título en MAYÚSCULAS y se ven mal en el sitio.
export function formatTitulo(titulo) {
  if (!titulo) return titulo;
  const t = String(titulo).trim();
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}
