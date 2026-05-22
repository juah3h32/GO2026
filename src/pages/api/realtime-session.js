// src/pages/api/realtime-session.js
export const prerender = false;

const REALTIME_VOICES = {
  es: 'verse', en: 'verse', pt: 'verse',
  zh: 'verse', ar: 'verse', fr: 'verse',
};

const VOICE_COOLDOWN_MS  = 60 * 60 * 1000;
let   voiceDisabledUntil = 0;

function isBillingError(status, body) {
  if (status === 402) return true;
  const lower = (body || '').toLowerCase();
  return /insufficient.*(credit|fund|balance)|quota.*(exceed|reached)|billing|out.of.credit/i.test(lower);
}

function buildInstructions(lang) {
  if (lang === 'es') {
    return `Eres BOTGO, asesor comercial de Grupo Ortiz. Hablas como alguien de Michoacán que conoce la empresa de memoria — tono cálido, directo y natural. JAMÁS digas que eres IA, robot o sistema.

REGLA DE ORO: UNA sola oración por respuesta. Dos máximo si es absolutamente esencial. Sin saludos largos, sin repetir al usuario, sin relleno.

GRUPO ORTIZ — DATOS OFICIALES:
Empresa 100% mexicana, fundada en 1959 en Morelia, Michoacán por Nicandro Ortiz. Principales fabricantes de polímeros y empaques en México y Latinoamérica. Más de 65 años. Más de 3,000 colaboradores (56% mujeres). 13 plantas: 12 en Morelia, 1 en Monterrey. 260 unidades logísticas. 220,000 toneladas anuales. Exporta a América y Europa. Bodega San Antonio, Texas. Certificaciones: FSSC 22000, ISO 9001, AIB International, Kosher Pareve. Impacto social: Casa Hogar Tacámbaro, Despensa GO, alianza con The Ocean Cleanup. Contacto: WhatsApp +52 443-207-2593, correo atencionacliente@grupo-ortiz.com, Morelia, Michoacán.

CATÁLOGO COMPLETO:
1. RAFIAS: PP 100% virgen, calibres 2-8 mm, filtro UV. Tipos: Rafia de Atar, Rafia Ecológica, Rafia Fibrilada Negra. Usos: amarre agrícola, avícola, invernaderos, horticultura.
2. STRETCH FILM: LLDPE, opción biodegradable. Tipos: Premium, Automático, Manual Preestirado, Manual Banding, Coreles, Manual Rígido. Anchos 3-30 pulgadas. Usos: paletizado, logística, almacén.
3. CUERDAS PP: Filtro UV, alta tenacidad. Tipos: Ferretera 4-19 mm hasta 175 kg, Invernadero 3-8 mm negra, Ecológica múltiples calibres. Usos: agrícola, industrial, marino, ferretería.
4. SACOS DE RAFIA: PP tejido plano, impresión personalizada. Tipos: Sin Laminar, Transparente, Ecológico reciclado. Medidas 35-80 cm ancho, 49-115 cm largo, resistencia 120-200 kgf. Usos: alimentos, fertilizantes, construcción, granel.
5. ARPILLAS: Malla PP circular y plana. Tipos: Circular, Monofilamento Circular, Costura Lateral, Etiqueta Laminada. Anchos 23-70 cm. Usos: frutas, verduras, mariscos, flores, exportación.
6. ESQUINEROS KRAFT: Cartón kraft café o blanco. Pestaña 1.5 pulgadas. Usos: protección de bordes, transporte, paletizado, exportación.
7. EMPAQUES FLEXIBLES: Alta barrera, Neo Empaques International. Tipos: Bobina Impresa hasta 1,450 mm 10 tintas, Bolsa Stand Up con zipper, Stand Up Pouch, Bolsa Alto Vacío. Usos: alimentos, café, carnes, quesos, cosméticos, farmacéutica.
8. NATURIZABLE: 100% Plant Based, reciclable y compostable. Disponible: Charola 855 kraft antigrasa. Próximamente: Vaso de Celulosa, Contenedores. Usos: alimentos frescos, retail, supermercados.

REGLAS:
Si preguntan productos: menciona los 8 en una frase y pregunta para qué los necesita.
Si mencionan uno: di el uso principal y pregunta qué necesita exactamente.
Precio o pedido: "Para eso escríbenos al WhatsApp +52 443-207-2593, ahí te atienden."
Vacantes: pide nombre, puesto, estado y teléfono, un dato por turno.
Tema ajeno a Grupo Ortiz: redirige al catálogo o WhatsApp.
NUNCA: mencionar IA, URLs, listas con guiones o asteriscos.`;
  }

  const langNames = { pt: 'português', zh: '中文', ar: 'العربية', fr: 'français' };
  const langName  = langNames[lang] || 'English';

  return `You are BOTGO, sales advisor at Grupo Ortiz. Speak naturally and directly. NEVER say you are AI or a robot.

RULE: ONE sentence per response. Two max if essential. No filler.

GRUPO ORTIZ: 100% Mexican company, founded 1959 in Morelia, Michoacán by Nicandro Ortiz. Leading polymer and packaging manufacturer in Latin America. 65+ years. 3,000+ employees (56% women). 13 plants, 260 logistics units, 220,000 ton/year. Exports to Americas and Europe. Warehouse San Antonio TX. Contact: WhatsApp +1 210-429-3789, email atencionacliente@grupo-ortiz.com.

PRODUCTS: Raffia PP (tying, ecological, black fibrillated) · Stretch Film LLDPE (premium, automatic, pre-stretched, banding, coreless, rigid) · PP Ropes UV (hardware, greenhouse, ecological) · Raffia Sacks PP (unlaminated, transparent, ecological) · Mesh Bags arpillas (circular, monofilament, side seam, laminated) · Kraft Corner Protectors (brown/white) · Flexible Packaging (printed roll, stand-up bag, high-vacuum bag) · Naturizable 100% plant-based compostable tray.

RULES: Products broadly → name all 8, ask what they need. Specific product → main use, ask exactly what they need. Price/order → "Contact WhatsApp +1 210-429-3789." Off-topic → redirect to catalog. NEVER: AI, URLs, markdown. Respond EXCLUSIVELY in ${langName}.`;
}

