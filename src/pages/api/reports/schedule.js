// src/pages/api/reports/schedule.js
// CRUD para programación de envíos automáticos de reportes vía WhatsApp
import { getTurso } from '../../../lib/turso';

export const prerender = false;

async function ensureTable(db) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS report_schedules (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      report_type TEXT    NOT NULL DEFAULT 'general',
      frequency   TEXT    NOT NULL DEFAULT 'weekly',
      day_of_week INTEGER DEFAULT 1,
      day_of_month INTEGER DEFAULT 1,
      hour        INTEGER DEFAULT 9,
      minute      INTEGER DEFAULT 0,
      phones      TEXT    NOT NULL DEFAULT '[]',
      period      TEXT    NOT NULL DEFAULT '7d',
      active      INTEGER DEFAULT 1,
      last_sent   TEXT,
      created_at  TEXT    DEFAULT (datetime('now'))
    )
  `);
  try { await db.execute(`ALTER TABLE report_schedules ADD COLUMN minute      INTEGER DEFAULT 0`);   } catch {}
  try { await db.execute(`ALTER TABLE report_schedules ADD COLUMN period_from TEXT`);                 } catch {}
  try { await db.execute(`ALTER TABLE report_schedules ADD COLUMN period_to   TEXT`);                 } catch {}
}

export async function GET() {
  try {
    const db = getTurso();
    await ensureTable(db);
    const { rows } = await db.execute('SELECT * FROM report_schedules ORDER BY id DESC');
    const schedules = rows.map(r => ({
      ...r,
      phones: JSON.parse(r.phones || '[]'),
      active: r.active === 1,
    }));
    return new Response(JSON.stringify({ ok: true, schedules }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const body   = await request.json();
    const { action } = body;
    const db     = getTurso();
    await ensureTable(db);

    // ── CREAR ────────────────────────────────────────────────────────────────
    if (action === 'create') {
      const { name, report_type, frequency, day_of_week, day_of_month, hour, phones, period, period_from, period_to } = body;
      if (!name || !report_type || !phones?.length) {
        return new Response(JSON.stringify({ ok: false, error: 'Faltan campos requeridos' }), { status: 400 });
      }
      await db.execute({
        sql: `INSERT INTO report_schedules (name, report_type, frequency, day_of_week, day_of_month, hour, minute, phones, period, period_from, period_to)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          name, report_type || 'general', frequency || 'weekly',
          day_of_week ?? 1, day_of_month ?? 1, hour ?? 9, body.minute ?? 0,
          JSON.stringify(phones || []),
          period || '7d', period_from || null, period_to || null,
        ],
      });
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }

    // ── ACTUALIZAR ────────────────────────────────────────────────────────────
    if (action === 'update') {
      const { id, name, report_type, frequency, day_of_week, day_of_month, hour, phones, period, period_from, period_to, active } = body;
      if (!id) return new Response(JSON.stringify({ ok: false, error: 'Falta id' }), { status: 400 });
      await db.execute({
        sql: `UPDATE report_schedules
              SET name=?, report_type=?, frequency=?, day_of_week=?, day_of_month=?,
                  hour=?, minute=?, phones=?, period=?, period_from=?, period_to=?, active=?
              WHERE id=?`,
        args: [
          name, report_type, frequency,
          day_of_week ?? 1, day_of_month ?? 1, hour ?? 9, body.minute ?? 0,
          JSON.stringify(phones || []),
          period, period_from || null, period_to || null, active ? 1 : 0, id,
        ],
      });
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }

    // ── ELIMINAR ──────────────────────────────────────────────────────────────
    if (action === 'delete') {
      const { id } = body;
      if (!id) return new Response(JSON.stringify({ ok: false, error: 'Falta id' }), { status: 400 });
      await db.execute({ sql: 'DELETE FROM report_schedules WHERE id=?', args: [id] });
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ ok: false, error: 'Acción desconocida' }), { status: 400 });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}
