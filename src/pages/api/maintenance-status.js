/*!
 * GO2026 — Sitio Web Oficial de Grupo Ortiz
 * Copyright (c) 2026 JUAN PABLO CORONA CORONA — Desarrollador Web.
 */
// src/pages/api/maintenance-status.js
// Estado de mantenimiento — PUBLICO y ligero. Lo consulta el script del layout
// para redirigir a /mantenimiento (las paginas son estaticas y no pasan por el
// middleware; este endpoint SSR es el que conoce el estado en vivo).
import { getConfig } from '../../lib/analytics-db.js';
export const prerender = false;

export async function GET() {
  let all = false, slugs = [];
  try {
    const raw = await getConfig('maintenance');
    if (raw === '1') { all = true; }
    else if (raw && raw !== '0') { const o = JSON.parse(raw); all = !!o.all; slugs = Array.isArray(o.slugs) ? o.slugs : []; }
  } catch { /* sin mantenimiento */ }
  return new Response(JSON.stringify({ all, slugs }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      // Sin cache: al activar/reactivar desde WhatsApp o panel, el cambio se
      // refleja de inmediato (antes el CDN cacheaba 30s y parecia no reactivar).
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
