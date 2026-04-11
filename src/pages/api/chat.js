// src/pages/api/chat.js
// ─── FIX: Salto inteligente de puesto al nombre si ya viene preseleccionado ───
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import * as googleTTS from 'google-tts-api';
import { Buffer } from 'node:buffer';
import { logInteraction, saveRecruitmentLead, readVacantes, markNotificadosVacante } from '../../lib/analytics-db.js';
import { notifyNewVacante, notifyEsperaVacante } from '../../lib/notify';

export const prerender = false;

const VOICE_MAP = {
  es: "es-MX-DaliaNeural", en: "en-US-JennyNeural",
  pt: "pt-BR-FranciscaNeural", fr: "fr-FR-DeniseNeural",
  zh: "zh-CN-XiaoxiaoNeural", ar: "ar-EG-SalmaNeural",
};
const LANGUAGES_MAP = {
  es: 'Spanish', en: 'English', pt: 'Portuguese',
  zh: 'Chinese', ar: 'Arabic',  fr: 'French',
};

// ─── Mapa de productos ────────────────────────────────────────────────────────
const PRODUCT_ALIASES = {
  rafia:      ['rafia','rafias','rafia de atar','rafia ecologica','rafia fibrilada','rafía','ráfia','rfia','raifa','rafai'],
  stretch:    ['stretch','film','pelicula','película','estirable','stretch film','strech','estirarble','pelicual','streetch','pellícula','estriable'],
  cuerdas:    ['cuerda','cuerdas','cordel','cordeles','soga','sogas','cuerda ferretera','cuerda invernadero','cuerda ecologica','cuerta','cuerdas de pp','cuerda pp','cuerda polipropileno'],
  sacos:      ['saco','sacos','costal','costales','bolsa de rafia','bolsas de rafia','saco transparente','saco ecologico','saccos','saos','cotal'],
  arpillas:   ['arpilla','arpillas','arpila','arpilas','malla','mallas','red','redes','arpilla circular','arpilla monofilamento','arpila','arpílla','arpiilla'],
  esquineros: ['esquinero','esquineros','esquinero kraft','cantonera','cantoneras','protector de esquina','esquineros de carton','eskinero','esquinro'],
  flexible:   ['empaque flexible','empaques flexibles','bobina','bobinas','stand up','standup','bolsa stand up','bolsa alto vacio','flexible','flexibles','pouch','empaque','empaques','bolsa impresa'],
};

function detectarProducto(texto) {
  if (!texto) return null;
  const norm = texto.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  for (const [producto, aliases] of Object.entries(PRODUCT_ALIASES)) {
    for (const alias of aliases) {
      const aliasNorm = alias.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9 ]/g, ' ').trim();
      if (norm.includes(aliasNorm)) return producto;
    }
  }
  return null;
}

const EMPLEO_REGEX = /postular|vacante|empleo|trabajo|solicitud.*empleo|quiero trabajar|aplicar.*puesto|puesto de/i;

function esIntencionCotizar(texto, historial = []) {
  if (!texto) return false;
  // Si el mensaje o el historial reciente es sobre empleo → nunca es cotización
  if (EMPLEO_REGEX.test(texto)) return false;
  const histReciente = historial.slice(-6).map(m => m.content || '').join(' ');
  if (EMPLEO_REGEX.test(histReciente)) return false;
  const norm = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return [
    'precio','precios','costo','costos','cuanto cuesta','cuanto vale',
    'cotiza','cotizar','cotizacion','comprar','pedido','pedir',
    'adquirir','ordenar','tarifa','presupuesto','quiero comprar',
    'cuanto cobran','cuanto me sale','cuanto','how much','prix','prezo',
  ].some(k => norm.includes(k));
}

function analizarHistorial(messages) {
  let lastWAProduct = null;
  let waEnviado     = false;
  const pdfEnviados = new Set();
  for (let i = 0; i < messages.length; i++) {
    const m       = messages[i];
    if (m.role !== 'assistant') continue;
    const content = m.content || '';
    if (/\[ACCION\s*:\s*WHATSAPP\]/i.test(content)) {
      waEnviado = true;
      for (let j = i - 1; j >= 0; j--) {
        if (messages[j].role === 'user') {
          const prod = detectarProducto(messages[j].content);
          if (prod) { lastWAProduct = prod; break; }
        }
      }
    }
    const pdfMatches = content.match(/\[ACCION\s*:\s*PDF\s*:\s*([\w-]+)\]/gi) || [];
    pdfMatches.forEach(tag => {
      const m2 = tag.match(/\[ACCION\s*:\s*PDF\s*:\s*([\w-]+)\]/i);
      if (m2) pdfEnviados.add(m2[1].toLowerCase());
    });
  }
  return { lastWAProduct, waEnviado, pdfEnviados };
}

