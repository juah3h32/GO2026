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

async function notifyCallMeBotDistribuidor(
  phone: string,
  apiKey: string,
  lead: { nombre: string; empresa: string; whatsapp: string; productos: string }
) {
  const mensaje = `🤝 *Nuevo Distribuidor*
👤 ${lead.nombre}
🏢 ${lead.empresa || 'Sin empresa'}
📲 ${lead.whatsapp}
📦 ${lead.productos || 'Sin productos'}
🕐 ${new Date().toLocaleString('es-MX')}`;

  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(mensaje)}&apikey=${apiKey}`;

  console.log('📲 CallMeBot Distribuidor URL:', url);

  const res  = await fetch(url);
  const body = await res.text();

  console.log(`📲 CallMeBot Distribuidor status: ${res.status}`);
  console.log(`📲 CallMeBot Distribuidor body: ${body}`);
}

export async function notifyNewDistribuidor(lead: {
  nombre:   string;
  empresa:  string;
  whatsapp: string;
  productos: string;
}) {
  const topic  = import.meta.env.NOTIFY_NTFY_TOPIC;
  const token  = import.meta.env.NOTIFY_NTFY_TOKEN;
  const phone  = import.meta.env.CALLMEBOT_PHONE;
  const apiKey = import.meta.env.CALLMEBOT_APIKEY;

  const tasks: Promise<void>[] = [];

  if (topic && token) {
    tasks.push(notifyNtfyDistribuidor(token, topic));
  } else {
    console.warn('⚠️ ntfy Distribuidor no configurado, saltando...');
  }

  if (phone && apiKey) {
    tasks.push(notifyCallMeBotDistribuidor(phone, apiKey, lead));
  } else {
    console.warn('⚠️ CallMeBot Distribuidor no configurado, saltando...');
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

async function notifyCallMeBotVacante(
  phone: string,
  apiKey: string,
  lead: { nombre: string; puesto: string; whatsapp: string; email: string; mensaje: string }
) {
  const texto = `💼 *Nueva Solicitud de Vacante*
👤 ${lead.nombre}
📋 ${lead.puesto   || 'Sin puesto especificado'}
📲 ${lead.whatsapp}
📧 ${lead.email    || 'Sin email'}
💬 ${lead.mensaje  || 'Sin mensaje'}
🕐 ${new Date().toLocaleString('es-MX')}`;

  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(texto)}&apikey=${apiKey}`;

  console.log('📲 CallMeBot Vacante URL:', url);

  const res  = await fetch(url);
  const body = await res.text();

  console.log(`📲 CallMeBot Vacante status: ${res.status}`);
  console.log(`📲 CallMeBot Vacante body: ${body}`);
}

export async function notifyNewVacante(lead: {
  nombre:   string;
  puesto:   string;
  whatsapp: string;
  email:    string;
  mensaje:  string;
}) {
  const topic  = import.meta.env.NOTIFY_NTFY_TOPIC_RH;
  const token  = import.meta.env.NOTIFY_NTFY_TOKEN_RH;
  const phone  = import.meta.env.CALLMEBOT_PHONE_RH;
  const apiKey = import.meta.env.CALLMEBOT_APIKEY_RH;

  // ← LOG TEMPORAL
  console.log('🔍 RH ENV CHECK:', {
    topic:  topic  ? `✅ ${topic}`  : '❌ undefined',
    token:  token  ? '✅ existe'    : '❌ undefined',
    phone:  phone  ? `✅ ${phone}`  : '❌ undefined',
    apiKey: apiKey ? '✅ existe'    : '❌ undefined',
  });

  const tasks: Promise<void>[] = [];

  if (topic && token) {
    tasks.push(notifyNtfyVacante(token, topic));
  } else {
    console.warn('⚠️ ntfy RH no configurado, saltando...');
  }

  if (phone && apiKey) {
    tasks.push(notifyCallMeBotVacante(phone, apiKey, lead));
  } else {
    console.warn('⚠️ CallMeBot RH no configurado, saltando...');
  }

  await Promise.allSettled(tasks);
}