// src/lib/go-radar.js
// Integración con GO Radar (responsable: Damián Morales). Cuando el bot registra
// a un candidato para una vacante PUBLICADA POR RADAR (trae link_externo), se le
// reenvía la postulación — con su CV si lo tiene — para que Radar le cree folio
// y clave de seguimiento y maneje ahí el aviso de privacidad.
// Doc: API_Radar_Postulaciones_del_Bot_07_11_26.md (v3, 2026-11-09)
//
// v3 — qué cambió respecto a v2: solo vacante_id y nombre son obligatorios.
// correo, telefono, edad, estado, colonia y cv son TODOS opcionales — y si no
// se tiene el dato, el campo NO debe mandarse (ni siquiera como cadena vacía):
// mandar el campo vacío lo valida igual que si trajera un valor real y Radar
// lo puede rechazar (ej. edad='' → edad_invalida), por lo que la postulación
// completa fallaba y nunca llegaba a Radar aunque el candidato sí quedara
// guardado localmente. Por eso cada campo opcional solo se agrega al
// FormData cuando tiene un valor.
//
// Config en .env: GO_RADAR_API_KEY (llave "gor_..." que entrega Damián desde
// Radar → Administración → Grupo Ortiz oficial → "Llaves para el bot de la
// página oficial"). Nunca exponerla en código de navegador.

const RADAR_BASE_URL = process.env.GO_RADAR_BASE_URL || import.meta.env?.GO_RADAR_BASE_URL || 'https://go-radar.com.mx';

// Una vacante es de Radar si trae link_externo — misma regla que ya usa la
// página de vacantes para redirigir al botón "Postular" (ver VacantesPage.jsx).
export function esVacanteGoRadar(vacante) {
  return !!(vacante && vacante.link_externo);
}

const CODIGOS_AMIGABLES = {
  falta_nombre:           'Falta el nombre.',
  vacante_invalida:       'Identificador de vacante inválido.',
  edad_invalida:          'La edad debe estar entre 15 y 99 años.',
  telefono_invalido:      'El teléfono no es válido.',
  correo_invalido:        'El correo no es válido.',
  dato_demasiado_largo:   'Algún dato es demasiado largo.',
  solicitud_invalida:     'Identificador de solicitud inválido.',
  cv_rechazado:           'El archivo del CV no es válido (usa PDF, PNG o JPG de hasta 5 MB).',
  vacante_no_encontrada:  'Esa vacante no está publicada por GO Radar.',
  vacante_no_disponible:  'Esa vacante ya no recibe postulaciones.',
  ya_postulado:           'Ya hay una postulación registrada con estos datos para esa vacante.',
  envio_demasiado_grande: 'El CV es demasiado pesado.',
};

// Envía una postulación a Radar. Solo vacante_id y nombre son obligatorios —
// el resto (correo, teléfono, edad, estado, colonia, cv) se manda solo si el
// candidato lo dio; un campo opcional sin valor nunca se incluye en el envío.
// Devuelve:
//   éxito  → { ok:true, referencia, clave, repetida, seguimiento_url, preguntas_pendientes, mensaje, sinCv }
//   error  → { ok:false, status, codigo, mensaje }
export async function enviarPostulacionAGoRadar({
  vacanteId, nombre, edad, estado, colonia, telefono, correo,
  cvBuffer, cvNombre, cvTipo, solicitudId,
}) {
  const apiKey = process.env.GO_RADAR_API_KEY || import.meta.env?.GO_RADAR_API_KEY;
  if (!apiKey) {
    console.warn('[go-radar] GO_RADAR_API_KEY no configurada — postulación NO enviada a Radar.');
    return { ok: false, status: 0, codigo: 'sin_configurar', mensaje: 'GO Radar no está configurado todavía.' };
  }

  const sinCv = !cvBuffer || !cvBuffer.length;

  const form = new FormData();
  form.set('vacante_id', String(vacanteId));
  form.set('nombre', String(nombre || ''));
  if (correo)    form.set('correo', String(correo));
  if (telefono)  form.set('telefono', String(telefono));
  if (edad)      form.set('edad', String(edad));
  if (estado)    form.set('estado', String(estado));
  if (colonia)   form.set('colonia', String(colonia));
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
      return {
        ok: true,
        referencia: data.referencia || null,
        clave: data.clave ?? null,
        repetida: !!data.repetida,
        seguimiento_url: data.seguimiento_url || `${RADAR_BASE_URL}/seguimiento`,
        preguntas_pendientes: data.preguntas_pendientes || 0,
        mensaje: data.mensaje || '',
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
