// src/components/BibliotecaTab.jsx
// Admin CRUD de "Biblioteca" (videos de testimonios/producto/fabricacion).
// El video se sube DIRECTO del navegador a Cloudinary (firma via
// /api/admin/biblioteca-sign) — nunca pasa por nuestro servidor, porque un
// video facilmente supera el limite de una function de Vercel.
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

const DARK_P  = { bg:'#0F0E0C', surface:'#181714', surface2:'#201F1C', surface3:'#2A2926', border:'rgba(236,235,224,0.11)', border2:'rgba(236,235,224,0.06)', text:'rgba(236,235,224,0.97)', textSub:'rgba(236,235,224,0.58)', textDim:'rgba(236,235,224,0.30)', orange:'#FB670B', okDim:'rgba(251,103,11,0.13)', green:'#22C55E', greenDim:'rgba(34,197,94,0.10)', errDim:'rgba(239,68,68,0.12)', err:'#EF4444' };
const LIGHT_P = { bg:'#F8F9FB', surface:'#FFFFFF', surface2:'#F8F9FB', surface3:'#F3F4F6', border:'#E5E7EB', border2:'#F3F4F6', text:'#111827', textSub:'#6B7280', textDim:'#9CA3AF', orange:'#FB670B', okDim:'rgba(251,103,11,0.08)', green:'#16A34A', greenDim:'rgba(22,163,74,0.08)', errDim:'rgba(220,38,38,0.08)', err:'#DC2626' };

// Para agregar una categoria nueva: agregarla aqui Y en biblioteca.categorias/badges
// de los 5 archivos src/i18n/*.ts Y en CATEGORY_ORDER de biblioteca.astro.
const CATEGORIAS = [
  { id: 'testimonios',           label: 'Testimonios',         color: '#3B82F6' },
  { id: 'pruebas-de-producto',   label: 'Pruebas De Producto', color: '#52525B' },
  { id: 'procesos',              label: 'Procesos',            color: '#22C55E' },
  { id: 'corporativo',           label: 'Corporativo',         color: '#FB670B' },
];

const EMPTY_FORM = { categoria: 'testimonios', cliente: '', empresa: '', titulo: '', ubicacion: '', producto: '', activo: 1, destacado: 0 };

// Tope de peso por video — evita llenar Cloudinary y videos que tarden en
// cargar en la pagina publica. Subir este numero solo si de verdad lo necesitas.
const MAX_VIDEO_MB = 200;

// La descripcion ya NO se muestra en la tarjeta chica (se encimaba con todo) —
// solo aparece al abrir el video en grande, por eso puede ser mas larga.
const MAX_DESC_CHARS = 500;

