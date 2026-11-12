// src/pages/api/admin/users.js — CRUD de usuarios y permisos
import { getTurso } from '../../../lib/turso';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const prerender = false;

// Contraseña aleatoria segura — se entrega una sola vez al admin, nunca se guarda en texto plano.
function generatePassword(length = 12) {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  const bytes = crypto.randomBytes(length);
  let pw = '';
  for (let i = 0; i < length; i++) pw += charset[bytes[i] % charset.length];
  return pw;
}

// Columna "delegada": ve/borra los candidatos de OTRO usuario (ej. Mony o
// Cindy) en vez de los propios. Se agrega bajo demanda, como must_change_password.
async function ensureScopedRhColumn(db) {
  try { await db.execute(`ALTER TABLE users ADD COLUMN scoped_rh_user_id INTEGER DEFAULT NULL`); } catch {}
}

export async function GET({ request }) {
  const role = await verifyAdminToken(request);
  if (!role || !role.canDownload) return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), { status: 401 });

  const db = getTurso();
  await ensureScopedRhColumn(db);
  const { rows } = await db.execute('SELECT id, name, color, tabs, can_download, active, scoped_rh_user_id FROM users ORDER BY id');
  return new Response(JSON.stringify({
    ok: true,
    users: rows.map(r => ({
      id:              r.id,
      name:            r.name,
      color:           r.color || '#8A8A7A',
      tabs:            JSON.parse(r.tabs || '[]'),
      canDownload:     Boolean(r.can_download),
      active:          Boolean(r.active),
      scopedRhUserId:  r.scoped_rh_user_id ?? null,
    })),
  }), { headers: { 'Content-Type': 'application/json' } });
}

export async function POST({ request }) {
  const role = await verifyAdminToken(request);
  if (!role || !role.canDownload) return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), { status: 401 });

  const body   = await request.json();
  const { action } = body;
  const db     = getTurso();

  // ── Actualizar permisos ───────────────────────────────────────────────────
  if (action === 'updatePermissions') {
    const { id, tabs, canDownload, active, scopedRhUserId } = body;
    if (!id) return new Response(JSON.stringify({ ok: false, error: 'Falta id' }), { status: 400 });
    await ensureScopedRhColumn(db);
    await db.execute({
      sql:  'UPDATE users SET tabs = ?, can_download = ?, active = ?, scoped_rh_user_id = ? WHERE id = ?',
      args: [JSON.stringify(tabs || []), canDownload ? 1 : 0, active !== false ? 1 : 0, scopedRhUserId || null, id],
    });
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  }

  // ── Renovar contraseña (por id numérico) — siempre random, fuerza cambio en el próximo login ──
  if (action === 'changePassword') {
    const { id } = body;
    if (!id) return new Response(JSON.stringify({ ok: false, error: 'Falta id' }), { status: 400 });
    const generatedPassword = generatePassword();
    const hashed = await bcrypt.hash(generatedPassword, 12);
    try { await db.execute(`ALTER TABLE users ADD COLUMN must_change_password INTEGER NOT NULL DEFAULT 0`); } catch {}
    await db.execute({ sql: 'UPDATE users SET password = ?, must_change_password = 1 WHERE id = ?', args: [hashed, id] });
    return new Response(JSON.stringify({ ok: true, generatedPassword }), { headers: { 'Content-Type': 'application/json' } });
  }

  // ── Cambiar nombre ────────────────────────────────────────────────────────
  if (action === 'changeName') {
    const { id, newName } = body;
    if (!id || !newName || newName.trim().length < 2) return new Response(JSON.stringify({ ok: false, error: 'Datos inválidos' }), { status: 400 });
    await db.execute({ sql: 'UPDATE users SET name = ? WHERE id = ?', args: [newName.trim(), id] });
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  }

  // ── Crear nuevo usuario — contraseña siempre random, fuerza cambio en el primer login ──
  if (action === 'addUser') {
    const { name, tabs, canDownload, color, scopedRhUserId } = body;
    if (!name?.trim()) return new Response(JSON.stringify({ ok: false, error: 'Nombre requerido' }), { status: 400 });
    const generatedPassword = generatePassword();
    const hashed = await bcrypt.hash(generatedPassword, 12);
    try { await db.execute(`ALTER TABLE users ADD COLUMN must_change_password INTEGER NOT NULL DEFAULT 0`); } catch {}
    await ensureScopedRhColumn(db);
    await db.execute({
      sql:  'INSERT INTO users (name, password, tabs, can_download, color, active, must_change_password, scoped_rh_user_id) VALUES (?, ?, ?, ?, ?, 1, 1, ?)',
      args: [name.trim(), hashed, JSON.stringify(tabs || []), canDownload ? 1 : 0, color || '#8A8A7A', scopedRhUserId || null],
    });
    return new Response(JSON.stringify({ ok: true, generatedPassword }), { headers: { 'Content-Type': 'application/json' } });
  }

  // ── Eliminar usuario — borra el acceso por completo (no solo desactivar) ──
  // Sus candidatos/vacantes ya guardados se quedan en la base (quedan sin dueño
  // visible solo para Admin), no se borran — esto solo quita el login.
  if (action === 'deleteUser') {
    const { id } = body;
    if (!id) return new Response(JSON.stringify({ ok: false, error: 'Falta id' }), { status: 400 });
    if (Number(id) === Number(role.id)) {
      return new Response(JSON.stringify({ ok: false, error: 'No puedes eliminar tu propia cuenta.' }), { status: 400 });
    }
    const { rows: adminRows } = await db.execute(`SELECT id FROM users WHERE can_download = 1 AND active = 1`);
    const target = adminRows.find(r => Number(r.id) === Number(id));
    if (target && adminRows.length <= 1) {
      return new Response(JSON.stringify({ ok: false, error: 'No puedes eliminar al único administrador activo.' }), { status: 400 });
    }
    await db.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [id] });
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({ ok: false, error: 'Acción desconocida' }), { status: 400 });
}
