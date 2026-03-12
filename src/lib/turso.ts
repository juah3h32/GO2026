import { createClient } from '@libsql/client';

export function getTurso() {
  const url   = import.meta.env.TURSO_DATABASE_URL;  // ← TURSO_DATABASE_URL no TURSO_URL
  const token = import.meta.env.TURSO_AUTH_TOKEN;

  if (!url)   throw new Error('TURSO_DATABASE_URL no definida en .env');
  if (!token) throw new Error('TURSO_AUTH_TOKEN no definida en .env');

  return createClient({ url, authToken: token });
}