// src/pages/api/analytics.js
import { logInteraction, readAllData, resetData, saveLead, readLeads, resetLeads, saveRecruitmentLead, updateLeadStatus } from '../../lib/analytics-db';
import { notifyNewDistribuidor } from '../../lib/notify.ts';
import { notifyNewVacante } from '../../lib/notify.js';
import { verifyAdminToken } from '../../lib/verifyAdminToken.ts';

export const prerender = false;

// ── Helper: filtrar datos por rango de fechas ─────────────────────────────────
function filterByDateRange(data, from, to) {
  if (!from && !to) return data;

  const fromTs = from ? new Date(from).setHours(0, 0, 0, 0)   : null;
  const toTs   = to   ? new Date(to).setHours(23, 59, 59, 999) : null;

  const filterInteractions = (arr = []) =>
    arr.filter(item => {
      const ts = new Date(item.ts || item.timestamp || item.date || 0).getTime();
      if (fromTs && ts < fromTs) return false;
      if (toTs   && ts > toTs)   return false;
      return true;
    });

  const filterDaily = (daily = {}) => {
    const result = {};
    Object.entries(daily).forEach(([dateKey, val]) => {
      const ts = new Date(dateKey).getTime();
      if (fromTs && ts < fromTs) return;
      if (toTs   && ts > toTs)   return;
      result[dateKey] = val;
    });
    return result;
  };

  const filteredDaily = filterDaily(data.daily || {});
  const days = Object.values(filteredDaily);

  const totalMessages = days.reduce((s, d) => s + (d.messages || 0), 0);
  const totalSessions = days.reduce((s, d) => s + (d.sessions || 0), 0);
  const totalWhatsApp = days.reduce((s, d) => s + (d.wa       || 0), 0);
  const totalPDFs     = days.reduce((s, d) => s + (d.pdf      || 0), 0);

  const rawFiltered = filterInteractions(
    data.interactions || data.raw || data.lastMessages || []
  );

  const intents  = {};
  const products = {};
  rawFiltered.forEach(item => {
    if (item.intent)  intents[item.intent]   = (intents[item.intent]   || 0) + 1;
    if (item.product) products[item.product] = (products[item.product] || 0) + 1;
    if (!item.product && item.accionPDF) {
      products[item.accionPDF] = (products[item.accionPDF] || 0) + 1;
    }
  });

  return {
    ...data,
    daily:         filteredDaily,
    totalMessages,
    totalSessions,
    totalWhatsApp,
    totalPDFs,
    intents:       Object.keys(intents).length  ? intents  : data.intents,
    products:      Object.keys(products).length ? products : data.products,
    _filteredFrom: from || null,
    _filteredTo:   to   || null,
  };
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST({ request }) {
  try {
    const body            = await request.json();
    const { action = '' } = body;

    const ADMIN_ACTIONS = ['get', 'reset', 'getLeads', 'resetLeads'];
    if (ADMIN_ACTIONS.includes(action)) {
      const adminRole = await verifyAdminToken(request);
      if (!adminRole) return json({ ok: false, error: 'No autorizado' }, 401);
    }

    // ── GET analytics con filtro opcional ────────────────────────────────────
    if (action === 'get') {
      const raw  = await readAllData();
      const from = body.from || null;
      const to   = body.to   || null;
      const data = (from || to) ? filterByDateRange(raw, from, to) : raw;
      return json({ ok: true, data });
    }

    // ── RESET analytics ───────────────────────────────────────────────────────
    if (action === 'reset') {
      await resetData();
      return json({ ok: true });
    }

    // ── LOG interacción del bot ───────────────────────────────────────────────
    if (action === 'log') {
      const {
        userMessage  = '',
        botReply     = '',
        accionWA     = false,
        accionPDF    = null,
        isNewSession = false,
        language     = 'es',
        historyLength,
      } = body;

      const resolvedIsNewSession =
        isNewSession || (historyLength !== undefined ? historyLength <= 1 : false);

      await logInteraction({
        userMessage,
        botReply,
        accionWA,
        accionPDF,
        isNewSession: resolvedIsNewSession,
        language,
      });

      return json({ ok: true });
    }

    // ── GUARDAR lead de distribuidor ──────────────────────────────────────────
    if (action === 'lead') {
      const { nombre, empresa, whatsapp, email, productos, comentarios = '' } = body;

      if (!nombre || !whatsapp) {
        return json({ ok: false, error: 'nombre y whatsapp son requeridos' }, 400);
      }
      if (String(nombre).length > 120)   return json({ ok: false, error: 'Nombre muy largo' }, 400);
      if (String(whatsapp).length > 25)  return json({ ok: false, error: 'Teléfono inválido' }, 400);
      if (!/^[\d\s\+\-\(\)]{7,}$/.test(String(whatsapp))) return json({ ok: false, error: 'Formato de teléfono inválido' }, 400);
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) return json({ ok: false, error: 'Email inválido' }, 400);
      if (empresa    && String(empresa).length > 120)    return json({ ok: false, error: 'Empresa muy larga' }, 400);
      if (comentarios && String(comentarios).length > 500) return json({ ok: false, error: 'Comentario muy largo' }, 400);

      await saveLead({ nombre, empresa, whatsapp, email, productos, comentarios });

      console.log('📲 Enviando notificación distribuidor para:', nombre);
      await notifyNewDistribuidor({ nombre, empresa, whatsapp, productos });
      console.log('✅ Notificación distribuidor enviada');

      return json({ ok: true });
    }

    // ── GUARDAR lead de vacante ───────────────────────────────────────────────
    if (action === 'leadVacante') {
      const { nombre, puesto, whatsapp, email, mensaje } = body;

      if (!nombre || !whatsapp) {
        return json({ ok: false, error: 'nombre y whatsapp son requeridos' }, 400);
      }
      if (String(nombre).length > 120)  return json({ ok: false, error: 'Nombre muy largo' }, 400);
      if (String(whatsapp).length > 25) return json({ ok: false, error: 'Teléfono inválido' }, 400);
      if (!/^[\d\s\+\-\(\)]{7,}$/.test(String(whatsapp))) return json({ ok: false, error: 'Formato de teléfono inválido' }, 400);
      if (email   && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) return json({ ok: false, error: 'Email inválido' }, 400);
      if (puesto  && String(puesto).length > 100)   return json({ ok: false, error: 'Puesto muy largo' }, 400);
      if (mensaje && String(mensaje).length > 1000) return json({ ok: false, error: 'Mensaje muy largo' }, 400);

      // ← Guardado en recruitment_leads en Turso (no en distribuidor_leads)
      await saveRecruitmentLead({
        nombre,
        puesto:    puesto   || '',
        telefono:  whatsapp,
        email:     email    || '',
        mensaje:   mensaje  || '',
        sessionId: '',
      });

      console.log('📲 Enviando notificación vacante para:', nombre);
      await notifyNewVacante({ nombre, puesto, whatsapp, email, mensaje });
      console.log('✅ Notificación vacante enviada');

      return json({ ok: true });
    }

    // ── LEER leads de distribuidores ──────────────────────────────────────────
    if (action === 'getLeads') {
      const leads = await readLeads();
      return json({ ok: true, leads });
    }

    // ── RESET leads de distribuidores ─────────────────────────────────────────
    if (action === 'resetLeads') {
      await resetLeads();
      return json({ ok: true });
    }

    // ── ACTUALIZAR estatus de un lead ─────────────────────────────────────────
    if (action === 'updateLeadStatus') {
      const adminRole = await verifyAdminToken(request);
      if (!adminRole) return json({ ok: false, error: 'No autorizado' }, 401);
      const { id, status } = body;
      if (!id || !status) return json({ ok: false, error: 'Faltan datos' }, 400);
      await updateLeadStatus(id, status);
      return json({ ok: true });
    }

    // ── Acción desconocida ────────────────────────────────────────────────────
    return json({ ok: false, error: `Acción desconocida: "${action}"` }, 400);

  } catch (err) {
    console.error('❌ analytics POST:', err.message);
    return json({ ok: false, error: err.message }, 500);
  }
}

// ── GET (acceso directo por URL) ──────────────────────────────────────────────
export async function GET({ request, url }) {
  try {
    const adminRole = await verifyAdminToken(request);
    if (!adminRole) return json({ ok: false, error: 'No autorizado' }, 401);

    const params = new URL(url).searchParams;
    const from   = params.get('from') || null;
    const to     = params.get('to')   || null;
    const raw    = await readAllData();
    const data   = (from || to) ? filterByDateRange(raw, from, to) : raw;
    return json({ ok: true, data });
  } catch (err) {
    console.error('❌ analytics GET:', err.message);
    return json({ ok: false, error: err.message }, 500);
  }
}

// ── Helper respuesta JSON ─────────────────────────────────────────────────────
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}