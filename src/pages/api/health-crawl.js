// src/pages/api/health-crawl.js
// ANALYTIC BOT JP — rastreo proactivo del sitio (SOLO LECTURA).
// Visita cada página de grupo-ortiz.com, verifica que cargue (200) y detecta
// recursos rotos (videos/imágenes/links que devuelven 404). Registra hallazgos
// en system_logs para que ANALYTIC BOT JP los diagnostique y avise por WhatsApp.
// Auth: CRON_SECRET_EXTERNAL o cookie admin. No modifica nada.
export const prerender = false;

import { logSystemEvent } from '../../lib/analytics-db.js';
import { verifyAdminToken } from '../../lib/verifyAdminToken.ts';

const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

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

async function run(request, url) {
  const secret = process.env.CRON_SECRET_EXTERNAL || import.meta.env?.CRON_SECRET_EXTERNAL || '';
  const qp = url.searchParams.get('secret') || '';
  const hdr = request.headers.get('x-cron-secret') || '';
  const authed = (secret && (qp === secret || hdr === secret)) || !!(await verifyAdminToken(request).catch(() => null));
  if (!authed) return json({ ok: false, error: 'No autorizado' }, 401);

  const origin = process.env.PUBLIC_SITE_URL || `https://${request.headers.get('host') || 'grupo-ortiz.com'}`;
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
          findings.push({ level: r.status === 404 ? 'error' : 'warn', tipo: 'ruta', url: pageUrl, status: r.status });
          await logSystemEvent({ level: r.status === 404 ? 'error' : 'warn', category: 'crawl', source: pageUrl, message: `Página devolvió HTTP ${r.status}` }).catch(() => {});
          continue;
        }
        pagesOk++;
        html = await r.text();
      } catch (e) {
        pagesBad++;
        findings.push({ level: 'error', tipo: 'ruta', url: pageUrl, status: 'timeout' });
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
          const esVideo = /\.(mp4|webm|mov)(\?|$)/i.test(resUrl) || /\/video\//.test(resUrl);
          findings.push({ level: 'error', tipo: esVideo ? 'video' : 'recurso', url: resUrl, status: st || 'timeout', en: pageUrl });
          await logSystemEvent({
            level: 'error', category: esVideo ? 'video' : 'recurso', source: pageUrl,
            message: `${esVideo ? 'Video' : 'Recurso'} no carga (${st || 'timeout'}): ${resUrl.slice(0, 160)}`,
          }).catch(() => {});
        }
      }
    }
  }

  const resumen = { paginas_ok: pagesOk, paginas_con_falla: pagesBad, recursos_revisados: resChecked, recursos_rotos: resBad };
  await logSystemEvent({
    level: pagesBad || resBad ? 'warn' : 'info', category: 'crawl', source: 'health-crawl',
    message: `Rastreo completo: ${pagesOk} páginas OK, ${pagesBad} con falla, ${resBad} recursos rotos`,
  }).catch(() => {});

  return json({ ok: true, resumen, findings: findings.slice(0, 50) });
}

export async function GET({ request, url }) { return run(request, url); }
export async function POST({ request, url }) { return run(request, url); }
