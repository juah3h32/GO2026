// src/pages/api/recruitment.js
import { notifyNewVacante } from '../../lib/notify';
import {
  saveRecruitmentLead,
  readRecruitmentLeads,
  updateRecruitmentStatus,
  deleteRecruitmentLead,
  resetRecruitmentLeads,
  addRecruiterNote,
  getRecruiterNotes,
  deleteRecruiterNote,
  readVacantes,
} from '../../lib/analytics-db.js';

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

    // ── Subida de CV (multipart/form-data) ────────────────────────────────
    if (contentType.includes('multipart/form-data')) {
      const formData  = await request.formData();
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

      const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
      if (file.size > MAX_SIZE) {
        return json({ ok: false, error: 'El archivo excede el límite de 5 MB.' }, 400);
      }

      const arrayBuffer = await file.arrayBuffer();
      const base64      = Buffer.from(arrayBuffer).toString('base64');
      const fileName    = file.name || 'cv_candidato';

      console.log(`📄 CV recibido: ${fileName} (${(file.size / 1024).toFixed(1)} KB) session=${sessionId}`);

      return json({
        ok: true,
        cv: {
          nombre: fileName,
          tipo:   file.type,
          base64,
          tamaño: file.size,
        },
      });
    }

    // ── Acciones JSON ─────────────────────────────────────────────────────
    const body       = await request.json();
    const { action } = body;

    // ── save: guardar candidato completo ──────────────────────────────────
    if (action === 'save') {
      const {
        nombre      = '',
        email       = '',
        telefono    = '',
        puesto      = '',
        edad        = '',
        estado      = '',
        colonia     = '',
        cvNombre    = '',
        cvBase64    = '',
        cvTipo      = '',
        mensaje     = '',
        comentarios = '',
        sessionId   = '',
      } = body;

      if (!nombre && !email && !telefono) {
        return json({ ok: false, error: 'Datos insuficientes para guardar candidato.' }, 400);
      }

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
      });

      // ── Duplicado detectado: no re-registrar ni notificar ─────────────────
      if (saved?.duplicate) {
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
        await notifyNewVacante({
          nombre, puesto, edad, estado, colonia,
          whatsapp: telefono, email, cvNombre, mensaje: comentarios || mensaje,
        });
        console.log('✅ Notificación RH enviada');
      } catch (err) {
        console.error('⚠️ Notificación RH falló:', err.message);
      }

      return json({ ok: true, id: candidatoId });
    }

    // ── list: listar candidatos ───────────────────────────────────────────
    if (action === 'list') {
      const candidates = await readRecruitmentLeads();
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
      const ok = await updateRecruitmentStatus(id, nuevoEstado);
      if (!ok) return json({ ok: false, error: 'Candidato no encontrado.' }, 404);
      return json({ ok: true });
    }

    // ── delete ────────────────────────────────────────────────────────────
    if (action === 'delete') {
      if (!body.id) return json({ ok: false, error: 'ID requerido.' }, 400);
      await deleteRecruitmentLead(body.id);
      return json({ ok: true });
    }

    // ── reset ─────────────────────────────────────────────────────────────
    if (action === 'reset') {
      await resetRecruitmentLeads();
      return json({ ok: true });
    }

    // ── addNote ───────────────────────────────────────────────────────────
    if (action === 'addNote') {
      const { candidateId, nota } = body;
      if (!candidateId) return json({ ok: false, error: 'candidateId requerido' }, 400);
      if (!nota?.trim()) return json({ ok: false, error: 'Nota vacía' }, 400);
      const result = await addRecruiterNote({ candidateId, nota });
      return json({ ok: true, id: result.id });
    }

    // ── getNotes ──────────────────────────────────────────────────────────
    if (action === 'getNotes') {
      const { candidateId } = body;
      if (!candidateId) return json({ ok: false, error: 'candidateId requerido' }, 400);
      const notes = await getRecruiterNotes(candidateId);
      return json({ ok: true, notes });
    }

    // ── deleteNote ────────────────────────────────────────────────────────
    if (action === 'deleteNote') {
      const { noteId } = body;
      if (!noteId) return json({ ok: false, error: 'noteId requerido' }, 400);
      await deleteRecruiterNote(noteId);
      return json({ ok: true });
    }

    // ── list-vacantes ─────────────────────────────────────────────────────
    if (action === 'list-vacantes') {
      const vacantes = await readVacantes(true); // solo activas
      return json({ ok: true, vacantes });
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
export async function GET() {
  try {
    const candidates = await readRecruitmentLeads();
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
  nuevo:      '🆕 Nuevo',
  visto:      '👀 Visto',
  contactado: '📞 Contactado',
  descartado: '❌ Descartado',
  contratado: '✅ Contratado',
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