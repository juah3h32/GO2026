// src/pages/api/vacantes-ia.js
// Endpoint para estructurar descripción y requisitos de una vacante con IA
import { verifyAdminToken } from '../../lib/verifyAdminToken.ts';

export const prerender = false;

const LIMITS = { descripcion: 160, requisitos: 800 };

async function callOpenAI(apiKey, prompt, maxTokens = 400) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      temperature: 0.4,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

export async function POST({ request }) {
  try {
    const adminRole = await verifyAdminToken(request);
    if (!adminRole) return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

    const apiKey = import.meta.env.OPENAI_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ ok: false, error: 'API key no configurada.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

    const { campo, texto, titulo = '', area = '' } = await request.json();

    if (!campo) {
      return new Response(JSON.stringify({ ok: false, error: 'Faltan parámetros.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const limite = LIMITS[campo];
    if (!limite) return new Response(JSON.stringify({ ok: false, error: 'Campo no válido.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    // requisitos necesita título para generar desde cero
    if (campo === 'requisitos' && !texto?.trim() && !titulo?.trim()) {
      return new Response(JSON.stringify({ ok: false, error: 'Escribe el título del puesto primero.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    let prompt = '';

    if (campo === 'descripcion') {
      const esGeneracion = !texto?.trim();
      if (esGeneracion) {
        prompt = `Escribe una descripción breve para la vacante de "${titulo}" (área: ${area || 'Manufactura'}) en Grupo Ortiz, empresa de empaques industriales en México.

FORMATO OBLIGATORIO — dos oraciones completas:
Oración 1: "Buscamos un/a [puesto] [adjetivo] y [adjetivo] que [tarea principal], [tarea 2] y [tarea 3]."
Oración 2: "Se requiere [habilidad o experiencia clave]."

Ejemplo de referencia (no copies, solo sigue el estilo):
"Buscamos un creador de contenido talentoso y organizado que desarrolle contenido original, potencie nuestra marca y apoye los objetivos de marketing. Se requiere conocimiento en diseño y edición."

REGLAS CRÍTICAS:
- Máximo ${limite} caracteres en total — pero SIEMPRE termina con punto "." completo, nunca a medias
- Las dos oraciones deben estar completas y bien cerradas
- Tono directo, positivo, comenzando con "Buscamos"
- Adapta las tareas y habilidades al puesto "${titulo}" y área "${area}"
- Sin emojis, asteriscos ni encabezados
- Español de México

Responde SOLO con el texto (sin comillas ni explicaciones).`;
      } else {
        prompt = `Reescribe esta descripción para la vacante de "${titulo}" (área: ${area}):

---
${texto}
---

FORMATO OBLIGATORIO — dos oraciones completas y bien cerradas:
Oración 1: "Buscamos un/a [puesto] [adjetivo] y [adjetivo] que [tarea principal], [tarea 2] y [tarea 3]."
Oración 2: "Se requiere [habilidad o experiencia clave]."

REGLAS CRÍTICAS:
- Máximo ${limite} caracteres en total — pero SIEMPRE termina con punto "." completo
- Ambas oraciones completas, nunca cortadas a medias
- Comienza con "Buscamos", tono directo y positivo
- Conserva la esencia del texto original
- Sin emojis ni encabezados. Español de México.

Responde SOLO con el texto (sin comillas ni explicaciones).`;
      }
    } else if (campo === 'requisitos') {
      const esGeneracionReq = !texto?.trim();
      if (esGeneracionReq) {
        prompt = `Genera una lista de requisitos para la vacante de "${titulo}" (área: ${area || 'Manufactura'}) en Grupo Ortiz, empresa de empaques industriales en México.

FORMATO OBLIGATORIO — cada requisito en su PROPIA LÍNEA separada por \\n, sin viñetas ni guiones:
Educación en [campo relevante] o afines
Mínimo [X] meses/años de experiencia en [actividad específica del puesto]
Manejo de [herramienta o equipo del puesto]
Conocimiento en [habilidad técnica relevante]
Disponibilidad de horario [turno o modalidad del puesto]

REGLAS:
- EXACTAMENTE 5 requisitos, uno por línea, sin líneas en blanco entre ellos
- Sin viñetas, guiones, asteriscos ni numeración
- Adaptados específicamente al puesto "${titulo}" y área "${area}"
- Ordenados de más importante a menos importante
- Escribe en español de México

EJEMPLO de salida esperada para "Editor de Video":
Educación en Comunicación Audiovisual, Diseño Gráfico o afines
Mínimo 1 año de experiencia en edición de video profesional
Manejo de Adobe Premiere, After Effects o herramientas similares
Conocimiento en producción audiovisual y postproducción
Disponibilidad para horario de lunes a viernes

Responde ÚNICAMENTE con los 5 requisitos en líneas separadas, sin texto extra.`;
      } else {
        prompt = `Restructura estos requisitos para la vacante de "${titulo}" (área: ${area}):

---
${texto}
---

FORMATO OBLIGATORIO — cada requisito en su PROPIA LÍNEA, sin viñetas ni guiones:
Requisito 1
Requisito 2
Requisito 3
...

REGLAS:
- Un requisito por línea, sin líneas en blanco entre ellos
- Sin viñetas, guiones, asteriscos ni numeración
- Máximo ${limite} caracteres en total
- Ordena de más a menos importante
- Escribe en español de México

Responde ÚNICAMENTE con la lista en líneas separadas, sin texto extra.`;
      }
    }

    const resultado = await callOpenAI(apiKey, prompt, 500);

    // Si la IA se pasó del límite, cortar en el último punto para no romper oraciones
    let truncado = resultado;
    if (resultado.length > limite) {
      const cortado = resultado.slice(0, limite);
      // Buscar el último punto seguido de espacio o fin — para no cortar mid-sentence
      const ultimoPunto = cortado.lastIndexOf('.');
      if (ultimoPunto > limite * 0.5) {
        truncado = cortado.slice(0, ultimoPunto + 1);
      } else {
        // Fallback: cortar en el último espacio
        const ultimoEspacio = cortado.lastIndexOf(' ');
        truncado = ultimoEspacio > 0
          ? cortado.slice(0, ultimoEspacio).replace(/[,;]$/, '') + '.'
          : cortado;
      }
    }

    return new Response(JSON.stringify({ ok: true, texto: truncado, chars: truncado.length, limite }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