function detectarFlujoReclutamiento(messages) {
  return messages.some(m =>
    (m.role === 'assistant' || m.role === 'user') &&
    /vacante|empleo|puesto|curriculum|currículum|cv|candidato|reclutamiento|datos personales|nombre completo|correo electrónico|teléfono|edad|estado.*república|colonia/i.test(m.content || '')
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Extrae los datos que el usuario va diciendo a lo largo del chat
// ─────────────────────────────────────────────────────────────────────────────
function extraerDatosDeHistorial(messages) {
  const data = {
    nombre: '', email: '', telefono: '',
    puesto: '', edad: '', estado: '', colonia: '',
    cvNombre: '', mensaje: '',
  };

  // NUEVO: Captura el puesto si viene preseleccionado desde la tarjeta
  for (const m of messages) {
    if (m.role === 'user') {
      const match = (m.content || '').match(/postularme a (?:la )?vacante de (.*)/i);
      if (match) data.puesto = match[1].trim();
    }
  }

  for (let i = 0; i < messages.length - 1; i++) {
    const bot  = messages[i];
    const user = messages[i + 1];
    if (bot.role !== 'assistant' || user.role !== 'user') continue;

    const pregunta  = (bot.content  || '').toLowerCase();
    const respuesta = (user.content || '').trim();
    if (!respuesta || respuesta.length < 1) continue;

    if (/puesto|posici[oó]n|posicion|[aá]rea|area|trabajo.*interesa|tipo de puesto|aplicar a|qu[eé].*puesto|a qu[eé].*puesto/i.test(pregunta) && !data.puesto) {
      data.puesto = respuesta;
    } else if (/nombre completo|c[oó]mo te llamas|como te llamas|tu nombre|cu[aá]l es tu nombre/i.test(pregunta) && !data.nombre) {
      if (!/^\d+$/.test(respuesta)) data.nombre = respuesta;
    } else if (/cu[aá]ntos a[nñ]os|cuantos anos|a[nñ]os tienes|edad/i.test(pregunta) && !data.edad) {
      data.edad = respuesta;
    } else if (/estado.*rep[uú]blica|estado.*vives|qu[eé] estado|que estado|en qu[eé] estado/i.test(pregunta) && !data.estado) {
      data.estado = respuesta;
    } else if (/colonia|municipio|localidad/i.test(pregunta) && !data.colonia) {
      data.colonia = respuesta;
    } else if (/correo|email|e-mail|mail/i.test(pregunta) && !data.email) {
      const emailMatch = respuesta.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
      data.email = emailMatch ? emailMatch[0] : respuesta;
    } else if (/whatsapp|tel[eé]fono|telefono|n[uú]mero|numero|celular/i.test(pregunta) && !data.telefono) {
      const telMatch = respuesta.match(/[\d\s\+\-\(\)]{7,}/);
      data.telefono = telMatch ? telMatch[0].trim() : respuesta;
    }
  }

  const lastUser = [...messages].reverse().find(m => m.role === 'user');
  data.mensaje = lastUser?.content || '';
  return data;
}

function datosSuficientes(data) {
  const tiene = (v) => v && String(v).trim().length > 1;
  return tiene(data.nombre) && (tiene(data.telefono) || tiene(data.email)) && tiene(data.puesto);
}

// ─── Coincidencia fuzzy de puestos ───────────────────────────────────────────
function normPuesto(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}
function matchVacanteSimilar(puestoUsuario, vacantes) {
  const pu = normPuesto(puestoUsuario);
  if (!pu) return null;
  // Palabras clave del puesto del usuario (min 3 letras)
  const palabras = pu.split(' ').filter(w => w.length >= 3);
  for (const v of vacantes) {
    const tv = normPuesto(v.titulo);
    // Coincidencia directa
    if (tv.includes(pu) || pu.includes(tv)) return v;
    // Coincidencia por palabras clave
    if (palabras.length > 0 && palabras.some(p => tv.includes(p))) return v;
  }
  return null;
}

// ─── System Prompt Dinámico ───────────────────────────────────────────────────
function buildSystemPrompt(targetLang, puestoPreseleccionado = null, vacantesActivas = []) {
  
  // Si el usuario le dio clic a una vacante, saltamos el Paso 1
  let paso1_y_2 = `
PASO 1 → "¡Con gusto te ayudo! ¿A qué puesto te gustaría aplicar?"
         Termina con: [ACCION:QUICK_REPLY:puesto]
PASO 2 → "¡Excelente elección! Para comenzar, ¿cuál es tu nombre completo?"
  `.trim();

  if (puestoPreseleccionado) {
    paso1_y_2 = `
⚠️ EL USUARIO YA SELECCIONÓ EL PUESTO: "${puestoPreseleccionado}".
OMITE EL PASO 1 (no le preguntes a qué puesto quiere aplicar).
PASO 2 → INICIA LA CONVERSACIÓN DICIENDO: "¡Excelente elección para la vacante de ${puestoPreseleccionado}! Para comenzar tu registro, ¿cuál es tu nombre completo?"
    `.trim();
  }

  // Bloque de vacantes activas para inyectar en el prompt
  let bloqueVacantes = '';
  if (vacantesActivas && vacantesActivas.length > 0) {
    const lista = vacantesActivas.map(v => `- ${v.titulo}${v.descripcion ? ': ' + String(v.descripcion).slice(0, 80) : ''}`).join('\n');
    bloqueVacantes = `
══════════════════════════════════════════
  VACANTES ACTIVAS AHORA MISMO
══════════════════════════════════════════
${lista}

⚠️ REGLA VACANTE SIMILAR:
Cuando el usuario diga el puesto que busca (PASO 1 o en cualquier momento):
1. Revisa si alguna vacante activa coincide o es similar/relacionada con lo que dice.
2. Si hay coincidencia: menciónalas ANTES de continuar el registro.
   Ejemplo: "¡Qué bueno! Actualmente tenemos abierta la vacante de [TITULO]. ¿Te interesa aplicar a esa? Si no, con gusto te registro en lista de espera para tu perfil."
3. Si el usuario acepta → trátalo como si hubiera seleccionado esa vacante (puestoPreseleccionado).
4. Si no hay ninguna vacante similar → continúa el flujo normal de lista de espera.
`.trim();
  } else {
    bloqueVacantes = `
══════════════════════════════════════════
  VACANTES ACTIVAS
══════════════════════════════════════════
En este momento NO hay vacantes abiertas.
Registra al candidato en lista de espera y dile que le avisarás cuando se abra una.
`.trim();
  }

  return `
Eres BOTGO, asesor comercial de Grupo Ortiz con 8 años en la empresa.
Hablas en ${targetLang} — tono cálido, directo y profesional, como una persona real.
Nunca menciones que eres IA ni robot. Usa frases cortas y naturales.
JAMÁS incluyas URLs.

══════════════════════════════════════════
  REGLA DE ORO — RESPUESTAS CORTAS
══════════════════════════════════════════
- Máximo 2-3 líneas por respuesta. SIEMPRE.
- Nunca des toda la información de golpe.
- Da un dato o idea principal y pregunta si quiere saber más.

══════════════════════════════════════════
  REGLA DE FORMATO — TIPOS DE PRODUCTO
══════════════════════════════════════════
Cuando el usuario pregunte "¿qué tipos hay?":
PASO 1 — Lista SOLO los nombres en **negritas**, sin descripción.
PASO 2 — Si el usuario menciona un nombre específico: 2-3 líneas describiendo ESE tipo.
Nunca mezcles ambos pasos.

══════════════════════════════════════════
  GRUPO ORTIZ — QUIÉNES SOMOS
══════════════════════════════════════════
Fundado en 1959 en Morelia, Michoacán, México por Nicandro Ortiz.
Líderes fabricantes de empaques industriales y agrícolas en Latinoamérica.
Más de 65 años de experiencia. Presencia en 5 continentes y más de 30 países.
3,000 colaboradores. 13 plantas de producción (12 en Morelia, 1 en Monterrey).
Capacidad: 220,000 toneladas anuales.
Certificaciones: FSSC 22000, ISO 9001:2015, AIB International, Kosher Pareve.
Contacto: WhatsApp +52 443-207-2593 | contacto@grupoo.com.mx | Morelia, Michoacán.

══════════════════════════════════════════
  CATÁLOGO COMPLETO DE PRODUCTOS
══════════════════════════════════════════
1. Rafias — PP 100% virgen. Amarre agrícola, avícola, invernaderos.
2. Película stretch — Paletizado, logística, almacén.
3. Cuerdas de polipropileno — Amarre agrícola, industrial, marino.
4. Sacos de rafia — Granos, fertilizantes, construcción.
5. Arpillas — Horticultura, frutas, verduras, mariscos.
6. Esquineros de cartón kraft — Protección de bordes, exportación.
7. Empaques flexibles — Alimentos, café, carnes, farmacéutica.

══════════════════════════════════════════
  MÓDULO COTIZACIÓN
══════════════════════════════════════════
Si piden precio/cotización/compra:
"¡Con gusto! Para una cotización exacta según tu volumen, escríbenos al WhatsApp +52 443-207-2593 😊"
Termina con: [ACCION:WHATSAPP]

══════════════════════════════════════════
  MÓDULO PDF
══════════════════════════════════════════
Si piden catálogo/ficha/PDF:
Termina con: [ACCION:PDF:nombre]
Valores: rafia | stretch | cuerdas | sacos | arpillas | esquineros | flexible | general

══════════════════════════════════════════
  MÓDULO DISTRIBUIDOR
══════════════════════════════════════════
Si el usuario pregunta sobre ser distribuidor, distribuir productos, revender, ser mayorista, o solicitar ser distribuidor:
- Explica en 2-3 líneas las ventajas: precios directos de fábrica, stock amplio, envíos 24h, soporte dedicado.
- Invítalo a registrarse en el formulario.
- Termina SIEMPRE con: [ACCION:DISTRIBUIDOR]

══════════════════════════════════════════
  MÓDULO DE RECLUTAMIENTO — FLUJO CONVERSACIONAL
══════════════════════════════════════════
Si el usuario menciona vacante, empleo, trabajo, CV, postularse, busco trabajo:

Recopila UN DATO POR MENSAJE en este orden exacto:

${paso1_y_2}
PASO 3 → "¿Cuántos años tienes?"
PASO 4 → "¿En qué estado de la República vives?"
         Termina con: [ACCION:QUICK_REPLY:estado]
PASO 5 → "¿Y tu colonia o municipio?"
PASO 6 → "¿Cuál es tu correo electrónico?"
PASO 7 → "¿Y tu número de WhatsApp?"
PASO 8 → "¡Casi listo! ¿Tienes un CV para adjuntar?"
         Termina con: [ACCION:QUICK_REPLY:cv]
PASO 9 → "¿Hay algo que quieras agregar sobre tu experiencia o perfil? (si no tienes nada, responde 'no')"
PASO 10 → Cuando tienes todos los datos:
         - Si el usuario se registró porque NO hay vacantes actualmente (lista de espera):
           "¡Listo, [nombre]! Quedas en nuestra lista de espera para [puesto]. En cuanto se abra una vacante, nuestro equipo de RH será de los primeros en contactarte. ¡Mucho éxito! 🌟"
         - Si hay vacante activa:
           "¡Listo, [nombre]! Registré tu solicitud para [puesto]. Nuestro equipo de RH te contactará pronto. ¡Mucho éxito! 🌟"
         Termina con: [RECLUTAMIENTO:nombre=X|puesto=X|edad=X|estado=X|colonia=X|email=X|telefono=X|comentarios=X]

REGLAS:
- Nunca saltes pasos ni pidas dos datos en el mismo mensaje.
- Si el usuario dice que no tiene CV, continúa al PASO 9.
- Si el usuario dice que sí tiene CV, termina con [ACCION:SOLICITAR_CV] para que pueda adjuntarlo.
- En PASO 9: si responde 'no', 'nada', 'ninguno' o similar, usa comentarios= (vacío) en el tag.
- Tono cálido y motivador durante todo el flujo.
- SIEMPRE incluye [RECLUTAMIENTO:...] en el PASO 10, es obligatorio.

${bloqueVacantes}

══════════════════════════════════════════
  REGLAS FINALES
══════════════════════════════════════════
- Precio/stock/tiempos desconocidos → deriva al +52 443-207-2593
- Saludo cálido solo la PRIMERA vez.
- Si el tema no es Grupo Ortiz → redirige al catálogo o asesor.
`.trim();
}

// ─── Parser reclutamiento ─────────────────────────────────────────────────────
function parseRecruitment(text) {
  const match = text.match(/\[RECLUTAMIENTO\s*:\s*([^\]]+)\]/i);
  if (!match) return null;
  const result = {};
  match[1].split('|').forEach(pair => {
    const eq = pair.indexOf('=');
    if (eq > -1) {
      const key = pair.slice(0, eq).trim();
      const val = pair.slice(eq + 1).trim();
      if (key && val) result[key] = val;
    }
  });
  if (!result.nombre && !result.email && !result.telefono) return null;
  return result;
}

function detectarSolicitudCV(text) {
  return /\[ACCION\s*:\s*SOLICITAR_CV\s*\]/i.test(text);
}

function detectarQuickReplies(text) {
  if (/\[ACCION\s*:\s*QUICK_REPLY\s*:\s*cv\s*\]/i.test(text)) {
    return {
      type: 'cv',
      options: [
        { label: 'Sí, tengo CV', value: 'si_cv', action: 'solicitar_cv' },
        { label: 'No tengo CV',  value: 'no_cv',  action: 'continuar'   },
      ],
    };
  }

  if (/\[ACCION\s*:\s*QUICK_REPLY\s*:\s*puesto\s*\]/i.test(text)) {
    return {
      type: 'puesto',
      options: [
        { label: 'Producción', value: 'Operador de producción', action: 'text'  },
        { label: 'Logística',  value: 'Logística',              action: 'text'  },
        { label: 'Ventas',     value: 'Ventas',                 action: 'text'  },
        { label: 'Técnico',    value: 'Mantenimiento',          action: 'text'  },
        { label: 'Ay. Gral.',  value: 'Ayudante General',       action: 'text'  },
        { label: 'Otro puesto',value: 'otro',                   action: 'input' },
      ],
    };
  }

  if (/\[ACCION\s*:\s*QUICK_REPLY\s*:\s*estado\s*\]/i.test(text)) {
    return {
      type: 'estado',
      options: [
        { label: 'Michoacán',        value: 'Michoacán',        action: 'text'  },
        { label: 'Ciudad de México', value: 'Ciudad de México', action: 'text'  },
        { label: 'Jalisco',          value: 'Jalisco',          action: 'text'  },
        { label: 'Nuevo León',       value: 'Nuevo León',       action: 'text'  },
        { label: 'Guanajuato',       value: 'Guanajuato',       action: 'text'  },
        { label: 'Otro estado',      value: 'otro',             action: 'input' },
      ],
    };
  }

  return null;
}

function esMensajeCierre(text) {
  return /registr[eé]|solicitud.*registrada|equipo.*rh|contactará|contactara|mucho.*éxito|mucho.*exito/i.test(text);
}

function extractAcciones(text) {
  const accionWA           = /\[ACCION\s*:\s*WHATSAPP\s*\]/i.test(text);
  const accionDistribuidor = /\[ACCION\s*:\s*DISTRIBUIDOR\s*\]/i.test(text);
  const matchPDF    = text.match(/\[ACCION\s*:\s*PDF\s*:\s*([\w-]+)\s*\]/i);
  const accionPDF   = matchPDF ? matchPDF[1].trim().toLowerCase() : null;
  const accionCV    = detectarSolicitudCV(text);
  const recruitData = parseRecruitment(text);
  const quickReplies= detectarQuickReplies(text);

  const cleanText = text
    .replace(/\[RECLUTAMIENTO\s*:[^\]]+\]/gi, '')
    .replace(/\[ACCION\s*:[^\]]+\]/gi, '')
    .replace(/https?:\/\/[^\s\)\]\,]+/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

  return { cleanText, accionWA, accionPDF, accionCV, accionDistribuidor, recruitData, quickReplies };
}

