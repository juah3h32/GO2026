import type { APIRoute } from 'astro';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { getTurso } from '../../lib/turso';
import { verifyAdminToken } from '../../lib/verifyAdminToken';

export const POST: APIRoute = async ({ request }) => {
  try {
    const jwtSecret = import.meta.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error('❌ JWT_SECRET no definido en .env');
      return new Response(JSON.stringify({ ok: false, error: 'Config error' }), { status: 500 });
    }

    const SECRET = new TextEncoder().encode(jwtSecret);
    const body   = await request.json();

    // ── Cambio de contraseña ──────────────────────────────────────────────
    if (body.action === 'changePassword') {
      const adminRole = await verifyAdminToken(request);
      if (!adminRole || !adminRole.canDownload) {
        return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), { status: 401 });
      }

      const { userId, newPassword } = body as { userId: string; newPassword: string };

      if (!userId || !newPassword) {
        return new Response(JSON.stringify({ ok: false, error: 'Faltan datos' }), { status: 400 });
      }
      if (newPassword.length < 6) {
        return new Response(JSON.stringify({ ok: false, error: 'Mínimo 6 caracteres' }), { status: 400 });
      }

      const VALID_NAMES = ['Admin', 'RH', 'Distribuidor', 'Marketing'];
      if (!VALID_NAMES.includes(userId)) {
        return new Response(JSON.stringify({ ok: false, error: 'Usuario no válido' }), { status: 400 });
      }

      const turso = getTurso();
      const check = await turso.execute({
        sql:  'SELECT id FROM users WHERE name = ? AND active = 1',
        args: [userId],
      });
      if (!check.rows.length) {
        return new Response(JSON.stringify({ ok: false, error: 'Usuario no encontrado' }), { status: 404 });
      }

      const hashed = await bcrypt.hash(newPassword, 12);
      await turso.execute({
        sql:  'UPDATE users SET password = ? WHERE name = ?',
        args: [hashed, userId],
      });

      console.log(`✅ Contraseña actualizada para: ${userId}`);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── Cambio de nombre visible ──────────────────────────────────────────
    if (body.action === 'changeName') {
      const adminRole = await verifyAdminToken(request);
      if (!adminRole || !adminRole.canDownload) {
        return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), { status: 401 });
      }

      const { userId, newName } = body as { userId: string; newName: string };

      if (!userId || !newName) {
        return new Response(JSON.stringify({ ok: false, error: 'Faltan datos' }), { status: 400 });
      }
      if (newName.trim().length < 2) {
        return new Response(JSON.stringify({ ok: false, error: 'Mínimo 2 caracteres' }), { status: 400 });
      }

      const VALID_NAMES = ['Admin', 'RH', 'Distribuidor', 'Marketing'];
      if (!VALID_NAMES.includes(userId)) {
        return new Response(JSON.stringify({ ok: false, error: 'Usuario no válido' }), { status: 400 });
      }

      const turso = getTurso();
      const check = await turso.execute({
        sql:  'SELECT id FROM users WHERE name = ? AND active = 1',
        args: [userId],
      });
      if (!check.rows.length) {
        return new Response(JSON.stringify({ ok: false, error: 'Usuario no encontrado' }), { status: 404 });
      }

      await turso.execute({
        sql:  'UPDATE users SET name = ? WHERE name = ?',
        args: [newName.trim(), userId],
      });

      console.log(`✅ Nombre actualizado: ${userId} → ${newName.trim()}`);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── Login normal ──────────────────────────────────────────────────────
    const { password } = body as { password: string };

    // IP, ubicacion (geo de Vercel) y dispositivo (user-agent) del solicitante
    const h = request.headers;
    const ip = (h.get('x-forwarded-for') || '').split(',')[0].trim()
            || h.get('x-real-ip') || h.get('x-vercel-forwarded-for') || 'desconocida';
    // Geo aproximada que inyecta Vercel en el edge
    const ciudad = decodeURIComponent(h.get('x-vercel-ip-city') || '').trim();
    const region = h.get('x-vercel-ip-country-region') || '';
    const pais   = h.get('x-vercel-ip-country') || '';
    const ubicacion = [ciudad, region, pais].filter(Boolean).join(', ') || 'ubicación desconocida';
    // Dispositivo a partir del user-agent
    const ua = h.get('user-agent') || '';
    const esMovil = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    const so = /Windows/i.test(ua) ? 'Windows' : /iPhone|iPad|iPod/i.test(ua) ? 'iOS'
             : /Android/i.test(ua) ? 'Android' : /Mac OS X|Macintosh/i.test(ua) ? 'Mac'
             : /Linux/i.test(ua) ? 'Linux' : 'SO desconocido';
    const nav = /Edg\//i.test(ua) ? 'Edge' : /OPR\/|Opera/i.test(ua) ? 'Opera'
             : /Chrome\//i.test(ua) ? 'Chrome' : /Firefox\//i.test(ua) ? 'Firefox'
             : /Safari\//i.test(ua) ? 'Safari' : 'navegador desconocido';
    const dispositivo = `${esMovil ? 'Móvil' : 'Escritorio'} · ${so} · ${nav}`;
    const horaMX = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

    if (!password) {
      return new Response(JSON.stringify({ ok: false, error: 'Sin contraseña' }), { status: 400 });
    }

    const turso  = getTurso();

    // Buscar usuario por nombre no es posible sin él — buscamos todos activos y validamos hash
    // Para login por contraseña: primero intentar match directo (legacy plaintext), luego bcrypt
    const allUsers = await turso.execute({
      sql:  'SELECT * FROM users WHERE active = 1',
      args: [],
    });

    let matchedRow: typeof allUsers.rows[0] | null = null;

    for (const row of allUsers.rows) {
      const stored = row.password as string;
      if (stored.startsWith('$2b$') || stored.startsWith('$2a$')) {
        // Contraseña ya hasheada
        const ok = await bcrypt.compare(password, stored);
        if (ok) { matchedRow = row; break; }
      } else {
        // Contraseña en texto plano (legacy) — migrar automáticamente al primer login
        if (stored === password) {
          const newHash = await bcrypt.hash(password, 12);
          await turso.execute({
            sql:  'UPDATE users SET password = ? WHERE id = ?',
            args: [newHash, row.id],
          });
          matchedRow = row;
          break;
        }
      }
    }

    if (!matchedRow) {
      // Log + alerta de intento fallido (posible intruso)
      try {
        const { logSystemEvent } = await import('../../lib/analytics-db.js');
        const { notifyAdmins }   = await import('../../lib/health-alert.js');
        await logSystemEvent({ level: 'security', category: 'auth', source: 'login', message: `Intento de acceso FALLIDO al panel — ${dispositivo} — ${ubicacion}`, ip, meta: { ubicacion, dispositivo, ua: ua.slice(0, 200) } }).catch(() => {});
        notifyAdmins(`*ALERTA DE ACCESO*\nIntento FALLIDO al panel BotGO.\nDispositivo: ${dispositivo}\nUbicación: ${ubicacion}\nIP: ${ip}\n${horaMX} (CDMX)`).catch(() => {});
      } catch { /* no bloquear el login por el aviso */ }
      await new Promise(r => setTimeout(r, 400));
      return new Response(JSON.stringify({ ok: false, error: 'Contraseña incorrecta' }), { status: 401 });
    }

    const result = { rows: [matchedRow] };

