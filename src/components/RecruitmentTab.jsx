// src/components/RecruitmentTab.jsx
import React, { useState, useEffect, useCallback } from 'react';

// ── Mismo sistema de diseño que AdminPanel ────────────────────────────────────
const C = {
  bg:        '#080808',
  surface:   '#111111',
  surface2:  '#161616',
  border:    'rgba(255,255,255,0.07)',
  border2:   'rgba(255,255,255,0.04)',
  text:      'rgba(255,255,255,0.92)',
  textSub:   'rgba(255,255,255,0.45)',
  textDim:   'rgba(255,255,255,0.22)',
  orange:    '#E8521A',
  orangeDim: 'rgba(232,82,26,0.10)',
  green:     '#22C55E',
  greenDim:  'rgba(34,197,94,0.08)',
  blue:      '#3B82F6',
  blueDim:   'rgba(59,130,246,0.08)',
  purple:    '#8B5CF6',
  purpleDim: 'rgba(139,92,246,0.08)',
  amber:     '#F59E0B',
  amberDim:  'rgba(245,158,11,0.08)',
  red:       '#EF4444',
  redDim:    'rgba(239,68,68,0.08)',
};

// ── Fuentes — igual que AdminPanel ───────────────────────────────────────────
const T = {
  sans: "'DM Sans', system-ui, -apple-system, sans-serif",
  mono: "'DM Mono', 'Fira Mono', monospace",
};

const ESTADOS = {
  nuevo:      { label:'Nuevo',      color: C.orange, bg: C.orangeDim },
  revisado:   { label:'Revisado',   color: C.amber,  bg: C.amberDim  },
  contactado: { label:'Contactado', color: C.green,  bg: C.greenDim  },
  descartado: { label:'Descartado', color: C.textDim, bg:'rgba(255,255,255,0.03)' },
};

// ── Badge de estado ───────────────────────────────────────────────────────────
function EstadoBadge({ estado, small = false }) {
  const e = ESTADOS[estado] || ESTADOS.nuevo;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: small ? '2px 7px' : '3px 9px',
      borderRadius: 4,
      fontSize: small ? 9 : 10,
      fontWeight: 500,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      background: e.bg,
      color: e.color,
      border: `1px solid ${e.color}25`,
      fontFamily: T.sans,
      lineHeight: 1.5,
    }}>{e.label}</span>
  );
}

