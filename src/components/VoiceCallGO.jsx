// src/components/VoiceCallGO.jsx
// Llamada de voz en tiempo real usando OpenAI Realtime API (WebRTC).
// Si el token falla (sin crédito / error) llama onFallback() para regresar al
// modo SpeechRecognition + TTS del navegador.
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './VoiceCallGO.css';

const LANG_LABELS = {
  es: 'Español', en: 'English', pt: 'Português',
  zh: '中文',    ar: 'عربي',   fr: 'Français',
};

const STATUS_TEXT = {
  es: {
    connecting: 'Conectando…',
    active:     'Habla cuando quieras',
    listening:  'Escuchando…',
    speaking:   'Respondiendo…',
    ending:     'Finalizando llamada…',
    error:      'Sin conexión',
  },
  en: {
    connecting: 'Connecting…',
    active:     'Speak whenever you want',
    listening:  'Listening…',
    speaking:   'Responding…',
    ending:     'Ending call…',
    error:      'Connection error',
  },
};

function statusLabel(lang, phase) {
  return (STATUS_TEXT[lang] || STATUS_TEXT.es)[phase] || '';
}

const WHISPER_LANG = {
  es: 'es', en: 'en', pt: 'pt', zh: 'zh', ar: 'ar', fr: 'fr',
};

// ── Detección de intención de compra / cotización (usuario) ──────────────────
const BUY_INTENT_RE = /cotiz|precio|costo|cu[aá]nto\s+(cuesta|vale|cobran|sale)|presupuesto|comprar|adquirir|ordenar|hacer\s+un\s+pedido|quiero\s+pedir|me\s+interesa\s+comprar|deseo\s+comprar|voy\s+a\s+comprar|p[aá]same\s+(el\s+)?(n[uú]mero|whatsapp|contacto|datos)|dame\s+(el\s+)?(n[uú]mero|whatsapp|contacto)|d[aá]me\s+(el\s+)?(n[uú]mero|whatsapp)|me\s+das\s+(el\s+)?(n[uú]mero|whatsapp)|c[oó]mo\s+(los\s+)?contact|c[oó]mo\s+compro|quiero\s+el\s+(n[uú]mero|whatsapp|contacto)|want\s+to\s+(buy|purchase|order|quote)|how\s+much|give\s+me\s+the\s+(number|whatsapp|contact)|how\s+(do\s+I\s+)?contact|pricing|quote/i;

// ── Detección de que el bot ya mencionó WhatsApp → mostrar botón ─────────────
const BOT_WA_RE = /whatsapp|443.?207.?2593|210.?429.?3789/i;

const PRODUCT_PATTERNS = [
  { re: /charola/i,           topic: 'charola', key: 'charola'    },
  { re: /rafia/i,             topic: 'rafia',   key: 'rafia'      },
  { re: /stretch/i,           topic: 'stretch film', key: 'stretch' },
  { re: /cuerda/i,            topic: 'cuerdas', key: 'cuerdas'    },
  { re: /sac[oa]/i,           topic: 'sacos',   key: 'sacos'      },
  { re: /arpilla/i,           topic: 'arpillas',key: 'arpillas'   },
  { re: /esquiner/i,          topic: 'esquineros', key: 'esquineros' },
  { re: /empaque|embalaje/i,  topic: 'empaques flexibles', key: 'flexible' },
];

const VOICE_PRODUCT_CARDS = {
  charola:    { name: 'Charola Naturizable', desc: 'Biodegradable · retail y alimentos', slug: 'catalogo',            color: '#84cc16' },
  rafia:      { name: 'Rafias',              desc: 'PP 100% virgen · agro e invernadero', slug: 'rafias',             color: '#f97316' },
  stretch:    { name: 'Stretch Film',        desc: 'Paletizado · manual y máquina',       slug: 'stretch-film',       color: '#3b82f6' },
  cuerdas:    { name: 'Cuerdas PP',          desc: 'Torcidas y trenzadas · agro e industrial', slug: 'cuerdas',       color: '#22c55e' },
  sacos:      { name: 'Sacos de Rafia',      desc: 'Granos, fertilizantes, construcción', slug: 'sacos',              color: '#a855f7' },
  arpillas:   { name: 'Arpillas',            desc: 'Frutas, verduras, mariscos, flores',  slug: 'arpillas',           color: '#ec4899' },
  esquineros: { name: 'Esquineros Kraft',    desc: 'Protección de bordes · exportación',  slug: 'esquineros',         color: '#f59e0b' },
  flexible:   { name: 'Empaques Flexibles',  desc: 'Pouch, alto vacío, doypack',          slug: 'empaques-flexibles', color: '#14b8a6' },
};

