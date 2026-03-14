// src/components/RecruitmentTab.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { descargarPerfilPDF, exportarTodoCSV, exportarTodoExcel } from '../lib/recruitmentExport.js';

const C = {
  bg:        '#080808', surface:   '#111111', surface2:  '#161616',
  border:    'rgba(255,255,255,0.07)', border2: 'rgba(255,255,255,0.04)',
  text:      'rgba(255,255,255,0.92)', textSub: 'rgba(255,255,255,0.45)',
  textDim:   'rgba(255,255,255,0.22)',
  orange:    '#E8521A', orangeDim: 'rgba(232,82,26,0.10)',
  green:     '#22C55E', greenDim:  'rgba(34,197,94,0.08)',
  blue:      '#3B82F6', blueDim:   'rgba(59,130,246,0.08)',
  purple:    '#8B5CF6', purpleDim: 'rgba(139,92,246,0.08)',
  amber:     '#F59E0B', amberDim:  'rgba(245,158,11,0.08)',
  red:       '#EF4444', redDim:    'rgba(239,68,68,0.08)',
  teal:      '#14B8A6', tealDim:   'rgba(20,184,166,0.08)',
};

const T = {
  sans: "'DM Sans', system-ui, -apple-system, sans-serif",
  mono: "'DM Mono', 'Fira Mono', monospace",
};

const STATUS_MAP = {
  nuevo:      { label: 'Nuevo',      emoji: '🆕', color: C.orange,  bg: C.orangeDim },
  visto:      { label: 'Visto',      emoji: '👁️',  color: C.amber,   bg: C.amberDim  },
  contactado: { label: 'Contactado', emoji: '📞', color: C.blue,    bg: C.blueDim   },
  descartado: { label: 'Descartado', emoji: '❌', color: C.textDim, bg: 'rgba(255,255,255,0.03)' },
  contratado: { label: 'Contratado', emoji: '✅', color: C.green,   bg: C.greenDim  },
};

function getStatus(c) { return c.status || c.estado || 'nuevo'; }

function StatusBadge({ status, small = false }) {
  const s = STATUS_MAP[status] || STATUS_MAP.nuevo;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: small ? '2px 7px' : '3px 10px', borderRadius: 5, fontSize: small ? 9 : 10, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', background: s.bg, color: s.color, border: `1px solid ${s.color}28`, fontFamily: T.sans, lineHeight: 1.5, whiteSpace: 'nowrap' }}>
      <span style={{ fontSize: small ? 9 : 10 }}>{s.emoji}</span>{s.label}
    </span>
  );
}

function FieldChip({ icon, label, value, color = C.textSub, mono = false }) {
  if (!value) return null;
  return (
    <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: '9px 12px' }}>
      <div style={{ color: C.textDim, fontSize: 9, fontFamily: T.sans, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
        {icon && <span>{icon}</span>}{label}
      </div>
      <div style={{ color, fontSize: 12, fontFamily: mono ? T.mono : T.sans, wordBreak: 'break-word' }}>{value}</div>
    </div>
  );
}

