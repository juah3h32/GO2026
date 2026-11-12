// src/pages/api/recruitment.js
import { notifyNewVacante, notifyCandidateEspera, notifyCandidateRadarSeguimiento } from '../../lib/notify.js';
import { verifyAdminToken } from '../../lib/verifyAdminToken.ts';
import {
  saveRecruitmentLead,
  readRecruitmentLeads,
  updateRecruitmentStatus,
  updateRecruitmentLead,
  deleteRecruitmentLead,
  resetRecruitmentLeads,
  addRecruiterNote,
  getRecruiterNotes,
  deleteRecruiterNote,
  readVacantes,
  markNotificadosVacante,
  saveSubscriber,
  getLeadOwner,
  getNoteCandidateOwner,
  getCandidateCV,
  getConfig,
  setConfig,
  saveRadarReferencia,
} from '../../lib/analytics-db.js';
import { esVacanteGoRadar, enviarPostulacionAGoRadar } from '../../lib/go-radar.js';

// Busca, entre las vacantes activas, la que corresponde al "puesto" escrito/elegido
// por el candidato — para heredar su dueño (rh_user_id) al guardar el lead.
// Prioriza el match EXACTO y, si no hay, el título más largo/específico que
// contenga al puesto — un simple .find() con "includes" en cualquier orden
// podía agarrar una vacante corta ("Operador") en vez de la correcta y más
// específica ("Operador de Producción"), asignando el candidato al RH
// equivocado (o a nadie) según el orden en que vinieran las vacantes.
function matchVacante(puesto, vacantesActivas) {
  if (!puesto || !vacantesActivas?.length) return null;
  const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const pLow = norm(puesto);
  if (!pLow) return null;

  const exacto = vacantesActivas.find(v => norm(v.titulo) === pLow);
  if (exacto) return exacto;

  let mejor = null, mejorLen = -1;
  for (const v of vacantesActivas) {
    const vLow = norm(v.titulo);
    if (!vLow) continue;
    if (vLow.includes(pLow) || pLow.includes(vLow)) {
      if (vLow.length > mejorLen) { mejor = v; mejorLen = vLow.length; }
    }
  }
  return mejor;
}

// Auto-suscribe al candidato a novedades/promociones con los datos que ya dio
// en la conversación — evita pedirle de nuevo su correo con la subscribe-card.
function autoSuscribirCandidato(nombre, email) {
  if (!email) return;
  saveSubscriber({ nombre, email, source: 'reclutamiento' })
    .catch(e => console.warn('⚠️ auto-suscripción de candidato falló:', e.message));
}

