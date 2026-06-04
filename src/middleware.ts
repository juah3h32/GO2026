import { defineMiddleware } from 'astro:middleware';
import { logSystemEvent, getConfig } from './lib/analytics-db.js';

// ── Modo mantenimiento (por pagina o completo): config cacheada 30s ──
let _maintCache: { val: { all: boolean; slugs: string[] }; exp: number } = { val: { all: false, slugs: [] }, exp: 0 };
async function getMaint(): Promise<{ all: boolean; slugs: string[] }> {
  const now = Date.now();
  if (now < _maintCache.exp) return _maintCache.val;
  let val = { all: false, slugs: [] as string[] };
  try {
    const raw = await getConfig('maintenance');
    if (raw === '1') val = { all: true, slugs: [] };
    else if (raw && raw !== '0') { const o = JSON.parse(raw); val = { all: !!o.all, slugs: Array.isArray(o.slugs) ? o.slugs : [] }; }
  } catch { /* default: sin mantenimiento */ }
  _maintCache = { val, exp: now + 30_000 };
  return val;
}
// Extrae el slug de una ruta publica /{lang}/{slug}; portada = 'home'.
function slugDeRuta(path: string): string | null {
  const m = path.match(/^\/(es|en|pt|ar|zh)(?:\/([^/?#]+))?/);
  if (!m) return null;
  return m[2] || 'home';
}

// Registra un golpe de rate-limit (posible scraping/extracción) sin bloquear la respuesta.
function logAbuse(bucket: string, ip: string, path: string) {
  logSystemEvent({
    level: 'security', category: 'rate-limit',
    source: path, message: `Límite de peticiones superado (${bucket}) — posible extracción de datos`,
    ip,
  }).catch(() => {});
}

// ── Rate limiter en memoria (sliding window por IP) ───────────────────────────
// Nota: en Vercel serverless cada instancia tiene su propio Map.
// Para protección robusta de burst en una sola instancia, esto es suficiente.
const RL_STORE = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string, limit: number, windowMs: number): boolean {
  const now  = Date.now();
  const entry = RL_STORE.get(ip);
  if (!entry || now > entry.resetAt) {
    RL_STORE.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (entry.count >= limit) return true;
  entry.count++;
  return false;
}

// Limpia el Map periódicamente para evitar memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of RL_STORE) {
    if (now > v.resetAt) RL_STORE.delete(k);
  }
}, 60_000);

// ── Rutas públicas del chatbot (límite más permisivo) ─────────────────────────
const CHAT_PATHS  = ['/api/chat'];
const LEAD_PATHS  = ['/api/analytics', '/api/recruitment'];
const ADMIN_PATHS = ['/api/reports', '/api/export-pdf', '/api/ai-analysis',
                     '/api/search-console', '/api/vacantes-ia', '/api/admin',
                     '/api/conversations'];

// ── Tamaño máximo de payload por tipo ────────────────────────────────────────
const MAX_PAYLOAD_CHAT  = 50  * 1024;        // 50 KB
const MAX_PAYLOAD_CV    = 6   * 1024 * 1024; // 6 MB  (CV upload)
const MAX_PAYLOAD_PDF   = 10  * 1024 * 1024; // 10 MB (HTML completo → Puppeteer)
const MAX_PAYLOAD_API   = 100 * 1024;        // 100 KB resto de APIs

export const onRequest = defineMiddleware(async (context, next) => {
  const url  = new URL(context.request.url);
  const path = url.pathname;
  const req  = context.request;

  // Bloquear service worker de desarrollo
  if (path === '/dev-sw.js') return new Response(null, { status: 404 });

  // ── Gate de mantenimiento: si el sitio esta "bajado", los visitantes ven la
  // pantalla de mantenimiento. Se excluyen /stats (panel), /api (admin reactiva)
  // y assets, para poder reactivar y no romper estilos de la propia pantalla.
  const exentoMant = path.startsWith('/api/') || path.startsWith('/stats')
    || path === '/mantenimiento' || path.startsWith('/_astro/')
    || path.startsWith('/fonts/') || path.startsWith('/images/') || path.startsWith('/styles/')
    || /\.(css|js|mjs|png|jpg|jpeg|webp|svg|gif|ico|woff2?|mp4|webm|json|txt|xml)$/i.test(path);
  if (!exentoMant) {
    const mant = await getMaint();
    const slug = slugDeRuta(path);
    // Mantenimiento si: todo el sitio, o esta pagina especifica esta marcada.
    if (mant.all || (slug && mant.slugs.includes(slug))) {
      return new Response(null, { status: 307, headers: { Location: '/mantenimiento', 'Retry-After': '120' } });
    }
  }

  // ── Rate limiting por tipo de ruta ─────────────────────────────────────────
  const isChat  = CHAT_PATHS.some(p => path.startsWith(p));
  const isLead  = LEAD_PATHS.some(p => path.startsWith(p));
  const isAdmin = ADMIN_PATHS.some(p => path.startsWith(p));
  const isApi   = path.startsWith('/api/');

  // En local no hay headers de Vercel → ip='unknown' → todos comparten clave → 429 inmediato.
  // El rate limiter solo aplica en producción.
  const isDev = import.meta.env.DEV || url.hostname === 'localhost' || url.hostname === '127.0.0.1';

  if (!isDev && (isChat || isLead || isAdmin || isApi)) {
    const rawIp = req.headers.get('x-vercel-forwarded-for')
                || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
                || req.headers.get('x-real-ip')
                || null;
    const IP_RE = /^[\d.:a-fA-F]+$/;
    const ip = rawIp && IP_RE.test(rawIp) ? rawIp : 'unknown';

    const bucket = isChat ? ['chat', 20] : isLead ? ['lead', 15] : isAdmin ? ['admin', 60] : ['api', 30];
    if (isRateLimited(`${bucket[0]}:${ip}`, bucket[1] as number, 60_000)) {
      logAbuse(bucket[0] as string, ip, url.pathname);
      return new Response(JSON.stringify({ ok: false, error: 'Demasiadas solicitudes. Intenta en un momento.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
      });
    }
  }

  // ── Límite de tamaño de payload ────────────────────────────────────────────
  if (req.method === 'POST' || req.method === 'PUT') {
    const contentLength = parseInt(req.headers.get('content-length') || '0', 10);
    const contentType   = req.headers.get('content-type') || '';
    const isMultipart   = contentType.includes('multipart/form-data');
    const isChat        = CHAT_PATHS.some(p => path.startsWith(p));
    const isPdfExport   = path === '/api/export-pdf' || path === '/api/reports/send-now';
    const maxSize       = isMultipart ? MAX_PAYLOAD_CV
                        : isPdfExport ? MAX_PAYLOAD_PDF
                        : isChat      ? MAX_PAYLOAD_CHAT
                        : MAX_PAYLOAD_API;

    if (contentLength > maxSize) {
      return new Response(JSON.stringify({ ok: false, error: 'Payload demasiado grande.' }), {
        status: 413,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return next();
});
