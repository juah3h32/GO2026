// src/pages/api/admin/biblioteca-ia.js
// Genera una descripcion corta a partir de un fotograma del video (vision de
// OpenAI) — mismo proveedor/patron que /api/vacantes-ia, pero con imagen.
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';

export const prerender = false;

const LIMITE = 500;

const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });

async function callOpenAIVision(apiKey, prompt, imageUrl) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      temperature: 0.5,
      max_tokens: 350,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: imageUrl } },
        ],
      }],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`OpenAI ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

export async function POST({ request }) {
  try {
    const adminRole = await verifyAdminToken(request);
    if (!adminRole) return json({ ok: false, error: 'No autorizado' }, 401);

    const apiKey = import.meta.env.OPENAI_API_KEY;
    if (!apiKey) return json({ ok: false, error: 'API key no configurada.' }, 500);

    const { imageUrl, cliente = '', categoria = '', empresa = '', ubicacion = '', producto = '' } = await request.json();
    if (!imageUrl) return json({ ok: false, error: 'Falta la imagen del video.' }, 400);

    const contexto = [
      cliente && `título "${cliente}"`,
      categoria && `categoría ${categoria}`,
      producto && `PRODUCTO EXACTO: "${producto}" (usa este nombre, no adivines otro)`,
      empresa && `empresa/cliente ${empresa}`,
      ubicacion && `grabado en ${ubicacion}`,
    ].filter(Boolean).join(', ');

    const prompt = `Observa este fotograma de un video de Grupo Ortiz (fabricante de empaques industriales en México, división de plásticos: stretch film, sacos, cuerdas, rafia, arpillas). Estos videos se graban en sitio con clientes que USAN o VENDEN (distribuyen) nuestro producto.${contexto ? ` Contexto: ${contexto}.` : ''}

Esta descripción se muestra SOLO al abrir el video en grande (hay espacio de sobra), así que escribe un párrafo breve de 2 a 4 oraciones (máximo ${LIMITE} caracteres) que:
- Mencione el PRODUCTO${producto ? ` — usa exactamente "${producto}", el que viene en el contexto, NO el que creas ver en la imagen` : ' que se ve o al que se refiere el video'}.
- Si hay ubicación en el contexto, teje el lugar de forma natural (estilo "Desde ${ubicacion || '[lugar]'}, ...").
- Cuente brevemente qué pasa en el video y por qué importa (confianza del cliente, calidad, proceso, etc).
- Tono cercano, profesional, como si Grupo Ortiz contara la historia de este cliente/producto.

Ejemplo de estilo (no lo copies, solo sigue el patrón y el largo):
"Desde Colima, un cliente de confianza nos abrió las puertas de su bodega para mostrar cómo nuestro stretch film protege cada tarima antes de salir a distribución. Llevamos más de cinco años trabajando juntos, y videos como este son prueba de que la calidad se nota en cada movimiento."

Si NO hay ubicación en el contexto, omite el lugar y enfócate en el producto y el cliente. Responde SOLO con el párrafo, sin comillas ni explicaciones ni encabezados.`;

    let texto = await callOpenAIVision(apiKey, prompt, imageUrl);

    // Si se pasa del limite, cortar en el ultimo punto (oracion completa) y
    // si no hay uno razonablemente cerca, en el ultimo espacio.
    if (texto.length > LIMITE) {
      const cortado = texto.slice(0, LIMITE);
      const ultimoPunto = cortado.lastIndexOf('.');
      if (ultimoPunto > LIMITE * 0.5) {
        texto = cortado.slice(0, ultimoPunto + 1);
      } else {
        const ultimoEspacio = cortado.lastIndexOf(' ');
        texto = (ultimoEspacio > 0 ? cortado.slice(0, ultimoEspacio) : cortado).replace(/[,;]$/, '') + '.';
      }
    }

    return json({ ok: true, texto });
  } catch (err) {
    return json({ ok: false, error: err.message }, 500);
  }
}
