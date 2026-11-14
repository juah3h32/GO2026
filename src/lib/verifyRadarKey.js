// src/lib/verifyRadarKey.js
// Autenticacion para GO Radar llamando a ESTE sitio (espejo §9 de la guia).
// Header requerido: x-api-key. A diferencia de verifyPartnerKey.js (una llave
// por departamento aliado, atada a un rh_user_id fijo), esta llave es la
// MAESTRA de Radar — ve y escribe TODO, sin excepcion.
import { verifyRadarKey as verifyRadarKeyHash } from './analytics-db.js';

export async function verifyRadarAuth(request) {
  const rawKey = request.headers.get('x-api-key');
  if (!rawKey) return null;
  return await verifyRadarKeyHash(rawKey.trim());
}
