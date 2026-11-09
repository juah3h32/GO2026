// src/lib/go-radar.js
// Integración con GO Radar (responsable: Damián Morales). Cuando el bot registra
// a un candidato para una vacante PUBLICADA POR RADAR (trae link_externo), se le
// reenvía la postulación — con su CV — para que Radar le cree folio y clave de
// seguimiento y maneje ahí el aviso de privacidad.
// Doc: API_Radar_Postulaciones_del_Bot_07_11_26.md (v2, 2026-11-07)
//
// Config en .env: GO_RADAR_API_KEY (llave "gor_..." que entrega Damián desde
// Radar → Administración → Grupo Ortiz oficial → "Llaves para el bot de la
// página oficial"). Nunca exponerla en código de navegador.

const RADAR_BASE_URL = process.env.GO_RADAR_BASE_URL || 'https://go-radar.com.mx';

// Una vacante es de Radar si trae link_externo — misma regla que ya usa la
// página de vacantes para redirigir al botón "Postular" (ver VacantesPage.jsx).
export function esVacanteGoRadar(vacante) {
  return !!(vacante && vacante.link_externo);
}

// Radar exige el campo `cv` siempre. Si el candidato no subió uno, se arma un
// PDF mínimo con sus datos de contacto para que Radar igual cree folio/clave
// — el candidato queda registrado y RH lo contacta directo, sin CV real.
async function generarCvPlaceholder({ nombre, telefono, correo, edad, estado, colonia, puesto }) {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 400]);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = 350;
  const linea = (texto, { size = 12, font = regular } = {}) => {
    page.drawText(texto, { x: 50, y, size, font, color: rgb(0.1, 0.1, 0.1) });
    y -= size + 12;
  };

  linea('Postulación sin CV adjunto', { size: 16, font: bold });
  y -= 6;
  linea(`Puesto: ${puesto || '-'}`);
  linea(`Nombre: ${nombre || '-'}`);
  linea(`Teléfono: ${telefono || '-'}`);
  linea(`Correo: ${correo || '-'}`);
  linea(`Edad: ${edad || '-'}`);
  linea(`Estado: ${estado || '-'}`);
  linea(`Colonia: ${colonia || '-'}`);
  y -= 10;
  linea('Candidato postulado desde el bot de grupo-ortiz.com sin CV.', { size: 9 });
  linea('Contactar directamente con los datos de arriba.', { size: 9 });

  return Buffer.from(await pdfDoc.save());
}

const CODIGOS_AMIGABLES = {
  falta_nombre:         'Falta el nombre.',
  falta_domicilio:      'Falta el estado o la colonia.',
  falta_cv:             'Esta vacante requiere CV para postularte con GO Radar.',
  edad_invalida:        'La edad debe estar entre 15 y 99 años.',
  telefono_invalido:    'El teléfono no es válido.',
  correo_invalido:      'El correo no es válido.',
  dato_demasiado_largo: 'Algún dato es demasiado largo.',
  solicitud_invalida:   'Identificador de solicitud inválido.',
  vacante_invalida:     'Identificador de vacante inválido.',
  cv_rechazado:         'El archivo del CV no es válido (usa PDF, PNG o JPG de hasta 5 MB).',
  vacante_no_encontrada: 'Esa vacante no está publicada por GO Radar.',
  vacante_no_disponible: 'Esa vacante ya no recibe postulaciones.',
  ya_postulado:          'Ya hay una postulación registrada con estos datos para esa vacante.',
  envio_demasiado_grande: 'El CV es demasiado pesado.',
};

// Envía una postulación a Radar. Si no hay cvBuffer, se genera un PDF
// placeholder con los datos de contacto (Radar exige el campo `cv` siempre).
// Devuelve:
//   éxito  → { ok:true, referencia, clave, repetida, seguimiento_url, preguntas_pendientes, mensaje, sinCv }
//   error  → { ok:false, status, codigo, mensaje }
export async function enviarPostulacionAGoRadar({
  vacanteId, nombre, edad, estado, colonia, telefono, correo, puesto,
  cvBuffer, cvNombre, cvTipo, solicitudId,
}) {
  const apiKey = process.env.GO_RADAR_API_KEY;
  if (!apiKey) {
    console.warn('[go-radar] GO_RADAR_API_KEY no configurada — postulación NO enviada a Radar.');
    return { ok: false, status: 0, codigo: 'sin_configurar', mensaje: 'GO Radar no está configurado todavía.' };
  }

  let cvFinal = cvBuffer, cvNombreFinal = cvNombre, cvTipoFinal = cvTipo, sinCv = false;
  if (!cvFinal || !cvFinal.length) {
    try {
      cvFinal = await generarCvPlaceholder({ nombre, telefono, correo, edad, estado, colonia, puesto });
      cvNombreFinal = 'postulacion-sin-cv.pdf';
      cvTipoFinal = 'application/pdf';
      sinCv = true;
    } catch (e) {
      console.error('[go-radar] No se pudo generar el CV placeholder:', e.message);
      return { ok: false, status: 0, codigo: 'falta_cv', mensaje: CODIGOS_AMIGABLES.falta_cv };
    }
  }

  const form = new FormData();
  form.set('vacante_id', String(vacanteId));
  form.set('nombre', String(nombre || ''));
  form.set('edad', String(edad || ''));
  form.set('estado', String(estado || ''));
  form.set('colonia', String(colonia || ''));
  form.set('telefono', String(telefono || ''));
  form.set('correo', String(correo || ''));
  if (solicitudId) form.set('solicitud_id', String(solicitudId));
  form.set('cv', new Blob([cvFinal], { type: cvTipoFinal || 'application/pdf' }), cvNombreFinal || 'cv.pdf');

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
