// src/lib/push.js — SERVER ONLY
// Lógica de envío push — importable directamente desde API routes del servidor.
if (typeof window !== 'undefined') throw new Error('[push.js] Este módulo solo puede usarse en el servidor.');
import webpush from 'web-push';
import { createClient } from '@libsql/client';

function getDb() {
  return createClient({
    url:       process.env.TURSO_DATABASE_URL || import.meta.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN   || import.meta.env.TURSO_AUTH_TOKEN,
  });
}

async function ensurePushTable(db) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      endpoint  TEXT    NOT NULL UNIQUE,
      p256dh    TEXT    NOT NULL,
      auth      TEXT    NOT NULL,
      created   TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

/**
 * Envía una notificación push a todos los suscriptores guardados.
 * @param {{ title: string, body: string, url?: string }} payload
 * @returns {{ sent: number, failed: number, skipped: number }}
 */
export async function sendPushToAll({ title, body, url = '/es/vacantes' }) {
  const publicKey  = process.env.VAPID_PUBLIC_KEY  || import.meta.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY || import.meta.env.VAPID_PRIVATE_KEY;
  const subject    = process.env.VAPID_SUBJECT      || import.meta.env.VAPID_SUBJECT || 'mailto:rh@grupo-ortiz.com';

  if (!publicKey || !privateKey) {
    console.warn('[push] VAPID no configurado — omitiendo envío');
    return { sent: 0, failed: 0, skipped: 1 };
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);

  const db = getDb();
  await ensurePushTable(db);

  const { rows } = await db.execute('SELECT endpoint, p256dh, auth FROM push_subscriptions');

  if (!rows.length) {
    console.log('[push] Sin suscriptores registrados');
    return { sent: 0, failed: 0, skipped: 0 };
  }

  const notification = JSON.stringify({ title, body, url });
  let sent = 0, failed = 0;
  const toDelete = [];

  await Promise.allSettled(
    rows.map(async (row) => {
      try {
        await webpush.sendNotification(
          { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } },
          notification
        );
        sent++;
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) toDelete.push(row.endpoint);
        failed++;
        console.error('[push] Error enviando a', row.endpoint?.slice(0, 40), err.statusCode);
      }
    })
  );

  // Limpiar suscripciones expiradas
  for (const ep of toDelete) {
    await db.execute({ sql: 'DELETE FROM push_subscriptions WHERE endpoint = ?', args: [ep] });
  }

  console.log(`[push] ✓ Enviadas: ${sent} | Fallidas: ${failed} | Total suscriptores: ${rows.length}`);
  return { sent, failed, skipped: 0 };
}
