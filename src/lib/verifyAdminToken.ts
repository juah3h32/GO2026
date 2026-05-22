import { jwtVerify } from 'jose';

/**
 * Verifica el token JWT de admin desde la cookie 'admin_token'.
 *
 * ⚠️ IMPORTANTE: El token debe ser enviado con flags:
 * - HttpOnly: previene acceso desde JavaScript (XSS protection)
 * - Secure: solo envía por HTTPS
 * - SameSite=Strict: previene CSRF
 *
 * Ejemplo de set-cookie correcto:
 * Set-Cookie: admin_token=<jwt>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400
 */
export async function verifyAdminToken(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match  = cookie.match(/admin_token=([^;]+)/);
  if (!match) return null;

  // Evaluar el secret en cada llamada para garantizar que import.meta.env ya está disponible
  const rawSecret = import.meta.env.JWT_SECRET || process.env.JWT_SECRET || '';
  if (!rawSecret) {
    console.error('[verifyAdminToken] JWT_SECRET no configurado');
    return null;
  }
  const SECRET = new TextEncoder().encode(rawSecret);

  try {
    const { payload } = await jwtVerify(match[1], SECRET);

    // Valida que el payload tenga los campos requeridos
    if (!payload.role) {
      console.warn('[verifyAdminToken] Token inválido: falta campo "role"');
      return null;
    }

    return payload.role as {
      name:        string;
      color:       string;
      tabs:        string[];
      canDownload: boolean;
      canDelete:   boolean;
      isAdminRole?: boolean;
    };
  } catch (err) {
    console.warn('[verifyAdminToken] Verificación fallida:', err instanceof Error ? err.message : 'Error desconocido');
    return null;
  }
}