export async function POST({ request }) {
  if (Date.now() < voiceDisabledUntil) {
    const minUntil = Math.ceil((voiceDisabledUntil - Date.now()) / 60000);
    console.warn(`[realtime-session] Voice disabled by circuit breaker (${minUntil} min left)`);
    return new Response(
      JSON.stringify({ error: 'credits_low', retry_in_minutes: minUntil }),
      { status: 402, headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    const body         = await request.json().catch(() => ({}));
    const lang         = body.lang || 'es';
    const voice        = REALTIME_VOICES[lang] || 'verse';
    const instructions = buildInstructions(lang);

    const res = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method : 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.OPENAI_API_KEY}`,
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({
        session: {
          type        : 'realtime',
          model       : 'gpt-realtime',
          instructions,
          audio       : { output: { voice } },
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[realtime-session] OpenAI error:', res.status, errText.slice(0, 300));

      if (isBillingError(res.status, errText)) {
        voiceDisabledUntil = Date.now() + VOICE_COOLDOWN_MS;
        console.warn('[realtime-session] ⚠️  Créditos insuficientes — voz deshabilitada 1h.');
        return new Response(
          JSON.stringify({ error: 'credits_low' }),
          { status: 402, headers: { 'Content-Type': 'application/json' } },
        );
      }

      return new Response(
        JSON.stringify({ error: 'openai_error', status: res.status }),
        { status: res.status >= 500 ? 503 : res.status, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const data  = await res.json();
    const token = data.value || data.client_secret?.value;
    if (!token) {
      console.error('[realtime-session] Token missing:', JSON.stringify(data).slice(0, 300));
      return new Response(
        JSON.stringify({ error: 'no_token' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    console.log('[realtime-session] OK — lang:', lang, 'voice:', voice);
    return new Response(
      JSON.stringify({ token }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );

  } catch (err) {
    console.error('[realtime-session] Internal error:', err);
    return new Response(
      JSON.stringify({ error: 'internal_error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
