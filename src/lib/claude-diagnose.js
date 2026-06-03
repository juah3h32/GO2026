// src/lib/claude-diagnose.js
// Diagnóstico de salud del sistema con Claude (SOLO para esta parte).
// Toma logs + stats y devuelve un diagnóstico CORTO y DIRECTO en español.
// Se usa para responder por WhatsApp y para alertas automáticas de fallas críticas.
import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-sonnet-4-6';

// System prompt estable (apto para prompt caching). NADA volátil aquí —
// los logs/stats van en el mensaje de usuario, después del breakpoint de caché.
const SYSTEM_PROMPT = `Eres *ANALYTIC BOT JP*, el agente de monitoreo de la página grupo-ortiz.com (BotGO). Tu único trabajo es diagnosticar la salud del sistema a partir de logs y estadísticas, y avisar qué falla. Eres SOLO LECTURA: nunca modificas ni borras nada, solo detectas problemas e informas.

Reglas de respuesta OBLIGATORIAS:
- CORTO y DIRECTO. Máximo 6 líneas. Sin relleno, sin saludos, sin despedidas.
- Español. Formato WhatsApp: negrita con UN asterisco (*así*), nunca doble. Listas con guion (-).
- Empieza con el veredicto en una línea: "*Todo en orden*" o "*Atención*" o "*URGENTE*".
- Si hay eventos de seguridad (posible extracción de datos, accesos sospechosos, rate-limit), resáltalos PRIMERO y marca como URGENTE.
- Agrupa por área (videos, API, seguridad, reportes, etc.). Para cada falla: qué es y la corrección concreta en pocas palabras.
- Si no hay nada relevante, responde solo: "*Todo en orden*. Sin errores ni eventos de seguridad."
- No inventes. Usa solo los datos provistos. Si faltan datos, dilo en una línea.`;

function buildUserContent(stats, logs) {
  const s = stats || {};
  const resumen = [
    `Resumen 24h — críticos: ${s.critical || 0}, errores: ${s.error || 0}, seguridad: ${s.security || 0}, advertencias: ${s.warn || 0}.`,
    `Alertas sin ver: ${s.unseenAlerts || 0}.`,
  ].join(' ');

  const eventos = (logs || []).slice(0, 40).map(l => {
    const meta = l.meta && typeof l.meta === 'object'
      ? ` ${[l.meta.src, l.meta.tag, l.meta.ip].filter(Boolean).join(' ')}`.slice(0, 120)
      : '';
    return `- [${l.level}] (${l.category}) ${l.source || ''}: ${String(l.message || '').slice(0, 200)}${meta}`;
  }).join('\n');

  return `${resumen}\n\nEventos recientes (más nuevos primero):\n${eventos || '(ninguno)'}\n\nDiagnostica en corto y directo.`;
}

let _client = null;
function client() {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY || import.meta.env?.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  _client = new Anthropic({ apiKey });
  return _client;
}

// Diagnóstico genérico con un ROL específico (para agentes por área).
// systemPrompt define la especialidad; userContent son los datos a analizar.
export async function diagnoseWithRole(systemPrompt, userContent, maxTokens = 280) {
  const anthropic = client();
  if (!anthropic) return { ok: false, error: 'ANTHROPIC_API_KEY no configurada' };
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      thinking: { type: 'disabled' },
      system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: String(userContent).slice(0, 6000) }],
    });
    const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('').trim();
    return { ok: true, text };
  } catch (e) {
    const status = e instanceof Anthropic.APIError ? e.status : '';
    console.error('[claude-diagnose role]', status, e.message);
    return { ok: false, error: `Claude ${status || ''}: ${e.message}`.trim() };
  }
}

// Devuelve { ok, text } o { ok:false, error } si no hay key o falla.
export async function diagnoseSystem({ stats, logs } = {}) {
  const anthropic = client();
  if (!anthropic) return { ok: false, error: 'ANTHROPIC_API_KEY no configurada' };

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 400,
      thinking: { type: 'disabled' }, // diagnóstico rápido y conciso
      system: [
        { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
      ],
      messages: [
        { role: 'user', content: buildUserContent(stats, logs) },
      ],
    });

    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')
      .trim();

    return { ok: true, text: text || '*Todo en orden*. Sin datos relevantes.' };
  } catch (e) {
    // 401/permiso/clave inválida, rate limit, etc. — degradar con elegancia.
    const status = e instanceof Anthropic.APIError ? e.status : '';
    console.error('[claude-diagnose]', status, e.message);
    return { ok: false, error: `Claude ${status || ''}: ${e.message}`.trim() };
  }
}
