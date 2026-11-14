// src/lib/go-radar-v1.js
// Cliente del espejo completo con GO Radar — API v1 de Radar (responsable:
// Damián Morales). Distinto de src/lib/go-radar.js (ese es la API del bot,
// v6, ya en producción, no se toca). Doc:
// Espejo_Radar_GO_Oficial_Guia_Completa_13_11_26.md §§5-6.
//
// PENDIENTE (13/11/26): la API v1 de Radar está construida y probada pero
// TODAVÍA NO desplegada en producción, y no hay llave maestra entregada aún.
// Por eso cada función revisa GO_RADAR_MASTER_API_KEY y, si falta, regresa
// { ok:false, codigo:'sin_configurar' } sin tronar — igual patrón que
// go-radar.js — para que el espejo saliente se encienda solo con poner la
// variable de entorno, sin tocar código, el día que Radar la entregue.
//
// Config en .env: GO_RADAR_MASTER_API_KEY (llave "gor_..." con TODOS los
// permisos — distinta de GO_RADAR_API_KEY que solo tiene "postulaciones").

const RADAR_BASE_URL = process.env.GO_RADAR_BASE_URL || import.meta.env?.GO_RADAR_BASE_URL || 'https://go-radar.com.mx';

function getMasterKey() {
  return process.env.GO_RADAR_MASTER_API_KEY || import.meta.env?.GO_RADAR_MASTER_API_KEY || '';
}

const CODIGOS_AMIGABLES = {
  permiso_insuficiente: 'La llave maestra no tiene el permiso necesario en Radar.',
  no_es_tuyo:           'Ese registro no es de este sistema en Radar.',
  no_encontrada:        'Radar no encontró esa vacante.',
  no_encontrado:        'Radar no encontró ese postulante.',
  vacante_no_encontrada: 'Radar no encontró esa vacante.',
  etapa_cambio:         'La etapa ya había cambiado en Radar.',
  vacante_eliminada:    'Esa vacante fue eliminada en Radar.',
  vacante_archivada:    'Esa vacante está archivada en Radar.',
  vacante_no_disponible: 'Esa vacante no está disponible en Radar (cerrada).',
  referencia_en_uso:    'Ese id del sitio ya está ligado a otra vacante en Radar.',
  referencia_ya_ligada: 'Esa vacante ya tiene otra referencia del sitio en Radar.',
  datos_invalidos:      'Radar rechazó los datos enviados.',
  falta_identidad:      'Falta external_id o id de Radar.',
};