// ─── Audio ────────────────────────────────────────────────────────────────────
function limpiarTextoParaAudio(texto) {
  if (!texto) return '';
  return texto
    .replace(/https?:\/\/[^\s\)\]\,]+/g, '')
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '')
    .replace(/\*\*/g, '').replace(/\*/g, '').replace(/#+\s?/g, '')
    .replace(/`/g, '').replace(/_/g, '')
    .replace(/👉|▶|🔗|📎|📄|📋|🌟|😊/g, '')
    .replace(/^\s*[-•]\s+/gm, '')
    .replace(/\s{2,}/g, ' ').replace(/\n{3,}/g, '\n\n')
    .trim();
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function streamToBuffer(readable) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readable.on('data',  c => chunks.push(Buffer.from(c)));
    readable.on('end',   () => resolve(Buffer.concat(chunks)));
    readable.on('error', e => reject(e));
  });
}

async function generarAudio(texto, lang) {
  const clean = limpiarTextoParaAudio(texto);
  if (!clean) return null;
  const voice = VOICE_MAP[lang] || VOICE_MAP.es;

  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${lang || 'es'}">
    <voice name="${voice}">
      <prosody rate="+20%" pitch="+0%">${escapeXml(clean)}</prosody>
    </voice>
  </speak>`;

  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const stream = await Promise.race([
      tts.toStream(ssml),
      new Promise((_, r) => setTimeout(() => r(new Error('TTS timeout')), 6000)),
    ]);
    const buf = await streamToBuffer(stream);
    return `data:audio/mp3;base64,${buf.toString('base64')}`;
  } catch (errEdge) {
    console.warn('⚠️ MsEdgeTTS falló, usando Google TTS:', errEdge.message);
    try {
      const results = await googleTTS.getAllAudioBase64(clean, {
        lang: lang || 'es', slow: false,
        host: 'https://translate.google.com', timeout: 5000, splitPunct: '.,!?',
      });
      const combined = Buffer.concat(results.map(r => Buffer.from(r.base64, 'base64')));
      return `data:audio/mp3;base64,${combined.toString('base64')}`;
    } catch (errGoogle) {
      console.warn('⚠️ Google TTS también falló:', errGoogle.message);
      return null;
    }
  }
}