function detectBuyIntent(text) {
  return BUY_INTENT_RE.test(text);
}

function extractProductTopic(turns) {
  for (const t of [...turns].reverse()) {
    for (const { re, topic } of PRODUCT_PATTERNS) {
      if (re.test(t.text)) return topic;
    }
  }
  return 'productos';
}

function detectProductKey(text) {
  for (const { re, key } of PRODUCT_PATTERNS) {
    if (re.test(text)) return key;
  }
  return null;
}

function buildWAUrl(lang, topic, turns) {
  const lastUserText = [...turns].reverse().find(t => t.role === 'user')?.text || '';
  let msg;
  if (lang === 'en') {
    msg = `Hello! I just spoke with the Grupo Ortiz assistant and I'm interested in ${topic}. ${lastUserText ? `I mentioned: "${lastUserText.slice(0, 120)}"` : ''} Could you help me?`;
  } else {
    msg = `Hola, acabo de hablar con el asistente de Grupo Ortiz y me interesa ${topic}. ${lastUserText ? `Comenté: "${lastUserText.slice(0, 120)}"` : ''} ¿Me pueden ayudar?`;
  }
  return `https://wa.me/524432072593?text=${encodeURIComponent(msg.trim())}`;
}

function buildPrompt(lang) {
  const names = { es:'español mexicano', en:'English', pt:'português', zh:'中文', ar:'العربية', fr:'français' };
  const langName = names[lang] || 'español mexicano';

  if (lang === 'es') {
    return `Eres BOTGO, asesor comercial de Grupo Ortiz. Hablas como alguien de Michoacán que conoce la empresa de memoria — tono cálido, directo y natural, como una llamada rápida entre conocidos. JAMÁS digas que eres IA, robot o sistema.

REGLA DE ORO: UNA sola oración por respuesta. Dos máximo si es absolutamente esencial. Sin saludos largos, sin repetir al usuario, sin relleno. Varía cómo inicias cada respuesta.

GRUPO ORTIZ — DATOS OFICIALES:
Empresa 100% mexicana, fundada en 1959 en Morelia, Michoacán por Nicandro Ortiz. Principales fabricantes de polímeros y empaques en México y Latinoamérica. Más de 65 años de trayectoria. Más de 3,000 colaboradores, 56% plantilla femenina. 13 plantas de producción: 12 en Morelia, 1 en Monterrey. 260 unidades logísticas propias. Capacidad de 220,000 toneladas anuales. Exporta a América y Europa. Bodega en San Antonio, Texas. Certificaciones: FSSC 22000, ISO 9001, AIB International, Kosher Pareve. Impacto social: Casa Hogar Tacámbaro, Despensa GO, alianza con The Ocean Cleanup. Valores: Responsabilidad, Confianza, Pasión, Perseverancia, Disciplina, Proactividad, Respeto. Contacto: WhatsApp +52 443-207-2593, correo atencionacliente@grupo-ortiz.com.

CATÁLOGO COMPLETO DE PRODUCTOS:
1. RAFIAS: PP 100% virgen, calibres 2 a 8 mm, con filtro UV. Tipos: Rafia de Atar, Rafia Ecológica, Rafia Fibrilada Negra. Usos: amarre agrícola, avícola, invernaderos, horticultura.
2. STRETCH FILM: Película estirable LLDPE, incluye opción biodegradable. Tipos: Premium, Automático, Manual Preestirado, Manual Banding, Coreles, Manual Rígido. Anchos 3 a 30 pulgadas. Usos: paletizado, logística, almacén.
3. CUERDAS PP: Polipropileno con filtro UV, alta tenacidad. Tipos: Ferretera 4 a 19 mm hasta 175 kg de resistencia, Invernadero 3 a 8 mm negra, Ecológica en múltiples calibres y colores. Usos: agrícola, industrial, marino, ferretería, macrotúneles.
4. SACOS DE RAFIA: PP tejido plano, impresión personalizada disponible. Tipos: Sin Laminar, Transparente, Ecológico con material reciclado. Medidas 35 a 80 cm de ancho, 49 a 115 cm de largo, resistencia 120 a 200 kgf. Usos: alimentos, fertilizantes, construcción, granel.
5. ARPILLAS: Malla PP tejido circular y plano. Tipos: Circular, Monofilamento Circular, Costura Lateral, Etiqueta Laminada. Anchos 23 a 70 cm, con jareta o refuerzo. Usos: frutas, verduras, mariscos, flores, exportación.
6. ESQUINEROS KRAFT: Cartón kraft café o blanco. Pestaña 1.5 pulgadas, espesor 0.08 mm. Usos: protección de bordes, transporte, paletizado, exportación.
7. EMPAQUES FLEXIBLES: Alta barrera, laminación especializada Neo Empaques International. Tipos: Bobina Impresa hasta 1,450 mm en 10 tintas, Bolsa Stand Up 150 g a 1 kg con zipper, Stand Up Pouch impresa, Bolsa Alto Vacío. Usos: alimentos, café, carnes, quesos, embutidos, cosméticos, farmacéutica.
8. NATURIZABLE: 100% Plant Based, reciclable y compostable. Disponible: Charola 855 de cartón kraft antigrasa. Próximamente: Vaso de Celulosa y Contenedores. Usos: alimentos frescos, retail, supermercados, taqueros, carniceros, fruteros.

REGLAS DE RESPUESTA:
Si preguntan qué productos hay: menciona los 8 en una sola frase y pregunta para qué los necesita.
Si mencionan un producto específico: di su uso principal en una frase y pregunta qué necesita exactamente.
Si preguntan tipos de un producto: nómbralos todos en una frase sin describir cada uno.
Si preguntan precio, stock o pedido: "Para eso escríbenos al WhatsApp +52 443-207-2593, ahí te atienden al momento."
Si preguntan por vacantes o empleo: pide nombre, puesto, estado y teléfono — un dato por turno.
Si el tema no es Grupo Ortiz: redirige al catálogo o al asesor de WhatsApp.
NUNCA: mencionar IA, tecnología, URLs, listas con guiones o asteriscos.`;
  }

  return `You are BOTGO, sales advisor at Grupo Ortiz. Speak naturally and directly like a quick friendly call. NEVER say you are AI, a robot, or a system.

RULE: ONE sentence per response. Two max if absolutely essential. No filler, no repeating the user.

GRUPO ORTIZ — OFFICIAL DATA:
100% Mexican company, founded 1959 in Morelia, Michoacán by Nicandro Ortiz. Leading polymer and packaging manufacturer in Mexico and Latin America. 65+ years. 3,000+ employees (56% women). 13 plants: 12 in Morelia, 1 in Monterrey. 260 logistics units. 220,000 ton/year capacity. Exports to Americas and Europe. Warehouse at 20915 Wilderness Oak, San Antonio TX 78258. Certifications: FSSC 22000, ISO 9001, AIB International, Kosher Pareve. Contact: WhatsApp +1 210-429-3789, email atencionacliente@grupo-ortiz.com.

FULL PRODUCT CATALOG:
1. RAFFIA: PP 100% virgin, 2-8 mm, UV filter. Types: Tying Raffia, Ecological Raffia, Black Fibrillated Raffia. Uses: agricultural, poultry, greenhouse, horticulture.
2. STRETCH FILM: LLDPE, biodegradable option available. Types: Premium, Automatic, Pre-stretched Manual, Banding Manual, Coreless, Rigid Manual. Uses: palletizing, logistics, warehouse.
3. PP ROPES: UV filter, high tenacity. Types: Hardware 4-19 mm up to 175 kg, Greenhouse 3-8 mm black, Ecological in multiple gauges and colors. Uses: agriculture, industry, marine, hardware stores.
4. RAFFIA SACKS: Flat woven PP, custom printing. Types: Unlaminated, Transparent, Ecological recycled. Sizes 35-80 cm wide, 49-115 cm long, 120-200 kgf resistance. Uses: food, fertilizers, construction, bulk.
5. MESH BAGS (ARPILLAS): PP mesh circular and flat weave. Types: Circular, Monofilament Circular, Side Seam, Laminated Label. 23-70 cm wide. Uses: fruits, vegetables, seafood, flowers, export.
6. KRAFT CORNER PROTECTORS: Brown or white kraft board. 1.5 in flap, 0.08 mm thick. Uses: edge protection, transport, palletizing, export.
7. FLEXIBLE PACKAGING: High barrier, specialized lamination. Types: Printed Roll up to 1,450 mm 10-color, Stand Up Bag 150 g-1 kg with zipper, Printed Stand Up Pouch, High-Vacuum Bag. Uses: food, coffee, meat, cheese, cosmetics, pharma.
8. NATURIZABLE: 100% Plant Based, recyclable and compostable. Available: Tray 855 antigrease kraft board. Coming soon: Cellulose Cup, Containers. Uses: fresh food, retail, supermarkets.

RESPONSE RULES:
Products asked broadly: name all 8 in one phrase and ask what they need.
Specific product asked: state main use in one sentence and ask exactly what they need.
Price/stock/order: "Contact us on WhatsApp +1 210-429-3789, they'll help you right away."
Jobs/vacancies: ask name, position, state and phone — one piece of info per turn.
Off-topic: redirect to catalog or WhatsApp advisor.
NEVER: mention AI, URLs, markdown lists, asterisks. Respond EXCLUSIVELY in ${langName}.`;
}