function formatFecha(ts) {
  if (!ts) return '—';
  try {
    const iso = ts.trim().replace(' ', 'T') + (ts.includes('Z') ? '' : 'Z');
    return new Date(iso).toLocaleString('es-MX', {
      timeZone: 'America/Mexico_City',
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return ts; }
}

function isRecent(ts) {
  if (!ts) return false;
  try { return Date.now() - new Date(ts).getTime() < 10 * 60 * 1000; } catch { return false; }
}

function abrirCV(candidate) {
  if (!candidate.cv_base64) { alert('El CV no está disponible.'); return; }
  try {
    const byteString = atob(candidate.cv_base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    const blob = new Blob([ab], { type: candidate.cv_tipo || 'application/pdf' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = candidate.cv_nombre || 'CV'; a.target = '_blank';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } catch (e) { console.error(e); alert('No se pudo abrir el CV.'); }
}

function CVChip({ candidate }) {
  const [hover, setHover] = useState(false);
  if (!candidate.cv_nombre) return null;
  return (
    <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: '9px 12px' }}>
      <div style={{ color: C.textDim, fontSize: 9, fontFamily: T.sans, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}><span>📎</span> Archivo CV</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ color: C.teal, fontSize: 11, fontFamily: T.sans, wordBreak: 'break-all', flex: 1, minWidth: 80 }}>{candidate.cv_nombre}</span>
        {candidate.cv_base64 ? (
          <button onClick={() => abrirCV(candidate)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7, cursor: 'pointer', background: hover ? 'rgba(20,184,166,0.22)' : 'rgba(20,184,166,0.12)', border: `1px solid rgba(20,184,166,0.35)`, color: C.teal, fontSize: 11, fontWeight: 600, fontFamily: T.sans, whiteSpace: 'nowrap', flexShrink: 0, transition: 'background 0.13s ease' }}>
            ⬇ Descargar
          </button>
        ) : (
          <span style={{ color: C.textDim, fontSize: 10, fontFamily: T.sans, fontStyle: 'italic' }}>(sin archivo)</span>
        )}
      </div>
    </div>
  );
}

function HoverBtn({ onClick, bg, bgHover, color, border, children, title, style: s = {} }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} title={title} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans, whiteSpace: 'nowrap', border, background: h ? bgHover : bg, color, transition: 'background 0.13s ease', ...s }}>
      {children}
    </button>
  );
}

