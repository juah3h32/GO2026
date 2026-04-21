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
//  PDF INDIVIDUAL — Usando Puppeteer vía /api/export-pdf
// ─────────────────────────────────────────────────────────────────────────────
export async function descargarPerfilPDF(candidate) {
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
        <div class="cv-badge">
          <div class="cv-icon-wrap">📎</div>
          <div class="cv-info">
            <div class="cv-name">${escapeHtml(fmt(candidate.cv_nombre))}</div>
            <div class="cv-hint">Adjunto en la postulación</div>
          </div>
        </div>
      ` : `
        <div class="cv-badge">
          <div class="cv-icon-wrap">📎</div>
          <div class="cv-info">
            <div class="cv-name">${escapeHtml(fmt(candidate.cv_nombre))}</div>
            <div class="cv-hint" style="color:#ef444488">Archivo no disponible</div>
          </div>
        </div>
      `}
    </div>
  ` : '';

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
    body { font-family:'DM Sans',sans-serif; background:#fff; color:#111; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .page { max-width:720px; margin:0 auto; padding:48px 40px; }
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
    .candidate-hero { display:flex; align-items:center; gap:20px; padding:20px 24px; background:#fafafa; border:1px solid #eee; border-radius:12px; margin-bottom:24px; }
    .avatar { width:64px; height:64px; border-radius:16px; background:linear-gradient(135deg,#E8521A22,#E8521A44); border:2px solid #E8521A33; display:flex; align-items:center; justify-content:center; font-size:28px; flex-shrink:0; }
    .candidate-name   { font-size:22px; font-weight:600; color:#111; letter-spacing:-0.02em; margin-bottom:4px; }
    .candidate-puesto { font-size:14px; color:#E8521A; font-weight:500; margin-bottom:8px; }
    .status-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:5px; font-size:10px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; background:#E8521A15; color:#E8521A; border:1px solid #E8521A25; }
    .section { margin-bottom:22px; }
    .section-title { font-size:9px; font-weight:600; color:#bbb; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid #eee; }
    .fields-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    .field { padding:10px 14px; background:#fafafa; border:1px solid #eee; border-radius:8px; }
    .field-label { font-size:9px; font-weight:500; color:#bbb; text-transform:uppercase; letter-spacing:0.07em; margin-bottom:4px; }
    .field-value { font-size:13px; color:#111; word-break:break-word; }
    .field-value.accent { color:#E8521A; font-weight:500; }
    .field-value.blue   { color:#3B82F6; }
    .field-value.green  { color:#22C55E; font-family:'DM Mono',monospace; font-size:12px; }
    .cv-badge { display:flex; align-items:center; gap:14px; padding:14px 18px; background:#14B8A608; border:1px solid #14B8A630; border-radius:10px; }
    .cv-icon-wrap { font-size:22px; flex-shrink:0; }
    .cv-info  { flex:1; min-width:0; }
    .cv-name  { font-size:13px; color:#14B8A6; font-weight:600; word-break:break-all; margin-bottom:3px; }
    .cv-hint  { font-size:10px; color:#14B8A6; opacity:0.7; }
    .mensaje-box { padding:12px 16px; background:#fafafa; border:1px solid #eee; border-left:3px solid #E8521A; border-radius:8px; font-size:12px; color:#555; line-height:1.7; }
    .footer { margin-top:32px; padding-top:16px; border-top:1px solid #eee; display:flex; align-items:center; justify-content:space-between; }
    .footer-left  { font-size:10px; color:#ccc; }
    .footer-right { font-size:10px; color:#ccc; font-family:'DM Mono',monospace; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo-area">
        <div class="logo-fallback">GO</div>
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
    <div class="candidate-hero">
      <div class="avatar">👤</div>
      <div>
        <div class="candidate-name">${escapeHtml(fmt(candidate.nombre))}</div>
        <div class="candidate-puesto">${escapeHtml(fmt(candidate.puesto))}</div>
        <span class="status-badge">${status}</span>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Datos personales</div>
      <div class="fields-grid">
        <div class="field"><div class="field-label">Nombre completo</div><div class="field-value">${escapeHtml(fmt(candidate.nombre))}</div></div>
        <div class="field"><div class="field-label">Edad</div><div class="field-value">${candidate.edad ? escapeHtml(String(candidate.edad)) + ' años' : '—'}</div></div>
        <div class="field"><div class="field-label">Estado (República)</div><div class="field-value">${escapeHtml(fmt(candidate.estado_rep))}</div></div>
        <div class="field"><div class="field-label">Colonia / Municipio</div><div class="field-value">${escapeHtml(fmt(candidate.colonia))}</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Contacto</div>
      <div class="fields-grid">
        <div class="field"><div class="field-label">Correo electrónico</div><div class="field-value blue">${escapeHtml(fmt(candidate.email))}</div></div>
        <div class="field"><div class="field-label">WhatsApp / Teléfono</div><div class="field-value green">${escapeHtml(fmt(candidate.telefono))}</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Postulación</div>
      <div class="fields-grid">
        <div class="field"><div class="field-label">Puesto solicitado</div><div class="field-value accent">${escapeHtml(fmt(candidate.puesto))}</div></div>
        <div class="field"><div class="field-label">Estado de solicitud</div><div class="field-value">${status}</div></div>
      </div>
    </div>
    ${cvBlock}
    ${candidate.mensaje ? `
    <div class="section">
      <div class="section-title">Último mensaje del candidato</div>
      <div class="mensaje-box">${escapeHtml(candidate.mensaje)}</div>
    </div>` : ''}
    <div class="footer">
      <div class="footer-left">Grupo Ortiz · BotGO — Sistema de Reclutamiento Automatizado</div>
      <div class="footer-right">Generado: ${ahora} (hora Morelia)</div>
    </div>
  </div>
</body>
</html>`;

  try {
    const filename = `Perfil_${candidate.nombre?.replace(/\s+/g, '_') || 'Candidato'}_${folio}.pdf`;
    const response = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html, filename }),
    });

    if (!response.ok) throw new Error('Error al generar PDF');

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  } catch (err) {
    console.error('[export-pdf-client]', err);
    alert('No se pudo generar el PDF. Revisa la consola.');
  }
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
//  PDF GENERAL — Reporte completo
// ─────────────────────────────────────────────────────────────────────────────
export async function exportarTodoPDF(candidates) {
  const ahora = new Date().toLocaleString('es-MX', { timeZone:'America/Mexico_City', day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  const total = candidates.length;
  const conCv = candidates.filter(c => c.cv_nombre).length;
  const STATUS_COLOR = { nuevo:'#E8521A', visto:'#F59E0B', contactado:'#3B82F6', descartado:'#6B7280', contratado:'#22C55E' };

  const rows = candidates.map(c => {
    const st = c.status||c.estado||'nuevo';
    return `
      <tr>
        <td style="font-family:monospace;color:#E8521A;font-weight:bold">${c.id?`#${String(c.id).padStart(5,'0')}`:'—'}</td>
        <td style="font-weight:600">${escapeHtml(c.nombre||'—')}</td>
        <td style="color:#E8521A;font-weight:500">${escapeHtml(c.puesto||'—')}</td>
        <td style="text-align:center">${c.edad||'—'}</td>
        <td>${escapeHtml(c.estado_rep||'—')}</td>
        <td style="color:#3B82F6">${escapeHtml(c.email||'—')}</td>
        <td style="font-family:monospace;color:#22C55E">${escapeHtml(c.telefono||'—')}</td>
        <td style="color:${STATUS_COLOR[st]||'#E8521A'};font-weight:600;text-align:center">${STATUS_LABELS[st]||'Nuevo'}</td>
        <td style="text-align:center">${c.cv_nombre?'✓':'—'}</td>
        <td style="color:#888;font-size:10px">${formatFechaCorta(c.created_at||c.ts)}</td>
      </tr>`;
  }).join('');

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono&display=swap');
    body { font-family:'DM Sans', sans-serif; font-size:9pt; margin:0; padding:20px; color:#333; }
    table { border-collapse:collapse; width:100%; margin-top:20px; table-layout: fixed; }
    th { background:#E8521A; color:#fff; font-weight:700; padding:8px 6px; border:1px solid #c94415; text-align:left; font-size:8pt; }
    td { padding:6px 4px; border:1px solid #eee; font-size:8pt; vertical-align:middle; word-wrap: break-word; }
    tr:nth-child(even) td { background:#fafafa; }
    h1 { color:#E8521A; font-size:18pt; margin-bottom:4px; }
    .sub { color:#888; font-size:9pt; margin-bottom:14px; }
    .resumen { background:#fff8f5; border:1px solid #E8521A33; padding:10px 14px; margin-bottom:16px; font-size:9pt; border-radius:8px; }
    @page { size: A4 landscape; margin: 10mm; }
  </style>
</head>
<body>
  <h1>🤝 Reporte de Candidatos — Grupo Ortiz</h1>
  <div class="sub">Generado por BotGO · ${ahora} (hora Morelia)</div>
  <div class="resumen">
    <strong>Total:</strong> ${total} &nbsp;|&nbsp;
    <strong>Con CV:</strong> ${conCv} &nbsp;|&nbsp;
    <strong>Contratados:</strong> ${candidates.filter(c=>(c.status||c.estado)==='contratado').length}
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:50px">Folio</th>
        <th>Nombre</th>
        <th>Puesto</th>
        <th style="width:35px">Edad</th>
        <th>Estado</th>
        <th>Email</th>
        <th>WhatsApp</th>
        <th style="width:70px">Estatus</th>
        <th style="width:25px">CV</th>
        <th style="width:85px">Fecha</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

  try {
    const filename = `Reporte_Candidatos_${new Date().toISOString().split('T')[0]}.pdf`;
    const response = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html, filename }),
    });
    if (!response.ok) throw new Error('Error al generar PDF');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  } catch (err) {
    console.error('[export-pdf-client]', err);
    alert('No se pudo generar el PDF del reporte.');
  }
}