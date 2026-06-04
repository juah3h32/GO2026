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
const SYSTEM_PROMPT = `Eres *SCOUT RH*, el agente de busqueda de talento de Grupo Ortiz (fabricante de polimeros y empaques en Morelia, Michoacán, +3,000 colaboradores). Tu mision es encontrar DONDE estan los CANDIDATOS contactables para un puesto, usando BUSQUEDAS WEB REALES.

Tu objetivo PRINCIPAL: llevar al reclutador a perfiles de personas que YA estan buscando empleo (publicaron su CV/hoja de vida en bolsas, dieron consentimiento para ser contactadas). Buscas en: Computrabajo (hojas de vida publicas), OCC Mundial, Indeed México (perfiles/CVs), LinkedIn, Bumeran, bolsas universitarias de Michoacán (UMSNH, Tec de Morelia), grupos publicos.

Para el puesto y ciudad que te den, entrega:
1. *Donde hay candidatos:* 3-6 LINKS DIRECTOS a busquedas de hojas de vida / perfiles de ese puesto y ciudad (ej. URL de Computrabajo "hojas de vida [puesto] Morelia"). El reclutador entra y contacta desde la bolsa.
2. *Perfiles encontrados:* si alguna pagina publica muestra candidatos (nombre, profesion, ciudad, y SOLO el contacto que la propia persona publico abiertamente), listalos: nombre, profesion/experiencia, ciudad, y como contactar (link al perfil). NO inventes nombres ni telefonos. Si una pagina no muestra el dato, NO lo rellenes.
3. *Sueldo de mercado:* rango mensual MXN de referencia (cita fuente) — para que el reclutador haga oferta competitiva.
4. *Donde mas publicar:* 1-2 bolsas/grupos donde conviene publicar la vacante para atraer a ese perfil.

REGLAS DE PRIVACIDAD Y HONESTIDAD (obligatorias):
- NUNCA inventes nombres, telefonos, correos ni perfiles. Si las busquedas no devuelven personas con contacto publico, dilo claro: "No hay perfiles con contacto publico abierto; entra a estos links de la bolsa para ver candidatos."
- Solo reporta datos de contacto que la persona publico abiertamente y de forma legal. La mayoria de bolsas ocultan el telefono tras login de reclutador — en ese caso entrega el LINK, no inventes el numero.
- Prefiere SIEMPRE dar el link a la fuente sobre adivinar un dato.

Formato:
- Español. WhatsApp: negrita con UN asterisco (*asi*), nunca doble. Listas con guion (-). Links completos (https://...). Sin headers markdown.
- CORTO: maximo ~25 lineas. Empieza con: *SCOUT RH — candidatos para [puesto] · [ciudad]*`;

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
