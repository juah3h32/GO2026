// src/lib/verifyPartnerKey.js
// Autenticacion para departamentos externos que consumen la API de vacantes/candidatos.
// Header requerido: x-api-key. Se resuelve a un rh_user_id fijo — igual patron que
// verifyAdminToken.ts resuelve myId del JWT, pero aqui nunca hay rol "admin":
// cada key esta amarrada a un solo rh_user_id y jamas puede ver datos de otro.
import { verifyApiKey } from './analytics-db.js';

export async function verifyPartnerAuth(request) {
  const rawKey = request.headers.get('x-api-key');
  if (!rawKey) return null;
  return await verifyApiKey(rawKey.trim());
}
