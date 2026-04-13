// src/lib/analytics-db.js
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

    CREATE INDEX IF NOT EXISTS idx_messages_ts  ON messages(ts DESC);
    CREATE INDEX IF NOT EXISTS idx_daily_date   ON daily(date DESC);
    CREATE INDEX IF NOT EXISTS idx_products_count   ON products(count DESC);
    CREATE INDEX IF NOT EXISTS idx_keywords_count   ON keywords(count DESC);
  `);

  const hourInitQueries = [];
  for (let i = 0; i < 24; i++) {
    hourInitQueries.push({ sql: 'INSERT OR IGNORE INTO hourly (hour, count) VALUES (?, 0)', args: [i] });
  }
  await db.batch(hourInitQueries, 'write');

  isInitialized = true;

  // Safe migration: add session_id to existing messages table if missing
  try { await db.execute(`ALTER TABLE messages ADD COLUMN session_id TEXT NOT NULL DEFAULT ''`); } catch {}
  try { await db.execute(`CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id)`); } catch {}
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
  sessionId    = '',
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
    sql:  "INSERT INTO messages (ts,user_msg,bot_reply,lang,intent,product,session_id) VALUES (datetime('now'),?,?,?,?,?,?)",
    args: [userMessage.substring(0,400), botReply?.substring(0,600) || null, language, intent, product, sessionId||''],
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

export async function readConversations({ limit = 50, offset = 0, search = '' } = {}) {
  await ensureInit();

  // Get unique sessions with their stats
  const sessionsRes = await db.execute({
    sql: `
      SELECT
        session_id,
        MIN(ts) as started_at,
        MAX(ts) as last_ts,
        COUNT(*) as msg_count,
        GROUP_CONCAT(DISTINCT intent) as intents,
        GROUP_CONCAT(DISTINCT product) as products
      FROM messages
      WHERE session_id != ''
      GROUP BY session_id
      ORDER BY last_ts DESC
      LIMIT ? OFFSET ?
    `,
    args: [limit, offset],
  });

  const sessions = sessionsRes.rows.map(r => ({
    session_id: r.session_id,
    started_at: r.started_at,
    last_ts:    r.last_ts,
    msg_count:  r.msg_count,
    intents:    r.intents ? r.intents.split(',').filter(Boolean) : [],
    products:   r.products ? r.products.split(',').filter(Boolean) : [],
  }));

  return { sessions };
}

export async function readSessionMessages(sessionId) {
  await ensureInit();
  const res = await db.execute({
    sql: `SELECT id, ts, user_msg, bot_reply, intent, product FROM messages WHERE session_id = ? ORDER BY id ASC`,
    args: [sessionId],
  });
  return res.rows;
}

// ─── DISTRIBUIDOR LEADS ───────────────────────────────────────────────────────
async function ensureLeadsTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS distribuidor_leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts TEXT NOT NULL DEFAULT (datetime('now')),
      nombre TEXT NOT NULL DEFAULT '', empresa TEXT NOT NULL DEFAULT '',
      whatsapp TEXT NOT NULL DEFAULT '', email TEXT NOT NULL DEFAULT '',
      productos TEXT NOT NULL DEFAULT '', comentarios TEXT NOT NULL DEFAULT ''
    )
  `);
  try { await db.execute(`ALTER TABLE distribuidor_leads ADD COLUMN comentarios TEXT NOT NULL DEFAULT ''`); } catch {}
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_leads_ts ON distribuidor_leads(ts DESC)`);
}

export async function saveLead({ nombre, empresa, whatsapp, email, productos, comentarios = '' }) {
  await ensureInit(); await ensureLeadsTable();
  await db.execute({ sql: `INSERT INTO distribuidor_leads (nombre, empresa, whatsapp, email, productos, comentarios) VALUES (?, ?, ?, ?, ?, ?)`, args: [nombre||'', empresa||'', whatsapp||'', email||'', productos||'', comentarios||''] });
}
export async function readLeads() {
  await ensureInit(); await ensureLeadsTable();
  const res = await db.execute(`SELECT id, ts, nombre, empresa, whatsapp, email, productos, comentarios FROM distribuidor_leads ORDER BY id DESC LIMIT 500`);
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
    `ALTER TABLE recruitment_leads ADD COLUMN comentarios       TEXT    DEFAULT ''`,
    `ALTER TABLE recruitment_leads ADD COLUMN en_lista_espera   INTEGER DEFAULT 0`,
    `ALTER TABLE recruitment_leads ADD COLUMN notificado_vacante INTEGER DEFAULT 0`,
    `ALTER TABLE recruitment_leads ADD COLUMN prioridad          INTEGER DEFAULT 0`,
  ];
  for (const sql of migraciones) {
    try { await db.execute(sql); } catch { /* columna ya existe */ }
  }

  try { await db.execute(`CREATE INDEX IF NOT EXISTS idx_recruitment_ts ON recruitment_leads(ts DESC)`); } catch {}

  recruitmentReady = true;
}

// ── Guardar candidato ─────────────────────────────────────────────────────────
export async function saveRecruitmentLead({
  nombre          = '',
  email           = '',
  telefono        = '',
  puesto          = '',
  edad            = '',
  estado_rep      = '',
  colonia         = '',
  cvNombre        = '',
  cvBase64        = '',
  cvTipo          = '',
  mensaje         = '',
  comentarios     = '',
  sessionId       = '',
  en_lista_espera = 0,
}) {
  await ensureInit();
  await ensureRecruitmentTable();

  // ── Anti-duplicados ───────────────────────────────────────────────────────
  // Solo bloquea si misma persona (email o teléfono) Y mismo puesto.
  // Permite que la misma persona se registre para vacantes distintas.
  try {
    const contactConditions = [];
    const contactArgs       = [];

    if (email && email.trim()) {
      contactConditions.push(`(LOWER(TRIM(email)) = LOWER(TRIM(?)))`);
      contactArgs.push(email.trim());
    }
    if (telefono && telefono.trim()) {
      const tel = telefono.replace(/[\s\-()]/g, '');
      contactConditions.push(`(REPLACE(REPLACE(REPLACE(telefono,' ',''),'-',''),'(','') LIKE ?)`);
      contactArgs.push(`%${tel}%`);
    }

    if (contactConditions.length > 0) {
      // Requiere que coincida el contacto Y el puesto para considerar duplicado
      const puestoNorm = (puesto || '').trim().toLowerCase();
      const { rows } = await db.execute({
        sql:  `SELECT id, nombre, email, telefono, puesto FROM recruitment_leads WHERE (${contactConditions.join(' OR ')}) AND LOWER(TRIM(COALESCE(puesto,''))) = ? LIMIT 1`,
        args: [...contactArgs, puestoNorm],
      });
      if (rows.length > 0) {
        const existing = rows[0];
        console.log(`⚠️ Duplicado: #${existing.id} — ${existing.nombre} ya registrado para "${existing.puesto}"`);
        return { id: Number(existing.id), duplicate: true, existingNombre: existing.nombre, existingPuesto: existing.puesto };
      }
    }
  } catch (dupErr) {
    console.warn('⚠️ Verificación de duplicado falló, continuando:', dupErr.message);
  }

  let result;

  // ── Intento 1: INSERT completo con CV ──
  try {
    result = await db.execute({
      sql: `
        INSERT INTO recruitment_leads
          (nombre, email, telefono, puesto, edad, estado_rep, colonia,
           cv_nombre, cv_base64, cv_tipo, mensaje, comentarios, sessionId, en_lista_espera)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [nombre, email, telefono, puesto, edad, estado_rep, colonia,
             cvNombre, cvBase64, cvTipo, mensaje, comentarios, sessionId, en_lista_espera ? 1 : 0],
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

// ── Verificación anticipada de duplicado por teléfono ────────────────────────
export async function checkDuplicateByPhone(telefono) {
  if (!telefono) return null;
  const clean = String(telefono).replace(/\D/g, '');
  if (clean.length < 7) return null;
  const suffix = clean.slice(-10);
  await ensureInit();
  await ensureRecruitmentTable();
  const { rows } = await db.execute({
    sql: `SELECT id, nombre, puesto FROM recruitment_leads
          WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(telefono,' ',''),'-',''),'(',''),')',''),'+','')
          LIKE ? LIMIT 1`,
    args: [`%${suffix}%`],
  });
  return rows.length > 0 ? rows[0] : null;
}
export async function checkDuplicateByName(nombre) {
  if (!nombre || nombre.trim().length < 3) return null;
  const clean = nombre.trim().toLowerCase();
  await ensureInit();
  await ensureRecruitmentTable();
  const { rows } = await db.execute({
    sql: `SELECT id, nombre, puesto FROM recruitment_leads
          WHERE LOWER(TRIM(nombre)) = ? LIMIT 1`,
    args: [clean],
  });
  return rows.length > 0 ? rows[0] : null;
}
 
// ── Verificación anticipada de duplicado por email ────────────────────────────
export async function checkDuplicateByEmail(email) {
  if (!email || !email.includes('@')) return null;
  const clean = email.trim().toLowerCase();
  await ensureInit();
  await ensureRecruitmentTable();
  const { rows } = await db.execute({
    sql: `SELECT id, nombre, puesto FROM recruitment_leads
          WHERE LOWER(TRIM(email)) = ? LIMIT 1`,
    args: [clean],
  });
  return rows.length > 0 ? rows[0] : null;
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
    mensaje:     r.mensaje     ?? '',
    comentarios: r.comentarios ?? '',
    session_id:  r.sessionId   ?? r.session_id ?? '',
    status:              r.status              ?? r.estado ?? 'nuevo',
    estado:              r.estado              ?? r.status ?? 'nuevo',
    en_lista_espera:     r.en_lista_espera     ? 1 : 0,
    notificado_vacante:  r.notificado_vacante  ? 1 : 0,
    prioridad:           r.prioridad           ? 1 : 0,
  }));
}

// ── Lista de espera: candidatos sin vacante activa al momento de registrarse ──
export async function getListaEspera(puestoFilter = null) {
  await ensureInit();
  await ensureRecruitmentTable();
  let sql  = `SELECT id, nombre, telefono, email, puesto, ts, created_at, notificado_vacante
              FROM recruitment_leads WHERE en_lista_espera = 1`;
  const args = [];
  if (puestoFilter && puestoFilter.trim()) {
    sql += ` AND LOWER(TRIM(puesto)) LIKE ?`;
    args.push(`%${puestoFilter.trim().toLowerCase()}%`);
  }
  sql += ` ORDER BY id DESC LIMIT 300`;
  const { rows } = await db.execute({ sql, args });
  return rows.map(r => ({
    id:                 Number(r.id),
    nombre:             r.nombre             ?? '',
    telefono:           r.telefono           ?? '',
    email:              r.email              ?? '',
    puesto:             r.puesto             ?? '',
    ts:                 r.ts                 ?? r.created_at ?? '',
    notificado_vacante: r.notificado_vacante ? 1 : 0,
  }));
}

// ── Asignar candidatos de espera a una vacante recién abierta ────────────────
// Busca candidatos con en_lista_espera=1 cuyo puesto coincida con el título
// de la vacante. Los saca de espera y les pone prioridad=1.
// Devuelve la cantidad de candidatos promovidos.
export async function asignarEsperaAVacante(vacanteTitle) {
  await ensureInit();
  await ensureRecruitmentTable();
  try {
    const { rows } = await db.execute({
      sql:  `SELECT id, puesto FROM recruitment_leads WHERE en_lista_espera = 1`,
      args: [],
    });
    const titulo = (vacanteTitle || '').toLowerCase().trim();
    const words  = titulo.split(/\s+/).filter(w => w.length > 3);

    const matching = rows.filter(r => {
      const p = (r.puesto || '').toLowerCase().trim();
      if (!p) return false;
      return titulo.includes(p) || p.includes(titulo) || words.some(w => p.includes(w));
    });

    if (!matching.length) return 0;

    const ids = matching.map(r => r.id);
    const placeholders = ids.map(() => '?').join(',');
    await db.execute({
      sql:  `UPDATE recruitment_leads SET en_lista_espera = 0, prioridad = 1 WHERE id IN (${placeholders})`,
      args: ids,
    });
    console.log(`[asignarEsperaAVacante] ${ids.length} candidato(s) promovidos a prioridad para "${vacanteTitle}"`);
    return ids.length;
  } catch (e) {
    console.warn('[asignarEsperaAVacante] error:', e.message);
    return 0;
  }
}

// ── Marcar candidatos de lista de espera como notificados ─────────────────────
export async function markNotificadosVacante(ids) {
  await ensureInit();
  await ensureRecruitmentTable();
  if (!ids || ids.length === 0) return;
  const placeholders = ids.map(() => '?').join(',');
  try {
    await db.execute({ sql: `UPDATE recruitment_leads SET notificado_vacante = 1 WHERE id IN (${placeholders})`, args: ids });
  } catch (e) { console.warn('markNotificadosVacante error:', e.message); }
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

// ════════════════════════════════════════════════════════════════════════════
//  RECRUITER NOTES — notas internas de seguimiento por candidato
// ════════════════════════════════════════════════════════════════════════════

let notesReady = false;

async function ensureNotesTable() {
  if (notesReady) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS recruiter_notes (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      candidate_id INTEGER NOT NULL,
      nota         TEXT    NOT NULL DEFAULT '',
      created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);
  try { await db.execute(`CREATE INDEX IF NOT EXISTS idx_notes_candidate ON recruiter_notes(candidate_id, created_at DESC)`); } catch {}
  notesReady = true;
}

export async function addRecruiterNote({ candidateId, nota }) {
  await ensureInit();
  await ensureNotesTable();
  const result = await db.execute({
    sql:  `INSERT INTO recruiter_notes (candidate_id, nota) VALUES (?, ?)`,
    args: [candidateId, (nota || '').trim()],
  });
  return { id: Number(result.lastInsertRowid) };
}

export async function getRecruiterNotes(candidateId) {
  await ensureInit();
  await ensureNotesTable();
  const res = await db.execute({
    sql:  `SELECT id, nota, created_at FROM recruiter_notes WHERE candidate_id = ? ORDER BY created_at DESC`,
    args: [candidateId],
  });
  return res.rows.map(r => ({ id: r.id, nota: r.nota, created_at: r.created_at }));
}

export async function deleteRecruiterNote(noteId) {
  await ensureInit();
  await ensureNotesTable();
  await db.execute({ sql: `DELETE FROM recruiter_notes WHERE id = ?`, args: [noteId] });
}

// ── Reset total ───────────────────────────────────────────────────────────────
export async function resetRecruitmentLeads() {
  await ensureInit();
  await ensureRecruitmentTable();
  recruitmentReady = false;
  await db.execute({ sql: 'DELETE FROM recruitment_leads', args: [] });
  recruitmentReady = true;
}

// ════════════════════════════════════════════════════════════════════════════
//  CANDIDATE NOTIFICATIONS — configuración de alertas de nuevo candidato
// ════════════════════════════════════════════════════════════════════════════

let candidateNotifReady = false;

async function ensureCandidateNotifTable() {
  if (candidateNotifReady) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS candidate_notifications (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      name             TEXT    NOT NULL DEFAULT '',
      phones           TEXT    NOT NULL DEFAULT '[]',
      caption_template TEXT    NOT NULL DEFAULT '',
      active           INTEGER NOT NULL DEFAULT 1,
      last_sent        TEXT,
      created_at       TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);
  // Migración segura para tablas existentes
  try { await db.execute(`ALTER TABLE candidate_notifications ADD COLUMN caption_template TEXT NOT NULL DEFAULT ''`); } catch {}
  candidateNotifReady = true;
}

export async function saveCandidateNotification({ name, phones = [], caption_template = '', active = true }) {
  await ensureInit();
  await ensureCandidateNotifTable();
  const result = await db.execute({
    sql:  `INSERT INTO candidate_notifications (name, phones, caption_template, active) VALUES (?, ?, ?, ?)`,
    args: [name, JSON.stringify(phones), caption_template, active ? 1 : 0],
  });
  return { id: Number(result.lastInsertRowid) };
}

export async function readCandidateNotifications() {
  await ensureInit();
  await ensureCandidateNotifTable();
  const res = await db.execute(
    `SELECT id, name, phones, caption_template, active, last_sent, created_at FROM candidate_notifications ORDER BY id ASC`
  );
  return res.rows.map(r => ({
    id:               r.id,
    name:             r.name,
    phones:           (() => { try { return JSON.parse(r.phones); } catch { return []; } })(),
    caption_template: r.caption_template || '',
    active:           !!r.active,
    last_sent:        r.last_sent,
    created_at:       r.created_at,
  }));
}

export async function updateCandidateNotification({ id, name, phones, caption_template = '', active }) {
  await ensureInit();
  await ensureCandidateNotifTable();
  await db.execute({
    sql:  `UPDATE candidate_notifications SET name=?, phones=?, caption_template=?, active=? WHERE id=?`,
    args: [name, JSON.stringify(phones), caption_template, active ? 1 : 0, id],
  });
}

export async function deleteCandidateNotification(id) {
  await ensureInit();
  await ensureCandidateNotifTable();
  await db.execute({ sql: `DELETE FROM candidate_notifications WHERE id=?`, args: [id] });
}

export async function touchCandidateNotifLastSent(id) {
  await ensureInit();
  await ensureCandidateNotifTable();
  await db.execute({
    sql:  `UPDATE candidate_notifications SET last_sent=? WHERE id=?`,
    args: [new Date().toISOString(), id],
  });
}

// ════════════════════════════════════════════════════════════════════════════
//  GLOBAL CONFIG — clave/valor para ajustes del sistema (ej: beneficios)
// ════════════════════════════════════════════════════════════════════════════

let configReady = false;
async function ensureConfigTable() {
  if (configReady) return;
  await db.execute(`CREATE TABLE IF NOT EXISTS global_config (key TEXT PRIMARY KEY, value TEXT NOT NULL DEFAULT '')`);
  configReady = true;
}

export async function getConfig(key) {
  await ensureInit();
  await ensureConfigTable();
  const r = await db.execute({ sql: `SELECT value FROM global_config WHERE key=?`, args: [key] });
  return r.rows[0]?.value ?? null;
}

export async function setConfig(key, value) {
  await ensureInit();
  await ensureConfigTable();
  await db.execute({ sql: `INSERT INTO global_config (key, value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`, args: [key, value] });
}

// ════════════════════════════════════════════════════════════════════════════
//  VACANTES — gestión de vacantes publicadas en la página pública
// ════════════════════════════════════════════════════════════════════════════

let vacantesReady = false;

async function ensureVacantesTable() {
  if (vacantesReady) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS vacantes (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo     TEXT    NOT NULL DEFAULT '',
      area       TEXT    NOT NULL DEFAULT '',
      ubicacion  TEXT    NOT NULL DEFAULT 'Morelia, Mich.',
      tags       TEXT    NOT NULL DEFAULT '[]',
      activa     INTEGER NOT NULL DEFAULT 1,
      orden      INTEGER NOT NULL DEFAULT 0,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Migraciones: Agregamos SALARIO, TIPO, HORARIO, DESCRIPCION y REQUISITOS
  const migraciones = [
    `ALTER TABLE vacantes ADD COLUMN tipo TEXT DEFAULT ''`,
    `ALTER TABLE vacantes ADD COLUMN horario TEXT DEFAULT ''`,
    `ALTER TABLE vacantes ADD COLUMN salario TEXT DEFAULT ''`,
    `ALTER TABLE vacantes ADD COLUMN descripcion TEXT DEFAULT ''`,
    `ALTER TABLE vacantes ADD COLUMN requisitos TEXT DEFAULT ''`,
    `ALTER TABLE vacantes ADD COLUMN multiples INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE vacantes ADD COLUMN empresa TEXT NOT NULL DEFAULT ''`,
  ];
  
  for (const sql of migraciones) {
    try { await db.execute(sql); } catch { /* La columna ya existe, ignoramos el error */ }
  }
  
  vacantesReady = true;
}

export async function saveVacante({ titulo, area, tipo = '', ubicacion = 'Morelia, Mich.', horario = '', salario = '', descripcion = '', requisitos = '', activa = true, orden = 0, multiples = false, empresa = '' }) {
  await ensureInit();
  await ensureVacantesTable();
  const result = await db.execute({
    sql:  `INSERT INTO vacantes (titulo, area, tipo, ubicacion, horario, salario, descripcion, requisitos, activa, orden, multiples, empresa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [titulo, area, tipo, ubicacion, horario, salario, descripcion, requisitos, activa ? 1 : 0, orden, multiples ? 1 : 0, empresa || ''],
  });
  return { id: Number(result.lastInsertRowid) };
}

