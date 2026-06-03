// src/lib/secure-store.js
// Cifrado en reposo AES-256-GCM para datos sensibles en DB.
// Formato: enc:v1:<iv_b64>:<tag_b64>:<cipher_b64>
// Clave: DATA_ENC_KEY (64 hex chars = 32 bytes). Sin clave → passthrough (texto plano).

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const PREFIX = 'enc:v1:';

function getKey() {
  const hex = process.env.DATA_ENC_KEY || import.meta.env?.DATA_ENC_KEY || '';
  if (!/^[0-9a-f]{64}$/i.test(hex)) return null;
  return Buffer.from(hex, 'hex');
}

export function encryptField(plain) {
  if (plain == null || plain === '') return plain;
  const key = getKey();
  if (!key) return plain; // sin clave configurada: no romper
  const s = String(plain);
  if (s.startsWith(PREFIX)) return s; // ya cifrado
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(s, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return PREFIX + [iv.toString('base64'), tag.toString('base64'), enc.toString('base64')].join(':');
}

export function decryptField(value) {
  if (value == null || value === '') return value;
  const s = String(value);
  if (!s.startsWith(PREFIX)) return s; // texto plano legado
  const key = getKey();
  if (!key) throw new Error('DATA_ENC_KEY no configurada — hay datos cifrados que no se pueden leer');
  const [ivB64, tagB64, dataB64] = s.slice(PREFIX.length).split(':');
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(dataB64, 'base64')), decipher.final()]).toString('utf8');
}

// Descifrar sin reventar: si falla (clave rotada/dato corrupto) devuelve placeholder.
export function decryptFieldSafe(value, fallback = '[cifrado]') {
  try { return decryptField(value); } catch { return fallback; }
}
