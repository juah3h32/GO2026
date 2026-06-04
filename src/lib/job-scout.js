/*!
 * GO2026 — Sitio Web Oficial de Grupo Ortiz
 * Copyright (c) 2026 JUAN PABLO CORONA CORONA — Desarrollador Web.
 * Todos los derechos reservados. Licencia propietaria (ver LICENSE).
 * Prohibida su copia, modificacion o distribucion sin autorizacion escrita.
 */
// src/lib/job-scout.js
// SCOUT RH — agente Claude con busqueda web real. Investiga el mercado laboral
// para un puesto: sueldos, vacantes similares de la competencia y candidatos
// en fuentes publicas. Respuesta lista para WhatsApp.
import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-sonnet-4-6';

// System prompt estable (apto para prompt caching). Lo volatil (puesto, ciudad)
// va en el mensaje de usuario.
const SYSTEM_PROMPT = `Eres *SCOUT RH*, el agente de inteligencia de mercado laboral de Grupo Ortiz (fabricante de polimeros y empaques en Morelia, Michoacán, +3,000 colaboradores). Investigas con BUSQUEDAS WEB REALES en bolsas de trabajo: OCC Mundial, Computrabajo, Indeed México, LinkedIn Jobs y bolsas locales de Michoacán.

Para el puesto y ubicacion que te den, entrega:
1. *Sueldo de mercado:* rango mensual MXN que estan ofreciendo (cita fuentes).
2. *Vacantes similares activas:* 3-5 con empresa, sueldo si aparece y fuente (bolsa).
3. *Requisitos mas pedidos:* los 3-5 que se repiten entre vacantes.
4. *Candidatos:* si las busquedas muestran CVs o perfiles publicos disponibles, di donde encontrarlos; si no hay, dilo honestamente.
5. *Recomendacion:* 1 linea concreta para que Grupo Ortiz compita por ese talento.

Reglas OBLIGATORIAS:
- Español. Formato WhatsApp: negrita con UN asterisco (*asi*), nunca doble. Listas con guion (-). Sin headers markdown.
- CORTO: maximo ~25 lineas.
- SOLO datos reales de tus busquedas. No inventes sueldos, empresas ni cifras. Si algo no aparece, dilo en una linea.
- Empieza con: *SCOUT RH — [puesto] · [ciudad]*`;

let _client = null;
function client() {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY || import.meta.env?.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  _client = new Anthropic({ apiKey });
  return _client;
}

// Devuelve { ok, text } o { ok:false, error }.
export async function scoutVacante(puesto, { ubicacion = 'Morelia, Michoacán' } = {}) {
  const anthropic = client();
  if (!anthropic) return { ok: false, error: 'ANTHROPIC_API_KEY no configurada' };
  if (!puesto || !String(puesto).trim()) return { ok: false, error: 'Puesto requerido' };

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      thinking: { type: 'disabled' },
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 6 }],
      messages: [{
        role: 'user',
        content: `Puesto: ${String(puesto).slice(0, 120)}. Ubicacion: ${String(ubicacion).slice(0, 80)}. Investiga el mercado ahora.`,
      }],
    });

    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')
      .trim();

    if (!text) return { ok: false, error: 'Sin resultados del agente' };
    return { ok: true, text };
  } catch (e) {
    const status = e instanceof Anthropic.APIError ? e.status : '';
    console.error('[job-scout]', status, e.message);
    return { ok: false, error: `Claude ${status || ''}: ${e.message}`.trim() };
  }
}
