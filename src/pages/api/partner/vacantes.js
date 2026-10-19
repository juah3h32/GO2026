// src/pages/api/partner/vacantes.js
// API externa para que un departamento/empresa aliada administre SUS vacantes
// desde su propio sistema. Autenticacion por header x-api-key (ver
// src/lib/verifyPartnerKey.js). El rh_user_id siempre se resuelve server-side
// desde la key — nunca se acepta del body (mismo patron que api/vacantes.js).
import { saveVacante, readVacantes, updateVacante, deleteVacante, toggleVacante, getVacanteOwner, asignarEsperaAVacante, markNotificadosVacante } from '../../../lib/analytics-db.js';
import { verifyPartnerAuth } from '../../../lib/verifyPartnerKey.js';
import { notifyEsperaVacante } from '../../../lib/notify.js';
import { sendPushToAll } from '../../../lib/push.js';

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
    const vacantes = await readVacantes(false, { isAdmin: false, rhUserId: partner.rh_user_id });
    return json({ ok: true, vacantes });
  } catch (err) {
    console.error('[partner/vacantes GET]', err);
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

    async function checkOwn(id) {
      const owner = await getVacanteOwner(id);
      return owner !== undefined && Number(owner) === Number(rh_user_id);
    }

    if (action === 'create') {
      const { titulo, area, tipo, ubicacion, horario, salario, descripcion, requisitos, activa, orden, multiples, empresa, link_externo } = body;
      if (!titulo?.trim()) return json({ ok: false, error: 'El titulo es obligatorio.' }, 400);
      const result = await saveVacante({ titulo, area, tipo, ubicacion, horario, salario, descripcion, requisitos, activa, orden, multiples, empresa, rh_user_id, link_externo });

      if (activa) {
        sendPushToAll({
          title: `Nueva vacante: ${titulo}`,
          body:  `Grupo Ortiz tiene una nueva oportunidad en ${area || 'Morelia'}. ¡Aplica ahora!`,
          url:   '/es/vacantes',
        }).catch(e => console.error('[push partner create]', e));
        asignarEsperaAVacante(titulo).then(async (candidatos) => {
          if (!candidatos.length) return;
          const vacante = { titulo, area, empresa };
          const results = await notifyEsperaVacante({ candidatos, vacante, urlVacantes: 'https://grupo-ortiz.com/es/vacantes' });
          const enviados = results.filter(r => r.ok).map(r => r.id);
          if (enviados.length) await markNotificadosVacante(enviados);
        }).catch(e => console.error('[asignar espera partner create]', e));
      }

      return json({ ok: true, id: result.id });
    }

    if (action === 'update') {
      const { id, titulo, area, tipo, ubicacion, horario, salario, descripcion, requisitos, activa, orden, multiples, empresa, link_externo } = body;
      if (!id) return json({ ok: false, error: 'ID requerido.' }, 400);
      if (!(await checkOwn(id))) return json({ ok: false, error: 'No autorizado.' }, 403);
      await updateVacante({ id, titulo, area, tipo, ubicacion, horario, salario, descripcion, requisitos, activa, orden, multiples, empresa, link_externo });
      return json({ ok: true });
    }

    if (action === 'delete') {
      if (!(await checkOwn(body.id))) return json({ ok: false, error: 'No autorizado.' }, 403);
      await deleteVacante(body.id);
      return json({ ok: true });
    }

    if (action === 'toggle') {
      const { id, activa } = body;
      if (!(await checkOwn(id))) return json({ ok: false, error: 'No autorizado.' }, 403);
      await toggleVacante(id, activa);
      return json({ ok: true });
    }

    return json({ ok: false, error: 'Accion desconocida.' }, 400);
  } catch (err) {
    console.error('❌ [api/partner/vacantes] Error:', err);
    return json({ ok: false, error: err.message }, 500);
  }
}