// ── Tarjeta de candidato ──────────────────────────────────────────────────────
function CandidateCard({ candidate, onStatusChange, onDelete, expanded, onToggle }) {
  const [updating, setUpdating] = useState(false);

  const changeStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await fetch('/api/recruitment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateStatus', id: candidate.id, estado: newStatus }),
      });
      onStatusChange(candidate.id, newStatus);
    } catch(e) { console.error(e); }
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar candidato "${candidate.nombre}"?`)) return;
    try {
      await fetch('/api/recruitment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: candidate.id }),
      });
      onDelete(candidate.id);
    } catch(e) { console.error(e); }
  };

  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${expanded ? C.orange + '35' : C.border}`,
      borderRadius: 10,
      overflow: 'hidden',
      transition: 'border-color 0.15s ease',
    }}>
      {/* ── Fila principal ── */}
      <div
        onClick={onToggle}
        style={{
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          cursor: 'pointer',
          background: expanded ? 'rgba(232,82,26,0.04)' : 'transparent',
          transition: 'background 0.15s ease',
        }}
      >
        {/* Avatar */}
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: C.surface2,
          border: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, flexShrink: 0,
        }}>👤</div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <span style={{
              color: C.text, fontWeight: 600, fontSize: 13,
              fontFamily: T.sans, overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {candidate.nombre || 'Sin nombre'}
            </span>
            <EstadoBadge estado={candidate.estado} small/>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {candidate.puesto && (
              <span style={{ color: C.orange, fontSize: 11, fontFamily: T.sans, fontWeight: 500 }}>
                {candidate.puesto}
              </span>
            )}
            <span style={{ color: C.textDim, fontSize: 10, fontFamily: T.mono }}>
              {candidate.tsFormatted || '—'}
            </span>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {candidate.email && (
            <a
              href={`mailto:${candidate.email}`}
              onClick={e => e.stopPropagation()}
              style={{
                padding: '4px 10px', borderRadius: 6,
                fontSize: 10, fontWeight: 500,
                background: C.blueDim, color: C.blue,
                border: `1px solid ${C.blue}20`,
                textDecoration: 'none', fontFamily: T.sans,
              }}
            >✉ Email</a>
          )}
          {candidate.telefono && (
            <a
              href={`https://wa.me/${candidate.telefono.replace(/\D/g,'')}`}
              target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                padding: '4px 10px', borderRadius: 6,
                fontSize: 10, fontWeight: 500,
                background: C.greenDim, color: C.green,
                border: `1px solid ${C.green}20`,
                textDecoration: 'none', fontFamily: T.sans,
              }}
            >📲 WA</a>
          )}
          <span style={{ color: C.textDim, fontSize: 10, marginLeft: 2, fontFamily: T.sans }}>
            {expanded ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {/* ── Detalle expandido ── */}
      {expanded && (
        <div style={{ padding: '14px 16px', borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            {[
              { label: 'Nombre completo',   value: candidate.nombre,   color: C.text   },
              { label: 'Puesto solicitado', value: candidate.puesto,   color: C.orange },
              { label: 'Correo',            value: candidate.email,    color: C.blue   },
              { label: 'Teléfono',          value: candidate.telefono, color: C.green  },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                background: C.surface2,
                border: `1px solid ${C.border}`,
                borderRadius: 8, padding: '10px 12px',
              }}>
                <div style={{
                  color: C.textDim, fontSize: 9, fontFamily: T.sans,
                  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4,
                }}>{label}</div>
                <div style={{
                  color: value ? color : C.textDim,
                  fontSize: 12, fontFamily: T.sans,
                  fontStyle: value ? 'normal' : 'italic',
                }}>{value || 'No proporcionado'}</div>
              </div>
            ))}
          </div>

          {candidate.mensaje && (
            <div style={{
              background: C.surface2, border: `1px solid ${C.border}`,
              borderRadius: 8, padding: '10px 12px', marginBottom: 12,
            }}>
              <div style={{
                color: C.textDim, fontSize: 9, fontFamily: T.sans,
                letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4,
              }}>Último mensaje</div>
              <div style={{ color: C.textSub, fontSize: 12, fontFamily: T.sans, lineHeight: 1.6 }}>
                {candidate.mensaje}
              </div>
            </div>
          )}

          {/* Cambio de estado */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{
              color: C.textDim, fontSize: 10, fontFamily: T.sans,
              letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0,
            }}>Estado:</span>
            {Object.entries(ESTADOS).map(([key, { label, color, bg }]) => (
              <button key={key} disabled={updating} onClick={() => changeStatus(key)} style={{
                padding: '4px 10px', borderRadius: 6,
                fontSize: 10, fontWeight: 500,
                cursor: updating ? 'wait' : 'pointer',
                fontFamily: T.sans,
                textTransform: 'uppercase', letterSpacing: '0.04em',
                background: candidate.estado === key ? bg : 'transparent',
                color: candidate.estado === key ? color : C.textDim,
                border: `1px solid ${candidate.estado === key ? color + '35' : C.border}`,
                transition: 'all 0.13s ease',
                opacity: updating ? 0.5 : 1,
              }}>{label}</button>
            ))}
            <div style={{ flex: 1 }}/>
            <button onClick={handleDelete} style={{
              padding: '4px 10px', borderRadius: 6,
              fontSize: 10, fontWeight: 500,
              cursor: 'pointer', fontFamily: T.sans,
              textTransform: 'uppercase', letterSpacing: '0.04em',
              background: C.redDim, color: C.red,
              border: `1px solid ${C.red}20`,
            }}>Eliminar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function RecruitmentTab() {
  const [candidates, setCandidates] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [expanded,   setExpanded]   = useState(null);
  const [filter,     setFilter]     = useState('todos');
  const [search,     setSearch]     = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/recruitment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list' }),
      });
      const j = await r.json();
      if (j.ok) setCandidates([...j.candidates].reverse());
    } catch(e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = (id, newStatus) =>
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, estado: newStatus } : c));

  const handleDelete = (id) =>
    setCandidates(prev => prev.filter(c => c.id !== id));

  const counts = Object.fromEntries(
    Object.keys(ESTADOS).map(k => [k, candidates.filter(c => c.estado === k).length])
  );

  const filtered = candidates.filter(c => {
    const matchFilter = filter === 'todos' || c.estado === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || [c.nombre, c.email, c.telefono, c.puesto, c.mensaje]
      .some(v => (v || '').toLowerCase().includes(q));
    return matchFilter && matchSearch;
  });

  // ── Spinner de carga ──
  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', padding:'80px 0', flexDirection:'column', gap:12 }}>
      <div style={{ width:22, height:22, borderRadius:'50%', border:`1.5px solid rgba(255,255,255,0.07)`, borderTop:`1.5px solid rgba(255,255,255,0.45)`, animation:'spin 0.7s linear infinite' }}/>
      <span style={{ color:C.textDim, fontSize:11, fontFamily:T.sans, letterSpacing:'0.06em' }}>Cargando candidatos</span>
    </div>
  );

  // ── KPI cards ──
  const kpis = [
    { label:'Total',       value: candidates.length,    color: C.orange },
    { label:'Nuevos',      value: counts.nuevo     || 0, color: C.orange },
    { label:'Revisados',   value: counts.revisado  || 0, color: C.amber  },
    { label:'Contactados', value: counts.contactado|| 0, color: C.green  },
    { label:'Descartados', value: counts.descartado|| 0, color: C.textDim},
  ];

  const CARD = {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: '18px 20px',
    marginBottom: 10,
  };

  return (
    <div>
      {/* ── KPIs ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:8, marginBottom:12 }}>
        {kpis.map(kpi => (
          <div key={kpi.label} style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 10, padding: '16px 18px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:kpi.color, opacity:0.35 }}/>
            <div style={{
              color: C.textDim, fontSize: 10, fontFamily: T.sans,
              fontWeight: 500, textTransform: 'uppercase',
              letterSpacing: '0.07em', marginBottom: 8,
            }}>{kpi.label}</div>
            <div style={{
              color: C.text, fontSize: 32,
              fontFamily: T.mono, fontWeight: 500,
              lineHeight: 1, letterSpacing: '-0.03em',
            }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* ── Tabla de candidatos ── */}
      <div style={CARD}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, flexWrap:'wrap', gap:10 }}>
          <span style={{
            color: C.text, fontSize: 13, fontWeight: 600,
            fontFamily: T.sans, letterSpacing: '-0.01em',
          }}>Candidatos</span>
          <button onClick={load} style={{
            padding: '6px 12px', borderRadius: 7,
            border: `1px solid ${C.border}`,
            background: 'transparent', color: C.textSub,
            cursor: 'pointer', fontSize: 11, fontFamily: T.sans,
            fontWeight: 500, transition: 'all 0.13s ease',
          }}>⟳ Actualizar</button>
        </div>

        {/* Filtros */}
        <div style={{ display:'flex', gap:4, marginBottom:12, flexWrap:'wrap', alignItems:'center' }}>
          {['todos', ...Object.keys(ESTADOS)].map(key => {
            const e = ESTADOS[key];
            const active = filter === key;
            const count = key === 'todos' ? candidates.length : (counts[key] || 0);
            return (
              <button key={key} onClick={() => setFilter(key)} style={{
                padding: '4px 11px', borderRadius: 6,
                fontSize: 11, fontWeight: 500,
                cursor: 'pointer', fontFamily: T.sans,
                textTransform: 'uppercase', letterSpacing: '0.04em',
                background: active ? (e?.bg || C.orangeDim) : 'transparent',
                color: active ? (e?.color || C.orange) : C.textDim,
                border: `1px solid ${active ? (e?.color || C.orange) + '35' : C.border}`,
                transition: 'all 0.13s ease',
              }}>
                {key === 'todos' ? 'Todos' : e.label}{count > 0 && ` (${count})`}
              </button>
            );
          })}

          {/* Buscador */}
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar candidato..."
            style={{
              marginLeft: 'auto',
              padding: '5px 12px', borderRadius: 7,
              border: `1px solid ${C.border}`,
              background: C.surface2,
              color: C.text, fontSize: 11,
              fontFamily: T.sans, outline: 'none',
              width: 190,
              transition: 'border-color 0.13s ease',
            }}
          />
        </div>

        {/* Lista */}
        {!filtered.length ? (
          <div style={{
            textAlign: 'center', padding: '44px 0',
            color: C.textDim, fontFamily: T.sans, fontSize: 11,
          }}>
            {candidates.length === 0
              ? 'Sin candidatos registrados. Serán capturados automáticamente por el chatbot.'
              : 'Sin resultados para el filtro seleccionado.'
            }
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {filtered.map(c => (
              <CandidateCard
                key={c.id}
                candidate={c}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                expanded={expanded === c.id}
                onToggle={() => setExpanded(expanded === c.id ? null : c.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
