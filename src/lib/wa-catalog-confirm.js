// Confirmaciones de cambio de catálogo — estado persistido en Turso
// Usa global_config como key-value store: key = `catalog_pending:${phone10}`

import { getConfig, setConfig } from './analytics-db.js';

const TTL_MS = 5 * 60 * 1000; // 5 minutos

// Normaliza a últimos 10 dígitos para evitar mismatch con código de país (52XXXXXXXXXX vs XXXXXXXXXX)
function normalizePhone(phone) {
  return String(phone || '').replace(/\D/g, '').slice(-10);
}

function key(phone) {
  return `catalog_pending:${normalizePhone(phone)}`;
}

export async function initPendingChange(phone, change) {
  const k = key(phone);
  const payload = JSON.stringify({ ...change, timestamp: Date.now() });
  console.log('[catalog-confirm] initPending key:', k, 'field:', change?.field, 'catalogKey:', change?.catalogKey);
  await setConfig(k, payload).catch(e => {
    console.error('[wa-catalog-confirm] setConfig:', e.message);
  });
  return change;
}

export async function getPendingChange(phone) {
  const k = key(phone);
  try {
    const raw = await getConfig(k);
    console.log('[catalog-confirm] getPending key:', k, 'found:', !!raw);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > TTL_MS) {
      await clearPendingChange(phone);
      return null;
    }
    return parsed;
  } catch (e) {
    console.error('[catalog-confirm] getPending error:', e.message);
    return null;
  }
}

export async function clearPendingChange(phone) {
  await setConfig(key(phone), '').catch(() => {});
}

export async function updatePendingNewValue(phone, newValue) {
  const pending = await getPendingChange(phone);
  if (!pending) return null;
  pending.newValue = newValue;
  await setConfig(key(phone), JSON.stringify(pending)).catch(() => {});
  return pending;
}

export function buildConfirmMessage(change) {
  const { catalogKey, field, oldValue, newValue } = change;
  const old = oldValue ? oldValue.substring(0, 80) + (oldValue.length > 80 ? '...' : '') : '(vacío)';
  const neu = newValue ? newValue.substring(0, 80) + (newValue.length > 80 ? '...' : '') : '';
  return `📋 *Confirmación de cambio*

*Catálogo:* _${catalogKey}_
*Campo:* ${field}

*ANTES:*
${old}

*DESPUÉS:*
${neu}

¿Confirmas? Responde: *sí* o *no*`;
}

export function isConfirmationAnswer(text) {
  const norm = String(text || '').toLowerCase().trim();
  return {
    confirm: /^(sí|si|yes|ya|ok|confirmo|listo|adelante)$/i.test(norm),
    reject: /^(no|cancel|borra|olvida|nope)$/i.test(norm),
  };
}
