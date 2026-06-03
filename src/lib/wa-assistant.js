// src/lib/wa-assistant.js
// Cerebro IA del bot privado de WhatsApp — números autorizados.
// Entiende lenguaje natural, consulta los datos reales del sistema y
// genera reportes (resumen o comparativo) con PDF.
import { readAllData, readRecruitmentLeads, readVacantes, readLeads, getWAIncoming } from './analytics-db.js';

const MODEL = 'gpt-4o-mini';

// ── Helpers de fechas/periodos ────────────────────────────────────────────────
const NOMBRE_MES = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function hoyMX() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' }));
}
function ymd(d) { return d.toISOString().split('T')[0]; }

// Convierte un timestamp de Turso (UTC, "2026-06-02 21:16:00") a fecha 'YYYY-MM-DD'
// en zona horaria de México. Devuelve '' si no parsea.
function fechaMX(ts) {
  if (!ts) return '';
  try {
    const iso = String(ts).trim().replace(' ', 'T') + (String(ts).includes('Z') ? '' : 'Z');
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    // en-CA da formato YYYY-MM-DD
    return d.toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });
  } catch { return ''; }
}

// ¿La fecha del registro cae dentro del rango [desde, hasta] (inclusive)?
function enRango(ts, desde, hasta) {
  const f = fechaMX(ts);
  if (!f) return false;
  return f >= desde && f <= hasta;
}

// Filtra una lista de registros por periodo usando su campo de fecha (ts/created_at)
function filtrarPorPeriodo(lista, periodo, mes, anio) {
  if (!periodo || periodo === 'todos' || periodo === 'historico') {
    return { items: lista, rango: { label: 'Histórico completo' } };
  }
  const r = rangoPeriodo(periodo, mes, anio);
  const items = lista.filter(x => enRango(x.ts || x.created_at, r.desde, r.hasta));
  return { items, rango: r };
}

function sumarRango(daily, desde, hasta) {
  // desde/hasta: 'YYYY-MM-DD' inclusive
  let s = { sessions: 0, messages: 0, wa: 0, pdf: 0, dias: 0 };
  for (const [k, v] of Object.entries(daily || {})) {
    if (k >= desde && k <= hasta) {
      s.sessions += v.sessions || 0; s.messages += v.messages || 0;
      s.wa += v.wa || 0; s.pdf += v.pdf || 0; s.dias++;
    }
  }
  return s;
}

function rangoPeriodo(periodo, mes, anio) {
  const now = hoyMX();
  if (periodo === 'hoy') {
    const d = ymd(now); return { desde: d, hasta: d, label: `Hoy ${d}` };
  }
  if (periodo === 'ayer') {
    const a = new Date(now); a.setDate(a.getDate() - 1);
    const d = ymd(a); return { desde: d, hasta: d, label: `Ayer ${d}` };
  }
  if (periodo === 'semana') {
    const fin = ymd(now);
    const ini = new Date(now); ini.setDate(ini.getDate() - 6);
    return { desde: ymd(ini), hasta: fin, label: 'Últimos 7 días' };
  }
  if (periodo === 'mes') {
    const m = mes || (now.getMonth() + 1);
    const a = anio || now.getFullYear();
    const ult = new Date(a, m, 0).getDate();
    return {
      desde: `${a}-${String(m).padStart(2,'0')}-01`,
      hasta: `${a}-${String(m).padStart(2,'0')}-${String(ult).padStart(2,'0')}`,
      label: `${NOMBRE_MES[m]} ${a}`,
    };
  }
  // histórico
  return { desde: '2000-01-01', hasta: '2099-12-31', label: 'Histórico completo' };
}

function rangoAnterior(periodo, mes, anio) {
  const now = hoyMX();
  if (periodo === 'semana') {
    const fin = new Date(now); fin.setDate(fin.getDate() - 7);
    const ini = new Date(now); ini.setDate(ini.getDate() - 13);
    return { desde: ymd(ini), hasta: ymd(fin), label: 'Semana anterior' };
  }
  // mes anterior al pedido
  let m = (mes || (now.getMonth() + 1)) - 1;
  let a = anio || now.getFullYear();
  if (m === 0) { m = 12; a--; }
  const ult = new Date(a, m, 0).getDate();
  return {
    desde: `${a}-${String(m).padStart(2,'0')}-01`,
    hasta: `${a}-${String(m).padStart(2,'0')}-${String(ult).padStart(2,'0')}`,
    label: `${NOMBRE_MES[m]} ${a}`,
  };
}

