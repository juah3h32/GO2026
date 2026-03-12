// src/pages/api/recruitment.js
import { notifyNewVacante } from '../../lib/notify';
import {
  saveRecruitmentLead,
  readRecruitmentLeads,
  updateRecruitmentStatus,
  deleteRecruitmentLead,
  resetRecruitmentLeads,
} from '../../lib/analytics-db.js';

export const prerender = false;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { action } = body;

    // ── Guardar candidato ────────────────────────────────────────────────────
    if (action === 'save') {
      const { nombre='', email='', telefono='', puesto='', mensaje='', sessionId='' } = body;
      if (!nombre && !email && !telefono) {
        return json({ ok: false, error: 'Datos insuficientes' }, 400);
      }
      await saveRecruitmentLead({ nombre, email, telefono, puesto, mensaje, sessionId });
      console.log(`✅ Candidato guardado en Turso: ${nombre} → ${puesto}`);
      try {
        await notifyNewVacante({ nombre, puesto, whatsapp: telefono, email, mensaje });
        console.log('✅ Notificación RH enviada');
      } catch (err) {
        console.error('⚠️ Notificación RH falló:', err.message);
      }
      return json({ ok: true });
    }

    // ── Listar candidatos ────────────────────────────────────────────────────
    if (action === 'list') {
      const candidates = await readRecruitmentLeads();
      // Formatear ts para que RecruitmentTab.jsx lo muestre correctamente
      const formatted = candidates.map(c => ({
        ...c,
        tsFormatted: c.ts ? new Date(c.ts).toLocaleString('es-MX', {
          day: '2-digit', month: 'long', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        }) : '—',
      }));
      return json({ ok: true, candidates: formatted });
    }

    // ── Actualizar estado ────────────────────────────────────────────────────
    if (action === 'updateStatus') {
      const { id, estado } = body;
      const ok = await updateRecruitmentStatus(id, estado);
      if (!ok) return json({ ok: false, error: 'Estado inválido o candidato no encontrado' }, 400);
      return json({ ok: true });
    }

    // ── Eliminar candidato ───────────────────────────────────────────────────
    if (action === 'delete') {
      await deleteRecruitmentLead(body.id);
      return json({ ok: true });
    }

    // ── Reset total ──────────────────────────────────────────────────────────
    if (action === 'reset') {
      await resetRecruitmentLeads();
      return json({ ok: true });
    }

    return json({ ok: false, error: 'Acción desconocida' }, 400);

  } catch (err) {
    console.error('❌ recruitment endpoint:', err.message);
    return json({ ok: false, error: err.message }, 500);
  }
}

export async function GET() {
  try {
    const candidates = await readRecruitmentLeads();
    return json({ ok: true, candidates });
  } catch (err) {
    return json({ ok: false, error: err.message }, 500);
  }
}