// src/pages/api/chat.js
// ─── FIX: Salto inteligente de puesto al nombre si ya viene preseleccionado ───
import * as googleTTS from 'google-tts-api';
import { Buffer } from 'node:buffer';
import { logInteraction, saveRecruitmentLead, readVacantes, markNotificadosVacante, checkDuplicateByPhone, checkDuplicateByName, checkDuplicateByEmail } from '../../lib/analytics-db.js';
import { notifyNewVacante, notifyEsperaVacante, notifyEnglishLead } from '../../lib/notify';

export const prerender = false;

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
  charola:    ['charola','charolas','charola naturizable','charola biodegradable','charola termoformable','charola para alimentos','charola compostable','charola ecologica','charola eco'],
  bolsas:     ['bolsa pp','bolsas pp','bolsa polipropileno','bolsas polipropileno','bolsa transparente','bolsas transparentes','bolsa plastica','bolsas plasticas','bolsa 15x20','bolsa 18x25','bolsa 20x30','bolsa 25x35','bolsa 30x40','bolsa 35x45','bolsa 40x60','bolsa 50x70','bolsa 60x90','bolsas de pp'],
  acolchado:  ['acolchado','acolchados','mulch','mulching','acolchamiento','lamina acolchada','plastico acolchado','acolchado agricola','lámina acolchada'],
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
    // Español
    'precio','precios','costo','costos','cuanto cuesta','cuanto vale',
    'cotiza','cotizar','cotizacion','comprar','pedido','pedir',
    'adquirir','ordenar','tarifa','presupuesto','quiero comprar',
    'cuanto cobran','cuanto me sale','atencion al cliente','contactar','hablar con',
    // Inglés
    'how much','buy','purchase','order','place an order','quote','pricing',
    'contact','customer service','speak to','talk to','support','get help',
    'i want to buy','i need to order','can i buy','i would like to buy',
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
function buildSystemPrompt(targetLang, puestoPreseleccionado = null, vacantesActivas = [], nombreDetectado = null, langCode = 'es') {
  const waPhone = langCode === 'en' ? '+1 210-429-3789' : '+52 443-207-2593';

  // PASO 1: puesto — omitir si ya fue preseleccionado
  let paso1 = `PASO 1 → "¡Con gusto te ayudo! ¿A qué puesto te gustaría aplicar?"
         Termina con: [ACCION:QUICK_REPLY:puesto]`;
  if (puestoPreseleccionado) {
    paso1 = `⚠️ EL USUARIO YA SELECCIONÓ EL PUESTO: "${puestoPreseleccionado}". OMITE EL PASO 1 completamente.`;
  }

  // PASO 2: nombre — omitir si ya se detectó en la conversación
  let paso2 = `PASO 2 → "¡Excelente! Para continuar tu registro, ¿cuál es tu nombre completo?"`;
  if (puestoPreseleccionado && !nombreDetectado) {
    paso2 = `PASO 2 → INICIA CON: "¡Excelente elección para la vacante de ${puestoPreseleccionado}! Para comenzar tu registro, ¿cuál es tu nombre completo?"`;
  }
  if (nombreDetectado) {
    paso2 = `⚠️ EL USUARIO YA INDICÓ SU NOMBRE: "${nombreDetectado}". OMITE EL PASO 2 (ya conoces su nombre, úsalo directamente).`;
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
Eres BOTGO, asesor comercial mexicano de Grupo Ortiz.
Hablas en ${targetLang} — tono cálido, directo y natural, como alguien de Michoacán que conoce la empresa de memoria.
JAMÁS digas que eres IA, robot o sistema. Nunca incluyas URLs.

══════════════════════════════════════════
  REGLA DE ORO — RESPUESTAS CORTAS
══════════════════════════════════════════
- Máximo 2-3 líneas por respuesta. SIEMPRE.
- Nunca des toda la información de golpe.
- Da un dato principal y pregunta si quiere saber más.

══════════════════════════════════════════
  REGLA DE FORMATO — TIPOS DE PRODUCTO
══════════════════════════════════════════
Si preguntan "¿qué tipos hay?":
PASO 1 — Lista SOLO los nombres en **negritas**, sin descripción.
PASO 2 — Si menciona uno específico: 2-3 líneas solo de ese tipo.
Nunca mezcles ambos pasos.

══════════════════════════════════════════
  GRUPO ORTIZ — DATOS OFICIALES
══════════════════════════════════════════
Empresa 100% mexicana, fundada en 1959 en Morelia, Michoacán por Nicandro Ortiz.
Principales fabricantes de polímeros y empaques en México y Latinoamérica. Más de 65 años.
+3,000 colaboradores (56% plantilla femenina). 13 plantas (12 en Morelia, 1 en Monterrey).
260 unidades logísticas propias. Capacidad: 220,000 toneladas anuales.
Exporta a América y Europa. Bodega en San Antonio, TX (20915 Wilderness Oak).
Historia: 1959 fundación · 1970 sacos y arpillas · 1985 maquinaria europea · 1995 stretch y flexibles · 2005 exportaciones · 2015 planta de reciclado.
Filosofía: obsesión por el cliente · innovación constante · excelencia operativa · pensamiento a largo plazo · mejor empleador del planeta.
Valores: Responsabilidad, Confianza, Pasión, Perseverancia, Disciplina, Proactividad, Respeto.
Impacto social: Casa Hogar Tacámbaro, Despensa GO, Cero Huella, Composta Viva, alianza con The Ocean Cleanup.
Certificaciones: FSSC 22000, ISO 9001, AIB International, Kosher Pareve.
Contacto: WhatsApp ${waPhone} | atencionacliente@grupo-ortiz.com | Morelia, Michoacán, México.

══════════════════════════════════════════
  CATÁLOGO COMPLETO DE PRODUCTOS
══════════════════════════════════════════
1. RAFIAS — PP 100% virgen, calibres 2-8 mm, con filtro UV.
   Tipos: Rafia de Atar · Rafia Ecológica · Rafia Fibrilada Negra.
   Usos: amarre agrícola, avícola, invernaderos, horticultura.

2. STRETCH FILM — Película estirable LLDPE. Incluye opción biodegradable.
   Tipos: Premium · Automático · Manual Preestirado · Manual Banding · Coreles · Manual Rígido.
   Anchos 3-30 pulg, largos 1,000-25,000 ft, gauge 40-120.
   Usos: paletizado, logística, almacén.

3. CUERDAS PP — Polipropileno con filtro UV, alta tenacidad.
   Tipos: Ferretera (4-19 mm, 175 kg resist) · Invernadero (3-8 mm, negra) · Ecológica (múltiples calibres y colores).
   Usos: agrícola, industrial, marino, ferretería, macrotúneles.

4. SACOS DE RAFIA — PP tejido plano. Impresión personalizada disponible.
   Tipos: Sin Laminar · Transparente · Ecológico (material reciclado).
   Medidas: 35-80 cm ancho · 49-115 cm largo · resistencia 120-200 kgf.
   Usos: alimentos, fertilizantes, construcción, productos a granel.

5. ARPILLAS — Malla PP, tejido circular y plano.
   Tipos: Circular · Monofilamento Circular · Costura Lateral · Etiqueta Laminada.
   Anchos 23-70 cm, disponibles con jareta o refuerzo.
   Usos: frutas, verduras, mariscos, flores, exportación.

6. ESQUINEROS KRAFT — Cartón kraft café o blanco.
   Pestaña 1.5 pulg, espesor 0.08 mm, longitud 11.81 cm.
   Usos: protección de bordes, transporte, paletizado, exportación.

7. EMPAQUES FLEXIBLES — Alta barrera, laminación especializada (Neo Empaques International).
   Tipos: Bobina Impresa (hasta 1,450 mm, 10 tintas) · Bolsa Stand Up (150 g-1 kg, zipper) · Stand Up Pouch impresa · Bolsa Alto Vacío.
   Usos: alimentos, café, carnes, quesos, embutidos, cosméticos, farmacéutica.

8. NATURIZABLE — 100% Plant Based, reciclable y compostable.
   Tipos disponibles: Charola 855 (cartón kraft antigrasa). Próximamente: Vaso de Celulosa, Contenedores.
   Usos: alimentos frescos, retail, supermercados, taqueros, carniceros, fruteros.

9. BOLSAS PP — Polipropileno, alta resistencia al rasgado, acabado uniforme.
   Medidas disponibles (ancho × alto):
   15×20 cm — retail, semillas, especias, porciones individuales.
   15×25 cm — retail, semillas, especias, empaque individual.
   18×25 cm — granos, cereales, botanas, uso cotidiano.
   20×30 cm — frutas, verduras, productos agrícolas, mediano peso.
   25×35 cm — ropa, textiles, calzado, distribución.
   30×40 cm — cargas pesadas, materiales a granel, logística.
   35×45 cm — alto volumen industrial, distribución exigente.
   40×60 cm — textiles, materiales de construcción ligeros, gran escala.
   50×70 cm — logística de exportación, materiales a granel, alto peso.
   60×90 cm — empaque industrial máximo, insumos pesados, distribución masiva.
   Material: Polipropileno (PP). Usos: retail, agrícola, industrial, logística, exportación.

10. ACOLCHADO — Lámina plástica agrícola (mulch).
    Gramaje: tela 85 gr/m² + laminado 14 gr/m².
    Protección UV incluida. Alta resistencia. Mayor durabilidad. Mejor desempeño.
    Función: se coloca sobre el suelo para controlar malezas sin herbicidas, conservar humedad, regular temperatura, prevenir erosión y encharcamiento.
    Usos: siembras, cultivos hortícolas, jardines, huertos de cualquier escala.
    ⚠️ REGLA ACOLCHADO: Solo se vende el producto. NO hay instalación, NO hay accesorios, NO hay servicio adicional. Nunca ofrecer ni preguntar por instalación o accesorios.

══════════════════════════════════════════
  MÓDULO RECOMENDACIÓN POR NECESIDAD
══════════════════════════════════════════
Cuando el usuario describa un problema o necesidad (no nombre un producto), recomienda el más adecuado.
Formato: 1 recomendación principal + 1 línea de por qué + pregunta de seguimiento.

SIEMBRA / CULTIVO / HUERTO:
- "proteger mi siembra / cultivo / huerto" → Acolchado: controla malezas, conserva humedad, regula temperatura, protege con UV. Solo se vende la lámina, sin instalación ni accesorios.
- "atar mis plantas / tomates / invernadero" → Rafia o Cuerdas PP: rafia para amarre fino, cuerdas para macrotúneles.
- "empacar mis frutas o verduras" → Arpillas (presentación y ventilación) o Bolsas PP (medida según volumen).

EMPAQUE / ALMACENAJE:
- "empacar granos / cereales / semillas / especias (pequeño)" → Bolsas PP 15×20 o 18×25.
- "empacar frutas / verduras / productos medianos" → Bolsas PP 20×30 o 25×35.
- "empacar ropa / textiles / calzado" → Bolsas PP 25×35 o 30×40.
- "empacar carga pesada / a granel / fertilizantes / construcción" → Sacos de Rafia (120-200 kgf resistencia).
- "empacar alimentos (café, quesos, carnes, embutidos)" → Empaques Flexibles (Stand Up con zipper, bolsa alto vacío).
- "empacar alimentos frescos para retail / taquería / carnicería" → Naturizable (charola kraft compostable).

LOGÍSTICA / TRANSPORTE:
- "envolver pallets / asegurar carga / almacén" → Stretch Film (calibre según carga).
- "proteger esquinas de mis productos en transporte" → Esquineros Kraft.
- "empacar para exportación" → Arpillas, Bolsas PP 50×70 o 60×90, Stretch Film.

REGLA: Si la necesidad puede cubrirse con más de uno, menciona el principal y di "¿tu uso es más [opción A] o [opción B]?"

══════════════════════════════════════════
  MÓDULO COTIZACIÓN / CONTACTO DIRECTO
══════════════════════════════════════════
Si piden precio/cotización/compra/pedido O quieren hablar con un agente/asesor/atención al cliente/customer service/support:
"¡Con gusto! Para una cotización exacta según tu volumen, escríbenos al WhatsApp ${waPhone} 😊"
Termina con: [ACCION:WHATSAPP]

══════════════════════════════════════════
  MÓDULO PDF
══════════════════════════════════════════
Si piden catálogo/ficha/PDF:
Termina con: [ACCION:PDF:nombre]
Valores: rafia | stretch | cuerdas | sacos | arpillas | esquineros | flexible | charola | bolsas | acolchado | general

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

${paso1}
${paso2}
PASO 3 → "¿Cuántos años tienes?"
PASO 4 → "¿En qué estado de la República vives?"
PASO 5 → "¿Y tu colonia o municipio?"
PASO 6 → "¿Cuál es tu correo electrónico?"
PASO 7 → "¿Cuál es tu número de WhatsApp para que te contactemos?"
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
- Precio/stock/tiempos desconocidos → deriva al ${waPhone}
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


// OpenAI TTS voice per language — tts-1 is the most economical ($0.015/1K chars)
const OPENAI_VOICE_MAP = {
  es: 'nova', en: 'nova', pt: 'nova',
  zh: 'nova', ar: 'nova', fr: 'nova',
};

async function generarAudio(texto, lang, apiKey) {
  const clean = limpiarTextoParaAudio(texto);
  if (!clean) return null;

  // Primary: OpenAI tts-1 (economical, low-latency, conversational)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: clean,
        voice: OPENAI_VOICE_MAP[lang] || 'nova',
        response_format: 'mp3',
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`OpenAI TTS ${res.status}`);
    const arrayBuf = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuf);
    return `data:audio/mp3;base64,${buf.toString('base64')}`;
  } catch (errOpenAI) {
    console.warn('⚠️ OpenAI TTS falló, usando Google TTS:', errOpenAI.message);
  }

  // Fallback: Google TTS (free)
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

    // Límites de seguridad
    if (messages.length > 60) {
      return new Response(JSON.stringify({ reply: 'Conversación demasiado larga. Inicia una nueva.', waPhone: langCode === 'en' ? '12104293789' : '524432072593' }), { status: 200 });
    }

    // Strip de prompt injection: elimina etiquetas internas antes de enviar a la IA
    const stripInjection = (text) => String(text || '')
      .replace(/\[RECLUTAMIENTO[^\]]*\]/gi, '')
      .replace(/\[ACCION[^\]]*\]/gi, '')
      .replace(/\[QUICK_REPLY[^\]]*\]/gi, '')
      .replace(/\[DISTRIBUIDOR[^\]]*\]/gi, '')
      .replace(/\[SYSTEM[^\]]*\]/gi, '')
      .slice(0, 2000); // máximo 2000 chars por mensaje

    let cleanMessages = messages.map(m => ({
      role: m.role,
      content: m.role === 'user' ? stripInjection(m.content) : (m.content || ''),
    }));

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

    // Detectar si es una solicitud de análisis/resumen (usualmente enviada con noLog:true)
    const isAnalysis = noLog && (lastUserMsg.toLowerCase().includes('resumen ejecutivo') || lastUserMsg.toLowerCase().includes('analista ejecutivo'));

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

    // ── Detectar nombre ya mencionado en la conversación ──────────────────
    const datosHistorialPrevio = extraerDatosDeHistorial(cleanMessages);
    const nombreDetectado = datosHistorialPrevio.nombre || null;

     if (enFlujoReclutamiento && !isAnalysis) {
      const mensajesBotRecientes = [...cleanMessages].reverse()
        .filter(m => m.role === 'assistant').slice(0, 2);
 
      const botPidioNombre = mensajesBotRecientes.some(m =>
        /nombre completo|c[oó]mo te llamas|como te llamas|tu nombre|cu[aá]l es tu nombre/i.test(m.content || '')
      );
      const botPidioTelefono = mensajesBotRecientes.some(m =>
        /whatsapp|tel[eé]fono|telefono|n[uú]mero|numero|celular/i.test(m.content || '')
      );
      const botPidioEmail = mensajesBotRecientes.some(m =>
        /correo|email|e-mail|mail/i.test(m.content || '')
      );
 
      let existente = null;
 
      // Verificar por NOMBRE (paso 2 — detección temprana)
      if (!existente && botPidioNombre) {
        const nombreRespuesta = lastUserMsg.trim();
        if (nombreRespuesta.length >= 3 && !/^\d+$/.test(nombreRespuesta)) {
          existente = await checkDuplicateByName(nombreRespuesta).catch(() => null);
        }
      }
 
      // Verificar por EMAIL (paso 7)
      if (!existente && botPidioEmail) {
        const emailMatch = lastUserMsg.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
        if (emailMatch) {
          existente = await checkDuplicateByEmail(emailMatch[0]).catch(() => null);
        }
      }
 
      // Verificar por TELÉFONO (paso 3 — original)
      if (!existente && botPidioTelefono) {
        const telMatch = lastUserMsg.match(/[\d\s\+\-\(\)]{7,}/);
        if (telMatch) {
          const phone = telMatch[0].replace(/\D/g, '');
          if (phone.length >= 7) {
            existente = await checkDuplicateByPhone(phone).catch(() => null);
          }
        }
      }
 
      if (existente) {
        const puestoExist = existente.puesto ? ` para el puesto de ${existente.puesto}` : '';
        const msg = `Ya tenemos tu solicitud registrada${puestoExist}. Nuestro equipo de RH ya tiene tus datos y te contactará muy pronto. ¡Gracias por tu interés en Grupo Ortiz! 🌟`;
        const audioUrl = isVoice ? await generarAudio(msg, langCode, apiKey) : null;
        return new Response(JSON.stringify({
          reply: msg, audio: audioUrl,
          accionWA: false, accionPDF: null, accionCV: false,
          accionDistribuidor: false, accionReclutamiento: false,
          enFlujoReclutamiento: true, candidatoId: null,
          isDuplicate: true, quickReplies: null,
          waPhone: langCode === 'en' ? '12104293789' : '524432072593',
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // ── Cargar vacantes activas para el system prompt ──────────────────────
    let vacantesActivas = [];
    try { vacantesActivas = (await readVacantes(true)) || []; } catch { /* ignorar */ }

    // ── Generar respuesta ──────────────────────────────────────────────────
    const systemPrompt = isAnalysis
      ? "Eres un analista de datos experto. Genera un resumen ejecutivo claro y profesional basado en los datos proporcionados. Sigue las instrucciones del usuario al pie de la letra."
      : buildSystemPrompt('Spanish', puestoPreseleccionado, vacantesActivas, nombreDetectado, langCode);

    const dataES = await fetchOpenAI(apiKey, {
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...cleanMessages,
      ],
      temperature: isAnalysis ? 0.3 : 0.65,
      max_tokens:  isAnalysis ? 800 : 400,
    });

    const rawReplyES = dataES.choices?.[0]?.message?.content || (isAnalysis ? "" : '¿En qué más puedo ayudarte?');
    let { cleanText: textoESLimpio, accionWA, accionPDF, accionCV, accionDistribuidor, recruitData, quickReplies } = isAnalysis
      ? { cleanText: rawReplyES, accionWA: false, accionPDF: null, accionCV: false, accionDistribuidor: false, recruitData: null, quickReplies: null }
      : extractAcciones(rawReplyES);

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
          model: 'gpt-4.1-mini',
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

    // ── Notificar al número de EE.UU. cuando el usuario escribe en inglés ─
    if (langCode === 'en' && (accionReclutamiento || accionDistribuidor || accionWA)) {
      const interes = accionReclutamiento
        ? (recruitData?.puesto ? `Job application — ${recruitData.puesto}` : 'Job application')
        : accionDistribuidor
        ? 'Distributor inquiry'
        : 'Direct WhatsApp contact';
      notifyEnglishLead({
        nombre:   recruitData?.nombre   || '',
        telefono: recruitData?.telefono || '',
        email:    recruitData?.email    || '',
        interes,
        mensaje:  lastUserMsg,
      });
    }

    // ── Preparar datos para revisión en frontend (NO se guarda aún en DB) ───
    // El guardado real ocurre cuando el usuario confirma en PreRegistroReview.
    let isDuplicate = false;
    let esListaEspera = false;

    if (accionReclutamiento && recruitData) {
      const historialTextos = (messages || []).filter(m => m.role === 'user').map(m => m.content || '').join(' ');
      const textoIndicaEspera = historialTextos.includes('No hay vacantes abiertas') ||
        historialTextos.includes('no hay vacantes abiertas') ||
        historialTextos.includes('No encontré vacante para mi perfil en la lista actual') ||
        historialTextos.includes('Quiero registrarme en lista de espera');
      if (textoIndicaEspera || !vacantesActivas || vacantesActivas.length === 0) {
        esListaEspera = true;
      } else if (recruitData.puesto && !matchVacanteSimilar(recruitData.puesto, vacantesActivas)) {
        esListaEspera = true;
      }
    }


    // ── Audio ──────────────────────────────────────────────────────────────
    const audioUrl = isVoice ? await generarAudio(replyText, langCode, apiKey) : null;

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
        candidatoId:         null,
        isDuplicate,
        esListaEspera,
        recruitData:         accionReclutamiento ? recruitData : null,
        quickReplies,
        waPhone:             langCode === 'en' ? '12104293789' : '524432072593',
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