export async function readVacantes(onlyActive = false) {
  await ensureInit(); 
  await ensureVacantesTable();
  
  const sql = onlyActive 
    ? `SELECT * FROM vacantes WHERE activa = 1 ORDER BY orden ASC, id ASC` 
    : `SELECT * FROM vacantes ORDER BY orden ASC, id ASC`;
    
  const res = await db.execute(sql);
  
  return res.rows.map(r => ({
    id:          r.id,
    titulo:      r.titulo,
    area:        r.area,
    tipo:        r.tipo || '',
    ubicacion:   r.ubicacion || 'Morelia, Mich.',
    horario:     r.horario || '',
    salario:     r.salario || '',
    descripcion: r.descripcion || '',
    requisitos:  r.requisitos || '',
    activa:      !!r.activa,
    multiples:   !!r.multiples,
    empresa:     r.empresa || '',
  }));
}

export async function updateVacante({ id, titulo, area, tipo, ubicacion, horario, salario, descripcion, requisitos, activa, orden, multiples = false, empresa = '' }) {
  await ensureInit();
  await ensureVacantesTable();
  await db.execute({
    sql:  `UPDATE vacantes SET titulo=?, area=?, tipo=?, ubicacion=?, horario=?, salario=?, descripcion=?, requisitos=?, activa=?, orden=?, multiples=?, empresa=? WHERE id=?`,
    args: [titulo, area, tipo || '', ubicacion || 'Morelia, Mich.', horario || '', salario || '', descripcion || '', requisitos || '', activa ? 1 : 0, orden || 0, multiples ? 1 : 0, empresa || '', id],
  });
}

export async function deleteVacante(id) {
  await ensureInit(); 
  await ensureVacantesTable();
  await db.execute({ sql: `DELETE FROM vacantes WHERE id=?`, args: [id] });
}

export async function toggleVacante(id, activa) {
  await ensureInit(); 
  await ensureVacantesTable();
  await db.execute({ sql: `UPDATE vacantes SET activa=? WHERE id=?`, args: [activa ? 1 : 0, id] });
}