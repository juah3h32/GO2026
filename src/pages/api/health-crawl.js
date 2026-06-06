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

// Verifica que una PAGINA cargue. REINTENTA para descartar timeouts transitorios
// (cold start, lentitud de red del worker) que causaban falsas "paginas caidas".
// 2xx y 3xx = la pagina responde (OK). Solo 4xx/5xx es falla real.
// 4xx no se reintenta (no cambia); 5xx y timeout si (pueden ser transitorios).
async function probePage(url, intentos = 3) {
  let last = { ok: false, status: 0 };
  for (let i = 0; i < intentos; i++) {
    try {
      const r = await fetchT(url, { redirect: 'follow' }, 15000);
      if (r.status < 400) return { ok: true, status: r.status, res: r };
      last = { ok: false, status: r.status, res: r };
      if (r.status < 500) return last; // 4xx: no reintentar
    } catch (e) {
      last = { ok: false, status: 0, error: e.message };
    }
    if (i < intentos - 1) await new Promise(res => setTimeout(res, 1500 * (i + 1)));
  }
  return last;
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
      const probe = await probePage(pageUrl);
      if (!probe.ok) {
        pagesBad++;
        const st = probe.status || 'timeout';
        findings.push({ level: st === 404 ? 'error' : 'warn', tipo: 'pagina', url: pageUrl, status: st });
        await logSystemEvent({ level: st === 404 ? 'error' : 'warn', category: 'crawl', source: pageUrl, message: `Página falló tras reintentos: HTTP ${st}` }).catch(() => {});
        continue;
      }
      pagesOk++;
      try { html = await probe.res.text(); } catch { html = ''; }

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

    // GUARDA ANTI-FALSA-ALARMA: si >=50% de las paginas "fallan" a la vez casi
    // siempre es problema de RED del monitor (timeout/cold start), no del sitio.
    // Lo confirmamos volviendo a probar la home; si abre, fue falsa alarma.
    const totalPaginas = LANGS.length * ROUTES.length;
    const fallaMasiva = pagesBad >= Math.max(3, Math.ceil(totalPaginas * 0.5));
    let falsaAlarmaMasiva = false;
    if (fallaMasiva) {
      const home = await probePage(`${origin}/${LANGS[0]}`, 3);
      falsaAlarmaMasiva = home.ok; // la home SI abre → el monitor se equivoco
    }

    if (notify && activo && nuevas.length && !falsaAlarmaMasiva) {
      // SOLO alerta lo que AFECTA al visitante: paginas que NO abren.
      // Recursos sueltos (imagen/video/css/js) solo se registran en el panel
      // (Monitoreo del Sitio) — sin WhatsApp, para no saturar de notificaciones.
      const paginasNuevasCaidas = [...new Set(nuevas.filter(f => f.tipo === 'pagina').map(f => slugDe(f.url)).filter(Boolean))];
      if (paginasNuevasCaidas.length) {
        if (fallaMasiva) {
          // Caida REAL del sitio completo (home tampoco abrio) → UNA alerta clara,
          // no una lista de 17 paginas.
          const txt = ['*SITIO CAIDO — grupo-ortiz.com*', '', `El sitio no responde (${pagesBad}/${totalPaginas} paginas fallaron).`, 'La pagina de inicio tampoco abre.', '', 'Revisa el deploy / hosting de inmediato.'].join('\n');
          alertSent = await alertaUrgente('crawl-site-down', txt, { ventanaMin: 60 });
          await logSystemEvent({ level: 'critical', category: 'crawl', source: 'health-crawl', message: `SITIO CAIDO confirmado: ${pagesBad}/${totalPaginas} paginas` }).catch(() => {});
        } else {
          // Caida parcial (1-2 paginas): alerta normal por pagina.
          const lineas = ['*PAGINAS CAIDAS — grupo-ortiz.com*', '', 'Estas paginas NO abren:'];
          for (const p of paginasNuevasCaidas) lineas.push(`- ${p === 'home' ? 'Inicio' : p}`);
          lineas.push('', `Para protegerlas responde: *pon en mantenimiento ${paginasNuevasCaidas[0]}*`);
          // dedup por conjunto de paginas caidas (no re-avisa las mismas en 6 h)
          alertSent = await alertaUrgente(`crawl-pages:${paginasNuevasCaidas.sort().join(',')}`, lineas.join('\n'), { ventanaMin: 360 });
          await logSystemEvent({ level: 'critical', category: 'crawl', source: 'health-crawl', message: `${paginasNuevasCaidas.length} pagina(s) caida(s): ${paginasNuevasCaidas.join(', ')}` }).catch(() => {});
        }
      }
    } else if (falsaAlarmaMasiva) {
      // No se envia WhatsApp. Se registra para diagnostico.
      await logSystemEvent({ level: 'warn', category: 'crawl', source: 'health-crawl', message: `Falsa alarma descartada: la home responde, probable timeout de red del monitor (${pagesBad}/${totalPaginas} fallaron)` }).catch(() => {});
    }

    // Guardar el set de lo roto AHORA (solo tipos monitoreables) → si algo se reparó, sale del set.
    // En falsa alarma masiva NO persistimos las paginas (son bogus) para no
    // contaminar el estado ni silenciar una caida real posterior.
    const rotasAhora = (falsaAlarmaMasiva ? activas.filter(f => f.tipo !== 'pagina') : activas).map(f => f.url);
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