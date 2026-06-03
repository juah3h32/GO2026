// src/lib/agents.js
// Agentes especializados por área (SOLO LECTURA) coordinados por ANALYTIC BOT JP.
// Cada agente: recolecta datos de su área (rápido, server-side) y produce un
// sub-diagnóstico corto con Claude bajo su rol. El orquestador los ensambla.
import { getSystemLogs, readLeads, readRecruitmentLeads } from './analytics-db.js';
import { diagnoseWithRole } from './claude-diagnose.js';

const ROL_BASE = 'Eres un agente de ANALYTIC BOT JP, SOLO LECTURA (nunca modificas nada). Respondes en español, MÁXIMO 2 líneas, sin viñetas numeradas ni encabezados. Formato WhatsApp: negrita con UN solo asterisco (*así*), NUNCA doble (**). Sin emojis. Si tu área está bien, responde EXACTAMENTE "OK". Si hay falla, di qué y la corrección en una frase. Ignora scripts de terceros (Google Tag Manager, ContentSquare, analytics) — no son fallas del sitio.';

// Normaliza a formato WhatsApp: ** -> *, sin headers/emojis sobrantes.
function waFmt(s) {
  return String(s || '')
    .replace(/\*\*\*(.+?)\*\*\*/g, '*$1*')
    .replace(/\*\*(.+?)\*\*/g, '*$1*')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/[⚠️✅❌🚨]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function fmtLogs(logs) {
  return (logs || []).slice(0, 20).map(l => `[${l.level}] ${l.category} ${l.source || ''}: ${String(l.message || '').slice(0, 160)}`).join('\n') || '(sin eventos)';
}

// ── Definición de agentes ─────────────────────────────────────────────────────
export const AGENTS = [
  {
    key: 'JP-WEB',
    area: 'Web / Rutas y recursos',
    rol: `${ROL_BASE} Tu área: páginas, rutas, videos, imágenes y links del sitio. Detectas rutas caídas (404), videos/recursos que no cargan y errores de JavaScript del frontend.`,
    async collect() {
      const cats = ['crawl', 'video', 'resource', 'frontend', 'js-error', 'animation', 'network'];
      const logs = (await getSystemLogs({ limit: 60 }).catch(() => []))
        .filter(l => cats.includes(l.category));
      return { logs };
    },
    content(d) { return `Eventos de Web/Rutas (24h):\n${fmtLogs(d.logs)}`; },
  },
  {
    key: 'JP-SEC',
    area: 'Seguridad',
    rol: `${ROL_BASE} Tu área: seguridad. Detectas posible extracción de datos, accesos sospechosos, límite de peticiones (rate-limit) y vulnerabilidades. Cualquier hallazgo aquí es PRIORITARIO.`,
    async collect() {
      const logs = (await getSystemLogs({ limit: 60 }).catch(() => []))
        .filter(l => l.level === 'security' || l.category === 'rate-limit' || l.category === 'auth');
      return { logs };
    },
    content(d) { return `Eventos de Seguridad (24h):\n${fmtLogs(d.logs)}`; },
  },
  {
    key: 'JP-API',
    area: 'Backend / Integraciones',
    rol: `${ROL_BASE} Tu área: APIs, WhatsApp, reportes PDF, base de datos e integraciones. Detectas fallos de envío, errores de endpoints y reportes que no se generan.`,
    async collect() {
      const cats = ['whatsapp', 'api', 'reportes', 'db', 'webhook'];
      const logs = (await getSystemLogs({ limit: 60 }).catch(() => []))
        .filter(l => cats.includes(l.category) || l.level === 'critical');
      return { logs };
    },
    content(d) { return `Eventos de Backend/Integraciones (24h):\n${fmtLogs(d.logs)}`; },
  },
  {
    key: 'JP-DATA',
    area: 'Datos / Negocio',
    rol: `${ROL_BASE} Tu área: actividad de negocio (distribuidores y postulaciones). Detectas caídas anómalas (ej. 0 registros cuando suele haber) o señales de que la captura de datos se rompió. No alarmes por variación normal.`,
    async collect() {
      const [leads, recruit] = await Promise.all([
        readLeads().catch(() => []),
        readRecruitmentLeads().catch(() => []),
      ]);
      const hoy = new Date().toISOString().slice(0, 10);
      const ayer = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const cuenta = (arr, dia) => (arr || []).filter(x => String(x.ts || x.created_at || '').startsWith(dia)).length;
      return {
        distribuidores: { total: (leads || []).length, hoy: cuenta(leads, hoy), ayer: cuenta(leads, ayer) },
        postulaciones: { total: (recruit || []).length, hoy: cuenta(recruit, hoy), ayer: cuenta(recruit, ayer) },
      };
    },
    content(d) {
      return `Actividad de negocio:\n- Distribuidores: total ${d.distribuidores.total}, hoy ${d.distribuidores.hoy}, ayer ${d.distribuidores.ayer}\n- Postulaciones: total ${d.postulaciones.total}, hoy ${d.postulaciones.hoy}, ayer ${d.postulaciones.ayer}`;
    },
  },
];

// Corre UN agente: recolecta + diagnostica. Devuelve { key, area, ok, text }.
export async function runAgent(agent) {
  try {
    const data = await agent.collect();
    const r = await diagnoseWithRole(agent.rol, agent.content(data));
    return { key: agent.key, area: agent.area, ok: r.ok, text: r.ok ? waFmt(r.text) : `(${r.error})` };
  } catch (e) {
    return { key: agent.key, area: agent.area, ok: false, text: `(error: ${e.message})` };
  }
}
