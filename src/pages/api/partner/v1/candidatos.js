// src/pages/api/partner/v1/candidatos.js
// Espejo GO Radar §9 — espejo de /api/v1/postulantes de Radar. Ve y escribe
// TODOS los candidatos del sitio. El `folio` (GO-... / LE-...) es la llave de
// cruce — Radar es quien siempre lo asigna, así que un POST de Radar siempre
// lo trae.
import { verifyRadarAuth } from '../../../../lib/verifyRadarKey.js';
import { SITE_STATUS_TO_RADAR_ETAPA } from '../../../../lib/go-radar-v1.js';
import {
  readRecruitmentLeads, getLeadById, getLeadByRadarFolio,
  saveRecruitmentLead, updateRecruitmentLead, saveRadarReferencia,
} from '../../../../lib/analytics-db.js';

export const prerender = false;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

export function serializeCandidato(c) {
  const status = c.status ?? c.estado ?? 'nuevo';
  return {
    id: c.id, folio: c.radar_referencia || null,
    nombre: c.nombre, correo: c.email || '', telefono: c.telefono || '', puesto: c.puesto || '',
    edad: c.edad || '', estado: SITE_STATUS_TO_RADAR_ETAPA[status] || 'nuevo',
    actualizado_por: c.radar_actualizado_por || '',
  };
}

export async function GET({ request, url }) {
  const radar = await verifyRadarAuth(request);
  if (!radar) return json({ detail: { codigo: 'llave_invalida', mensaje: 'API key inválida o faltante.' } }, 401);

  const referencia = url.searchParams.get('referencia');
  const leads = await readRecruitmentLeads({ isAdmin: true, includeCv: false });
  if (referencia) {
    const folios = referencia.split(',').map(f => f.trim().toUpperCase()).filter(Boolean);
    const items = leads.filter(c => folios.includes(String(c.radar_referencia || '').toUpperCase()));
    return json({ items: items.map(serializeCandidato) });
  }
  return json({ items: leads.map(serializeCandidato) });
}

// Crea o actualiza por `folio` — repetir el mismo envío actualiza, no
// duplica. Solo pisa los campos que de verdad vienen en el body (un PATCH
// parcial no debe borrar lo que el sitio ya tenía).
export async function POST({ request }) {
  const radar = await verifyRadarAuth(request);
  if (!radar) return json({ detail: { codigo: 'llave_invalida', mensaje: 'API key inválida o faltante.' } }, 401);

  const body = await request.json().catch(() => ({}));
  const { folio, nombre, correo, telefono, puesto, edad } = body;
  if (!folio) return json({ detail: { codigo: 'falta_identidad', mensaje: 'folio es obligatorio.' } }, 422);

  let localId = await getLeadByRadarFolio(folio);
  let status = 200;

  if (localId) {
    const patch = {};
    if (nombre !== undefined)   patch.nombre   = nombre;
    if (correo !== undefined)   patch.email    = correo;
    if (telefono !== undefined) patch.telefono = telefono;
    if (puesto !== undefined)   patch.puesto   = puesto;
    if (edad !== undefined)     patch.edad     = String(edad);
    if (Object.keys(patch).length) await updateRecruitmentLead(localId, patch, 'radar');
  } else {
    if (!nombre?.trim()) return json({ detail: { codigo: 'falta_nombre', mensaje: 'nombre es obligatorio para un folio nuevo.' } }, 422);
    const saved = await saveRecruitmentLead({
      nombre, email: correo || '', telefono: telefono || '', puesto: puesto || '', edad: edad ? String(edad) : '',
      origin: 'radar',
    });
    localId = saved.id;
    await saveRadarReferencia(localId, folio);
    status = 201;
  }

  const lead = await getLeadById(localId);
  return json(serializeCandidato(lead), status);
}
