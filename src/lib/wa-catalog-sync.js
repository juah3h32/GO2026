// Sincroniza cambios: Turso + JSON + Traducción (Claude)

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getTurso } from './turso';

const LANGS = ['es', 'en', 'pt', 'zh', 'ar'];

export function loadCatalogJSON(catalogFile) {
  try {
    const filePath = join(process.cwd(), 'src', 'data', catalogFile);
    const data = readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error(`[wa-catalog-sync] Error: ${e.message}`);
    return null;
  }
}

export function saveCatalogJSON(catalogFile, data) {
  try {
    const filePath = join(process.cwd(), 'src', 'data', catalogFile);
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error(`[wa-catalog-sync] Save error: ${e.message}`);
    return false;
  }
}

export async function translateText(text) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('[wa-catalog-sync] No ANTHROPIC_API_KEY');
    return { es: text, en: text, pt: text, zh: text, ar: text };
  }

  const prompt = `Translate to EN, PT, ZH, AR. Keep tone professional. Return JSON: {"en":"...","pt":"...","zh":"...","ar":"..."}
Text: "${text}"`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-8',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      console.error(`[wa-catalog-sync] API ${res.status}`);
      return null;
    }

    const data = await res.json();
    const content = data.content?.[0]?.text || '';
    const jsonMatch = content.match(/\{[^{}]*"[a-z]{2}"[^{}]*\}/i);
    if (!jsonMatch) return null;

    const translations = JSON.parse(jsonMatch[0]);
    return {
      es: text,
      en: translations.en || text,
      pt: translations.pt || text,
      zh: translations.zh || text,
      ar: translations.ar || text,
    };
  } catch (e) {
    console.error(`[wa-catalog-sync] Translate: ${e.message}`);
    return null;
  }
}

export async function updateCatalogField(catalogData, field, value) {
  if (!catalogData) return null;

  let translated = await translateText(value);
  if (!translated) {
    translated = { es: value, en: value, pt: value, zh: value, ar: value };
  }

  const updated = JSON.parse(JSON.stringify(catalogData));

  // Mapear campos a JSON
  switch (field) {
    case 'descripcion':
    case 'p1':
      if (updated.intro?.p1) {
        for (const lang of LANGS) {
          updated.intro.p1[lang] = translated[lang] || translated.es;
        }
      }
      break;
    case 'p2':
      if (updated.intro?.p2) {
        for (const lang of LANGS) {
          updated.intro.p2[lang] = translated[lang] || translated.es;
        }
      }
      break;
    case 'titulo':
    case 't1':
      if (updated.cover?.t1) {
        for (const lang of LANGS) {
          updated.cover.t1[lang] = translated[lang] || translated.es;
        }
      }
      break;
    case 't2':
      if (updated.cover?.t2) {
        for (const lang of LANGS) {
          updated.cover.t2[lang] = translated[lang] || translated.es;
        }
      }
      break;
    default:
      console.warn(`[wa-catalog-sync] Campo no soportado: ${field}`);
      return null;
  }

  return updated;
}

export async function syncToTurso(catalogKey, catalogData) {
  try {
    const db = await getTurso();
    if (!db) {
      console.warn('[wa-catalog-sync] No Turso');
      return false;
    }

    const serialized = JSON.stringify(catalogData);
    const now = Math.floor(Date.now() / 1000);
    await db.execute(
      `INSERT OR REPLACE INTO catalog_kv (key, json, updated_at) VALUES (?, ?, ?)`,
      [catalogKey, serialized, now]
    );
    return true;
  } catch (e) {
    console.error(`[wa-catalog-sync] Turso: ${e.message}`);
    return false;
  }
}

export async function applyCatalogChange(parsed) {
  if (!parsed.success) return parsed;

  const { catalog, catalogKey, field, value } = parsed;

  const catalogData = loadCatalogJSON(catalog);
  if (!catalogData) {
    return { success: false, error: `No se pudo cargar: ${catalog}` };
  }

  const updated = await updateCatalogField(catalogData, field, value);
  if (!updated) {
    return { success: false, error: `Campo no soportado: ${field}` };
  }

  const jsonOk = saveCatalogJSON(catalog, updated);
  if (!jsonOk) {
    return { success: false, error: 'Error guardando JSON' };
  }

  const tursoOk = await syncToTurso(catalogKey, updated);

  return {
    success: true,
    catalog: catalogKey,
    field,
    value,
    jsonOk,
    tursoOk,
  };
}
