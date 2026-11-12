// src/lib/go-radar.js
// Integración con GO Radar (responsable: Damián Morales). Toda postulación que
// registra el bot se reenvía a Radar — con vacante_id si matchea una vacante
// publicada por Radar, o sin él si no hay vacante (Radar la guarda en SU
// propia lista de espera) — para que Radar le cree folio y, si aplica, clave
// de seguimiento, y maneje ahí el aviso de privacidad.
// Doc: API_Radar_Postulaciones_del_Bot_07_11_26 (2).md (v5, 2026-11-12)
//
// v5 — qué cambió respecto a v3: solo `nombre` es obligatorio. `vacante_id`
// ya puede faltar — si falta, está vacío, dice "todas", es de una vacante
// que Radar no conoce o ya cerrada, la persona YA NO SE RECHAZA: Radar la
// guarda en su "Lista de espera" (responde 201 con lista_espera:true,
// referencia que empieza con "LE-", clave:null, seguimiento_url:null — ahí
// no hay clave que mostrar ni link de seguimiento todavía). Por eso ahora
// SIEMPRE se manda la postulación, tenga o no vacante de Radar que matchee.
// Nuevo campo opcional `interes` (alias `puesto`): lo que la persona busca,
// útil para que reclutamiento la asigne luego desde la lista de espera.
//
// Config en .env: GO_RADAR_API_KEY (llave "gor_..." que entrega Damián desde
// Radar → Administración → Grupo Ortiz oficial → "Llaves para el bot de la
// página oficial"). Nunca exponerla en código de navegador.

const RADAR_BASE_URL = process.env.GO_RADAR_BASE_URL || import.meta.env?.GO_RADAR_BASE_URL || 'https://go-radar.com.mx';

// Una vacante es de Radar si trae link_externo — misma regla que ya usa la
// página de vacantes para redirigir al botón "Postular" (ver VacantesPage.jsx).
// Ya no decide si se manda o no a Radar (ahora TODO se manda) — solo decide
// si se incluye vacante_id en el envío.
export function esVacanteGoRadar(vacante) {
  return !!(vacante && vacante.link_externo);
}

const CODIGOS_AMIGABLES = {
  falta_nombre:           'Falta el nombre.',
  dato_demasiado_largo:   'Algún dato es demasiado largo.',
  solicitud_invalida:     'Identificador de solicitud inválido.',
  cv_rechazado:           'El archivo del CV no es válido (usa PDF, PNG o JPG de hasta 5 MB).',
  ya_postulado:           'Ya hay una postulación registrada con estos datos para esa vacante.',
  envio_demasiado_grande: 'El CV es demasiado pesado.',
  lista_espera_llena:     'La lista de espera de GO Radar está llena por ahora, inténtalo más tarde.',
};

// Envía una postulación a Radar. Solo `nombre` es obligatorio — todo lo demás
// (vacante_id, interes, correo, teléfono, edad, estado, colonia, cv) se manda
// solo si el candidato lo dio; un campo opcional sin valor nunca se incluye.
// Sin vacanteId, Radar guarda a la persona en su lista de espera (no es error).
// Devuelve:
//   postulación normal → { ok:true, listaEspera:false, referencia, clave, repetida, seguimiento_url, preguntas_pendientes, mensaje, advertencias, sinCv }
//   lista de espera     → { ok:true, listaEspera:true,  referencia, clave:null, seguimiento_url:null, motivo, mensaje }
//   error                → { ok:false, status, codigo, mensaje }
export async function enviarPostulacionAGoRadar({
  vacanteId, nombre, puesto, edad, estado, colonia, telefono, correo,
  cvBuffer, cvNombre, cvTipo, solicitudId,
}) {
  const apiKey = process.env.GO_RADAR_API_KEY || import.meta.env?.GO_RADAR_API_KEY;
  if (!apiKey) {
    console.warn('[go-radar] GO_RADAR_API_KEY no configurada — postulación NO enviada a Radar.');
    return { ok: false, status: 0, codigo: 'sin_configurar', mensaje: 'GO Radar no está configurado todavía.' };
  }
  if (!nombre || !String(nombre).trim()) {
    return { ok: false, status: 0, codigo: 'falta_nombre', mensaje: CODIGOS_AMIGABLES.falta_nombre };
  }

  const sinCv = !cvBuffer || !cvBuffer.length;

  const form = new FormData();
  form.set('nombre', String(nombre));
  if (vacanteId)   form.set('vacante_id', String(vacanteId));
  if (puesto)      form.set('interes', String(puesto));
  if (correo)      form.set('correo', String(correo));
  if (telefono)    form.set('telefono', String(telefono));
  if (edad)        form.set('edad', String(edad));
  if (estado)      form.set('estado', String(estado));
  if (colonia)     form.set('colonia', String(colonia));
  if (solicitudId) form.set('solicitud_id', String(solicitudId));
  if (!sinCv) form.set('cv', new Blob([cvBuffer], { type: cvTipo || 'application/pdf' }), cvNombre || 'cv.pdf');

  try {
    const res  = await fetch(`${RADAR_BASE_URL}/api/integraciones/postulaciones`, {
      method: 'POST',
      headers: { 'X-API-Key': apiKey },
      body: form,
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      const listaEspera = !!data.lista_espera;
      return {
        ok: true,
        listaEspera,
        referencia: data.referencia || null,
        clave: listaEspera ? null : (data.clave ?? null),
        repetida: !!data.repetida,
        motivo: data.motivo || null,
        seguimiento_url: listaEspera ? null : (data.seguimiento_url || `${RADAR_BASE_URL}/seguimiento`),
        preguntas_pendientes: data.preguntas_pendientes || 0,
        mensaje: data.mensaje || '',
        advertencias: data.advertencias || [],
        sinCv,
      };
    }

    const codigo  = data?.detail?.codigo || (res.status === 401 ? 'llave_invalida' : '');
    const mensaje = data?.detail?.mensaje || CODIGOS_AMIGABLES[codigo] || `GO Radar respondió ${res.status}`;
    console.warn(`[go-radar] Postulación rechazada (${res.status} ${codigo || 's/c'}):`, mensaje);
    return { ok: false, status: res.status, codigo, mensaje };
  } catch (e) {
    console.error('[go-radar] Error de red enviando postulación:', e.message);
    return { ok: false, status: 0, codigo: 'error_red', mensaje: 'No se pudo contactar a GO Radar, inténtalo de nuevo.' };
  }
}
