// src/lib/wa-commands.js
// Motor de comandos para el bot privado de WhatsApp
import { readAllData, readRecruitmentLeads, readVacantes, readLeads, getWAIncoming } from './analytics-db.js';

// ── Permisos disponibles ──────────────────────────────────────────────────────
export const PERMISSIONS = {
  reports:      'Reportes y estadísticas',
  candidates:   'Candidatos y reclutamiento',
  vacantes:     'Vacantes publicadas',
  distribuidores: 'Contactos distribuidores',
  messages:     'Historial de mensajes del bot',
};

// ── Meses en español → número ─────────────────────────────────────────────────
const MESES = {
  enero:1, ene:1, jan:1,
  febrero:2, feb:2,
  marzo:3, mar:3,
  abril:4, abr:4, apr:4,
  mayo:5, may:5,
  junio:6, jun:6,
  julio:7, jul:7,
  agosto:8, ago:8, aug:8,
  septiembre:9, sep:9, sept:9,
  octubre:10, oct:10,
  noviembre:11, nov:11,
  diciembre:12, dic:12, dec:12,
};

function parseMes(texto) {
  const norm = texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  for (const [nombre, num] of Object.entries(MESES)) {
    if (norm.includes(nombre)) return num;
  }
  // "11/2024" o "11"
  const m = norm.match(/\b(1[0-2]|[1-9])\b/);
  return m ? parseInt(m[1]) : null;
}

function parseAnio(texto) {
  const m = texto.match(/\b(202[0-9]|20[3-9][0-9])\b/);
  return m ? parseInt(m[1]) : new Date().getFullYear();
}

// ── Formatear números ─────────────────────────────────────────────────────────
function fmt(n) { return Number(n || 0).toLocaleString('es-MX'); }

// ── Nombre del mes ────────────────────────────────────────────────────────────
const NOMBRE_MES = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

// ── Resumen de un período de días ─────────────────────────────────────────────
function resumenPeriodo(daily, prefix) {
  const dias = Object.entries(daily).filter(([d]) => d.startsWith(prefix));
  const sum  = dias.reduce((a,[,v])=>({ sessions: a.sessions+v.sessions, messages: a.messages+v.messages, wa: a.wa+v.wa, pdf: a.pdf+v.pdf }), { sessions:0, messages:0, wa:0, pdf:0 });
  return { ...sum, dias: dias.length };
}

// ── Detectar intención del mensaje ────────────────────────────────────────────
function detectarComando(texto) {
  const t = texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  if (/ayuda|comandos|help|que puedes|que puedo/.test(t)) return { cmd: 'ayuda' };

  if (/candidato|reclutamiento|postulante|cv|solicitud/.test(t)) return { cmd: 'candidatos' };
  if (/vacante|empleo|puesto|trabajo|plaza/.test(t)) return { cmd: 'vacantes' };
  if (/distribuidor|lead|contacto|cliente/.test(t)) return { cmd: 'distribuidores' };
  if (/mensaje|chat|bot|conversacion/.test(t)) return { cmd: 'mensajes' };

  if (/hoy|dia de hoy|hoy como/.test(t)) return { cmd: 'hoy' };
  if (/esta semana|semana|7 dias/.test(t)) return { cmd: 'semana' };

  if (/reporte|informe|resumen|estadistica|como estuvo|como fue|como va|como vamos/.test(t)) {
    const mes  = parseMes(t);
    const anio = parseAnio(t);
    if (mes) return { cmd: 'reporte_mes', mes, anio };
    return { cmd: 'resumen' };
  }

  // Solo mencionar el mes
  const mes = parseMes(t);
  if (mes) return { cmd: 'reporte_mes', mes, anio: parseAnio(t) };

  return { cmd: 'desconocido' };
}

