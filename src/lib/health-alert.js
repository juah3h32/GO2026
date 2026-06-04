/*!
 * GO2026 — Sitio Web Oficial de Grupo Ortiz
 * Copyright (c) 2026 JUAN PABLO CORONA CORONA — Desarrollador Web.
 * Todos los derechos reservados. Licencia propietaria (ver LICENSE).
 * Prohibida su copia, modificacion o distribucion sin autorizacion escrita.
 */
// src/lib/health-alert.js
// Alerta automática de salud: si hay errores/criticos/seguridad NUEVOS,
// Claude los diagnostica y se envía aviso por WhatsApp a los autorizados.
// Se dispara desde wa-poll (cada corrida). Anti-spam: máx 1 alerta cada 30 min.
import { getLogStats, getSystemLogs, getWAAuthorized, logSystemEvent, markLogsSeen } from './analytics-db.js';
import { diagnoseSystem } from './claude-diagnose.js';
import { sendWAText } from './notify.js';

const MIN_INTERVAL_MS = 30 * 60 * 1000;
let _lastAlertAt = 0; // por instancia; el flag `seen` en DB es el control real

// Envia un aviso por WhatsApp a los admins totales (permiso '*'). Reusable para
// alertas de login, almacenamiento, etc. Fire-and-forget; no lanza.
export async function notifyAdmins(text) {
  try {
    const auth = (await getWAAuthorized().catch(() => []))
      .filter(a => a.active && a.phone && (a.permissions || []).includes('*'));
    let sent = 0;
    for (const a of auth.slice(0, 5)) {
      try { await sendWAText(a.phone, text); sent++; } catch { /* ignora envio individual */ }
    }
    return sent;
  } catch { return 0; }
}

export async function checkAndAlert() {
  try {
    const stats = await getLogStats();
    if (!stats.unseenAlerts) return { alerted: false, reason: 'sin alertas nuevas' };
    if (Date.now() - _lastAlertAt < MIN_INTERVAL_MS) return { alerted: false, reason: 'anti-spam' };

    // Alertar solo por fallas que importan: críticos o seguridad (no errores sueltos del frontend).
    const criticalLogs = await getSystemLogs({ limit: 30 });
    const hayGrave = criticalLogs.some(l => (l.level === 'critical' || l.level === 'security') && !l.seen);
    if (!hayGrave) return { alerted: false, reason: 'sin eventos graves nuevos' };

    const logs = criticalLogs;
    const d = await diagnoseSystem({ stats, logs });
    const texto = d.ok && d.text
      ? `*ANALYTIC BOT JP* — alerta\ngrupo-ortiz.com\n\n${d.text}`
      : `*ANALYTIC BOT JP*: hay ${stats.unseenAlerts} eventos nuevos (errores/seguridad). Revisa el panel.`;

    // Avisar SOLO a admins totales (permiso '*'). Permisos limitados (RH, etc.)
    // no reciben alertas de sistema.
    const auth = (await getWAAuthorized().catch(() => []))
      .filter(a => a.active && a.phone && (a.permissions || []).includes('*'));
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