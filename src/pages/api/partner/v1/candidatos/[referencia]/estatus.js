// src/pages/api/partner/v1/candidatos/[referencia]/estatus.js
// Espejo GO Radar §9 — espejo de PUT /api/v1/postulantes/por-folio/{folio}/etapa.
// `referencia` en la URL es el folio (GO-.../LE-...).
import { verifyRadarAuth } from '../../../../../../lib/verifyRadarKey.js';
import { radarEtapaToSiteStatus } from '../../../../../../lib/go-radar-v1.js';
import { getLeadByRadarFolio, getLeadById, updateRecruitmentStatus } from '../../../../../../lib/analytics-db.js';

export const prerender = false;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

export async function PUT({ request, params }) {
  const radar = await verifyRadarAuth(request);
  if (!radar) return json({ detail: { codigo: 'llave_invalida', mensaje: 'API key inválida o faltante.' } }, 401);

  const folio = params.referencia;
  const localId = await getLeadByRadarFolio(folio);
  if (!localId) return json({ detail: { codigo: 'no_encontrado', mensaje: 'No existe un candidato con ese folio.' } }, 404);

  const body = await request.json().catch(() => ({}));
  const { etapa, etapa_actual, actualizado_por } = body;
  if (!etapa) return json({ detail: { codigo: 'datos_invalidos', mensaje: 'etapa es obligatoria.' } }, 422);

  const lead = await getLeadById(localId);

  // Igual regla que Radar nos aplica a nosotros: si lo que el llamador cree
  // que es la etapa actual ya no coincide, 409 y no se pisa nada (ver guía §6.6).
  if (etapa_actual !== undefined && (lead.radar_etapa || '') !== (etapa_actual || '')) {
    return json({
      detail: { codigo: 'etapa_cambio', mensaje: 'La etapa ya había cambiado.', etapa_actual: lead.radar_etapa || '' },
    }, 409);
  }

  const nuevoStatus = radarEtapaToSiteStatus(etapa, lead.status);
  await updateRecruitmentStatus(localId, nuevoStatus, {
    origin: 'radar', radarEtapa: etapa, radarActualizadoPor: actualizado_por || '',
  });

  return json({ cambio: true, etapa_anterior: lead.radar_etapa || '', etapa, actualizado_por: actualizado_por || '' });
}