function delta(actual, anterior) {
  if (!anterior) return actual > 0 ? '+100%' : '0%';
  const pct = Math.round(((actual - anterior) / anterior) * 100);
  return (pct >= 0 ? '+' : '') + pct + '%';
}

// ── Tools que el LLM puede invocar ────────────────────────────────────────────
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'obtener_estadisticas',
      description: 'Estadísticas del chatbot BotGO de la página web (sesiones, mensajes, leads WhatsApp, PDFs descargados) para un periodo. También productos más consultados y búsquedas frecuentes.',
      parameters: {
        type: 'object',
        properties: {
          periodo: { type: 'string', enum: ['hoy','ayer','semana','mes','historico'] },
          mes:  { type: 'integer', description: 'Número de mes 1-12 si periodo=mes' },
          anio: { type: 'integer', description: 'Año si periodo=mes' },
        },
        required: ['periodo'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'comparar_periodos',
      description: 'Compara el periodo pedido contra el anterior (semana vs semana pasada, o mes vs mes anterior) con porcentajes de cambio.',
      parameters: {
        type: 'object',
        properties: {
          periodo: { type: 'string', enum: ['semana','mes'] },
          mes:  { type: 'integer' },
          anio: { type: 'integer' },
        },
        required: ['periodo'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'obtener_candidatos',
      description: 'Candidatos de reclutamiento registrados (nombre, puesto, estatus, fecha). Estatus: "nuevo" (sin revisar), "visto", "contactado", "descartado". Para "¿registros de hoy?" usa periodo="hoy". "¿los de ayer?" periodo="ayer". "¿esta semana?" periodo="semana".',
      parameters: {
        type: 'object',
        properties: {
          limite: { type: 'integer', default: 10 },
          filtro_status: { type: 'string', description: 'Filtrar por estatus: nuevo, visto, contactado, descartado. Omitir para todos.' },
          periodo: { type: 'string', enum: ['hoy','ayer','semana','mes','todos'], description: 'Filtrar por fecha de registro. Omitir = todos.' },
          mes: { type: 'integer' }, anio: { type: 'integer' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'obtener_vacantes',
      description: 'Vacantes de empleo activas publicadas en la página.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'obtener_distribuidores',
      description: 'Contactos/leads de distribuidores interesados (nombre, empresa, estatus, fecha). Para "¿registros de hoy?" usa periodo="hoy", "¿de ayer?" periodo="ayer".',
      parameters: {
        type: 'object',
        properties: {
          limite: { type: 'integer', default: 10 },
          filtro_status: { type: 'string', description: 'Filtrar por estatus: nuevo, contactado, cerrado. Omitir para todos.' },
          periodo: { type: 'string', enum: ['hoy','ayer','semana','mes','todos'], description: 'Filtrar por fecha de registro. Omitir = todos.' },
          mes: { type: 'integer' }, anio: { type: 'integer' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'obtener_consultas_recientes',
      description: 'Últimas consultas que los clientes hicieron al chatbot de la página.',
      parameters: { type: 'object', properties: { limite: { type: 'integer', default: 8 } } },
    },
  },
  {
    type: 'function',
    function: {
      name: 'postulaciones_por_vacante',
      description: 'Cuántas postulaciones tiene cada vacante/puesto, ordenadas de más a menos. Para "¿qué vacante tiene más postulaciones?", "¿cuál es la más solicitada?". Si se pasa puesto, lista los candidatos. Acepta periodo para "¿la más solicitada esta semana/hoy/mes?".',
      parameters: {
        type: 'object',
        properties: {
          puesto: { type: 'string', description: 'Opcional: nombre del puesto para ver quiénes se registraron a esa vacante específica.' },
          periodo: { type: 'string', enum: ['hoy','ayer','semana','mes','todos'], description: 'Filtrar postulaciones por fecha. Omitir = histórico.' },
          mes: { type: 'integer' }, anio: { type: 'integer' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'metricas_dashboard',
      description: 'Panorama COMPLETO del dashboard: totales, productos más consultados, búsquedas frecuentes, distribución de intenciones (compra/info/pdf/empleo), horas pico de actividad, totales de candidatos y distribuidores. Para "dame el control total", "cómo va todo", "panorama general", "todas las métricas".',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'enviar_reporte_pdf',
      description: 'Genera y envía el reporte PDF ejecutivo (el mismo del panel) al usuario por WhatsApp con link de descarga. Usar cuando pide un reporte, informe o documento. formato=resumen para el panorama del periodo; formato=comparativo para comparar contra el periodo anterior. periodo=mes con mes/anio para un mes específico (ej. "el reporte de mayo" → mes=5; "del mes pasado" → el mes anterior al actual).',
      parameters: {
        type: 'object',
        properties: {
          periodo: { type: 'string', enum: ['hoy','semana','mes','historico'] },
          formato: { type: 'string', enum: ['resumen','comparativo'] },
          mes:  { type: 'integer', description: 'Número de mes 1-12 si periodo=mes' },
          anio: { type: 'integer', description: 'Año si periodo=mes (por defecto el actual)' },
        },
        required: ['periodo','formato'],
      },
    },
  },
];

// ── Permisos requeridos por tool — enforcement en CÓDIGO, no en el prompt ────
const TOOL_PERMS = {
  obtener_estadisticas:        'reports',
  comparar_periodos:           'reports',
  enviar_reporte_pdf:          'reports',
  obtener_candidatos:          'candidates',
  postulaciones_por_vacante:   'candidates',
  obtener_vacantes:            'vacantes',
  obtener_distribuidores:      'distribuidores',
  obtener_consultas_recientes: 'messages',
  metricas_dashboard:          'reports',
};

// ── Ejecución de tools ────────────────────────────────────────────────────────
async function ejecutarTool(name, args, ctx) {
  const fmt = n => Number(n || 0).toLocaleString('es-MX');

  // Validación de permisos — bloqueo duro independiente del LLM
  const needed = TOOL_PERMS[name];
  const perms  = ctx.perms || [];
  if (needed && !perms.includes('*') && !perms.includes(needed)) {
    return { error: `El usuario NO tiene permiso "${needed}" para esta consulta. Infórmale que no tiene acceso a esta información y sugiérele pedir el permiso al administrador.` };
  }

  if (name === 'obtener_estadisticas') {
    const data = await readAllData();
    const r = rangoPeriodo(args.periodo, args.mes, args.anio);
    if (args.periodo === 'historico') {
      const topProd = Object.entries(data.products).slice(0, 5).map(([n,c]) => `${n}: ${c}`);
      return { periodo: r.label, sesiones: data.totalSessions, mensajes: data.totalMessages,
               leads_whatsapp: data.totalWhatsApp, pdfs: data.totalPDFs, productos_top: topProd };
    }
    const s = sumarRango(data.daily, r.desde, r.hasta);
    const topProd = Object.entries(data.products).slice(0, 5).map(([n,c]) => `${n}: ${c}`);
    return { periodo: r.label, dias_con_actividad: s.dias, sesiones: s.sessions,
             mensajes: s.messages, leads_whatsapp: s.wa, pdfs: s.pdf, productos_top: topProd };
  }

  if (name === 'comparar_periodos') {
    const data = await readAllData();
    const rA = rangoPeriodo(args.periodo, args.mes, args.anio);
    const rB = rangoAnterior(args.periodo, args.mes, args.anio);
    const a = sumarRango(data.daily, rA.desde, rA.hasta);
    const b = sumarRango(data.daily, rB.desde, rB.hasta);
    return {
      actual:   { periodo: rA.label, ...a },
      anterior: { periodo: rB.label, ...b },
      cambio: {
        sesiones: delta(a.sessions, b.sessions),
        mensajes: delta(a.messages, b.messages),
        leads_whatsapp: delta(a.wa, b.wa),
        pdfs: delta(a.pdf, b.pdf),
      },
    };
  }

  if (name === 'obtener_candidatos') {
    let leads = (await readRecruitmentLeads()) || [];
    const totalGeneral = leads.length;
    // Filtro de fecha exacto (hoy/ayer/semana/mes)
    const { items, rango } = filtrarPorPeriodo(leads, args.periodo, args.mes, args.anio);
    leads = items;
    if (args.filtro_status) {
      const f = String(args.filtro_status).toLowerCase();
      leads = leads.filter(c => (c.status || 'nuevo').toLowerCase() === f);
    }
    const n = args.limite || 10;
    return {
      periodo: rango.label || 'Histórico completo',
      total_general_historico: totalGeneral,
      total_en_periodo: leads.length,
      filtro_status: args.filtro_status || 'ninguno',
      candidatos: leads.slice(0, n).map(c => ({
        nombre: c.nombre, puesto: c.puesto, estatus: c.status || 'nuevo',
        estado: c.estado_rep || c.estado, telefono: c.telefono,
        fecha: fechaMX(c.ts || c.created_at),
      })),
    };
  }

  if (name === 'obtener_vacantes') {
    const vac = await readVacantes(true);
    return { total: vac.length, vacantes: vac.map(v => ({ titulo: v.titulo, area: v.area, ubicacion: v.ubicacion })) };
  }

  if (name === 'obtener_distribuidores') {
    let leads = (await readLeads()) || [];
    const totalGeneral = leads.length;
    const { items, rango } = filtrarPorPeriodo(leads, args.periodo, args.mes, args.anio);
    leads = items;
    if (args.filtro_status) {
      const f = String(args.filtro_status).toLowerCase();
      leads = leads.filter(l => (l.status || 'nuevo').toLowerCase() === f);
    }
    const n = args.limite || 10;
    return {
      periodo: rango.label || 'Histórico completo',
      total_general_historico: totalGeneral,
      total_en_periodo: leads.length,
      filtro_status: args.filtro_status || 'ninguno',
      contactos: leads.slice(0, n).map(l => ({
        nombre: l.nombre, empresa: l.empresa, whatsapp: l.whatsapp,
        producto_interes: l.productos || l.producto || 'no especificado',
        email: l.email, estatus: l.status || 'nuevo',
        fecha: fechaMX(l.ts || l.created_at),
      })),
    };
  }

  if (name === 'obtener_consultas_recientes') {
    const data = await readAllData();
    const n = args.limite || 8;
    return {
      consultas: (data.lastMessages || []).slice(-n).reverse().map(m => ({
        pregunta: String(m.user || '').slice(0, 100), intencion: m.intent,
      })),
    };
  }

  if (name === 'postulaciones_por_vacante') {
    let leads = (await readRecruitmentLeads()) || [];
    // Filtro de fecha exacto (postulaciones de hoy/semana/mes)
    const { items, rango } = filtrarPorPeriodo(leads, args.periodo, args.mes, args.anio);
    leads = items;
    const periodoLabel = rango.label || 'Histórico completo';
    // Agrupar por puesto
    const conteo = {};
    for (const c of leads) {
      const p = (c.puesto || 'Sin especificar').trim();
      if (!conteo[p]) conteo[p] = [];
      conteo[p].push(c);
    }
    const ranking = Object.entries(conteo)
      .map(([puesto, cands]) => ({ puesto, postulaciones: cands.length }))
      .sort((a, b) => b.postulaciones - a.postulaciones);

    // Si pidió un puesto específico, listar los candidatos
    if (args.puesto) {
      const f = String(args.puesto).toLowerCase();
      const match = Object.entries(conteo).find(([p]) => p.toLowerCase().includes(f));
      if (!match) return { periodo: periodoLabel, puesto: args.puesto, postulaciones: 0, candidatos: [], nota: 'Sin postulaciones para ese puesto en el periodo' };
      return {
        periodo: periodoLabel,
        puesto: match[0],
        postulaciones: match[1].length,
        candidatos: match[1].slice(0, 15).map(c => ({
          nombre: c.nombre, estatus: c.status || 'nuevo',
          estado: c.estado_rep || c.estado, telefono: c.telefono, email: c.email,
          fecha: fechaMX(c.ts || c.created_at),
        })),
      };
    }

    return {
      periodo: periodoLabel,
      total_postulaciones: leads.length,
      vacante_mas_solicitada: ranking[0] || null,
      ranking: ranking.slice(0, 12),
    };
  }

  if (name === 'metricas_dashboard') {
    const data = await readAllData();
    const leads = (await readRecruitmentLeads()) || [];
    const distrib = (await readLeads()) || [];
    const vac = await readVacantes(true);

    const topProd = Object.entries(data.products || {}).sort(([,a],[,b])=>b-a).slice(0,8).map(([n,c])=>`${n}: ${c}`);
    const topKw   = Object.entries(data.keywords || {}).sort(([,a],[,b])=>b-a).slice(0,8).map(([n,c])=>`${n}: ${c}`);
    // Hora pico
    const horas = data.hourly || [];
    const horaPico = horas.length ? horas.indexOf(Math.max(...horas)) : null;
    // Postulaciones por puesto (top 3)
    const conteoPuesto = {};
    for (const c of leads) { const p=(c.puesto||'?').trim(); conteoPuesto[p]=(conteoPuesto[p]||0)+1; }
    const topVacantes = Object.entries(conteoPuesto).sort(([,a],[,b])=>b-a).slice(0,3).map(([p,n])=>`${p}: ${n}`);
    // Candidatos nuevos sin revisar
    const nuevos = leads.filter(c => (c.status||'nuevo').toLowerCase()==='nuevo').length;

    return {
      totales: {
        sesiones: data.totalSessions, mensajes: data.totalMessages,
        leads_whatsapp: data.totalWhatsApp, pdfs: data.totalPDFs,
      },
      reclutamiento: {
        total_candidatos: leads.length, sin_revisar: nuevos,
        vacantes_activas: vac.length, top_vacantes_solicitadas: topVacantes,
      },
      distribuidores: { total: distrib.length },
      productos_top: topProd,
      busquedas_top: topKw,
      intenciones: data.intents,
      hora_pico: horaPico !== null ? `${horaPico}:00 hrs` : 'sin datos',
    };
  }

  if (name === 'enviar_reporte_pdf') {
    // Genera el MISMO PDF ejecutivo del panel (resumen o comparativo), filtrado por
    // periodo. La generación real (buildReportHTML + Puppeteer) la hace /api/reports/send-now
    // vía el webhook; aquí solo definimos qué reporte y qué rango.
    const comparativo = args.formato === 'comparativo';
    const report_type = comparativo ? 'comparativo' : 'resumen';

    let period = 'all', period_from = null, period_to = null, label = 'Histórico completo';
    if (args.periodo === 'hoy')         { period = 'today'; label = 'Hoy'; }
    else if (args.periodo === 'semana') { period = '7d';    label = 'Últimos 7 días'; }
    else if (args.periodo === 'mes')    {
      const r = rangoPeriodo('mes', args.mes, args.anio);
      period = 'custom'; period_from = r.desde; period_to = r.hasta; label = r.label;
    } else if (comparativo) {
      // El comparativo necesita un rango concreto para calcular el periodo anterior.
      const r = rangoPeriodo('mes');
      period = 'custom'; period_from = r.desde; period_to = r.hasta; label = r.label;
    }

    ctx.reportRequest = { report_type, period, period_from, period_to };
    return {
      ok: true,
      generando: report_type,
      periodo: label,
      nota: 'El reporte PDF se está generando y se enviará por WhatsApp con su link de descarga. Confírmaselo al usuario en una línea breve.',
    };
  }

  return { error: 'tool desconocida' };
}

// ── Historial conversacional del número ───────────────────────────────────────
async function historialReciente(phone, limite = 6) {
  try {
    const rows = await getWAIncoming({ limit: 30, offset: 0 });
    const propios = (rows || []).filter(r => r.phone === phone && r.body).slice(0, limite).reverse();
    const msgs = [];
    for (const r of propios) {
      msgs.push({ role: 'user', content: String(r.body).slice(0, 400) });
      if (r.bot_reply) msgs.push({ role: 'assistant', content: String(r.bot_reply).slice(0, 400) });
    }
    return msgs;
  } catch { return []; }
}

// ── System prompt ─────────────────────────────────────────────────────────────
function systemPrompt(perms) {
  const now = hoyMX();
  const fecha = now.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return `Eres el asistente ejecutivo de Grupo Ortiz por WhatsApp. Hablas con un miembro autorizado del equipo (no un cliente).

Fecha actual: ${fecha} (zona horaria Ciudad de México).

SOBRE GRUPO ORTIZ (GO): "GO" = Grupo Ortiz. Empresa 100% mexicana fundada en 1959 en Morelia, Michoacán. Líder en fabricación de polímeros y empaques en México y Latinoamérica. +65 años, +3,000 colaboradores, 13 plantas (12 en Morelia, 1 en Monterrey), capacidad de 220,000 toneladas anuales, exporta a América y Europa. Productos: rafias, stretch film, cuerdas PP, sacos, arpillas, esquineros, empaques flexibles, charolas, bolsas, acolchados. Si te preguntan "¿qué es GO?" o "¿qué es Grupo Ortiz?", respóndelo con esta info.

Tienes acceso a los datos reales del sistema BotGO (el chatbot de la página web grupo-ortiz.com): estadísticas de uso, candidatos de reclutamiento, vacantes, contactos de distribuidores y consultas de clientes.

Permisos del usuario: ${JSON.stringify(perms)}. Si pide algo fuera de sus permisos (reports, candidates, vacantes, distribuidores, messages; * = todos), recházalo amablemente.

Tienes acceso a TODO el movimiento de la página: estadísticas de uso, todas las métricas del dashboard, candidatos y postulaciones por vacante, vacantes, distribuidores y consultas de clientes. Eres el centro de control del negocio por WhatsApp.

Reglas:
- Responde natural y profesional, como un analista ejecutivo de confianza.
- FORMATO WHATSAPP OBLIGATORIO: negritas con UN asterisco (*texto*), NUNCA dos (**texto** prohibido). Listas con guion (-). Sin headers markdown (#). Usa saltos de línea para separar secciones.
- ESTRUCTURA: empieza con la respuesta directa, luego los datos en lista clara, y cierra con una observación útil o pregunta de seguimiento. Para rankings usa numeración (1., 2., 3.).
- USA las herramientas para responder con datos reales. JAMÁS inventes cifras.
- "¿qué vacante tiene más postulaciones?" → postulaciones_por_vacante. "¿quiénes se registraron a X?" → postulaciones_por_vacante con ese puesto.
- "dame el control total / panorama / cómo va todo" → metricas_dashboard.
- "reporte/informe/documento" → enviar_reporte_pdf (resumen por defecto, comparativo si lo pide).
- Datos puntuales (¿cuántos mensajes hoy?) → texto directo, sin PDF.
- Si combinas varias métricas, organízalas con subtítulos en negrita (ej. *Reclutamiento:*, *Productos:*).
- Sé conciso pero completo: si piden "todo el control", da un panorama estructurado de varias áreas.`;
}

// ── Loop principal con OpenAI ─────────────────────────────────────────────────
export async function ejecutarAsistente(texto, permsArray, phone) {
  const apiKey = process.env.OPENAI_API_KEY || import.meta.env?.OPENAI_API_KEY;
  if (!apiKey) return null; // sin API key → caller usa fallback de comandos

  const perms = permsArray || [];
  const ctx = { pdfData: null, reportRequest: null, perms };

  const messages = [
    { role: 'system', content: systemPrompt(perms) },
    ...(await historialReciente(phone)),
    { role: 'user', content: String(texto).slice(0, 1000) },
  ];

  // Hasta 4 rondas de tool-calling.
  // Ronda 0 fuerza el uso de herramientas — evita que el modelo invente cifras.
  for (let round = 0; round < 4; round++) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: MODEL, messages, tools: TOOLS,
        tool_choice: round === 0 ? 'required' : 'auto',
        max_tokens: 700, temperature: 0.15,
      }),
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      console.error('[wa-assistant] OpenAI HTTP', res.status, errBody.slice(0, 200));
      return null;
    }
    const data = await res.json();
    const msg = data.choices?.[0]?.message;
    if (!msg) return null;

    if (msg.tool_calls?.length) {
      messages.push(msg);
      for (const tc of msg.tool_calls) {
        let args = {};
        try { args = JSON.parse(tc.function.arguments || '{}'); } catch {}
        let result;
        try { result = await ejecutarTool(tc.function.name, args, ctx); }
        catch (e) { result = { error: e.message }; }
        messages.push({ role: 'tool', tool_call_id: tc.id, content: JSON.stringify(result).slice(0, 4000) });
      }
      continue; // siguiente ronda con resultados
    }

    // Respuesta final — normalizar formato a WhatsApp (** → *, ### → nada)
    const text = waFormat((msg.content || '').trim());
    if (!text && !ctx.pdfData && !ctx.reportRequest) return null;
    return { text: text || 'Aquí tienes tu reporte.', pdfData: ctx.pdfData, reportRequest: ctx.reportRequest };
  }

  return { text: 'No pude completar la consulta, intenta de nuevo.', pdfData: ctx.pdfData, reportRequest: ctx.reportRequest };
}

// Convierte markdown estándar al formato de WhatsApp
function waFormat(s) {
  return String(s)
    .replace(/\*\*\*(.+?)\*\*\*/g, '*$1*')   // ***x*** → *x*
    .replace(/\*\*(.+?)\*\*/g, '*$1*')        // **x**   → *x*
    .replace(/^#{1,6}\s*/gm, '')              // headers markdown → nada
    .replace(/__(.+?)__/g, '*$1*');           // __x__   → *x*
}
