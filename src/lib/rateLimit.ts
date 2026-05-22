/**
 * Rate Limiting simple en memoria para endpoints.
 * Mantiene un registro de intentos por IP/clave.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

/**
 * Verifica si se ha excedido el límite de tasa.
 *
 * @param key - Identificador único (IP, usuario, email, etc.)
 * @param maxRequests - Número máximo de requests
 * @param windowMs - Ventana de tiempo en ms
 * @returns { ok: boolean, remaining: number, retryAfter: number | null }
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minuto por defecto
): { ok: boolean; remaining: number; retryAfter: number | null } {
  const now = Date.now();
  let entry = store.get(key);

  // Si no existe o expiró, crear nuevo
  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + windowMs };
    store.set(key, entry);
  }

  entry.count++;

  if (entry.count > maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { ok: false, remaining: 0, retryAfter };
  }

  return {
    ok: true,
    remaining: maxRequests - entry.count,
    retryAfter: null,
  };
}

/**
 * Extrae la IP del cliente desde headers de request.
 */
export function getClientIp(request: Request): string {
  // Vercel forwarded header
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();

  // Cloudflare
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  // Generic
  return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Limpia entradas expiradas del store (ejecutar periódicamente).
 */
export function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}

// Cleanup automático cada 5 minutos
setInterval(cleanupRateLimit, 5 * 60 * 1000);
