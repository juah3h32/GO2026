// src/lib/health-alert.js
// Alerta automática de salud: si hay errores/criticos/seguridad NUEVOS,
// Claude los diagnostica y se envía aviso por WhatsApp a los autorizados.
// Se dispara desde wa-poll (cada corrida). Anti-spam: máx 1 alerta cada 30 min.
import { getLogStats, getSystemLogs, getWAAuthorized, logSystemEvent, markLogsSeen } from './analytics-db.js';
import { diagnoseSystem } from './claude-diagnose.js';
import { sendWAText } from './notify.js';

const MIN_INTERVAL_MS = 30 * 60 * 1000;
let _lastAlertAt = 0; // por instancia; el flag `seen` en DB es el control real

export async function checkAndAlert() {
  try {
    const stats = await getLogStats();
    // Solo alertar si hay alertas NUEVAS (no vistas) de nivel error/critical/security
    if (!stats.unseenAlerts) return { alerted: false, reason: 'sin alertas nuevas' };
    if (Date.now() - _lastAlertAt < MIN_INTERVAL_MS) return { alerted: false, reason: 'anti-spam' };

    const logs = await getSystemLogs({ limit: 30 });
    const d = await diagnoseSystem({ stats, logs });
    const texto = d.ok && d.text
      ? `*Alerta del sistema — grupo-ortiz.com*\n\n${d.text}`
      : `*Alerta del sistema*: hay ${stats.unseenAlerts} eventos nuevos (errores/seguridad). Revisa el panel.`;

    // Avisar a los números autorizados (admins)
    const auth = (await getWAAuthorized().catch(() => [])).filter(a => a.active && a.phone);
    let sent = 0;
    for (const a of auth.slice(0, 5)) {
      try { await sendWAText(a.phone, texto); sent++; } catch (e) { console.error('[health-alert] envio:', e.message); }
    }

    if (sent > 0) {
      _lastAlertAt = Date.now();
      await markLogsSeen().catch(() => {});
      logSystemEvent({ level: 'info', category: 'monitor', source: 'health-alert', message: `Alerta enviada a ${sent} admin(s)` }).catch(() => {});
    }
    return { alerted: sent > 0, sent };
  } catch (e) {
    console.error('[health-alert]', e.message);
    return { alerted: false, error: e.message };
  }
}
