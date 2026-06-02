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
      description: 'Últimos candidatos de reclutamiento registrados por el bot (nombre, puesto, estatus).',
      parameters: { type: 'object', properties: { limite: { type: 'integer', default: 8 } } },
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
      description: 'Últimos contactos/leads de distribuidores interesados.',
      parameters: { type: 'object', properties: { limite: { type: 'integer', default: 8 } } },
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
      name: 'enviar_reporte_pdf',
      description: 'Genera y envía un reporte PDF al usuario por WhatsApp. Usar cuando pide explícitamente un reporte, informe o documento. formato=resumen para cifras del periodo; formato=comparativo para comparar contra el periodo anterior.',
      parameters: {
        type: 'object',
        properties: {
          periodo: { type: 'string', enum: ['hoy','semana','mes','historico'] },
          formato: { type: 'string', enum: ['resumen','comparativo'] },
          mes:  { type: 'integer' },
          anio: { type: 'integer' },
        },
        required: ['periodo','formato'],
      },
    },
  },
];

// ── Ejecución de tools ────────────────────────────────────────────────────────
async function ejecutarTool(name, args, ctx) {
  const fmt = n => Number(n || 0).toLocaleString('es-MX');

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
    const leads = await readRecruitmentLeads();
    const n = args.limite || 8;
    return {
      total: (leads || []).length,
      candidatos: (leads || []).slice(0, n).map(c => ({
        nombre: c.nombre, puesto: c.puesto, estatus: c.status || 'nuevo',
        estado: c.estado_rep || c.estado, telefono: c.telefono,
      })),
    };
  }

  if (name === 'obtener_vacantes') {
    const vac = await readVacantes(true);
    return { total: vac.length, vacantes: vac.map(v => ({ titulo: v.titulo, area: v.area, ubicacion: v.ubicacion })) };
  }

  if (name === 'obtener_distribuidores') {
    const leads = await readLeads();
    const n = args.limite || 8;
    return {
      total: (leads || []).length,
      contactos: (leads || []).slice(0, n).map(l => ({
        nombre: l.nombre, empresa: l.empresa, whatsapp: l.whatsapp, estatus: l.status,
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

  if (name === 'enviar_reporte_pdf') {
    const data = await readAllData();
    const rA = rangoPeriodo(args.periodo, args.mes, args.anio);

    if (args.formato === 'comparativo') {
      const rB = rangoAnterior(args.periodo === 'historico' ? 'mes' : args.periodo, args.mes, args.anio);
      const a = sumarRango(data.daily, rA.desde, rA.hasta);
      const b = sumarRango(data.daily, rB.desde, rB.hasta);
      ctx.pdfData = {
        titulo: `Comparativo ${rA.label}`,
        periodo: `${rA.label} vs ${rB.label}`,
        stats: [
          { label: 'Sesiones',  value: `${fmt(a.sessions)} (${delta(a.sessions,b.sessions)})` },
          { label: 'Mensajes',  value: `${fmt(a.messages)} (${delta(a.messages,b.messages)})` },
          { label: 'Leads WA',  value: `${fmt(a.wa)} (${delta(a.wa,b.wa)})` },
          { label: 'PDFs',      value: `${fmt(a.pdf)} (${delta(a.pdf,b.pdf)})` },
          { label: `${rB.label}`, value: `${fmt(b.messages)} msgs` },
        ],
        extra: `Periodo actual: ${rA.label} (${a.dias} días)\nPeriodo anterior: ${rB.label} (${b.dias} días)`,
      };
      return { ok: true, pdf: 'comparativo generado', detalle: ctx.pdfData.periodo };
    }

    // resumen
    const s = args.periodo === 'historico'
      ? { sessions: data.totalSessions, messages: data.totalMessages, wa: data.totalWhatsApp, pdf: data.totalPDFs, dias: Object.keys(data.daily).length }
      : sumarRango(data.daily, rA.desde, rA.hasta);
    const topProd = Object.entries(data.products).slice(0, 5).map(([n,c]) => `${n}: ${c}`).join('\n');
    ctx.pdfData = {
      titulo: `Reporte ${rA.label}`,
      periodo: `${rA.label} · ${s.dias} días con actividad`,
      stats: [
        { label: 'Sesiones', value: fmt(s.sessions) },
        { label: 'Mensajes', value: fmt(s.messages) },
        { label: 'Leads WhatsApp', value: fmt(s.wa) },
        { label: 'PDFs enviados', value: fmt(s.pdf) },
        { label: 'Promedio diario', value: s.dias ? `${Math.round(s.messages/s.dias)} msg/día` : '0' },
      ],
      extra: topProd ? `Productos top:\n${topProd}` : '',
    };
    return { ok: true, pdf: 'resumen generado', detalle: rA.label };
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

Tienes acceso a los datos reales del sistema BotGO (el chatbot de la página web grupo-ortiz.com): estadísticas de uso, candidatos de reclutamiento, vacantes, contactos de distribuidores y consultas de clientes.

Permisos del usuario: ${JSON.stringify(perms)}. Si pide algo fuera de sus permisos (reports, candidates, vacantes, distribuidores, messages; * = todos), recházalo amablemente.

Reglas:
- Responde natural y conciso, como un colega eficiente.
- FORMATO WHATSAPP OBLIGATORIO: negritas con UN asterisco (*texto*), NUNCA dos (**texto** está prohibido). Listas con guion. Sin headers markdown (#).
- USA las herramientas para responder con datos reales. Nunca inventes cifras.
- Si piden un "reporte", "informe" o "documento" usa enviar_reporte_pdf. Pregunta el formato solo si es ambiguo; por defecto usa "resumen". "Comparativo" compara contra el periodo anterior.
- Si piden datos puntuales (¿cuántos mensajes hoy?) responde directo con texto, sin PDF.
- Puedes resolver dudas generales del negocio con los datos disponibles. Si no tienes el dato, dilo claro.
- Respuestas cortas: máximo ~8 líneas salvo que pidan detalle.`;
}

// ── Loop principal con OpenAI ─────────────────────────────────────────────────
export async function ejecutarAsistente(texto, permsArray, phone) {
  const apiKey = process.env.OPENAI_API_KEY || import.meta.env?.OPENAI_API_KEY;
  if (!apiKey) return null; // sin API key → caller usa fallback de comandos

  const perms = permsArray || [];
  const ctx = { pdfData: null };

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
        max_tokens: 700, temperature: 0.3,
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

    // Respuesta final
    const text = (msg.content || '').trim();
    if (!text && !ctx.pdfData) return null;
    return { text: text || 'Aquí tienes tu reporte.', pdfData: ctx.pdfData };
  }

  return { text: 'No pude completar la consulta, intenta de nuevo.', pdfData: ctx.pdfData };
}
