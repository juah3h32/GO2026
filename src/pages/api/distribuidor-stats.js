// src/pages/api/distribuidor-stats.js
import { getDistribuidorLeadsCountThisMonth } from '../../lib/analytics-db';

export const prerender = false;

export async function GET() {
  try {
    const count = await getDistribuidorLeadsCountThisMonth();
    return new Response(JSON.stringify({ ok: true, count }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('distribuidor-stats GET:', err?.message || err);
    return new Response(JSON.stringify({ ok: true, count: 0 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