function formatBytes(bytes) {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

function formatDuration(seconds) {
  if (!seconds) return '';
  const s = Math.round(seconds);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${String(rem).padStart(2, '0')}`;
}

const Ic = {
  plus:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit:  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>,
  trash: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  close: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  film:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M7 3v18M17 3v18M2 8h5M2 16h5M17 8h5M17 16h5"/></svg>,
  warn:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  upload:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  pin:   <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  sparkle: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 3l.75 2.25L22 6l-2.25.75L19 9l-.75-2.25L16 6l2.25-.75z"/></svg>,
};

// Extrae un fotograma del archivo local (aun sin subir) para la IA —
// achicado a maxWidth para no pasar el limite de payload del middleware.
function captureVideoFrame(file, maxWidth = 480) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = url;
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => URL.revokeObjectURL(url);

    video.addEventListener('loadeddata', () => {
      video.currentTime = Math.min(1, (video.duration || 2) / 3);
    }, { once: true });

    video.addEventListener('seeked', () => {
      try {
        const scale = Math.min(1, maxWidth / (video.videoWidth || maxWidth));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round((video.videoWidth || maxWidth) * scale));
        canvas.height = Math.max(1, Math.round((video.videoHeight || maxWidth) * scale));
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        cleanup();
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      } catch (e) {
        cleanup();
        reject(e);
      }
    }, { once: true });

    video.addEventListener('error', () => { cleanup(); reject(new Error('No se pudo leer el video.')); }, { once: true });
    video.load();
  });
}

function Spinner() {
  return <div style={{ width:14, height:14, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.3)', borderTop:'2px solid #fff', animation:'spin 0.7s linear infinite' }}/>;
}

function Modal({ open, onClose, title, children, P }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!open || !mounted) return null;
  return createPortal(
    <div style={{ position:'fixed', inset:0, zIndex:999999999, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:14, width:'100%', maxWidth:480, maxHeight:'94vh', display:'flex', flexDirection:'column', boxShadow:'0 16px 60px rgba(0,0,0,0.25)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', borderBottom:`1px solid ${P.border}`, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ color:P.orange, display:'flex' }}>{Ic.film}</span>
            <span style={{ fontWeight:700, fontSize:14, color:P.text }}>{title}</span>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:P.textDim, padding:4, display:'flex' }}>{Ic.close}</button>
        </div>
        <div style={{ padding:'20px 22px', overflowY:'auto', flex:1 }}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}

function FieldLabel({ children, P }) {
  return <label style={{ display:'block', fontSize:11, fontWeight:600, color:P.textSub, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6 }}>{children}</label>;
}

const inputStyle = (P) => ({
  width:'100%', padding:'10px 12px', borderRadius:8, border:`1px solid ${P.border}`,
  background:P.surface2, color:P.text, fontSize:13, fontFamily:'inherit',
});

export default function BibliotecaTab({ theme = 'dark' }) {
  const P = theme === 'light' ? LIGHT_P : DARK_P;

  const [videos, setVideos]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [file, setFile]         = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);
  const [toggling, setToggling] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [iaLoading, setIaLoading] = useState(false);
  const fileInputRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/biblioteca', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'list' }) });
      const j = await r.json();
      if (j.ok) setVideos(j.videos || []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(EMPTY_FORM); setFile(null); setEditing(null); setErrorMsg(null); setModal(true); };
  const openEdit = (v) => {
    setForm({ categoria: v.categoria, cliente: v.cliente, empresa: v.empresa || '', titulo: v.titulo || '', ubicacion: v.ubicacion || '', producto: v.producto || '', activo: v.activo ? 1 : 0, destacado: v.destacado ? 1 : 0 });
    setFile(null); setEditing(v.id); setErrorMsg(null); setModal(true);
  };

  // Valida el peso ANTES de aceptar el archivo — evita subir un video de 1GB
  // por accidente y llenar el almacenamiento de Cloudinary.
  const pickFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith('video/')) { setErrorMsg('El archivo debe ser un video.'); return; }
    const mb = f.size / (1024 * 1024);
    if (mb > MAX_VIDEO_MB) {
      setErrorMsg(`Ese video pesa ${mb.toFixed(0)}MB. Máximo permitido: ${MAX_VIDEO_MB}MB. Comprímelo (HandBrake, CloudConvert) y vuelve a intentar.`);
      return;
    }
    setErrorMsg(null);
    setFile(f);
  };

  // Genera la descripcion corta con IA a partir de un fotograma del video:
  // si acabas de elegir el archivo, lo saca de ahi (sin subirlo); si estas
  // editando uno ya guardado, usa el poster que ya existe en Cloudinary.
  const handleGenerarDescripcion = async () => {
    setErrorMsg(null);
    let imageUrl = null;
    try {
      if (file) {
        imageUrl = await captureVideoFrame(file);
      } else if (editing) {
        imageUrl = videos.find(v => v.id === editing)?.poster || null;
      }
      if (!imageUrl) { setErrorMsg('Selecciona un video primero.'); return; }

      setIaLoading(true);
      const r = await fetch('/api/admin/biblioteca-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, cliente: form.cliente, categoria: form.categoria, empresa: form.empresa, ubicacion: form.ubicacion, producto: form.producto }),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || 'No se pudo generar la descripción.');
      setForm(f => ({ ...f, titulo: j.texto }));
    } catch (e) {
      setErrorMsg(e.message || 'Error al generar la descripción.');
    }
    setIaLoading(false);
  };

  const handleSave = async () => {
    if (!form.cliente.trim()) { setErrorMsg('El nombre del cliente es obligatorio.'); return; }
    if (!editing && !file) { setErrorMsg('Selecciona un video.'); return; }
    if (file && file.size / (1024 * 1024) > MAX_VIDEO_MB) { setErrorMsg(`Video muy pesado. Máximo permitido: ${MAX_VIDEO_MB}MB.`); return; }

    setSaving(true); setErrorMsg(null);
    try {
      const prev = editing ? videos.find(v => v.id === editing) : null;
      let cloudinaryId = prev?.cloudinaryId || '';
      let poster = prev?.poster || '';
      let duracion = prev?.duracion || 0;

      if (file) {
        setUploading(true);
        const signR = await fetch('/api/admin/biblioteca-sign', { method: 'POST' });
        const sign  = await signR.json();
        if (!sign.ok) throw new Error(sign.error || 'No se pudo firmar la subida.');

        const fd = new FormData();
        fd.append('file', file);
        fd.append('api_key', sign.apiKey);
        fd.append('timestamp', String(sign.timestamp));
        fd.append('public_id', sign.publicId);
        fd.append('folder', sign.folder);
        fd.append('signature', sign.signature);

        const upR = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/video/upload`, { method: 'POST', body: fd });
        const up  = await upR.json();
        if (!upR.ok) throw new Error(up.error?.message || 'Error al subir el video.');

        cloudinaryId = up.public_id;
        // so_N en vez de so_0 — la mayoria de estos videos abren con 3-4s de
        // intro en negro/logo animado; a los 4s ya se ve contenido real. Para
        // videos muy cortos, cae a la mitad de la duracion en vez de pasarse.
        const posterOffset = Math.min(4, Math.max(0, Math.floor((up.duration || 0) / 2)));
        poster = `https://res.cloudinary.com/${sign.cloudName}/video/upload/so_${posterOffset}/${up.public_id}.jpg`;
        duracion = Math.round(up.duration || 0);
        setUploading(false);
      }

      const action = editing ? 'update' : 'create';
      const body = { action, ...form, cloudinaryId, poster, duracion };
      if (editing) body.id = editing;

      const r = await fetch('/api/biblioteca', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || 'Error al guardar.');

      setModal(false);
      await load();
    } catch (e) {
      setErrorMsg(e.message || 'Error inesperado.');
    }
    setSaving(false); setUploading(false);
  };

  const handleDelete = async (id) => {
    await fetch('/api/biblioteca', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'delete', id }) });
    setDelConfirm(null);
    await load();
  };

  const handleToggle = async (v) => {
    setToggling(v.id);
    await fetch('/api/biblioteca', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'toggle', id: v.id, activo: !v.activo }) });
    await load();
    setToggling(null);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:P.text }}>Biblioteca de videos</div>
          <div style={{ fontSize:12, color:P.textSub, marginTop:2 }}>Testimonios, productos, procesos y más — se publican al instante en /biblioteca.</div>
        </div>
        <button onClick={openCreate}
          style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 16px', borderRadius:9, border:'none',
            background:P.orange, color:'#fff', fontSize:12.5, fontWeight:600, cursor:'pointer', boxShadow:`0 4px 14px ${P.orange}35` }}>
          {Ic.plus} Agregar video
        </button>
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:'60px 0' }}>
          <div style={{ width:28, height:28, borderRadius:'50%', border:`2px solid ${P.border}`, borderTop:`2px solid ${P.orange}`, animation:'spin 0.7s linear infinite' }}/>
        </div>
      ) : videos.length === 0 ? (
        <div style={{ padding:'50px 20px', textAlign:'center', border:`1px dashed ${P.border}`, borderRadius:12, color:P.textSub, fontSize:13 }}>
          Aún no hay videos. Agrega el primero.
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:14 }}>
          {videos.map(v => (
            <div key={v.id} style={{ border:`1px solid ${P.border}`, borderRadius:12, overflow:'hidden', background:P.surface2, opacity:v.activo ? 1 : 0.55 }}>
              <div style={{ position:'relative', aspectRatio:'16/9', background:'#000' }}>
                {v.poster && <img src={v.poster} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />}
                <span style={{ position:'absolute', top:8, left:8, background: CATEGORIAS.find(c => c.id === v.categoria)?.color || 'rgba(0,0,0,0.6)', color:'#fff', fontSize:9.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.4px', padding:'4px 10px', borderRadius:20 }}>
                  {CATEGORIAS.find(c => c.id === v.categoria)?.label || v.categoria}
                </span>
                {v.destacado && (
                  <span title="Destacado" style={{ position:'absolute', top:8, right:8, background:'rgba(0,0,0,0.6)', color:P.orange, width:24, height:24, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
                  </span>
                )}
                {v.duracion > 0 && (
                  <span style={{ position:'absolute', bottom:8, right:8, background:'rgba(0,0,0,0.7)', color:'#fff', fontSize:10, fontWeight:600, padding:'2px 7px', borderRadius:5 }}>
                    {formatDuration(v.duracion)}
                  </span>
                )}
              </div>
              <div style={{ padding:'12px 14px' }}>
                <div style={{ fontSize:13, fontWeight:700, color:P.text, textTransform:'uppercase' }}>{v.cliente}</div>
                {v.empresa && <div style={{ fontSize:11, color:P.orange, fontWeight:600, marginTop:2 }}>{v.empresa}</div>}
                {v.ubicacion && <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:10.5, color:P.textSub, marginTop:4 }}>{Ic.pin} {v.ubicacion}</div>}
                {v.titulo && <div style={{ fontSize:11.5, color:P.textSub, marginTop:6, lineHeight:1.4 }}>{v.titulo}</div>}

                <div style={{ display:'flex', gap:6, marginTop:12 }}>
                  <button onClick={() => handleToggle(v)} disabled={toggling === v.id}
                    style={{ flex:1, padding:'7px 0', borderRadius:7, border:`1px solid ${v.activo ? P.green + '55' : P.border}`,
                      background:v.activo ? P.greenDim : P.border2, color:v.activo ? P.green : P.textSub, fontSize:11, fontWeight:600, cursor:'pointer' }}>
                    {toggling === v.id ? '...' : v.activo ? 'Activo' : 'Pausado'}
                  </button>
                  <button onClick={() => openEdit(v)} title="Editar"
                    style={{ padding:'7px 10px', borderRadius:7, border:`1px solid ${P.border}`, background:P.border2, color:P.textSub, cursor:'pointer', display:'flex' }}>
                    {Ic.edit}
                  </button>
                  <button onClick={() => setDelConfirm(v.id)} title="Eliminar"
                    style={{ padding:'7px 10px', borderRadius:7, border:`1px solid ${P.err}40`, background:P.errDim, color:P.err, cursor:'pointer', display:'flex' }}>
                    {Ic.trash}
                  </button>
                </div>

                {delConfirm === v.id && (
                  <div style={{ marginTop:10, padding:'9px 11px', borderRadius:8, background:P.errDim, border:`1px solid ${P.err}35`, fontSize:11, color:P.err }}>
                    <div style={{ marginBottom:8 }}>¿Eliminar este video?</div>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => handleDelete(v.id)} style={{ flex:1, padding:'6px 0', borderRadius:6, border:'none', background:P.err, color:'#fff', fontSize:11, fontWeight:600, cursor:'pointer' }}>Sí, eliminar</button>
                      <button onClick={() => setDelConfirm(null)} style={{ flex:1, padding:'6px 0', borderRadius:6, border:`1px solid ${P.border}`, background:'transparent', color:P.textSub, fontSize:11, cursor:'pointer' }}>Cancelar</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => !saving && setModal(false)} title={editing ? 'Editar video' : 'Agregar video'} P={P}>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <FieldLabel P={P}>Categoría</FieldLabel>
            <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} style={inputStyle(P)}>
              {CATEGORIAS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <FieldLabel P={P}>Título del video</FieldLabel>
            <input type="text" value={form.cliente} onChange={e => setForm({ ...form, cliente: e.target.value })} style={inputStyle(P)} placeholder="Ej. Stretch Film, o el nombre del cliente" />
          </div>

          <div>
            <FieldLabel P={P}>Producto (opcional) — para que la IA no adivine</FieldLabel>
            <input type="text" value={form.producto} onChange={e => setForm({ ...form, producto: e.target.value })} style={inputStyle(P)} placeholder="Ej. Rafia, Esquinero, Stretch Film" />
          </div>

          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
              <FieldLabel P={P}>Descripción (opcional) — solo se ve al abrir el video en grande</FieldLabel>
              <button type="button" onClick={handleGenerarDescripcion} disabled={iaLoading}
                style={{ display:'flex', alignItems:'center', gap:5, flexShrink:0, background:'none', border:'none', padding:0,
                  color: iaLoading ? P.textDim : P.orange, fontSize:11, fontWeight:600, cursor: iaLoading ? 'not-allowed' : 'pointer' }}>
                {Ic.sparkle} {iaLoading ? 'Generando...' : 'Generar con IA'}
              </button>
            </div>
            <textarea
              value={form.titulo}
              onChange={e => setForm({ ...form, titulo: e.target.value.slice(0, MAX_DESC_CHARS) })}
              maxLength={MAX_DESC_CHARS}
              rows={4}
              style={{ ...inputStyle(P), resize: 'vertical', lineHeight: 1.5 }}
              placeholder="Ej. Desde Colima, así protege nuestro stretch film cada tarima en el proceso de empaque..."
            />
            <div style={{ textAlign:'right', fontSize:10.5, color: form.titulo.length >= MAX_DESC_CHARS ? P.orange : P.textDim, marginTop:4 }}>
              {form.titulo.length}/{MAX_DESC_CHARS}
            </div>
          </div>

          <div>
            <FieldLabel P={P}>Empresa / Distribuidor (opcional)</FieldLabel>
            <input type="text" value={form.empresa} onChange={e => setForm({ ...form, empresa: e.target.value })} style={inputStyle(P)} placeholder="Empresa" />
          </div>

          <div>
            <FieldLabel P={P}>Ubicación (opcional)</FieldLabel>
            <input type="text" value={form.ubicacion} onChange={e => setForm({ ...form, ubicacion: e.target.value })} style={inputStyle(P)} placeholder="Ej. Morelia, Mich." />
          </div>

          <div>
            <FieldLabel P={P}>Video {editing && '(déjalo vacío para conservar el actual)'}</FieldLabel>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={e => pickFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
            />
            {!file ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => {
                  e.preventDefault(); setDragOver(false);
                  pickFile(e.dataTransfer.files?.[0] || null);
                }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 8, padding: '28px 16px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                  border: `1.5px dashed ${dragOver ? P.orange : P.border}`,
                  background: dragOver ? P.okDim : P.surface2,
                  transition: 'all 0.15s ease',
                }}>
                <span style={{ color: P.orange, display: 'flex' }}>{Ic.upload}</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: P.text }}>
                  {dragOver ? 'Suelta el video aquí' : 'Selecciona o arrastra un video'}
                </span>
                <span style={{ fontSize: 10.5, color: P.textDim }}>MP4, MOV — máx {MAX_VIDEO_MB}MB, se sube directo a Cloudinary</span>
              </div>
            ) : (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 10,
                border: `1px solid ${P.border}`, background: P.surface2,
              }}>
                <span style={{ width: 36, height: 36, borderRadius: 8, background: P.okDim, color: P.orange,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{Ic.film}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: P.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                  <div style={{ fontSize: 10.5, color: P.textDim, marginTop: 2 }}>{formatBytes(file.size)}</div>
                </div>
                <button type="button" onClick={() => setFile(null)} title="Quitar"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: P.textDim, padding: 4, display: 'flex', flexShrink: 0 }}>
                  {Ic.close}
                </button>
              </div>
            )}
            {uploading && (
              <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:8, fontSize:11.5, color:P.orange }}>
                <Spinner /> Subiendo video a Cloudinary...
              </div>
            )}
          </div>

          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            <label style={{ display:'flex', alignItems:'center', gap:9, cursor:'pointer' }}>
              <input type="checkbox" checked={!!form.activo} onChange={e => setForm({ ...form, activo: e.target.checked ? 1 : 0 })} style={{ width:14, height:14, cursor:'pointer', accentColor:P.orange }} />
              <span style={{ fontSize:12, color:P.text }}>Visible en la página pública</span>
            </label>
            <label style={{ display:'flex', alignItems:'center', gap:9, cursor:'pointer' }}>
              <input type="checkbox" checked={!!form.destacado} onChange={e => setForm({ ...form, destacado: e.target.checked ? 1 : 0 })} style={{ width:14, height:14, cursor:'pointer', accentColor:P.orange }} />
              <span style={{ fontSize:12, color:P.text }}>Destacado (sección "Destacados")</span>
            </label>
          </div>

          {errorMsg && (
            <div style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'9px 12px', borderRadius:8, background:P.errDim, border:`1px solid ${P.err}35`, fontSize:11.5, color:P.err }}>
              <span style={{ flexShrink:0, marginTop:1 }}>{Ic.warn}</span> {errorMsg}
            </div>
          )}

          <div style={{ display:'flex', gap:8 }}>
            <button onClick={handleSave} disabled={saving}
              style={{ flex:1, padding:'11px 0', borderRadius:9, border:'none', cursor:saving ? 'not-allowed' : 'pointer',
                background:saving ? P.surface3 : P.orange, color:saving ? P.textDim : '#fff', fontSize:12.5, fontWeight:600,
                display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              {saving ? <><Spinner /> Guardando...</> : <>{Ic.upload} Guardar</>}
            </button>
            <button onClick={() => setModal(false)} disabled={saving}
              style={{ padding:'11px 16px', borderRadius:9, border:`1px solid ${P.border}`, background:'transparent', color:P.textSub, fontSize:12.5, fontWeight:500, cursor:'pointer' }}>
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