export const prerender = false;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ════════════════════════════════════════════════════════════════
//  POST — maneja subida de CV (multipart) y acciones JSON
// ════════════════════════════════════════════════════════════════
export async function POST({ request }) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // ── Multipart: CV upload suelto  O  save completo con CV ─────────────
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const action   = formData.get('action') || '';

      // ── save completo con CV adjunto (viene de handleConfirmarRegistro) ──
      if (action === 'save') {
        const file         = formData.get('cv');
        const nombre       = formData.get('nombre')       || '';
        const email        = formData.get('email')        || '';
        const telefono     = formData.get('telefono')     || '';
        const puesto       = formData.get('puesto')       || '';
        const edad         = formData.get('edad')         || '';
        const estado       = formData.get('estado')       || '';
        const colonia      = formData.get('colonia')      || '';
        const comentarios  = formData.get('comentarios')  || '';
        const sessionId    = formData.get('sessionId')    || '';
        const esListaEspera = formData.get('esListaEspera') === '1';
        const cvNombreForm = formData.get('cvNombre')     || '';

        let cvBase64 = '', cvNombre = cvNombreForm, cvTipo = '', cvBuffer = null;
        if (file && typeof file !== 'string' && file.size > 0) {
          const MAX_SIZE = 5 * 1024 * 1024;
          if (file.size <= MAX_SIZE) {
            cvBuffer = Buffer.from(await file.arrayBuffer());
            cvBase64 = cvBuffer.toString('base64');
            cvNombre = file.name || cvNombreForm;
            cvTipo   = file.type || '';
          }
        }

        if (!nombre && !email && !telefono) {
          return json({ ok: false, error: 'Datos insuficientes.' }, 400);
        }

        let en_lista_espera = esListaEspera ? 1 : 0;
        let rh_user_id = null;
        let vacanteMatch = null;
        try {
          const vacantesActivas = (await readVacantes(true)) || [];
          if (!esListaEspera) {
            if (!vacantesActivas.length) {
              en_lista_espera = 1;
            } else if (puesto) {
              const pLow = puesto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
              const hay  = vacantesActivas.some(v =>
                (v.titulo||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').includes(pLow) ||
                pLow.includes((v.titulo||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''))
              );
              if (!hay) en_lista_espera = 1;
            }
          }
          vacanteMatch = matchVacante(puesto, vacantesActivas);
          rh_user_id = vacanteMatch?.rh_user_id ?? null;
        } catch {}

        const saved = await saveRecruitmentLead({
          nombre, email, telefono, puesto, edad,
          estado_rep: estado, colonia,
          cvNombre, cvBase64, cvTipo,
          mensaje: '', comentarios, sessionId,
          en_lista_espera, rh_user_id,
        });
        autoSuscribirCandidato(nombre, email);

        // Duplicado que YA tiene folio Radar → ya se procesó por completo antes.
        if (saved?.duplicate && saved.existingRadarReferencia) {
          return json({ ok: true, id: saved.id, duplicate: true, esListaEspera: !!en_lista_espera });
        }

        const candidatoId = saved?.id || null;

        try {
          if (en_lista_espera) {
            // 1. Mensaje al CANDIDATO confirmando envío a RH
            notifyCandidateEspera({ nombre, puesto, telefono }).catch(e => console.warn('notify candidato:', e.message));
            // 2. Avisar a RH por categoría
            const { notifyCategoriaRH } = await import('../../lib/notify.js');
            const rhResult = await notifyCategoriaRH({ nombre, puesto, edad, estado_rep: estado, colonia, telefono, email, cvNombre: cvNombre || '', cvBase64: cvBase64 || '', rh_user_id });
            console.log(`📢 RH notificados: ${rhResult.sent || 0} destinatarios`);
          } else {
            await notifyNewVacante({ nombre, puesto, edad, estado, colonia, telefono, email, cvNombre, cvBase64, cvTipo, sessionId, rh_user_id });
          }
        } catch (e) { console.warn('notify error:', e.message); }

        // Siempre se reenvía a Radar (v5): con vacante_id si matchea una
        // publicada por Radar, o sin él — ahí Radar la guarda en SU lista de
        // espera en vez de rechazarla.
        const radarVacanteId = (vacanteMatch && esVacanteGoRadar(vacanteMatch)) ? vacanteMatch.id : undefined;
        const radar = await enviarPostulacionAGoRadar({
          vacanteId: radarVacanteId, nombre, edad, estado, colonia, telefono, correo: email, puesto,
          cvBuffer, cvNombre, cvTipo,
          solicitudId: `go2026-${candidatoId}-${vacanteMatch?.id || 'sv'}`,
        });
        if (radar?.ok && radar.referencia) {
          saveRadarReferencia(candidatoId, radar.referencia).catch(e => console.warn('saveRadarReferencia:', e.message));
          notifyCandidateRadarSeguimiento({ nombre, puesto, telefono, radar }).catch(e => console.warn('notify candidato radar:', e.message));
        }

        return json({ ok: true, id: candidatoId, esListaEspera: !!en_lista_espera, radar });
      }

      // ── upload de CV suelto (previsualización antes de confirmar) ─────────
      const file      = formData.get('cv');
      const sessionId = formData.get('sessionId') || '';

      if (!file || typeof file === 'string') {
        return json({ ok: false, error: 'No se recibió archivo' }, 400);
      }

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
      ];
      if (!allowedTypes.includes(file.type)) {
        return json({ ok: false, error: 'Tipo de archivo no permitido. Usa PDF, DOC, DOCX, JPG o PNG.' }, 400);
      }

      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        return json({ ok: false, error: 'El archivo excede el límite de 5 MB.' }, 400);
      }

      const arrayBuffer = await file.arrayBuffer();
      const base64      = Buffer.from(arrayBuffer).toString('base64');
      const fileName    = file.name || 'cv_candidato';

      console.log(`📄 CV recibido: ${fileName} (${(file.size / 1024).toFixed(1)} KB) session=${sessionId}`);

      return json({ ok: true, cv: { nombre: fileName, tipo: file.type, base64, tamaño: file.size } });
    }

    // ── Acciones JSON ─────────────────────────────────────────────────────
    const body       = await request.json();
    const { action } = body;

    const ADMIN_ACTIONS = ['list', 'listPending', 'updateStatus', 'updateLead', 'delete', 'reset', 'addNote', 'getNotes', 'deleteNote', 'notificar-espera', 'resend', 'getCv', 'getGoal', 'setGoal'];
    let isAdmin = false, myId = null;
    if (ADMIN_ACTIONS.includes(action)) {
      const adminRole = await verifyAdminToken(request);
      if (!adminRole) return json({ ok: false, error: 'No autorizado' }, 401);
      isAdmin = !!adminRole.isAdminRole;
      // scopedRhUserId: cuenta "delegada" — ve/borra los candidatos de OTRO
      // RH (ej. Cindy o Mony) en vez de los propios. Si no está asignado, se
      // comporta igual que siempre (filtra por su propio id).
      myId    = adminRole.scopedRhUserId ?? adminRole.id ?? null;
    }

    // Cada RH ve/edita solo sus candidatos; Admin los ve/edita todos.
    async function checkOwnLead(id) {
      if (isAdmin) return true;
      const owner = await getLeadOwner(id);
      return owner !== undefined && myId != null && Number(owner) === Number(myId);
    }

    // ── save: guardar candidato completo ──────────────────────────────────
    if (action === 'save') {
      const {
        nombre         = '',
        email          = '',
        telefono       = '',
        puesto         = '',
        edad           = '',
        estado         = '',
        colonia        = '',
        cvNombre       = '',
        cvBase64       = '',
        cvTipo         = '',
        mensaje        = '',
        comentarios    = '',
        sessionId      = '',
        esListaEspera  = false,
      } = body;

      if (!nombre && !email && !telefono) {
        return json({ ok: false, error: 'Datos insuficientes para guardar candidato.' }, 400);
      }

      // Determinar lista de espera: puede venir del frontend o se detecta aquí
      let en_lista_espera = esListaEspera ? 1 : 0;
      let rh_user_id = null;
      let vacanteMatch = null;
      try {
        const vacantesActivas = (await readVacantes(true)) || [];
        if (!esListaEspera) {
          if (!vacantesActivas.length) {
            en_lista_espera = 1;
          } else if (puesto) {
            // Comparación simple: si ninguna vacante activa contiene palabras del puesto → lista espera
            const puestoLower = puesto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const hayMatch = vacantesActivas.some(v =>
              (v.titulo || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(puestoLower) ||
              puestoLower.includes((v.titulo || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
            );
            if (!hayMatch) en_lista_espera = 1;
          }
        }
        vacanteMatch = matchVacante(puesto, vacantesActivas);
        rh_user_id = vacanteMatch?.rh_user_id ?? null;
      } catch { /* si falla la consulta, no forzamos lista espera */ }

      const saved = await saveRecruitmentLead({
        nombre, email, telefono, puesto,
        edad,
        estado_rep: estado,
        colonia,
        cvNombre,
        cvBase64,
        cvTipo,
        mensaje,
        comentarios,
        sessionId,
        rh_user_id,
        en_lista_espera,
      });
      autoSuscribirCandidato(nombre, email);

      // ── Duplicado detectado ────────────────────────────────────────────────
      // Si ya se le había mandado folio de Radar antes, no repetir el envío.
      // Si NO (ej. el chat ya había auto-guardado este mismo candidato antes
      // de llegar aquí a confirmar — ver chat.js), seguir el flujo normal:
      // de lo contrario esta confirmación nunca notificaba a RH ni mandaba a
      // Radar, porque aquí SIEMPRE se cortaba en seco por "duplicado" aunque
      // Radar nunca hubiera recibido nada todavía.
      if (saved?.duplicate && saved.existingRadarReferencia) {
        console.log(`🔁 Solicitud duplicada ignorada — candidato existente #${saved.id}: ${saved.existingNombre}`);
        return json({
          ok:        true,
          duplicate: true,
          id:        saved.id,
          message:   'Ya existe un registro con este correo o teléfono. Tu solicitud fue recibida anteriormente.',
        });
      }

      const candidatoId = saved?.id || null;
      console.log(`✅ Candidato #${candidatoId} guardado: ${nombre} → ${puesto} | CV: ${cvNombre || 'sin CV'}`);

      try {
        if (en_lista_espera) {
          notifyCandidateEspera({ nombre, puesto, telefono }).catch(e => console.warn('notify candidato:', e.message));
        }
        await notifyNewVacante({
          nombre, puesto, edad, estado, colonia,
          whatsapp: telefono, email, cvNombre, mensaje: comentarios || mensaje,
          en_lista_espera, rh_user_id,
        });
        console.log('✅ Notificación RH enviada');
      } catch (err) {
        console.error('⚠️ Notificación RH falló:', err.message);
      }

      // Siempre se reenvía a Radar (v5): con vacante_id si matchea una
      // publicada por Radar, o sin él — ahí Radar la guarda en SU lista de
      // espera en vez de rechazarla.
      const cvBuffer = cvBase64 ? Buffer.from(cvBase64, 'base64') : null;
      const radarVacanteId = (vacanteMatch && esVacanteGoRadar(vacanteMatch)) ? vacanteMatch.id : undefined;
      const radar = await enviarPostulacionAGoRadar({
        vacanteId: radarVacanteId, nombre, edad, estado, colonia, telefono, correo: email, puesto,
        cvBuffer, cvNombre, cvTipo,
        solicitudId: `go2026-${candidatoId}-${vacanteMatch?.id || 'sv'}`,
      });
      if (radar?.ok && radar.referencia) {
        saveRadarReferencia(candidatoId, radar.referencia).catch(e => console.warn('saveRadarReferencia:', e.message));
        notifyCandidateRadarSeguimiento({ nombre, puesto, telefono, radar }).catch(e => console.warn('notify candidato radar:', e.message));
      }

      return json({ ok: true, id: candidatoId, en_lista_espera, radar });
    }

    // ── list: listar candidatos ───────────────────────────────────────────
    // filterUserId: solo Admin puede pedir el corte de UN RH especifico (para reportes comparativos)
    if (action === 'list') {
      const { filterUserId } = body;
      const candidates = (isAdmin && filterUserId != null)
        ? await readRecruitmentLeads({ isAdmin: false, rhUserId: Number(filterUserId), includeCv: false })
        : await readRecruitmentLeads({ isAdmin, rhUserId: myId, includeCv: false });
      const formatted  = candidates.map(c => ({
        ...c,
        statusLabel: STATUS_LABELS[c.status] || c.status || 'Nuevo',
        tsFormatted: formatFecha(c.created_at || c.ts),
      }));
      return json({ ok: true, candidates: formatted });
    }

    // ── updateStatus ──────────────────────────────────────────────────────
    if (action === 'updateStatus') {
      const { id, status: nuevoEstado } = body;
      if (!VALID_STATUSES.includes(nuevoEstado)) {
        return json({ ok: false, error: `Estado inválido. Usa: ${VALID_STATUSES.join(', ')}` }, 400);
      }
      if (!(await checkOwnLead(id))) return json({ ok: false, error: 'No autorizado.' }, 403);
      const ok = await updateRecruitmentStatus(id, nuevoEstado);
      if (!ok) return json({ ok: false, error: 'Candidato no encontrado.' }, 404);
      return json({ ok: true });
    }

    // ── updateLead — corrección de campos por el candidato ───────────────
    if (action === 'updateLead') {
      const { id, campo, valor } = body;
      if (!id) return json({ ok: false, error: 'ID requerido.' }, 400);
      const CAMPO_MAP = {
        nombre: 'nombre', puesto: 'puesto', edad: 'edad',
        estado: 'estado_rep', colonia: 'colonia',
        email: 'email', telefono: 'telefono',
      };
      const dbCampo = CAMPO_MAP[campo];
      if (!dbCampo) return json({ ok: false, error: 'Campo no permitido.' }, 400);
      if (!(await checkOwnLead(id))) return json({ ok: false, error: 'No autorizado.' }, 403);
      await updateRecruitmentLead(id, { [dbCampo]: valor });
      return json({ ok: true });
    }

    // ── delete ────────────────────────────────────────────────────────────
    if (action === 'delete') {
      if (!body.id) return json({ ok: false, error: 'ID requerido.' }, 400);
      if (!(await checkOwnLead(body.id))) return json({ ok: false, error: 'No autorizado.' }, 403);
      await deleteRecruitmentLead(body.id);
      return json({ ok: true });
    }

    // ── reset ─────────────────────────────────────────────────────────────
    if (action === 'reset') {
      if (!isAdmin) return json({ ok: false, error: 'Solo Admin puede borrar todo.' }, 403);
      await resetRecruitmentLeads();
      return json({ ok: true });
    }

    // ── addNote ───────────────────────────────────────────────────────────
    if (action === 'addNote') {
      const { candidateId, nota } = body;
      if (!candidateId) return json({ ok: false, error: 'candidateId requerido' }, 400);
      if (!nota?.trim()) return json({ ok: false, error: 'Nota vacía' }, 400);
      if (!(await checkOwnLead(candidateId))) return json({ ok: false, error: 'No autorizado.' }, 403);
      const result = await addRecruiterNote({ candidateId, nota });
      return json({ ok: true, id: result.id });
    }

    // ── getNotes ──────────────────────────────────────────────────────────
    if (action === 'getNotes') {
      const { candidateId } = body;
      if (!candidateId) return json({ ok: false, error: 'candidateId requerido' }, 400);
      if (!(await checkOwnLead(candidateId))) return json({ ok: false, error: 'No autorizado.' }, 403);
      const notes = await getRecruiterNotes(candidateId);
      return json({ ok: true, notes });
    }

    // ── deleteNote ────────────────────────────────────────────────────────
    if (action === 'deleteNote') {
      const { noteId } = body;
      if (!noteId) return json({ ok: false, error: 'noteId requerido' }, 400);
      if (!isAdmin) {
        const info = await getNoteCandidateOwner(noteId);
        const owned = info !== undefined && myId != null && Number(info.owner) === Number(myId);
        if (!owned) return json({ ok: false, error: 'No autorizado.' }, 403);
      }
      await deleteRecruiterNote(noteId);
      return json({ ok: true });
    }

    // ── list-vacantes ─────────────────────────────────────────────────────
    if (action === 'list-vacantes') {
      const vacantes = await readVacantes(true); // solo activas
      return json({ ok: true, vacantes });
    }

    // ── getGoal: meta mensual de reclutamiento (tab Inicio) ────────────────
    if (action === 'getGoal') {
      const value = await getConfig('recruitment_monthly_goal');
      return json({ ok: true, goal: value ? Number(value) : 0 });
    }

    // ── setGoal: solo Admin ajusta la meta mensual ─────────────────────────
    if (action === 'setGoal') {
      if (!isAdmin) return json({ ok: false, error: 'No autorizado.' }, 403);
      const { goal } = body;
      const n = Number(goal);
      if (!Number.isFinite(n) || n < 0) return json({ ok: false, error: 'Meta invalida.' }, 400);
      await setConfig('recruitment_monthly_goal', String(n));
      return json({ ok: true, goal: n });
    }

    // ── getCv: CV completo de un candidato, bajo demanda (no viaja en la lista) ──
    if (action === 'getCv') {
      const { id } = body;
      if (!id) return json({ ok: false, error: 'ID requerido.' }, 400);
      if (!(await checkOwnLead(id))) return json({ ok: false, error: 'No autorizado.' }, 403);
      const cv = await getCandidateCV(id);
      if (!cv || !cv.cv_base64) return json({ ok: false, error: 'CV no disponible.' }, 404);
      return json({ ok: true, ...cv });
    }

    // ── resend: reenviar notificación + CV si tiene ──
    if (action === 'resend') {
      const { id } = body;
      if (!id) return json({ ok: false, error: 'ID de candidato requerido' }, 400);
      if (!(await checkOwnLead(id))) return json({ ok: false, error: 'No autorizado.' }, 403);

      const candidates = await readRecruitmentLeads();
      const candidate = candidates.find(c => c.id === Number(id));
      if (!candidate) return json({ ok: false, error: 'Candidato no encontrado' }, 404);

      const { notifyCategoriaRH } = await import('../../lib/notify.js');

      // Texto + CV (si tiene) — al RH dueño del candidato (o bolsa general si no tiene dueño)
      const tieneCV = !!(candidate.cv_base64 && candidate.cv_nombre);
      const resultRH = await notifyCategoriaRH({
        nombre: candidate.nombre,
        puesto: candidate.puesto,
        edad: candidate.edad,
        estado_rep: candidate.estado_rep,
        colonia: candidate.colonia,
        telefono: candidate.telefono,
        email: candidate.email,
        cvNombre: candidate.cv_nombre,
        cvBase64: candidate.cv_base64,
        cvTipo: candidate.cv_tipo,
        mensaje: candidate.mensaje || candidate.comentarios,
        rh_user_id: candidate.rh_user_id,
      });

      return json({
        ok: true,
        sent: resultRH.sent || 0,
        tieneCV,
        nota: tieneCV
          ? `Notificación + CV enviados a ${resultRH.sent || 0} destinatario(s)`
          : `Notificación enviada a ${resultRH.sent || 0} destinatario(s) · sin CV`,
      });
    }

    return json({ ok: false, error: 'Acción desconocida.' }, 400);

  } catch (err) {
    console.error('❌ recruitment endpoint error:', err.message);
    return json({ ok: false, error: err.message }, 500);
  }
}

// ════════════════════════════════════════════════════════════════
//  GET
// ════════════════════════════════════════════════════════════════
export async function GET({ request }) {
  try {
    const adminRole = await verifyAdminToken(request);
    if (!adminRole) return json({ ok: false, error: 'No autorizado' }, 401);
    const candidates = await readRecruitmentLeads({ isAdmin: !!adminRole.isAdminRole, rhUserId: adminRole.scopedRhUserId ?? adminRole.id ?? null });
    const formatted  = candidates.map(c => ({
      ...c,
      statusLabel: STATUS_LABELS[c.status] || c.status || 'Nuevo',
      tsFormatted: formatFecha(c.created_at || c.ts),
    }));
    return json({ ok: true, candidates: formatted });
  } catch (err) {
    console.error('❌ recruitment GET error:', err.message);
    return json({ ok: false, error: err.message }, 500);
  }
}

// ════════════════════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════════════════════
const VALID_STATUSES = ['nuevo', 'visto', 'contactado', 'descartado', 'contratado'];

const STATUS_LABELS = {
  nuevo:      'Nuevo',
  visto:      'Visto',
  contactado: 'Contactado',
  descartado: 'Descartado',
  contratado: 'Contratado',
};

function formatFecha(ts) {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleString('es-MX', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return ts; }
}