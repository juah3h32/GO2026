// src/pages/api/push/subscribe.js
// Guarda o elimina una suscripción de push en Turso.
export const prerender = false;

import { createClient } from '@libsql/client';

function getDb() {
  return createClient({
    url:       process.env.TURSO_DATABASE_URL || import.meta.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN   || import.meta.env.TURSO_AUTH_TOKEN,
  });
}

async function ensureTable(db) {
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

export async function POST({ request }) {
  try {
    const { subscription, action } = await request.json();

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return new Response(JSON.stringify({ error: 'Suscripción inválida' }), { status: 400 });
    }

    // Validación de formato y tamaño (previene memory exhaustion y endpoints falsos)
    const endpointStr = String(subscription.endpoint);
    const p256dh      = String(subscription.keys.p256dh);
    const authKey     = String(subscription.keys.auth);

    if (!endpointStr.startsWith('https://')) {
      return new Response(JSON.stringify({ error: 'Endpoint inválido' }), { status: 400 });
    }
    if (endpointStr.length > 500 || p256dh.length > 200 || authKey.length > 50) {
      return new Response(JSON.stringify({ error: 'Datos de suscripción inválidos' }), { status: 400 });
    }

    const db = getDb();
    await ensureTable(db);

    if (action === 'unsubscribe') {
      await db.execute({
        sql:  'DELETE FROM push_subscriptions WHERE endpoint = ?',
        args: [subscription.endpoint],
      });
      return new Response(JSON.stringify({ ok: true }));
    }

    // Upsert — si ya existe, actualiza las llaves
    await db.execute({
      sql: `
        INSERT INTO push_subscriptions (endpoint, p256dh, auth)
        VALUES (?, ?, ?)
        ON CONFLICT(endpoint) DO UPDATE SET
          p256dh  = excluded.p256dh,
          auth    = excluded.auth,
          created = datetime('now')
      `,
      args: [subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth],
    });

    return new Response(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error('[push/subscribe]', err);
    return new Response(JSON.stringify({ error: 'Error interno' }), { status: 500 });
  }
}
