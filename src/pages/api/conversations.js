// src/pages/api/conversations.js
import { readConversations, readSessionMessages } from '../../lib/analytics-db.js';
import { verifyAdminToken } from '../../lib/verifyAdminToken.ts';

export const prerender = false;

export async function POST({ request }) {
  try {
    const adminRole = await verifyAdminToken(request);
    if (!adminRole) return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

    const body = await request.json();
    if (body.action === 'list') {
      const result = await readConversations({ limit: body.limit || 50, offset: body.offset || 0 });
      return new Response(JSON.stringify({ ok: true, ...result }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (body.action === 'messages' && body.session_id) {
      const messages = await readSessionMessages(body.session_id);
      return new Response(JSON.stringify({ ok: true, messages }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ ok: false, error: 'Unknown action' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
