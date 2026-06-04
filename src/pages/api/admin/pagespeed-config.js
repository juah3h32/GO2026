/*!
 * GO2026 — Sitio Web Oficial de Grupo Ortiz
 * Copyright (c) 2026 JUAN PABLO CORONA CORONA — Desarrollador Web.
 * Todos los derechos reservados. Licencia propietaria (ver LICENSE).
 * Prohibida su copia, modificacion o distribucion sin autorizacion escrita.
 */
// src/pages/api/admin/pagespeed-config.js
// Config de notificaciones de sistema PageSpeed: telefonos + toggle + correr ya.
import {
  getPagespeedConfig,
  savePagespeedConfig,
  readPagespeedHistory,
} from '../../../lib/analytics-db.js';
import { runPagespeedReport } from '../cron/pagespeed-report.js';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';

export const prerender = false;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET({ request }) {
  try {
    const adminRole = await verifyAdminToken(request);
    if (!adminRole) return json({ ok: false, error: 'No autorizado' }, 401);

    const [config, history] = await Promise.all([
      getPagespeedConfig(),
      readPagespeedHistory(4),
    ]);
    return json({ ok: true, config, history });
  } catch (err) {
    console.error('[pagespeed-config GET]', err);
    return json({ ok: false, error: err.message }, 500);
  }
}

export async function POST({ request }) {
  try {
    const adminRole = await verifyAdminToken(request);
    if (!adminRole) return json({ ok: false, error: 'No autorizado' }, 401);

    const body = await request.json();
    const { action } = body;

    // ── save — guarda telefonos y toggle ─────────────────────────────────────
    if (action === 'save') {
      const phones = Array.isArray(body.phones) ? body.phones : [];
      await savePagespeedConfig({ phones, active: !!body.active });
      return json({ ok: true });
    }

    // ── run — analiza ahora y envia (si config activa) ───────────────────────
    if (action === 'run') {
      const out = await runPagespeedReport({ notify: body.notify !== false });
      return json(out, out.ok ? 200 : 500);
    }

    return json({ ok: false, error: 'Acción desconocida' }, 400);

  } catch (err) {
    console.error('[pagespeed-config POST]', err);
    return json({ ok: false, error: err.message }, 500);
  }
}
