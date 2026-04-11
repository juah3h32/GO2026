// src/pages/api/cron/daily-reports.js
// Vercel Cron Job — ejecuta CADA HORA para cubrir cualquier horario programado
// En vercel.json: "schedule": "0 * * * *"  (minuto 0 de cada hora, UTC)
import { getTurso } from '../../../lib/turso';

export const prerender = false;

// ── México = UTC-6 fijo (abolió DST en 2023) ─────────────────────────────────
const MX_OFFSET_MS = 6 * 60 * 60 * 1000;
const DAY_NAMES    = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

function getMxDate(utcMs = Date.now()) {
  const d = new Date(utcMs - MX_OFFSET_MS);
  return {
    dateStr: d.toISOString().slice(0, 10),   // "YYYY-MM-DD" en hora MX
    hour:    d.getUTCHours(),
    min:     d.getUTCMinutes(),
    dow:     d.getUTCDay(),
    dom:     d.getUTCDate(),
  };
}

// ── Decide si hay que enviar ahora.
// Lógica: "¿ya pasó la hora programada HOY y no se ha enviado hoy?"
// Funciona sin importar la frecuencia del cron (diario, horario, etc.)
// Devuelve null → enviar  |  string → motivo del salto
function shouldSend(schedule) {
  if (!schedule.active) return 'inactivo';

  const now = getMxDate();
  const schedH = Number(schedule.hour   ?? 9);
  const schedM = Number(schedule.minute ?? 0);

  // ── 1. ¿Es el día correcto? ───────────────────────────────────────────────
  if (schedule.frequency === 'weekly') {
    const d = Number(schedule.day_of_week);
    if (d !== now.dow)
      return `día: hoy ${DAY_NAMES[now.dow]}, programado ${DAY_NAMES[d]}`;
  }
  if (schedule.frequency === 'monthly') {
    const d = Number(schedule.day_of_month);
    if (d !== now.dom)
      return `día del mes: hoy ${now.dom}, programado ${d}`;
  }

  // ── 2. ¿Ya pasó la hora programada hoy? ──────────────────────────────────
  const totalNow   = now.hour * 60 + now.min;
  const totalSched = schedH  * 60 + schedM;
  if (totalNow < totalSched) {
    return `aún no: programado ${String(schedH).padStart(2,'0')}:${String(schedM).padStart(2,'0')}, ahora ${String(now.hour).padStart(2,'0')}:${String(now.min).padStart(2,'0')} MX`;
  }

  // ── 3. ¿Ya se envió hoy DESPUÉS de la hora programada? (anti-duplicado) ──
  if (schedule.last_sent) {
    const sentMx    = getMxDate(new Date(schedule.last_sent).getTime());
    const sentTotal = sentMx.hour * 60 + sentMx.min;
    // Solo bloquear si el envío fue hoy Y ocurrió a partir de la hora programada
    // (si fue un envío manual antes de la hora, el automático igual debe correr)
    if (sentMx.dateStr === now.dateStr && sentTotal >= totalSched)
      return 'ya enviado hoy';
  }

  return null; // ✅ enviar
}

async function runCron({ forceAll = false, baseUrl = 'https://grupo-ortiz.com' } = {}) {
  const results = [];
  const nowUTC = new Date().toISOString();
  console.log(`[cron/daily-reports] Inicio: ${nowUTC} forceAll=${forceAll}`);

  try {
    const db = getTurso();
    const { rows } = await db.execute('SELECT * FROM report_schedules WHERE active=1');
    const { rows: allRows } = await db.execute('SELECT id FROM report_schedules');
    console.log(`[cron] ${rows.length} activos de ${allRows.length} totales`);

    for (const row of rows) {
      const schedule = {
        ...row,
        phones: JSON.parse(row.phones || '[]'),
        active: row.active === 1,
      };

      if (!forceAll) {
        const skipReason = shouldSend(schedule);
        console.log(`[cron] schedule ${row.id} "${row.name}" → skipReason="${skipReason}" | freq=${row.frequency} dow=${row.day_of_week} hour=${row.hour} min=${row.minute} last_sent=${row.last_sent}`);
        if (skipReason !== null) {
          results.push({ id: row.id, name: row.name, skipped: true, reason: skipReason });
          continue;
        }
      }

      console.log(`[cron] Enviando schedule ${row.id} "${row.name}" (${row.report_type} / ${row.period})`);

      // 3. Llamar al endpoint de envío
      try {
        const res = await fetch(`${baseUrl}/api/reports/send-now`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            schedule_id:  row.id,
            report_type:  row.report_type,
            period:       row.period,
            period_from:  row.period_from  || null,   // ← fix: faltaban estos
            period_to:    row.period_to    || null,   // ← fix
            phones:       schedule.phones,
          }),
        });
        const json = await res.json();
        console.log(`[cron] Schedule ${row.id} resultado:`, JSON.stringify(json.results));
        results.push({ id: row.id, name: row.name, sent: true, results: json.results });
      } catch (sendErr) {
        console.error(`[cron] Error enviando schedule ${row.id}:`, sendErr);
        results.push({ id: row.id, name: row.name, error: String(sendErr) });
      }
    }

    console.log(`[cron/daily-reports] Fin. ${results.filter(r=>r.sent).length} enviados, ${results.filter(r=>r.skipped).length} saltados`);

    return new Response(
      JSON.stringify({ ok: true, ran: results.length, results, ts: nowUTC, total: allRows.length, active: rows.length }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[cron/daily-reports] Error fatal:', err);
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 500 }
    );
  }
}

// GET — llamado por Vercel Cron (requiere CRON_SECRET si está configurado)
export async function GET({ request }) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = import.meta.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  const baseUrl = new URL(request.url).origin;
  return runCron({ baseUrl });
}

// POST — disparo manual desde el panel de admin (ignora ventana horaria, envía todas las activas)
export async function POST({ request }) {
  const baseUrl = new URL(request.url).origin;
  return runCron({ forceAll: true, baseUrl });
}
