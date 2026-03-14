// src/pages/api/chat.js
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import * as googleTTS from 'google-tts-api';
import { Buffer } from 'node:buffer';
import { logInteraction, saveRecruitmentLead } from '../../lib/analytics-db.js';
import { notifyNewVacante } from '../../lib/notify';

export const prerender = false;

const VOICE_MAP = {
  es:"es-MX-DaliaNeural", en:"en-US-JennyNeural",
  pt:"pt-BR-FranciscaNeural", fr:"fr-FR-DeniseNeural",
  zh:"zh-CN-XiaoxiaoNeural", ar:"ar-EG-SalmaNeural"
};
const LANGUAGES_MAP = {
  es:'Spanish', en:'English', pt:'Portuguese',
  zh:'Chinese', ar:'Arabic', fr:'French'
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
      const aliasNorm = alias.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').trim();
      if (norm.includes(aliasNorm)) return producto;
    }
  }
  return null;
}

function esIntencionCotizar(texto) {
  if (!texto) return false;
  const norm = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return ['precio','precios','costo','costos','cuanto cuesta','cuanto vale','cotiza','cotizar','cotizacion','comprar','compra','pedido','pedir','adquirir','ordenar','tarifa','presupuesto','quiero comprar','me interesa','cuanto cobran','cuanto me sale','valor','valores','cuánto','cuanto','quanto','how much','prix','prezo'].some(k => norm.includes(k));
}

function analizarHistorial(messages) {
  let lastWAProduct = null;
  let waEnviado     = false;
  const pdfEnviados = new Set();
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
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
    m.role === 'assistant' &&
    /vacante|empleo|puesto|curriculum|currículum|cv|candidato|reclutamiento|datos personales|nombre completo|correo electrónico|teléfono|edad|estado.*república|colonia/i.test(m.content || '')
  );
}

function detectarPasoReclutamiento(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== 'assistant') continue;
    const c = (m.content || '').toLowerCase();
    if (/tienes.*cv|adjunta.*cv|curriculum|adjuntar.*cv|sin.*cv|cv.*disponible/i.test(c)) return 'pregunta_cv';
    if (/whatsapp|teléfono|telefono|número de contacto|num.*tel/i.test(c))              return 'espera_telefono';
    if (/correo|email|e-mail|mail/i.test(c))                                            return 'espera_email';
    if (/colonia|municipio|localidad/i.test(c))                                         return 'espera_colonia';
    if (/estado.*república|estado.*vives|qué estado|que estado/i.test(c))               return 'espera_estado';
    if (/cuántos años|años tienes|edad/i.test(c))                                       return 'espera_edad';
    if (/nombre completo|cómo te llamas|tu nombre/i.test(c))                            return 'espera_nombre';
    if (/puesto|posición|area|área|trabajo.*interesa|tipo de puesto/i.test(c))          return 'espera_puesto';
    if (/vacante|empleo|trabajo|postular|aplicar|oportunidad laboral/i.test(c))         return 'inicio_reclutamiento';
  }
  return null;
}

function extraerDatosDeHistorial(messages) {
  const data = {
    nombre: '', email: '', telefono: '',
    puesto: '', edad: '', estado: '', colonia: '',
    cvNombre: '', mensaje: '',
  };

  for (let i = 0; i < messages.length - 1; i++) {
    const bot  = messages[i];
    const user = messages[i + 1];
    if (bot.role !== 'assistant' || user.role !== 'user') continue;

    const pregunta  = (bot.content  || '').toLowerCase();
    const respuesta = (user.content || '').trim();
    if (!respuesta) continue;

    if (/puesto|posición|posicion|área|area|trabajo.*interesa|tipo de puesto|aplicar a/i.test(pregunta) && !data.puesto) {
      data.puesto = respuesta;
    } else if (/nombre completo|cómo te llamas|como te llamas|tu nombre|cuál es tu nombre/i.test(pregunta) && !data.nombre) {
      const numMatch = respuesta.match(/\d+/);
      data.nombre = numMatch ? numMatch[0] : respuesta;
    } else if (/cuántos años|cuantos años|años tienes|edad/i.test(pregunta) && !data.edad) {
      const numMatch = respuesta.match(/\d+/);
      data.edad = numMatch ? numMatch[0] : respuesta;
    } else if (/estado.*república|estado.*vives|qué estado|que estado|en qué estado/i.test(pregunta) && !data.estado) {
      data.estado = respuesta;
    } else if (/colonia|municipio|localidad/i.test(pregunta) && !data.colonia) {
      data.colonia = respuesta;
    } else if (/correo|email|e-mail|mail/i.test(pregunta) && !data.email) {
      const emailMatch = respuesta.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
      data.email = emailMatch ? emailMatch[0] : respuesta;
    } else if (/whatsapp|teléfono|telefono|número|numero|celular/i.test(pregunta) && !data.telefono) {
      const telMatch = respuesta.match(/[\d\s\+\-\(\)]{7,}/);
      data.telefono = telMatch ? telMatch[0].trim() : respuesta;
    }
  }

  const lastUser = [...messages].reverse().find(m => m.role === 'user');
  data.mensaje = lastUser?.content || '';

  return data;
}

