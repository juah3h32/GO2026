// src/pages/api/partner/candidatos.js
// API externa para que el departamento aliado suba candidatos/postulaciones
// ligados a SUS vacantes. rh_user_id siempre viene de la API key, nunca del body.
import { saveRecruitmentLead, readRecruitmentLeads, getVacanteOwner, readVacantes } from '../../../lib/analytics-db.js';
import { verifyPartnerAuth } from '../../../lib/verifyPartnerKey.js';

export const prerender = false;

const ALLOWED_ORIGIN = process.env.PARTNER_CORS_ORIGIN || import.meta.env.PARTNER_CORS_ORIGIN || '*';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET({ request }) {
  const partner = await verifyPartnerAuth(request);
  if (!partner) return json({ ok: false, error: 'API key invalida o faltante.' }, 401);
  try {
    const candidatos = await readRecruitmentLeads({ isAdmin: false, rhUserId: partner.rh_user_id });
    return json({ ok: true, candidatos });
  } catch (err) {
    console.error('[partner/candidatos GET]', err);
    return json({ ok: false, error: `DB error: ${err?.message || err}` }, 500);
  }
}

export async function POST({ request }) {
  try {
    const partner = await verifyPartnerAuth(request);
    if (!partner) return json({ ok: false, error: 'API key invalida o faltante.' }, 401);
    const rh_user_id = partner.rh_user_id;

    const body = await request.json();
    const { action } = body;

    if (action !== 'create') return json({ ok: false, error: 'Accion desconocida.' }, 400);

    const { nombre, email, telefono, vacanteId, puesto: puestoManual, edad, colonia, mensaje, cvNombre, cvBase64, cvTipo } = body;
    if (!nombre?.trim()) return json({ ok: false, error: 'nombre es obligatorio.' }, 400);
    if (!telefono?.trim() && !email?.trim()) return json({ ok: false, error: 'telefono o email es obligatorio.' }, 400);

    let puesto = puestoManual || '';
    if (vacanteId) {
      const owner = await getVacanteOwner(vacanteId);
      if (owner === undefined || Number(owner) !== Number(rh_user_id)) {
        return json({ ok: false, error: 'vacanteId no pertenece a esta cuenta.' }, 403);
      }
      const vacantes = await readVacantes(false, { isAdmin: false, rhUserId: rh_user_id });
      const v = vacantes.find(x => x.id === Number(vacanteId));
      puesto = v?.titulo || puesto;
    }
    if (!puesto.trim()) return json({ ok: false, error: 'vacanteId o puesto es obligatorio.' }, 400);

    const result = await saveRecruitmentLead({
      nombre: nombre.trim(), email: email || '', telefono: telefono || '', puesto,
      edad: edad || '', colonia: colonia || '', mensaje: mensaje || '',
      cvNombre: cvNombre || '', cvBase64: cvBase64 || '', cvTipo: cvTipo || '',
      rh_user_id,
    });

    return json({ ok: true, id: result.id, duplicate: !!result.duplicate });
  } catch (err) {
    console.error('❌ [api/partner/candidatos] Error:', err);
    return json({ ok: false, error: err.message }, 500);
  }
}
