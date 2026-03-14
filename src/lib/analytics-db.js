import { createClient } from '@libsql/client';

const url       = process.env.TURSO_DATABASE_URL || import.meta.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN   || import.meta.env.TURSO_AUTH_TOKEN;

const db = createClient({ url, authToken });
let isInitialized        = false;
let recruitmentReady     = false;

async function ensureInit() {
  if (isInitialized) return;

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS counters (key TEXT PRIMARY KEY, value INTEGER NOT NULL DEFAULT 0);
    INSERT OR IGNORE INTO counters (key, value) VALUES ('totalSessions', 0), ('totalMessages', 0), ('totalWhatsApp', 0), ('totalPDFs', 0);

    CREATE TABLE IF NOT EXISTS daily (date TEXT PRIMARY KEY, sessions INTEGER NOT NULL DEFAULT 0, messages INTEGER NOT NULL DEFAULT 0, wa INTEGER NOT NULL DEFAULT 0, pdf INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS hourly (hour INTEGER PRIMARY KEY CHECK (hour >= 0 AND hour <= 23), count INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS products (name TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 1);
    CREATE TABLE IF NOT EXISTS keywords (word TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 1);

    CREATE TABLE IF NOT EXISTS intents (intent TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0);
    INSERT OR IGNORE INTO intents (intent, count) VALUES ('compra',0),('pdf',0),('info',0),('reclutamiento',0),('otro',0);

    CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT NOT NULL DEFAULT (datetime('now')), user_msg TEXT NOT NULL DEFAULT '', bot_reply TEXT, lang TEXT NOT NULL DEFAULT 'es', intent TEXT NOT NULL DEFAULT 'otro', product TEXT);

    CREATE INDEX IF NOT EXISTS idx_messages_ts    ON messages(ts DESC);
    CREATE INDEX IF NOT EXISTS idx_daily_date     ON daily(date DESC);
    CREATE INDEX IF NOT EXISTS idx_products_count ON products(count DESC);
    CREATE INDEX IF NOT EXISTS idx_keywords_count ON keywords(count DESC);
  `);

  const hourInitQueries = [];
  for (let i = 0; i < 24; i++) {
    hourInitQueries.push({ sql: 'INSERT OR IGNORE INTO hourly (hour, count) VALUES (?, 0)', args: [i] });
  }
  await db.batch(hourInitQueries, 'write');

  isInitialized = true;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getTodayKey()    { return new Date().toISOString().split('T')[0]; }
function getCurrentHour() { return new Date().getHours(); }

const KEYWORD_LIST = [
  'precio','cotizar','cotización','presupuesto','comprar','pedido',
  'rafia','stretch','cuerdas','sacos','arpillas','esquineros','flexible',
  'catálogo','pdf','ficha','envíame','descargar',
  'empleo','trabajo','vacante','cv',
  'certificación','calidad','entrega','medidas','colores',
];

const PRODUCT_LIST = [
  'rafia','stretch','cuerdas','cuerda','sacos','saco',
  'arpillas','arpilla','esquineros','esquinero','flexible','empaque',
];

export function detectKeywords(text) {
  const lower = text.toLowerCase();
  return KEYWORD_LIST.filter(kw => lower.includes(kw));
}

export function detectProduct(text) {
  const lower = text.toLowerCase();
  return PRODUCT_LIST.find(p => lower.includes(p)) || null;
}

export function detectIntent(text, accionWA, accionPDF) {
  if (accionWA)  return 'compra';
  if (accionPDF) return 'pdf';
  const lower = text.toLowerCase();
  if (/empleo|trabajo|vacante|cv|currículum/.test(lower)) return 'reclutamiento';
  if (/qué|cómo|para qué|qué es|cuál|tipo|tienen/.test(lower)) return 'info';
  return 'otro';
}

// ─── WRITE ───────────────────────────────────────────────────────────────────
export async function logInteraction({
  userMessage  = '',
  botReply     = '',
  accionWA     = false,
  accionPDF    = null,
  isNewSession = false,
  language     = 'es',
}) {
  await ensureInit();

  const today    = getTodayKey();
  const hour     = getCurrentHour();
  const intent   = detectIntent(userMessage, accionWA, accionPDF);
  const product  = detectProduct(userMessage) || accionPDF || null;
  const keywords = detectKeywords(userMessage);

  const stmts = [];
  stmts.push({ sql: 'UPDATE counters SET value = value + ? WHERE key = ?', args: [1, 'totalMessages'] });
  if (isNewSession) stmts.push({ sql: 'UPDATE counters SET value = value + ? WHERE key = ?', args: [1, 'totalSessions'] });
  if (accionWA)     stmts.push({ sql: 'UPDATE counters SET value = value + ? WHERE key = ?', args: [1, 'totalWhatsApp'] });
  if (accionPDF)    stmts.push({ sql: 'UPDATE counters SET value = value + ? WHERE key = ?', args: [1, 'totalPDFs'] });

  stmts.push({
    sql: `INSERT INTO daily (date, sessions, messages, wa, pdf) VALUES (?, ?, 1, ?, ?)
          ON CONFLICT(date) DO UPDATE SET
            sessions = sessions + excluded.sessions,
            messages = messages + 1,
            wa       = wa  + excluded.wa,
            pdf      = pdf + excluded.pdf`,
    args: [today, isNewSession ? 1 : 0, accionWA ? 1 : 0, accionPDF ? 1 : 0],
  });

  stmts.push({ sql: 'UPDATE hourly SET count = count + 1 WHERE hour = ?', args: [hour] });

  for (const kw of keywords) {
    stmts.push({ sql: 'INSERT INTO keywords (word,count) VALUES (?,1) ON CONFLICT(word) DO UPDATE SET count=count+1', args: [kw] });
  }
  if (product) {
    stmts.push({ sql: 'INSERT INTO products (name,count) VALUES (?,1) ON CONFLICT(name) DO UPDATE SET count=count+1', args: [product] });
  }
  stmts.push({ sql: 'UPDATE intents SET count = count + 1 WHERE intent = ?', args: [intent] });
  stmts.push({
    sql:  "INSERT INTO messages (ts,user_msg,bot_reply,lang,intent,product) VALUES (datetime('now'),?,?,?,?,?)",
    args: [userMessage.substring(0,120), botReply?.substring(0,300) || null, language, intent, product],
  });

  await db.batch(stmts, 'write');
}

// ─── RESET ───────────────────────────────────────────────────────────────────
export async function resetData() {
  await ensureInit();
  await db.batch([
    { sql: 'UPDATE counters SET value = 0', args: [] },
    { sql: 'DELETE FROM daily',             args: [] },
    { sql: 'UPDATE hourly SET count = 0',   args: [] },
    { sql: 'DELETE FROM products',          args: [] },
    { sql: 'DELETE FROM keywords',          args: [] },
    { sql: 'UPDATE intents SET count = 0',  args: [] },
    { sql: 'DELETE FROM messages',          args: [] },
  ], 'write');
}

// ─── READ ─────────────────────────────────────────────────────────────────────
export async function readAllData() {
  await ensureInit();

  const countersRes = await db.execute('SELECT key, value FROM counters');
  const counters    = Object.fromEntries(countersRes.rows.map(r => [r.key, r.value]));

  const dailyRes = await db.execute('SELECT date,sessions,messages,wa,pdf FROM daily ORDER BY date DESC LIMIT 90');
  const daily    = {};
  for (const r of dailyRes.rows) daily[r.date] = { sessions: r.sessions, messages: r.messages, wa: r.wa, pdf: r.pdf };

  const hourlyRes = await db.execute('SELECT hour, count FROM hourly ORDER BY hour');
  const hourly    = Array(24).fill(0);
  for (const r of hourlyRes.rows) hourly[r.hour] = r.count;

  const productsRes = await db.execute('SELECT name, count FROM products ORDER BY count DESC LIMIT 20');
  const products    = Object.fromEntries(productsRes.rows.map(r => [r.name, r.count]));

  const keywordsRes = await db.execute('SELECT word, count FROM keywords ORDER BY count DESC LIMIT 30');
  const keywords    = Object.fromEntries(keywordsRes.rows.map(r => [r.word, r.count]));

  const intentsRes = await db.execute('SELECT intent, count FROM intents');
  const intents    = { compra: 0, pdf: 0, info: 0, reclutamiento: 0, otro: 0 };
  for (const r of intentsRes.rows) intents[r.intent] = r.count;

  const messagesRes = await db.execute(`
    SELECT ts, user_msg as user, bot_reply as bot, lang, intent, product as prod
    FROM messages ORDER BY id DESC LIMIT 100
  `);
  const lastMessages = messagesRes.rows.reverse();

  return {
    totalSessions: counters.totalSessions || 0,
    totalMessages: counters.totalMessages || 0,
    totalWhatsApp: counters.totalWhatsApp || 0,
    totalPDFs:     counters.totalPDFs     || 0,
    daily, hourly, products, keywords, intents, lastMessages,
  };
}

// ─── DISTRIBUIDOR LEADS ───────────────────────────────────────────────────────
async function ensureLeadsTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS distribuidor_leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts TEXT NOT NULL DEFAULT (datetime('now')),
      nombre TEXT NOT NULL DEFAULT '', empresa TEXT NOT NULL DEFAULT '',
      whatsapp TEXT NOT NULL DEFAULT '', email TEXT NOT NULL DEFAULT '',
      productos TEXT NOT NULL DEFAULT ''
    )
  `);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_leads_ts ON distribuidor_leads(ts DESC)`);
}

export async function saveLead({ nombre, empresa, whatsapp, email, productos }) {
  await ensureInit(); await ensureLeadsTable();
  await db.execute({ sql: `INSERT INTO distribuidor_leads (nombre, empresa, whatsapp, email, productos) VALUES (?, ?, ?, ?, ?)`, args: [nombre||'', empresa||'', whatsapp||'', email||'', productos||''] });
}
export async function readLeads() {
  await ensureInit(); await ensureLeadsTable();
  const res = await db.execute(`SELECT id, ts, nombre, empresa, whatsapp, email, productos FROM distribuidor_leads ORDER BY id DESC LIMIT 500`);
  return res.rows;
}
export async function resetLeads() {
  await ensureInit(); await ensureLeadsTable();
  await db.execute({ sql: 'DELETE FROM distribuidor_leads', args: [] });
}

// ════════════════════════════════════════════════════════════════════════════
//  RECRUITMENT LEADS — con soporte completo de CV (base64 + tipo)
// ════════════════════════════════════════════════════════════════════════════

async function ensureRecruitmentTable() {
  if (recruitmentReady) return;

  // Tabla base
  await db.execute(`
    CREATE TABLE IF NOT EXISTS recruitment_leads (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      ts         TEXT NOT NULL DEFAULT (datetime('now')),
      nombre     TEXT NOT NULL DEFAULT '',
      email      TEXT NOT NULL DEFAULT '',
      telefono   TEXT NOT NULL DEFAULT '',
      puesto     TEXT NOT NULL DEFAULT '',
      mensaje    TEXT NOT NULL DEFAULT '',
      sessionId  TEXT NOT NULL DEFAULT '',
      estado     TEXT NOT NULL DEFAULT 'nuevo'
    )
  `);

  // ✅ Migraciones — incluye cv_base64 y cv_tipo
  const migraciones = [
    `ALTER TABLE recruitment_leads ADD COLUMN edad        TEXT    DEFAULT ''`,
    `ALTER TABLE recruitment_leads ADD COLUMN estado_rep  TEXT    DEFAULT ''`,
    `ALTER TABLE recruitment_leads ADD COLUMN colonia     TEXT    DEFAULT ''`,
    `ALTER TABLE recruitment_leads ADD COLUMN cv_nombre   TEXT    DEFAULT ''`,
    `ALTER TABLE recruitment_leads ADD COLUMN cv_base64   TEXT    DEFAULT ''`,  // ✅ NUEVO
    `ALTER TABLE recruitment_leads ADD COLUMN cv_tipo     TEXT    DEFAULT ''`,  // ✅ NUEVO
    `ALTER TABLE recruitment_leads ADD COLUMN status      TEXT    DEFAULT 'nuevo'`,
    `ALTER TABLE recruitment_leads ADD COLUMN created_at  TEXT    DEFAULT (datetime('now'))`,
  ];
  for (const sql of migraciones) {
    try { await db.execute(sql); } catch { /* columna ya existe */ }
  }

  try { await db.execute(`CREATE INDEX IF NOT EXISTS idx_recruitment_ts ON recruitment_leads(ts DESC)`); } catch {}

  recruitmentReady = true;
}

// ── Guardar candidato ─────────────────────────────────────────────────────────
export async function saveRecruitmentLead({
  nombre     = '',
  email      = '',
  telefono   = '',
  puesto     = '',
  edad       = '',
  estado_rep = '',
  colonia    = '',
  cvNombre   = '',
  cvBase64   = '',   // ✅ NUEVO
  cvTipo     = '',   // ✅ NUEVO
  mensaje    = '',
  sessionId  = '',
}) {
  await ensureInit();
  await ensureRecruitmentTable();

  let result;

  // ── Intento 1: INSERT completo con CV ──
  try {
    result = await db.execute({
      sql: `
        INSERT INTO recruitment_leads
          (nombre, email, telefono, puesto, edad, estado_rep, colonia,
           cv_nombre, cv_base64, cv_tipo, mensaje, sessionId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [nombre, email, telefono, puesto, edad, estado_rep, colonia,
             cvNombre, cvBase64, cvTipo, mensaje, sessionId],
    });
  } catch (err1) {
    console.warn('⚠️ INSERT completo falló, intentando sin CV base64:', err1.message);

    // ── Intento 2: sin cv_base64/cv_tipo (columnas pueden no existir aún) ──
    try {
      result = await db.execute({
        sql: `
          INSERT INTO recruitment_leads
            (nombre, email, telefono, puesto, edad, estado_rep, colonia,
             cv_nombre, mensaje, sessionId)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [nombre, email, telefono, puesto, edad, estado_rep, colonia,
               cvNombre, mensaje, sessionId],
      });
    } catch (err2) {
      console.warn('⚠️ INSERT sin CV falló, usando mínimo:', err2.message);

      // ── Intento 3: mínimo absoluto ──
      const intentos = [
        { sql: `INSERT INTO recruitment_leads (nombre, email, telefono, puesto, mensaje, estado) VALUES (?, ?, ?, ?, ?, 'nuevo')`, args: [nombre, email, telefono, puesto, mensaje] },
        { sql: `INSERT INTO recruitment_leads (nombre, email, telefono, puesto, estado) VALUES (?, ?, ?, ?, 'nuevo')`, args: [nombre, email, telefono, puesto] },
        { sql: `INSERT INTO recruitment_leads (nombre, puesto) VALUES (?, ?)`, args: [nombre || 'Sin nombre', puesto || 'Sin puesto'] },
      ];

      let lastErr = null;
      for (const intento of intentos) {
        try { result = await db.execute(intento); lastErr = null; break; }
        catch (e) { lastErr = e; }
      }
      if (lastErr) throw lastErr;

      // UPDATE para agregar campos tras INSERT mínimo
      const newId = Number(result.lastInsertRowid);
      try { await db.execute({ sql: `UPDATE recruitment_leads SET sessionId=? WHERE id=?`, args: [sessionId, newId] }); } catch {}
      try { await db.execute({ sql: `UPDATE recruitment_leads SET edad=?, estado_rep=?, colonia=?, cv_nombre=? WHERE id=?`, args: [edad, estado_rep, colonia, cvNombre, newId] }); } catch {}
      try { await db.execute({ sql: `UPDATE recruitment_leads SET cv_base64=?, cv_tipo=? WHERE id=?`, args: [cvBase64, cvTipo, newId] }); } catch {}
    }
  }

  const id = Number(result.lastInsertRowid);
  console.log(`💾 Candidato #${id} guardado → ${nombre} | ${puesto} | ${estado_rep} | CV: ${cvNombre || 'sin CV'}`);
  return { id };
}

// ── Leer candidatos — incluye cv_base64 y cv_tipo ────────────────────────────
export async function readRecruitmentLeads() {
  await ensureInit();
  await ensureRecruitmentTable();

  const res = await db.execute(
    `SELECT * FROM recruitment_leads ORDER BY id DESC LIMIT 500`
  );

  return res.rows.map(r => ({
    id:         r.id         ?? null,
    ts:         r.ts         ?? '',
    created_at: r.created_at ?? r.ts ?? '',
    nombre:     r.nombre     ?? '',
    email:      r.email      ?? '',
    telefono:   r.telefono   ?? '',
    puesto:     r.puesto     ?? '',
    edad:       r.edad       ?? '',
    estado_rep: r.estado_rep ?? '',
    colonia:    r.colonia    ?? '',
    cv_nombre:  r.cv_nombre  ?? '',
    cv_base64:  r.cv_base64  ?? '',   // ✅ NUEVO
    cv_tipo:    r.cv_tipo    ?? '',   // ✅ NUEVO
    mensaje:    r.mensaje    ?? '',
    session_id: r.sessionId  ?? r.session_id ?? '',
    status:     r.status     ?? r.estado ?? 'nuevo',
    estado:     r.estado     ?? r.status ?? 'nuevo',
  }));
}

// ── Actualizar estado ─────────────────────────────────────────────────────────
export async function updateRecruitmentStatus(id, status) {
  await ensureInit();
  await ensureRecruitmentTable();
  const VALID = ['nuevo', 'visto', 'contactado', 'descartado', 'contratado'];
  if (!VALID.includes(status)) return false;
  try {
    await db.execute({ sql: 'UPDATE recruitment_leads SET status = ?, estado = ? WHERE id = ?', args: [status, status, id] });
  } catch {
    try { await db.execute({ sql: 'UPDATE recruitment_leads SET estado = ? WHERE id = ?', args: [status, id] }); } catch {}
  }
  return true;
}

// ── Eliminar candidato ────────────────────────────────────────────────────────
export async function deleteRecruitmentLead(id) {
  await ensureInit();
  await ensureRecruitmentTable();
  await db.execute({ sql: 'DELETE FROM recruitment_leads WHERE id = ?', args: [id] });
}

// ── Reset total ───────────────────────────────────────────────────────────────
export async function resetRecruitmentLeads() {
  await ensureInit();
  await ensureRecruitmentTable();
  recruitmentReady = false;
  await db.execute({ sql: 'DELETE FROM recruitment_leads', args: [] });
  recruitmentReady = true;
}