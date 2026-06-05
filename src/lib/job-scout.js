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

Respondes SEGUN el ENFOQUE que te pidan. Por defecto (enfoque=candidatos) das donde ver CVs y a quien contactar. Si piden otro enfoque, das SOLO eso. Siempre corto.

== ENFOQUE: candidatos (default) ==
Estructura EXACTA, LIMPIA y espaciada (deja una linea en blanco entre secciones):

*Disponibilidad por fuente*
Para CADA bolsa, di cuantos perfiles/CVs o vacantes activas detectaste en tus busquedas para ese puesto y ciudad. Formato: "- LinkedIn: ~50 perfiles" / "- OCC: 12 vacantes activas" / "- Indeed: 42 resultados" / "- Computrabajo: 8". Usa SOLO numeros reales de tus busquedas; si una fuente no muestra el conteo publico, escribe "requiere login empresa". Cierra esta seccion con UNA linea de conclusion: donde hay mas oferta y donde conviene empezar a buscar.

*Candidatos contactables*
Si tus busquedas mostraron personas con contacto publico abierto, listalas (nombre + profesion + como contactar). NO inventes. Si ninguna lo tiene abierto, escribe una sola linea: "Las bolsas ocultan el contacto; usa los links de abajo, entra como empresa y contactas directo."

*Links para contactar como empresa* (uno por linea, link completo, cada uno con su beneficio breve):
- Indeed — ve CVs gratis y contacta: [link]
- OCC — publica y usa 15 contactos gratis (tel+correo): [link]
- Computrabajo — ve CVs en tu panel: [link]
- LinkedIn — busca en Personas y manda mensaje: [link]

Luego una linea en blanco y el menu:
"_Mas info, responde el numero:_
*1)* Sueldo de mercado   *2)* Requisitos
*3)* Armar la vacante   *4)* Donde publicar"

== ENFOQUE: sueldo ==
Solo el rango salarial mensual MXN de ese puesto en la ciudad, con 1-2 fuentes. Maximo 6 lineas. Sin links de bolsas. Cierra con el menu: "_Responde el numero:_ *2)* Requisitos  *3)* Armar vacante  *5)* Buscar candidatos"

== ENFOQUE: requisitos ==
Solo los 4-6 requisitos/skills mas pedidos en vacantes de ese puesto. Maximo 8 lineas. Cierra con el menu: "_Responde el numero:_ *1)* Sueldo  *3)* Armar vacante  *5)* Buscar candidatos"

== ENFOQUE: publicar ==
Solo 2-3 bolsas/grupos donde conviene publicar la vacante para atraer ese perfil, con link. Maximo 6 lineas.

== ENFOQUE: vacante ==
Arma un BORRADOR de vacante LISTO para publicar, basado en lo que pide el mercado real (busca vacantes similares). Estructura:
*Titulo del puesto*
*Descripcion:* 2-3 lineas de las funciones tipicas.
*Requisitos:* 4-6 vinetas (escolaridad, experiencia, skills) — los que mas se repiten en el mercado.
*Sueldo sugerido:* rango mensual MXN competitivo segun mercado.
*Prestaciones tipicas:* 2-3 que ofrece la competencia.
Maximo 16 lineas. El reclutador lo copia y publica.

REGLAS (obligatorias):
- NUNCA inventes nombres, telefonos, correos, perfiles ni cifras. Si la bolsa oculta el dato, da el LINK. Si no encuentras sueldo, dilo.
- Usa SOLO URLs reales de tus busquedas. Si no tienes la exacta, usa la BASE: https://resumes.indeed.com/ , https://www.occ.com.mx/empresas/ , https://mx.computrabajo.com/ , https://www.linkedin.com/jobs/
- CIERRE: termina SOLO con el menu numerado indicado para tu enfoque. PROHIBIDO cerrar con preguntas abiertas tipo "¿Te gustaria que busque candidatos?", "¿necesitas algo mas?", "¿quieres que...?". El menu es el UNICO cierre. No escribas NADA despues del menu.

Formato:
- Español. WhatsApp: negrita con UN asterisco (*asi*), nunca doble. Listas con guion (-). Links completos. Sin headers markdown. SIN EMOJIS. Sin saludos.
- Empieza con: *SCOUT RH — [puesto] · [ciudad]*`;

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

// enfoque: 'candidatos' (default) | 'sueldo' | 'requisitos' | 'publicar'
// Devuelve { ok, text } o { ok:false, error }.
// Fallback SIN IA: arma los links de busqueda en las bolsas (lo esencial del
// scout) cuando Claude no esta disponible (sin creditos). Siempre funciona.
function scoutFallback(puesto, ubicacion) {
  const q = encodeURIComponent(String(puesto).trim());
  const l = encodeURIComponent(String(ubicacion).trim());
  return {
    ok: true,
    text: `*SCOUT RH — ${puesto} · ${ubicacion}*

*Donde ver CVs y contactar* (entra con tu cuenta de empresa):
- Indeed (CVs gratis): https://resumes.indeed.com/search?q=${q}&l=${l}
- OCC (15 contactos gratis al publicar): https://www.occ.com.mx/empresas/
- Computrabajo (CVs en tu panel): https://mx.computrabajo.com/empleos/?q=${q}
- LinkedIn (busca en Personas): https://www.linkedin.com/search/results/people/?keywords=${q}

_Busqueda directa lista. (El analisis con IA esta temporalmente sin servicio.)_`,
  };
}

export async function scoutVacante(puesto, { ubicacion = 'Morelia, Michoacán', enfoque = 'candidatos' } = {}) {
  const anthropic = client();
  if (!puesto || !String(puesto).trim()) return { ok: false, error: 'Puesto requerido' };
  // Sin Claude configurado → fallback de links directos.
  if (!anthropic) return scoutFallback(puesto, ubicacion);

  const enf = ['candidatos', 'sueldo', 'requisitos', 'publicar', 'vacante'].includes(enfoque) ? enfoque : 'candidatos';

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      thinking: { type: 'disabled' },
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 6 }],
      messages: [{
        role: 'user',
        content: `Puesto: ${String(puesto).slice(0, 120)}. Ubicacion: ${String(ubicacion).slice(0, 80)}. ENFOQUE: ${enf}. Investiga ahora y responde SOLO ese enfoque.`,
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
    // Sin creditos / rate limit / error → fallback de links directos (no falla feo).
    const status = e instanceof Anthropic.APIError ? e.status : '';
    console.error('[job-scout] Claude fallo, usando fallback de links:', status, e.message);
    return scoutFallback(puesto, ubicacion);
  }
}
