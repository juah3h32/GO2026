/*!
 * GO2026 — Sitio Web Oficial de Grupo Ortiz
 * Copyright (c) 2026 JUAN PABLO CORONA CORONA — Desarrollador Web.
 * Todos los derechos reservados. Licencia propietaria (ver LICENSE).
 * Prohibida su copia, modificacion o distribucion sin autorizacion escrita.
 */
// src/pages/api/cron/pagespeed-report.js
// Analisis semanal PageSpeed Insights (mobile + desktop) del sitio.
// Guarda historial y, si la config esta activa, envia resumen por WhatsApp.
// Auth: CRON_SECRET_EXTERNAL (query/header) o token admin. notify=0 → no envia.
export const prerender = false;

import { runPagespeed, buildWAReport } from '../../../lib/pagespeed.js';
import {
  getPagespeedConfig,
  savePagespeedResult,
  touchPagespeedLastSent,
  logSystemEvent,
} from '../../../lib/analytics-db.js';
import { sendWAText } from '../../../lib/notify.js';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';

const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

export async function runPagespeedReport({ notify = true } = {}) {
  const siteUrl = process.env.PUBLIC_SITE_URL || 'https://grupo-ortiz.com';

  // Secuencial: PSI sin API key tolera mal llamadas simultaneas
  const results = {};
  const errors  = [];
  for (const strategy of ['mobile', 'desktop']) {
    try {
      results[strategy] = await runPagespeed(siteUrl, strategy);
      await savePagespeedResult(results[strategy]);
    } catch (err) {
      errors.push(`${strategy}: ${err.message}`);
    }
  }

  if (!results.mobile && !results.desktop) {
    await logSystemEvent({ level: 'error', category: 'cron', source: 'pagespeed-report', message: `PSI fallo total: ${errors.join(' | ')}` }).catch(() => {});
    return { ok: false, error: errors.join(' | '), sent: 0 };
  }

  const report = buildWAReport({ mobile: results.mobile, desktop: results.desktop, siteUrl });

  // Envio: solo si config activa y hay numeros
  let sent = 0;
  const cfg = await getPagespeedConfig();
  if (notify && cfg.active && cfg.phones.length) {
    for (const p of cfg.phones.slice(0, 5)) {
      const phone = typeof p === 'string' ? p : p?.phone;
      if (!phone) continue;
      try { await sendWAText(phone, report); sent++; } catch (err) { errors.push(`send ${phone}: ${err.message}`); }
    }
    if (sent) await touchPagespeedLastSent().catch(() => {});
  }

  await logSystemEvent({
    level: errors.length ? 'warn' : 'info',
    category: 'cron',
    source: 'pagespeed-report',
    message: `PSI ok — mobile:${results.mobile?.performance ?? '-'} desktop:${results.desktop?.performance ?? '-'} sent:${sent}${errors.length ? ' | ' + errors.join(' | ') : ''}`,
  }).catch(() => {});

  return { ok: true, sent, active: cfg.active, results, report, errors };
}

async function run(request, url) {
  const secret = process.env.CRON_SECRET_EXTERNAL || import.meta.env?.CRON_SECRET_EXTERNAL || '';
  const qp     = url.searchParams.get('secret') || '';
  const hdr    = request.headers.get('x-cron-secret') || '';
  const authed = (secret && (qp === secret || hdr === secret)) || !!(await verifyAdminToken(request).catch(() => null));
  if (!authed) return json({ ok: false, error: 'No autorizado' }, 401);

  const notify = url.searchParams.get('notify') !== '0';
  const out    = await runPagespeedReport({ notify });
  return json(out, out.ok ? 200 : 500);
}

export async function GET({ request, url })  { return run(request, url); }
export async function POST({ request, url }) { return run(request, url); }
