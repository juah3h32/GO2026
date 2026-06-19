// Flujo conversacional de edición de catálogos
// Estado persiste en Turso (global_config) — funciona en serverless

import { parseCatalogIntent, validateCatalogChange, getCatalogOptions, getFieldOptions } from './wa-catalog-parser.js';
import { loadCatalogJSON, getCatalogFieldValue, formatCurrentValue, getFieldLabel } from './wa-catalog-reader.js';
import { initPendingChange, getPendingChange, clearPendingChange, updatePendingNewValue, buildConfirmMessage, isConfirmationAnswer } from './wa-catalog-confirm.js';
import { applyCatalogChange } from './wa-catalog-sync.js';

const CATALOG_KEYS = ['rafia','cuerda','arpilla','bolsa','saco','stretch','flexible','esquinero','naturizable','acolchado'];
const TRIGGERS = ['editar','cambiar','modificar','actualizar','corregir','cambia','edita','modifica'];

// Muestra los 4 campos con sus valores actuales y numeración para seleccionar
function buildFieldMenu(catalogKey, catalogFile) {
  const data = loadCatalogJSON(catalogFile);
  const t1  = getCatalogFieldValue(data, 'titulo')     || '(vacío)';
  const p1  = getCatalogFieldValue(data, 'descripcion') || '(vacío)';
  const p2  = getCatalogFieldValue(data, 'p2')          || '(vacío)';
  const t2  = getCatalogFieldValue(data, 't2')          || '(vacío)';
  const trim = (s, n = 55) => s.length > n ? s.substring(0, n) + '…' : s;
  return (
    `*${catalogKey.toUpperCase()} — ¿Qué campo editar?*\n\n` +
    `*1 · Título:*\n${trim(t1)}\n\n` +
    `*2 · Descripción:*\n${trim(p1)}\n\n` +
    `*3 · Párrafo 2:*\n${trim(p2)}\n\n` +
    `*4 · Subtítulo:*\n${trim(t2)}\n\n` +
    `_Responde el número (1-4) o el nombre del campo_`
  );
}

// Detecta qué campo eligió el usuario — acepta número, nombre o sinónimos
function detectField(n) {
  if (/^1$/.test(n.trim())) return 'titulo';
  if (/^2$/.test(n.trim())) return 'descripcion';
  if (/^3$/.test(n.trim())) return 'p2';
  if (/^4$/.test(n.trim())) return 't2';
  const map = {
    titulo:      ['titulo','portada','t1','nombre','heading'],
    descripcion: ['descripcion','descripcion','intro','p1','texto','principal'],
    p2:          ['p2','parrafo','segundo','parrafo2','parr','secundario'],
    t2:          ['subtitulo','t2','sub'],
  };
  for (const [k, aliases] of Object.entries(map)) {
    if (aliases.some(a => n.includes(a))) return k;
  }
  return null;
}

