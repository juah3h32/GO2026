/*!
 * GO2026 — Sitio Web Oficial de Grupo Ortiz
 * Copyright (c) 2026 JUAN PABLO CORONA CORONA — Desarrollador Web.
 * Todos los derechos reservados. Licencia propietaria (ver LICENSE).
 * Prohibida su copia, modificacion o distribucion sin autorizacion escrita.
 */
// src/pages/api/health-crawl.js
// ANALYTIC BOT JP — rastreo proactivo del sitio (SOLO LECTURA).
// Visita cada página de grupo-ortiz.com, verifica que cargue (200) y detecta
// recursos rotos (videos/imágenes/links que devuelven 404). Registra hallazgos
// en system_logs para que ANALYTIC BOT JP los diagnostique y avise por WhatsApp.
// Auth: CRON_SECRET_EXTERNAL o cookie admin. No modifica nada.
export const prerender = false;

import { logSystemEvent, getConfig, setConfig } from '../../lib/analytics-db.js';
import { alertaUrgente } from '../../lib/alert-center.js';
import { verifyAdminToken } from '../../lib/verifyAdminToken.ts';

const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

// Clasifica un recurso por su extension/URL en un tipo monitoreable.
function tipoRecurso(url) {
  if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(url) || /\/video\//i.test(url)) return 'video';
  if (/\.(jpg|jpeg|png|webp|gif|svg|avif)(\?|$)/i.test(url)) return 'imagen';
  if (/\.css(\?|$)/i.test(url)) return 'estilo';
  if (/\.(js|mjs)(\?|$)/i.test(url)) return 'script';
  return 'recurso';
}
const ETIQUETA = { imagen: 'imagen', video: 'video', estilo: 'CSS', script: 'JS', recurso: 'recurso', pagina: 'pagina' };
// Mapea cada tipo a la llave de config que lo activa/desactiva.
const CONFIG_KEY = { imagen: 'imagen', video: 'video', estilo: 'estilo', script: 'estilo', recurso: 'estilo', pagina: 'pagina' };

const LANGS = ['es']; // idioma principal; ampliar si se requiere
const ROUTES = [
  '', 'about', 'acolchado', 'arpillas', 'bolsas', 'catalogo', 'cuerdas',
  'distribuidor', 'empaques-flexibles', 'esquineros', 'naturizable',
  'productos', 'rafias', 'sacos', 'social', 'stretch-film', 'vacantes',
];

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

async function fetchT(url, opts = {}, ms = 12000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  try { return await fetch(url, { ...opts, headers: { 'User-Agent': UA, ...(opts.headers || {}) }, signal: ac.signal }); }
  finally { clearTimeout(t); }
}

// Extrae URLs de recursos (src/href) del HTML, normaliza a absolutas.
function extractResources(html, base, origin) {
  const urls = new Set();
  const re = /(?:src|href)\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    let u = m[1].trim();
    if (!u || u.startsWith('data:') || u.startsWith('#') || u.startsWith('mailto:') || u.startsWith('tel:') || u.startsWith('javascript:')) continue;
    if (u.startsWith('//')) u = 'https:' + u;
    else if (u.startsWith('/')) u = origin + u;
    else if (!u.startsWith('http')) continue; // relativos raros: omitir
    urls.add(u.split('#')[0]);
  }
  return [...urls];
}

async function checkResource(url) {
  try {
    let r = await fetchT(url, { method: 'HEAD' }, 9000);
    // Algunos CDNs no soportan HEAD → reintento con GET por rango
    if (r.status === 405 || r.status === 501) {
      r = await fetchT(url, { method: 'GET', headers: { Range: 'bytes=0-0' } }, 9000);
    }
    return r.status;
  } catch { return 0; } // 0 = no respondió / timeout
}

