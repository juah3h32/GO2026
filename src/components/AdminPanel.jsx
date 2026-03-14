// src/components/AdminPanel.jsx
// BotGO · Panel Admin v13 · Paleta oficial: #262626 · #535353 · #ECEBE0 · #FB670B
// Ctrl + 9 → abre el panel

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DownloadReportButton } from './ReportGenerator';
import RecruitmentTab from './RecruitmentTab';

// ── FIX HORA TURSO ────────────────────────────────────────────────────────────
function parseTursoDate(ts) {
  if (!ts) return null;
  try {
    const iso = String(ts).trim().replace(' ', 'T') + (String(ts).includes('Z') ? '' : 'Z');
    const d   = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  } catch { return null; }
}
function fmtHora(ts) {
  const d = parseTursoDate(ts);
  if (!d) return '—';
  return d.toLocaleTimeString('es-MX', { timeZone:'America/Mexico_City', hour:'2-digit', minute:'2-digit' });
}
function fmtFecha(ts) {
  const d = parseTursoDate(ts);
  if (!d) return '—';
  return d.toLocaleDateString('es-MX', { timeZone:'America/Mexico_City', day:'2-digit', month:'short' });
}
function fmtFechaHora(ts) {
  const d = parseTursoDate(ts);
  if (!d) return '—';
  return d.toLocaleString('es-MX', { timeZone:'America/Mexico_City', day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
}

// ── PALETA OFICIAL ─────────────────────────────────────────────────────────────
const P = {
  black:       '#262626',
  gray:        '#535353',
  cream:       '#ECEBE0',
  orange:      '#FB670B',
  // Derivados
  orangeDark:  '#D4530A',
  orangeWarm:  '#FD8A40',
  grayMid:     '#8A8A7A',
  grayLight:   '#C4C3B5',
  creamDark:   '#D8D6C5',
  bg:          '#1A1917',      // casi negro cálido
  surface:     '#222220',
  surface2:    '#2A2926',
  border:      'rgba(236,235,224,0.07)',
  border2:     'rgba(236,235,224,0.04)',
  text:        'rgba(236,235,224,0.92)',
  textSub:     'rgba(236,235,224,0.48)',
  textDim:     'rgba(236,235,224,0.22)',
  // Semáforo dentro de paleta
  ok:          '#FB670B',   // naranja = positivo
  okDim:       'rgba(251,103,11,0.10)',
  warn:        '#C4C3B5',   // gris claro = neutral/alerta
  warnDim:     'rgba(196,195,181,0.08)',
  err:         '#535353',   // gris oscuro = negativo/error
  errDim:      'rgba(83,83,83,0.15)',
};

const T = { sans:"'DM Sans',system-ui,sans-serif", mono:"'DM Mono','Fira Mono',monospace" };

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  .admin-overlay {
    position:fixed; inset:0; z-index:999990;
    background:rgba(10,9,8,0.88);
    backdrop-filter:blur(28px) saturate(110%);
    -webkit-backdrop-filter:blur(28px) saturate(110%);
    display:flex; align-items:center; justify-content:center;
    padding:8px; opacity:0; transition:opacity 0.28s ease;
  }
  .admin-overlay.visible { opacity:1; }

  .aroot, .aroot * { font-family:'DM Sans',system-ui,sans-serif !important; }
  .aroot .mono, .aroot code, .aroot pre { font-family:'DM Mono','Fira Mono',monospace !important; }
  .aroot .stat-num { font-family:'DM Mono','Fira Mono',monospace !important; }

  /* SCROLLBAR */
  .adash { scrollbar-width:thin; scrollbar-color:rgba(236,235,224,0.06) transparent; }
  .adash::-webkit-scrollbar { width:3px; }
  .adash::-webkit-scrollbar-thumb { background:rgba(236,235,224,0.06); border-radius:2px; }

  /* ANIMATIONS */
  @keyframes spin    { to { transform:rotate(360deg); } }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.35} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes slideIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
  @keyframes barGrow { from{width:0} }
  @keyframes scanline {
    0%   { top:-8%; }
    100% { top:108%; }
  }
  @keyframes counterUp { from{transform:translateY(6px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes orangePulse { 0%,100%{box-shadow:0 0 0 0 rgba(251,103,11,0)} 50%{box-shadow:0 0 0 4px rgba(251,103,11,0.15)} }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }

  /* PANEL ENTER */
  .panel-enter { animation:fadeUp 0.34s cubic-bezier(0.16,1,0.3,1) both; }
  .card-enter  { animation:fadeUp 0.26s cubic-bezier(0.16,1,0.3,1) both; }
  .card-enter:nth-child(1) { animation-delay:0.04s; }
  .card-enter:nth-child(2) { animation-delay:0.08s; }
  .card-enter:nth-child(3) { animation-delay:0.12s; }
  .card-enter:nth-child(4) { animation-delay:0.16s; }
  .bar-fill   { animation:barGrow 0.65s cubic-bezier(0.16,1,0.3,1) both; }
  .tab-content { animation:fadeUp 0.20s ease both; }
  .slide-in    { animation:slideIn 0.22s ease both; }

  /* HOVER / INTERACTIONS */
  .card-hover { transition:background 0.14s ease, border-color 0.14s ease, transform 0.14s ease; }
  .card-hover:hover {
    background:rgba(236,235,224,0.025) !important;
    border-color:rgba(236,235,224,0.10) !important;
    transform:translateY(-1px);
  }

  .tab-btn { position:relative; transition:color 0.13s ease,background 0.13s ease; border-radius:6px; }
  .tab-btn:hover { background:rgba(236,235,224,0.04); }
  .tab-btn.active { background:rgba(236,235,224,0.06); }
  .tab-btn.active::after {
    content:''; position:absolute; bottom:-1px; left:12px; right:12px;
    height:1.5px; background:${P.orange}; border-radius:2px;
  }

  .btn-base { transition:opacity 0.13s ease,background 0.13s ease,transform 0.10s ease; cursor:pointer; }
  .btn-base:hover:not(:disabled)  { opacity:0.84; }
  .btn-base:active:not(:disabled) { transform:scale(0.96); }

  .row-hover { transition:background 0.08s ease; }
  .row-hover:hover { background:rgba(236,235,224,0.028) !important; }

  /* PERIOD PILLS */
  .period-btn {
    padding:4px 10px; border-radius:6px; font-size:11px; font-weight:500;
    cursor:pointer; transition:all 0.12s ease; white-space:nowrap;
    border:1px solid transparent; background:transparent;
    color:rgba(236,235,224,0.32); letter-spacing:0.01em;
  }
  .period-btn:hover  { color:rgba(236,235,224,0.70); background:rgba(236,235,224,0.04); }
  .period-btn.active {
    background:rgba(251,103,11,0.10); border-color:rgba(251,103,11,0.22);
    color:${P.orange};
  }

  .period-date-input {
    background:rgba(236,235,224,0.04); border:1px solid rgba(236,235,224,0.08);
    border-radius:6px; padding:4px 8px; color:rgba(236,235,224,0.80);
    font-size:11px; outline:none; cursor:pointer;
    transition:border-color 0.12s ease; color-scheme:dark;
  }
  .period-date-input:focus { border-color:rgba(251,103,11,0.35); }

  .period-apply {
    padding:4px 12px; border-radius:6px; font-size:11px; font-weight:600;
    cursor:pointer; background:${P.orange}; color:#fff; border:none;
    transition:all 0.12s ease;
  }
  .period-apply:disabled { background:rgba(236,235,224,0.06); color:rgba(236,235,224,0.18); cursor:not-allowed; }
  .period-apply:hover:not(:disabled) { background:${P.orangeDark}; }

  input:-webkit-autofill {
    -webkit-box-shadow:0 0 0 100px ${P.bg} inset !important;
    -webkit-text-fill-color:rgba(236,235,224,0.9) !important;
  }

  /* SCANLINE EFFECT on login */
  .scanline-wrap { position:relative; overflow:hidden; }
  .scanline-wrap::after {
    content:''; position:absolute; left:0; right:0; height:8%;
    background:linear-gradient(transparent,rgba(251,103,11,0.03),transparent);
    animation:scanline 4s linear infinite; pointer-events:none;
  }

  /* SKELETON SHIMMER */
  .skel {
    background:linear-gradient(90deg,rgba(236,235,224,0.04) 25%,rgba(236,235,224,0.08) 50%,rgba(236,235,224,0.04) 75%);
    background-size:400px 100%;
    animation:shimmer 1.4s ease infinite;
    border-radius:5px;
  }

  /* KPI GLOW on hover */
  .kpi-glow:hover { animation:orangePulse 1.4s ease infinite; }

  /* STAT NUM counter */
  .stat-num-anim { animation:counterUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }

  @media(max-width:640px) {
    .resp-hide-sm  { display:none !important; }
    .resp-stack    { flex-direction:column !important; }
    .resp-full     { width:100% !important; max-width:100% !important; }
    .resp-grid-1   { grid-template-columns:1fr !important; }
    .stat-num      { font-size:28px !important; }
  }
  @media(max-width:480px) {
    .resp-hide-xs  { display:none !important; }
    .stat-num      { font-size:24px !important; }
  }
`;

// ── HELPERS ───────────────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w;
}
function toYMD(d)    { return d.toISOString().split('T')[0]; }
function addDays(d,n){ const r=new Date(d); r.setDate(r.getDate()+n); return r; }

const PERIOD_PRESETS = [
  { id:'today',  label:'Hoy',  getRange:()=>{ const t=toYMD(new Date()); return {from:t,to:t}; } },
  { id:'7d',     label:'7D',   getRange:()=>({ from:toYMD(addDays(new Date(),-6)), to:toYMD(new Date()) }) },
  { id:'30d',    label:'30D',  getRange:()=>({ from:toYMD(addDays(new Date(),-29)), to:toYMD(new Date()) }) },
  { id:'month',  label:'Mes',  getRange:()=>({ from:toYMD(new Date(new Date().getFullYear(),new Date().getMonth(),1)), to:toYMD(new Date()) }) },
  { id:'all',    label:'Todo', getRange:()=>({ from:null, to:null }) },
  { id:'custom', label:'↔',    getRange:()=>null },
];

// ── MICRO COMPONENTS ──────────────────────────────────────────────────────────
const Dot = ({ active, color=P.orange }) => (
  <span style={{ width:5,height:5,borderRadius:'50%',background:active?color:P.textDim,display:'inline-block',flexShrink:0,
    boxShadow:active?`0 0 6px ${color}90`:'none', animation:active?'pulse 2.2s infinite':'none' }}/>
);

const Tag = ({ children, color=P.orange, size=10 }) => (
  <span style={{ display:'inline-flex',alignItems:'center',padding:'2px 7px',borderRadius:4,fontSize:size,
    fontWeight:500,letterSpacing:'0.04em',background:color+'14',color,
    border:`1px solid ${color}25`, lineHeight:1.5 }}>{children}</span>
);

const OrangeBar = ({ width='100%', height=1, opacity=0.35 }) => (
  <div style={{ width, height, background:`linear-gradient(90deg,${P.orange},transparent)`, opacity, flexShrink:0 }}/>
);

// ── SPINNER ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{ display:'flex',justifyContent:'center',alignItems:'center',padding:'80px 0',flexDirection:'column',gap:14 }}>
      <div style={{ position:'relative',width:32,height:32 }}>
        <div style={{ position:'absolute',inset:0,borderRadius:'50%',border:`1.5px solid rgba(236,235,224,0.06)` }}/>
        <div style={{ position:'absolute',inset:0,borderRadius:'50%',border:`1.5px solid transparent`,
          borderTop:`1.5px solid ${P.orange}`, animation:'spin 0.65s linear infinite' }}/>
      </div>
      <span style={{ color:P.textDim,fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase' }}>Cargando</span>
    </div>
  );
}

// ── SKELETON CARDS ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ background:P.surface,border:`1px solid ${P.border}`,borderRadius:10,padding:'16px 18px' }}>
      <div className="skel" style={{ height:10,width:'45%',marginBottom:14 }}/>
      <div className="skel" style={{ height:32,width:'60%',marginBottom:8 }}/>
      <div className="skel" style={{ height:9,width:'35%' }}/>
    </div>
  );
}

// ── BAR CHART ─────────────────────────────────────────────────────────────────
function BarChart({ data=[], color=P.orange, max=8 }) {
  const sorted = [...data].sort((a,b)=>b.value-a.value).slice(0,max);
  const mv     = sorted[0]?.value || 1;
  if (!sorted.length)
    return <div style={{ textAlign:'center',padding:'40px 0',color:P.textDim,fontSize:11 }}>Sin datos disponibles</div>;
  return (
    <div style={{ display:'flex',flexDirection:'column',gap:2 }}>
      {sorted.map((item,i) => {
        const pct=Math.round((item.value/mv)*100), isTop=i===0;
        return (
          <div key={i} style={{ display:'flex',alignItems:'center',gap:8,padding:'5px 0',
            borderRadius:6,transition:'background 0.1s ease',cursor:'default' }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(236,235,224,0.02)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <span className="mono" style={{ color:P.textDim,fontSize:10,width:14,textAlign:'right',flexShrink:0 }}>{i+1}</span>
            <span style={{ color:P.textSub,fontSize:11,width:92,textAlign:'right',flexShrink:0,
              overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis' }}>{item.label}</span>
            <div style={{ flex:1,position:'relative',height:isTop?6:4,background:'rgba(236,235,224,0.04)',borderRadius:3,overflow:'hidden' }}>
              <div className="bar-fill" style={{ width:`${pct}%`,height:'100%',borderRadius:3,
                background:isTop?`linear-gradient(90deg,${P.orange},${P.orangeWarm})`:`${color}55`,
                animationDelay:`${i*0.04}s` }}/>
            </div>
            <span className="mono" style={{ color:isTop?P.orange:P.text,fontSize:11,fontWeight:500,width:28,textAlign:'right',flexShrink:0 }}>{item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── LINE CHART ────────────────────────────────────────────────────────────────
function LineChart({ daily }) {
  const entries = Object.entries(daily||{}).sort(([a],[b])=>a.localeCompare(b)).slice(-14);
  if (entries.length < 2)
    return <div style={{ textAlign:'center',padding:'40px 0',color:P.textDim,fontSize:11 }}>Se necesitan al menos 2 días de datos</div>;
  const vals  = entries.map(([,v])=>v.messages||0);
  const waVals= entries.map(([,v])=>v.wa||0);
  const mv=Math.max(...vals,...waVals,1), mn=0;
  const W=440, H=80, step=W/(vals.length-1);
  const py = v => H - ((v-mn)/Math.max(mv-mn,1))*(H-16) - 8;
  const pts    = vals.map((v,i)=>({ x:i*step, y:py(v) }));
  const waPts  = waVals.map((v,i)=>({ x:i*step, y:py(v) }));
  const pathD  = pts.map((p,i)=>`${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const waPath = waPts.map((p,i)=>`${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaD  = `${pathD} L${W},${H+4} L0,${H+4} Z`;
  return (
    <svg width="100%" viewBox={`-4 -4 ${W+8} ${H+52}`} style={{ display:'block',overflow:'visible' }}>
      <defs>
        <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={P.orange} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={P.orange} stopOpacity="0"/>
        </linearGradient>
        <filter id="lglow"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {[0.25,0.5,0.75,1].map(p=><line key={p} x1={0} y1={H-p*(H-16)-8} x2={W} y2={H-p*(H-16)-8} stroke="rgba(236,235,224,0.04)" strokeWidth="1"/>)}
      <path d={areaD} fill="url(#ag1)"/>
      <path d={pathD} fill="none" stroke={P.orange} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" filter="url(#lglow)"/>
      <path d={waPath} fill="none" stroke={P.gray} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="3,3"/>
      {pts.map((p,i)=>(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="2.5" fill={P.bg} stroke={P.orange} strokeWidth="1.5"/>
          <text x={p.x} y={H+34} textAnchor="middle" fill="rgba(236,235,224,0.22)" fontSize="9" fontFamily="DM Sans,system-ui">{entries[i][0].slice(5)}</text>
        </g>
      ))}
      {/* Legend */}
      <g>
        <circle cx={10} cy={H+50} r="3" fill={P.orange}/>
        <text x={16} y={H+53.5} fill="rgba(236,235,224,0.35)" fontSize="8.5" fontFamily="DM Sans,system-ui">Mensajes</text>
        <line x1={80} y1={H+50} x2={92} y2={H+50} stroke={P.gray} strokeWidth="1.5" strokeDasharray="2,2"/>
        <text x={96} y={H+53.5} fill="rgba(236,235,224,0.35)" fontSize="8.5" fontFamily="DM Sans,system-ui">WhatsApp</text>
      </g>
    </svg>
  );
}

// ── DONUT CHART ───────────────────────────────────────────────────────────────
function DonutChart({ intents }) {
  const COLORS = [P.orange, P.gray, P.grayMid, P.grayLight, P.creamDark];
  const LABELS = { compra:'Compra', pdf:'PDF', info:'Info', reclutamiento:'Empleo', otro:'Otro' };
  const ents   = Object.entries(intents||{}).filter(([,v])=>v>0);
  const total  = ents.reduce((s,[,v])=>s+v,0)||1;
  let cumul=0;
  const R=42, CX=54, CY=54;
  const polar = pct => { const a=pct*2*Math.PI-Math.PI/2; return [CX+R*Math.cos(a), CY+R*Math.sin(a)]; };
  const slices = ents.map(([key,val])=>{ const pct=val/total, start=cumul; cumul+=pct; return {key,val,pct,start}; });
  return (
    <div style={{ display:'flex',alignItems:'center',gap:20,flexWrap:'wrap' }}>
      <svg width={108} height={108} viewBox="0 0 108 108" style={{ flexShrink:0 }}>
        {slices.length===0
          ? <circle cx={CX} cy={CY} r={R} fill="rgba(236,235,224,0.04)" stroke="rgba(236,235,224,0.06)" strokeWidth="1"/>
          : slices.map(({key,pct,start},i) => {
              const [x1,y1]=polar(start+0.004), [x2,y2]=polar(start+pct-0.004);
              return <path key={key} d={`M${CX},${CY} L${x1},${y1} A${R},${R} 0 ${pct>.5?1:0},1 ${x2},${y2} Z`}
                fill={COLORS[i%COLORS.length]} opacity="0.88"/>;
            })}
        <circle cx={CX} cy={CY} r={30} fill={P.bg}/>
        <circle cx={CX} cy={CY} r={30} fill="none" stroke="rgba(236,235,224,0.05)" strokeWidth="1"/>
        <text x={CX} y={CY-7} textAnchor="middle" fill="rgba(236,235,224,0.25)" fontSize="7.5" fontFamily="DM Sans,system-ui" letterSpacing="0.1em">TOTAL</text>
        <text x={CX} y={CY+12} textAnchor="middle" fill={P.text} fontSize="22" fontFamily="DM Mono,monospace" fontWeight="500">{total}</text>
      </svg>
      <div style={{ display:'flex',flexDirection:'column',gap:7,flex:1,minWidth:120 }}>
        {ents.map(([key,val],i)=>{ const color=COLORS[i%COLORS.length], pct=Math.round((val/total)*100); return (
          <div key={key} style={{ display:'flex',alignItems:'center',gap:9 }}>
            <div style={{ width:3,height:3,borderRadius:'50%',background:color,flexShrink:0 }}/>
            <span style={{ color:P.textSub,fontSize:11,flex:1 }}>{LABELS[key]||key}</span>
            <span className="mono" style={{ color:P.text,fontSize:11,fontWeight:500 }}>{val}</span>
            <span className="mono" style={{ color:P.textDim,fontSize:10,width:30,textAlign:'right' }}>{pct}%</span>
          </div>
        ); })}
        {!ents.length&&<span style={{ color:P.textDim,fontSize:11 }}>Sin datos</span>}
      </div>
    </div>
  );
}

// ── LEADS MINI CHART ──────────────────────────────────────────────────────────
function LeadsLineChart({ leads }) {
  if (!leads.length) return null;
  const byDay = {};
  leads.forEach(l=>{ const d=(l.ts||'').split('T')[0]||(l.ts||'').split(' ')[0]; if(d)byDay[d]=(byDay[d]||0)+1; });
  const entries=Object.entries(byDay).sort(([a],[b])=>a.localeCompare(b)).slice(-14);
  if (entries.length<2) return null;
  const vals=entries.map(([,v])=>v), mv=Math.max(...vals,1), mn=Math.min(...vals);
  const W=440, H=60, step=W/(vals.length-1);
  const pts=vals.map((v,i)=>({x:i*step, y:H-((v-mn)/Math.max(mv-mn,1))*(H-12)-6}));
  const pathD=pts.map((p,i)=>`${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  return (
    <svg width="100%" viewBox={`-4 -4 ${W+8} ${H+40}`} style={{ display:'block',overflow:'visible' }}>
      <defs><linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={P.orange} stopOpacity="0.15"/>
        <stop offset="100%" stopColor={P.orange} stopOpacity="0"/>
      </linearGradient></defs>
      <path d={`${pathD} L${W},${H+4} L0,${H+4} Z`} fill="url(#lg2)"/>
      <path d={pathD} fill="none" stroke={P.orange} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      {pts.map((p,i)=>(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="2.5" fill={P.bg} stroke={P.orange} strokeWidth="1.5"/>
          <text x={p.x} y={H+28} textAnchor="middle" fill="rgba(236,235,224,0.20)" fontSize="9" fontFamily="DM Sans,system-ui">{entries[i][0].slice(5)}</text>
        </g>
      ))}
    </svg>
  );
}

// ── STAT CARD ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color=P.orange, icon, trend }) {
  const [disp, setDisp] = useState(0);
  const [key, setKey]   = useState(0);
  const target = typeof value==='number' ? value : 0;
  useEffect(()=>{
    setKey(k=>k+1);
    if (!target) { setDisp(0); return; }
    const dur=700, t0=Date.now();
    const tick=()=>{ const p=Math.min((Date.now()-t0)/dur,1), e=1-Math.pow(1-p,3); setDisp(Math.round(target*e)); if(p<1)requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  },[target]);
  const trendPos = trend>0, trendNeg = trend<0;
  return (
    <div className="card-enter card-hover kpi-glow" style={{ background:P.surface,border:`1px solid ${P.border}`,
      borderRadius:10,padding:'16px 18px',position:'relative',overflow:'hidden',cursor:'default' }}>
      {/* Top accent bar */}
      <div style={{ position:'absolute',top:0,left:0,right:0,height:'2px',
        background:`linear-gradient(90deg,${color},transparent)`,opacity:0.45 }}/>
      {/* Subtle corner glow */}
      <div style={{ position:'absolute',top:-20,left:-20,width:80,height:80,borderRadius:'50%',
        background:color,opacity:0.03,pointerEvents:'none' }}/>
      <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10 }}>
        <span style={{ color:P.textDim,fontSize:10,fontWeight:500,textTransform:'uppercase',letterSpacing:'0.09em' }}>{label}</span>
        {icon && <span style={{ fontSize:13,opacity:0.16 }}>{icon}</span>}
      </div>
      <p key={key} className="stat-num stat-num-anim" style={{ color:P.text,fontSize:34,marginBottom:6,
        fontFamily:"'DM Mono',monospace" }}>
        {typeof value==='number' ? disp.toLocaleString('es-MX') : (value??'—')}
      </p>
      <div style={{ display:'flex',alignItems:'center',gap:8 }}>
        {sub && <span style={{ color:P.textDim,fontSize:11 }}>{sub}</span>}
        {trend!==undefined && trend!==0 && (
          <span className="mono" style={{ fontSize:10,fontWeight:500,padding:'1px 6px',borderRadius:4,
            background:trendPos?P.okDim:trendNeg?P.errDim:P.warnDim,
            color:trendPos?P.orange:trendNeg?P.grayMid:P.textDim,
            border:`1px solid ${trendPos?P.orange+'22':P.border}` }}>
            {trend>0?'+':''}{trend}
          </span>
        )}
      </div>
    </div>
  );
}

// ── SECTION LABEL ─────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:14 }}>
      <span style={{ color:P.textSub,fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',flexShrink:0 }}>{children}</span>
      <div style={{ flex:1,height:1,background:`linear-gradient(90deg,${P.border},transparent)` }}/>
    </div>
  );
}

// ── EYE ICON ──────────────────────────────────────────────────────────────────
function EyeIcon({ open }) {
  return open
    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}

// ── PERIOD SELECTOR ───────────────────────────────────────────────────────────
function PeriodSelector({ activeId, onSelect, customFrom, customTo, setCustomFrom, setCustomTo, onApplyCustom }) {
  return (
    <div style={{ display:'flex',alignItems:'center',gap:2,flexWrap:'wrap',rowGap:6 }}>
      <span style={{ color:P.textDim,fontSize:10,marginRight:6,letterSpacing:'0.07em',textTransform:'uppercase',fontWeight:500 }}>Período</span>
      {PERIOD_PRESETS.filter(p=>p.id!=='custom').map(p=>(
        <button key={p.id} className={`period-btn ${activeId===p.id?'active':''}`} onClick={()=>onSelect(p)}>{p.label}</button>
      ))}
      <div style={{ width:1,height:14,background:P.border,margin:'0 2px' }}/>
      <button className={`period-btn ${activeId==='custom'?'active':''}`} onClick={()=>onSelect(PERIOD_PRESETS.find(p=>p.id==='custom'))}>
        Rango ↔
      </button>
      {activeId==='custom'&&(
        <div style={{ display:'flex',alignItems:'center',gap:6,animation:'fadeIn 0.16s ease',flexWrap:'wrap',rowGap:4 }}>
          <input type="date" className="period-date-input" value={customFrom} max={customTo||toYMD(new Date())} onChange={e=>setCustomFrom(e.target.value)}/>
          <span style={{ color:P.textDim,fontSize:10 }}>–</span>
          <input type="date" className="period-date-input" value={customTo} min={customFrom} max={toYMD(new Date())} onChange={e=>setCustomTo(e.target.value)}/>
          <button className="period-apply" disabled={!customFrom||!customTo} onClick={onApplyCustom}>OK</button>
        </div>
      )}
    </div>
  );
}

// ── PASSWORD STRENGTH ─────────────────────────────────────────────────────────
function getStrength(pw) {
  if (!pw) return { score:0, label:'', color:'transparent' };
  let s=0;
  if (pw.length>=8) s++;  if (pw.length>=12) s++;
  if (/[A-Z]/.test(pw)) s++;  if (/[0-9]/.test(pw)) s++;  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s<=1) return {score:s,label:'Muy débil', color:P.grayMid};
  if (s===2) return {score:s,label:'Débil',    color:P.grayLight};
  if (s===3) return {score:s,label:'Regular',  color:P.grayLight};
  if (s===4) return {score:s,label:'Fuerte',   color:P.orange};
  return {score:5,label:'Muy fuerte',color:P.orange};
}

// ── SYSTEM USERS ──────────────────────────────────────────────────────────────
const SYSTEM_USERS = [
  { id:'Admin',        label:'GO',          role:'Administrador',      desc:'Acceso completo a todas las secciones y estadísticas', color:P.orange,    colorDim:P.okDim },
  { id:'RH',           label:'RH',          role:'Recursos Humanos',   desc:'Acceso a reclutamiento y panel de candidatos',          color:P.grayLight, colorDim:P.warnDim },
  { id:'Distribuidor', label:'Distribuidor',role:'Atención a Clientes', desc:'Acceso a solicitudes de distribuidores y leads',        color:P.gray,      colorDim:P.errDim },
];

function UserCard({ user }) {
  const [open,setOpen]=useState(false), [activeTab,setActiveTab]=useState('password');
  const [pw,setPw]=useState(''), [confirm,setConfirm]=useState('');
  const [showPw,setShowPw]=useState(false), [showCf,setShowCf]=useState(false);
  const [newName,setNewName]=useState(''), [loading,setLoading]=useState(false);
  const [status,setStatus]=useState(null), [msg,setMsg]=useState('');
  const [dispLabel,setDispLabel]=useState(user.label);
  const pwRef=useRef(null), nameRef=useRef(null);

  const strength=getStrength(pw);
  const match=pw&&confirm&&pw===confirm, mismatch=pw&&confirm&&pw!==confirm;
  const canSavePw=pw.length>=6&&match&&!loading, canSaveName=newName.trim().length>=2&&newName.trim()!==dispLabel&&!loading;

  const handleOpen=(tab='password')=>{ setOpen(true); setActiveTab(tab); setPw(''); setConfirm(''); setNewName(''); setStatus(null); setMsg(''); setTimeout(()=>(tab==='name'?nameRef:pwRef).current?.focus(),120); };
  const handleCancel=()=>{ setOpen(false); setPw(''); setConfirm(''); setNewName(''); setStatus(null); setMsg(''); };
  const switchTab=(t)=>{ setActiveTab(t); setStatus(null); setMsg(''); setTimeout(()=>(t==='name'?nameRef:pwRef).current?.focus(),80); };

  const handleSavePassword=async()=>{ if(!canSavePw)return; setLoading(true); setStatus(null); try{ const res=await fetch('/api/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'changePassword',userId:user.id,newPassword:pw})}); const data=await res.json(); if(data.ok){setStatus('ok');setMsg('Contraseña actualizada');setTimeout(()=>{setOpen(false);setPw('');setConfirm('');setStatus(null);},2000);}else{setStatus('error');setMsg(data.error||'Error al actualizar');} }catch{setStatus('error');setMsg('Error de conexión.');} setLoading(false); };
  const handleSaveName=async()=>{ if(!canSaveName)return; setLoading(true); setStatus(null); try{ const res=await fetch('/api/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'changeName',userId:user.id,newName:newName.trim()})}); const data=await res.json(); if(data.ok){setDispLabel(newName.trim());setStatus('ok');setMsg('Nombre actualizado');setTimeout(()=>{setOpen(false);setNewName('');setStatus(null);},2000);}else{setStatus('error');setMsg(data.error||'Error al actualizar');} }catch{setStatus('error');setMsg('Error de conexión.');} setLoading(false); };

  const fieldStyle={width:'100%',background:P.surface2,border:`1px solid ${P.border}`,borderRadius:8,padding:'10px 40px 10px 14px',color:P.text,fontSize:12,outline:'none',boxSizing:'border-box',transition:'border-color 0.14s ease'};

  return (
    <div style={{ background:P.surface,border:`1px solid ${open?user.color+'40':P.border}`,
      borderRadius:12,overflow:'hidden',transition:'border-color 0.2s ease,box-shadow 0.2s ease',
      boxShadow:open?`0 0 0 1px ${user.color}20,0 4px 20px rgba(0,0,0,0.3)`:'none' }}>
      <div style={{ height:2,background:`linear-gradient(90deg,${user.color},transparent)` }}/>
      <div style={{ display:'flex',alignItems:'center',gap:14,padding:'18px 20px',flexWrap:'wrap' }}>
        <div style={{ width:44,height:44,borderRadius:10,background:user.colorDim,
          border:`1px solid ${user.color}25`,display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:18,flexShrink:0,fontWeight:700,color:user.color,letterSpacing:'-0.02em' }}>
          {dispLabel.slice(0,2).toUpperCase()}
        </div>
        <div style={{ flex:1,minWidth:120 }}>
          <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:3,flexWrap:'wrap' }}>
            <span style={{ fontWeight:600,fontSize:14,color:P.text,letterSpacing:'-0.01em' }}>{dispLabel}</span>
            <Tag color={user.color}>{user.role}</Tag>
          </div>
          <p style={{ color:P.textDim,fontSize:11,lineHeight:1.5,margin:0 }}>{user.desc}</p>
        </div>
        {!open&&(
          <div style={{ display:'flex',gap:6,flexShrink:0,flexWrap:'wrap' }}>
            {[
              { label:'Contraseña', tab:'password', icon:<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
              { label:'Nombre',     tab:'name',     icon:<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
            ].map(btn=>(
              <button key={btn.tab} onClick={()=>handleOpen(btn.tab)} style={{ padding:'7px 12px',borderRadius:8,border:`1px solid ${P.border}`,background:'rgba(236,235,224,0.03)',color:P.textSub,fontSize:11,fontWeight:500,cursor:'pointer',transition:'all 0.13s ease',display:'flex',alignItems:'center',gap:5 }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=user.color+'50';e.currentTarget.style.color=user.color;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=P.border;e.currentTarget.style.color=P.textSub;}}>
                {btn.icon}{btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {open&&(
        <div style={{ padding:'0 20px 20px',animation:'fadeUp 0.20s cubic-bezier(0.16,1,0.3,1) both' }}>
          <OrangeBar/>
          <div style={{ height:12 }}/>
          {/* Tab switcher */}
          <div style={{ display:'flex',gap:3,padding:'3px',background:P.surface2,borderRadius:8,marginBottom:16,border:`1px solid ${P.border}` }}>
            {[{id:'password',label:'🔒 Contraseña'},{id:'name',label:'✏️ Nombre'}].map(t=>(
              <button key={t.id} onClick={()=>switchTab(t.id)} style={{ flex:1,padding:'7px 0',borderRadius:6,border:'none',cursor:'pointer',fontSize:11,fontWeight:500,transition:'all 0.14s ease',background:activeTab===t.id?'rgba(236,235,224,0.07)':'transparent',color:activeTab===t.id?P.text:P.textDim }}>{t.label}</button>
            ))}
          </div>
          <div style={{ display:'flex',flexDirection:'column',gap:9 }}>
            {activeTab==='password'&&(<>
              <div style={{ position:'relative' }}>
                <input ref={pwRef} type={showPw?'text':'password'} placeholder="Nueva contraseña (mín. 6 caracteres)" value={pw} onChange={e=>{setPw(e.target.value);setStatus(null);}} style={fieldStyle} onFocus={e=>e.target.style.borderColor='rgba(251,103,11,0.35)'} onBlur={e=>e.target.style.borderColor=P.border}/>
                <button onClick={()=>setShowPw(s=>!s)} style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:P.textDim,padding:2 }}><EyeIcon open={showPw}/></button>
              </div>
              {pw&&(<div style={{ display:'flex',alignItems:'center',gap:8 }}><div style={{ flex:1,height:3,background:'rgba(236,235,224,0.05)',borderRadius:2,overflow:'hidden' }}><div style={{ height:'100%',width:`${(strength.score/5)*100}%`,background:strength.color,borderRadius:2,transition:'width 0.3s ease,background 0.3s ease' }}/></div><span style={{ color:strength.color,fontSize:10,fontWeight:500,minWidth:62,textAlign:'right' }}>{strength.label}</span></div>)}
              <div style={{ position:'relative' }}>
                <input type={showCf?'text':'password'} placeholder="Confirmar contraseña" value={confirm} onChange={e=>{setConfirm(e.target.value);setStatus(null);}} style={{ ...fieldStyle,borderColor:mismatch?P.gray+'80':match?P.orange+'50':P.border }}/>
                <button onClick={()=>setShowCf(s=>!s)} style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:P.textDim,padding:2 }}><EyeIcon open={showCf}/></button>
                {match&&<div style={{ position:'absolute',right:36,top:'50%',transform:'translateY(-50%)' }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={P.orange} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>}
              </div>
              {mismatch&&<p style={{ color:P.grayMid,fontSize:11,margin:0 }}>Las contraseñas no coinciden</p>}
              {pw.length>0&&pw.length<6&&<p style={{ color:P.grayLight,fontSize:11,margin:0 }}>Mínimo 6 caracteres</p>}
            </>)}
            {activeTab==='name'&&(<>
              <input ref={nameRef} type="text" placeholder={`Nombre actual: ${dispLabel}`} value={newName} onChange={e=>{setNewName(e.target.value);setStatus(null);}} maxLength={40} style={{ ...fieldStyle,paddingRight:14 }} onFocus={e=>e.target.style.borderColor='rgba(251,103,11,0.35)'} onBlur={e=>e.target.style.borderColor=P.border}/>
              {newName.trim().length>0&&newName.trim().length<2&&<p style={{ color:P.grayLight,fontSize:11,margin:0 }}>Mínimo 2 caracteres</p>}
              <p style={{ color:P.textDim,fontSize:10,margin:0,lineHeight:1.5 }}>Cambia el nombre visible en el badge. No afecta contraseña ni rol.</p>
            </>)}
            {status&&(
              <div style={{ padding:'10px 14px',borderRadius:8,fontSize:11,
                background:status==='ok'?P.okDim:P.errDim,
                border:`1px solid ${status==='ok'?P.orange+'30':P.gray+'30'}`,
                color:status==='ok'?P.orange:P.grayMid,
                display:'flex',alignItems:'center',gap:8 }}>
                {status==='ok'
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
                {msg}
              </div>
            )}
            <div style={{ display:'flex',gap:8,marginTop:2 }}>
              <button onClick={activeTab==='password'?handleSavePassword:handleSaveName} disabled={activeTab==='password'?!canSavePw:!canSaveName}
                style={{ flex:1,padding:'10px 0',borderRadius:8,border:'none',cursor:(activeTab==='password'?canSavePw:canSaveName)?'pointer':'not-allowed',
                  background:(activeTab==='password'?canSavePw:canSaveName)?P.orange:'rgba(236,235,224,0.04)',
                  color:(activeTab==='password'?canSavePw:canSaveName)?'#fff':P.textDim,
                  fontSize:12,fontWeight:600,transition:'all 0.14s ease',display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
                {loading?<><div style={{ width:12,height:12,borderRadius:'50%',border:'1.5px solid rgba(255,255,255,0.2)',borderTop:'1.5px solid #fff',animation:'spin 0.65s linear infinite' }}/>Guardando...</>:activeTab==='password'?'Guardar contraseña':'Guardar nombre'}
              </button>
              <button onClick={handleCancel} style={{ padding:'10px 16px',borderRadius:8,border:`1px solid ${P.border}`,background:'transparent',color:P.textSub,fontSize:12,fontWeight:500,cursor:'pointer',transition:'all 0.14s ease' }} onMouseEnter={e=>e.currentTarget.style.color=P.text} onMouseLeave={e=>e.currentTarget.style.color=P.textSub}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UsersTab() {
  return (
    <div style={{ animation:'fadeUp 0.22s ease both' }}>
      <div style={{ marginBottom:16,padding:'14px 18px',background:P.surface,border:`1px solid ${P.border}`,borderRadius:10,display:'flex',alignItems:'center',gap:14 }}>
        <div style={{ width:36,height:36,borderRadius:8,background:P.okDim,border:`1px solid ${P.orange}20`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={P.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <div>
          <p style={{ fontWeight:600,fontSize:13,color:P.text,margin:'0 0 3px',letterSpacing:'-0.01em' }}>Gestión de accesos</p>
          <p style={{ fontSize:11,color:P.textDim,margin:0,lineHeight:1.5 }}>Modifica contraseña o nombre de cada usuario. Cambios aplicados inmediatamente en Turso.</p>
        </div>
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
        {SYSTEM_USERS.map(u=><UserCard key={u.id} user={u}/>)}
      </div>
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
const RobotIcon = ({ size=36 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="rg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={P.orange}/>
        <stop offset="100%" stopColor={P.orangeDark}/>
      </linearGradient>
    </defs>
    <line x1="20" y1="35" x2="15" y2="20" stroke={P.orange} strokeWidth="4" strokeLinecap="round"/>
    <circle cx="15" cy="20" r="4" fill={P.orange}/>
    <line x1="80" y1="35" x2="85" y2="20" stroke={P.orange} strokeWidth="4" strokeLinecap="round"/>
    <circle cx="85" cy="20" r="4" fill={P.orange}/>
    <circle cx="50" cy="55" r="40" fill="url(#rg)"/>
    <ellipse cx="50" cy="58" rx="32" ry="30" fill={P.surface}/>
    <rect x="25" y="45" width="50" height="22" rx="10" fill={P.orange}/>
    <circle cx="38" cy="56" r="5" fill={P.cream}/>
    <circle cx="62" cy="56" r="5" fill={P.cream}/>
    <ellipse cx="50" cy="78" rx="6" ry="2" fill={P.orangeDark} opacity="0.8"/>
  </svg>
);

function Login({ onLogin }) {
  const [pw,setPw]=useState(''), [err,setErr]=useState(false), [loading,setLoading]=useState(false);
  const [focused,setFocused]=useState(false), [showPw,setShowPw]=useState(false);
  const inputRef=useRef(null), cardRef=useRef(null);
  useEffect(()=>{ setTimeout(()=>inputRef.current?.focus(),260); },[]);
  const shake=()=>{ const el=cardRef.current; if(!el)return; [-7,7,-4,4,-2,2,0].forEach((x,i)=>setTimeout(()=>{el.style.transform=`translateX(${x}px)`;},i*50)); };
  const go=async(e)=>{ e.preventDefault(); setLoading(true); try{ const res=await fetch('/api/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})}); const data=await res.json(); if(data.ok){onLogin(data.role);}else{setErr(true);shake();setTimeout(()=>setErr(false),2500);} }catch{setErr(true);shake();setTimeout(()=>setErr(false),2500);} setLoading(false); };
  return (
    <div ref={cardRef} className="scanline-wrap" style={{ padding:'44px 36px 38px',transition:'transform 0.05s ease' }}>
      {/* Decorative orange lines */}
      <div style={{ position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${P.orange},transparent)`,opacity:0.6 }}/>
      <div style={{ position:'absolute',bottom:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${P.border},transparent)` }}/>
      <div style={{ textAlign:'center',marginBottom:30 }}>
        <div style={{ display:'inline-flex',alignItems:'center',justifyContent:'center',
          width:68,height:68,borderRadius:16,background:P.surface2,
          border:`1px solid ${P.border}`,marginBottom:20,position:'relative' }}>
          <RobotIcon size={46}/>
          <div style={{ position:'absolute',bottom:-4,right:-4,width:14,height:14,borderRadius:'50%',
            background:P.orange,border:`2px solid ${P.surface}`,animation:'pulse 2s infinite' }}/>
        </div>
        <h2 style={{ fontWeight:700,fontSize:20,color:P.text,letterSpacing:'-0.02em',marginBottom:4 }}>Panel Admin</h2>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}>
          <span style={{ display:'inline-block',width:20,height:1,background:`linear-gradient(90deg,transparent,${P.orange})` }}/>
          <span style={{ color:P.textDim,fontSize:11,letterSpacing:'0.06em',textTransform:'uppercase',fontWeight:500 }}>BotGO · Grupo Ortiz</span>
          <span style={{ display:'inline-block',width:20,height:1,background:`linear-gradient(90deg,${P.orange},transparent)` }}/>
        </div>
      </div>
      <form onSubmit={go} style={{ display:'flex',flexDirection:'column',gap:10 }}>
        <div style={{ position:'relative' }}>
          <input ref={inputRef} type={showPw?'text':'password'} value={pw} onChange={e=>setPw(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} placeholder="Contraseña"
            style={{ width:'100%',background:P.surface2,border:`1px solid ${err?P.gray+'70':focused?P.orange+'50':P.border}`,borderRadius:9,padding:'12px 42px 12px 16px',color:P.text,fontSize:13,outline:'none',boxSizing:'border-box',transition:'border-color 0.15s ease',letterSpacing:showPw?'normal':'0.06em' }}/>
          <button type="button" onClick={()=>setShowPw(s=>!s)} style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:P.textDim,padding:2 }}><EyeIcon open={showPw}/></button>
        </div>
        {err&&<div style={{ background:P.errDim,border:`1px solid ${P.gray}30`,borderRadius:7,padding:'8px 12px',color:P.grayLight,fontSize:11 }}>Contraseña incorrecta</div>}
        <button type="submit" disabled={loading||!pw} className="btn-base"
          style={{ background:loading||!pw?'rgba(236,235,224,0.05)':P.orange,
            color:loading||!pw?P.textDim:'#fff',border:'none',borderRadius:9,padding:'12px 0',
            fontSize:13,fontWeight:600,cursor:loading||!pw?'not-allowed':'pointer',transition:'all 0.15s ease',
            boxShadow:!loading&&pw?`0 4px 16px ${P.orange}30`:'none' }}>
          {loading
            ? <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
                <div style={{ width:12,height:12,borderRadius:'50%',border:'1.5px solid rgba(255,255,255,0.2)',borderTop:'1.5px solid #fff',animation:'spin 0.65s linear infinite' }}/>Verificando
              </span>
            : 'Continuar →'}
        </button>
      </form>
    </div>
  );
}

// ── DASH ──────────────────────────────────────────────────────────────────────
function Dash({ onClose, role }) {
  const w=useWindowWidth(), isMobile=w<640, isTablet=w<900;
  const [data,setData]=useState(null), [loading,setLoading]=useState(true);
  const [summary,setSummary]=useState(''), [genAI,setGenAI]=useState(false);
  const [tab,setTab]=useState(role.tabs[0]), [last,setLast]=useState(null);
  const [auto,setAuto]=useState(true), [menuOpen,setMenuOpen]=useState(false);
  const itvRef=useRef(null);
  const [activePresetId,setActivePresetId]=useState('30d');
  const [activePeriod,setActivePeriod]=useState(()=>PERIOD_PRESETS.find(p=>p.id==='30d').getRange());
  const [customFrom,setCustomFrom]=useState(''), [customTo,setCustomTo]=useState('');
  const [leads,setLeads]=useState([]), [leadsLoad,setLeadsLoad]=useState(false), [leadSearch,setLeadSearch]=useState('');

  const isAdmin    = role.canDownload;                          // puede ver stats / descargar
  const isOnlyAdmin = role.canDelete ?? (role.name === 'Admin'); // SOLO Admin puede borrar
  const canSee     = id => role.tabs.includes(id);

  const load=useCallback(async(silent=false,from=null,to=null)=>{
    if(!silent)setLoading(true);
    try{ const body={action:'get'}; if(from)body.from=from; if(to)body.to=to;
      const r=await fetch('/api/analytics',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const j=await r.json(); if(j.ok){setData(j.data);setLast(new Date());}
    }catch(e){console.error(e);}
    if(!silent)setLoading(false);
  },[]);

  const loadLeads=useCallback(async()=>{
    setLeadsLoad(true);
    try{ const r=await fetch('/api/analytics',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'getLeads'})}); const j=await r.json(); if(j.ok)setLeads(j.leads||[]); }catch(e){console.error(e);}
    setLeadsLoad(false);
  },[]);

  useEffect(()=>{
    if(canSee('overview')||canSee('activity')||canSee('products')||canSee('keywords')||canSee('messages')||canSee('ai')){
      const p=PERIOD_PRESETS.find(p=>p.id==='30d'), range=p.getRange();
      load(false,range.from,range.to);
    } else { setLoading(false); }
  },[]);

  useEffect(()=>{ if(tab==='distribuidores')loadLeads(); },[tab]);
  useEffect(()=>{
    clearInterval(itvRef.current);
    if(auto) itvRef.current=setInterval(()=>load(true,activePeriod?.from,activePeriod?.to),10000);
    return()=>clearInterval(itvRef.current);
  },[load,auto,activePeriod]);

  const handlePresetSelect=useCallback(preset=>{
    setActivePresetId(preset.id);
    if(preset.id==='custom')return;
    const range=preset.getRange(); setActivePeriod(range); setCustomFrom(''); setCustomTo('');
    load(false,range?.from,range?.to);
  },[load]);

  const handleApplyCustom=useCallback(()=>{
    if(!customFrom||!customTo)return;
    setActivePeriod({from:customFrom,to:customTo});
    load(false,customFrom,customTo);
  },[customFrom,customTo,load]);

  const reset=async()=>{
    if(!isOnlyAdmin) return;
    if(!confirm('¿Borrar TODAS las estadísticas? Esta acción no se puede deshacer.'))return;
    await fetch('/api/analytics',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'reset'})});
    load(false,activePeriod?.from,activePeriod?.to); setSummary('');
  };

  const doAI=async()=>{
    if(!data)return; setGenAI(true); setSummary('');
    try{
      const tp=Object.entries(data.products||{}).sort(([,a],[,b])=>b-a).slice(0,5).map(([k,v])=>`${k}:${v}`).join(', ');
      const tk=Object.entries(data.keywords||{}).sort(([,a],[,b])=>b-a).slice(0,8).map(([k,v])=>`${k}:${v}`).join(', ');
      const msgs=(data.lastMessages||[]).slice(-20).map(m=>m.user).join(' | ');
      const pl=activePeriod?.from?`${activePeriod.from} → ${activePeriod.to}`:'Todo el historial';
      const prompt=`Eres analista de ventas Grupo Ortiz. Analiza datos del chatbot, resumen ejecutivo en español (máx 180 palabras).\nPeríodo: ${pl}\nSesiones:${data.totalSessions}|Mensajes:${data.totalMessages}|WhatsApp:${data.totalWhatsApp}|PDFs:${data.totalPDFs}\nProductos:${tp||'sin datos'}|Keywords:${tk||'sin datos'}\nIntenciones:Compra=${data.intents?.compra||0},Info=${data.intents?.info||0},PDF=${data.intents?.pdf||0},Empleo=${data.intents?.reclutamiento||0}\nConsultas:${msgs.substring(0,400)||'sin datos'}\nIncluye:comportamiento general,producto estrella,oportunidades,recomendación comercial.`;
      const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:prompt}],language:'es',isVoice:false})});
      const j=await r.json(); setSummary(j.reply||'No se pudo generar.');
    }catch{setSummary('Error al generar el resumen.');} setGenAI(false);
  };

  const prodD=Object.entries(data?.products||{}).map(([label,value])=>({label,value}));
  const kwD=Object.entries(data?.keywords||{}).map(([label,value])=>({label,value}));
  const today=new Date().toISOString().split('T')[0];
  const td=data?.daily?.[today]||{messages:0,sessions:0,wa:0,pdf:0};
  const yest=new Date(); yest.setDate(yest.getDate()-1);
  const yd=data?.daily?.[yest.toISOString().split('T')[0]]||{messages:0,sessions:0,wa:0,pdf:0};
  const leadsHoy=leads.filter(l=>(l.ts||'').startsWith(today)).length;
  const leadsSemana=leads.filter(l=>(Date.now()-new Date(l.ts||0))<7*24*60*60*1000).length;
  const leadsProdCount={}; leads.forEach(l=>{(l.productos||'').split(',').forEach(p=>{const t=p.trim();if(t)leadsProdCount[t]=(leadsProdCount[t]||0)+1;});});
  const leadsProdData=Object.entries(leadsProdCount).map(([label,value])=>({label,value}));

  const periodLabel=(()=>{
    if(activePresetId==='all')return'Todo el historial';
    if(activePresetId==='custom'&&activePeriod?.from)return`${activePeriod.from} – ${activePeriod.to}`;
    return PERIOD_PRESETS.find(p=>p.id===activePresetId)?.label||'';
  })();

  const ALL_TABS=[
    {id:'overview',label:'Resumen'},{id:'activity',label:'Actividad'},{id:'products',label:'Productos'},
    {id:'keywords',label:'Búsquedas'},{id:'messages',label:'Mensajes'},{id:'distribuidores',label:'Distribuidores'},
    {id:'recruitment',label:'Reclutamiento'},{id:'ai',label:'IA'},{id:'users',label:'Usuarios'},
  ];
  const TABS=ALL_TABS.filter(t=>canSee(t.id));

  const CARD={ background:P.surface,border:`1px solid ${P.border}`,borderRadius:10,padding:isMobile?'14px':'20px 22px',marginBottom:10,position:'relative',overflow:'hidden' };
  const ST={ fontWeight:600,fontSize:13,color:P.text,letterSpacing:'-0.01em',marginBottom:16 };

  const roleBadgeColor=role.color||P.orange;
  const currentTabLabel=TABS.find(t=>t.id===tab)?.label||'';

  // Helper: accent top bar on cards
  const CardTopBar = ({color=P.orange}) => <div style={{ position:'absolute',top:0,left:0,right:0,height:'2px',background:`linear-gradient(90deg,${color},transparent)`,opacity:0.3 }}/>;

  return (
    <div className="adash aroot panel-enter"
      style={{ background:P.bg,border:`1px solid ${P.border}`,borderRadius:isMobile?10:14,
        width:'100%',maxWidth:isMobile?'100%':isTablet?'98vw':1160,
        height:isMobile?'100dvh':'90vh',maxHeight:isMobile?'100dvh':'90vh',
        display:'flex',flexDirection:'column',overflowY:'hidden',
        boxShadow:`0 40px 100px rgba(0,0,0,0.95), 0 0 0 1px rgba(251,103,11,0.08)` }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── HEADER ── */}
      <div style={{ padding:isMobile?'10px 12px':'14px 20px',borderBottom:`1px solid ${P.border}`,
        background:P.surface,flexShrink:0,position:'relative' }}>
        <div style={{ position:'absolute',top:0,left:0,right:0,height:2,
          background:`linear-gradient(90deg,${P.orange},${P.orangeWarm},transparent)`,opacity:0.5 }}/>

        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,marginBottom:isAdmin&&!isMobile?12:isAdmin?8:0 }}>
          <div style={{ display:'flex',alignItems:'center',gap:12,minWidth:0 }}>
            {/* Logo badge */}
            <div style={{ width:34,height:34,borderRadius:9,background:P.okDim,border:`1px solid ${P.orange}30`,
              display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
              <RobotIcon size={24}/>
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ display:'flex',alignItems:'center',gap:7,marginBottom:2,flexWrap:'wrap' }}>
                <span style={{ fontWeight:700,fontSize:isMobile?13:14,color:P.text,letterSpacing:'-0.02em' }}>BotGO Admin</span>
                {!isMobile&&<><Tag color={P.orange} size={9}>Grupo Ortiz</Tag></>}
                <Tag color={roleBadgeColor} size={9}>{role.name}</Tag>
              </div>
              {isAdmin&&!isMobile&&(
                <div style={{ display:'flex',alignItems:'center',gap:6 }}>
                  <Dot active={auto}/>
                  <span style={{ color:P.textDim,fontSize:10 }}>
                    {auto?'Live · 10s':'Pausado'}
                    {last&&` · ${last.toLocaleTimeString('es-MX',{timeZone:'America/Mexico_City'})}`}
                  </span>
                  {periodLabel&&<span style={{ padding:'1px 7px',borderRadius:4,background:'rgba(236,235,224,0.04)',border:`1px solid ${P.border}`,color:P.textSub,fontSize:10 }}>{periodLabel}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display:'flex',gap:5,alignItems:'center',flexShrink:0 }}>
            {isAdmin&&!isMobile&&[
              { label:auto?'Pausar':'Live', onClick:()=>setAuto(s=>!s), style:{background:auto?P.okDim:'rgba(236,235,224,0.03)',border:`1px solid ${auto?P.orange+'35':P.border}`,color:auto?P.orange:P.textSub} },
              { label:'↻ Sync',            onClick:()=>load(false,activePeriod?.from,activePeriod?.to), style:{background:'rgba(236,235,224,0.03)',border:`1px solid ${P.border}`,color:P.textSub} },
              ...(isOnlyAdmin ? [{ label:'Reset', onClick:reset, style:{background:'rgba(83,83,83,0.12)',border:`1px solid ${P.gray}25`,color:P.grayLight} }] : []),
            ].map(b=>(
              <button key={b.label} onClick={b.onClick} className="btn-base"
                style={{ padding:'5px 11px',borderRadius:7,fontSize:11,fontWeight:500,cursor:'pointer',...b.style }}>{b.label}</button>
            ))}
            {isMobile&&isAdmin&&(
              <button onClick={()=>load(false,activePeriod?.from,activePeriod?.to)} className="btn-base"
                style={{ padding:'6px 10px',borderRadius:7,border:`1px solid ${P.border}`,background:'rgba(236,235,224,0.03)',color:P.textSub,cursor:'pointer',fontSize:12 }}>↻</button>
            )}
            {isAdmin&&!isMobile&&<DownloadReportButton data={data} periodMeta={{preset:activePresetId,from:activePeriod?.from,to:activePeriod?.to}}/>}
            <button onClick={onClose} style={{ padding:'6px 11px',borderRadius:7,border:`1px solid ${P.border}`,background:'transparent',color:P.textDim,cursor:'pointer',fontSize:13,transition:'color 0.12s ease' }} onMouseEnter={e=>e.currentTarget.style.color=P.text} onMouseLeave={e=>e.currentTarget.style.color=P.textDim}>✕</button>
          </div>
        </div>

        {/* Period selector */}
        {isAdmin&&!isMobile&&(
          <div style={{ display:'flex',alignItems:'center',padding:'6px 10px',background:P.surface2,borderRadius:8,border:`1px solid ${P.border}` }}>
            <PeriodSelector activeId={activePresetId} onSelect={handlePresetSelect} customFrom={customFrom} customTo={customTo} setCustomFrom={setCustomFrom} setCustomTo={setCustomTo} onApplyCustom={handleApplyCustom}/>
          </div>
        )}
        {isAdmin&&isMobile&&(
          <div style={{ marginTop:8 }}>
            <PeriodSelector activeId={activePresetId} onSelect={handlePresetSelect} customFrom={customFrom} customTo={customTo} setCustomFrom={setCustomFrom} setCustomTo={setCustomTo} onApplyCustom={handleApplyCustom}/>
          </div>
        )}
      </div>

      {/* ── TABS ── */}
      {!isMobile ? (
        <div style={{ padding:'0 20px',borderBottom:`1px solid ${P.border}`,display:'flex',gap:2,overflowX:'auto',background:P.surface,flexShrink:0 }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} className={`tab-btn ${tab===t.id?'active':''}`}
              style={{ background:'transparent',color:tab===t.id?P.text:P.textDim,border:'none',padding:'10px 13px',cursor:'pointer',fontSize:12,fontWeight:tab===t.id?600:400,whiteSpace:'nowrap' }}>
              {t.label}
              {t.id==='distribuidores'&&leads.length>0&&<span style={{ marginLeft:5,background:P.okDim,color:P.orange,borderRadius:10,padding:'1px 6px',fontSize:9 }}>{leads.length}</span>}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ padding:'8px 12px',borderBottom:`1px solid ${P.border}`,background:P.surface,flexShrink:0,position:'relative' }}>
          <button onClick={()=>setMenuOpen(s=>!s)} style={{ width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 12px',background:P.surface2,border:`1px solid ${P.border}`,borderRadius:8,color:P.text,fontSize:12,fontWeight:500,cursor:'pointer' }}>
            <span>{currentTabLabel}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform:menuOpen?'rotate(180deg)':'rotate(0)',transition:'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {menuOpen&&(
            <div style={{ position:'absolute',top:'calc(100% + 2px)',left:12,right:12,background:P.surface,border:`1px solid ${P.border}`,borderRadius:8,zIndex:100,overflow:'hidden',boxShadow:`0 8px 30px rgba(0,0,0,0.7)`,animation:'fadeUp 0.14s ease' }}>
              {TABS.map(t=>(
                <button key={t.id} onClick={()=>{setTab(t.id);setMenuOpen(false);}} style={{ width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 14px',background:tab===t.id?'rgba(236,235,224,0.05)':'transparent',border:'none',borderBottom:`1px solid ${P.border2}`,color:tab===t.id?P.text:P.textSub,fontSize:12,fontWeight:tab===t.id?500:400,cursor:'pointer',textAlign:'left' }}>
                  {t.label}
                  {t.id==='distribuidores'&&leads.length>0&&<span style={{ background:P.okDim,color:P.orange,borderRadius:10,padding:'1px 6px',fontSize:9 }}>{leads.length}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── CONTENT ── */}
      <div style={{ flex:1,overflowY:'auto',padding:isMobile?'12px 12px 32px':'18px 20px 32px',background:P.bg }}
        onClick={()=>menuOpen&&setMenuOpen(false)}>

        {loading&&tab!=='distribuidores'&&tab!=='recruitment'&&tab!=='users'&&<Spinner/>}

        {/* OVERVIEW */}
        {!loading&&data&&tab==='overview'&&canSee('overview')&&(
          <div className="tab-content" key="ov">
            <SectionLabel>Acumulado · {periodLabel}</SectionLabel>
            <div style={{ display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(auto-fit,minmax(190px,1fr))',gap:8,marginBottom:14 }}>
              {loading
                ? [0,1,2,3].map(i=><SkeletonCard key={i}/>)
                : <>
                  <StatCard label="Sesiones"  value={data.totalSessions} sub="conversaciones"      color={P.orange}    icon="💬"/>
                  <StatCard label="Mensajes"  value={data.totalMessages} sub="preguntas recibidas" color={P.gray}      icon="📩"/>
                  <StatCard label="WhatsApp"  value={data.totalWhatsApp} sub="leads generados"     color={P.grayLight} icon="🛒"/>
                  <StatCard label="PDFs"      value={data.totalPDFs}     sub="catálogos enviados"  color={P.grayMid}   icon="📄"/>
                </>}
            </div>
            <div style={{ height:1,background:P.border,margin:'14px 0' }}/>
            <SectionLabel>Hoy · {new Date().toLocaleDateString('es-MX',{timeZone:'America/Mexico_City',weekday:'long',day:'numeric',month:'long'})}</SectionLabel>
            <div style={{ display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(auto-fit,minmax(190px,1fr))',gap:8,marginBottom:14 }}>
              <StatCard label="Mensajes hoy"  value={td.messages}  sub={`ayer: ${yd.messages}`}  color={P.orange}    icon="📆" trend={td.messages-yd.messages}/>
              <StatCard label="Sesiones hoy"  value={td.sessions}  sub={`ayer: ${yd.sessions}`}  color={P.gray}      icon="👤" trend={td.sessions-yd.sessions}/>
              <StatCard label="WhatsApp hoy"  value={td.wa||0}     sub={`ayer: ${yd.wa||0}`}     color={P.grayLight} icon="📲" trend={(td.wa||0)-(yd.wa||0)}/>
              <StatCard label="PDFs hoy"      value={td.pdf||0}    sub={`ayer: ${yd.pdf||0}`}    color={P.grayMid}   icon="📋" trend={(td.pdf||0)-(yd.pdf||0)}/>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:isMobile||isTablet?'1fr':'1fr 1fr',gap:10 }}>
              <div className="card-hover" style={CARD}><CardTopBar/><p style={ST}>Distribución de intenciones</p><DonutChart intents={data.intents}/></div>
              <div className="card-hover" style={CARD}><CardTopBar/><p style={ST}>Actividad — últimos 14 días</p><LineChart daily={data.daily}/></div>
            </div>
          </div>
        )}

        {/* ACTIVITY */}
        {!loading&&data&&tab==='activity'&&canSee('activity')&&(
          <div className="tab-content" key="ac">
            <div className="card-hover" style={CARD}>
              <CardTopBar/>
              <p style={ST}>Historial diario</p>
              <div style={{ overflowX:'auto',WebkitOverflowScrolling:'touch' }}>
                <table style={{ width:'100%',borderCollapse:'collapse',fontSize:12,minWidth:isMobile?480:'auto' }}>
                  <thead><tr>{['Fecha','Sesiones','Mensajes','WhatsApp','PDFs','Conv.%'].map(h=>(
                    <th key={h} style={{ color:P.textDim,fontWeight:500,padding:'8px 10px',textAlign:'left',borderBottom:`1px solid ${P.border}`,fontSize:10,textTransform:'uppercase',letterSpacing:'0.07em',background:P.surface2,whiteSpace:'nowrap' }}>{h}</th>
                  ))}</tr></thead>
                  <tbody>
                    {Object.entries(data.daily||{}).sort(([a],[b])=>b.localeCompare(a)).map(([date,v])=>{
                      const conv=v.messages?Math.round(((v.wa||0)/v.messages)*100):0, isToday=date===today;
                      return (
                        <tr key={date} className="row-hover" style={{ background:isToday?`${P.orange}06`:'transparent',borderBottom:`1px solid ${P.border2}` }}>
                          <td style={{ padding:'8px 10px',color:P.text,fontFamily:T.mono,fontSize:11,whiteSpace:'nowrap' }}>{isToday&&<Tag color={P.orange} size={9}>hoy</Tag>} {date}</td>
                          <td className="mono" style={{ padding:'8px 10px',color:P.textSub }}>{v.sessions||0}</td>
                          <td className="mono" style={{ padding:'8px 10px',color:P.text,fontWeight:500 }}>{v.messages||0}</td>
                          <td className="mono" style={{ padding:'8px 10px',color:P.orange }}>{v.wa||0}</td>
                          <td className="mono" style={{ padding:'8px 10px',color:P.grayMid }}>{v.pdf||0}</td>
                          <td style={{ padding:'8px 10px' }}>
                            <span style={{ padding:'2px 6px',borderRadius:4,background:conv>10?P.okDim:conv>0?P.warnDim:'transparent',color:conv>10?P.orange:conv>0?P.grayLight:P.textDim,fontSize:10,fontFamily:T.mono,fontWeight:500 }}>{conv}%</span>
                          </td>
                        </tr>
                      );
                    })}
                    {!Object.keys(data.daily||{}).length&&<tr><td colSpan={6} style={{ color:P.textDim,textAlign:'center',padding:40,fontSize:11 }}>Sin datos</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-hover" style={CARD}>
              <CardTopBar/>
              <p style={ST}>Mensajes por hora del día</p>
              <BarChart data={(data.hourly||Array(24).fill(0)).map((v,i)=>({label:`${String(i).padStart(2,'0')}:00`,value:v}))} color={P.orange} max={24}/>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {!loading&&data&&tab==='products'&&canSee('products')&&(
          <div className="tab-content" key="pr">
            <div className="card-hover" style={CARD}>
              <CardTopBar/>
              <p style={ST}>Productos más consultados</p>
              <BarChart data={prodD} color={P.orange} max={10}/>
              {prodD.length>0&&(()=>{ const top=[...prodD].sort((a,b)=>b.value-a.value)[0]; return (
                <div style={{ marginTop:18,padding:'12px 14px',background:P.surface2,borderRadius:8,border:`1px solid ${P.border}`,borderLeft:`2px solid ${P.orange}`,display:'flex',alignItems:'center',gap:12 }}>
                  <div><span style={{ color:P.textDim,fontSize:10,fontWeight:500,textTransform:'uppercase',letterSpacing:'0.07em' }}>Producto estrella</span>
                  <p style={{ margin:'4px 0 0',fontWeight:600,fontSize:15,color:P.text }}>{top?.label}<span className="mono" style={{ color:P.orange,marginLeft:8,fontWeight:400,fontSize:13 }}>×{top?.value}</span></p></div>
                </div>
              ); })()}
            </div>
          </div>
        )}

        {/* KEYWORDS */}
        {!loading&&data&&tab==='keywords'&&canSee('keywords')&&(
          <div className="tab-content" key="kw" style={{ display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:10 }}>
            <div className="card-hover" style={CARD}><CardTopBar/><p style={ST}>Palabras clave</p><BarChart data={kwD} color={P.orange} max={12}/></div>
            <div className="card-hover" style={CARD}><CardTopBar/><p style={ST}>Productos mencionados</p><BarChart data={prodD} color={P.gray} max={8}/></div>
          </div>
        )}

        {/* MESSAGES */}
        {!loading&&data&&tab==='messages'&&canSee('messages')&&(
          <div className="tab-content" key="ms">
            <div className="card-hover" style={CARD}>
              <CardTopBar/>
              <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,flexWrap:'wrap',gap:8 }}>
                <p style={{ ...ST,marginBottom:0 }}>Consultas en tiempo real</p>
                <Tag color={P.orange}>{data.lastMessages?.length||0} registros</Tag>
              </div>
              <div style={{ display:'flex',flexDirection:'column',gap:3 }}>
                {(data.lastMessages||[]).slice().reverse().map((m,i)=>{
                  const iColor={compra:P.orange,pdf:P.grayLight,reclutamiento:P.gray}, color=iColor[m.intent]||P.border;
                  return (
                    <div key={i} className="row-hover" style={{ padding:'8px 10px',background:P.surface2,borderRadius:7,border:`1px solid ${P.border}`,display:'flex',gap:8,alignItems:'center' }}>
                      <div style={{ width:2,height:28,borderRadius:1,background:color,flexShrink:0 }}/>
                      <div style={{ flexShrink:0,minWidth:46 }}>
                        <div className="mono" style={{ color:P.textSub,fontSize:10 }}>{fmtHora(m.ts)}</div>
                        <div className="mono" style={{ color:P.textDim,fontSize:9 }}>{fmtFecha(m.ts)}</div>
                      </div>
                      <span style={{ color:P.text,fontSize:12,flex:1,lineHeight:1.5,wordBreak:'break-word',minWidth:0 }}>{m.user}</span>
                      {m.prod&&!isMobile&&<Tag color={P.grayMid}>{m.prod}</Tag>}
                      <Tag color={color} size={9}>{m.intent||'otro'}</Tag>
                    </div>
                  );
                })}
                {!(data.lastMessages||[]).length&&<div style={{ textAlign:'center',padding:'44px 0',color:P.textDim,fontSize:12 }}>Sin mensajes registrados</div>}
              </div>
            </div>
          </div>
        )}

        {/* DISTRIBUIDORES */}
        {tab==='distribuidores'&&canSee('distribuidores')&&(
          <div className="tab-content" key="dist">
            <div style={{ display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(auto-fit,minmax(170px,1fr))',gap:8,marginBottom:14 }}>
              <StatCard label="Total"        value={leads.length}  sub="solicitudes acumuladas" color={P.orange}    icon="🤝"/>
              <StatCard label="Esta semana"  value={leadsSemana}   sub="últimos 7 días"          color={P.gray}      icon="📅"/>
              <StatCard label="Hoy"          value={leadsHoy}      sub="nuevas hoy"              color={P.grayLight} icon="⚡"/>
            </div>
            {leads.length>=2&&(
              <div className="card-hover" style={{ ...CARD,marginBottom:10 }}>
                <CardTopBar/>
                <p style={ST}>Tendencia — últimos 14 días</p>
                <LeadsLineChart leads={leads}/>
              </div>
            )}
            {leadsProdData.length>0&&(
              <div className="card-hover" style={{ ...CARD,marginBottom:10 }}>
                <CardTopBar/>
                <p style={ST}>Productos de interés</p>
                <BarChart data={leadsProdData} color={P.orange} max={8}/>
              </div>
            )}
            <div className="card-hover" style={CARD}>
              <CardTopBar/>
              <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,flexWrap:'wrap',gap:8 }}>
                <p style={{ ...ST,marginBottom:0 }}>Registro de solicitudes</p>
                <div style={{ display:'flex',gap:6,alignItems:'center',flexWrap:'wrap' }}>
                  <Tag color={P.orange}>{leads.length} registros</Tag>
                  <button onClick={loadLeads} className="btn-base" style={{ padding:'5px 10px',borderRadius:7,fontSize:11,fontWeight:500,background:'rgba(236,235,224,0.03)',border:`1px solid ${P.border}`,color:P.textSub,cursor:'pointer' }}>↻</button>
                  {isOnlyAdmin&&<button onClick={async()=>{ if(!confirm('¿Borrar todos los leads?'))return; await fetch('/api/analytics',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'resetLeads'})}); setLeads([]); }} className="btn-base" style={{ padding:'5px 10px',borderRadius:7,fontSize:11,fontWeight:500,background:P.errDim,border:`1px solid ${P.gray}25`,color:P.grayLight,cursor:'pointer' }}>Borrar</button>}
                </div>
              </div>
              <input type="text" placeholder="Buscar por nombre, empresa, WhatsApp o email..." value={leadSearch} onChange={e=>setLeadSearch(e.target.value)}
                style={{ width:'100%',marginBottom:12,background:P.surface2,border:`1px solid ${P.border}`,borderRadius:8,padding:'9px 14px',color:P.text,fontSize:12,outline:'none' }}
                onFocus={e=>e.target.style.borderColor=P.orange+'45'} onBlur={e=>e.target.style.borderColor=P.border}/>
              {leadsLoad?<Spinner/>:(
                <div style={{ overflowX:'auto',WebkitOverflowScrolling:'touch' }}>
                  <table style={{ width:'100%',borderCollapse:'collapse',fontSize:12,minWidth:isMobile?560:'auto' }}>
                    <thead><tr>{['Fecha','Nombre','Empresa','WhatsApp','Email','Productos'].map(h=>(
                      <th key={h} style={{ color:P.textDim,fontWeight:500,padding:'8px 10px',textAlign:'left',borderBottom:`1px solid ${P.border}`,fontSize:10,textTransform:'uppercase',letterSpacing:'0.07em',background:P.surface2,whiteSpace:'nowrap' }}>{h}</th>
                    ))}</tr></thead>
                    <tbody>
                      {leads.filter(l=>{ const q=leadSearch.toLowerCase(); return !q||(l.nombre||'').toLowerCase().includes(q)||(l.empresa||'').toLowerCase().includes(q)||(l.email||'').toLowerCase().includes(q)||(l.whatsapp||'').includes(q); }).map((l,i)=>(
                        <tr key={i} className="row-hover" style={{ borderBottom:`1px solid ${P.border2}` }}>
                          <td className="mono" style={{ padding:'8px 10px',color:P.textDim,fontSize:10,whiteSpace:'nowrap' }}>{fmtFechaHora(l.ts)}</td>
                          <td style={{ padding:'8px 10px',color:P.text,fontWeight:500,whiteSpace:'nowrap' }}>{l.nombre}</td>
                          <td style={{ padding:'8px 10px',color:P.textSub,whiteSpace:'nowrap' }}>{l.empresa}</td>
                          <td style={{ padding:'8px 10px' }}><a href={`https://wa.me/52${(l.whatsapp||'').replace(/\D/g,'')}`} target="_blank" style={{ color:P.orange,fontFamily:T.mono,fontSize:11,textDecoration:'none',display:'flex',alignItems:'center',gap:4,whiteSpace:'nowrap' }}>📲 {l.whatsapp}</a></td>
                          <td className="mono" style={{ padding:'8px 10px',color:P.textSub,fontSize:11,whiteSpace:'nowrap' }}>{l.email}</td>
                          <td style={{ padding:'8px 10px' }}>{(l.productos||'').split(',').filter(Boolean).map((pr,j)=><Tag key={j} color={P.orange} size={9}>{pr.trim()}</Tag>)}{!(l.productos||'').trim()&&<span style={{ color:P.textDim,fontSize:10 }}>—</span>}</td>
                        </tr>
                      ))}
                      {!leads.length&&!leadsLoad&&<tr><td colSpan={6} style={{ color:P.textDim,textAlign:'center',padding:40,fontSize:12 }}>Sin solicitudes registradas</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RECRUITMENT */}
        {tab==='recruitment'&&canSee('recruitment')&&<div className="tab-content" key="rc"><RecruitmentTab canDelete={isOnlyAdmin}/></div>}

        {/* AI */}
        {!loading&&data&&tab==='ai'&&canSee('ai')&&(
          <div className="tab-content" key="ai">
            <div className="card-hover" style={CARD}>
              <CardTopBar/>
              <p style={ST}>Análisis Inteligente · BotGO</p>
              <p style={{ color:P.textDim,fontSize:12,marginBottom:16,lineHeight:1.7,maxWidth:520 }}>Genera un resumen ejecutivo con patrones de comportamiento, productos destacados y recomendaciones comerciales.</p>
              <button onClick={doAI} disabled={genAI} className="btn-base"
                style={{ background:genAI?'rgba(236,235,224,0.04)':P.orange,color:genAI?P.textDim:'#fff',border:'none',borderRadius:8,padding:'10px 22px',fontSize:12,fontWeight:600,cursor:genAI?'not-allowed':'pointer',display:'flex',alignItems:'center',gap:8,boxShadow:!genAI?`0 4px 14px ${P.orange}30`:'none' }}>
                {genAI?<><div style={{ width:12,height:12,borderRadius:'50%',border:'1.5px solid rgba(255,255,255,0.2)',borderTop:'1.5px solid #fff',animation:'spin 0.65s linear infinite' }}/>Analizando...</>:<>✦ Generar análisis</>}
              </button>
              {summary&&(
                <div style={{ marginTop:16,padding:'16px 18px',background:P.surface2,border:`1px solid ${P.border}`,borderLeft:`2px solid ${P.orange}`,borderRadius:8 }}>
                  <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:10 }}>
                    <Dot active color={P.orange}/>
                    <span style={{ color:P.textDim,fontSize:10,fontWeight:500,textTransform:'uppercase',letterSpacing:'0.07em' }}>Resumen ejecutivo · {periodLabel}</span>
                  </div>
                  <p style={{ color:P.text,fontSize:13,lineHeight:1.75,whiteSpace:'pre-wrap' }}>{summary}</p>
                </div>
              )}
              <div style={{ height:1,background:P.border,margin:'18px 0' }}/>
              <p style={{ ...ST,marginBottom:10 }}>Últimas 20 consultas</p>
              <div style={{ display:'flex',flexDirection:'column',gap:4 }}>
                {(data.lastMessages||[]).slice(-20).reverse().map((m,i)=>{
                  const iColor={compra:P.orange,pdf:P.grayLight}, color=iColor[m.intent]||P.border;
                  return (
                    <div key={i} style={{ padding:'8px 10px',background:P.surface2,borderRadius:6,border:`1px solid ${P.border}`,display:'flex',gap:8,alignItems:'center' }}>
                      <span className="mono" style={{ color:P.textDim,fontSize:9,flexShrink:0 }}>{fmtFecha(m.ts)}</span>
                      <span style={{ color:P.text,fontSize:12,flex:1,wordBreak:'break-word',minWidth:0 }}>{m.user}</span>
                      <Tag color={color} size={9}>{m.intent||'otro'}</Tag>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab==='users'&&canSee('users')&&<div className="tab-content" key="us"><UsersTab/></div>}
      </div>
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [visible,setVisible]=useState(false), [role,setRole]=useState(null);

  useEffect(()=>{
    const fn=e=>{
      if((e.ctrlKey||e.metaKey)&&e.key==='9'){ e.preventDefault(); setVisible(s=>!s); }
      if(e.key==='Escape'){ setVisible(false); setRole(null); }
    };
    window.addEventListener('keydown',fn);
    return()=>window.removeEventListener('keydown',fn);
  },[]);

  return (
    <div className="aroot">
      <style>{GLOBAL_CSS}</style>
      {visible&&(
        <div className="admin-overlay visible" onClick={e=>{ if(e.target===e.currentTarget){setVisible(false);setRole(null);} }}>
          {!role
            ? <div style={{ background:P.surface,border:`1px solid ${P.border}`,borderRadius:16,width:'94vw',maxWidth:390,
                boxShadow:`0 40px 100px rgba(0,0,0,0.95), 0 0 0 1px ${P.orange}12`,
                position:'relative',overflow:'hidden' }}>
                <Login onLogin={r=>setRole(r)}/>
              </div>
            : <Dash onClose={()=>{setVisible(false);setRole(null);}} role={role}/>
          }
        </div>
      )}
    </div>
  );
}