export default function VoiceCallGO({ lang = 'es', onEnd, onFallback, onWhatsApp, onProduct }) {
  const [phase,        setPhase]        = useState('connecting');
  const [transcript,   setTranscript]   = useState('');
  const [errorMsg,     setErrorMsg]     = useState('');
  const [showWABtn,      setShowWABtn]      = useState(false);
  const [waVisible,      setWaVisible]      = useState(false);
  const [waUrl,          setWaUrl]          = useState('');
  const [waTopic,        setWaTopic]        = useState('');
  const [productCardKey, setProductCardKey] = useState(null);
  const [cardVisible,    setCardVisible]    = useState(false);

  const pcRef              = useRef(null);
  const dcRef              = useRef(null);
  const cancelRef          = useRef(false);
  const turnsRef           = useRef([]);
  const startTsRef         = useRef(Date.now());
  const waShownRef         = useRef(false);
  const productCardTimer   = useRef(null);
  const productCardShown   = useRef(null);
  const deltaBufferRef     = useRef('');
  const triggerProductRef  = useRef(null);
  const triggerWARef       = useRef(null);

  // Animar entrada de la card: slide-out rápido + slide-in para cada producto
  useEffect(() => {
    if (productCardKey) {
      setCardVisible(false);                        // retrae primero (slide-out)
      const t = setTimeout(() => setCardVisible(true), 120); // luego slide-in
      return () => clearTimeout(t);
    } else {
      setCardVisible(false);
    }
  }, [productCardKey]);

  // Animar entrada del botón WA
  useEffect(() => {
    if (showWABtn) {
      const t = setTimeout(() => setWaVisible(true), 60);
      return () => clearTimeout(t);
    } else {
      setWaVisible(false);
    }
  }, [showWABtn]);

  // Capa extra de detección — cualquier cambio en transcript reactiva la búsqueda
  useEffect(() => {
    if (!transcript) return;
    triggerProductRef.current?.(detectProductKey(transcript));
    if (BOT_WA_RE.test(transcript)) triggerWARef.current?.(extractProductTopic(turnsRef.current));
  }, [transcript]);

  const triggerProduct = useCallback((key) => {
    if (!key) return;
    // Siempre actualiza aunque sea el mismo producto (usuario puede cambiar de tema y volver)
    // Solo bloquea si exactamente el mismo key lleva mostrándose menos de 3s (anti-spam)
    if (key === productCardShown.current) return;
    productCardShown.current = key;
    setProductCardKey(key);
    onProduct?.(key);
    clearTimeout(productCardTimer.current);
    productCardTimer.current = setTimeout(() => {
      setProductCardKey(null);
      productCardShown.current = null;
    }, 9000);
  }, [onProduct]);

  const triggerWA = useCallback((topic) => {
    if (waShownRef.current) return;
    waShownRef.current = true;
    setWaTopic(topic);
    setWaUrl(buildWAUrl(lang, topic, turnsRef.current));
    setShowWABtn(true);
    onWhatsApp?.(topic);
  }, [lang, onWhatsApp]);

  // Mantener refs siempre apuntando a la versión más reciente
  useEffect(() => { triggerProductRef.current = triggerProduct; }, [triggerProduct]);
  useEffect(() => { triggerWARef.current = triggerWA; }, [triggerWA]);

  // SpeechRecognition en paralelo — detecta el habla del USUARIO directo del micrófono,
  // independiente de los eventos de OpenAI (más confiable para activar cards/botones)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    let active = true;
    const sr = new SR();
    sr.lang = ({ es:'es-MX', en:'en-US', pt:'pt-BR', zh:'zh-CN', ar:'ar-SA', fr:'fr-FR' })[lang] || 'es-MX';
    sr.continuous     = true;
    sr.interimResults = true;
    sr.onresult = ({ results, resultIndex }) => {
      if (!active) return;
      // Solo analizar el utterance ACTUAL (resultIndex), no el texto acumulado
      // desde el inicio de la sesión — evita re-detectar productos mencionados antes
      const latest = results[resultIndex]?.[0]?.transcript || '';
      const pk = detectProductKey(latest);
      if (pk) triggerProductRef.current?.(pk);
      if (detectBuyIntent(latest)) triggerWARef.current?.(extractProductTopic(turnsRef.current));
    };
    sr.onerror = () => {};
    sr.onend   = () => { if (active) try { sr.start(); } catch {} };
    try { sr.start(); } catch {}
    return () => { active = false; try { sr.stop(); } catch {} };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const doCleanup = useCallback(() => {
    try { dcRef.current?.close(); } catch {}
    try { pcRef.current?.close(); } catch {}
    dcRef.current = null;
    pcRef.current = null;
  }, []);

  const hangUp = useCallback(() => {
    setPhase('ending');
    const duration = Math.round((Date.now() - startTsRef.current) / 1000);
    const turns    = turnsRef.current;
    if (turns.length > 0) {
      fetch('/api/voice-calls', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ action: 'save', lang, duration, turns }),
      }).catch(e => console.warn('[VoiceCallGO] save error:', e));
    }
    doCleanup();
    setTimeout(() => onEnd?.(), 370);
  }, [doCleanup, onEnd, lang]);

  useEffect(() => {
    cancelRef.current = false;

    async function startCall() {
      // ── 1. Obtener token efímero ──────────────────────────────────────────
      let token;
      try {
        const res = await fetch('/api/realtime-session', {
          method : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body   : JSON.stringify({ lang }),
        });
        // 402 = créditos insuficientes → fallback silencioso sin reintentar
        if (res.status === 402) {
          if (cancelRef.current) return;
          console.warn('[VoiceCallGO] Créditos de voz insuficientes, usando fallback.');
          onFallback?.();
          return;
        }
        if (!res.ok) throw new Error(`http:${res.status}`);
        const d = await res.json();
        token = d.token;
        if (!token) throw new Error('no_token');
      } catch (err) {
        if (cancelRef.current) return;
        console.warn('[VoiceCallGO] Token unavailable, using fallback:', err.message);
        onFallback?.();
        return;
      }

      if (cancelRef.current) return;

      // ── 2. Micrófono con supresión de ruido activa ────────────────────────
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation   : true,
            noiseSuppression   : true,
            autoGainControl    : true,
            sampleRate         : 24000,
          },
        });
      } catch {
        if (cancelRef.current) return;
        setPhase('error');
        setErrorMsg(lang === 'en'
          ? 'Microphone access denied.'
          : 'Acceso al micrófono denegado. Revisa los permisos.');
        return;
      }

      if (cancelRef.current) { stream.getTracks().forEach(t => t.stop()); return; }

      // ── 3. WebRTC ─────────────────────────────────────────────────────────
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const audioEl    = document.createElement('audio');
      audioEl.autoplay = true;
      pc.ontrack       = (e) => { audioEl.srcObject = e.streams[0]; };

      stream.getTracks().forEach(t => pc.addTrack(t, stream));

      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;

      dc.onopen = () => {
        if (cancelRef.current) return;
        setPhase('active');
        dc.send(JSON.stringify({
          type   : 'session.update',
          session: {
            type                     : 'realtime',
            instructions             : buildPrompt(lang),
            input_audio_transcription: { model: 'whisper-1', language: WHISPER_LANG[lang] || 'es' },
          },
        }));
      };

      dc.onmessage = ({ data }) => {
        if (cancelRef.current) return;
        try {
          const ev = JSON.parse(data);
          switch (ev.type) {

            case 'input_audio_buffer.speech_started':
              setPhase('listening');
              setTranscript('');
              deltaBufferRef.current = '';
              break;

            case 'input_audio_buffer.speech_stopped':
              setPhase('active');
              break;

            // Transcripción del usuario
            case 'conversation.item.input_audio_transcription.completed': {
              const text = ev.transcript?.trim();
              if (text) {
                turnsRef.current.push({ role: 'user', text, ts: Date.now() });
                triggerProductRef.current?.(detectProductKey(text));
                if (detectBuyIntent(text)) triggerWARef.current?.(extractProductTopic(turnsRef.current));
              }
              break;
            }

            // Streaming de la respuesta — detectar producto tan pronto aparece en el texto
            case 'response.audio_transcript.delta': {
              setPhase('speaking');
              const delta = ev.delta || '';
              deltaBufferRef.current += delta;
              setTranscript(deltaBufferRef.current.slice(-300));
              // 1. Detectar en el texto del bot mientras habla
              triggerProductRef.current?.(detectProductKey(deltaBufferRef.current));
              // 2. Fallback: si el bot ya empezó a responder y aún no hay card,
              //    usar el producto que mencionó el usuario en su último turno
              if (!productCardShown.current) {
                const lastUser = [...turnsRef.current].reverse().find(t => t.role === 'user');
                if (lastUser) triggerProductRef.current?.(detectProductKey(lastUser.text));
              }
              // 3. Detectar mención de WhatsApp mientras habla
              if (BOT_WA_RE.test(deltaBufferRef.current)) {
                triggerWARef.current?.(extractProductTopic(turnsRef.current));
              }
              break;
            }

            // Transcripción completa de la respuesta
            case 'response.audio_transcript.done': {
              const text = ev.transcript?.trim();
              if (text) {
                turnsRef.current.push({ role: 'assistant', text, ts: Date.now() });
                triggerProductRef.current?.(detectProductKey(text));
                if (BOT_WA_RE.test(text)) triggerWARef.current?.(extractProductTopic(turnsRef.current));
              }
              break;
            }

            case 'response.done':
              deltaBufferRef.current = '';
              setPhase('active');
              setTimeout(() => setTranscript(''), 4500);
              break;

            case 'error': {
              const msg = ev.error?.message || '';
              console.error('[VoiceCallGO] API error:', msg);
              if (/quota|billing|credit|insufficient/i.test(msg)) {
                doCleanup();
                onFallback?.();
              }
              break;
            }
          }
        } catch {}
      };

      dc.onclose = () => { if (!cancelRef.current) hangUp(); };

      // ── 4. Intercambio SDP ────────────────────────────────────────────────
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const sdpRes = await fetch(
          'https://api.openai.com/v1/realtime/calls?model=gpt-realtime',
          {
            method : 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type' : 'application/sdp',
            },
            body: offer.sdp,
          }
        );

        if (!sdpRes.ok) throw new Error(`sdp:${sdpRes.status}`);
        const answerSdp = await sdpRes.text();
        if (cancelRef.current) return;
        await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
      } catch (err) {
        if (cancelRef.current) return;
        console.warn('[VoiceCallGO] SDP exchange failed, using fallback:', err.message);
        doCleanup();
        onFallback?.();
      }
    }

    startCall();

    return () => {
      cancelRef.current = true;
      doCleanup();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const label       = phase === 'error'
    ? (errorMsg || statusLabel(lang, 'error'))
    : statusLabel(lang, phase);
  const isListening = phase === 'listening';
  const isSpeaking  = phase === 'speaking';
  const hangupLabel = lang === 'en' ? 'Hang up' : 'Colgar';
  const waBtnLabel  = lang === 'en' ? 'WhatsApp' : 'WhatsApp';

  return (
    <div className={`vcgo-overlay vcgo-${phase}`}>

      {/* ── Top ── */}
      <div className="vcgo-top">
        <span className="vcgo-lang-badge">{LANG_LABELS[lang] || lang.toUpperCase()}</span>
      </div>

      {/* ── Centro ── */}
      <div className="vcgo-center">
        <div className={`vcgo-avatar${isSpeaking ? ' is-speaking' : isListening ? ' is-listening' : ''}`}>
          <div className="vcgo-avatar-inner">
            <svg viewBox="0 0 100 100" fill="none" className="vcgo-robot-face">
              <circle cx="50" cy="55" r="40" fill="#FB670B" />
              <ellipse cx="50" cy="58" rx="32" ry="30" fill="#FFF5E6" />
              <rect x="25" y="45" width="50" height="22" rx="10" fill="#FB670B" />
              <circle cx="38" cy="56" r="5" fill="#FFD700" />
              <circle cx="62" cy="56" r="5" fill="#FFD700" />
              <ellipse cx="50" cy="78" rx="6" ry="2" fill="#D35400" opacity="0.8" />
            </svg>
          </div>
          <div className="vcgo-ring vcgo-ring-1" />
          <div className="vcgo-ring vcgo-ring-2" />
          <div className="vcgo-ring vcgo-ring-3" />
        </div>

        <h2 className="vcgo-name">BotGO</h2>
        <p className="vcgo-status-text">{label}</p>

        {phase === 'connecting' && <div className="vcgo-spinner" />}

        {phase === 'error' && (
          <button
            className="vcgo-fallback-btn"
            onClick={() => { doCleanup(); onFallback?.(); }}
          >
            {lang === 'en' ? 'Use browser microphone' : 'Usar micrófono del navegador'}
          </button>
        )}
      </div>

      {/* Pill de producto — posición absoluta dentro del overlay; el overflow:hidden
          de .botgo-window actúa como máscara de clip para la animación de slide-in */}
      {productCardKey && VOICE_PRODUCT_CARDS[productCardKey] && (() => {
        const card = VOICE_PRODUCT_CARDS[productCardKey];
        return (
          <div className={`vcgo-product-card ${cardVisible ? 'vcgo-product-card--visible' : ''}`}>
            <div className="vcgo-product-card__top">
              <div className="vcgo-product-card__circle">
                <span className="vcgo-product-card__initial">{card.name.charAt(0)}</span>
              </div>
              <div className="vcgo-product-card__info">
                <p className="vcgo-product-card__name">{card.name}</p>
              </div>
            </div>
            <a
              href={`/${lang}/${card.slug}`}
              className="vcgo-product-card__btn"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { setProductCardKey(null); productCardShown.current = null; }}
            >
              Ver
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <button
              className="vcgo-product-card__close"
              onClick={() => { clearTimeout(productCardTimer.current); setProductCardKey(null); productCardShown.current = null; }}
              aria-label="Cerrar"
            >
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        );
      })()}

      {/* Botón WhatsApp — pill igual que product card, slide desde el borde derecho */}
      {showWABtn && (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`vcgo-wa-float${waVisible ? ' vcgo-wa-float--visible' : ''}`}
          aria-label="WhatsApp"
        >
          <div className="vcgo-product-card__circle" style={{ background: 'rgba(255,255,255,0.25)', borderColor: 'rgba(255,255,255,0.5)' }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <p className="vcgo-product-card__name">WhatsApp</p>
          <span className="vcgo-product-card__btn" style={{ background: '#fff', color: '#25D366' }}>
            {lang === 'en' ? 'Chat' : 'Ir'}
            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </a>
      )}

      {/* ── Colgar ── */}
      <div className="vcgo-bottom">
        <button className="vcgo-hangup-btn" onClick={hangUp} aria-label={hangupLabel}>
          <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24
              1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39
              0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57
              3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        </button>
        <p className="vcgo-hangup-label">{hangupLabel}</p>
      </div>

    </div>
  );
}
