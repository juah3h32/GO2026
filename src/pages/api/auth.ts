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