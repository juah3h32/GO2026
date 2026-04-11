// src/components/VacantesTab.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

const DARK_P  = { bg:'#0F0E0C', surface:'#181714', surface2:'#201F1C', surface3:'#2A2926', border:'rgba(236,235,224,0.11)', border2:'rgba(236,235,224,0.06)', text:'rgba(236,235,224,0.97)', textSub:'rgba(236,235,224,0.58)', textDim:'rgba(236,235,224,0.30)', orange:'#FB670B', orangeDark:'#D4530A', orangeWarm:'#FD8A40', okDim:'rgba(251,103,11,0.13)', green:'#22C55E', greenDim:'rgba(34,197,94,0.10)', grayMid:'#8A8A7A', grayLight:'#C4C3B5', errDim:'rgba(239,68,68,0.12)', err:'#EF4444' };
const LIGHT_P = { bg:'#F8F9FB', surface:'#FFFFFF', surface2:'#F8F9FB', surface3:'#F3F4F6', border:'#E5E7EB', border2:'#F3F4F6', text:'#111827', textSub:'#6B7280', textDim:'#9CA3AF', orange:'#FB670B', orangeDark:'#D4530A', orangeWarm:'#FD8A40', okDim:'rgba(251,103,11,0.08)', green:'#16A34A', greenDim:'rgba(22,163,74,0.08)', grayMid:'#9CA3AF', grayLight:'#D1D5DB', errDim:'rgba(220,38,38,0.08)', err:'#DC2626' };

const AREAS   = ['Planta / Manufactura','Logística / Almacén','Distribución','Administración','Mantenimiento','Comercial','Recursos Humanos','Otro'];
const TIPOS   = ['Tiempo completo','Medio tiempo','Por proyecto'];
const HORARIOS = [
  'Lunes a Viernes',
  'Lunes a Sábado',
  'Lunes a Domingo',
  'Turno Matutino (Lun-Vie)',
  'Turno Matutino (Lun-Sáb)',
  'Turno Vespertino (Lun-Vie)',
  'Turno Vespertino (Lun-Sáb)',
  'Turno Nocturno',
  'Turno Rotativo',
  'Fines de semana',
];

// Formatea salario: agrega comas de miles y símbolo $ si aplica
function fmtSalario(raw) {
  if (!raw) return null;
  let str = raw.trim().replace(/\b(\d{4,})\b/g, n => Number(n).toLocaleString('es-MX'));
  if (!str.includes('$') && /^\d/.test(str)) str = `$${str}`;
  return str;
}

// Convierte a Title Case respetando preposiciones en español
function toTitleCase(str) {
  const lower = new Set(['de','del','la','el','los','las','un','una','a','en','y','o','con','por','para','al']);
  return str.toLowerCase().split(' ').map((word, i) => {
    if (!word) return word;
    return (i === 0 || !lower.has(word))
      ? word.charAt(0).toUpperCase() + word.slice(1)
      : word;
  }).join(' ');
}

// Detecta si el texto está completamente en mayúsculas
function isAllCaps(str) {
  const letters = str.replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ]/g, '');
  return letters.length > 2 && letters === letters.toUpperCase();
}

// A partir de LIMIT_WARN se muestra botón "Ver más" en la página pública
const LIMIT_WARN = 8;

const BENEFICIOS_FIJOS = [
  'Prestaciones de ley',
  'Transporte de personal',
  'Tarjeta de vales de despensa',
  'Despensa física',
  'Bono de producción',
  'Uniformes',
  'Apoyo escolar',
  'Oportunidades de crecimiento',
];

const EMPTY_FORM = {
  titulo: '', area: 'Planta / Manufactura', tipo: 'Tiempo completo',
  ubicacion: 'Morelia, Mich.', horario: 'Lunes a Viernes', salario: '',
  descripcion: '', requisitos: '', activa: 1, multiples: 0, empresa: '',
};

// ── LÍMITES DE CAMPO ───────────────────────────────────────────────────────────
const LIMITS = {
  titulo:      50,
  empresa:     50,
  ubicacion:   40,
  horario:     40,
  salario:     40,
  descripcion: 250,
  requisitos:  800,
};

// ── ICONOS SVG ─────────────────────────────────────────────────────────────────
const Ic = {
  plus:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>,
  trash:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  close:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  refresh: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  pause:   <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  play:    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  briefcase:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  text:    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>,
  info:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  warn:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  eye:     <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
};

function Spinner({ P }) {
  return (
    <div style={{ display:'flex', justifyContent:'center', padding:'60px 0' }}>
      <div style={{ width:28, height:28, borderRadius:'50%', border:`2px solid ${P.border}`, borderTop:`2px solid ${P.orange}`, animation:'spin 0.7s linear infinite' }}/>
    </div>
  );
}

function Tag({ children, color, bg }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:500, background: bg || 'transparent', color, border:`1px solid ${color}35` }}>
      {children}
    </span>
  );
}

function CharCount({ current, max, P }) {
  const pct = current / max;
  const color = pct >= 0.9 ? P.err : pct >= 0.7 ? P.orange : P.textDim;
  return (
    <span style={{ fontSize:10, color, fontFamily:"'DM Mono',monospace", tabularNums:true }}>
      {current}/{max}
    </span>
  );
}

function FieldLabel({ children, P, hint, current, max, rightAction }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
      <label style={{ fontSize:11, fontWeight:600, color:P.textSub, textTransform:'uppercase', letterSpacing:'0.07em' }}>{children}</label>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {hint && <span style={{ fontSize:10, color:P.textDim, fontStyle:'italic' }}>{hint}</span>}
        {max !== undefined && <CharCount current={current || 0} max={max} P={P} />}
        {rightAction}
      </div>
    </div>
  );
}

// Sparkle icon for AI button
const IcSparkle = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
    <path d="M19 3l.75 2.25L22 6l-2.25.75L19 9l-.75-2.25L16 6l2.25-.75z"/>
  </svg>
);

