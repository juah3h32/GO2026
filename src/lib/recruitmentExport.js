// src/lib/recruitmentExport.js

const STATUS_LABELS = {
  nuevo:      'Nuevo',
  visto:      'Visto',
  contactado: 'Contactado',
  descartado: 'Descartado',
  contratado: 'Contratado',
};

function fmt(v) { return v || '—'; }

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─────────────────────────────────────────────────────────────────────────────
//  ✅ FIX HORA: Turso guarda datetime('now') en UTC sin "Z".
//  Al parsear "2026-03-13 21:56:00" el navegador lo trata como hora LOCAL,
//  pero en realidad ES UTC. Solución: añadir "Z" (o " UTC") para forzar
//  la interpretación correcta y luego mostrar en America/Mexico_City.
// ─────────────────────────────────────────────────────────────────────────────
function parseTursoDate(ts) {
  if (!ts) return null;
  try {
    // Turso devuelve "2026-03-13 21:56:00" (espacio, sin Z)
    // ISO 8601 necesita "T" y "Z" para ser inequívoco en UTC
    const iso = ts.trim().replace(' ', 'T') + (ts.includes('Z') ? '' : 'Z');
    const d   = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  } catch { return null; }
}

function formatFechaLarga(ts) {
  const d = parseTursoDate(ts);
  if (!d) return '—';
  return d.toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    weekday: 'long', day: '2-digit', month: 'long',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function formatFechaCorta(ts) {
  const d = parseTursoDate(ts);
  if (!d) return '—';
  return d.toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  PDF INDIVIDUAL — logo real + CV clickeable + hora corregida
// ─────────────────────────────────────────────────────────────────────────────
export function descargarPerfilPDF(candidate) {
  const folio       = candidate.id ? `#${String(candidate.id).padStart(5, '0')}` : '—';
  const fecha       = formatFechaLarga(candidate.created_at || candidate.ts);
  const status      = STATUS_LABELS[candidate.status || candidate.estado] || 'Nuevo';
  const tieneCv     = !!(candidate.cv_nombre);
  const tieneBase64 = !!(candidate.cv_base64);
  const cvMimeType  = candidate.cv_tipo || 'application/pdf';
  const cvDataUrl   = tieneBase64 ? `data:${cvMimeType};base64,${candidate.cv_base64}` : null;

  const cvBlock = tieneCv ? `
    <div class="section">
      <div class="section-title">Curriculum Vitae</div>
      ${tieneBase64 ? `
        <a class="cv-badge cv-clickable" href="${cvDataUrl}" download="${candidate.cv_nombre}" target="_blank">
          <div class="cv-icon-wrap">📎</div>
          <div class="cv-info">
            <div class="cv-name">${escapeHtml(fmt(candidate.cv_nombre))}</div>
            <div class="cv-hint">👆 Clic para abrir / descargar el CV adjunto</div>
          </div>
          <div class="cv-arrow">⬇</div>
        </a>
      ` : `
        <div class="cv-badge">
          <div class="cv-icon-wrap">📎</div>
          <div class="cv-info">
            <div class="cv-name">${escapeHtml(fmt(candidate.cv_nombre))}</div>
            <div class="cv-hint" style="color:#ef444488">Archivo no disponible en la base de datos</div>
          </div>
        </div>
      `}
    </div>
  ` : '';

  // Hora de generación también en Mexico_City
  const ahora = new Date().toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Perfil ${folio} — ${escapeHtml(fmt(candidate.nombre))}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

    body {
      font-family:'DM Sans',sans-serif;
      background:#fff; color:#111;
      -webkit-print-color-adjust:exact; print-color-adjust:exact;
    }
    .page { max-width:720px; margin:0 auto; padding:48px 40px; }

    /* Header */
    .header { display:flex; align-items:center; justify-content:space-between; padding-bottom:22px; border-bottom:2px solid #E8521A; margin-bottom:28px; }
    .logo-area  { display:flex; align-items:center; gap:14px; }
    .logo-img   { height:48px; width:auto; max-width:180px; object-fit:contain; display:block; }
    .logo-fallback { height:48px; width:48px; border-radius:12px; background:#E8521A; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:18px; }
    .company-label { font-size:11px; color:#999; line-height:1.6; }
    .company-label strong { color:#333; font-size:13px; display:block; }

    .folio-area  { text-align:right; flex-shrink:0; }
    .folio-label { font-size:9px; color:#bbb; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:3px; }
    .folio-num   { font-family:'DM Mono',monospace; font-size:22px; font-weight:500; color:#E8521A; letter-spacing:-0.04em; }
    .fecha-reg   { font-size:10px; color:#aaa; margin-top:4px; }

    /* Hero */
    .candidate-hero { display:flex; align-items:center; gap:20px; padding:20px 24px; background:#fafafa; border:1px solid #eee; border-radius:12px; margin-bottom:24px; }
    .avatar { width:64px; height:64px; border-radius:16px; background:linear-gradient(135deg,#E8521A22,#E8521A44); border:2px solid #E8521A33; display:flex; align-items:center; justify-content:center; font-size:28px; flex-shrink:0; }
    .candidate-name   { font-size:22px; font-weight:600; color:#111; letter-spacing:-0.02em; margin-bottom:4px; }
    .candidate-puesto { font-size:14px; color:#E8521A; font-weight:500; margin-bottom:8px; }
    .status-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:5px; font-size:10px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; background:#E8521A15; color:#E8521A; border:1px solid #E8521A25; }

    /* Sections */
    .section { margin-bottom:22px; }
    .section-title { font-size:9px; font-weight:600; color:#bbb; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid #eee; }

    /* Fields */
    .fields-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    .field { padding:10px 14px; background:#fafafa; border:1px solid #eee; border-radius:8px; }
    .field-label { font-size:9px; font-weight:500; color:#bbb; text-transform:uppercase; letter-spacing:0.07em; margin-bottom:4px; }
    .field-value { font-size:13px; color:#111; word-break:break-word; }
    .field-value.accent { color:#E8521A; font-weight:500; }
    .field-value.blue   { color:#3B82F6; }
    .field-value.green  { color:#22C55E; font-family:'DM Mono',monospace; font-size:12px; }

    /* CV */
    .cv-badge { display:flex; align-items:center; gap:14px; padding:14px 18px; background:#14B8A608; border:1px solid #14B8A630; border-radius:10px; text-decoration:none; color:inherit; }
    .cv-clickable { cursor:pointer; background:#14B8A610; border:1.5px solid #14B8A650; transition:background 0.15s, border-color 0.15s, transform 0.1s, box-shadow 0.15s; }
    .cv-clickable:hover { background:#14B8A622 !important; border-color:#14B8A6 !important; transform:translateY(-2px); box-shadow:0 6px 20px #14B8A622; }
    .cv-clickable:active { transform:translateY(0); }
    .cv-icon-wrap { font-size:22px; flex-shrink:0; }
    .cv-info  { flex:1; min-width:0; }
    .cv-name  { font-size:13px; color:#14B8A6; font-weight:600; word-break:break-all; margin-bottom:3px; }
    .cv-hint  { font-size:10px; color:#14B8A6; opacity:0.7; }
    .cv-arrow { font-size:20px; color:#14B8A6; flex-shrink:0; opacity:0.8; }

    /* Mensaje */
    .mensaje-box { padding:12px 16px; background:#fafafa; border:1px solid #eee; border-left:3px solid #E8521A; border-radius:8px; font-size:12px; color:#555; line-height:1.7; }

    /* Footer */
    .footer { margin-top:32px; padding-top:16px; border-top:1px solid #eee; display:flex; align-items:center; justify-content:space-between; }
    .footer-left  { font-size:10px; color:#ccc; }
    .footer-right { font-size:10px; color:#ccc; font-family:'DM Mono',monospace; }

    /* Print btn */
    .print-btn { position:fixed; top:20px; right:20px; padding:10px 22px; background:#E8521A; color:#fff; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; box-shadow:0 4px 14px #E8521A55; transition:background 0.15s; z-index:999; }
    .print-btn:hover { background:#c94415; }

    @media print {
      .no-print { display:none !important; }
      .page { padding:32px 28px; max-width:100%; }
      .cv-clickable { transform:none !important; box-shadow:none !important; }
    }
  </style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">🖨 Imprimir / Guardar PDF</button>

  <div class="page">

    <!-- Header con logo real -->
    <div class="header">
      <div class="logo-area">
        <img
          src="/images/logoN.png"
          alt="Grupo Ortiz"
          class="logo-img"
          onerror="this.style.display='none';document.getElementById('logo-fb').style.display='flex';"
        />
        <div id="logo-fb" class="logo-fallback" style="display:none;">GO</div>
        <div class="company-label">
          <strong>Grupo Ortiz</strong>
          Recursos Humanos · Reclutamiento
        </div>
      </div>
      <div class="folio-area">
        <div class="folio-label">Folio de candidato</div>
        <div class="folio-num">${folio}</div>
        <div class="fecha-reg">Registro: ${fecha}</div>
      </div>
    </div>

    <!-- Hero -->
    <div class="candidate-hero">
      <div class="avatar">👤</div>
      <div>
        <div class="candidate-name">${escapeHtml(fmt(candidate.nombre))}</div>
        <div class="candidate-puesto">${escapeHtml(fmt(candidate.puesto))}</div>
        <span class="status-badge">${status}</span>
      </div>
    </div>

    <!-- Datos personales -->
    <div class="section">
      <div class="section-title">Datos personales</div>
      <div class="fields-grid">
        <div class="field"><div class="field-label">Nombre completo</div><div class="field-value">${escapeHtml(fmt(candidate.nombre))}</div></div>
        <div class="field"><div class="field-label">Edad</div><div class="field-value">${candidate.edad ? escapeHtml(String(candidate.edad)) + ' años' : '—'}</div></div>
        <div class="field"><div class="field-label">Estado (República)</div><div class="field-value">${escapeHtml(fmt(candidate.estado_rep))}</div></div>
        <div class="field"><div class="field-label">Colonia / Municipio</div><div class="field-value">${escapeHtml(fmt(candidate.colonia))}</div></div>
      </div>
    </div>

    <!-- Contacto -->
    <div class="section">
      <div class="section-title">Contacto</div>
      <div class="fields-grid">
        <div class="field"><div class="field-label">Correo electrónico</div><div class="field-value blue">${escapeHtml(fmt(candidate.email))}</div></div>
        <div class="field"><div class="field-label">WhatsApp / Teléfono</div><div class="field-value green">${escapeHtml(fmt(candidate.telefono))}</div></div>
      </div>
    </div>

    <!-- Postulación -->
    <div class="section">
      <div class="section-title">Postulación</div>
      <div class="fields-grid">
        <div class="field"><div class="field-label">Puesto solicitado</div><div class="field-value accent">${escapeHtml(fmt(candidate.puesto))}</div></div>
        <div class="field"><div class="field-label">Estado de solicitud</div><div class="field-value">${status}</div></div>
      </div>
    </div>

    <!-- CV -->
    ${cvBlock}

    <!-- Mensaje -->
    ${candidate.mensaje ? `
    <div class="section">
      <div class="section-title">Último mensaje del candidato</div>
      <div class="mensaje-box">${escapeHtml(candidate.mensaje)}</div>
    </div>` : ''}

    <!-- Footer -->
    <div class="footer">
      <div class="footer-left">Grupo Ortiz · BotGO — Sistema de Reclutamiento Automatizado</div>
      <div class="footer-right">Generado: ${ahora} (hora Morelia)</div>
    </div>

  </div>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=820,height=960');
  if (!win) { alert('Permite ventanas emergentes para ver el perfil.'); return; }
  win.document.write(html);
  win.document.close();
}

// ─────────────────────────────────────────────────────────────────────────────
//  CSV
// ─────────────────────────────────────────────────────────────────────────────
export function exportarTodoCSV(candidates) {
  const headers = ['Folio','Nombre','Puesto','Edad','Estado (República)','Colonia/Municipio','Email','Teléfono/WhatsApp','Estado Solicitud','Tiene CV','Archivo CV','Fecha Registro'];
  const escape  = (v) => `"${String(v||'').replace(/"/g,'""')}"`;
  const rows    = candidates.map(c => [
    escape(c.id ? `#${String(c.id).padStart(5,'0')}` : ''),
    escape(c.nombre), escape(c.puesto), escape(c.edad),
    escape(c.estado_rep), escape(c.colonia),
    escape(c.email), escape(c.telefono),
    escape(STATUS_LABELS[c.status||c.estado]||'Nuevo'),
    escape(c.cv_nombre ? 'Sí' : 'No'),
    escape(c.cv_nombre||''),
    escape(formatFechaCorta(c.created_at||c.ts)),  // ✅ hora corregida
  ]);
  const csv  = [headers.map(h=>`"${h}"`).join(','), ...rows.map(r=>r.join(','))].join('\r\n');
  const blob = new Blob(['\uFEFF'+csv], { type:'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `candidatos_grupo_ortiz_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

// ─────────────────────────────────────────────────────────────────────────────
//  EXCEL HTML
// ─────────────────────────────────────────────────────────────────────────────
export function exportarTodoExcel(candidates) {
  const ahora = new Date().toLocaleString('es-MX', { timeZone:'America/Mexico_City' });
  const total = candidates.length;
  const conCv = candidates.filter(c => c.cv_nombre).length;
  const STATUS_COLOR = { nuevo:'#E8521A', visto:'#F59E0B', contactado:'#3B82F6', descartado:'#6B7280', contratado:'#22C55E' };

  const rows = candidates.map(c => {
    const st = c.status||c.estado||'nuevo';
    return `
      <tr>
        <td style="font-family:monospace;color:#E8521A;font-weight:bold">${c.id?`#${String(c.id).padStart(5,'0')}`:'—'}</td>
        <td style="font-weight:600">${c.nombre||'—'}</td>
        <td style="color:#E8521A;font-weight:500">${c.puesto||'—'}</td>
        <td style="text-align:center">${c.edad||'—'}</td>
        <td>${c.estado_rep||'—'}</td>
        <td>${c.colonia||'—'}</td>
        <td style="color:#3B82F6">${c.email||'—'}</td>
        <td style="font-family:monospace;color:#22C55E">${c.telefono||'—'}</td>
        <td style="color:${STATUS_COLOR[st]||'#E8521A'};font-weight:600;text-align:center">${STATUS_LABELS[st]||'Nuevo'}</td>
        <td style="text-align:center">${c.cv_nombre?'✓':'—'}</td>
        <td>${c.cv_nombre||'—'}</td>
        <td style="color:#888;font-size:11px">${formatFechaCorta(c.created_at||c.ts)}</td>
      </tr>`;
  }).join('');

  const html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="UTF-8"/>
  <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Candidatos</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
  <style>
    body { font-family:Calibri,Arial,sans-serif; font-size:11pt; }
    table { border-collapse:collapse; width:100%; }
    th { background:#E8521A; color:#fff; font-weight:700; padding:8px 12px; border:1px solid #c94415; text-align:left; font-size:10pt; white-space:nowrap; }
    td { padding:7px 11px; border:1px solid #e5e5e5; font-size:10pt; vertical-align:middle; }
    tr:nth-child(even) td { background:#fafafa; }
    h1 { color:#E8521A; font-size:18pt; margin-bottom:4px; }
    .sub { color:#888; font-size:10pt; margin-bottom:14px; }
    .resumen { background:#fff8f5; border:1px solid #E8521A33; padding:12px 16px; margin-bottom:16px; font-size:10pt; }
  </style>
</head>
<body>
  <h1>🤝 Reporte de Candidatos — Grupo Ortiz</h1>
  <div class="sub">Generado por BotGO · ${ahora} (hora Morelia)</div>
  <div class="resumen">
    <strong>Total:</strong> ${total} &nbsp;|&nbsp;
    <strong>Con CV:</strong> ${conCv} &nbsp;|&nbsp;
    <strong>Sin CV:</strong> ${total - conCv} &nbsp;|&nbsp;
    <strong>Contratados:</strong> ${candidates.filter(c=>(c.status||c.estado)==='contratado').length}
  </div>
  <table>
    <thead>
      <tr><th>Folio</th><th>Nombre</th><th>Puesto</th><th>Edad</th><th>Estado (Rep.)</th><th>Colonia/Municipio</th><th>Email</th><th>WhatsApp/Tel.</th><th>Estatus</th><th>CV</th><th>Archivo CV</th><th>Fecha Registro</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

  const blob = new Blob(['\uFEFF'+html], { type:'application/vnd.ms-excel;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `candidatos_grupo_ortiz_${new Date().toISOString().split('T')[0]}.xls`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}