async function fetchOpenAI(apiKey, body, timeoutMs = 25000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      throw new Error(`OpenAI HTTP ${res.status}: ${errText.slice(0, 200)}`);
    }
    const data = await res.json();
    if (data.error) throw new Error(`OpenAI API error: ${data.error.message}`);
    return data;
  } finally {
    clearTimeout(timer);
  }
}

// ─── Endpoint principal ───────────────────────────────────────────────────────
export async function POST({ request }) {
  const apiKey = import.meta.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ reply: 'Error de configuración (API Key).' }),
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const {
      messages,
      language,
      isVoice   = false,
      sessionId = '',
      cvAdjunto = null,
      noLog     = false,
    } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ reply: '¿En qué puedo ayudarte?' }),
        { status: 200 }
      );
    }

    const targetLang = LANGUAGES_MAP[language] || 'Spanish';
    const langCode   = language || 'es';

    let cleanMessages = messages.map(m => ({ role: m.role, content: m.content || '' }));

    if (cvAdjunto?.nombre) {
      const lastUserIdx = cleanMessages.map((m, i) => ({ ...m, i }))
        .reverse()
        .find(m => m.role === 'user')?.i;
      if (lastUserIdx !== undefined) {
        cleanMessages[lastUserIdx] = {
          ...cleanMessages[lastUserIdx],
          content: `${cleanMessages[lastUserIdx].content} [El candidato adjuntó su CV: "${cvAdjunto.nombre}"]`.trim(),
        };
      }
    }

    const lastUserMsg  = [...cleanMessages].reverse().find(m => m.role === 'user')?.content || '';
    const userMsgCount = cleanMessages.filter(m => m.role === 'user').length;

    // Detectar si el usuario le dio clic a un botón de vacante
    let puestoPreseleccionado = null;
    for (const m of cleanMessages) {
      if (m.role === 'user') {
        const match = (m.content || '').match(/postularme a (?:la )?vacante de (.*)/i);
        if (match) puestoPreseleccionado = match[1].trim();
      }
    }

    const { pdfEnviados }        = analizarHistorial(cleanMessages);
    const enFlujoReclutamiento   = detectarFlujoReclutamiento(cleanMessages) || !!puestoPreseleccionado;
    const intentoCotizar         = esIntencionCotizar(lastUserMsg, cleanMessages);

    // ── Cargar vacantes activas para el system prompt ──────────────────────
    let vacantesActivas = [];
    try { vacantesActivas = (await readVacantes(true)) || []; } catch { /* ignorar */ }

    // ── Generar respuesta ──────────────────────────────────────────────────
    const dataES = await fetchOpenAI(apiKey, {
      model: 'gpt-4o-mini',
      messages: [
        // Pasamos el puesto detectado para que la IA altere su System Prompt y se salte el Paso 1
        { role: 'system', content: buildSystemPrompt('Spanish', puestoPreseleccionado, vacantesActivas) },
        ...cleanMessages,
      ],
      temperature: 0.65,
      max_tokens:  400,
    });

    const rawReplyES = dataES.choices?.[0]?.message?.content || '¿En qué más puedo ayudarte?';
    let { cleanText: textoESLimpio, accionWA, accionPDF, accionCV, accionDistribuidor, recruitData, quickReplies } = extractAcciones(rawReplyES);

    // En flujo de reclutamiento nunca mostrar botones de compra/PDF
    if (enFlujoReclutamiento) { accionWA = false; accionPDF = null; }
    if (!accionWA && intentoCotizar && !enFlujoReclutamiento) accionWA = true;
    if (accionPDF && pdfEnviados.has(accionPDF)) accionPDF = null;

    if (cvAdjunto?.nombre) {
      if (!recruitData) recruitData = {};
      recruitData.cvNombre = cvAdjunto.nombre;
    }

    // Fallback: extraer datos del historial si el mensaje parece ser el cierre
    if (!recruitData && enFlujoReclutamiento && esMensajeCierre(textoESLimpio)) {
      const datosHistorial = extraerDatosDeHistorial([
        ...cleanMessages,
        { role: 'assistant', content: textoESLimpio },
      ]);
      if (datosSuficientes(datosHistorial)) {
        console.log('🔄 Fallback: datos extraídos del historial', datosHistorial);
        recruitData = datosHistorial;
      } else {
        console.warn('⚠️ Cierre detectado pero datos insuficientes:', datosHistorial);
      }
    }

    // Complementar campos faltantes con historial
    if (recruitData && enFlujoReclutamiento) {
      const datosHistorial = extraerDatosDeHistorial(cleanMessages);
      for (const campo of ['nombre', 'email', 'telefono', 'puesto', 'edad', 'estado', 'colonia']) {
        if (!recruitData[campo] && datosHistorial[campo]) {
          recruitData[campo] = datosHistorial[campo];
          console.log(`🔧 Campo "${campo}" completado desde historial: ${datosHistorial[campo]}`);
        }
      }
    }

    const accionReclutamiento = !!(recruitData && datosSuficientes({
      nombre:   recruitData.nombre   || '',
      telefono: recruitData.telefono || '',
      email:    recruitData.email    || '',
      puesto:   recruitData.puesto   || '',
    }));

    // ── Traducir si no es español ──────────────────────────────────────────
    let replyText = textoESLimpio;
    if (langCode !== 'es') {
      try {
        const dataTrad = await fetchOpenAI(apiKey, {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Eres un traductor profesional. Traduce al ${targetLang} de forma natural. NO traduzcas: Grupo Ortiz, BotGO, teléfonos, términos técnicos. Devuelve SOLO el texto traducido.`,
            },
            { role: 'user', content: textoESLimpio },
          ],
          temperature: 0.3,
          max_tokens:  400,
        }, 15000);
        replyText = dataTrad.choices?.[0]?.message?.content?.trim() || textoESLimpio;
      } catch (tradErr) {
        console.warn('⚠️ Traducción falló, usando español:', tradErr.message);
      }
    }

    // ── Analytics ──────────────────────────────────────────────────────────
    if (!noLog) try {
      await logInteraction({
        userMessage:  lastUserMsg,
        botReply:     replyText,
        accionWA,
        accionPDF,
        language:     langCode,
        isNewSession: userMsgCount <= 1,
        sessionId:    sessionId || '',
      });
    } catch (e) {
      console.warn('⚠️ analytics log error:', e.message);
    }

    // ── Guardar candidato ──────────────────────────────────────────────────
    let candidatoId = null;
    let isDuplicate = false;
    if (accionReclutamiento && recruitData) {
      try {
        // Detectar lista de espera: el usuario abrió el bot sin vacantes activas
        // Su primer mensaje contiene la frase de lista de espera, o no hay vacantes activas
        const historialTextos = (messages || []).filter(m => m.role === 'user').map(m => m.content || '').join(' ');
        const esListaEspera = historialTextos.includes('No hay vacantes abiertas') ||
          historialTextos.includes('no hay vacantes abiertas') ||
          historialTextos.includes('No encontré vacante para mi perfil en la lista actual') ||
          historialTextos.includes('Quiero registrarme en lista de espera');
        // Fallback: verificar si hay vacantes activas en la BD (usamos las ya cargadas)
        let en_lista_espera = esListaEspera ? 1 : 0;
        if (!esListaEspera) {
          if (!vacantesActivas || vacantesActivas.length === 0) en_lista_espera = 1;
          // Si hay vacantes activas pero ninguna coincide con el puesto del candidato → lista de espera
          else if (recruitData.puesto && !matchVacanteSimilar(recruitData.puesto, vacantesActivas)) {
            en_lista_espera = 1;
          }
        }

        const saved = await saveRecruitmentLead({
          nombre:          recruitData.nombre    || '',
          email:           recruitData.email     || '',
          telefono:        recruitData.telefono  || '',
          puesto:          recruitData.puesto    || '',
          edad:            recruitData.edad      || '',
          estado_rep:      recruitData.estado    || '',
          colonia:         recruitData.colonia   || '',
          cvNombre:        recruitData.cvNombre    || cvAdjunto?.nombre || '',
          cvBase64:        cvAdjunto?.base64      || '',
          cvTipo:          cvAdjunto?.tipo        || '',
          mensaje:         lastUserMsg,
          comentarios:     recruitData.comentarios || '',
          sessionId:       sessionId || '',
          en_lista_espera,
        });

        if (saved?.duplicate) {
          isDuplicate = true;
          candidatoId = null;
          const puestoExist = saved.existingPuesto ? ` para el puesto de ${saved.existingPuesto}` : '';
          replyText = `Ya tenemos tu solicitud registrada${puestoExist}. Nuestro equipo de RH ya tiene tus datos y te contactará muy pronto. Si deseas postularte a una vacante diferente, con gusto te registro. ¡Gracias por tu interés en Grupo Ortiz!`;
          console.log(`⚠️ Candidato duplicado detectado, no re-registrado.`);
        } else {
          candidatoId = saved?.id || null;
          console.log(`✅ Candidato #${candidatoId} guardado: ${recruitData.nombre} → ${recruitData.puesto}`);
          try {
            await notifyNewVacante({
              nombre:   recruitData.nombre   || '',
              puesto:   recruitData.puesto   || '',
              edad:     recruitData.edad     || '',
              estado:   recruitData.estado   || '',
              colonia:  recruitData.colonia  || '',
              whatsapp: recruitData.telefono || '',
              email:    recruitData.email    || '',
              cvNombre: recruitData.cvNombre || '',
              mensaje:  lastUserMsg,
            });
          } catch (notifyErr) {
            console.warn('⚠️ notifyNewVacante error:', notifyErr.message);
          }

          // ── Auto-notificar si hay vacante activa que coincide con el puesto solicitado ──
          if (en_lista_espera === 1 && candidatoId && recruitData.puesto) {
            try {
              const match = matchVacanteSimilar(recruitData.puesto, vacantesActivas);
              if (match) {
                const candidato = {
                  id:       candidatoId,
                  nombre:   recruitData.nombre   || '',
                  telefono: recruitData.telefono || '',
                  puesto:   recruitData.puesto   || '',
                };
                const results = await notifyEsperaVacante({ candidatos: [candidato], vacante: match, urlVacantes: '' });
                if (results[0]?.ok) {
                  await markNotificadosVacante([candidatoId]);
                  console.log(`🔔 Candidato #${candidatoId} notificado automáticamente → vacante: ${match.titulo}`);
                }
              }
            } catch (autoNotifyErr) {
              console.warn('⚠️ auto-notificar espera error:', autoNotifyErr.message);
            }
          }
        }
      } catch (saveErr) {
        console.error('❌ recruitment save error:', saveErr.message);
      }
    }

    // ── Audio ──────────────────────────────────────────────────────────────
    const audioUrl = isVoice ? await generarAudio(replyText, langCode) : null;

    return new Response(
      JSON.stringify({
        reply:               replyText,
        audio:               audioUrl,
        accionWA,
        accionPDF,
        accionCV,
        accionDistribuidor,
        accionReclutamiento: accionReclutamiento && !isDuplicate,
        enFlujoReclutamiento,
        candidatoId,
        isDuplicate,
        quickReplies,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ chat error:', error.message);
    return new Response(
      JSON.stringify({
        reply:               'Disculpa, tuve un problema. Puedes contactarnos directo al +52 443-207-2593 por WhatsApp 😊',
        detail:              error.message,
        audio:               null,
        accionWA:            false,
        accionPDF:           null,
        accionCV:            false,
        accionDistribuidor:  false,
        isDuplicate:         false,
        accionReclutamiento: false,
        enFlujoReclutamiento:false,
        candidatoId:         null,
        quickReplies:        null,
      }),
      { status: 200 }
    );
  }
}