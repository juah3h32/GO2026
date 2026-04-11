// src/pages/api/vacantes-ia.js
// Endpoint para estructurar descripción y requisitos de una vacante con IA
export const prerender = false;

const LIMITS = { descripcion: 250, requisitos: 800 };

async function callOpenAI(apiKey, prompt, maxTokens = 400) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
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
    const apiKey = import.meta.env.OPENAI_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ ok: false, error: 'API key no configurada.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

    const { campo, texto, titulo = '', area = '' } = await request.json();

    if (!campo || !texto?.trim()) {
      return new Response(JSON.stringify({ ok: false, error: 'Faltan parámetros.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const limite = LIMITS[campo];
    if (!limite) return new Response(JSON.stringify({ ok: false, error: 'Campo no válido.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    let prompt = '';

    if (campo === 'descripcion') {
      prompt = `Eres un experto en recursos humanos mexicano. Tienes el siguiente borrador de descripción para una vacante de "${titulo}" (área: ${area}):

---
${texto}
---

Reescríbelo de forma profesional, clara y atractiva para el candidato. Usa un tono directo y positivo. IMPORTANTE:
- Máximo ${limite} caracteres en total (cuenta TODOS los caracteres incluyendo espacios)
- NO uses emojis ni asteriscos
- NO pongas títulos ni encabezados
- Solo el párrafo de descripción, sin texto adicional
- Escribe en español de México

Responde ÚNICAMENTE con el texto restructurado, sin explicaciones.`;
    } else if (campo === 'requisitos') {
      prompt = `Eres un experto en recursos humanos mexicano. Tienes los siguientes requisitos en borrador para la vacante de "${titulo}" (área: ${area}):

---
${texto}
---

Restructura esto como una lista de requisitos claros y concisos. IMPORTANTE:
- Máximo ${limite} caracteres en total (cuenta TODOS los caracteres incluyendo espacios)
- Un requisito por línea, sin viñetas ni guiones al inicio
- Ordena de más a menos importante
- NO uses emojis ni asteriscos
- Escribe en español de México

Responde ÚNICAMENTE con la lista restructurada (un item por línea), sin explicaciones.`;
    }

    const resultado = await callOpenAI(apiKey, prompt, 500);

    // Truncar si la IA se pasó del límite
    const truncado = resultado.length > limite ? resultado.slice(0, limite - 3) + '...' : resultado;

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
