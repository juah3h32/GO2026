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

const LANGS_TRANSLATE = ['en', 'pt', 'zh', 'ar'];

// Prompt mínimo que obliga a Claude a devolver JSON limpio con los 4 idiomas
function translatePrompt(text) {
  return `Translate this text to EN (English), PT (Portuguese), ZH (Chinese), AR (Arabic).
Industrial catalog tone. Keep numbers, units, symbols unchanged.
Return ONLY valid JSON, no markdown, no extra text:
{"en":"english text","pt":"texto português","zh":"中文文本","ar":"النص العربي"}

Text: """${text}"""`;
}

function extractJSON(content) {
  // Intenta varias estrategias para extraer el JSON de la respuesta de Claude
  const strategies = [
    // Estrategia 1: match directo de objeto JSON con 4 claves de 2 letras
    () => {
      const m = content.match(/\{[^}]*"(?:en|pt|zh|ar)"[^}]*"(?:en|pt|zh|ar)"[^}]*"(?:en|pt|zh|ar)"[^}]*"(?:en|pt|zh|ar)"[^}]*\}/i);
      return m ? m[0] : null;
    },
    // Estrategia 2: encontrar el primer { y el ultimo }, asumir que es el JSON
    () => {
      const start = content.indexOf('{');
      const end = content.lastIndexOf('}');
      if (start === -1 || end === -1 || end <= start) return null;
      return content.substring(start, end + 1);
    },
  ];
  for (const s of strategies) {
    try {
      const candidate = s();
      if (!candidate) continue;
      const parsed = JSON.parse(candidate);
      if (typeof parsed === 'object' && parsed !== null) return parsed;
    } catch {}
  }
  return null;
}

function validateTranslations(translated, originalText) {
  if (!translated || typeof translated !== 'object') return false;
  const missing = LANGS_TRANSLATE.filter(l => !translated[l] || typeof translated[l] !== 'string' || translated[l].trim() === '');
  if (missing.length > 0) {
    console.warn(`[wa-catalog-sync] Faltan idiomas: ${missing.join(', ')}`);
    return false;
  }
  // Detecta fuga de español a otros idiomas (texto corto: idéntico al original)
  for (const l of LANGS_TRANSLATE) {
    if (translated[l] === originalText && originalText.length > 3) {
      console.warn(`[wa-catalog-sync] ${l} idéntico a español — posible fuga`);
      return false;
    }
  }
  return true;
}

export async function translateText(text, retries = 2) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('[wa-catalog-sync] No ANTHROPIC_API_KEY');
    return null; // Devolver null para que updateCatalogField use existing translations
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
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
          messages: [{ role: 'user', content: translatePrompt(text) }],
        }),
      });

      if (!res.ok) {
        console.error(`[wa-catalog-sync] API ${res.status} (intento ${attempt}/${retries})`);
        if (attempt < retries) continue;
        return null;
      }

      const data = await res.json();
      const content = data.content?.[0]?.text || '';
      const translations = extractJSON(content);

      if (!translations) {
        console.error(`[wa-catalog-sync] JSON no parseable (intento ${attempt}/${retries}): ${content.substring(0, 120)}`);
        if (attempt < retries) continue;
        return null;
      }

      // Construir resultado: español es el texto original, resto de la traducción
      const result = { es: text };
      for (const l of LANGS_TRANSLATE) {
        result[l] = translations[l] || '';
      }

      if (!validateTranslations(result, text)) {
        if (attempt < retries) {
          console.warn(`[wa-catalog-sync] Reintentando traduccion (${attempt}/${retries})...`);
          continue;
        }
        return null;
      }

      return result;
    } catch (e) {
      console.error(`[wa-catalog-sync] Translate error (intento ${attempt}/${retries}): ${e.message}`);
      if (attempt < retries) continue;
      return null;
    }
  }

  return null;
}

export async function updateCatalogField(catalogData, field, value) {
  if (!catalogData) return null;

  const translated = await translateText(value);

  // Si la traducción falló, NO sobrescribir otros idiomas con español.
  // Solo actualizar español y preservar el resto.
  if (!translated) {
    console.warn('[wa-catalog-sync] Traduccion fallo — actualizando solo español');
    const partial = JSON.parse(JSON.stringify(catalogData));
    const safeSet = (obj, lang) => {
      if (obj && typeof obj === 'object' && lang in (obj || {})) {
        obj[lang] = value;
      }
    };

    switch (field) {
      case 'descripcion':
      case 'p1':
        safeSet(partial.intro?.p1, 'es');
        break;
      case 'p2':
        safeSet(partial.intro?.p2, 'es');
        break;
      case 'titulo':
      case 't1':
        safeSet(partial.cover?.t1, 'es');
        break;
      case 't2':
        safeSet(partial.cover?.t2, 'es');
        break;
      default:
        console.warn(`[wa-catalog-sync] Campo no soportado: ${field}`);
        return null;
    }
    return partial;
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

  // JSON write falla en Vercel (filesystem read-only) — es solo seed local, no es crítico
  const jsonOk = saveCatalogJSON(catalog, updated);
  if (!jsonOk) console.warn('[wa-catalog-sync] JSON write failed (Vercel filesystem read-only) — Turso es fuente de verdad');

  const tursoOk = await syncToTurso(catalogKey, updated);
  if (!tursoOk) {
    return { success: false, error: 'Error al guardar en base de datos. Intenta de nuevo.' };
  }

  return {
    success: true,
    catalog: catalogKey,
    field,
    value,
    jsonOk,
    tursoOk,
  };
}
