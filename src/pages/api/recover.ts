import type { APIRoute } from 'astro';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { getTurso } from '../../lib/turso';
import { sendWAText } from '../../lib/notify.js';

export const prerender = false;

// Número fijo del administrador — todos los códigos llegan aquí
const ADMIN_PHONE = '524434845466';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getSecret() {
  const raw = import.meta.env.JWT_SECRET || process.env.JWT_SECRET || '';
  if (!raw) throw new Error('JWT_SECRET no configurado');
  return new TextEncoder().encode(raw + '_otp_recovery');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body            = await request.json();
    const { action = '' } = body;

    // ── Paso 1: solicitar OTP ─────────────────────────────────────────────────
    if (action === 'request') {
      const username = String(body.username || '').trim();
      if (!username) return json({ ok: false, error: 'Selecciona un usuario' }, 400);

      // Verificar que el usuario existe (timing constante)
      const turso = getTurso();
      const found = await turso.execute({
        sql:  'SELECT id FROM users WHERE name = ? AND active = 1',
        args: [username],
      });
      await new Promise(r => setTimeout(r, 400));
      if (!found.rows.length) {
        return json({ ok: false, error: 'Usuario no encontrado' }, 404);
      }

      // Generar OTP de 6 dígitos y firmarlo en JWT (10 min)
      const otp   = String(Math.floor(100000 + Math.random() * 900000));
      const token = await new SignJWT({ username, otp })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('10m')
        .sign(getSecret());

      // Enviar SIEMPRE al número del administrador
      const msg =
        `🔐 *Recuperación de contraseña · GO Stats*\n\n` +
        `Usuario solicitante: *${username}*\n` +
        `Código: *${otp}*\n\n` +
        `Vence en *10 minutos*.\n` +
        `Compártelo solo si reconoces la solicitud.`;

      try {
        await sendWAText(ADMIN_PHONE, msg);
      } catch (waErr: unknown) {
        const errMsg = waErr instanceof Error ? waErr.message : String(waErr);
        console.error('[recover] WA error:', errMsg);
        return json({ ok: false, error: 'No se pudo enviar el código. Intenta de nuevo.' }, 502);
      }

      console.log(`[recover] OTP enviado al admin para usuario: ${username}`);
      return json({ ok: true, token });
    }

    // ── Paso 2: verificar OTP y cambiar contraseña ────────────────────────────
    if (action === 'reset') {
      const { token, otp, newPassword } = body;

      if (!token || !otp || !newPassword) {
        return json({ ok: false, error: 'Faltan datos' }, 400);
      }
      if (String(newPassword).length < 6) {
        return json({ ok: false, error: 'La contraseña debe tener al menos 6 caracteres' }, 400);
      }

      // Verificar JWT
      let payload: { username: string; otp: string };
      try {
        const { payload: p } = await jwtVerify(token, getSecret());
        payload = p as typeof payload;
      } catch {
        return json({ ok: false, error: 'Código expirado. Solicita uno nuevo.' }, 401);
      }

      // Verificar OTP (timing constante)
      await new Promise(r => setTimeout(r, 300));
      if (String(otp).trim() !== String(payload.otp)) {
        return json({ ok: false, error: 'Código incorrecto' }, 401);
      }

      // Actualizar contraseña en Turso
      const hashed = await bcrypt.hash(String(newPassword), 12);
      const turso  = getTurso();
      await turso.execute({
        sql:  'UPDATE users SET password = ? WHERE name = ? AND active = 1',
        args: [hashed, payload.username],
      });

      console.log(`✅ [recover] Contraseña reseteada para: ${payload.username}`);
      return json({ ok: true });
    }

    return json({ ok: false, error: `Acción desconocida: "${action}"` }, 400);

  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('[recover] Error:', errMsg);
    return json({ ok: false, error: 'Error interno del servidor' }, 500);
  }
};
