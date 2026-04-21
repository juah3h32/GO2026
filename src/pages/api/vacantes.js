// src/pages/api/vacantes.js
import { saveVacante, readVacantes, updateVacante, deleteVacante, toggleVacante, getConfig, setConfig, getListaEspera, markNotificadosVacante, asignarEsperaAVacante } from '../../lib/analytics-db.js';
import { verifyAdminToken } from '../../lib/verifyAdminToken.ts';
import { notifyEsperaVacante } from '../../lib/notify.js';
import { sendPushToAll } from '../../lib/push.js';

const DEFAULT_BENEFICIOS = [
  'Prestaciones de ley','Transporte de personal','Tarjeta de vales de despensa',
  'Despensa física','Bono de producción','Uniformes','Apoyo escolar','Oportunidades de crecimiento',
];

export const prerender = false;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

export async function GET() {
  try {
    const [vacantes, raw] = await Promise.all([readVacantes(true), getConfig('beneficios')]);
    let beneficios = DEFAULT_BENEFICIOS;
    if (raw) { try { beneficios = JSON.parse(raw); } catch {} }
    return json({ ok: true, vacantes, beneficios });
  } catch (err) {
    console.error('[vacantes GET]', err);
    return json({ ok: false, error: 'Error interno del servidor' }, 500);
  }
}

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { action } = body;

    const adminRole = await verifyAdminToken(request);
    if (!adminRole) return json({ ok: false, error: 'No autorizado' }, 401);

    if (action === 'list') {
      const vacantes = await readVacantes(false);
      return json({ ok: true, vacantes });
    }

    if (action === 'create') {
      const { titulo, area, tipo, ubicacion, horario, salario, descripcion, requisitos, activa, orden, multiples, empresa } = body;
      if (!titulo?.trim()) return json({ ok: false, error: 'El título es obligatorio.' }, 400);
      const result = await saveVacante({ titulo, area, tipo, ubicacion, horario, salario, descripcion, requisitos, activa, orden, multiples, empresa });

      // Notificación push + asignar candidatos en espera si se publica activa
      if (activa) {
        sendPushToAll({
          title: `Nueva vacante: ${titulo}`,
          body:  `Grupo Ortiz tiene una nueva oportunidad en ${area || 'Morelia'}. ¡Aplica ahora!`,
          url:   '/es/vacantes',
        }).catch(e => console.error('[push create]', e));
        asignarEsperaAVacante(titulo).then(async (candidatos) => {
          if (!candidatos.length) return;
          const vacante = { titulo, area, empresa };
          const results = await notifyEsperaVacante({ candidatos, vacante, urlVacantes: 'https://grupo-ortiz.com/es/vacantes' });
          const enviados = results.filter(r => r.ok).map(r => r.id);
          if (enviados.length) await markNotificadosVacante(enviados);
          console.log(`[espera create] Notificados por WA: ${enviados.length}/${candidatos.length}`);
        }).catch(e => console.error('[asignar espera create]', e));
      }

      return json({ ok: true, id: result.id });
    }

    if (action === 'update') {
      const { id, titulo, area, tipo, ubicacion, horario, salario, descripcion, requisitos, activa, orden, multiples, empresa } = body;
      if (!id) return json({ ok: false, error: 'ID requerido.' }, 400);
      // Leer estado anterior para saber si se está activando por primera vez
      const prevList = await readVacantes(false);
      const prev = prevList.find(v => v.id === id);
      await updateVacante({ id, titulo, area, tipo, ubicacion, horario, salario, descripcion, requisitos, activa, orden, multiples, empresa });
      // Enviar push + asignar espera solo si se está activando (antes estaba inactiva)
      if (activa && prev && !prev.activa) {
        sendPushToAll({
          title: `Nueva vacante: ${titulo}`,
          body:  `Grupo Ortiz tiene una nueva oportunidad en ${area || 'Morelia'}. ¡Aplica ahora!`,
          url:   '/es/vacantes',
        }).catch(e => console.error('[push update]', e));
        asignarEsperaAVacante(titulo).then(async (candidatos) => {
          if (!candidatos.length) return;
          const vacante = { titulo, area, empresa };
          const results = await notifyEsperaVacante({ candidatos, vacante, urlVacantes: 'https://grupo-ortiz.com/es/vacantes' });
          const enviados = results.filter(r => r.ok).map(r => r.id);
          if (enviados.length) await markNotificadosVacante(enviados);
          console.log(`[espera update] Notificados por WA: ${enviados.length}/${candidatos.length}`);
        }).catch(e => console.error('[asignar espera update]', e));
      }
      return json({ ok: true });
    }

    if (action === 'delete') {
      await deleteVacante(body.id);
      return json({ ok: true });
    }

    if (action === 'toggle') {
      const { id, activa } = body;
      await toggleVacante(id, activa);
      // Enviar push + asignar espera al activar una vacante existente
      if (activa) {
        const vacantes = await readVacantes(false);
        const v = vacantes.find(x => x.id === id);
        if (v) {
          sendPushToAll({
            title: `Nueva vacante: ${v.titulo}`,
            body:  `Grupo Ortiz tiene una nueva oportunidad en ${v.area || 'Morelia'}. ¡Aplica ahora!`,
            url:   '/es/vacantes',
          }).catch(e => console.error('[push toggle]', e));
          asignarEsperaAVacante(v.titulo).then(async (candidatos) => {
            if (!candidatos.length) return;
            const results = await notifyEsperaVacante({ candidatos, vacante: v, urlVacantes: 'https://grupo-ortiz.com/es/vacantes' });
            const enviados = results.filter(r => r.ok).map(r => r.id);
            if (enviados.length) await markNotificadosVacante(enviados);
            console.log(`[espera toggle] Notificados por WA: ${enviados.length}/${candidatos.length}`);
          }).catch(e => console.error('[asignar espera toggle]', e));
        }
      }
      return json({ ok: true });
    }

    if (action === 'update-beneficios') {
      if (!Array.isArray(body.beneficios)) return json({ ok: false, error: 'Formato inválido.' }, 400);
      await setConfig('beneficios', JSON.stringify(body.beneficios));
      return json({ ok: true });
    }

    // Obtener candidatos en lista de espera (all o filtrado por puesto)
    if (action === 'lista-espera') {
      const candidatos = await getListaEspera(body.puesto || null);
      return json({ ok: true, candidatos });
    }

    // Enviar WhatsApp a candidatos en lista de espera para una vacante específica
    if (action === 'notificar-espera') {
      const { vacanteId, ids, urlVacantes } = body;
      if (!vacanteId || !ids?.length) return json({ ok: false, error: 'vacanteId e ids requeridos.' }, 400);
      const vacantes = await readVacantes(false);
      const vacante  = vacantes.find(v => v.id === vacanteId);
      if (!vacante) return json({ ok: false, error: 'Vacante no encontrada.' }, 404);
      // Obtener todos los candidatos en lista de espera y filtrar solo por IDs
      // (el front ya hizo la coincidencia de puesto, no re-filtrar por título aquí)
      const todos = await getListaEspera();
      const candidatos = todos.filter(c => ids.includes(c.id));
      if (!candidatos.length) return json({ ok: false, error: 'Sin candidatos válidos.' }, 400);
      const results = await notifyEsperaVacante({ candidatos, vacante, urlVacantes: urlVacantes || '' });
      const enviados = results.filter(r => r.ok).map(r => r.id);
      if (enviados.length) await markNotificadosVacante(enviados);
      return json({ ok: true, enviados: enviados.length, fallidos: results.filter(r => !r.ok).length, results });
    }

    return json({ ok: false, error: 'Acción desconocida.' }, 400);
  } catch (err) {
    console.error('❌ [api/vacantes] Error:', err);
    return json({ ok: false, error: err.message }, 500);
  }
}
