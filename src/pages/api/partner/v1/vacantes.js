// src/pages/api/partner/v1/vacantes.js
// Espejo GO Radar §9 — espejo de /api/v1/vacantes de Radar, para que Radar
// jale y empuje vacantes hacia este sitio con su llave maestra. Ve y escribe
// TODAS las vacantes del sitio, sin importar qué rh_user_id las creó.
import { verifyRadarAuth } from '../../../../lib/verifyRadarKey.js';
import { readVacantes, getVacanteById, getVacanteByRadarId, saveVacante, updateVacante } from '../../../../lib/analytics-db.js';

export const prerender = false;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

const norm = (s) => (s || '').trim().toLowerCase();

// Carga inicial / anti-duplicado (guía §8.7): si no viene `id` ni matchea por
// `radar_id`, buscar una vacante local sin radar_id con el MISMO título antes
// de crear una nueva — evita duplicar algo que nació en el sitio.
async function findUnlinkedVacanteByTitulo(titulo) {
  if (!titulo?.trim()) return null;
  const todas = await readVacantes(false, { isAdmin: true });
  const candidatas = todas.filter(v => !v.radar_id && norm(v.titulo) === norm(titulo));
  return candidatas.length === 1 ? candidatas[0].id : null;
}

export function serializeVacante(v) {
  return {
    id: v.id, radar_id: v.radar_id || null,
    titulo: v.titulo, unidad: v.area, ubicacion: v.ubicacion, descripcion: v.descripcion,
    estado: v.activa ? 'abierta' : 'cerrada',
  };
}

export async function GET({ request, url }) {
  const radar = await verifyRadarAuth(request);
  if (!radar) return json({ detail: { codigo: 'llave_invalida', mensaje: 'API key inválida o faltante.' } }, 401);

  const id = url.searchParams.get('id');
  if (id) {
    const v = await getVacanteById(Number(id));
    if (!v) return json({ detail: { codigo: 'no_encontrada', mensaje: 'No existe esa vacante.' } }, 404);
    return json(serializeVacante(v));
  }
  const vacantes = await readVacantes(false, { isAdmin: true });
  return json({ items: vacantes.map(serializeVacante) });
}

// Crea o actualiza por `external_id` (el id de la vacante EN RADAR) — repetir
// el mismo envío actualiza, no duplica (mismo contrato que Radar usa con
// nosotros, ver guía §6.2). `id` opcional (el id de ESTE sitio) para ligar
// una vacante que el sitio ya tenía, sin crear una nueva.
export async function POST({ request }) {
  const radar = await verifyRadarAuth(request);
  if (!radar) return json({ detail: { codigo: 'llave_invalida', mensaje: 'API key inválida o faltante.' } }, 401);

  const body = await request.json().catch(() => ({}));
  const { external_id, id, titulo, unidad, ubicacion, descripcion, estado } = body;
  if (!titulo?.trim()) return json({ detail: { codigo: 'falta_titulo', mensaje: 'titulo es obligatorio.' } }, 422);
  if (!external_id && !id) return json({ detail: { codigo: 'falta_identidad', mensaje: 'Falta external_id o id.' } }, 422);
  // Cualquier valor que no sea exactamente "cerrada" dejaba la vacante
  // ABIERTA y pública por default (bug que Damián probó con "borrador") —
  // ahora se rechaza cualquier estado que no sea uno de los dos válidos.
  if (estado !== undefined && estado !== 'abierta' && estado !== 'cerrada') {
    return json({ detail: { codigo: 'estado_invalido', mensaje: 'estado debe ser "abierta" o "cerrada".' } }, 422);
  }

  const fields = { titulo, area: unidad || '', ubicacion: ubicacion || 'Morelia, Mich.', descripcion: descripcion || '', activa: estado !== 'cerrada' };

  let localId = id ? Number(id) : (external_id ? await getVacanteByRadarId(String(external_id)) : null);
  if (!localId) localId = await findUnlinkedVacanteByTitulo(titulo);

  if (localId) {
    const actual = await getVacanteById(localId);
    if (!actual) return json({ detail: { codigo: 'no_encontrada', mensaje: 'No existe esa vacante.' } }, 404);
    await updateVacante({
      id: localId, ...fields,
      tipo: actual.tipo, horario: actual.horario, salario: actual.salario, requisitos: actual.requisitos,
      orden: actual.orden, multiples: actual.multiples, empresa: actual.empresa, link_externo: actual.link_externo,
      radar_id: external_id ? String(external_id) : actual.radar_id, origin: 'radar',
    });
    return json(serializeVacante({ ...actual, ...fields, radar_id: external_id ? String(external_id) : actual.radar_id }), 200);
  }

  const created = await saveVacante({ ...fields, radar_id: external_id ? String(external_id) : '', origin: 'radar' });
  const v = await getVacanteById(created.id);
  return json(serializeVacante(v), 201);
}
