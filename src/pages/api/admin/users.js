// src/pages/api/admin/users.js — CRUD de usuarios y permisos
import { getTurso } from '../../../lib/turso';
import { verifyAdminToken } from '../../../lib/verifyAdminToken.ts';
import bcrypt from 'bcryptjs';

export const prerender = false;

export async function GET({ request }) {
  const role = await verifyAdminToken(request);
  if (!role || !role.canDownload) return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), { status: 401 });

  const db = getTurso();
  const { rows } = await db.execute('SELECT id, name, color, tabs, can_download, active FROM users ORDER BY id');
  return new Response(JSON.stringify({
    ok: true,
    users: rows.map(r => ({
      id:          r.id,
      name:        r.name,
      color:       r.color || '#8A8A7A',
      tabs:        JSON.parse(r.tabs || '[]'),
      canDownload: Boolean(r.can_download),
      active:      Boolean(r.active),
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
    const { id, tabs, canDownload, active } = body;
    if (!id) return new Response(JSON.stringify({ ok: false, error: 'Falta id' }), { status: 400 });
    await db.execute({
      sql:  'UPDATE users SET tabs = ?, can_download = ?, active = ? WHERE id = ?',
      args: [JSON.stringify(tabs || []), canDownload ? 1 : 0, active !== false ? 1 : 0, id],
    });
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  }

  // ── Cambiar contraseña (por id numérico) ──────────────────────────────────
  if (action === 'changePassword') {
    const { id, newPassword } = body;
    if (!id || !newPassword || newPassword.length < 6) return new Response(JSON.stringify({ ok: false, error: 'Datos inválidos' }), { status: 400 });
    const hashed = await bcrypt.hash(newPassword, 12);
    await db.execute({ sql: 'UPDATE users SET password = ? WHERE id = ?', args: [hashed, id] });
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  }

  // ── Cambiar nombre ────────────────────────────────────────────────────────
  if (action === 'changeName') {
    const { id, newName } = body;
    if (!id || !newName || newName.trim().length < 2) return new Response(JSON.stringify({ ok: false, error: 'Datos inválidos' }), { status: 400 });
    await db.execute({ sql: 'UPDATE users SET name = ? WHERE id = ?', args: [newName.trim(), id] });
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  }

  // ── Crear nuevo usuario ───────────────────────────────────────────────────
  if (action === 'addUser') {
    const { name, password, tabs, canDownload, color } = body;
    if (!name?.trim() || !password || password.length < 6) return new Response(JSON.stringify({ ok: false, error: 'Nombre y contraseña requeridos (mín. 6 chars)' }), { status: 400 });
    const hashed = await bcrypt.hash(password, 12);
    await db.execute({
      sql:  'INSERT INTO users (name, password, tabs, can_download, color, active) VALUES (?, ?, ?, ?, ?, 1)',
      args: [name.trim(), hashed, JSON.stringify(tabs || []), canDownload ? 1 : 0, color || '#8A8A7A'],
    });
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({ ok: false, error: 'Acción desconocida' }), { status: 400 });
}
