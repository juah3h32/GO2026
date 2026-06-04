// src/pages/api/logs.js
// Monitoreo: registra (POST) y consulta (GET) logs de sistema.
// - POST público (clientes reportan errores de frontend/video) — validado y limitado.
// - GET / acciones admin → requieren verifyAdminToken.
export const prerender = false;

import { logSystemEvent, getSystemLogs, getLogStats, markLogsSeen, clearSystemLogs } from '../../lib/analytics-db.js';
import { acumularResumen } from '../../lib/alert-center.js';
import { verifyAdminToken } from '../../lib/verifyAdminToken.ts';
import { getClientIp } from '../../lib/rateLimit.ts';

const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

// Categorias de falla del frontend que se acumulan al RESUMEN DIARIO (no urgente).
const RESUMEN_CATEGORIES = ['video', 'js-error', 'resource', 'network'];
const TIPO_CAT = { video: 'video', 'js-error': 'recurso', resource: 'recurso', network: 'recurso' };

// Niveles que un cliente NO autenticado puede registrar (evita que falseen "security").
const CLIENT_LEVELS = ['info', 'warn', 'error'];
const CLIENT_CATEGORIES = ['frontend', 'video', 'animation', 'resource', 'js-error', 'network'];

export async function GET({ request, url }) {
  if (!(await verifyAdminToken(request).catch(() => null))) return json({ ok: false, error: 'No autorizado' }, 401);
  const level    = url.searchParams.get('level') || null;
  const category = url.searchParams.get('category') || null;
  const limit    = Math.min(Number(url.searchParams.get('limit')) || 100, 300);
  const [logs, stats] = await Promise.all([
    getSystemLogs({ level, category, limit }),
    getLogStats(),
  ]);
  return json({ ok: true, logs, stats });
}

export async function POST({ request }) {
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'Bad request' }, 400); }

  // Acciones admin (marcar visto / limpiar)
  if (body.action) {
    if (!(await verifyAdminToken(request).catch(() => null))) return json({ ok: false, error: 'No autorizado' }, 401);
    if (body.action === 'mark-seen') { await markLogsSeen(); return json({ ok: true }); }
    if (body.action === 'clear')     { await clearSystemLogs(); return json({ ok: true }); }
    return json({ ok: false, error: 'Acción desconocida' }, 400);
  }

  // Reporte de cliente (frontend) — validado y acotado.
  const ip = getClientIp(request);
  const level    = CLIENT_LEVELS.includes(body.level) ? body.level : 'error';
  const category = CLIENT_CATEGORIES.includes(body.category) ? body.category : 'frontend';
  const source   = String(body.source || '').slice(0, 200);
  const message  = String(body.message || '').slice(0, 500);
  if (!message) return json({ ok: false, error: 'message requerido' }, 400);

  const meta = {
    ua: (request.headers.get('user-agent') || '').slice(0, 200),
    ...(body.meta && typeof body.meta === 'object' ? body.meta : {}),
  };

  const id = await logSystemEvent({ level, category, source, message, meta, ip });

  // Falla de frontend → al RESUMEN DIARIO (no urgente). El centro de alertas
  // deduplica el mismo detalle y manda 1 resumen al dia. Sin spam instantaneo.
  if (level === 'error' && RESUMEN_CATEGORIES.includes(category)) {
    acumularResumen({ tipo: TIPO_CAT[category] || 'recurso', detalle: `${message.slice(0, 100)} (${source || '/'})` }).catch(() => {});
  }

  return json({ ok: true, id });
}
