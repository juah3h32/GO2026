// src/pages/api/analytics.js
import { logInteraction, readAllData, resetData, saveLead, readLeads, resetLeads, saveSubscriber, readSubscribers, saveRecruitmentLead, updateLeadStatus, trackCatalogDownload, getClosingSignals, logWAClick, getProductCountsFiltered, getConfig, setConfig } from '../../lib/analytics-db';
import { notifyNewDistribuidor, notifyNewSubscriberEmail } from '../../lib/notify.ts';
import { notifyNewVacante } from '../../lib/notify.js';

const SUBSCRIBER_NOTIF_KEY = 'notify_email_subscribers';
async function maybeNotifySubscriberEmail(sub) {
  try {
    const on = await getConfig(SUBSCRIBER_NOTIF_KEY);
    if (on === '1') await notifyNewSubscriberEmail(sub);
  } catch (e) { console.error('maybeNotifySubscriberEmail:', e?.message || e); }
}
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
    if (item.intent) intents[item.intent] = (intents[item.intent] || 0) + 1;
    const prod = item.product || item.prod || null;
    if (prod) products[prod] = (products[prod] || 0) + 1;
    if (!prod && item.accionPDF) {
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

    const ADMIN_ACTIONS = ['get', 'reset', 'getLeads', 'resetLeads', 'getSubscribers', 'getSubscriberNotifSetting', 'setSubscriberNotifSetting'];
    if (ADMIN_ACTIONS.includes(action)) {
      const adminRole = await verifyAdminToken(request);
      if (!adminRole) return json({ ok: false, error: 'No autorizado' }, 401);
    }

    // ── GET analytics con filtro opcional ────────────────────────────────────
    if (action === 'get') {
      const raw  = await readAllData();
      const from = body.from || null;
      const to   = body.to   || null;
      if (from || to) {
        const filtered = filterByDateRange(raw, from, to);
        // Products: full-scan de la tabla messages por rango (no limitado a 100)
        const filteredProducts = await getProductCountsFiltered({ from, to });
        filtered.products = Object.keys(filteredProducts).length ? filteredProducts : raw.products;
        return json({ ok: true, data: filtered });
      }
      return json({ ok: true, data: raw });
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
      const { nombre, empresa, whatsapp, email, productos, comentarios = '', subscribe, lang = '' } = body;

      if (!nombre || (!whatsapp && !email)) {
        return json({ ok: false, error: 'nombre y al menos un dato de contacto (WhatsApp o correo) son requeridos' }, 400);
      }
      if (String(nombre).length > 120)   return json({ ok: false, error: 'Nombre muy largo' }, 400);
      if (whatsapp) {
        if (String(whatsapp).length > 25)  return json({ ok: false, error: 'Teléfono inválido' }, 400);
        if (!/^[\d\s\+\-\(\)]{7,}$/.test(String(whatsapp))) return json({ ok: false, error: 'Formato de teléfono inválido' }, 400);
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) return json({ ok: false, error: 'Email inválido' }, 400);
      if (empresa    && String(empresa).length > 120)    return json({ ok: false, error: 'Empresa muy larga' }, 400);
      if (comentarios && String(comentarios).length > 500) return json({ ok: false, error: 'Comentario muy largo' }, 400);

      // 1) Guardar SIEMPRE primero (es lo que confirma el "registro exitoso").
      await saveLead({ nombre, empresa, whatsapp, email, productos, comentarios });

      // 1b) Opt-in de novedades — fusiona este lead con la lista de suscriptores
      //     (misma tabla que usa el bot) para poder mandarles correo despues.
      if (subscribe && email) {
        await saveSubscriber({ nombre, email, lang, source: 'distribuidor' })
          .catch((e) => console.error('saveSubscriber (distribuidor):', e?.message || e));
        maybeNotifySubscriberEmail({ nombre, email, source: 'distribuidor' });
      }

      // 2) Notificar con TOPE de 4s: el registro ya quedo guardado, no debemos
      //    colgar al usuario en "Enviando" esperando ntfy/WhatsApp (sin timeout
      //    podian tardar mucho). Si tarda mas, responde igual y la notif sigue.
      console.log('📲 Notificando distribuidor:', nombre);
      const notifP = notifyNewDistribuidor({ nombre, empresa, whatsapp, productos })
        .catch((e) => console.error('notif distribuidor:', e?.message || e));
      await Promise.race([notifP, new Promise((r) => setTimeout(r, 4000))]);

      return json({ ok: true });
    }

    // ── GUARDAR suscriptor del bot (novedades / contenido exclusivo por correo) ─
    if (action === 'subscribe') {
      const { nombre, email, lang = '' } = body;

      if (!nombre || !email) {
        return json({ ok: false, error: 'nombre y email son requeridos' }, 400);
      }
      if (String(nombre).length > 120) return json({ ok: false, error: 'Nombre muy largo' }, 400);
      if (String(email).length > 160)  return json({ ok: false, error: 'Email muy largo' }, 400);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) return json({ ok: false, error: 'Email inválido' }, 400);

      await saveSubscriber({ nombre, email, lang, source: 'botgo' });
      maybeNotifySubscriberEmail({ nombre, email, source: 'botgo' });
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

    // ── LEER suscriptores (bot + opt-in distribuidor) ─────────────────────────
    if (action === 'getSubscribers') {
      const subscribers = await readSubscribers();
      return json({ ok: true, subscribers });
    }

    // ── Toggle: notificarme por correo cuando llega un suscriptor nuevo ───────
    if (action === 'getSubscriberNotifSetting') {
      const value = await getConfig(SUBSCRIBER_NOTIF_KEY).catch(() => null);
      return json({ ok: true, enabled: value === '1' });
    }
    if (action === 'setSubscriberNotifSetting') {
      await setConfig(SUBSCRIBER_NOTIF_KEY, body.enabled ? '1' : '0');
      return json({ ok: true });
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

    // ── REENVIAR notificación de un lead ─────────────────────────────────────
    if (action === 'resendLeadNotif') {
      const adminRole = await verifyAdminToken(request);
      if (!adminRole) return json({ ok: false, error: 'No autorizado' }, 401);
      const { id } = body;
      if (!id) return json({ ok: false, error: 'Falta id' }, 400);
      const leads = await readLeads();
      const lead = leads.find(l => String(l.id) === String(id));
      if (!lead) return json({ ok: false, error: 'Lead no encontrado' }, 404);
      await notifyNewDistribuidor({
        nombre:   lead.nombre   || '',
        empresa:  lead.empresa  || '',
        whatsapp: lead.whatsapp || '',
        productos: lead.productos || '',
      });
      return json({ ok: true });
    }

    // ── TRACKING descarga de catálogo PDF (público, fire-and-forget) ──────────
    if (action === 'catalogDownload') {
      const { slug = '', lang = 'es', type = 'individual' } = body;
      try { await trackCatalogDownload(slug, lang, type); } catch {}
      return json({ ok: true });
    }

    // ── WA click — señal de cierre directa, sin auth (evento del chatbot) ────
    if (action === 'waClick') {
      const { product = null, lang = 'es', sessionId = '' } = body;
      await logWAClick(product, lang, sessionId);
      return json({ ok: true });
    }

    // ── GET closing signals ───────────────────────────────────────────────────
    if (action === 'getClosingSignals') {
      const adminRole = await verifyAdminToken(request);
      if (!adminRole) return json({ ok: false, error: 'No autorizado' }, 401);
      const { limit = 100 } = body;
      const signals = await getClosingSignals({ limit });
      return json({ ok: true, signals });
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
    if (from || to) {
      const filtered = filterByDateRange(raw, from, to);
      const filteredProducts = await getProductCountsFiltered({ from, to });
      filtered.products = Object.keys(filteredProducts).length ? filteredProducts : raw.products;
      return json({ ok: true, data: filtered });
    }
    return json({ ok: true, data: raw });
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