const row      = result.rows[0];
    const roleName = row.name as string;
 
    // Parsea tabs de Turso — los permisos se gestionan explícitamente desde el panel de usuarios
    const parsedTabs: string[] = JSON.parse(row.tabs as string);
 
    // roleType: identificador estable basado en can_download y tabs (no cambia si renombran el usuario)
    // Admin → canDownload=true | RH → canDownload=false, tiene recruitment
    const isAdminRole = Boolean(row.can_download);
    const isRHRole    = !isAdminRole && parsedTabs.includes('recruitment');

    const role = {
      name:           roleName,
      color:          row.color as string,
      tabs:           parsedTabs,
      canDownload:    isAdminRole,
      canDelete:      isAdminRole || isRHRole,   // Admin y RH pueden eliminar candidatos
      isAdminRole,                                // true solo para Admin (acceso completo)
    };
   
    

    console.log(`✅ Login exitoso — rol: ${role.name} | canDelete: ${role.canDelete}`);

    // Log + aviso de acceso correcto
    try {
      const { logSystemEvent } = await import('../../lib/analytics-db.js');
      const { notifyAdmins }   = await import('../../lib/health-alert.js');
      await logSystemEvent({ level: 'info', category: 'auth', source: 'login', message: `Acceso correcto — ${role.name} — ${dispositivo} — ${ubicacion}`, ip, meta: { ubicacion, dispositivo, ua: ua.slice(0, 200) } }).catch(() => {});
      notifyAdmins(`*Acceso al panel BotGO*\nRol: ${role.name}\nDispositivo: ${dispositivo}\nUbicación: ${ubicacion}\nIP: ${ip}\n${horaMX} (CDMX)`).catch(() => {});
    } catch { /* no bloquear el login por el aviso */ }

    const token = await new SignJWT({ role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(SECRET);

    return new Response(JSON.stringify({ ok: true, role }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `admin_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`,
      },
    });

  } catch (e) {
    console.error('❌ Auth error completo:', e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
};