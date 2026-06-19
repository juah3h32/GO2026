// Parser de intents para edición de catálogos vía WhatsApp

const CATALOG_NAMES = {
  'rafia': 'catalogo-rafia.json',
  'cuerda': 'catalogo-cuerda.json',
  'arpilla': 'catalogo-arpilla.json',
  'bolsa': 'catalogo-bolsas.json',
  'saco': 'catalogo-saco.json',
  'stretch': 'catalogo-stretch.json',
  'flexible': 'catalogo-flexible.json',
  'esquinero': 'catalogo-esquinero.json',
  'naturizable': 'catalogo-naturizable.json',
  'acolchado': 'catalogo-acolchado.json',
};

const CHANGE_TYPES = [
  { key: 'descripcion', aliases: ['descripcion', 'p1', 'intro'] },
  { key: 'p2',         aliases: ['p2', 'parrafo 2', 'segundo parrafo'] },
  { key: 'titulo',     aliases: ['titulo', 't1', 'nombre', 'portada'] },
  { key: 't2',         aliases: ['t2', 'subtitulo'] },
];

function norm(text) {
  return String(text || '').toLowerCase().trim().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function parseCatalogIntent(text) {
  const n = norm(text);

  // Detectar trigger
  const isTrigger = n.includes('editar') || n.includes('cambiar') ||
    n.includes('modificar') || n.includes('actualizar') || n.includes('corregir');
  if (!isTrigger) return { success: false };

  // Detectar catálogo
  let catalog = null, catalogKey = null;
  for (const [key, filename] of Object.entries(CATALOG_NAMES)) {
    if (n.includes(key)) { catalog = filename; catalogKey = key; break; }
  }
  if (!catalog) return { success: false };

  // Detectar campo (opcional — si no hay, pedirlo)
  let field = null;
  for (const ct of CHANGE_TYPES) {
    if (ct.aliases.some(a => n.includes(a))) { field = ct.key; break; }
  }

  // Detectar valor (lo que viene después de "a " o ":" — OPCIONAL)
  let value = null;
  const valueMatch = n.match(/\ba\s+(.{3,})$/) || n.match(/:\s*(.{3,})$/);
  if (valueMatch) value = valueMatch[1].trim();

  return { success: true, catalog, catalogKey, field, value };
}

export function validateCatalogChange(parsed) {
  if (!parsed.success) return { success: false, error: 'Mensaje no reconocido como edición de catálogo.' };
  if (parsed.catalog.includes('..') || parsed.catalog.includes('/'))
    return { success: false, error: 'Archivo no permitido.' };
  if (parsed.value && String(parsed.value).length > 500)
    return { success: false, error: 'El texto es muy largo (máx 500 caracteres).' };
  return parsed;
}

export function getCatalogOptions() { return Object.keys(CATALOG_NAMES); }
export function getFieldOptions() { return CHANGE_TYPES.map(c => c.key); }
