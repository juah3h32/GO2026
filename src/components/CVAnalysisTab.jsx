import { useState, useRef } from 'react';

const REC_COLOR = {
  'CONTRATAR':       { bg:'rgba(34,197,94,0.12)',  border:'#22c55e', text:'#22c55e' },
  '2DA ENTREVISTA':  { bg:'rgba(251,191,36,0.12)', border:'#f59e0b', text:'#f59e0b' },
  'DESCARTAR':       { bg:'rgba(239,68,68,0.12)',  border:'#ef4444', text:'#ef4444' },
};

function CandidateCard({ data, index, P }) {
  const [open, setOpen] = useState(false);
  const c = REC_COLOR[data.recomendacion] || { bg:P.border2, border:P.border, text:P.textSub };
  return (
    <div style={{ border:`1px solid ${c.border}55`, borderRadius:10, marginBottom:8, overflow:'hidden' }}>
      <div onClick={() => setOpen(!open)} style={{
        padding:'11px 14px', background:c.bg, cursor:'pointer',
        display:'flex', justifyContent:'space-between', alignItems:'center', gap:8
      }}>
        <div style={{ minWidth:0 }}>
          <span style={{ fontWeight:700, fontSize:14, color:P.text }}>
            {index + 1}. {data.nombre || data.archivo}
          </span>
          {data.ultimoPuesto && (
            <span style={{ fontSize:11, color:P.textDim, marginLeft:8 }}>
              {data.ultimoPuesto}{data.ultimaEmpresa ? ' · ' + data.ultimaEmpresa : ''}
            </span>
          )}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
          <span style={{ fontWeight:700, fontSize:17, color:c.text, fontFamily:'DM Mono,monospace' }}>
            {data.puntuacion}/10
          </span>
          <span style={{
            background:c.border, color:'#fff', padding:'2px 9px',
            borderRadius:20, fontSize:10, fontWeight:700
          }}>{data.recomendacion}</span>
          <span style={{ color:P.textDim, fontSize:10 }}>{open ? '▲' : '▼'}</span>
        </div>
      </div>
      {open && (
        <div style={{ padding:16, background:P.surface2, display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div>
            <p style={{ fontSize:10, color:P.textDim, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Resumen</p>
            <p style={{ fontSize:12, color:P.textSub, fontStyle:'italic', marginBottom:12, lineHeight:1.6 }}>{data.resumenEjecutivo}</p>
            <p style={{ fontSize:10, color:P.textDim, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>Educación</p>
            <p style={{ fontSize:12, color:P.text }}>{data.nivelEducativo} · {data.carrera}</p>
            <p style={{ fontSize:11, color:P.textDim }}>{data.institucion}</p>
            <p style={{ fontSize:10, color:P.textDim, textTransform:'uppercase', letterSpacing:'0.08em', margin:'10px 0 4px' }}>Experiencia</p>
            <p style={{ fontSize:12, color:P.text }}>{data.anosExperiencia ?? '—'} años</p>
            <p style={{ fontSize:10, color:P.textDim, textTransform:'uppercase', letterSpacing:'0.08em', margin:'10px 0 4px' }}>Contacto</p>
            <p style={{ fontSize:12, color:P.text }}>{data.correo || '—'}</p>
            <p style={{ fontSize:12, color:P.text }}>{data.telefono || '—'}</p>
          </div>
          <div>
            <p style={{ fontSize:10, color:P.textDim, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Fortalezas</p>
            {(data.fortalezas || []).map((f,i) => (
              <p key={i} style={{ fontSize:12, color:'#22c55e', marginBottom:3 }}>✓ {f}</p>
            ))}
            <p style={{ fontSize:10, color:P.textDim, textTransform:'uppercase', letterSpacing:'0.08em', margin:'10px 0 6px' }}>Áreas de mejora</p>
            {(data.areasMejora || []).map((a,i) => (
              <p key={i} style={{ fontSize:12, color:'#f59e0b', marginBottom:3 }}>△ {a}</p>
            ))}
            <p style={{ fontSize:10, color:P.textDim, textTransform:'uppercase', letterSpacing:'0.08em', margin:'10px 0 6px' }}>Habilidades</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
              {(data.habilidades || []).map((h,i) => (
                <span key={i} style={{
                  background:P.surface3, border:`1px solid ${P.border}`,
                  borderRadius:5, padding:'2px 7px', fontSize:10, color:P.textSub
                }}>{h}</span>
              ))}
            </div>
            <p style={{ fontSize:10, color:P.textDim, textTransform:'uppercase', letterSpacing:'0.08em', margin:'10px 0 4px' }}>Idiomas</p>
            <p style={{ fontSize:12, color:P.text }}>{(data.idiomas || []).join(', ') || '—'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CVAnalysisTab({ theme }) {
  // Usa la misma paleta que AdminPanel
  const isDark = theme === 'dark';
  const P = {
    orange:'#FB670B', surface:'#181714', surface2:'#201F1C', surface3:'#2A2926',
    border:'rgba(236,235,224,0.11)', border2:'rgba(236,235,224,0.06)',
    text:'rgba(236,235,224,0.97)', textSub:'rgba(236,235,224,0.58)',
    textDim:'rgba(236,235,224,0.30)',
    ...(isDark ? {} : {
      surface:'#FFFFFF', surface2:'#F8F9FB', surface3:'#F3F4F6',
      border:'#E5E7EB', border2:'#F3F4F6',
      text:'#111827', textSub:'#6B7280', textDim:'#9CA3AF',
    })
  };

  const [dragging, setDragging] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [results,  setResults]  = useState([]);
  const [error,    setError]    = useState('');
  const [progress, setProgress] = useState('');
  const inputRef = useRef();

  const processFile = async (file) => {
    setLoading(true); setError(''); setResults([]);
    setProgress('Subiendo archivo...');
    const fd = new FormData();
    fd.append('file', file);
    try {
      setProgress('La IA está analizando los CVs, esto puede tardar unos momentos...');
      const res  = await fetch('/api/admin/analizar-cv', { method:'POST', body:fd });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.results || []);
      setProgress('');
    } catch(e) {
      setError(e.message);
      setProgress('');
    }
    setLoading(false);
  };

  const downloadReport = async () => {
    setProgress('Generando reporte PDF...');
    try {
      const res  = await fetch('/api/admin/reporte-cv', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ results }),
      });
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = 'reporte-cvs.pdf'; a.click();
    } catch(e) { setError(e.message); }
    setProgress('');
  };

  const stats = results.length ? {
    contratar: results.filter(r => r.recomendacion === 'CONTRATAR').length,
    segunda:   results.filter(r => r.recomendacion === '2DA ENTREVISTA').length,
    descartar: results.filter(r => r.recomendacion === 'DESCARTAR').length,
    avg: (results.reduce((s,r) => s + (r.puntuacion||0), 0) / results.length).toFixed(1),
  } : null;

  const CARD = {
    background:P.surface, border:`1px solid ${P.border}`, borderRadius:12,
    padding:'18px 20px', marginBottom:10, position:'relative', overflow:'hidden'
  };

  return (
    <div style={{ animation:'fadeUp 0.22s ease both' }}>

      {/* Drop zone */}
      <div
        onClick={() => !loading && inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f=e.dataTransfer.files[0]; if(f)processFile(f); }}
        style={{
          ...CARD,
          border:`2px dashed ${dragging ? P.orange : P.border}`,
          textAlign:'center', padding:'36px 20px',
          cursor: loading ? 'wait' : 'pointer',
          background: dragging ? `${P.orange}08` : P.surface,
          transition:'border-color 0.2s, background 0.2s'
        }}
      >
        <div style={{ fontSize:28, marginBottom:10, opacity:0.6 }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={P.orange} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{margin:'0 auto'}}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="18" x2="12" y2="12"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
        </div>
        <p style={{ fontWeight:600, fontSize:14, color:P.text, marginBottom:4 }}>
          {loading ? 'Analizando...' : 'Arrastra aquí o haz clic para seleccionar'}
        </p>
        <p style={{ fontSize:12, color:P.textDim }}>
          PDF individual o ZIP con múltiples CVs (máx. 30)
        </p>
        <input
          ref={inputRef} type="file" accept=".pdf,.zip"
          style={{ display:'none' }}
          onChange={e => e.target.files[0] && processFile(e.target.files[0])}
        />
      </div>

      {/* Progress */}
      {(loading || progress) && (
        <div style={{ ...CARD, display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:16, height:16, borderRadius:'50%', border:`2px solid ${P.border}`,
            borderTop:`2px solid ${P.orange}`, animation:'spin 0.7s linear infinite', flexShrink:0 }}/>
          <span style={{ fontSize:12, color:P.textSub }}>{progress || 'Procesando...'}</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ ...CARD, borderColor:'#ef444455', background:'rgba(239,68,68,0.08)', color:'#ef4444' }}>
          <span style={{ fontSize:12 }}>⚠ {error}</span>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:12 }}>
          {[
            { label:'Total',        value:results.length, color:P.orange },
            { label:'Contratar',    value:stats.contratar, color:'#22c55e' },
            { label:'2da entrev.',  value:stats.segunda,   color:'#f59e0b' },
            { label:'Descartar',    value:stats.descartar, color:'#ef4444' },
          ].map(s => (
            <div key={s.label} style={{ ...CARD, textAlign:'center', marginBottom:0, padding:'12px 8px' }}>
              <div style={{ fontSize:26, fontWeight:700, color:s.color, fontFamily:'DM Mono,monospace' }}>{s.value}</div>
              <div style={{ fontSize:10, color:P.textDim, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div style={CARD}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2.5,
            background:P.orange, opacity:0.5 }}/>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <span style={{ fontWeight:700, fontSize:13, color:P.text }}>
              {results.length} candidato{results.length !== 1 ? 's' : ''} · promedio {stats.avg}/10
            </span>
            <button onClick={downloadReport} style={{
              background:P.orange, color:'#fff', border:'none',
              borderRadius:8, padding:'7px 16px', cursor:'pointer',
              fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:6
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Descargar reporte PDF
            </button>
          </div>
          {results.map((r, i) => <CandidateCard key={i} data={r} index={i} P={P}/>)}
        </div>
      )}
    </div>
  );
}