function datosSuficientes(data) {
  const tiene = (v) => v && v.trim().length > 1;
  return tiene(data.nombre) && (tiene(data.telefono) || tiene(data.email)) && tiene(data.puesto);
}

// ─── System Prompt ────────────────────────────────────────────────────────────
function buildSystemPrompt(targetLang) {
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
3,000 colaboradores. 17 plantas de producción (16 en Morelia, 1 en Monterrey).
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
  MÓDULO DE RECLUTAMIENTO — FLUJO CONVERSACIONAL
══════════════════════════════════════════
Si el usuario menciona vacante, empleo, trabajo, CV, postularse, busco trabajo:

Recopila UN DATO POR MENSAJE en este orden exacto:

PASO 1 → "¡Con gusto te ayudo! ¿A qué puesto te gustaría aplicar?"
         Termina con: [ACCION:QUICK_REPLY:puesto]
PASO 2 → "¿Cuál es tu nombre completo?"
PASO 3 → "¿Cuántos años tienes?"
PASO 4 → "¿En qué estado de la República vives?"
         Termina con: [ACCION:QUICK_REPLY:estado]
PASO 5 → "¿Y tu colonia o municipio?"
PASO 6 → "¿Cuál es tu correo electrónico?"
PASO 7 → "¿Y tu número de WhatsApp?"
PASO 8 → "¡Casi listo! ¿Tienes un CV para adjuntar?"
         Termina con: [ACCION:QUICK_REPLY:cv]
PASO 9 → Cuando tienes todos los datos:
         "¡Listo, [nombre]! Registré tu solicitud para [puesto]. Nuestro equipo de RH te contactará pronto. ¡Mucho éxito! 🌟"
         Termina con: [RECLUTAMIENTO:nombre=X|puesto=X|edad=X|estado=X|colonia=X|email=X|telefono=X]

REGLAS:
- Nunca saltes pasos ni pidas dos datos en el mismo mensaje.
- Si el usuario dice que no tiene CV, continúa al PASO 9.
- Si el usuario dice que sí tiene CV, termina con [ACCION:SOLICITAR_CV] para que pueda adjuntarlo.
- Tono cálido y motivador durante todo el flujo.
- SIEMPRE incluye [RECLUTAMIENTO:...] en el PASO 9, es obligatorio.

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
  // ── CV ──────────────────────────────────────────────────────────────────────
  if (/\[ACCION\s*:\s*QUICK_REPLY\s*:\s*cv\s*\]/i.test(text)) {
    return {
      type: 'cv',
      options: [
        { label: 'Sí, tengo CV', value: 'si_cv',  action: 'solicitar_cv' },
        { label: 'No tengo CV',  value: 'no_cv',   action: 'continuar'    },
      ],
    };
  }

  // ── PUESTO ──────────────────────────────────────────────────────────────────
  if (/\[ACCION\s*:\s*QUICK_REPLY\s*:\s*puesto\s*\]/i.test(text)) {
    return {
      type: 'puesto',
      options: [
        { label: 'Producción',       value: 'Operador de producción', action: 'text'  },
        { label: 'Logística',        value: 'Logística',              action: 'text'  },
        { label: 'Ventas',           value: 'Ventas',                 action: 'text'  },
        { label: 'Mantenimiento',    value: 'Mantenimiento',          action: 'text'  },
        { label: 'Ay. General',      value: 'Ayudante General',       action: 'text'  },
        { label: 'Otro puesto',      value: 'otro',                   action: 'input' },
      ],
    };
  }

  // ── ESTADO ──────────────────────────────────────────────────────────────────
  if (/\[ACCION\s*:\s*QUICK_REPLY\s*:\s*estado\s*\]/i.test(text)) {
    return {
      type: 'estado',
      options: [
        { label: 'Michoacán',   value: 'Michoacán',        action: 'text'  },
        { label: 'CDMX',        value: 'Ciudad de México', action: 'text'  },
        { label: 'Jalisco',      value: 'Jalisco',          action: 'text'  },
        { label: 'Nuevo León',  value: 'Nuevo León',       action: 'text'  },
        { label: 'Guanajuato',  value: 'Guanajuato',       action: 'text'  },
        { label: 'Otro estado', value: 'otro',             action: 'input' },
      ],
    };
  }

  return null;
}

