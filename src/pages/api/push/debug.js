// src/pages/api/push/debug.js — diagnóstico de push (solo dev)
export const prerender = false;

import { createClient } from '@libsql/client';

export async function GET() {
  if (!import.meta.env.DEV) return new Response('Not Found', { status: 404 });

  const info = {
    vapid_public:  !!(import.meta.env.VAPID_PUBLIC_KEY  || process.env.VAPID_PUBLIC_KEY),
    vapid_private: !!(import.meta.env.VAPID_PRIVATE_KEY || process.env.VAPID_PRIVATE_KEY),
    vapid_subject: !!(import.meta.env.VAPID_SUBJECT      || process.env.VAPID_SUBJECT),
    turso_url:     !!(import.meta.env.TURSO_DATABASE_URL  || process.env.TURSO_DATABASE_URL),
    subscribers:   0,
    error:         null,
  };

  try {
    const db = createClient({
      url:       process.env.TURSO_DATABASE_URL || import.meta.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN   || import.meta.env.TURSO_AUTH_TOKEN,
    });
    await db.execute(`CREATE TABLE IF NOT EXISTS push_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT, endpoint TEXT NOT NULL UNIQUE,
      p256dh TEXT NOT NULL, auth TEXT NOT NULL, created TEXT NOT NULL DEFAULT (datetime('now'))
    )`);
    const { rows } = await db.execute('SELECT COUNT(*) as n FROM push_subscriptions');
    info.subscribers = Number(rows[0]?.n ?? 0);
  } catch (e) {
    info.error = e.message;
  }

  return new Response(JSON.stringify(info, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