function IaBtn({ campo, loading, onClick, P }) {
  const isLoading = loading === campo;
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      title="Mejorar con IA"
      style={{
        display:'inline-flex', alignItems:'center', gap:5,
        padding:'4px 10px', borderRadius:6, border:`1px solid ${P.orange}40`,
        background: isLoading ? P.okDim : `${P.orange}10`,
        color: isLoading ? P.textDim : P.orange,
        fontSize:10, fontWeight:700, cursor: isLoading ? 'default' : 'pointer',
        transition:'all 0.15s ease', flexShrink:0,
        letterSpacing:'0.03em',
      }}>
      {isLoading
        ? <div style={{ width:10, height:10, borderRadius:'50%', border:`1.5px solid ${P.orange}40`, borderTop:`1.5px solid ${P.orange}`, animation:'spin 0.7s linear infinite' }}/>
        : <IcSparkle />
      }
      {isLoading ? 'Mejorando…' : 'Mejorar con IA'}
    </button>
  );
}

function Modal({ open, onClose, title, children, P }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!open || !mounted) return null;
  return createPortal(
    <div style={{ position:'fixed', inset:0, zIndex:999999999, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:14, width:'100%', maxWidth:560, maxHeight:'88vh', display:'flex', flexDirection:'column', boxShadow:'0 16px 60px rgba(0,0,0,0.25)', animation:'fadeUp 0.22s ease both' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', borderBottom:`1px solid ${P.border}`, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ color:P.orange, display:'flex' }}>{Ic.briefcase}</span>
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

// ── INDICADOR DE LÍMITE ────────────────────────────────────────────────────────
function LimitBanner({ count, P }) {
  if (count < LIMIT_WARN) return null;
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:9, padding:'11px 14px', borderRadius:9, background:P.okDim, border:`1px solid ${P.orange}30`, marginBottom:14 }}>
      <span style={{ color:P.orange, display:'flex', flexShrink:0, marginTop:1 }}>{Ic.info}</span>
      <div style={{ fontSize:12, color:P.orange, lineHeight:1.5 }}>
        <strong>{count} vacantes activas.</strong> En la página pública las primeras {LIMIT_WARN} se muestran directamente; el resto aparece al darle clic en "Ver más".
      </div>
    </div>
  );
}

