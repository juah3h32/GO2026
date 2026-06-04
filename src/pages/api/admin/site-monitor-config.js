/*!
 * GO2026 — Sitio Web Oficial de Grupo Ortiz
 * Copyright (c) 2026 JUAN PABLO CORONA CORONA — Desarrollador Web.
 * Todos los derechos reservados. Licencia propietaria (ver LICENSE).
 * Prohibida su copia, modificacion o distribucion sin autorizacion escrita.
 */
// src/pages/api/admin/site-monitor-config.js
// Config del monitoreo del sitio: que fallas (imagen/video/pagina/css-js)
// disparan alerta urgente por WhatsApp. Y "revisar ahora".
import { getConfig, setConfig, getSystemLogs } from '../../../lib/analytics-db.js';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';

export const prerender = false;

const DEFAULT = { activo: true, imagen: true, video: true, pagina: true, estilo: true };

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

function readCfg(raw) {
  try { return { ...DEFAULT, ...(JSON.parse(raw || '{}')) }; } catch { return { ...DEFAULT }; }
}

export async function GET({ request }) {
  try {
    const adminRole = await verifyAdminToken(request);
    if (!adminRole) return json({ ok: false, error: 'No autorizado' }, 401);
    const config = readCfg(await getConfig('site_monitor').catch(() => null));
    // Deduplicar por mensaje (los mismos errores se repiten) y limitar a 5.
    const vistos = new Set();
    const fallas = [];
    for (const l of (await getSystemLogs({ limit: 60 }).catch(() => []))) {
      if (!['crawl', 'video', 'imagen', 'recurso'].includes(l.category)) continue;
      if (l.level !== 'error' && l.level !== 'critical') continue;
      const k = String(l.message || '').slice(0, 80);
      if (vistos.has(k)) continue;
      vistos.add(k);
      fallas.push({ cuando: l.ts, nivel: l.level, area: l.category, detalle: l.message });
      if (fallas.length >= 5) break;
    }
    return json({ ok: true, config, fallas });
  } catch (err) {
    console.error('[site-monitor-config GET]', err);
    return json({ ok: false, error: err.message }, 500);
  }
}

export async function POST({ request }) {
  try {
    const adminRole = await verifyAdminToken(request);
    if (!adminRole) return json({ ok: false, error: 'No autorizado' }, 401);
    const body = await request.json();

    if (body.action === 'save') {
      const c = body.config || {};
      const config = {
        activo: !!c.activo, imagen: !!c.imagen, video: !!c.video,
        pagina: !!c.pagina, estilo: !!c.estilo,
      };
      await setConfig('site_monitor', JSON.stringify(config));
      return json({ ok: true, config });
    }

    if (body.action === 'run') {
      // Llamada DIRECTA (sin fetch interno, que fallaba con https en local → 500).
      const { runHealthCrawl } = await import('../health-crawl.js');
      const origin = process.env.PUBLIC_SITE_URL || import.meta.env?.PUBLIC_SITE_URL || 'https://grupo-ortiz.com';
      const out = await runHealthCrawl({ origin, notify: true });
      return json(out, out.ok ? 200 : 500);
    }

    return json({ ok: false, error: 'Acción desconocida' }, 400);
  } catch (err) {
    console.error('[site-monitor-config POST]', err);
    return json({ ok: false, error: err.message }, 500);
  }
}
