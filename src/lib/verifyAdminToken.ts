import { jwtVerify } from 'jose';

export async function verifyAdminToken(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match  = cookie.match(/admin_token=([^;]+)/);
  if (!match) return null;

  // Evaluar el secret en cada llamada para garantizar que import.meta.env ya está disponible
  const rawSecret = import.meta.env.JWT_SECRET || process.env.JWT_SECRET || '';
  if (!rawSecret) return null;
  const SECRET = new TextEncoder().encode(rawSecret);

  try {
    const { payload } = await jwtVerify(match[1], SECRET);
    return payload.role as {
      name:        string;
      color:       string;
      tabs:        string[];
      canDownload: boolean;
      canDelete:   boolean;
      isAdminRole?: boolean;
    };
  } catch {
    return null;
  }
}
