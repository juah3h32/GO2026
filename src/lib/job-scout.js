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

Tu objetivo PRINCIPAL: llevar al reclutador a donde PUEDE VER CVs GRATIS y contactar candidatos que YA estan buscando empleo (publicaron su CV y dieron consentimiento para ser contactados).

PRIORIDAD DE FUENTES (en este orden, porque define cuanto puede VER GRATIS el reclutador):
1. *INDEED para empresas* — busqueda de CVs GRATIS, ilimitada, sin contrato. Es la mejor: aqui SI ve los CVs sin pagar. Da el link a la busqueda de CVs/perfiles del puesto y ciudad (resumes.indeed.com o mx.indeed.com seccion empresas).
2. *OCC Mundial* — al publicar vacante incluye 15 creditos "Datos de contacto" GRATIS para ver telefono+correo en la seccion Talento. Menciona ese beneficio.
3. *Computrabajo* — publicar gratis, ve CVs en su panel.
4. Complementos: LinkedIn (buscar en People), bolsas universitarias de Michoacán (UMSNH, Tec de Morelia).

Entrega SOLO lo accionable: donde ver CVs y a quien contactar. NADA mas. NO incluyas analisis de mercado, sueldos, estadisticas, contexto economico ni recomendaciones largas.

Estructura EXACTA (no agregues secciones):
1. *Perfiles* — si tus busquedas mostraron candidatos con contacto publico abierto, listalos: nombre, profesion en 1 linea, como contactar. NO inventes nombres ni telefonos. Si ninguno tiene contacto abierto, escribe solo: "Sin perfiles con contacto abierto; entra a los links."
2. *Donde ver CVs y contactar* — 3-4 links. Cada uno con una nota BREVE (5-8 palabras) de como entrar con SU cuenta de empresa para ver el CV y contactar directo:
- Indeed (inicia sesion empresa, ve CVs gratis): [link]
- OCC (entra a tu cuenta, 15 contactos gratis al publicar): [link]
- Computrabajo (login empresa, ve CVs en tu panel): [link]
- LinkedIn (entra y busca en People): [link]

REGLAS (obligatorias):
- NUNCA inventes nombres, telefonos, correos ni perfiles. Si la bolsa oculta el dato, da el LINK, no adivines.
- Usa SOLO URLs reales de tus busquedas. Si no tienes la exacta, usa la BASE: https://resumes.indeed.com/ , https://www.occ.com.mx/empresas/ , https://mx.computrabajo.com/ , https://www.linkedin.com/jobs/

Formato:
- Español. WhatsApp: negrita con UN asterisco (*asi*), nunca doble. Listas con guion (-). Links completos. Sin headers markdown. SIN EMOJIS.
- MUY CORTO: maximo 12 lineas. Sin saludos ni cierres. Empieza con: *SCOUT RH — [puesto] · [ciudad]*`;

let _client = null;
function client() {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY || import.meta.env?.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  _client = new Anthropic({ apiKey });
  return _client;
}

// ── Verificacion de links: ningun 404 llega al reclutador ─────────────────────
const BROWSER_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

// URL base que SIEMPRE funciona, por dominio — para reemplazar links rotos.
function fallbackBase(url) {
  try {
    const h = new URL(url).hostname;
    if (h.includes('resumes.indeed')) return 'https://resumes.indeed.com/';
    if (h.includes('indeed'))         return 'https://mx.indeed.com/reclutamiento';
    if (h.includes('occ'))            return 'https://www.occ.com.mx/empresas/';
    if (h.includes('computrabajo'))   return 'https://empresa.computrabajo.com.mx/';
    if (h.includes('linkedin'))       return 'https://www.linkedin.com/jobs/';
    return `https://${h}/`;
  } catch { return null; }
}

// Devuelve true si la URL responde sin 404/410. 403/429/timeout = se asume OK
// (esos sitios bloquean bots pero el link funciona en navegador).
async function urlVive(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': BROWSER_UA } });
    clearTimeout(t);
    return !(r.status === 404 || r.status === 410);
  } catch {
    clearTimeout(t);
    return true; // timeout/red: no marcar como roto (probable bloqueo de bot)
  }
}

// Extrae URLs del reporte, verifica en paralelo y reemplaza las rotas por la
// base del mismo sitio. Devuelve { texto, rotos }.
async function verificarLinks(texto) {
  const urls = [...new Set((texto.match(/https?:\/\/[^\s)\]]+/g) || []).map(u => u.replace(/[.,;]+$/, '')))].slice(0, 12);
  if (!urls.length) return { texto, rotos: 0 };
  const estados = await Promise.all(urls.map(async u => ({ u, vive: await urlVive(u) })));
  let out = texto, rotos = 0;
  for (const { u, vive } of estados) {
    if (vive) continue;
    const base = fallbackBase(u);
    if (base) { out = out.split(u).join(base); rotos++; }
  }
  return { texto: out, rotos };
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

    // Verificar que ningun link este roto (404) antes de enviarlo al reclutador.
    const { texto } = await verificarLinks(text);
    return { ok: true, text: texto };
  } catch (e) {
    const status = e instanceof Anthropic.APIError ? e.status : '';
    console.error('[job-scout]', status, e.message);
    return { ok: false, error: `Claude ${status || ''}: ${e.message}`.trim() };
  }
}
