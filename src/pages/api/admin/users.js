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
    const { name, tabs, canDownload, color } = body;
    if (!name?.trim()) return new Response(JSON.stringify({ ok: false, error: 'Nombre requerido' }), { status: 400 });
    const generatedPassword = generatePassword();
    const hashed = await bcrypt.hash(generatedPassword, 12);
    try { await db.execute(`ALTER TABLE users ADD COLUMN must_change_password INTEGER NOT NULL DEFAULT 0`); } catch {}
    await db.execute({
      sql:  'INSERT INTO users (name, password, tabs, can_download, color, active, must_change_password) VALUES (?, ?, ?, ?, ?, 1, 1)',
      args: [name.trim(), hashed, JSON.stringify(tabs || []), canDownload ? 1 : 0, color || '#8A8A7A'],
    });
    return new Response(JSON.stringify({ ok: true, generatedPassword }), { headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({ ok: false, error: 'Acción desconocida' }), { status: 400 });
}
