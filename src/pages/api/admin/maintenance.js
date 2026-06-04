/*!
 * GO2026 — Sitio Web Oficial de Grupo Ortiz
 * Copyright (c) 2026 JUAN PABLO CORONA CORONA — Desarrollador Web.
 * Todos los derechos reservados. Licencia propietaria (ver LICENSE).
 */
// src/pages/api/admin/maintenance.js
// Modo mantenimiento POR PAGINA o todo el sitio. Solo admin total.
// Config en global_config['maintenance'] = JSON { all:bool, slugs:[...] }.
import { getConfig, setConfig, logSystemEvent } from '../../../lib/analytics-db.js';
import { notifyAdmins } from '../../../lib/health-alert.js';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';

export const prerender = false;

// Paginas del sitio (slug). 'home' = portada.
export const SITE_SLUGS = ['home', 'about', 'acolchado', 'arpillas', 'bolsas', 'catalogo',
  'cuerdas', 'distribuidor', 'empaques-flexibles', 'esquineros', 'naturizable',
  'productos', 'rafias', 'sacos', 'social', 'stretch-film', 'vacantes'];

const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

// Parseo con retrocompatibilidad: '1' (legacy) → all=true.
export function parseMaint(raw) {
  if (raw === '1') return { all: true, slugs: [] };
  if (!raw || raw === '0') return { all: false, slugs: [] };
  try { const o = JSON.parse(raw); return { all: !!o.all, slugs: Array.isArray(o.slugs) ? o.slugs : [] }; }
  catch { return { all: false, slugs: [] }; }
}

export async function GET({ request }) {
  const role = await verifyAdminToken(request).catch(() => null);
  if (!role) return json({ ok: false, error: 'No autorizado' }, 401);
  const cfg = parseMaint(await getConfig('maintenance').catch(() => null));
  return json({ ok: true, ...cfg, paginas: SITE_SLUGS });
}

export async function POST({ request }) {
  const role = await verifyAdminToken(request).catch(() => null);
  if (!role || !role.canDownload) return json({ ok: false, error: 'No autorizado' }, 401);
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'Bad request' }, 400); }

  const cur = parseMaint(await getConfig('maintenance').catch(() => null));
  let next = cur, aviso = '';

  if (typeof body.all === 'boolean') {
    next = { all: body.all, slugs: body.all ? [] : cur.slugs };
    aviso = body.all
      ? '*SITIO EN MANTENIMIENTO (completo)*\nTodo el sitio publico muestra "estamos mejorando".'
      : '*SITIO REACTIVADO (completo)*\nEl sitio publico volvio a la normalidad.';
  } else if (body.slug && SITE_SLUGS.includes(body.slug)) {
    const set = new Set(cur.slugs);
    if (body.activo) set.add(body.slug); else set.delete(body.slug);
    next = { all: cur.all, slugs: [...set] };
    aviso = body.activo
      ? `*PAGINA EN MANTENIMIENTO*\nSolo la pagina "${body.slug}" muestra "estamos mejorando". El resto del sitio sigue normal.`
      : `*PAGINA REACTIVADA*\nLa pagina "${body.slug}" volvio a la normalidad.`;
  } else {
    return json({ ok: false, error: 'Parametros invalidos' }, 400);
  }

  await setConfig('maintenance', JSON.stringify(next));
  await logSystemEvent({ level: 'warn', category: 'mantenimiento', source: 'admin',
    message: aviso.replace(/\n/g, ' ').replace(/\*/g, '') }).catch(() => {});
  notifyAdmins(aviso).catch(() => {});

  return json({ ok: true, ...next });
}