// ── CandidateCard recibe canDelete como prop ──────────────────────────────────
function CandidateCard({ candidate, onStatusChange, onDelete, expanded, onToggle, isNew, canDelete }) {
  const [updating, setUpdating] = useState(false);
  const currentStatus = getStatus(candidate);

  const changeStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await fetch('/api/recruitment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'updateStatus', id: candidate.id, status: newStatus }) });
      onStatusChange(candidate.id, newStatus);
    } catch(e) { console.error(e); }
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!canDelete) return;  // ← doble guarda
    if (!confirm(`¿Eliminar candidato "${candidate.nombre}"?`)) return;
    try {
      await fetch('/api/recruitment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id: candidate.id }) });
      onDelete(candidate.id);
    } catch(e) { console.error(e); }
  };

  const folio   = candidate.id ? `#${String(candidate.id).padStart(5, '0')}` : '—';
  const tieneCv = !!(candidate.cv_nombre);
  const tsLabel = formatFecha(candidate.created_at || candidate.ts);
  const recent  = isNew || isRecent(candidate.created_at || candidate.ts);

  return (
    <div style={{ background: C.surface, border: `1px solid ${expanded ? C.orange + '40' : recent ? C.green + '30' : C.border}`, borderRadius: 10, overflow: 'hidden', transition: 'border-color 0.15s ease', animation: recent ? 'newCardIn 0.4s ease both' : 'none' }}>

      <div onClick={onToggle} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', background: expanded ? 'rgba(232,82,26,0.04)' : 'transparent', transition: 'background 0.15s ease', flexWrap: 'wrap', rowGap: 6 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: C.surface2, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>👤</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3, flexWrap: 'wrap' }}>
            <span style={{ color: C.text, fontWeight: 600, fontSize: 13, fontFamily: T.sans, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{candidate.nombre || 'Sin nombre'}</span>
            <StatusBadge status={currentStatus} small />
            {recent && <span style={{ padding: '2px 7px', borderRadius: 4, fontSize: 9, fontWeight: 700, background: C.greenDim, color: C.green, border: `1px solid ${C.green}30`, fontFamily: T.sans, letterSpacing: '0.04em', animation: 'pulse 2s infinite' }}>● NUEVO</span>}
            {tieneCv && <span style={{ padding: '2px 7px', borderRadius: 4, fontSize: 9, fontWeight: 600, background: C.tealDim, color: C.teal, border: `1px solid ${C.teal}25`, fontFamily: T.sans }}>📎 CV</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {candidate.puesto     && <span style={{ color: C.orange, fontSize: 11, fontFamily: T.sans, fontWeight: 500 }}>{candidate.puesto}</span>}
            {candidate.estado_rep && <span style={{ color: C.textDim, fontSize: 10, fontFamily: T.sans }}>📍 {candidate.estado_rep}{candidate.colonia ? `, ${candidate.colonia}` : ''}</span>}
            <span style={{ color: C.textDim, fontSize: 10, fontFamily: T.mono }}>{folio}</span>
            <span style={{ color: C.textDim, fontSize: 10, fontFamily: T.mono }}>{tsLabel}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
          {candidate.email    && <a href={`mailto:${candidate.email}`} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 500, background: C.blueDim, color: C.blue, border: `1px solid ${C.blue}22`, textDecoration: 'none', fontFamily: T.sans, whiteSpace: 'nowrap' }}>✉ Email</a>}
          {candidate.telefono && <a href={`https://wa.me/${(candidate.telefono||'').replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 500, background: C.greenDim, color: C.green, border: `1px solid ${C.green}22`, textDecoration: 'none', fontFamily: T.sans, whiteSpace: 'nowrap' }}>📲 WA</a>}
          {tieneCv && <HoverBtn onClick={() => abrirCV(candidate)} title={candidate.cv_nombre} bg={C.tealDim} bgHover="rgba(20,184,166,0.18)" color={C.teal} border={`1px solid ${C.teal}25`}>⬇ CV</HoverBtn>}
          <HoverBtn onClick={() => descargarPerfilPDF(candidate)} title="Descargar perfil en PDF" bg="rgba(139,92,246,0.08)" bgHover="rgba(139,92,246,0.18)" color={C.purple} border={`1px solid ${C.purple}25`}>🧾 Perfil</HoverBtn>
          <span style={{ color: C.textDim, fontSize: 10, marginLeft: 2 }} onClick={onToggle}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '14px 16px 16px', borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8, marginBottom: 10 }}>
            <FieldChip icon="👤" label="Nombre completo"     value={candidate.nombre}     color={C.text}    />
            <FieldChip icon="💼" label="Puesto solicitado"   value={candidate.puesto}     color={C.orange}  />
            <FieldChip icon="🎂" label="Edad"                value={candidate.edad}       color={C.textSub} />
            <FieldChip icon="📍" label="Estado (República)"  value={candidate.estado_rep} color={C.textSub} />
            <FieldChip icon="🏘️" label="Colonia / Municipio" value={candidate.colonia}    color={C.textSub} />
            <FieldChip icon="✉️" label="Correo electrónico"  value={candidate.email}      color={C.blue}    />
            <FieldChip icon="📲" label="WhatsApp / Teléfono" value={candidate.telefono}   color={C.green} mono />
            <CVChip candidate={candidate} />
          </div>

          {candidate.mensaje && (
            <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>
              <div style={{ color: C.textDim, fontSize: 9, fontFamily: T.sans, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>💬 Último mensaje</div>
              <div style={{ color: C.textSub, fontSize: 12, fontFamily: T.sans, lineHeight: 1.6 }}>{candidate.mensaje}</div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
            <span style={{ color: C.textDim, fontSize: 10, fontFamily: T.sans, letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}>Estado:</span>
            {Object.entries(STATUS_MAP).map(([key, { label, emoji, color, bg }]) => {
              const active = currentStatus === key;
              return (
                <button key={key} disabled={updating} onClick={() => changeStatus(key)} style={{ padding: '4px 11px', borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: updating ? 'wait' : 'pointer', fontFamily: T.sans, letterSpacing: '0.04em', background: active ? bg : 'transparent', color: active ? color : C.textDim, border: `1px solid ${active ? color + '40' : C.border}`, transition: 'all 0.13s ease', opacity: updating ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>{emoji}</span>{label}
                </button>
              );
            })}

            <div style={{ flex: 1 }} />

            <HoverBtn onClick={() => descargarPerfilPDF(candidate)} bg="rgba(139,92,246,0.08)" bgHover="rgba(139,92,246,0.18)" color={C.purple} border={`1px solid ${C.purple}25`} style={{ fontSize: 11, padding: '5px 12px' }}>
              🧾 Descargar perfil PDF
            </HoverBtn>

            {/* ✅ Solo visible si canDelete = true (solo Admin) */}
            {canDelete && (
              <button onClick={handleDelete} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 500, cursor: 'pointer', fontFamily: T.sans, background: C.redDim, color: C.red, border: `1px solid ${C.red}22` }}>
                🗑 Eliminar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
const AUTO_REFRESH_MS = 20_000;

// ✅ Recibe canDelete desde AdminPanel
export default function RecruitmentTab({ canDelete = false }) {
  const [candidates, setCandidates] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded,   setExpanded]   = useState(null);
  const [filter,     setFilter]     = useState('todos');
  const [search,     setSearch]     = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [newIds,     setNewIds]     = useState(new Set());
  const [exporting,  setExporting]  = useState(null);
  const prevIdsRef  = useRef(new Set());
  const intervalRef = useRef(null);

  const load = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true); else setLoading(true);
    try {
      const r = await fetch('/api/recruitment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'list' }) });
      const j = await r.json();
      if (!j.ok) { console.error(j); return; }
      const incoming = j.candidates;
      if (silent && prevIdsRef.current.size > 0) {
        const fresh = incoming.filter(c => !prevIdsRef.current.has(c.id)).map(c => c.id);
        if (fresh.length > 0) {
          setNewIds(prev => new Set([...prev, ...fresh]));
          setTimeout(() => { setNewIds(prev => { const n = new Set(prev); fresh.forEach(id => n.delete(id)); return n; }); }, 60_000);
        }
      }
      prevIdsRef.current = new Set(incoming.map(c => c.id));
      setCandidates(incoming);
      setLastUpdate(new Date());
    } catch(e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(false); }, [load]);
  useEffect(() => {
    intervalRef.current = setInterval(() => load(true), AUTO_REFRESH_MS);
    return () => clearInterval(intervalRef.current);
  }, [load]);

  const handleStatusChange = (id, st) => setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: st, estado: st } : c));
  const handleDelete        = (id)     => setCandidates(prev => prev.filter(c => c.id !== id));

  const counts = Object.fromEntries(Object.keys(STATUS_MAP).map(k => [k, candidates.filter(c => getStatus(c) === k).length]));

  const filtered = candidates.filter(c => {
    const mf = filter === 'todos' || getStatus(c) === filter;
    const q  = search.toLowerCase();
    const ms = !q || [c.nombre, c.email, c.telefono, c.puesto, c.edad, c.estado_rep, c.colonia, c.cv_nombre, c.mensaje].some(v => (v||'').toLowerCase().includes(q));
    return mf && ms;
  });

  const conCv     = candidates.filter(c => c.cv_nombre).length;
  const hoy       = new Date().toISOString().split('T')[0];
  const nuevosHoy = candidates.filter(c => (c.created_at||c.ts||'').replace(' ','T').split('T')[0] === hoy).length;

  const doExport = (type) => {
    setExporting(type);
    const list = filtered.length && filtered.length < candidates.length ? filtered : candidates;
    try { type === 'csv' ? exportarTodoCSV(list) : exportarTodoExcel(list); }
    finally { setTimeout(() => setExporting(null), 1400); }
  };

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', padding:'80px 0', flexDirection:'column', gap:12 }}>
      <div style={{ width:22, height:22, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.07)', borderTop:'1.5px solid rgba(255,255,255,0.45)', animation:'spin 0.7s linear infinite' }}/>
      <span style={{ color:C.textDim, fontSize:11, fontFamily:T.sans, letterSpacing:'0.06em' }}>Cargando candidatos…</span>
    </div>
  );

  const kpis = [
    { label:'Total',       value:candidates.length,      color:C.orange },
    { label:'Hoy',         value:nuevosHoy,              color:C.blue   },
    { label:'Con CV',      value:conCv,                  color:C.teal   },
    { label:'Sin CV',      value:candidates.length-conCv,color:C.textDim},
    { label:'Contratados', value:counts.contratado||0,   color:C.green  },
  ];

  const CARD = { background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'18px 20px', marginBottom:10 };

  return (
    <div>
      <style>{`
        @keyframes spin      { to { transform:rotate(360deg); } }
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes newCardIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:8, marginBottom:12 }}>
        {kpis.map(kpi => (
          <div key={kpi.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'14px 16px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:kpi.color, opacity:0.35 }}/>
            <div style={{ color:C.textDim, fontSize:10, fontFamily:T.sans, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>{kpi.label}</div>
            <div style={{ color:C.text, fontSize:30, fontFamily:T.mono, fontWeight:500, lineHeight:1, letterSpacing:'-0.03em' }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Pipeline */}
      {candidates.length > 0 && (
        <div style={{ ...CARD, padding:'14px 18px', marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
            <span style={{ color:C.textDim, fontSize:10, fontFamily:T.sans, letterSpacing:'0.06em', textTransform:'uppercase', marginRight:4 }}>Pipeline:</span>
            {Object.entries(STATUS_MAP).map(([key,{label,emoji,color,bg}]) => {
              const n = counts[key]||0; if (!n) return null;
              return (
                <div key={key} style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:6, background:bg, border:`1px solid ${color}22` }}>
                  <span style={{ fontSize:10 }}>{emoji}</span>
                  <span style={{ color, fontSize:10, fontFamily:T.sans, fontWeight:500 }}>{label}</span>
                  <span style={{ color:C.textDim, fontSize:10, fontFamily:T.mono }}>{n} ({Math.round((n/candidates.length)*100)}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lista */}
      <div style={CARD}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, flexWrap:'wrap', gap:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ color:C.text, fontSize:13, fontWeight:600, fontFamily:T.sans, letterSpacing:'-0.01em' }}>
              Candidatos
              {filtered.length !== candidates.length && <span style={{ color:C.textDim, fontWeight:400, fontSize:11, marginLeft:8 }}>({filtered.length} de {candidates.length})</span>}
            </span>
            {refreshing && (
              <div style={{ display:'flex', alignItems:'center', gap:5, color:C.textDim, fontSize:10, fontFamily:T.sans }}>
                <div style={{ width:10, height:10, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.1)', borderTop:`1.5px solid ${C.orange}`, animation:'spin 0.7s linear infinite' }}/>
                actualizando…
              </div>
            )}
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
            {lastUpdate && <span style={{ color:C.textDim, fontSize:10, fontFamily:T.mono }}>↺ {lastUpdate.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</span>}
            <button onClick={() => load(false)} style={{ padding:'6px 12px', borderRadius:7, border:`1px solid ${C.border}`, background:'transparent', color:C.textSub, cursor:'pointer', fontSize:11, fontFamily:T.sans, fontWeight:500 }}>⟳ Actualizar</button>
            {candidates.length > 0 && (<>
              <HoverBtn onClick={() => doExport('csv')} bg="rgba(34,197,94,0.08)" bgHover="rgba(34,197,94,0.16)" color={C.green} border={`1px solid ${C.green}28`} style={{ padding:'6px 13px', fontSize:11 }} title="Exportar CSV">
                {exporting==='csv' ? '⏳ Exportando…' : '📊 CSV'}
              </HoverBtn>
              <HoverBtn onClick={() => doExport('excel')} bg="rgba(59,130,246,0.08)" bgHover="rgba(59,130,246,0.16)" color={C.blue} border={`1px solid ${C.blue}28`} style={{ padding:'6px 13px', fontSize:11 }} title="Exportar Excel">
                {exporting==='excel' ? '⏳ Generando…' : '📋 Excel'}
              </HoverBtn>
            </>)}
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display:'flex', gap:4, marginBottom:12, flexWrap:'wrap', alignItems:'center' }}>
          <button onClick={() => setFilter('todos')} style={{ padding:'4px 11px', borderRadius:6, fontSize:11, fontWeight:500, cursor:'pointer', fontFamily:T.sans, textTransform:'uppercase', letterSpacing:'0.04em', background:filter==='todos'?C.orangeDim:'transparent', color:filter==='todos'?C.orange:C.textDim, border:`1px solid ${filter==='todos'?C.orange+'35':C.border}`, transition:'all 0.13s ease' }}>
            Todos {candidates.length>0&&`(${candidates.length})`}
          </button>
          {Object.entries(STATUS_MAP).map(([key,{label,emoji,color,bg}]) => {
            const active=filter===key, count=counts[key]||0;
            return (
              <button key={key} onClick={() => setFilter(key)} style={{ padding:'4px 11px', borderRadius:6, fontSize:11, fontWeight:500, cursor:'pointer', fontFamily:T.sans, textTransform:'uppercase', letterSpacing:'0.04em', background:active?bg:'transparent', color:active?color:C.textDim, border:`1px solid ${active?color+'35':C.border}`, transition:'all 0.13s ease', display:'flex', alignItems:'center', gap:4 }}>
                <span>{emoji}</span>{label}{count>0&&` (${count})`}
              </button>
            );
          })}
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar nombre, puesto, estado…"
            style={{ marginLeft:'auto', padding:'5px 12px', borderRadius:7, border:`1px solid ${C.border}`, background:C.surface2, color:C.text, fontSize:11, fontFamily:T.sans, outline:'none', width:220, minWidth:150, transition:'border-color 0.13s ease' }}
            onFocus={e => e.target.style.borderColor='rgba(255,255,255,0.2)'}
            onBlur={e  => e.target.style.borderColor=C.border}
          />
        </div>

        {/* Lista de tarjetas */}
        {!filtered.length ? (
          <div style={{ textAlign:'center', padding:'44px 0', color:C.textDim, fontFamily:T.sans, fontSize:11 }}>
            {candidates.length===0 ? 'Sin candidatos. Se registran automáticamente desde el chatbot.' : 'Sin resultados para el filtro seleccionado.'}
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {filtered.map(c => (
              <CandidateCard
                key={c.id}
                candidate={c}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                expanded={expanded===c.id}
                onToggle={() => setExpanded(expanded===c.id ? null : c.id)}
                isNew={newIds.has(c.id)}
                canDelete={canDelete}  // ✅ se pasa a cada tarjeta
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ padding:'10px 14px', borderRadius:8, background:'rgba(255,255,255,0.02)', border:`1px solid ${C.border2}`, display:'flex', alignItems:'center', gap:8, marginTop:4 }}>
        <span style={{ fontSize:11 }}>ℹ️</span>
        <span style={{ color:C.textDim, fontSize:10, fontFamily:T.sans, lineHeight:1.5 }}>
          Candidatos capturados automáticamente por el chatbot. Se actualiza cada <strong style={{ color:C.textSub }}>20 segundos</strong>.
          {candidates.length>0&&<> · <strong style={{ color:C.textSub }}>🧾 Perfil</strong> = PDF individual &nbsp;·&nbsp; <strong style={{ color:C.textSub }}>📋 Excel</strong> = exportar todo.</>}
        </span>
      </div>
    </div>
  );
}