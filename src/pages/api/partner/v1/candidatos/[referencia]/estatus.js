// src/pages/api/partner/v1/candidatos/[referencia]/estatus.js
// Espejo GO Radar §9 — espejo de PUT /api/v1/postulantes/por-folio/{folio}/etapa.
// `referencia` en la URL es el folio (GO-.../LE-...) O, si es puro numérico,
// el id local del candidato — para los que Radar jaló de nosotros y todavía
// no tienen folio (pendiente A1 de Damian, 17/11/26).
import { verifyRadarAuth } from '../../../../../../lib/verifyRadarKey.js';
import { radarEtapaToSiteStatus } from '../../../../../../lib/go-radar-v1.js';
import { getLeadByRadarFolio, getLeadById, updateRecruitmentStatus } from '../../../../../../lib/analytics-db.js';

export const prerender = false;

const ETAPAS_VALIDAS = ['nuevo', 'en_revision', 'entrevista', 'descartado', 'contratado', 'descartado_ia'];

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

export async function PUT({ request, params }) {
  const radar = await verifyRadarAuth(request);
  if (!radar) return json({ detail: { codigo: 'llave_invalida', mensaje: 'API key inválida o faltante.' } }, 401);

  const referencia = params.referencia;
  const esNumerico = /^\d+$/.test(referencia || '');
  const localId = esNumerico ? Number(referencia) : await getLeadByRadarFolio(referencia);
  const lead = localId ? await getLeadById(localId) : null;
  if (!lead) return json({ detail: { codigo: 'no_encontrado', mensaje: 'No existe un candidato con ese folio o id.' } }, 404);

  const body = await request.json().catch(() => ({}));
  const { etapa, etapa_actual, actualizado_por } = body;
  if (!etapa) return json({ detail: { codigo: 'datos_invalidos', mensaje: 'etapa es obligatoria.' } }, 422);
  if (!ETAPAS_VALIDAS.includes(etapa)) {
    return json({ detail: { codigo: 'etapa_invalida', mensaje: `etapa debe ser una de: ${ETAPAS_VALIDAS.join(', ')}.` } }, 422);
  }

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