export default function VacantesTab({ theme = 'dark' }) {
  const P = theme === 'dark' ? DARK_P : LIGHT_P;
  const [vacantes,    setVacantes]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [modal,       setModal]       = useState(false);
  const [editing,     setEditing]     = useState(null);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [saving,      setSaving]      = useState(false);
  const [status,      setStatus]      = useState(null); // 'ok' | 'error' | null
  const [delConfirm,  setDelConfirm]  = useState(null);
  const [toggling,    setToggling]    = useState(null);
  const [iaLoading,   setIaLoading]   = useState(null); // 'descripcion' | 'requisitos' | null
  const [iaError,     setIaError]     = useState(null);
  const [beneficios,  setBeneficios]  = useState(BENEFICIOS_FIJOS);
  const [benModal,    setBenModal]    = useState(false);
  const [benEdit,     setBenEdit]     = useState(null); // índice editando
  const [benDraft,    setBenDraft]    = useState('');   // texto del input inline
  const [benNew,      setBenNew]      = useState('');   // texto nuevo ítem
  const [benSaving,   setBenSaving]   = useState(false);
  const [listaEspera, setListaEspera] = useState([]);
  const [notifModal,  setNotifModal]  = useState(null);   // vacante seleccionada para notificar
  const [notifSending,setNotifSending]= useState(false);
  const [notifResult, setNotifResult] = useState(null);   // { enviados, fallidos }

  const inp = {
    width:'100%', background:P.surface, border:`1px solid ${P.border}`, borderRadius:8,
    padding:'9px 12px', color:P.text, fontSize:12, outline:'none', boxSizing:'border-box',
    transition:'border-color 0.15s ease, box-shadow 0.15s ease', fontFamily:'inherit',
  };
  const focusIn  = e => { e.target.style.borderColor = P.orange+'55'; e.target.style.boxShadow = `0 0 0 3px ${P.orange}10`; };
  const focusOut = e => { e.target.style.borderColor = P.border; e.target.style.boxShadow = 'none'; };
  const setField = key => e => {
    if (key === 'titulo' && status === 'duplicate') setStatus(null);
    setForm(f => ({ ...f, [key]: e.target.value.slice(0, LIMITS[key] || 999) }));
  };

  // Título: convierte a Title Case al salir del campo
  const onTituloBlur = e => {
    focusOut(e);
    if (form.titulo.trim()) setForm(f => ({ ...f, titulo: toTitleCase(f.titulo.trim()) }));
  };

  // IA: restructura descripción o requisitos
  const mejorarConIA = async (campo) => {
    const texto = form[campo]?.trim();
    if (!texto) return;
    setIaLoading(campo);
    setIaError(null);
    try {
      const r = await fetch('/api/vacantes-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campo, texto, titulo: form.titulo, area: form.area }),
      });
      const j = await r.json();
      if (j.ok) {
        setForm(f => ({ ...f, [campo]: j.texto }));
      } else {
        setIaError(j.error || 'Error al conectar con la IA');
      }
    } catch {
      setIaError('No se pudo conectar con la IA. Intenta de nuevo.');
    } finally {
      setIaLoading(null);
    }
  };

  // Lista de espera: coincidencia flexible entre puesto del candidato y título de vacante
  const matchPuesto = (puestoC, tituloV) => {
    const a = (puestoC  || '').toLowerCase().trim();
    const b = (tituloV  || '').toLowerCase().trim();
    if (!a || !b) return false;
    return a.includes(b) || b.includes(a);
  };

  const handleNotificar = async () => {
    if (!notifModal) return;
    setNotifSending(true);
    setNotifResult(null);
    const matching = listaEspera.filter(c => matchPuesto(c.puesto, notifModal.titulo));
    const ids = matching.map(c => c.id);
    try {
      const r = await fetch('/api/vacantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action:'notificar-espera', vacanteId: notifModal.id, ids }),
      });
      const j = await r.json();
      setNotifResult(j.ok
        ? { enviados: j.enviados, fallidos: j.fallidos }
        : { error: j.error || 'Error al enviar' });
      if (j.ok) {
        // Marcar localmente como notificados
        setListaEspera(prev => prev.map(c => ids.includes(c.id) ? { ...c, notificado_vacante: 1 } : c));
      }
    } catch (e) {
      setNotifResult({ error: e.message });
    }
    setNotifSending(false);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rList, rBen, rLE] = await Promise.all([
        fetch('/api/vacantes', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'list' }) }),
        fetch('/api/vacantes'),
        fetch('/api/vacantes', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'lista-espera' }) }),
      ]);
      const jList = await rList.json();
      const jBen  = await rBen.json();
      const jLE   = await rLE.json();
      if (jList.ok) setVacantes(jList.vacantes || []);
      if (jBen.beneficios?.length) setBeneficios(jBen.beneficios);
      if (jLE.ok) setListaEspera(jLE.candidatos || []);
    } catch {}
    setLoading(false);
  }, []);

  const saveBeneficios = async (lista) => {
    setBenSaving(true);
    try {
      await fetch('/api/vacantes', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'update-beneficios', beneficios: lista }) });
      setBeneficios(lista);
    } catch {}
    setBenSaving(false);
  };

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm(EMPTY_FORM); setEditing(null); setStatus(null); setModal(true);
  };

  const openEdit = v => {
    setForm({
      titulo:      v.titulo,
      area:        v.area,
      tipo:        v.tipo || 'Tiempo completo',
      ubicacion:   v.ubicacion || 'Morelia, Mich.',
      horario:     v.horario || 'Lunes a Viernes',
      multiples:   v.multiples ? 1 : 0,
      salario:     v.salario || '',
      descripcion: v.descripcion || '',
      requisitos:  v.requisitos || '',
      activa:      v.activa ? 1 : 0,
      empresa:     v.empresa || '',
    });
    setEditing(v.id); setStatus(null); setModal(true);
  };

  const handleSave = async () => {
    if (!form.titulo.trim()) return;
    if (isAllCaps(form.titulo)) return;
    // Bloquear duplicados (ignorar mayúsculas/minúsculas, ignorar la vacante que se está editando)
    const tituloNorm = form.titulo.trim().toLowerCase();
    const duplicado = vacantes.some(v =>
      v.titulo.trim().toLowerCase() === tituloNorm && v.id !== editing
    );
    if (duplicado) {
      setStatus('duplicate');
      return;
    }
    setSaving(true); setStatus(null);
    try {
      const action = editing ? 'update' : 'create';
      const body   = editing ? { action, id:editing, ...form } : { action, ...form };
      const r = await fetch('/api/vacantes', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
      const j = await r.json();
      if (j.ok) { setStatus('ok'); await load(); setTimeout(() => setModal(false), 700); }
      else { setStatus('error'); }
    } catch { setStatus('error'); }
    setSaving(false);
  };

  const handleToggle = async (id, activa) => {
    setToggling(id);
    try {
      const newActiva = activa ? 0 : 1;
      await fetch('/api/vacantes', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'toggle', id, activa: newActiva }) });
      // Si se activa la vacante, notificar candidatos en lista de espera
      if (newActiva === 1) {
        try {
          const v = vacantes.find(x => x.id === id);
          if (v) {
            // Pedir lista fresca del servidor (no usar estado local que puede estar desactualizado)
            const espR = await fetch('/api/vacantes', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action:'lista-espera' }),
            });
            const espJ = await espR.json();
            const todos = espJ.candidatos || [];
            // Incluir: misma área/puesto O sin puesto especificado, que no hayan sido notificados
            const pendientes = todos.filter(c =>
              !c.notificado_vacante &&
              (!c.puesto || c.puesto.trim() === '' || matchPuesto(c.puesto, v.titulo))
            );
            if (pendientes.length > 0) {
              await fetch('/api/vacantes', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action:'notificar-espera', vacanteId: id, ids: pendientes.map(c => c.id) }),
              });
            }
          }
        } catch (e) { console.warn('notify espera error:', e); }
      }
      await load();
    } catch {}
    setToggling(null);
  };

  const handleDelete = async id => {
    try {
      await fetch('/api/vacantes', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'delete', id }) });
      setDelConfirm(null); await load();
    } catch {}
  };

  const CARD = { background:P.surface, border:`1px solid ${P.border}`, borderRadius:12, padding:'20px 22px', position:'relative', overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' };
  const activas   = vacantes.filter(v => v.activa);
  const inactivas = vacantes.filter(v => !v.activa);

  return (
    <div style={{ animation:'fadeUp 0.22s ease both' }}>
      <style>{`
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:8 }}>
        <div>
          <div style={{ fontWeight:600, fontSize:15, color:P.text, letterSpacing:'-0.02em', marginBottom:2 }}>Vacantes</div>
          <div style={{ fontSize:11, color:P.textDim }}>Publicadas en la página pública de empleo</div>
        </div>
        <div style={{ display:'flex', gap:6 }}>
          <button onClick={load} title="Actualizar" style={{ padding:'7px 10px', borderRadius:8, border:`1px solid ${P.border}`, background:'transparent', color:P.textSub, cursor:'pointer', display:'flex', alignItems:'center', transition:'all 0.12s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background=P.surface2; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}>
            {Ic.refresh}
          </button>
          <button onClick={openCreate}
            style={{ padding:'8px 16px', borderRadius:8, border:'none', background:P.orange, color:'#fff', cursor:'pointer', fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
            {Ic.plus} Nueva vacante
          </button>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:8, marginBottom:14 }}>
        {[
          { label:'Total',    value:vacantes.length,   color:P.textSub,  accent:P.textDim },
          { label:'Activas',  value:activas.length,    color:P.green,    accent:P.green   },
          { label:'Pausadas', value:inactivas.length,  color:P.grayMid,  accent:P.grayMid },
          { label:'Ver más activo', value: activas.length > LIMIT_WARN ? 'Sí' : 'No', color: activas.length > LIMIT_WARN ? P.orange : P.textSub, accent: activas.length > LIMIT_WARN ? P.orange : P.textDim },
        ].map(s => (
          <div key={s.label} style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:12, padding:'18px 20px', position:'relative', overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2.5, background:s.accent, opacity:0.5 }}/>
            <div style={{ color:P.textDim, fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>{s.label}</div>
            <div style={{ fontSize:34, fontFamily:"'DM Mono',monospace", fontWeight:500, color:s.color, letterSpacing:'-0.04em' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── BANNER DE LÍMITE ── */}
      <LimitBanner count={activas.length} P={P} />

      {/* ── LISTA ── */}
      <div style={CARD}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14, paddingBottom:12, borderBottom:`1px solid ${P.border}` }}>
          <span style={{ fontWeight:600, fontSize:13, color:P.text, letterSpacing:'-0.02em' }}>Todas las vacantes</span>
          {!loading && vacantes.length > 0 && (
            <span style={{ background:P.surface2, border:`1px solid ${P.border}`, borderRadius:10, padding:'1px 8px', fontSize:10, fontWeight:600, color:P.textDim, fontFamily:"'DM Mono',monospace" }}>{vacantes.length}</span>
          )}
        </div>

        {loading && <Spinner P={P} />}

        {!loading && !vacantes.length && (
          <div style={{ textAlign:'center', padding:'60px 0', color:P.textDim }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:12, opacity:0.3 }}>{Ic.briefcase}</div>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:6, color:P.textSub }}>Sin vacantes todavía</div>
            <div style={{ fontSize:11, color:P.textDim }}>Crea la primera vacante para que aparezca en la página pública.</div>
          </div>
        )}

        {!loading && !!vacantes.length && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12 }}>
            {vacantes.map(v => {
              const enEspera = listaEspera.filter(c => matchPuesto(c.puesto, v.titulo) && !c.notificado_vacante);
              return (
                <div key={v.id} style={{
                  background: P.surface2, border:`1px solid ${P.border}`, borderRadius:14,
                  overflow:'hidden', opacity: v.activa ? 1 : 0.65,
                  transition:'box-shadow 0.15s ease, transform 0.15s ease',
                  boxShadow:'0 1px 3px rgba(0,0,0,0.06)',
                  display:'flex', flexDirection:'column',
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.10)'; e.currentTarget.style.transform='translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.06)'; e.currentTarget.style.transform='none'; }}>

                  {/* Barra superior de color */}
                  <div style={{ height:3, background: v.activa ? P.green : P.grayMid, transition:'background 0.2s' }}/>

                  {/* Cuerpo */}
                  <div style={{ padding:'14px 16px 10px', flex:1, display:'flex', flexDirection:'column', gap:8 }}>

                    {/* Cabecera: título + badges */}
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
                      <span style={{ fontWeight:700, fontSize:14, color:P.text, lineHeight:1.3, letterSpacing:'-0.02em', flex:1 }}>{v.titulo}</span>
                      <div style={{ display:'flex', gap:4, flexShrink:0, flexWrap:'wrap', justifyContent:'flex-end' }}>
                        <Tag color={v.activa ? P.green : P.grayMid}>{v.activa ? 'Activa' : 'Pausada'}</Tag>
                        {v.empresa && <Tag color={P.orange}>{v.empresa}</Tag>}
                      </div>
                    </div>

                    {/* Chips de info */}
                    <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                      {[v.area, v.tipo, v.horario, fmtSalario(v.salario), v.ubicacion].filter(Boolean).map((t, i) => (
                        <span key={i} style={{ fontSize:10, color:P.textSub, background:P.surface, border:`1px solid ${P.border}`, borderRadius:5, padding:'2px 8px', fontWeight:500 }}>{t}</span>
                      ))}
                    </div>

                    {/* Descripción */}
                    {v.descripcion && (
                      <p style={{ fontSize:11, color:P.textDim, margin:0, lineHeight:1.5,
                        overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                        {v.descripcion}
                      </p>
                    )}

                    {/* Lista espera badge */}
                    {enEspera.length > 0 && (
                      <div style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:10, fontWeight:700,
                        color:P.orange, background:`${P.orange}10`, border:`1px solid ${P.orange}30`,
                        borderRadius:6, padding:'3px 8px', alignSelf:'flex-start' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                        {enEspera.length} en lista de espera
                      </div>
                    )}
                  </div>

                  {/* Pie: acciones */}
                  <div style={{ padding:'8px 12px', borderTop:`1px solid ${P.border}`, display:'flex', gap:6, alignItems:'center', background:P.surface }}>
                    {enEspera.length > 0 && (
                      <button onClick={() => { setNotifModal(v); setNotifResult(null); }} title="Notificar candidatos en espera"
                        style={{ flex:1, padding:'6px 10px', borderRadius:7, border:`1px solid ${P.orange}40`, background:`${P.orange}10`, color:P.orange, cursor:'pointer', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                        Notificar ({enEspera.length})
                      </button>
                    )}
                    <button onClick={() => handleToggle(v.id, v.activa)} disabled={toggling === v.id} title={v.activa ? 'Pausar' : 'Activar'}
                      style={{ flex:1, padding:'6px 10px', borderRadius:7, border:`1px solid ${P.border}`, background:'transparent', color:P.textSub, cursor:'pointer', fontSize:11, fontWeight:500, display:'flex', alignItems:'center', justifyContent:'center', gap:5, opacity: toggling === v.id ? 0.5 : 1, transition:'all 0.12s ease' }}
                      onMouseEnter={e => e.currentTarget.style.background=P.surface2}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <span style={{ display:'flex' }}>{v.activa ? Ic.pause : Ic.play}</span>
                      {v.activa ? 'Pausar' : 'Activar'}
                    </button>
                    <button onClick={() => openEdit(v)} title="Editar"
                      style={{ padding:'6px 9px', borderRadius:7, border:`1px solid ${P.border}`, background:'transparent', color:P.textSub, cursor:'pointer', display:'flex', alignItems:'center', transition:'all 0.12s ease' }}
                      onMouseEnter={e => e.currentTarget.style.background=P.surface2}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      {Ic.edit}
                    </button>
                    <button onClick={() => setDelConfirm(v.id)} title="Eliminar"
                      style={{ padding:'6px 9px', borderRadius:7, border:`1px solid ${P.err}30`, background:'transparent', color:P.err, cursor:'pointer', display:'flex', alignItems:'center', transition:'all 0.12s ease' }}
                      onMouseEnter={e => e.currentTarget.style.background=P.errDim}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      {Ic.trash}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── MODAL: CREAR / EDITAR ── */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar vacante' : 'Nueva vacante'} P={P}>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

          {/* Título */}
          <div>
            <FieldLabel P={P} current={form.titulo.length} max={LIMITS.titulo}>Título del puesto *</FieldLabel>
            <input value={form.titulo} onChange={setField('titulo')} placeholder="Ej: Operador de Producción"
              style={{ ...inp, borderColor: isAllCaps(form.titulo) ? P.err : undefined }}
              onFocus={focusIn} onBlur={onTituloBlur} />
            {isAllCaps(form.titulo) && (
              <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:5, fontSize:11, color:P.err }}>
                <span style={{ display:'flex' }}>{Ic.warn}</span>
                No uses todo en mayúsculas. Al salir del campo se corregirá automáticamente.
              </div>
            )}
            {!isAllCaps(form.titulo) && form.titulo.length > 0 && (
              <div style={{ fontSize:10, color:P.textDim, marginTop:4 }}>
                Primera letra de cada palabra en mayúscula · Ej: "Supervisor de Producción"
              </div>
            )}
          </div>

          {/* Empresa / Negocio (opcional) */}
          <div>
            <FieldLabel P={P} current={form.empresa.length} max={LIMITS.empresa} hint="Opcional — si se omite se muestra 'Grupo Ortiz'">Empresa / Negocio</FieldLabel>
            <input value={form.empresa} onChange={setField('empresa')} placeholder="Ej: Distribuidora del Centro"
              style={inp} onFocus={focusIn} onBlur={focusOut} />
            {form.empresa.trim() && (
              <div style={{ fontSize:10, color:P.textDim, marginTop:4 }}>
                La vacante mostrará <strong style={{ color:P.textSub }}>{form.empresa.trim()}</strong> como empresa contratante
              </div>
            )}
          </div>

          {/* Área + Tipo */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div>
              <FieldLabel P={P}>Área</FieldLabel>
              <select value={form.area} onChange={setField('area')} style={{ ...inp, cursor:'pointer' }}>
                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel P={P}>Tipo de contrato</FieldLabel>
              <select value={form.tipo} onChange={setField('tipo')} style={{ ...inp, cursor:'pointer' }}>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <FieldLabel P={P} current={form.ubicacion.length} max={LIMITS.ubicacion}>Ubicación</FieldLabel>
            <input value={form.ubicacion} onChange={setField('ubicacion')} placeholder="Ej: Morelia, Mich."
              style={inp} onFocus={focusIn} onBlur={focusOut} />
          </div>

          {/* Horario + Salario */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div>
              <FieldLabel P={P}>Horario</FieldLabel>
              <select value={form.horario} onChange={setField('horario')} style={{ ...inp, cursor:'pointer' }}
                onFocus={focusIn} onBlur={focusOut}>
                {HORARIOS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel P={P} current={form.salario.length} max={LIMITS.salario}>Salario (opcional)</FieldLabel>
              <input value={form.salario} onChange={setField('salario')} placeholder="Ej: $10,000 mensual"
                style={inp} onFocus={focusIn} onBlur={focusOut} />
            </div>
          </div>

          {/* Descripción breve */}
          <div>
            <FieldLabel P={P} hint="Visible en la tarjeta" current={form.descripcion.length} max={LIMITS.descripcion}
              rightAction={form.descripcion.length >= Math.floor(LIMITS.descripcion * 0.6)
                ? <IaBtn campo="descripcion" loading={iaLoading} onClick={() => mejorarConIA('descripcion')} P={P} />
                : null}>
              Descripción breve
            </FieldLabel>
            <textarea value={form.descripcion} onChange={setField('descripcion')}
              placeholder="Resumen corto del puesto que verá el candidato en la tarjeta..."
              rows={3} style={{ ...inp, resize:'vertical', lineHeight:1.6, borderColor: form.descripcion.length >= LIMITS.descripcion * 0.9 ? P.err : undefined }}
              onFocus={focusIn} onBlur={focusOut} />
            {iaError && iaLoading === null && <div style={{ fontSize:10, color:P.err, marginTop:4 }}>{iaError}</div>}
          </div>

          {/* Requisitos */}
          <div>
            <FieldLabel P={P} hint="Un requisito por línea" current={form.requisitos.length} max={LIMITS.requisitos}
              rightAction={form.requisitos.length >= Math.floor(LIMITS.requisitos * 0.6)
                ? <IaBtn campo="requisitos" loading={iaLoading} onClick={() => mejorarConIA('requisitos')} P={P} />
                : null}>
              Requisitos / Detalles
            </FieldLabel>
            <textarea value={form.requisitos} onChange={setField('requisitos')}
              placeholder={'Ej:\nExperiencia mínima 1 año\nSaber usar Excel\nDisponibilidad de horario'}
              rows={4} style={{ ...inp, resize:'vertical', lineHeight:1.6, borderColor: form.requisitos.length >= LIMITS.requisitos * 0.9 ? P.err : undefined }}
              onFocus={focusIn} onBlur={focusOut} />
          </div>

          {/* Toggle publicar */}
          <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', padding:'10px 12px', background:P.surface3, borderRadius:8, border:`1px solid ${P.border}` }}>
            <div onClick={() => setForm(f => ({ ...f, activa: f.activa ? 0 : 1 }))}
              style={{ width:38, height:21, borderRadius:11, position:'relative', flexShrink:0, cursor:'pointer', background: form.activa ? P.green : P.border, transition:'background 0.18s ease' }}>
              <div style={{ position:'absolute', top:3, left: form.activa ? 20 : 3, width:15, height:15, borderRadius:'50%', background:'#fff', transition:'left 0.18s ease', boxShadow:'0 1px 4px rgba(0,0,0,0.25)' }}/>
            </div>
            <div>
              <div style={{ fontSize:12, color:P.text, fontWeight:600 }}>{form.activa ? 'Publicar inmediatamente' : 'Guardar como pausada'}</div>
              <div style={{ fontSize:10, color:P.textDim }}>
                {form.activa
                  ? 'La vacante aparecerá en la página pública al guardar'
                  : 'Puedes activarla después desde la lista'}
              </div>
            </div>
          </label>

          {/* Toggle múltiples posiciones */}
          <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', padding:'10px 12px', background: form.multiples ? `${P.orange}0D` : P.surface3, borderRadius:8, border:`1px solid ${form.multiples ? P.orange+'35' : P.border}`, transition:'all 0.15s ease' }}>
            <div onClick={() => setForm(f => ({ ...f, multiples: f.multiples ? 0 : 1 }))}
              style={{ width:38, height:21, borderRadius:11, position:'relative', flexShrink:0, cursor:'pointer', background: form.multiples ? P.orange : P.border, transition:'background 0.18s ease' }}>
              <div style={{ position:'absolute', top:3, left: form.multiples ? 20 : 3, width:15, height:15, borderRadius:'50%', background:'#fff', transition:'left 0.18s ease', boxShadow:'0 1px 4px rgba(0,0,0,0.25)' }}/>
            </div>
            <div>
              <div style={{ fontSize:12, color: form.multiples ? P.orange : P.text, fontWeight:600 }}>
                {form.multiples ? '🔥 Contratando a varios candidatos' : 'Contratando a varios candidatos'}
              </div>
              <div style={{ fontSize:10, color:P.textDim }}>Muestra un badge en la tarjeta pública indicando alta demanda</div>
            </div>
          </label>

          {/* Beneficios — aplican a todas las vacantes */}
          <div style={{ borderRadius:9, border:`1px solid ${P.green}28`, background:P.greenDim, overflow:'hidden' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 13px', borderBottom:`1px solid ${P.green}18` }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ color:P.green, display:'flex' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </span>
                <span style={{ fontSize:11, fontWeight:700, color:P.green, textTransform:'uppercase', letterSpacing:'0.08em' }}>Lo que ofrecemos — incluido en todas las vacantes</span>
              </div>
              <button
                onClick={() => { setBenEdit(null); setBenDraft(''); setBenNew(''); setBenModal(true); }}
                style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 9px', borderRadius:6, border:`1px solid ${P.green}35`, background:`${P.green}12`, color:P.green, fontSize:10, fontWeight:600, cursor:'pointer', flexShrink:0 }}>
                {Ic.edit} Editar
              </button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 10px', padding:'12px 13px' }}>
              {beneficios.map((b, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:P.text }}>
                  <span style={{ color:P.green, display:'flex', flexShrink:0 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* Feedback guardado */}
          {status && (
            <div style={{ padding:'10px 14px', borderRadius:8, fontSize:12,
              background: status==='ok' ? P.greenDim : P.errDim,
              color:      status==='ok' ? P.green    : P.err,
              display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ display:'flex' }}>{status==='ok' ? Ic.check : Ic.warn}</span>
              {status==='ok'        ? 'Vacante guardada correctamente.'
               : status==='duplicate' ? `Ya existe una vacante con el título "${form.titulo.trim()}". Usa un nombre diferente.`
               : 'Ocurrió un error. Intenta de nuevo.'}
            </div>
          )}

          {/* Acciones */}
          <div style={{ display:'flex', gap:8, marginTop:4 }}>
            <button onClick={handleSave} disabled={saving || !form.titulo.trim() || isAllCaps(form.titulo)}
              style={{ flex:1, padding:'11px 0', borderRadius:9, border:'none', fontSize:12, fontWeight:600,
                background: saving || !form.titulo.trim() || isAllCaps(form.titulo) ? P.surface2 : P.orange,
                color:      saving || !form.titulo.trim() || isAllCaps(form.titulo) ? P.textDim : '#fff',
                cursor:     saving || !form.titulo.trim() || isAllCaps(form.titulo) ? 'not-allowed' : 'pointer',
                transition:'background 0.15s ease' }}>
              {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear vacante'}
            </button>
            <button onClick={() => setModal(false)}
              style={{ padding:'11px 16px', borderRadius:9, border:`1px solid ${P.border}`, background:'transparent', color:P.textSub, fontSize:12, cursor:'pointer' }}>
              Cancelar
            </button>
          </div>

        </div>
      </Modal>

      {/* ── MODAL: CONFIRMAR ELIMINACIÓN ── */}
      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Confirmar eliminación" P={P}>
        <p style={{ color:P.textSub, fontSize:13, lineHeight:1.6, marginBottom:20 }}>
          Esta acción eliminará la vacante permanentemente y dejará de mostrarse en la página pública.
        </p>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => handleDelete(delConfirm)}
            style={{ flex:1, padding:'11px 0', borderRadius:9, border:'none', background:P.err, color:'#fff', cursor:'pointer', fontWeight:600, fontSize:12 }}>
            Sí, eliminar
          </button>
          <button onClick={() => setDelConfirm(null)}
            style={{ padding:'11px 16px', borderRadius:9, border:`1px solid ${P.border}`, background:'transparent', color:P.textSub, cursor:'pointer', fontSize:12 }}>
            Cancelar
          </button>
        </div>
      </Modal>

      {/* ── MODAL: EDITAR BENEFICIOS ── */}
      <Modal open={benModal} onClose={() => { setBenModal(false); load(); }} title="Lo que ofrecemos" P={P}>
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          <p style={{ fontSize:11, color:P.textDim, marginBottom:12, lineHeight:1.5 }}>
            Estos beneficios aparecen en <strong style={{ color:P.textSub }}>todas</strong> las vacantes de la página pública.
          </p>

          {/* Lista editable */}
          <div style={{ display:'flex', flexDirection:'column', gap:5, marginBottom:14 }}>
            {beneficios.map((b, i) => (
              benEdit === i ? (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 8px', background:P.surface3, borderRadius:7, border:`1px solid ${P.orange}30` }}>
                  <input
                    value={benDraft}
                    onChange={e => setBenDraft(e.target.value)}
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter' && benDraft.trim()) { const next=[...beneficios]; next[i]=benDraft.trim(); setBeneficios(next); setBenEdit(null); setBenDraft(''); }
                      if (e.key === 'Escape') { setBenEdit(null); setBenDraft(''); }
                    }}
                    style={{ ...inp, flex:1, padding:'5px 9px', fontSize:12 }}
                    onFocus={focusIn} onBlur={focusOut}
                  />
                  <button
                    onClick={() => { if (benDraft.trim()) { const next=[...beneficios]; next[i]=benDraft.trim(); setBeneficios(next); } setBenEdit(null); setBenDraft(''); }}
                    title="Confirmar"
                    style={{ padding:'5px 8px', borderRadius:6, border:`1px solid ${P.green}40`, background:`${P.green}15`, color:P.green, cursor:'pointer', display:'flex', flexShrink:0 }}>
                    {Ic.check}
                  </button>
                  <button
                    onClick={() => { setBenEdit(null); setBenDraft(''); }}
                    title="Cancelar"
                    style={{ padding:'5px 8px', borderRadius:6, border:`1px solid ${P.border}`, background:'transparent', color:P.textDim, cursor:'pointer', display:'flex', flexShrink:0 }}>
                    {Ic.close}
                  </button>
                </div>
              ) : (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', background:P.surface2, borderRadius:7, border:`1px solid ${P.border}` }}>
                  <span style={{ color:P.green, display:'flex', flexShrink:0 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <span style={{ flex:1, fontSize:12, color:P.text }}>{b}</span>
                  <button
                    onClick={() => { setBenEdit(i); setBenDraft(b); }}
                    title="Editar"
                    style={{ padding:'5px 7px', borderRadius:6, border:`1px solid ${P.border}`, background:'transparent', color:P.textSub, cursor:'pointer', display:'flex', flexShrink:0 }}>
                    {Ic.edit}
                  </button>
                  <button
                    onClick={() => setBeneficios(prev => prev.filter((_, idx) => idx !== i))}
                    title="Eliminar"
                    style={{ padding:'5px 7px', borderRadius:6, border:`1px solid ${P.err}28`, background:P.errDim, color:P.err, cursor:'pointer', display:'flex', flexShrink:0 }}>
                    {Ic.trash}
                  </button>
                </div>
              )
            ))}
          </div>

          {/* Añadir nuevo */}
          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            <input
              value={benNew}
              onChange={e => setBenNew(e.target.value)}
              placeholder="Añadir un beneficio..."
              onKeyDown={e => { if (e.key === 'Enter' && benNew.trim()) { setBeneficios(prev => [...prev, benNew.trim()]); setBenNew(''); } }}
              style={{ ...inp, flex:1, padding:'8px 11px', fontSize:12 }}
              onFocus={focusIn} onBlur={focusOut}
            />
            <button
              onClick={() => { if (benNew.trim()) { setBeneficios(prev => [...prev, benNew.trim()]); setBenNew(''); } }}
              disabled={!benNew.trim()}
              style={{ padding:'8px 13px', borderRadius:8, border:'none', background: benNew.trim() ? P.orange : P.surface2, color: benNew.trim() ? '#fff' : P.textDim, cursor: benNew.trim() ? 'pointer' : 'not-allowed', display:'flex', alignItems:'center', gap:5, fontSize:12, fontWeight:600, flexShrink:0 }}>
              {Ic.plus} Añadir
            </button>
          </div>

          {/* Guardar */}
          <div style={{ display:'flex', gap:8 }}>
            <button
              onClick={async () => { await saveBeneficios(beneficios); setBenModal(false); }}
              disabled={benSaving}
              style={{ flex:1, padding:'11px 0', borderRadius:9, border:'none', background: benSaving ? P.surface2 : P.green, color: benSaving ? P.textDim : '#fff', cursor: benSaving ? 'not-allowed' : 'pointer', fontSize:12, fontWeight:600 }}>
              {benSaving ? 'Guardando…' : 'Guardar cambios'}
            </button>
            <button
              onClick={() => { setBenModal(false); load(); }}
              style={{ padding:'11px 16px', borderRadius:9, border:`1px solid ${P.border}`, background:'transparent', color:P.textSub, fontSize:12, cursor:'pointer' }}>
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      {/* ── LISTA DE ESPERA ───────────────────────────────────────────────── */}
      {listaEspera.length > 0 && (
        <div style={{ marginTop:28, padding:'0 2px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={P.orange} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span style={{ fontWeight:700, fontSize:13, color:P.text }}>Lista de Espera</span>
            <span style={{ fontSize:11, fontWeight:700, color:P.orange, background:`${P.orange}14`, border:`1px solid ${P.orange}30`, borderRadius:20, padding:'1px 9px' }}>
              {listaEspera.filter(c => !c.notificado_vacante).length} pendiente{listaEspera.filter(c => !c.notificado_vacante).length !== 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ border:`1px solid ${P.border}`, borderRadius:10, overflow:'hidden' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 130px 90px', padding:'8px 14px', background:P.surface2, borderBottom:`1px solid ${P.border}` }}>
              {['Nombre','Puesto de interés','Teléfono / Email','Estado'].map(h => (
                <span key={h} style={{ fontSize:10, fontWeight:700, color:P.textDim, textTransform:'uppercase', letterSpacing:'0.04em' }}>{h}</span>
              ))}
            </div>
            {listaEspera.map((c, i) => (
              <div key={c.id} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 130px 90px', padding:'10px 14px', borderBottom: i < listaEspera.length - 1 ? `1px solid ${P.border2}` : 'none', background: i % 2 === 0 ? 'transparent' : P.surface2 }}>
                <span style={{ fontSize:12, fontWeight:600, color:P.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingRight:8 }}>{c.nombre || '—'}</span>
                <span style={{ fontSize:12, color:P.textSub, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingRight:8 }}>{c.puesto || '—'}</span>
                <span style={{ fontSize:11, color:P.textDim, fontFamily:'monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.telefono || c.email || '—'}</span>
                <span>
                  {c.notificado_vacante
                    ? <span style={{ fontSize:10, fontWeight:700, color:P.green,  background:P.greenDim,      border:`1px solid ${P.green}30`,  borderRadius:20, padding:'1px 8px' }}>Notificado</span>
                    : <span style={{ fontSize:10, fontWeight:700, color:P.orange, background:`${P.orange}12`, border:`1px solid ${P.orange}30`, borderRadius:20, padding:'1px 8px' }}>Pendiente</span>
                  }
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL: NOTIFICAR LISTA DE ESPERA ─────────────────────────────── */}
      <Modal open={!!notifModal} onClose={() => { setNotifModal(null); setNotifResult(null); setNotifSending(false); }} title="Notificar candidatos en espera" P={P}>
        {notifModal && (() => {
          const pendientes = listaEspera.filter(c => matchPuesto(c.puesto, notifModal.titulo) && !c.notificado_vacante);
          const yaNotif    = listaEspera.filter(c => matchPuesto(c.puesto, notifModal.titulo) &&  c.notificado_vacante);
          return (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ padding:'12px 14px', background:P.surface2, borderRadius:9, border:`1px solid ${P.border}` }}>
                <div style={{ fontSize:11, color:P.textDim, marginBottom:3 }}>Vacante publicada</div>
                <div style={{ fontSize:14, fontWeight:700, color:P.text }}>{notifModal.titulo}</div>
                {notifModal.empresa && <div style={{ fontSize:11, color:P.orange, marginTop:2 }}>{notifModal.empresa}</div>}
              </div>

              {pendientes.length > 0 ? (
                <>
                  <div style={{ fontSize:12, color:P.textSub, lineHeight:1.6 }}>
                    Se enviará un WhatsApp a <strong style={{ color:P.text }}>{pendientes.length} persona{pendientes.length !== 1 ? 's' : ''}</strong> que
                    dejaron sus datos esperando esta vacante, preguntando si aún buscan empleo.
                  </div>
                  <div style={{ maxHeight:180, overflowY:'auto', display:'flex', flexDirection:'column', gap:4 }}>
                    {pendientes.map(c => (
                      <div key={c.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 11px', background:P.surface2, borderRadius:7, border:`1px solid ${P.border}` }}>
                        <div>
                          <div style={{ fontSize:12, fontWeight:600, color:P.text }}>{c.nombre}</div>
                          <div style={{ fontSize:10, color:P.textDim }}>{c.puesto} · {c.telefono || c.email || 'sin contacto'}</div>
                        </div>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={P.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    ))}
                  </div>
                  {notifResult && (
                    <div style={{ padding:'10px 13px', borderRadius:8, background: notifResult.error ? P.errDim : P.greenDim, border:`1px solid ${notifResult.error ? P.err : P.green}30`, fontSize:12, color: notifResult.error ? P.err : P.green }}>
                      {notifResult.error ? `Error: ${notifResult.error}` : `Enviados: ${notifResult.enviados} · Fallidos: ${notifResult.fallidos}`}
                    </div>
                  )}
                  {!notifResult && (
                    <button onClick={handleNotificar} disabled={notifSending}
                      style={{ padding:'12px 0', borderRadius:9, border:'none', background: notifSending ? P.surface2 : P.orange, color: notifSending ? P.textDim : '#fff', cursor: notifSending ? 'not-allowed' : 'pointer', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                      {notifSending
                        ? <><div style={{ width:14, height:14, borderRadius:'50%', border:`2px solid ${P.textDim}`, borderTop:`2px solid ${P.orange}`, animation:'spin 0.7s linear infinite' }}/> Enviando…</>
                        : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                          Enviar WhatsApp a {pendientes.length} candidato{pendientes.length !== 1 ? 's' : ''}</>
                      }
                    </button>
                  )}
                </>
              ) : (
                <div style={{ padding:'16px', textAlign:'center', color:P.textDim, fontSize:12 }}>
                  Todos los candidatos en lista de espera para este puesto ya fueron notificados.
                </div>
              )}
              {yaNotif.length > 0 && (
                <div style={{ fontSize:11, color:P.textDim }}>
                  {yaNotif.length} candidato{yaNotif.length !== 1 ? 's' : ''} ya notificado{yaNotif.length !== 1 ? 's' : ''} anteriormente.
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

    </div>
  );
}
