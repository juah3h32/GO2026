// Lee valores actuales de catálogos

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function loadCatalogJSON(catalogFile) {
  try {
    const filePath = join(process.cwd(), 'src', 'data', catalogFile);
    const data = readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

export function getCatalogFieldValue(catalogData, field) {
  if (!catalogData) return null;

  switch (field) {
    case 'descripcion':
    case 'p1':
      return catalogData.intro?.p1?.es || null;
    case 'p2':
      return catalogData.intro?.p2?.es || null;
    case 'titulo':
    case 't1':
      return catalogData.cover?.t1?.es || null;
    case 't2':
      return catalogData.cover?.t2?.es || null;
    default:
      return null;
  }
}

export function formatCurrentValue(value) {
  if (!value) return '(vacío)';
  if (value.length > 80) {
    return value.substring(0, 80) + '...';
  }
  return value;
}

export function getFieldLabel(field) {
  const labels = {
    'descripcion': 'Descripción principal',
    'p1': 'Descripción principal',
    'p2': 'Párrafo secundario',
    'titulo': 'Título de portada',
    't1': 'Título de portada',
    't2': 'Subtítulo de portada',
  };
  return labels[field] || field;
}
