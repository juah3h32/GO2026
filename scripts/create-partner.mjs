// scripts/create-partner.mjs
// Crea una cuenta de departamento externo (fila en `users`) + su API key.
// Uso: node scripts/create-partner.mjs "Cindy - Departamento X"
import 'dotenv/config';
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const nombre = process.argv[2];
if (!nombre?.trim()) {
  console.error('Uso: node scripts/create-partner.mjs "Nombre del departamento"');
  process.exit(1);
}

const db = createClient({
  url:       process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

function generatePassword(length = 16) {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  const bytes = crypto.randomBytes(length);
  let pw = '';
  for (let i = 0; i < length; i++) pw += charset[bytes[i] % charset.length];
  return pw;
}

async function main() {
  // 1) Usuario RH (para que aparezca en el selector de "líderes" del admin panel
  //    y las vacantes/candidatos queden aislados por rh_user_id). No usa login web.
  const loginPassword = generatePassword();
  const hashed = await bcrypt.hash(loginPassword, 12);
  try { await db.execute(`ALTER TABLE users ADD COLUMN must_change_password INTEGER NOT NULL DEFAULT 0`); } catch {}
  const insertUser = await db.execute({
    sql:  `INSERT INTO users (name, password, tabs, can_download, color, active, must_change_password) VALUES (?, ?, ?, 0, ?, 1, 1)`,
    args: [nombre.trim(), hashed, JSON.stringify(['recruitment', 'vacantes']), '#8A8A7A'],
  });
  const rhUserId = Number(insertUser.lastInsertRowid);

  // 2) API key amarrada a ese rh_user_id
  await db.execute(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      label         TEXT    NOT NULL DEFAULT '',
      key_hash      TEXT    NOT NULL UNIQUE,
      rh_user_id    INTEGER NOT NULL,
      active        INTEGER NOT NULL DEFAULT 1,
      created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
      last_used_at  TEXT    DEFAULT NULL
    )
  `);
  const rawKey = `gops_${crypto.randomBytes(24).toString('hex')}`;
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  await db.execute({
    sql:  `INSERT INTO api_keys (label, key_hash, rh_user_id) VALUES (?, ?, ?)`,
    args: [nombre.trim(), keyHash, rhUserId],
  });

  console.log('');
  console.log('Partner creado. Guarda esto ya — la API key no se puede recuperar despues.');
  console.log('─────────────────────────────────────────────');
  console.log('Nombre:        ', nombre.trim());
  console.log('rh_user_id:    ', rhUserId);
  console.log('API key:       ', rawKey);
  console.log('─────────────────────────────────────────────');
  console.log('(password de login web, no la necesitan para la API):', loginPassword);
}

main().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
