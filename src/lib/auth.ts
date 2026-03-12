

import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyAdminToken(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match  = cookie.match(/admin_token=([^;]+)/);
  if (!match) return null;

  try {
    const { payload } = await jwtVerify(match[1], SECRET);
    return payload.role as {
      name: string;
      color: string;
      tabs: string[];
      canDownload: boolean;
    };
  } catch {
    return null;
  }
}