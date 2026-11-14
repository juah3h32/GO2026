// src/pages/api/partner/v1/yo.js
// Espejo GO Radar §9 — "qué es mi llave", espejo de GET /api/v1/yo de Radar.
// La llave maestra de Radar no tiene permisos granulares de este lado (ver
// Espejo_Radar_GO_Oficial_Guia_Completa_13_11_26.md §9, decisión #1 del
// dueño: la maestra manda sobre todo) — por eso "permisos" siempre es fijo.
import { verifyRadarAuth } from '../../../../lib/verifyRadarKey.js';

export const prerender = false;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

export async function GET({ request }) {
  const radar = await verifyRadarAuth(request);
  if (!radar) return json({ detail: { codigo: 'llave_invalida', mensaje: 'API key inválida o faltante.' } }, 401);
  return json({
    llave: radar.label || 'GO Radar — llave maestra',
    sistema: 'grupo-ortiz.com',
    permisos: ['maestra'],
    origen_de_lo_que_crea: 'api:radar',
    limite_por_minuto: 60,
  });
}
