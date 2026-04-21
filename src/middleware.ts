import { defineMiddleware } from 'astro:middleware';

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

  // Vercel inyecta x-vercel-forwarded-for como la IP real del cliente (no falsificable)
  // Fallback a x-forwarded-for solo si no hay header de Vercel
  const rawIp = req.headers.get('x-vercel-forwarded-for')
              || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
              || req.headers.get('x-real-ip')
              || null;
  // Validar formato IPv4/IPv6 básico para evitar inyección de claves en el Map
  const IP_RE = /^[\d.:a-fA-F]+$/;
  const ip = rawIp && IP_RE.test(rawIp) ? rawIp : 'unknown';

  // ── Rate limiting por tipo de ruta ─────────────────────────────────────────
  if (CHAT_PATHS.some(p => path.startsWith(p))) {
    // Chatbot: 20 req/min por IP
    if (isRateLimited(`chat:${ip}`, 20, 60_000)) {
      return new Response(JSON.stringify({ ok: false, error: 'Demasiadas solicitudes. Intenta en un momento.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
      });
    }
  } else if (LEAD_PATHS.some(p => path.startsWith(p))) {
    // Leads / candidatos: 15 req/min por IP
    if (isRateLimited(`lead:${ip}`, 15, 60_000)) {
      return new Response(JSON.stringify({ ok: false, error: 'Demasiadas solicitudes.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
      });
    }
  } else if (ADMIN_PATHS.some(p => path.startsWith(p))) {
    // Rutas admin: 60 req/min por IP
    if (isRateLimited(`admin:${ip}`, 60, 60_000)) {
      return new Response(JSON.stringify({ ok: false, error: 'Demasiadas solicitudes.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
      });
    }
  } else if (path.startsWith('/api/')) {
    // Resto de APIs: 30 req/min por IP
    if (isRateLimited(`api:${ip}`, 30, 60_000)) {
      return new Response(JSON.stringify({ ok: false, error: 'Demasiadas solicitudes.' }), {
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