async function radarV1Request(method, path, body) {
  const apiKey = getMasterKey();
  if (!apiKey) {
    console.warn(`[go-radar-v1] GO_RADAR_MASTER_API_KEY no configurada — ${method} ${path} NO se envió.`);
    return { ok: false, status: 0, codigo: 'sin_configurar', mensaje: 'El espejo con GO Radar no está configurado todavía.' };
  }
  try {
    const res = await fetch(`${RADAR_BASE_URL}/api/v1${path}`, {
      method,
      headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true, status: res.status, data };

    const codigo  = data?.detail?.codigo || (res.status === 401 ? 'llave_invalida' : '');
    const mensaje = data?.detail?.mensaje || CODIGOS_AMIGABLES[codigo] || `GO Radar respondió ${res.status}`;
    console.warn(`[go-radar-v1] ${method} ${path} rechazado (${res.status} ${codigo || 's/c'}):`, mensaje);
    return { ok: false, status: res.status, codigo, mensaje, detail: data?.detail || null };
  } catch (e) {
    console.error(`[go-radar-v1] Error de red en ${method} ${path}:`, e.message);
    return { ok: false, status: 0, codigo: 'error_red', mensaje: 'No se pudo contactar a GO Radar, inténtalo de nuevo.' };
  }
}

export async function radarGetYo() {
  return radarV1Request('GET', '/yo');
}

// Crea o actualiza una vacante en Radar. Si viene `idRadar` (ya ligada antes),
// la manda como `id` (con la llave maestra) para actualizar esa; si no, manda
// `external_id` (el id de ESTE sitio) + `referencia_sitio_oficial` para que el
// bot la encuentre (ver guía §6.2 — sin esto, una postulación del bot a esta
// vacante cae en lista de espera).
export async function radarUpsertVacante({ idRadar, vacanteId, titulo, unidad, ubicacion, descripcion, estado }) {
  const body = { titulo, unidad: unidad || '', ubicacion: ubicacion || '', descripcion: descripcion || '', estado: estado || 'abierta' };
  if (idRadar) {
    body.id = idRadar;
    body.external_id = `go-web-${vacanteId}`;
  } else {
    body.external_id = `go-web-${vacanteId}`;
    body.referencia_sitio_oficial = String(vacanteId);
  }
  return radarV1Request('POST', '/vacantes', body);
}

// Crea o actualiza un postulante en Radar (alta manual desde el panel — NO
// usar para postulaciones del bot, esas van por go-radar.js/API v6, "una
// postulación nace por una sola puerta").
export async function radarUpsertPostulante({ leadId, vacanteExternalId, vacanteRadarId, nombre, correo, telefono, edad }) {
  const body = { external_id: `go-web-cand-${leadId}`, nombre };
  if (vacanteRadarId) body.vacante_id = vacanteRadarId;
  else if (vacanteExternalId) body.vacante_external_id = vacanteExternalId;
  if (correo)   body.correo = correo;
  if (telefono) body.telefono = telefono;
  if (edad)     body.edad = edad;
  return radarV1Request('POST', '/postulantes', body);
}

// Mueve la etapa de un postulante por folio. `etapaActual` es la última etapa
// de Radar que el sitio vio (radar_etapa) — si ya cambió, Radar regresa
// 409 etapa_cambio con la etapa real (viene en `detail.etapa_actual`).
export async function radarSetEtapa({ folio, etapa, etapaActual, actualizadoPor }) {
  return radarV1Request('PUT', `/postulantes/por-folio/${encodeURIComponent(folio)}/etapa`, {
    etapa, etapa_actual: etapaActual || null, actualizado_por: actualizadoPor || 'Panel del sitio',
  });
}

// Pagina el registro de cambios de Radar (Flujo D). `desde` es el cursor
// (`siguiente`) de la última llamada.
export async function radarGetCambios({ desde = null, limite = 100, tipos = null } = {}) {
  const qs = new URLSearchParams();
  if (desde)   qs.set('desde', desde);
  if (limite)  qs.set('limite', String(limite));
  if (tipos)   qs.set('tipos', Array.isArray(tipos) ? tipos.join(',') : tipos);
  const query = qs.toString();
  return radarV1Request('GET', `/cambios${query ? `?${query}` : ''}`);
}

// Mapa de etapas §8.2 de la guía — compartido entre el Flujo C saliente
// (recruitment.js), el Flujo D entrante (cron/radar-sync.js) y la API
// entrante §9 (partner/v1/candidatos*.js) para que las tres partes nunca
// se desincronicen.
export const SITE_STATUS_TO_RADAR_ETAPA = {
  nuevo: 'nuevo', visto: 'en_revision', contactado: 'en_revision',
  descartado: 'descartado', contratado: 'contratado',
};

// Inverso — "al leer": si Radar dice en_revision y el candidato ya estaba en
// visto/contactado, se deja igual (no se pierde el detalle que solo el sitio
// conoce).
export function radarEtapaToSiteStatus(etapa, currentStatus) {
  switch (etapa) {
    case 'nuevo':         return 'nuevo';
    case 'en_revision':   return (currentStatus === 'visto' || currentStatus === 'contactado') ? currentStatus : 'visto';
    case 'entrevista':    return 'contactado';
    case 'descartado':    return 'descartado';
    case 'contratado':    return 'contratado';
    case 'descartado_ia': return 'nuevo';
    default:               return currentStatus || 'nuevo';
  }
}