// ── Lógica reutilizable (sin request) — llamada por el endpoint y por el panel ──
// origin = sitio a revisar; notify = enviar alerta WhatsApp de fallas nuevas.
export async function runHealthCrawl({ origin, notify = true } = {}) {
  origin = origin || process.env.PUBLIC_SITE_URL || 'https://grupo-ortiz.com';
  // Solo revisar recursos del PROPIO dominio + Cloudinary (terceros como GA se ignoran).
  const ownHosts = [new URL(origin).host, 'res.cloudinary.com'];

  const findings = [];
  let pagesOk = 0, pagesBad = 0, resChecked = 0, resBad = 0;
  const seenRes = new Set();

  for (const lang of LANGS) {
    for (const route of ROUTES) {
      const pageUrl = `${origin}/${lang}${route ? '/' + route : ''}`;
      let html = '';
      try {
        const r = await fetchT(pageUrl, {}, 14000);
        if (!r.ok) {
          pagesBad++;
          findings.push({ level: r.status === 404 ? 'error' : 'warn', tipo: 'pagina', url: pageUrl, status: r.status });
          await logSystemEvent({ level: r.status === 404 ? 'error' : 'warn', category: 'crawl', source: pageUrl, message: `Página devolvió HTTP ${r.status}` }).catch(() => {});
          continue;
        }
        pagesOk++;
        html = await r.text();
      } catch (e) {
        pagesBad++;
        findings.push({ level: 'error', tipo: 'pagina', url: pageUrl, status: 'timeout' });
        await logSystemEvent({ level: 'error', category: 'crawl', source: pageUrl, message: `Página no respondió: ${e.message}` }).catch(() => {});
        continue;
      }

      // Revisar recursos propios (videos, imágenes, css, links internos) — acotado para no exceder tiempo.
      const resources = extractResources(html, pageUrl, origin)
        .filter(u => { try { return ownHosts.includes(new URL(u).host); } catch { return false; } })
        .filter(u => !seenRes.has(u));
      for (const resUrl of resources.slice(0, 25)) {
        seenRes.add(resUrl);
        const st = await checkResource(resUrl);
        resChecked++;
        if (st === 404 || st === 0 || st >= 500) {
          resBad++;
          const tipo = tipoRecurso(resUrl);
          findings.push({ level: 'error', tipo, url: resUrl, status: st || 'timeout', en: pageUrl });
          await logSystemEvent({
            level: 'error', category: tipo === 'video' ? 'video' : tipo === 'imagen' ? 'imagen' : 'recurso', source: pageUrl,
            message: `${ETIQUETA[tipo]} no carga (${st || 'timeout'}): ${resUrl.slice(0, 160)}`,
          }).catch(() => {});
        }
      }
    }
  }

  // Conteo por tipo de falla
  const porTipo = {};
  for (const f of findings) porTipo[f.tipo] = (porTipo[f.tipo] || 0) + 1;

  const resumen = { paginas_ok: pagesOk, paginas_con_falla: pagesBad, recursos_revisados: resChecked, recursos_rotos: resBad, por_tipo: porTipo };
  await logSystemEvent({
    level: pagesBad || resBad ? 'warn' : 'info', category: 'crawl', source: 'health-crawl',
    message: `Rastreo completo: ${pagesOk} páginas OK, ${pagesBad} con falla, ${resBad} recursos rotos`,
  }).catch(() => {});

  // Slug de pagina afectada (para sugerir mantenimiento por pagina).
  const slugDe = (u) => { try { const m = new URL(u).pathname.match(/^\/(?:es|en|pt|ar|zh)(?:\/([^/?#]+))?/); return m ? (m[1] || 'home') : null; } catch { return null; } };
  const paginasConFalla = [...new Set(findings.filter(f => f.tipo === 'pagina').map(f => slugDe(f.url)).filter(Boolean))];

  // ── Alerta URGENTE inmediata de fallas NUEVAS, segun config y anti-repeticion ──
  let alertSent = 0;
  try {
    const cfg = JSON.parse((await getConfig('site_monitor').catch(() => null)) || '{}');
    const activo = cfg.activo !== false; // default ON
    const tipoActivo = (t) => cfg[CONFIG_KEY[t]] !== false; // cada tipo ON por defecto

    // Fallas de tipos activados
    const activas = findings.filter(f => tipoActivo(f.tipo));
    const seen = new Set(JSON.parse((await getConfig('site_broken_seen').catch(() => null)) || '[]'));
    const nuevas = activas.filter(f => !seen.has(f.url));

    if (notify && activo && nuevas.length) {
      // SOLO alerta lo que AFECTA al visitante: paginas que NO abren.
      // Recursos sueltos (imagen/video/css/js) solo se registran en el panel
      // (Monitoreo del Sitio) — sin WhatsApp, para no saturar de notificaciones.
      const paginasNuevasCaidas = [...new Set(nuevas.filter(f => f.tipo === 'pagina').map(f => slugDe(f.url)).filter(Boolean))];
      if (paginasNuevasCaidas.length) {
        const lineas = ['*PAGINAS CAIDAS — grupo-ortiz.com*', '', 'Estas paginas NO abren:'];
        for (const p of paginasNuevasCaidas) lineas.push(`- ${p === 'home' ? 'Inicio' : p}`);
        lineas.push('', `Para protegerlas responde: *pon en mantenimiento ${paginasNuevasCaidas[0]}*`);
        // dedup por conjunto de paginas caidas (no re-avisa las mismas en 6 h)
        alertSent = await alertaUrgente(`crawl-pages:${paginasNuevasCaidas.sort().join(',')}`, lineas.join('\n'), { ventanaMin: 360 });
        await logSystemEvent({ level: 'critical', category: 'crawl', source: 'health-crawl', message: `${paginasNuevasCaidas.length} pagina(s) caida(s): ${paginasNuevasCaidas.join(', ')}` }).catch(() => {});
      }
    }

    // Guardar el set de lo roto AHORA (solo tipos monitoreables) → si algo se reparó, sale del set.
    const rotasAhora = activas.map(f => f.url);
    await setConfig('site_broken_seen', JSON.stringify([...new Set(rotasAhora)].slice(0, 200))).catch(() => {});
  } catch (e) { console.error('[health-crawl] alerta:', e.message); }

  return { ok: true, resumen, findings: findings.slice(0, 50), paginasConFalla, alertSent };
}

async function run(request, url) {
  const secret = process.env.CRON_SECRET_EXTERNAL || import.meta.env?.CRON_SECRET_EXTERNAL || '';
  const qp = url.searchParams.get('secret') || '';
  const hdr = request.headers.get('x-cron-secret') || '';
  const authed = (secret && (qp === secret || hdr === secret)) || !!(await verifyAdminToken(request).catch(() => null));
  if (!authed) return json({ ok: false, error: 'No autorizado' }, 401);

  const origin = process.env.PUBLIC_SITE_URL || `https://${request.headers.get('host') || 'grupo-ortiz.com'}`;
  const notify = url.searchParams.get('notify') !== '0';
  const out = await runHealthCrawl({ origin, notify });
  return json(out);
}

export async function GET({ request, url }) { return run(request, url); }
export async function POST({ request, url }) { return run(request, url); }