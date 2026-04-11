// src/pages/api/push/vapid-key.js
// Devuelve la clave pública VAPID al frontend para suscribirse.
export const prerender = false;

export async function GET() {
  const publicKey = import.meta.env.VAPID_PUBLIC_KEY;
  if (!publicKey) {
    return new Response(JSON.stringify({ error: 'VAPID no configurado' }), { status: 500 });
  }
  return new Response(JSON.stringify({ publicKey }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