function looksLikeCatalogCommand(text, pending) {
  if (pending) return true;
  const n = String(text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const hasTrigger = TRIGGERS.some(t => n.includes(t));
  const hasCatalog = CATALOG_KEYS.some(k => n.includes(k)) || n.includes('catalogo');
  return hasTrigger && hasCatalog;
}

function norm(text) {
  return String(text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * Retorna { action, message } o null.
 * null = no es catálogo, dejar pasar al asistente IA.
 */
export async function handleCatalogCommand(phone, text) {
  const pending = await getPendingChange(phone);
  console.log('[catalog-handler] phone:', String(phone).slice(-10), 'text:', String(text).substring(0, 40), 'pending:', pending ? `${pending.catalogKey}/${pending.field}/${pending.newValue ? 'hasVal' : 'noVal'}` : 'null');

  // ── Sesión activa: estado 0 — esperando catálogo específico ────────────────
  if (pending && !pending.catalogKey) {
    const n = norm(text);
    if (/^(no|cancel|olvida|borra|nope)$/i.test(n.trim())) {
      await clearPendingChange(phone);
      return { action: 'cancelled', message: '❌ Edición cancelada.' };
    }
    const match = CATALOG_KEYS.find(k => n.includes(k));
    if (!match) {
      return {
        action: 'ask_catalog',
        message: `No reconocí ese catálogo. Elige uno:\n\nrafia · cuerda · arpilla · bolsa · saco · stretch · flexible · esquinero · naturizable · acolchado`,
      };
    }
    const fileMap = { rafia:'catalogo-rafia.json', cuerda:'catalogo-cuerda.json', arpilla:'catalogo-arpilla.json', bolsa:'catalogo-bolsas.json', saco:'catalogo-saco.json', stretch:'catalogo-stretch.json', flexible:'catalogo-flexible.json', esquinero:'catalogo-esquinero.json', naturizable:'catalogo-naturizable.json', acolchado:'catalogo-acolchado.json' };
    const updatedPending = { ...pending, catalogKey: match, catalogFile: fileMap[match] };
    // Si ya venía campo pre-detectado, mostrar valor actual y pedir nuevo texto
    if (updatedPending.field) {
      const catalogData = loadCatalogJSON(updatedPending.catalogFile);
      const currentValue = getCatalogFieldValue(catalogData, updatedPending.field);
      updatedPending.oldValue = currentValue;
      await initPendingChange(phone, updatedPending);
      return {
        action: 'ask_input',
        message: `*${match.toUpperCase()} — ${getFieldLabel(updatedPending.field)}*\n\n*Valor actual:*\n${formatCurrentValue(currentValue)}\n\n¿Cuál es el nuevo texto?`,
      };
    }
    await initPendingChange(phone, updatedPending);
    return {
      action: 'ask_field',
      message: buildFieldMenu(match, fileMap[match]),
    };
  }

  // ── Sesión activa: estado 1 — esperando campo ────────────────────────────
  if (pending && !pending.field) {
    const n = norm(text);
    if (/^(no|cancel|olvida|borra|nope)$/i.test(n.trim())) {
      await clearPendingChange(phone);
      return { action: 'cancelled', message: '❌ Edición cancelada.' };
    }
    const field = detectField(n);
    if (!field) {
      return {
        action: 'ask_field',
        message: buildFieldMenu(pending.catalogKey, pending.catalogFile),
      };
    }
    const catalogData = loadCatalogJSON(pending.catalogFile);
    const currentValue = getCatalogFieldValue(catalogData, field);
    const updatedPending = { ...pending, field, oldValue: currentValue };
    await initPendingChange(phone, updatedPending);
    return {
      action: 'ask_input',
      message: `*${pending.catalogKey.toUpperCase()} — ${getFieldLabel(field)}*\n\n*Valor actual:*\n${formatCurrentValue(currentValue)}\n\n¿Cuál es el nuevo texto?\n_Responde "no" para cancelar_`,
    };
  }

  // ── Sesión activa: estado 2 — esperando nuevo valor ─────────────────────
  if (pending && pending.field && !pending.newValue) {
    const { reject } = isConfirmationAnswer(text);
    if (reject) {
      await clearPendingChange(phone);
      return { action: 'cancelled', message: '❌ Edición cancelada.' };
    }
    const updated = await updatePendingNewValue(phone, text.trim());
    if (!updated) return null;
    return { action: 'ask_confirm', message: buildConfirmMessage(updated) };
  }

  // ── Sesión activa: estado 3 — esperando confirmación ────────────────────
  if (pending && pending.field && pending.newValue) {
    const { confirm, reject } = isConfirmationAnswer(text);
    if (reject) {
      await clearPendingChange(phone);
      return { action: 'cancelled', message: '❌ Cambio cancelado.' };
    }
    if (confirm) {
      const result = await applyCatalogChange({
        success: true,
        catalog: pending.catalogFile,
        catalogKey: pending.catalogKey,
        field: pending.field,
        value: pending.newValue,
      });
      await clearPendingChange(phone);
      if (result.success) {
        return {
          action: 'applied',
          message: `✅ *Catálogo actualizado*\n\n_${pending.catalogKey}_\nCampo: ${getFieldLabel(pending.field)}\n${result.tursoOk ? 'Turso ✓' : 'Turso ⚠️ — retry automático'}`,
        };
      }
      return { action: 'error', message: `❌ ${result.error}` };
    }
    return {
      action: 'ask_confirm',
      message: `Responde *sí* para confirmar o *no* para cancelar.\n\n${buildConfirmMessage(pending)}`,
    };
  }

  // ── Sin sesión: detectar intent nuevo ───────────────────────────────────
  if (!looksLikeCatalogCommand(text, null)) return null;

  const parsed = parseCatalogIntent(text);

  // No encontró catálogo específico → guardar sesión y preguntar cuál
  if (!parsed.success || !parsed.catalogKey) {
    const fieldHint = detectField(norm(text));
    await initPendingChange(phone, { catalogKey: null, catalogFile: null, field: fieldHint, oldValue: null, newValue: null });
    const fieldMsg = fieldHint ? `\n_Campo detectado: ${getFieldLabel(fieldHint)}_` : '';
    return {
      action: 'ask_catalog',
      message: `¿Qué catálogo deseas editar?${fieldMsg}\n\nrafia · cuerda · arpilla · bolsa · saco · stretch · flexible · esquinero · naturizable · acolchado`,
    };
  }

  const validated = validateCatalogChange(parsed);
  if (!validated.success) return { action: 'error', message: `❌ ${validated.error}` };

  const catalogData = loadCatalogJSON(validated.catalog);
  if (!catalogData) return { action: 'error', message: `❌ No se pudo cargar catálogo: ${validated.catalogKey}` };

  // Caso rápido: catálogo + campo + valor en un mensaje → pedir confirmación
  if (validated.field && validated.value) {
    const currentValue = getCatalogFieldValue(catalogData, validated.field);
    const p = { catalogKey: validated.catalogKey, catalogFile: validated.catalog, field: validated.field, oldValue: currentValue, newValue: validated.value };
    await initPendingChange(phone, p);
    return { action: 'ask_confirm', message: buildConfirmMessage(p) };
  }

  // Tiene catálogo + campo, falta valor → mostrar actual y pedir nuevo
  if (validated.field) {
    const currentValue = getCatalogFieldValue(catalogData, validated.field);
    await initPendingChange(phone, { catalogKey: validated.catalogKey, catalogFile: validated.catalog, field: validated.field, oldValue: currentValue, newValue: null });
    return {
      action: 'ask_input',
      message: `*${validated.catalogKey.toUpperCase()} — ${getFieldLabel(validated.field)}*\n\n*Valor actual:*\n${formatCurrentValue(currentValue)}\n\n¿Cuál es el nuevo texto?\n_Responde "no" para cancelar_`,
    };
  }

  // Solo catálogo, falta campo → mostrar menú con valores actuales
  await initPendingChange(phone, { catalogKey: validated.catalogKey, catalogFile: validated.catalog, field: null, oldValue: null, newValue: null });
  return {
    action: 'ask_field',
    message: buildFieldMenu(validated.catalogKey, validated.catalog),
  };
}