// ── Verificar si el número tiene permiso para el comando ─────────────────────
function tienePermiso(perms, cmd) {
  if (perms.includes('*')) return true;
  const MAP = {
    resumen:      'reports',
    hoy:          'reports',
    semana:       'reports',
    reporte_mes:  'reports',
    candidatos:   'candidates',
    vacantes:     'vacantes',
    distribuidores: 'distribuidores',
    mensajes:     'messages',
    ayuda:        null, // siempre permitido
  };
  const needed = MAP[cmd];
  if (!needed) return true;
  return perms.includes(needed);
}

// ── Resultado: { text, pdfData? } ────────────────────────────────────────────
// pdfData = { titulo, stats, extra } → notify.js lo convierte en PDF

// ── Ejecutar comando y generar respuesta ──────────────────────────────────────
export async function ejecutarComando(texto, permsArray) {
  const perms = permsArray || [];
  const { cmd, mes, anio } = detectarComando(texto);

  if (!tienePermiso(perms, cmd)) {
    return { text: `No tienes permiso para ese comando.\nEscribe *ayuda* para ver los disponibles.` };
  }

  if (cmd === 'ayuda') {
    const lineas = ['*BotGO — Comandos disponibles:*', ''];
    if (perms.includes('reports') || perms.includes('*')) {
      lineas.push('📊 *hoy* → estadísticas de hoy');
      lineas.push('📅 *semana* → últimos 7 días');
      lineas.push('📆 *noviembre* (cualquier mes) → reporte del mes + PDF');
      lineas.push('📋 *resumen* → totales históricos + PDF');
    }
    if (perms.includes('candidates') || perms.includes('*')) lineas.push('👥 *candidatos* → últimos postulantes');
    if (perms.includes('vacantes') || perms.includes('*')) lineas.push('💼 *vacantes* → vacantes activas');
    if (perms.includes('distribuidores') || perms.includes('*')) lineas.push('🏢 *distribuidores* → últimos contactos');
    if (perms.includes('messages') || perms.includes('*')) lineas.push('💬 *mensajes* → últimas consultas del bot');
    return { text: lineas.join('\n') };
  }

  if (cmd === 'hoy') {
    const data  = await readAllData();
    const today = new Date().toISOString().split('T')[0];
    const d     = data.daily[today] || { sessions:0, messages:0, wa:0, pdf:0 };
    return {
      text: `*📊 Hoy — ${today}*\n\nSesiones: ${fmt(d.sessions)}\nMensajes: ${fmt(d.messages)}\nLeads WA: ${fmt(d.wa)}\nPDFs: ${fmt(d.pdf)}`,
    };
  }

  if (cmd === 'semana') {
    const data = await readAllData();
    const keys = Object.keys(data.daily).sort().slice(-7);
    const sum  = keys.reduce((a,k)=>{ const v=data.daily[k]||{}; return { sessions:a.sessions+(v.sessions||0), messages:a.messages+(v.messages||0), wa:a.wa+(v.wa||0), pdf:a.pdf+(v.pdf||0) }; },{ sessions:0, messages:0, wa:0, pdf:0 });
    return {
      text: `*📅 Últimos 7 días*\n\nSesiones: ${fmt(sum.sessions)}\nMensajes: ${fmt(sum.messages)}\nLeads WA: ${fmt(sum.wa)}\nPDFs: ${fmt(sum.pdf)}`,
    };
  }

  if (cmd === 'resumen') {
    const data    = await readAllData();
    const topProd = Object.entries(data.products).sort(([,a],[,b])=>b-a).slice(0,5).map(([n,c])=>`${n}: ${c}`).join('\n');
    const topKw   = Object.entries(data.keywords||{}).sort(([,a],[,b])=>b-a).slice(0,5).map(([n,c])=>`${n}: ${c}`).join('\n');
    return {
      text: `*📋 Resumen General BotGO*\n\nSesiones: ${fmt(data.totalSessions)}\nMensajes: ${fmt(data.totalMessages)}\nLeads WhatsApp: ${fmt(data.totalWhatsApp)}\nPDFs enviados: ${fmt(data.totalPDFs)}\n\n🏆 Productos top:\n${topProd || 'sin datos'}`,
      pdfData: {
        titulo: 'Resumen General',
        periodo: 'Histórico completo',
        stats: [
          { label: 'Sesiones totales', value: fmt(data.totalSessions) },
          { label: 'Mensajes totales', value: fmt(data.totalMessages) },
          { label: 'Leads WhatsApp',  value: fmt(data.totalWhatsApp) },
          { label: 'PDFs enviados',   value: fmt(data.totalPDFs) },
        ],
        extra: topProd ? `Productos top:\n${topProd}` : '',
        extra2: topKw  ? `Búsquedas top:\n${topKw}` : '',
      },
    };
  }

  if (cmd === 'reporte_mes') {
    const data   = await readAllData();
    const prefix = `${anio}-${String(mes).padStart(2,'0')}`;
    const { sessions, messages, wa, pdf, dias } = resumenPeriodo(data.daily, prefix);
    const nombre = NOMBRE_MES[mes];
    if (dias === 0) return { text: `No hay datos para ${nombre} ${anio}.` };
    const prom = Math.round(messages / dias);
    return {
      text: `*📆 ${nombre} ${anio}* (${dias} días con actividad)\n\nSesiones: ${fmt(sessions)}\nMensajes: ${fmt(messages)}\nLeads WA: ${fmt(wa)}\nPDFs: ${fmt(pdf)}\n\nPromedio: ${prom} msg/día`,
      pdfData: {
        titulo: `Reporte ${nombre} ${anio}`,
        periodo: `${nombre} ${anio} · ${dias} días con actividad`,
        stats: [
          { label: 'Sesiones',        value: fmt(sessions) },
          { label: 'Mensajes',        value: fmt(messages) },
          { label: 'Leads WhatsApp',  value: fmt(wa) },
          { label: 'PDFs enviados',   value: fmt(pdf) },
          { label: 'Promedio diario', value: `${prom} msg/día` },
        ],
        extra: '',
      },
    };
  }

  if (cmd === 'candidatos') {
    const leads     = await readRecruitmentLeads();
    const recientes = (leads || []).slice(0, 5);
    if (!recientes.length) return { text: 'Sin candidatos registrados.' };
    const lineas = ['*👥 Últimos candidatos:*', ''];
    for (const c of recientes) lineas.push(`• *${c.nombre || '—'}* → ${c.puesto || '—'} (${c.status || 'nuevo'})`);
    lineas.push(`\nTotal: ${leads.length}`);
    return { text: lineas.join('\n') };
  }

  if (cmd === 'vacantes') {
    const vac = await readVacantes(true);
    if (!vac.length) return { text: 'Sin vacantes activas.' };
    const lineas = ['*💼 Vacantes activas:*', ''];
    for (const v of vac) lineas.push(`• *${v.titulo}* — ${v.area || ''} ${v.ubicacion ? `(${v.ubicacion})` : ''}`);
    return { text: lineas.join('\n') };
  }

  if (cmd === 'distribuidores') {
    const leads     = await readLeads();
    const recientes = (leads || []).slice(0, 5);
    if (!recientes.length) return { text: 'Sin contactos de distribuidores.' };
    const lineas = ['*🏢 Últimos contactos:*', ''];
    for (const l of recientes) lineas.push(`• *${l.nombre || '—'}* — ${l.empresa || '—'} (${l.status || '—'})`);
    lineas.push(`\nTotal: ${leads.length}`);
    return { text: lineas.join('\n') };
  }

  if (cmd === 'mensajes') {
    const data      = await readAllData();
    const recientes = (data.lastMessages || []).slice(-5).reverse();
    if (!recientes.length) return { text: 'Sin mensajes recientes.' };
    const lineas = ['*💬 Últimas consultas:*', ''];
    for (const m of recientes) lineas.push(`• "${String(m.user||'').slice(0,60)}" _(${m.intent||''})_`);
    return { text: lineas.join('\n') };
  }

  return { text: `No entendí ese comando.\nEscribe *ayuda* para ver los disponibles.` };
}