function esMensajeCierre(text) {
  return /registr[eé]|solicitud.*registrada|equipo.*rh|contactará|contactara|mucho.*éxito|mucho.*exito/i.test(text);
}

function extractAcciones(text) {
  const accionWA     = /\[ACCION\s*:\s*WHATSAPP\s*\]/i.test(text);
  const matchPDF     = text.match(/\[ACCION\s*:\s*PDF\s*:\s*([\w-]+)\s*\]/i);
  const accionPDF    = matchPDF ? matchPDF[1].trim().toLowerCase() : null;
  const accionCV     = detectarSolicitudCV(text);
  const recruitData  = parseRecruitment(text);
  const quickReplies = detectarQuickReplies(text);

  const cleanText = text
    .replace(/\[RECLUTAMIENTO\s*:[^\]]+\]/gi, '')
    .replace(/\[ACCION\s*:[^\]]+\]/gi, '')
    .replace(/https?:\/\/[^\s\)\]\,]+/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

  return { cleanText, accionWA, accionPDF, accionCV, recruitData, quickReplies };
}

// ─── Audio ────────────────────────────────────────────────────────────────────
function limpiarTextoParaAudio(texto) {
  if (!texto) return "";
  return texto
    .replace(/https?:\/\/[^\s\)\]\,]+/g, "")
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "")
    .replace(/\*\*/g,"").replace(/\*/g,"").replace(/#/g,"")
    .replace(/`/g,"").replace(/_/g,"")
    .replace(/👉|▶|🔗|📎|📄|📋/g,"")
    .replace(/^\s*[-•]\s+/gm,"")
    .replace(/\s{2,}/g," ").replace(/\n{3,}/g,"\n\n")
    .trim();
}

async function streamToBuffer(readable) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readable.on('data', c => chunks.push(Buffer.from(c)));
    readable.on('end',  () => resolve(Buffer.concat(chunks)));
    readable.on('error', e => reject(e));
  });
}

async function generarAudio(texto, lang) {
  const clean = limpiarTextoParaAudio(texto);
  if (!clean) return null;
  const voice = VOICE_MAP[lang] || VOICE_MAP.es;
  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const stream = await Promise.race([
      tts.toStream(clean),
      new Promise((_,r) => setTimeout(() => r(new Error("TTS timeout")), 5000)),
    ]);
    const buf = await streamToBuffer(stream);
    return `data:audio/mp3;base64,${buf.toString("base64")}`;
  } catch {
    try {
      const results = await googleTTS.getAllAudioBase64(clean, {
        lang: lang||'es', slow:false,
        host:'https://translate.google.com', timeout:5000, splitPunct:'.,!?',
      });
      return `data:audio/mp3;base64,${Buffer.concat(results.map(r=>Buffer.from(r.base64,'base64'))).toString('base64')}`;
    } catch { return null; }
  }
}

// ─── Endpoint principal ───────────────────────────────────────────────────────
export async function POST({ request }) {
  const apiKey = import.meta.env.OPENAI_API_KEY;
  if (!apiKey) return new Response(
    JSON.stringify({ reply:"Error de configuración (API Key)." }), { status:500 }
  );

  try {
    const body = await request.json();
    const { messages, language, isVoice = false, sessionId = '', cvAdjunto = null } = body;

    const targetLang = LANGUAGES_MAP[language] || 'Spanish';
    const langCode   = language || 'es';

    let cleanMessages = messages.map(m => ({ role:m.role, content:m.content }));

    if (cvAdjunto && cvAdjunto.nombre) {
      const lastUserIdx = [...cleanMessages].map((m,i) => ({...m,i})).reverse().find(m => m.role==='user')?.i;
      if (lastUserIdx !== undefined) {
        cleanMessages[lastUserIdx] = {
          ...cleanMessages[lastUserIdx],
          content: `${cleanMessages[lastUserIdx].content} [El candidato adjuntó su CV: "${cvAdjunto.nombre}"]`.trim()
        };
      }
    }

    const lastUserMsg  = [...cleanMessages].reverse().find(m => m.role==='user')?.content || '';
    const userMsgCount = cleanMessages.filter(m => m.role==='user').length;

    const { pdfEnviados } = analizarHistorial(cleanMessages);
    const intentoCotizar       = esIntencionCotizar(lastUserMsg);
    const enFlujoReclutamiento = detectarFlujoReclutamiento(cleanMessages);

    // ── Generar respuesta ──────────────────────────────────────────────────
    const responseES = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role:"system", content:buildSystemPrompt('Spanish') },
          ...cleanMessages
        ],
        temperature: 0.65,
        max_tokens: 400,
      }),
    });
    const dataES = await responseES.json();
    if (dataES.error) throw new Error(`OpenAI: ${dataES.error.message}`);
    const rawReplyES = dataES.choices?.[0]?.message?.content || "Hola, ¿en qué puedo ayudarte?";

    let { cleanText: textoESLimpio, accionWA, accionPDF, accionCV, recruitData, quickReplies } = extractAcciones(rawReplyES);

    if (!accionWA && intentoCotizar) accionWA = true;
    if (accionPDF && pdfEnviados.has(accionPDF)) accionPDF = null;

    // ── Agregar CV al recruitData si existe ───────────────────────────────
    if (cvAdjunto?.nombre) {
      if (!recruitData) recruitData = {};
      recruitData.cvNombre = cvAdjunto.nombre;
    }

    // ── Fallback de guardado ───────────────────────────────────────────────
    if (!recruitData && enFlujoReclutamiento && esMensajeCierre(textoESLimpio)) {
      const datosHistorial = extraerDatosDeHistorial([...cleanMessages, {
        role: 'assistant', content: textoESLimpio
      }]);
      if (datosSuficientes(datosHistorial)) {
        console.log('🔄 Usando fallback: datos extraídos del historial', datosHistorial);
        recruitData = datosHistorial;
      } else {
        console.warn('⚠️ Mensaje de cierre detectado pero datos insuficientes:', datosHistorial);
      }
    }

    // ── Complementar recruitData con historial ────────────────────────────
    if (recruitData && enFlujoReclutamiento) {
      const datosHistorial = extraerDatosDeHistorial(cleanMessages);
      for (const campo of ['nombre','email','telefono','puesto','edad','estado','colonia']) {
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
        const responseTrad = await fetch("https://api.openai.com/v1/chat/completions", {
          method: 'POST',
          headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${apiKey}` },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role:"system", content:`Eres un traductor profesional. Traduce al ${targetLang} de forma natural. NO traduzcas: Grupo Ortiz, BotGO, teléfonos, términos técnicos. Devuelve SOLO el texto traducido.` },
              { role:"user", content: textoESLimpio }
            ],
            temperature: 0.3,
            max_tokens: 400,
          }),
        });
        const dataTrad = await responseTrad.json();
        replyText = dataTrad.choices?.[0]?.message?.content?.trim() || textoESLimpio;
      } catch { /* usar español si falla */ }
    }

    // ── Analytics ──────────────────────────────────────────────────────────
    try {
      await logInteraction({
        userMessage:  lastUserMsg,
        botReply:     replyText,
        accionWA,
        accionPDF,
        language:     langCode,
        isNewSession: userMsgCount <= 1,
      });
    } catch (e) { console.warn('⚠️ analytics log error:', e.message); }

    // ── Guardar candidato ─────────────────────────────────────────────────
    let candidatoId = null;
    if (accionReclutamiento && recruitData) {
      try {
        const saved = await saveRecruitmentLead({
          nombre:     recruitData.nombre    || '',
          email:      recruitData.email     || '',
          telefono:   recruitData.telefono  || '',
          puesto:     recruitData.puesto    || '',
          edad:       recruitData.edad      || '',
          estado_rep: recruitData.estado    || '',
          colonia:    recruitData.colonia   || '',
          cvNombre:   recruitData.cvNombre  || (cvAdjunto?.nombre || ''),
          cvBase64:   cvAdjunto?.base64     || '',
          cvTipo:     cvAdjunto?.tipo       || '',
          mensaje:    lastUserMsg,
          sessionId:  sessionId || '',
        });

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
        } catch (e) { console.warn('⚠️ notifyNewVacante error:', e.message); }

      } catch (e) {
        console.error('❌ recruitment save error:', e.message);
      }
    }

    // ── Audio ──────────────────────────────────────────────────────────────
    const audioUrl = isVoice ? await generarAudio(replyText, langCode) : null;

    return new Response(
      JSON.stringify({
        reply: replyText,
        audio: audioUrl,
        accionWA,
        accionPDF,
        accionCV,
        accionReclutamiento,
        enFlujoReclutamiento,
        candidatoId,
        quickReplies,
      }),
      { status:200, headers:{ 'Content-Type':'application/json' } }
    );

  } catch (error) {
    console.error("❌ chat error:", error.message);
    return new Response(
      JSON.stringify({
        reply: "Disculpa, tuve un problema. Puedes contactarnos directo al +52 443-207-2593 por WhatsApp 😊",
        detail: error.message, audio:null, accionWA:false, accionPDF:null,
        accionCV:false, accionReclutamiento:false, enFlujoReclutamiento:false,
        candidatoId:null, quickReplies:null,
      }),
      { status:200 }
    );
  }
}