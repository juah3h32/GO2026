// src/pages/api/orchestrator.js
// ANALYTIC BOT JP — análisis diario orquestado. Corre los agentes por área y,
// si hay fallas, avisa por WhatsApp a los admins. Auth: CRON_SECRET o admin.
export const prerender = false;

import { runOrchestrator } from '../../lib/orchestrator.js';
import { getWAAuthorized } from '../../lib/analytics-db.js';
import { sendWAText } from '../../lib/notify.js';
import { verifyAdminToken } from '../../lib/verifyAdminToken.ts';

const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

async function run(request, url) {
  const secret = process.env.CRON_SECRET_EXTERNAL || import.meta.env?.CRON_SECRET_EXTERNAL || '';
  const qp = url.searchParams.get('secret') || '';
  const hdr = request.headers.get('x-cron-secret') || '';
  const authed = (secret && (qp === secret || hdr === secret)) || !!(await verifyAdminToken(request).catch(() => null));
  if (!authed) return json({ ok: false, error: 'No autorizado' }, 401);

  const report = await runOrchestrator();

  // Avisar a admins solo si NO está todo en orden (el reporte diario completo se puede pedir aparte).
  const notify = url.searchParams.get('notify') !== '0';
  let sent = 0;
  if (notify && report.severity !== 'ok') {
    const auth = (await getWAAuthorized().catch(() => [])).filter(a => a.active && a.phone);
    for (const a of auth.slice(0, 5)) {
      try { await sendWAText(a.phone, report.text); sent++; } catch {}
    }
  }
  return json({ ok: true, severity: report.severity, sent, report: report.text });
}

export async function GET({ request, url }) { return run(request, url); }
export async function POST({ request, url }) { return run(request, url); }
