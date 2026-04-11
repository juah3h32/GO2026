// src/lib/notify.ts

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Encripta texto con AES-GCM usando la NTFY_TOKEN como clave */
async function encryptMessage(plaintext: string, secret: string): Promise<string> {
  const enc     = new TextEncoder();
  const keyMat  = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret.slice(0, 32).padEnd(32, '0')),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const iv        = crypto.getRandomValues(new Uint8Array(12));
  const cipherBuf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    keyMat,
    enc.encode(plaintext)
  );

  const combined = new Uint8Array(iv.byteLength + cipherBuf.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipherBuf), iv.byteLength);

  return btoa(String.fromCharCode(...combined));
}


// ══════════════════════════════════════════════════════════════════════════════
// DISTRIBUIDORES
// ══════════════════════════════════════════════════════════════════════════════

async function notifyNtfyDistribuidor(token: string, topic: string) {
  const res = await fetch(`https://ntfy.sh/${topic}`, {
    method: 'POST',
    headers: {
      'Title':         'Nuevo Distribuidor - BotGO',
      'Priority':      'high',
      'Tags':          'handshake',
      'Content-Type':  'text/plain; charset=utf-8',
      'Authorization': `Bearer ${token}`,
    },
    body: '🔔 Nuevo distribuidor registrado. Revisa BD GO y el WhatsApp para los datos.',
  });

  if (!res.ok) {
    console.error(`❌ ntfy distribuidor error: HTTP ${res.status} — ${await res.text()}`);
  } else {
    console.log('✅ ntfy distribuidor enviado OK');
  }
}

async function sendEvolutionMessage(phone: string, text: string): Promise<void> {
  const baseUrl  = import.meta.env.EVOLUTION_API_URL;
  const apiKey   = import.meta.env.EVOLUTION_API_KEY;
  const instance = import.meta.env.EVOLUTION_INSTANCE;

  if (!baseUrl || !apiKey || !instance) {
    console.warn('⚠️ Evolution API no configurada (EVOLUTION_API_URL / EVOLUTION_API_KEY / EVOLUTION_INSTANCE)');
    return;
  }

  const cleanPhone = phone.replace(/\D/g, '');
  const res = await fetch(`${baseUrl}/message/sendText/${instance}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': apiKey },
    body: JSON.stringify({ number: cleanPhone, text }),
  });

  if (!res.ok) {
    console.error(`❌ Evolution API error: HTTP ${res.status} — ${await res.text()}`);
  } else {
    console.log(`✅ Evolution API enviado a ${phone}`);
  }
}

async function notifyEvolutionDistribuidor(
  phone: string,
  lead: { nombre: string; empresa: string; whatsapp: string; productos: string }
) {
  const mensaje = `*Nuevo Distribuidor — BotGO*
Nombre: ${lead.nombre}
Empresa: ${lead.empresa || 'Sin empresa'}
WhatsApp: ${lead.whatsapp}
Productos: ${lead.productos || 'Sin productos'}
${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`;

  await sendEvolutionMessage(phone, mensaje);
}

export async function notifyNewDistribuidor(lead: {
  nombre:   string;
  empresa:  string;
  whatsapp: string;
  productos: string;
}) {
  const topic = import.meta.env.NOTIFY_NTFY_TOPIC;
  const token = import.meta.env.NOTIFY_NTFY_TOKEN;
  const phone = import.meta.env.EVOLUTION_PHONE_DIST;

  const tasks: Promise<void>[] = [];

  if (topic && token) {
    tasks.push(notifyNtfyDistribuidor(token, topic));
  } else {
    console.warn('⚠️ ntfy Distribuidor no configurado, saltando...');
  }

  if (phone) {
    tasks.push(notifyEvolutionDistribuidor(phone, lead));
  } else {
    console.warn('⚠️ EVOLUTION_PHONE_DIST no configurado, saltando notificación WhatsApp...');
  }

  await Promise.allSettled(tasks);
}


// ══════════════════════════════════════════════════════════════════════════════
// VACANTES / RH
// ══════════════════════════════════════════════════════════════════════════════

async function notifyNtfyVacante(token: string, topic: string) {
  const res = await fetch(`https://ntfy.sh/${topic}`, {
    method: 'POST',
    headers: {
      'Title':         'Nueva Vacante - BotGO',
      'Priority':      'high',
      'Tags':          'briefcase',
      'Content-Type':  'text/plain; charset=utf-8',
      'Authorization': `Bearer ${token}`,
    },
    body: '🔔 Nuevo candidato registrado. Revisa BD GO y el WhatsApp para los datos.',
  });

  if (!res.ok) {
    console.error(`❌ ntfy vacante error: HTTP ${res.status} — ${await res.text()}`);
  } else {
    console.log('✅ ntfy vacante enviado OK');
  }
}

async function notifyEvolutionVacante(
  phone: string,
  lead: { nombre: string; puesto: string; whatsapp: string; email: string; mensaje: string }
) {
  const texto = `*Nueva Solicitud de Vacante — BotGO*
Nombre: ${lead.nombre}
Puesto: ${lead.puesto || 'Sin especificar'}
WhatsApp: ${lead.whatsapp}
Email: ${lead.email || 'Sin email'}
Mensaje: ${lead.mensaje || 'Sin mensaje'}
${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`;

  await sendEvolutionMessage(phone, texto);
}

export async function notifyNewVacante(lead: {
  nombre:   string;
  puesto:   string;
  whatsapp: string;
  email:    string;
  mensaje:  string;
}) {
  const topic = import.meta.env.NOTIFY_NTFY_TOPIC_RH;
  const token = import.meta.env.NOTIFY_NTFY_TOKEN_RH;
  const phone = import.meta.env.EVOLUTION_PHONE_RH;

  const tasks: Promise<void>[] = [];

  if (topic && token) {
    tasks.push(notifyNtfyVacante(token, topic));
  } else {
    console.warn('⚠️ ntfy RH no configurado, saltando...');
  }

  if (phone) {
    tasks.push(notifyEvolutionVacante(phone, lead));
  } else {
    console.warn('⚠️ EVOLUTION_PHONE_RH no configurado, saltando notificación WhatsApp...');
  }

  await Promise.allSettled(tasks);
}