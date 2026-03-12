// src/components/AdminPanel.jsx
// Ctrl + 9  →  abre el panel
// Autenticación via Turso DB (tabla users) — sin contraseñas en el frontend

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DownloadReportButton } from './ReportGenerator';
import RecruitmentTab from './RecruitmentTab';

// ── Logo del Bot ──────────────────────────────────────────────────────────────
const RobotIcon = ({ size = 36, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={style}>
    <defs>
      <linearGradient id="adminHeadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F24F13"/>
        <stop offset="100%" stopColor="#F24F13"/>
      </linearGradient>
    </defs>
    <line x1="20" y1="35" x2="15" y2="20" stroke="#F24F13" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="15" cy="20" r="4" fill="#F24F13"/>
    <line x1="80" y1="35" x2="85" y2="20" stroke="#F24F13" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="85" cy="20" r="4" fill="#F24F13"/>
    <circle cx="50" cy="55" r="40" fill="url(#adminHeadGrad)"/>
    <ellipse cx="50" cy="58" rx="32" ry="30" fill="#FFF5E6"/>
    <rect x="25" y="45" width="50" height="22" rx="10" fill="#F24F13"/>
    <circle cx="38" cy="56" r="5" fill="#FFD700"/>
    <circle cx="62" cy="56" r="5" fill="#FFD700"/>
    <ellipse cx="50" cy="78" rx="6" ry="2" fill="#D35400" opacity="0.8"/>
  </svg>
);

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .admin-overlay {
    position: fixed; inset: 0; z-index: 999990;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(24px) saturate(120%);
    -webkit-backdrop-filter: blur(24px) saturate(120%);
    display: flex; align-items: center; justify-content: center;
    padding: 8px; opacity: 0; transition: opacity 0.3s ease;
  }
  .admin-overlay.visible { opacity: 1; }

  .admin-panel-root,
  .admin-panel-root * { font-family: 'DM Sans', system-ui, -apple-system, sans-serif !important; }
  .admin-panel-root input,
  .admin-panel-root button,
  .admin-panel-root select,
  .admin-panel-root textarea { font-family: 'DM Sans', system-ui, -apple-system, sans-serif !important; }
  .admin-panel-root .stat-num,
  .admin-panel-root .mono,
  .admin-panel-root code,
  .admin-panel-root pre { font-family: 'DM Mono', 'Fira Mono', monospace !important; }

  .admin-dash { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.06) transparent; }
  .admin-dash::-webkit-scrollbar { width: 3px; }
  .admin-dash::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 2px; }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes barGrow { from { width: 0; } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  .panel-enter { animation: fadeUp 0.32s cubic-bezier(0.16,1,0.3,1) both; }
  .card-enter  { animation: fadeUp 0.28s cubic-bezier(0.16,1,0.3,1) both; }
  .card-enter:nth-child(1) { animation-delay: 0.03s; }
  .card-enter:nth-child(2) { animation-delay: 0.07s; }
  .card-enter:nth-child(3) { animation-delay: 0.11s; }
  .card-enter:nth-child(4) { animation-delay: 0.15s; }
  .bar-fill { animation: barGrow 0.7s cubic-bezier(0.16,1,0.3,1) both; }
  .tab-content { animation: fadeUp 0.22s ease both; }

  .card-hover { transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease; }
  .card-hover:hover {
    background: rgba(255,255,255,0.025) !important;
    border-color: rgba(255,255,255,0.1) !important;
    transform: translateY(-1px);
  }

  .tab-btn { position: relative; transition: color 0.15s ease, background 0.15s ease; border-radius: 6px; }
  .tab-btn:hover { background: rgba(255,255,255,0.04); }
  .tab-btn.active { background: rgba(255,255,255,0.06); }
  .tab-btn.active::after {
    content: ''; position: absolute; bottom: -1px; left: 12px; right: 12px;
    height: 1.5px; background: #fff; border-radius: 2px;
  }

  .btn-base { transition: opacity 0.15s ease, background 0.15s ease, transform 0.12s ease; cursor: pointer; }
  .btn-base:hover:not(:disabled) { opacity: 0.85; }
  .btn-base:active:not(:disabled) { transform: scale(0.97); }

  .row-hover { transition: background 0.1s ease; }
  .row-hover:hover { background: rgba(255,255,255,0.03) !important; }

  .period-btn {
    padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 500;
    cursor: pointer; transition: all 0.13s ease; white-space: nowrap;
    font-family: 'DM Sans', system-ui, sans-serif; border: 1px solid transparent;
    background: transparent; color: rgba(255,255,255,0.35); letter-spacing: 0.01em;
  }
  .period-btn:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.05); }
  .period-btn.active { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.12); color: rgba(255,255,255,0.9); }

  .period-date-input {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px; padding: 4px 8px; color: rgba(255,255,255,0.8);
    font-size: 11px; font-family: 'DM Sans', system-ui, sans-serif;
    outline: none; cursor: pointer; transition: border-color 0.13s ease; color-scheme: dark;
  }
  .period-date-input:focus { border-color: rgba(255,255,255,0.25); }

  .period-apply {
    padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 600;
    cursor: pointer; background: rgba(255,255,255,0.9); color: #0a0a0a; border: none;
    transition: all 0.13s ease; font-family: 'DM Sans', system-ui, sans-serif;
  }
  .period-apply:disabled { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.2); cursor: not-allowed; }
  .period-apply:hover:not(:disabled) { background: #fff; }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px #0d0d0d inset !important;
    -webkit-text-fill-color: rgba(255,255,255,0.9) !important;
  }
  .stat-num { font-family: 'DM Mono', monospace; font-weight: 500; letter-spacing: -0.03em; line-height: 1; }

  /* ── Responsive helpers ── */
  @media (max-width: 640px) {
    .resp-hide-sm { display: none !important; }
    .resp-stack   { flex-direction: column !important; }
    .resp-full    { width: 100% !important; max-width: 100% !important; }
    .resp-pad-sm  { padding: 12px !important; }
    .resp-grid-1  { grid-template-columns: 1fr !important; }
    .resp-text-sm { font-size: 11px !important; }
    .resp-gap-sm  { gap: 8px !important; }
    .stat-num     { font-size: 28px !important; }
  }
  @media (max-width: 480px) {
    .resp-hide-xs { display: none !important; }
    .resp-pad-xs  { padding: 10px !important; }
    .stat-num     { font-size: 24px !important; }
  }
`;

// ── Paleta ────────────────────────────────────────────────────────────────────
const C = {
  bg:         '#080808',
  surface:    '#111111',
  surface2:   '#161616',
  border:     'rgba(255,255,255,0.07)',
  border2:    'rgba(255,255,255,0.04)',
  text:       'rgba(255,255,255,0.92)',
  textSub:    'rgba(255,255,255,0.45)',
  textDim:    'rgba(255,255,255,0.22)',
  orange:     '#E8521A',
  orangeDim:  'rgba(232,82,26,0.10)',
  orangeGlow: 'rgba(232,82,26,0.15)',
  green:      '#22C55E',
  greenDim:   'rgba(34,197,94,0.08)',
  blue:       '#3B82F6',
  blueDim:    'rgba(59,130,246,0.08)',
  purple:     '#8B5CF6',
  purpleDim:  'rgba(139,92,246,0.08)',
  amber:      '#F59E0B',
  amberDim:   'rgba(245,158,11,0.08)',
  red:        '#EF4444',
  redDim:     'rgba(239,68,68,0.08)',
};

const T = {
  sans: "'DM Sans', system-ui, sans-serif",
  mono: "'DM Mono', monospace",
};

// ── useWindowWidth ────────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w;
}

// ── Date helpers ──────────────────────────────────────────────────────────────
function toYMD(d) { return d.toISOString().split('T')[0]; }
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }

const PERIOD_PRESETS = [
  { id:'today', label:'Hoy',      getRange: () => { const t=toYMD(new Date()); return {from:t,to:t}; } },
  { id:'7d',    label:'7D',       getRange: () => ({ from:toYMD(addDays(new Date(),-6)), to:toYMD(new Date()) }) },
  { id:'30d',   label:'30D',      getRange: () => ({ from:toYMD(addDays(new Date(),-29)), to:toYMD(new Date()) }) },
  { id:'month', label:'Mes',      getRange: () => ({ from:toYMD(new Date(new Date().getFullYear(),new Date().getMonth(),1)), to:toYMD(new Date()) }) },
  { id:'all',   label:'Todo',     getRange: () => ({ from:null, to:null }) },
  { id:'custom',label:'Rango',    getRange: () => null },
];

// ── Period Selector ───────────────────────────────────────────────────────────
function PeriodSelector({ activeId, onSelect, customFrom, customTo, setCustomFrom, setCustomTo, onApplyCustom }) {
  const w = useWindowWidth();
  const isMobile = w < 540;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:2, flexWrap:'wrap', rowGap:6 }}>
      {!isMobile && <span style={{ color:C.textDim, fontSize:10, fontFamily:T.sans, marginRight:6, letterSpacing:'0.06em', textTransform:'uppercase', fontWeight:500 }}>Período</span>}
      {PERIOD_PRESETS.filter(p => p.id !== 'custom').map(p => (
        <button key={p.id} className={`period-btn ${activeId===p.id?'active':''}`} onClick={() => onSelect(p)}>{p.label}</button>
      ))}
      <div style={{ width:1, height:14, background:C.border, margin:'0 2px' }}/>
      <button className={`period-btn ${activeId==='custom'?'active':''}`} onClick={() => onSelect(PERIOD_PRESETS.find(p=>p.id==='custom'))}>
        {isMobile ? '📅' : 'Personalizado'}
      </button>
      {activeId==='custom' && (
        <div style={{ display:'flex', alignItems:'center', gap:6, animation:'fadeIn 0.18s ease', flexWrap:'wrap', rowGap:4 }}>
          <input type="date" className="period-date-input" value={customFrom} max={customTo||toYMD(new Date())} onChange={e=>setCustomFrom(e.target.value)}/>
          <span style={{ color:C.textDim, fontSize:10 }}>–</span>
          <input type="date" className="period-date-input" value={customTo} min={customFrom} max={toYMD(new Date())} onChange={e=>setCustomTo(e.target.value)}/>
          <button className="period-apply" disabled={!customFrom||!customTo} onClick={onApplyCustom}>OK</button>
        </div>
      )}
    </div>
  );
}

// ── Small components ──────────────────────────────────────────────────────────
function Dot({ active, color = C.green }) {
  return (
    <span style={{
      width:5, height:5, borderRadius:'50%',
      background: active ? color : C.textDim,
      display:'inline-block', flexShrink:0,
      boxShadow: active ? `0 0 5px ${color}` : 'none',
      animation: active ? 'pulse 2.4s infinite' : 'none',
    }}/>
  );
}

function Tag({ children, color = C.orange }) {
  return (
    <span style={{
      display:'inline-flex', alignItems:'center',
      padding:'2px 8px', borderRadius:4,
      fontSize:10, fontWeight:500, letterSpacing:'0.04em',
      background: color + '15', color,
      border: `1px solid ${color}22`,
      fontFamily:T.sans, lineHeight:1.5,
    }}>{children}</span>
  );
}

function Spinner() {
  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', padding:'80px 0', flexDirection:'column', gap:12 }}>
      <div style={{ width:24, height:24, borderRadius:'50%', border:`1.5px solid ${C.border}`, borderTop:`1.5px solid ${C.textSub}`, animation:'spin 0.7s linear infinite' }}/>
      <span style={{ color:C.textDim, fontSize:11, fontFamily:T.sans, letterSpacing:'0.06em' }}>Cargando</span>
      <style>{GLOBAL_CSS}</style>
    </div>
  );
}

// ── Bar Chart ─────────────────────────────────────────────────────────────────
function BarChart({ data = [], color = C.orange, max = 8 }) {
  const sorted = [...data].sort((a,b) => b.value - a.value).slice(0, max);
  const mv = sorted[0]?.value || 1;
  if (!sorted.length) return (
    <div style={{ textAlign:'center', padding:'40px 0', color:C.textDim, fontSize:11, fontFamily:T.sans }}>Sin datos disponibles</div>
  );
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
      {sorted.map((item, i) => {
        const pct = Math.round((item.value / mv) * 100);
        return (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0' }}>
            <span style={{ color:C.textDim, fontSize:10, fontFamily:T.mono, width:14, textAlign:'right', flexShrink:0 }}>{i+1}</span>
            <span style={{ color:C.textSub, fontSize:11, width:90, textAlign:'right', flexShrink:0, overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis', fontFamily:T.sans }}>{item.label}</span>
            <div style={{ flex:1, position:'relative', height:5, background:'rgba(255,255,255,0.04)', borderRadius:3, overflow:'hidden' }}>
              <div className="bar-fill" style={{ width:`${pct}%`, height:'100%', borderRadius:3, background: i===0 ? color : `linear-gradient(90deg,${color}55,${color}88)`, animationDelay:`${i*0.05}s` }}/>
            </div>
            <span style={{ color:C.text, fontSize:11, fontFamily:T.mono, fontWeight:500, width:28, textAlign:'right', flexShrink:0 }}>{item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Line Chart ────────────────────────────────────────────────────────────────
function LineChart({ daily }) {
  const entries = Object.entries(daily || {}).sort(([a],[b]) => a.localeCompare(b)).slice(-14);
  if (entries.length < 2) return (
    <div style={{ textAlign:'center', padding:'40px 0', color:C.textDim, fontSize:11, fontFamily:T.sans }}>Se necesitan al menos 2 días de datos</div>
  );
  const vals = entries.map(([,v]) => v.messages || 0);
  const mv = Math.max(...vals, 1), mn = Math.min(...vals);
  const W = 440, H = 80, step = W / (vals.length - 1);
  const pts = vals.map((v, i) => ({ x: i*step, y: H - ((v-mn)/Math.max(mv-mn,1))*(H-16) - 8 }));
  const pathD = pts.map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaD = `${pathD} L${W},${H+4} L0,${H+4} Z`;
  return (
    <svg width="100%" viewBox={`-4 -4 ${W+8} ${H+48}`} style={{ display:'block', overflow:'visible' }}>
      <defs>
        <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.orange} stopOpacity="0.15"/>
          <stop offset="100%" stopColor={C.orange} stopOpacity="0"/>
        </linearGradient>
        <filter id="line-glow">
          <feGaussianBlur stdDeviation="1.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {[0.25,0.5,0.75,1].map(p => (
        <line key={p} x1={0} y1={H-p*(H-16)-8} x2={W} y2={H-p*(H-16)-8} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
      ))}
      <path d={areaD} fill="url(#area-grad)"/>
      <path d={pathD} fill="none" stroke={C.orange} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" filter="url(#line-glow)"/>
      {pts.map((p,i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="2.5" fill={C.bg} stroke={C.orange} strokeWidth="1.5"/>
          <text x={p.x} y={H+32} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="DM Sans, system-ui">{entries[i][0].slice(5)}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Donut Chart ───────────────────────────────────────────────────────────────
function DonutChart({ intents }) {
  const COLORS = { compra:C.green, pdf:C.blue, info:C.amber, reclutamiento:C.purple, otro:'rgba(255,255,255,0.15)' };
  const LABELS = { compra:'Compra', pdf:'PDF', info:'Info', reclutamiento:'Empleo', otro:'Otro' };
  const ents = Object.entries(intents || {}).filter(([,v]) => v > 0);
  const total = ents.reduce((s,[,v]) => s+v, 0) || 1;
  let cumul = 0;
  const R=42, CX=54, CY=54;
  const polar = (pct) => { const a=pct*2*Math.PI-Math.PI/2; return [CX+R*Math.cos(a), CY+R*Math.sin(a)]; };
  const slices = ents.map(([key,val]) => { const pct=val/total, start=cumul; cumul+=pct; return {key,val,pct,start}; });
  return (
    <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
      <svg width={108} height={108} viewBox="0 0 108 108" style={{ flexShrink:0 }}>
        {slices.length===0
          ? <circle cx={CX} cy={CY} r={R} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          : slices.map(({key,pct,start}) => {
              const [x1,y1]=polar(start+0.004), [x2,y2]=polar(start+pct-0.004);
              return <path key={key} d={`M${CX},${CY} L${x1},${y1} A${R},${R} 0 ${pct>.5?1:0},1 ${x2},${y2} Z`} fill={COLORS[key]||C.textSub} opacity="0.85"/>;
            })
        }
        <circle cx={CX} cy={CY} r={30} fill={C.bg}/>
        <circle cx={CX} cy={CY} r={30} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        <text x={CX} y={CY-7} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8.5" fontFamily="DM Sans, system-ui" letterSpacing="0.08em">TOTAL</text>
        <text x={CX} y={CY+13} textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="22" fontFamily="DM Mono, monospace" fontWeight="500">{total}</text>
      </svg>
      <div style={{ display:'flex', flexDirection:'column', gap:7, flex:1, minWidth:120 }}>
        {ents.map(([key,val]) => {
          const color=COLORS[key]||C.textSub, pct=Math.round((val/total)*100);
          return (
            <div key={key} style={{ display:'flex', alignItems:'center', gap:9 }}>
              <div style={{ width:3, height:3, borderRadius:'50%', background:color, flexShrink:0 }}/>
              <span style={{ color:C.textSub, fontSize:11, flex:1, fontFamily:T.sans }}>{LABELS[key]||key}</span>
              <span style={{ color:C.text, fontSize:11, fontFamily:T.mono, fontWeight:500 }}>{val}</span>
              <span style={{ color:C.textDim, fontSize:10, fontFamily:T.mono, width:30, textAlign:'right' }}>{pct}%</span>
            </div>
          );
        })}
        {!ents.length && <span style={{ color:C.textDim, fontSize:11, fontFamily:T.sans }}>Sin datos</span>}
      </div>
    </div>
  );
}

// ── Leads Mini Chart ──────────────────────────────────────────────────────────
function LeadsLineChart({ leads }) {
  if (!leads.length) return null;
  const byDay = {};
  leads.forEach(l => {
    const d = (l.ts || '').split('T')[0] || (l.ts || '').split(' ')[0];
    if (d) byDay[d] = (byDay[d] || 0) + 1;
  });
  const entries = Object.entries(byDay).sort(([a],[b]) => a.localeCompare(b)).slice(-14);
  if (entries.length < 2) return null;
  const vals = entries.map(([,v]) => v);
  const mv = Math.max(...vals, 1), mn = Math.min(...vals);
  const W = 440, H = 60, step = W / (vals.length - 1);
  const pts = vals.map((v,i) => ({ x:i*step, y:H-((v-mn)/Math.max(mv-mn,1))*(H-12)-6 }));
  const pathD = pts.map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaD = `${pathD} L${W},${H+4} L0,${H+4} Z`;
  return (
    <svg width="100%" viewBox={`-4 -4 ${W+8} ${H+40}`} style={{ display:'block', overflow:'visible' }}>
      <defs>
        <linearGradient id="leads-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.green} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={C.green} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#leads-grad)"/>
      <path d={pathD} fill="none" stroke={C.green} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      {pts.map((p,i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="2.5" fill={C.bg} stroke={C.green} strokeWidth="1.5"/>
          <text x={p.x} y={H+28} textAnchor="middle" fill="rgba(255,255,255,0.22)" fontSize="9" fontFamily="DM Sans, system-ui">{entries[i][0].slice(5)}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = C.orange, icon, trend }) {
  const [disp, setDisp] = useState(0);
  const target = typeof value === 'number' ? value : 0;
  useEffect(() => {
    if (!target) { setDisp(0); return; }
    const dur=800, t0=Date.now();
    const tick = () => {
      const p=Math.min((Date.now()-t0)/dur,1), e=1-Math.pow(1-p,3);
      setDisp(Math.round(target*e));
      if (p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return (
    <div className="card-enter card-hover" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'16px 18px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:color, opacity:0.35 }}/>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
        <span style={{ color:C.textDim, fontSize:10, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:T.sans }}>{label}</span>
        {icon && <span style={{ fontSize:13, opacity:0.18 }}>{icon}</span>}
      </div>
      <p className="stat-num" style={{ color:C.text, fontSize:34, marginBottom:6 }}>
        {typeof value === 'number' ? disp.toLocaleString('es-MX') : (value ?? '—')}
      </p>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {sub && <span style={{ color:C.textDim, fontSize:11, fontFamily:T.sans }}>{sub}</span>}
        {trend !== undefined && (
          <span style={{ fontSize:10, fontWeight:500, padding:'1px 6px', borderRadius:4, fontFamily:T.mono,
            background: trend>0?C.greenDim:trend<0?C.redDim:'rgba(255,255,255,0.03)',
            color: trend>0?C.green:trend<0?C.red:C.textDim,
            border: `1px solid ${trend>0?C.green+'22':trend<0?C.red+'22':'rgba(255,255,255,0.05)'}`,
          }}>{trend>0?'+':''}{trend}</span>
        )}
      </div>
    </div>
  );
}

// ── Section Label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
      <span style={{ color:C.textSub, fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:T.sans, flexShrink:0 }}>{children}</span>
      <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${C.border},transparent)` }}/>
    </div>
  );
}

// ── Eye Icon ──────────────────────────────────────────────────────────────────
function EyeIcon({ open }) {
  return open ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

// ── Password Strength ─────────────────────────────────────────────────────────
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Muy débil', color: C.red };
  if (score === 2) return { score, label: 'Débil',     color: C.amber };
  if (score === 3) return { score, label: 'Regular',   color: C.amber };
  if (score === 4) return { score, label: 'Fuerte',    color: C.green };
  return { score: 5, label: 'Muy fuerte', color: C.green };
}

// ── Users Tab ─────────────────────────────────────────────────────────────────
const SYSTEM_USERS = [
  { id:'Admin',        label:'ORRT',        role:'Administrador',      desc:'Acceso completo a todas las secciones y estadísticas', icon:'🛡️', color:C.orange, colorDim:'rgba(232,82,26,0.10)' },
  { id:'RH',           label:'RH',          role:'Recursos Humanos',   desc:'Acceso a reclutamiento y panel de candidatos',          icon:'👥', color:C.purple, colorDim:C.purpleDim },
  { id:'Distribuidor', label:'Distribuidor', role:'Atención a Clientes',desc:'Acceso a solicitudes de distribuidores y leads',        icon:'🤝', color:C.blue,   colorDim:'rgba(59,130,246,0.10)' },
];

function UserCard({ user }) {
  const [open,      setOpen]      = useState(false);
  const [activeTab, setActiveTab] = useState('password'); // 'password' | 'name'
  const [pw,        setPw]        = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [showPw,    setShowPw]    = useState(false);
  const [showCf,    setShowCf]    = useState(false);
  const [newName,   setNewName]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [status,    setStatus]    = useState(null);
  const [msg,       setMsg]       = useState('');
  const [dispLabel, setDispLabel] = useState(user.label);
  const pwRef   = useRef(null);
  const nameRef = useRef(null);

  const strength  = getStrength(pw);
  const match     = pw && confirm && pw === confirm;
  const mismatch  = pw && confirm && pw !== confirm;
  const canSavePw   = pw.length >= 6 && match && !loading;
  const canSaveName = newName.trim().length >= 2 && newName.trim() !== dispLabel && !loading;

  const handleOpen = (tab = 'password') => {
    setOpen(true); setActiveTab(tab);
    setPw(''); setConfirm(''); setNewName('');
    setStatus(null); setMsg('');
    setTimeout(() => (tab === 'name' ? nameRef : pwRef).current?.focus(), 120);
  };
  const handleCancel = () => {
    setOpen(false); setPw(''); setConfirm(''); setNewName(''); setStatus(null); setMsg('');
  };
  const switchTab = (t) => {
    setActiveTab(t); setStatus(null); setMsg('');
    setTimeout(() => (t === 'name' ? nameRef : pwRef).current?.focus(), 80);
  };

  const handleSavePassword = async () => {
    if (!canSavePw) return;
    setLoading(true); setStatus(null);
    try {
      const res  = await fetch('/api/auth', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action:'changePassword', userId:user.id, newPassword:pw }) });
      const data = await res.json();
      if (data.ok) {
        setStatus('ok'); setMsg('Contraseña actualizada correctamente');
        setTimeout(() => { setOpen(false); setPw(''); setConfirm(''); setStatus(null); }, 2200);
      } else { setStatus('error'); setMsg(data.error || 'No se pudo actualizar'); }
    } catch { setStatus('error'); setMsg('Error de conexión. Intenta de nuevo.'); }
    setLoading(false);
  };

  const handleSaveName = async () => {
    if (!canSaveName) return;
    setLoading(true); setStatus(null);
    try {
      const res  = await fetch('/api/auth', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action:'changeName', userId:user.id, newName:newName.trim() }) });
      const data = await res.json();
      if (data.ok) {
        setDispLabel(newName.trim());
        setStatus('ok'); setMsg('Nombre actualizado correctamente');
        setTimeout(() => { setOpen(false); setNewName(''); setStatus(null); }, 2200);
      } else { setStatus('error'); setMsg(data.error || 'No se pudo actualizar'); }
    } catch { setStatus('error'); setMsg('Error de conexión. Intenta de nuevo.'); }
    setLoading(false);
  };

  const tabBtnStyle = (t) => ({
    flex:1, padding:'7px 0', borderRadius:6, border:'none', cursor:'pointer',
    fontFamily:T.sans, fontSize:11, fontWeight:500, transition:'all 0.15s ease',
    background: activeTab===t ? 'rgba(255,255,255,0.08)' : 'transparent',
    color: activeTab===t ? C.text : C.textDim,
  });

  const btnHover = (color) => ({
    onMouseEnter: e => { e.currentTarget.style.borderColor = color+'50'; e.currentTarget.style.color = color; },
    onMouseLeave: e => { e.currentTarget.style.borderColor = C.border;   e.currentTarget.style.color = C.textSub; },
  });

  return (
    <div style={{ background:C.surface, border:`1px solid ${open ? user.color+'40' : C.border}`, borderRadius:12, overflow:'hidden', transition:'border-color 0.2s ease' }}>
      <div style={{ height:2, background:`linear-gradient(90deg,${user.color},transparent)` }}/>

      {/* ── Header row ── */}
      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'18px 20px', flexWrap:'wrap' }}>
        <div style={{ width:44, height:44, borderRadius:10, background:user.colorDim, border:`1px solid ${user.color}25`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{user.icon}</div>
        <div style={{ flex:1, minWidth:120 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3, flexWrap:'wrap' }}>
            <span style={{ fontFamily:T.sans, fontWeight:600, fontSize:14, color:C.text, letterSpacing:'-0.01em' }}>{dispLabel}</span>
            <span style={{ padding:'2px 8px', borderRadius:4, fontSize:10, fontWeight:600, background:user.colorDim, color:user.color, border:`1px solid ${user.color}25`, fontFamily:T.sans, letterSpacing:'0.05em' }}>{user.role}</span>
          </div>
          <p style={{ color:C.textDim, fontSize:11, fontFamily:T.sans, lineHeight:1.5, margin:0 }}>{user.desc}</p>
        </div>
        {!open && (
          <div style={{ display:'flex', gap:6, flexShrink:0, flexWrap:'wrap' }}>
            <button onClick={() => handleOpen('password')}
              style={{ padding:'7px 12px', borderRadius:8, border:`1px solid ${C.border}`, background:'rgba(255,255,255,0.04)', color:C.textSub, fontSize:11, fontWeight:500, cursor:'pointer', fontFamily:T.sans, transition:'all 0.15s ease', display:'flex', alignItems:'center', gap:5 }}
              {...btnHover(user.color)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Contraseña
            </button>
            <button onClick={() => handleOpen('name')}
              style={{ padding:'7px 12px', borderRadius:8, border:`1px solid ${C.border}`, background:'rgba(255,255,255,0.04)', color:C.textSub, fontSize:11, fontWeight:500, cursor:'pointer', fontFamily:T.sans, transition:'all 0.15s ease', display:'flex', alignItems:'center', gap:5 }}
              {...btnHover(user.color)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Nombre
            </button>
          </div>
        )}
      </div>

      {/* ── Expanded form ── */}
      {open && (
        <div style={{ padding:'0 20px 20px', animation:'fadeUp 0.22s cubic-bezier(0.16,1,0.3,1) both' }}>
          <div style={{ height:1, background:C.border, marginBottom:16 }}/>

          {/* Sub-tabs */}
          <div style={{ display:'flex', gap:4, padding:'4px', background:C.surface2, borderRadius:8, marginBottom:16, border:`1px solid ${C.border}` }}>
            <button style={tabBtnStyle('password')} onClick={() => switchTab('password')}>🔒 Contraseña</button>
            <button style={tabBtnStyle('name')}     onClick={() => switchTab('name')}>✏️ Nombre</button>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:9 }}>

            {/* ── TAB: Contraseña ── */}
            {activeTab === 'password' && (<>
              <p style={{ color:C.textSub, fontSize:11, fontFamily:T.sans, margin:'0 0 2px', display:'flex', alignItems:'center', gap:6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={user.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Nueva contraseña para <strong style={{ color:user.color }}>{dispLabel}</strong>
              </p>
              <div style={{ position:'relative' }}>
                <input ref={pwRef} type={showPw?'text':'password'} placeholder="Nueva contraseña (mín. 6 caracteres)" value={pw}
                  onChange={e=>{setPw(e.target.value);setStatus(null);}}
                  style={{ width:'100%', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, padding:'10px 40px 10px 14px', color:C.text, fontSize:12, outline:'none', fontFamily:T.sans, boxSizing:'border-box' }}
                  onFocus={e=>e.target.style.borderColor='rgba(255,255,255,0.2)'}
                  onBlur={e=>e.target.style.borderColor=C.border}
                />
                <button onClick={()=>setShowPw(p=>!p)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.textDim, padding:2 }}><EyeIcon open={showPw}/></button>
              </div>
              {pw && (
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ flex:1, height:3, background:'rgba(255,255,255,0.05)', borderRadius:2, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${(strength.score/5)*100}%`, background:strength.color, borderRadius:2, transition:'width 0.3s ease, background 0.3s ease' }}/>
                  </div>
                  <span style={{ color:strength.color, fontSize:10, fontFamily:T.sans, fontWeight:500, minWidth:62, textAlign:'right' }}>{strength.label}</span>
                </div>
              )}
              <div style={{ position:'relative' }}>
                <input type={showCf?'text':'password'} placeholder="Confirmar contraseña" value={confirm}
                  onChange={e=>{setConfirm(e.target.value);setStatus(null);}}
                  style={{ width:'100%', background:C.surface2, border:`1px solid ${mismatch?C.red+'60':match?C.green+'50':C.border}`, borderRadius:8, padding:'10px 40px 10px 14px', color:C.text, fontSize:12, outline:'none', fontFamily:T.sans, boxSizing:'border-box' }}
                />
                <button onClick={()=>setShowCf(p=>!p)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.textDim, padding:2 }}><EyeIcon open={showCf}/></button>
                {match && <div style={{ position:'absolute', right:36, top:'50%', transform:'translateY(-50%)' }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>}
              </div>
              {mismatch && <p style={{ color:C.red, fontSize:11, fontFamily:T.sans, margin:0 }}>Las contraseñas no coinciden</p>}
              {pw.length > 0 && pw.length < 6 && <p style={{ color:C.amber, fontSize:11, fontFamily:T.sans, margin:0 }}>Mínimo 6 caracteres</p>}
            </>)}

            {/* ── TAB: Nombre ── */}
            {activeTab === 'name' && (<>
              <p style={{ color:C.textSub, fontSize:11, fontFamily:T.sans, margin:'0 0 2px', display:'flex', alignItems:'center', gap:6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={user.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Cambiar nombre de <strong style={{ color:user.color }}>{dispLabel}</strong>
              </p>
              <input
                ref={nameRef} type="text"
                placeholder={`Nombre actual: ${dispLabel}`}
                value={newName}
                onChange={e=>{setNewName(e.target.value);setStatus(null);}}
                maxLength={40}
                style={{ width:'100%', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, padding:'10px 14px', color:C.text, fontSize:12, outline:'none', fontFamily:T.sans, boxSizing:'border-box' }}
                onFocus={e=>e.target.style.borderColor='rgba(255,255,255,0.2)'}
                onBlur={e=>e.target.style.borderColor=C.border}
              />
              {newName.trim().length > 0 && newName.trim().length < 2 && <p style={{ color:C.amber, fontSize:11, fontFamily:T.sans, margin:0 }}>Mínimo 2 caracteres</p>}
              <p style={{ color:C.textDim, fontSize:10, fontFamily:T.sans, margin:0, lineHeight:1.5 }}>
                ⚠️ Cambia el nombre visible en el badge del panel. No afecta contraseña ni rol.
              </p>
            </>)}

            {/* Status feedback */}
            {status && (
              <div style={{ padding:'10px 14px', borderRadius:8, fontSize:11, fontFamily:T.sans, background:status==='ok'?C.greenDim:C.redDim, border:`1px solid ${status==='ok'?C.green+'30':C.red+'30'}`, color:status==='ok'?C.green:C.red, display:'flex', alignItems:'center', gap:8 }}>
                {status==='ok'
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                }
                {msg}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display:'flex', gap:8, marginTop:2 }}>
              <button
                onClick={activeTab==='password' ? handleSavePassword : handleSaveName}
                disabled={activeTab==='password' ? !canSavePw : !canSaveName}
                style={{
                  flex:1, padding:'10px 0', borderRadius:8, border:'none',
                  background: (activeTab==='password' ? canSavePw : canSaveName) ? user.color : 'rgba(255,255,255,0.04)',
                  color:      (activeTab==='password' ? canSavePw : canSaveName) ? '#fff'      : C.textDim,
                  fontSize:12, fontWeight:600,
                  cursor: (activeTab==='password' ? canSavePw : canSaveName) ? 'pointer' : 'not-allowed',
                  fontFamily:T.sans, transition:'all 0.15s ease',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                }}
              >
                {loading
                  ? <><div style={{ width:12, height:12, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.2)', borderTop:'1.5px solid #fff', animation:'spin 0.7s linear infinite' }}/>Guardando...</>
                  : activeTab==='password' ? '🔒 Guardar contraseña' : '✏️ Guardar nombre'
                }
              </button>
              <button onClick={handleCancel}
                style={{ padding:'10px 16px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', color:C.textSub, fontSize:12, fontWeight:500, cursor:'pointer', fontFamily:T.sans, transition:'all 0.15s ease' }}
                onMouseEnter={e=>e.currentTarget.style.color=C.text}
                onMouseLeave={e=>e.currentTarget.style.color=C.textSub}
              >Cancelar</button>
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
      <div style={{ marginBottom:18, padding:'14px 18px', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ width:36, height:36, borderRadius:8, background:'rgba(232,82,26,0.08)', border:`1px solid rgba(232,82,26,0.20)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <div>
          <p style={{ fontFamily:T.sans, fontWeight:600, fontSize:13, color:C.text, margin:'0 0 3px', letterSpacing:'-0.01em' }}>Gestión de accesos</p>
          <p style={{ fontFamily:T.sans, fontSize:11, color:C.textDim, margin:0, lineHeight:1.5 }}>Modifica contraseña o nombre de cada usuario. Cambios aplicados inmediatamente en Turso.</p>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {SYSTEM_USERS.map(user => <UserCard key={user.id} user={user}/>)}
      </div>
      <div style={{ marginTop:14, padding:'12px 16px', borderRadius:8, background:'rgba(255,255,255,0.02)', border:`1px solid ${C.border2}`, display:'flex', alignItems:'center', gap:8 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span style={{ color:C.textDim, fontSize:10, fontFamily:T.sans, lineHeight:1.5 }}>
          Contraseñas almacenadas en la tabla <code style={{ fontFamily:T.mono, color:C.textSub, background:'rgba(255,255,255,0.04)', padding:'1px 5px', borderRadius:3 }}>users</code> de Turso. Mínimo 6 caracteres recomendado.
        </span>
      </div>
    </div>
  );
}

// ── Login ─────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [pw,      setPw]      = useState('');
  const [err,     setErr]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [showPw,  setShowPw]  = useState(false);
  const inputRef = useRef(null);
  const cardRef  = useRef(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 250); }, []);

  const shake = () => {
    const el = cardRef.current; if (!el) return;
    [-7,7,-4,4,-2,2,0].forEach((x,i) =>
      setTimeout(() => { el.style.transform = `translateX(${x}px)`; }, i * 50)
    );
  };

  const go = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch('/api/auth', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ password:pw }) });
      const data = await res.json();
      if (data.ok) { onLogin(data.role); }
      else { setErr(true); shake(); setTimeout(() => setErr(false), 2500); }
    } catch { setErr(true); shake(); setTimeout(() => setErr(false), 2500); }
    setLoading(false);
  };

  return (
    <div ref={cardRef} style={{ padding:'40px 36px 36px', animation:'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both', transition:'transform 0.05s ease' }}>
      <div style={{ textAlign:'center', marginBottom:28 }}>
        <div style={{ width:60, height:60, borderRadius:14, background:C.surface2, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px' }}>
          <RobotIcon size={40}/>
        </div>
        <h2 style={{ fontFamily:T.sans, fontWeight:600, fontSize:19, color:C.text, letterSpacing:'-0.02em', marginBottom:5 }}>Panel Admin</h2>
        <p style={{ color:C.textDim, fontSize:12, fontFamily:T.sans }}>BotGO · Grupo Ortiz</p>
      </div>
      <form onSubmit={go} style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ position:'relative' }}>
          <input
            ref={inputRef}
            type={showPw ? 'text' : 'password'}
            value={pw}
            onChange={e => setPw(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Contraseña"
            style={{ width:'100%', background:C.surface2, border:`1px solid ${err?C.red+'60':focused?'rgba(255,255,255,0.2)':C.border}`, borderRadius:8, padding:'11px 40px 11px 14px', color:C.text, fontSize:13, outline:'none', fontFamily:T.sans, transition:'border-color 0.15s ease', boxSizing:'border-box' }}
          />
          <button type="button" onClick={()=>setShowPw(p=>!p)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.textDim, padding:2 }}><EyeIcon open={showPw}/></button>
        </div>
        {err && (
          <div style={{ background:C.redDim, border:`1px solid ${C.red}25`, borderRadius:7, padding:'8px 12px', color:C.red, fontSize:11, fontFamily:T.sans }}>
            Contraseña incorrecta
          </div>
        )}
        <button type="submit" disabled={loading || !pw} className="btn-base"
          style={{ background:loading||!pw?'rgba(255,255,255,0.04)':'rgba(255,255,255,0.9)', color:loading||!pw?C.textDim:'#0a0a0a', border:'none', borderRadius:8, padding:'11px 0', fontFamily:T.sans, fontSize:13, fontWeight:600, cursor:loading||!pw?'not-allowed':'pointer', transition:'all 0.15s ease' }}>
          {loading
            ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <div style={{ width:12, height:12, borderRadius:'50%', border:'1.5px solid rgba(0,0,0,0.2)', borderTop:'1.5px solid rgba(0,0,0,0.7)', animation:'spin 0.7s linear infinite' }}/>
                Verificando
              </span>
            : 'Continuar'
          }
        </button>
      </form>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dash({ onClose, role }) {
  const w = useWindowWidth();
  const isMobile  = w < 640;
  const isTablet  = w < 900;

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState('');
  const [genAI,   setGenAI]   = useState(false);
  const [tab,     setTab]     = useState(role.tabs[0]);
  const [last,    setLast]    = useState(null);
  const [auto,    setAuto]    = useState(true);
  const [menuOpen,setMenuOpen]= useState(false);
  const itvRef = useRef(null);

  const [activePresetId, setActivePresetId] = useState('30d');
  const [activePeriod,   setActivePeriod]   = useState(() => PERIOD_PRESETS.find(p=>p.id==='30d').getRange());
  const [customFrom, setCustomFrom] = useState('');
  const [customTo,   setCustomTo]   = useState('');

  const [leads,      setLeads]      = useState([]);
  const [leadsLoad,  setLeadsLoad]  = useState(false);
  const [leadSearch, setLeadSearch] = useState('');

  const isAdmin = role.canDownload;
  const canSee  = (tabId) => role.tabs.includes(tabId);

  const load = useCallback(async (silent=false, from=null, to=null) => {
    if (!silent) setLoading(true);
    try {
      const body = { action:'get' };
      if (from) body.from = from;
      if (to)   body.to   = to;
      const r = await fetch('/api/analytics', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
      const j = await r.json();
      if (j.ok) { setData(j.data); setLast(new Date()); }
    } catch(e) { console.error(e); }
    if (!silent) setLoading(false);
  }, []);

  const loadLeads = useCallback(async () => {
    setLeadsLoad(true);
    try {
      const r = await fetch('/api/analytics', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action:'getLeads' }) });
      const j = await r.json();
      if (j.ok) setLeads(j.leads || []);
    } catch(e) { console.error(e); }
    setLeadsLoad(false);
  }, []);

  useEffect(() => {
    if (canSee('overview') || canSee('activity') || canSee('products') || canSee('keywords') || canSee('messages') || canSee('ai')) {
      const p = PERIOD_PRESETS.find(p=>p.id==='30d');
      const range = p.getRange();
      load(false, range.from, range.to);
    } else { setLoading(false); }
  }, []);

  useEffect(() => { if (tab === 'distribuidores') loadLeads(); }, [tab]);

  useEffect(() => {
    clearInterval(itvRef.current);
    if (auto) itvRef.current = setInterval(() => load(true, activePeriod?.from, activePeriod?.to), 10000);
    return () => clearInterval(itvRef.current);
  }, [load, auto, activePeriod]);

  const handlePresetSelect = useCallback((preset) => {
    setActivePresetId(preset.id);
    if (preset.id === 'custom') return;
    const range = preset.getRange();
    setActivePeriod(range);
    setCustomFrom(''); setCustomTo('');
    load(false, range?.from, range?.to);
  }, [load]);

  const handleApplyCustom = useCallback(() => {
    if (!customFrom || !customTo) return;
    if (customFrom > customTo) { alert('Fecha inicio debe ser anterior a fecha fin.'); return; }
    setActivePeriod({ from:customFrom, to:customTo });
    load(false, customFrom, customTo);
  }, [customFrom, customTo, load]);

  const reset = async () => {
    if (!isAdmin) return;
    if (!confirm('¿Borrar TODAS las estadísticas? Esta acción no se puede deshacer.')) return;
    await fetch('/api/analytics', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({action:'reset'}) });
    load(false, activePeriod?.from, activePeriod?.to);
    setSummary('');
  };

  const doAI = async () => {
    if (!data) return;
    setGenAI(true); setSummary('');
    try {
      const tp   = Object.entries(data.products||{}).sort(([,a],[,b])=>b-a).slice(0,5).map(([k,v])=>`${k}:${v}`).join(', ');
      const tk   = Object.entries(data.keywords||{}).sort(([,a],[,b])=>b-a).slice(0,8).map(([k,v])=>`${k}:${v}`).join(', ');
      const msgs = (data.lastMessages||[]).slice(-20).map(m=>m.user).join(' | ');
      const pl   = activePeriod?.from ? `${activePeriod.from} → ${activePeriod.to}` : 'Todo el historial';
      const prompt = `Eres analista de ventas Grupo Ortiz. Analiza datos del chatbot, resumen ejecutivo en español (máx 180 palabras).\nPeríodo: ${pl}\n\nSesiones:${data.totalSessions}|Mensajes:${data.totalMessages}|WhatsApp:${data.totalWhatsApp}|PDFs:${data.totalPDFs}\nProductos:${tp||'sin datos'}|Keywords:${tk||'sin datos'}\nIntenciones:Compra=${data.intents?.compra||0},Info=${data.intents?.info||0},PDF=${data.intents?.pdf||0},Empleo=${data.intents?.reclutamiento||0}\nConsultas:${msgs.substring(0,400)||'sin datos'}\n\nIncluye:comportamiento general,producto estrella,oportunidades,recomendación comercial.`;
      const r = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({messages:[{role:'user',content:prompt}],language:'es',isVoice:false}) });
      const j = await r.json();
      setSummary(j.reply || 'No se pudo generar.');
    } catch { setSummary('Error al generar el resumen.'); }
    setGenAI(false);
  };

  const prodD  = Object.entries(data?.products||{}).map(([label,value])=>({label,value}));
  const kwD    = Object.entries(data?.keywords ||{}).map(([label,value])=>({label,value}));
  const today  = new Date().toISOString().split('T')[0];
  const td     = data?.daily?.[today]||{messages:0,sessions:0,wa:0,pdf:0};
  const yest   = new Date(); yest.setDate(yest.getDate()-1);
  const yd     = data?.daily?.[yest.toISOString().split('T')[0]]||{messages:0,sessions:0,wa:0,pdf:0};

  const periodLabel = (() => {
    if (activePresetId==='all') return 'Todo el historial';
    if (activePresetId==='custom' && activePeriod?.from) return `${activePeriod.from} – ${activePeriod.to}`;
    return PERIOD_PRESETS.find(p=>p.id===activePresetId)?.label || '';
  })();

  const leadsHoy    = leads.filter(l => (l.ts||'').startsWith(today)).length;
  const leadsSemana = leads.filter(l => { const d=new Date(l.ts||0); return (Date.now()-d)<7*24*60*60*1000; }).length;
  const leadsProdCount = {};
  leads.forEach(l => { (l.productos||'').split(',').forEach(p => { const t=p.trim(); if(t) leadsProdCount[t]=(leadsProdCount[t]||0)+1; }); });
  const leadsProdData = Object.entries(leadsProdCount).map(([label,value])=>({label,value}));

  const ALL_TABS = [
    { id:'overview',       label:'Resumen' },
    { id:'activity',       label:'Actividad' },
    { id:'products',       label:'Productos' },
    { id:'keywords',       label:'Búsquedas' },
    { id:'messages',       label:'Mensajes' },
    { id:'distribuidores', label:'Distribuidores' },
    { id:'recruitment',    label:'Reclutamiento' },
    { id:'ai',             label:'Análisis IA' },
    { id:'users',          label:'Usuarios' },
  ];
  const TABS = ALL_TABS.filter(t => canSee(t.id));

  const CARD = { background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding: isMobile ? '14px 14px' : '20px 22px', marginBottom:10, position:'relative', overflow:'hidden' };
  const SECTION_TITLE = { fontFamily:T.sans, fontWeight:600, fontSize:13, color:C.text, letterSpacing:'-0.01em', marginBottom:16 };
  const roleBadgeColor = role.color || C.orange;

  // Mobile tab menu
  const currentTabLabel = TABS.find(t=>t.id===tab)?.label || '';

  return (
    <div className="admin-dash admin-panel-root panel-enter" style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius: isMobile ? 10 : 14, width:'100%', maxWidth: isMobile ? '100%' : isTablet ? '98vw' : 1140, height: isMobile ? '100dvh' : '90vh', maxHeight: isMobile ? '100dvh' : '90vh', display:'flex', flexDirection:'column', overflowY:'hidden', boxShadow:'0 40px 80px rgba(0,0,0,0.9)', fontFamily:T.sans }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── HEADER ── */}
      <div style={{ padding: isMobile ? '10px 12px' : '14px 18px', borderBottom:`1px solid ${C.border}`, background:C.surface, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, marginBottom: isAdmin && !isMobile ? 12 : isAdmin ? 8 : 0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><RobotIcon size={22}/></div>
            <div style={{ minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2, flexWrap:'wrap' }}>
                <span style={{ fontFamily:T.sans, fontWeight:600, fontSize: isMobile ? 13 : 14, color:C.text, letterSpacing:'-0.01em' }}>Panel Admin</span>
                {!isMobile && <><Tag color={C.orange}>BotGO</Tag><Tag color={C.textSub}>Grupo Ortiz</Tag></>}
                <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'2px 8px', borderRadius:4, fontSize:10, fontWeight:600, background:`${roleBadgeColor}18`, color:roleBadgeColor, border:`1px solid ${roleBadgeColor}30`, fontFamily:T.sans, letterSpacing:'0.05em' }}>
                  <span style={{ width:4, height:4, borderRadius:'50%', background:roleBadgeColor, display:'inline-block' }}/>
                  {role.name}
                </span>
              </div>
              {isAdmin && !isMobile && (
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <Dot active={auto}/>
                  <span style={{ color:C.textDim, fontSize:10, fontFamily:T.sans }}>{auto?'Live · cada 10s':'Pausado'}{last&&` · ${last.toLocaleTimeString('es-MX')}`}</span>
                  {periodLabel && <span style={{ padding:'1px 7px', borderRadius:4, background:'rgba(255,255,255,0.05)', border:`1px solid ${C.border}`, color:C.textSub, fontSize:10, fontFamily:T.sans }}>{periodLabel}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display:'flex', gap:5, alignItems:'center', flexShrink:0 }}>
            {isAdmin && !isMobile && [
              { label:auto?'Pausar':'Live', onClick:()=>setAuto(p=>!p), style:{ background:auto?C.greenDim:'rgba(255,255,255,0.04)', border:`1px solid ${auto?C.green+'30':C.border}`, color:auto?C.green:C.textSub } },
              { label:'Sync', onClick:()=>load(false,activePeriod?.from,activePeriod?.to), style:{ background:'rgba(255,255,255,0.04)', border:`1px solid ${C.border}`, color:C.textSub } },
              { label:'Reset', onClick:reset, style:{ background:C.redDim, border:`1px solid ${C.red}25`, color:C.red } },
            ].map(b => (
              <button key={b.label} onClick={b.onClick} className="btn-base" style={{ padding:'5px 10px', borderRadius:7, fontSize:11, fontWeight:500, cursor:'pointer', fontFamily:T.sans, ...b.style }}>{b.label}</button>
            ))}
            {/* Mobile sync */}
            {isMobile && isAdmin && (
              <button onClick={()=>load(false,activePeriod?.from,activePeriod?.to)} className="btn-base" style={{ padding:'6px 10px', borderRadius:7, border:`1px solid ${C.border}`, background:'rgba(255,255,255,0.04)', color:C.textSub, cursor:'pointer', fontSize:12 }}>↻</button>
            )}
            {isAdmin && !isMobile && <DownloadReportButton data={data} periodMeta={{ preset:activePresetId, from:activePeriod?.from, to:activePeriod?.to }}/>}
            <button onClick={onClose} style={{ padding:'6px 10px', borderRadius:7, border:`1px solid ${C.border}`, background:'transparent', color:C.textDim, cursor:'pointer', fontSize:13, fontFamily:T.sans }}>✕</button>
          </div>
        </div>

        {/* Period selector — hidden on mobile to save space */}
        {isAdmin && !isMobile && (
          <div style={{ display:'flex', alignItems:'center', padding:'7px 10px', background:C.surface2, borderRadius:8, border:`1px solid ${C.border}` }}>
            <PeriodSelector activeId={activePresetId} onSelect={handlePresetSelect} customFrom={customFrom} customTo={customTo} setCustomFrom={setCustomFrom} setCustomTo={setCustomTo} onApplyCustom={handleApplyCustom}/>
          </div>
        )}
        {/* Mobile period — compact */}
        {isAdmin && isMobile && (
          <div style={{ marginTop:8 }}>
            <PeriodSelector activeId={activePresetId} onSelect={handlePresetSelect} customFrom={customFrom} customTo={customTo} setCustomFrom={setCustomFrom} setCustomTo={setCustomTo} onApplyCustom={handleApplyCustom}/>
          </div>
        )}
      </div>

      {/* ── TABS — Desktop scroll / Mobile dropdown ── */}
      {!isMobile ? (
        <div style={{ padding:'0 18px', borderBottom:`1px solid ${C.border}`, display:'flex', gap:2, overflowX:'auto', background:C.surface, flexShrink:0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} className={`tab-btn ${tab===t.id?'active':''}`}
              style={{ background:'transparent', color:tab===t.id?C.text:C.textDim, border:'none', padding:'10px 13px', cursor:'pointer', fontSize:12, fontWeight:tab===t.id?500:400, fontFamily:T.sans, whiteSpace:'nowrap' }}>
              {t.label}
              {t.id==='distribuidores' && leads.length>0 && <span style={{ marginLeft:5, background:C.orange+'20', color:C.orange, borderRadius:10, padding:'1px 6px', fontSize:9, fontFamily:T.mono }}>{leads.length}</span>}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ padding:'8px 12px', borderBottom:`1px solid ${C.border}`, background:C.surface, flexShrink:0, position:'relative' }}>
          <button
            onClick={()=>setMenuOpen(p=>!p)}
            style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 12px', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:12, fontWeight:500, cursor:'pointer', fontFamily:T.sans }}
          >
            <span>{currentTabLabel}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform:menuOpen?'rotate(180deg)':'rotate(0)', transition:'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {menuOpen && (
            <div style={{ position:'absolute', top:'calc(100% + 2px)', left:12, right:12, background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, zIndex:100, overflow:'hidden', boxShadow:'0 8px 24px rgba(0,0,0,0.6)', animation:'fadeUp 0.15s ease' }}>
              {TABS.map(t => (
                <button key={t.id} onClick={()=>{setTab(t.id);setMenuOpen(false);}}
                  style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 14px', background:tab===t.id?'rgba(255,255,255,0.06)':'transparent', border:'none', borderBottom:`1px solid ${C.border2}`, color:tab===t.id?C.text:C.textSub, fontSize:12, fontWeight:tab===t.id?500:400, cursor:'pointer', fontFamily:T.sans, textAlign:'left' }}>
                  {t.label}
                  {t.id==='distribuidores' && leads.length>0 && <span style={{ background:C.orange+'20', color:C.orange, borderRadius:10, padding:'1px 6px', fontSize:9, fontFamily:T.mono }}>{leads.length}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── CONTENT ── */}
      <div style={{ flex:1, overflowY:'auto', padding: isMobile ? '12px 12px 32px' : '18px 18px 32px', background:C.bg }} onClick={()=>menuOpen&&setMenuOpen(false)}>
        {loading && tab !== 'distribuidores' && tab !== 'recruitment' && tab !== 'users' && <Spinner/>}

        {/* OVERVIEW */}
        {!loading && data && tab==='overview' && canSee('overview') && (
          <div className="tab-content" key="ov">
            <SectionLabel>Acumulado · {periodLabel}</SectionLabel>
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit,minmax(190px,1fr))', gap:8, marginBottom:16 }}>
              <StatCard label="Sesiones"  value={data.totalSessions} sub="conversaciones"      color={C.orange} icon="💬"/>
              <StatCard label="Mensajes"  value={data.totalMessages} sub="preguntas recibidas"  color={C.blue}   icon="📩"/>
              <StatCard label="WhatsApp"  value={data.totalWhatsApp} sub="leads generados"      color={C.green}  icon="🛒"/>
              <StatCard label="PDFs"      value={data.totalPDFs}     sub="catálogos enviados"   color={C.amber}  icon="📄"/>
            </div>
            <div style={{ height:1, background:C.border, margin:'14px 0' }}/>
            <SectionLabel>Hoy · {new Date().toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'})}</SectionLabel>
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit,minmax(190px,1fr))', gap:8, marginBottom:14 }}>
              <StatCard label="Mensajes hoy" value={td.messages} sub={`ayer: ${yd.messages}`} color={C.orange} icon="📆" trend={td.messages-yd.messages}/>
              <StatCard label="Sesiones hoy" value={td.sessions} sub={`ayer: ${yd.sessions}`} color={C.purple} icon="👤" trend={td.sessions-yd.sessions}/>
              <StatCard label="WhatsApp hoy" value={td.wa||0}    sub={`ayer: ${yd.wa||0}`}    color={C.green}  icon="📲" trend={(td.wa||0)-(yd.wa||0)}/>
              <StatCard label="PDFs hoy"     value={td.pdf||0}   sub={`ayer: ${yd.pdf||0}`}   color={C.amber}  icon="📋" trend={(td.pdf||0)-(yd.pdf||0)}/>
            </div>
            <div style={{ display:'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr', gap:10 }}>
              <div className="card-hover" style={CARD}><p style={SECTION_TITLE}>Distribución de intenciones</p><DonutChart intents={data.intents}/></div>
              <div className="card-hover" style={CARD}><p style={SECTION_TITLE}>Actividad — últimos 14 días</p><LineChart daily={data.daily}/></div>
            </div>
          </div>
        )}

        {/* ACTIVITY */}
        {!loading && data && tab==='activity' && canSee('activity') && (
          <div className="tab-content" key="ac">
            <div className="card-hover" style={CARD}>
              <p style={SECTION_TITLE}>Historial diario</p>
              <div style={{ overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12, minWidth: isMobile ? 480 : 'auto' }}>
                  <thead><tr>{['Fecha','Sesiones','Mensajes','WhatsApp','PDFs','Conv.%'].map(h=>(
                    <th key={h} style={{ color:C.textDim, fontWeight:500, padding:'8px 10px', textAlign:'left', borderBottom:`1px solid ${C.border}`, fontSize:10, textTransform:'uppercase', letterSpacing:'0.07em', fontFamily:T.sans, background:C.surface2, whiteSpace:'nowrap' }}>{h}</th>
                  ))}</tr></thead>
                  <tbody>
                    {Object.entries(data.daily||{}).sort(([a],[b])=>b.localeCompare(a)).map(([date,v])=>{
                      const conv=v.messages?Math.round(((v.wa||0)/v.messages)*100):0, isToday=date===today;
                      return (
                        <tr key={date} className="row-hover" style={{ background:isToday?'rgba(232,82,26,0.05)':'transparent', borderBottom:`1px solid ${C.border2}` }}>
                          <td style={{ padding:'8px 10px', color:C.text, fontFamily:T.mono, fontSize:11, whiteSpace:'nowrap' }}>{isToday&&<Tag color={C.orange}>hoy</Tag>} {date}</td>
                          <td style={{ padding:'8px 10px', color:C.textSub, fontFamily:T.mono }}>{v.sessions||0}</td>
                          <td style={{ padding:'8px 10px', color:C.text, fontFamily:T.mono, fontWeight:500 }}>{v.messages||0}</td>
                          <td style={{ padding:'8px 10px' }}><span style={{ color:C.green, fontFamily:T.mono }}>{v.wa||0}</span></td>
                          <td style={{ padding:'8px 10px' }}><span style={{ color:C.amber, fontFamily:T.mono }}>{v.pdf||0}</span></td>
                          <td style={{ padding:'8px 10px' }}><span style={{ padding:'2px 6px', borderRadius:4, background:conv>10?C.greenDim:conv>0?C.amberDim:'transparent', color:conv>10?C.green:conv>0?C.amber:C.textDim, fontSize:10, fontFamily:T.mono, fontWeight:500 }}>{conv}%</span></td>
                        </tr>
                      );
                    })}
                    {!Object.keys(data.daily||{}).length&&<tr><td colSpan={6} style={{ color:C.textDim, textAlign:'center', padding:40, fontFamily:T.sans, fontSize:11 }}>Sin datos</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-hover" style={CARD}>
              <p style={SECTION_TITLE}>Mensajes por hora del día</p>
              <BarChart data={(data.hourly||Array(24).fill(0)).map((v,i)=>({label:`${String(i).padStart(2,'0')}:00`,value:v}))} color={C.blue} max={24}/>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {!loading && data && tab==='products' && canSee('products') && (
          <div className="tab-content" key="pr">
            <div className="card-hover" style={CARD}>
              <p style={SECTION_TITLE}>Productos más consultados</p>
              <BarChart data={prodD} color={C.orange} max={10}/>
              {prodD.length>0&&(()=>{
                const top=[...prodD].sort((a,b)=>b.value-a.value)[0];
                return <div style={{ marginTop:18, padding:'12px 14px', background:C.surface2, borderRadius:8, border:`1px solid ${C.border}`, borderLeft:`2px solid ${C.orange}`, display:'flex', alignItems:'center', gap:12 }}><div><span style={{ color:C.textDim, fontSize:10, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.07em', fontFamily:T.sans }}>Producto estrella</span><p style={{ margin:'4px 0 0', fontFamily:T.sans, fontWeight:600, fontSize:15, color:C.text }}>{top?.label}<span style={{ color:C.orange, marginLeft:8, fontFamily:T.mono, fontWeight:400, fontSize:13 }}>×{top?.value}</span></p></div></div>;
              })()}
            </div>
          </div>
        )}

        {/* KEYWORDS */}
        {!loading && data && tab==='keywords' && canSee('keywords') && (
          <div className="tab-content" key="kw" style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:10 }}>
            <div className="card-hover" style={CARD}><p style={SECTION_TITLE}>Palabras clave</p><BarChart data={kwD} color={C.blue} max={12}/></div>
            <div className="card-hover" style={CARD}><p style={SECTION_TITLE}>Productos mencionados</p><BarChart data={prodD} color={C.purple} max={8}/></div>
          </div>
        )}

        {/* MESSAGES */}
        {!loading && data && tab==='messages' && canSee('messages') && (
          <div className="tab-content" key="ms">
            <div className="card-hover" style={CARD}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, flexWrap:'wrap', gap:8 }}>
                <p style={{ ...SECTION_TITLE, marginBottom:0 }}>Consultas en tiempo real</p>
                <Tag color={C.green}>{data.lastMessages?.length||0} registros</Tag>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {(data.lastMessages||[]).slice().reverse().map((m,i)=>{
                  const iC={compra:C.green,pdf:C.blue,reclutamiento:C.purple}, color=iC[m.intent]||'rgba(255,255,255,0.15)';
                  return (
                    <div key={i} className="row-hover" style={{ padding:'8px 10px', background:C.surface2, borderRadius:7, border:`1px solid ${C.border}`, display:'flex', gap:8, alignItems:'center' }}>
                      <div style={{ width:2, height:26, borderRadius:1, background:color, flexShrink:0 }}/>
                      <div style={{ flexShrink:0, minWidth:46 }}>
                        <div style={{ color:C.textSub, fontSize:10, fontFamily:T.mono }}>{m.ts?new Date(m.ts).toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'}):'—'}</div>
                        <div style={{ color:C.textDim, fontSize:9, fontFamily:T.mono }}>{m.ts?new Date(m.ts).toLocaleDateString('es-MX',{day:'2-digit',month:'short'}):''}</div>
                      </div>
                      <span style={{ color:C.text, fontSize:12, flex:1, lineHeight:1.5, fontFamily:T.sans, wordBreak:'break-word', minWidth:0 }}>{m.user}</span>
                      {m.prod && !isMobile && <Tag color={C.amber}>{m.prod}</Tag>}
                      <Tag color={color}>{m.intent||'otro'}</Tag>
                    </div>
                  );
                })}
                {!(data.lastMessages||[]).length&&<div style={{ textAlign:'center', padding:'44px 0', color:C.textDim, fontFamily:T.sans, fontSize:12 }}>Sin mensajes registrados</div>}
              </div>
            </div>
          </div>
        )}

        {/* DISTRIBUIDORES */}
        {tab==='distribuidores' && canSee('distribuidores') && (
          <div className="tab-content" key="dist">
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit,minmax(170px,1fr))', gap:8, marginBottom:14 }}>
              <StatCard label="Total solicitudes" value={leads.length}   sub="acumulado"       color={C.orange} icon="🤝"/>
              <StatCard label="Esta semana"        value={leadsSemana}   sub="últimos 7 días"  color={C.blue}   icon="📅"/>
              <StatCard label="Hoy"                value={leadsHoy}      sub="nuevas hoy"      color={C.green}  icon="⚡"/>
            </div>
            {leads.length >= 2 && (
              <div className="card-hover" style={{ ...CARD, marginBottom:10 }}>
                <p style={SECTION_TITLE}>Tendencia de solicitudes — últimos 14 días</p>
                <LeadsLineChart leads={leads}/>
              </div>
            )}
            {leadsProdData.length > 0 && (
              <div className="card-hover" style={{ ...CARD, marginBottom:10 }}>
                <p style={SECTION_TITLE}>Productos de interés</p>
                <BarChart data={leadsProdData} color={C.orange} max={8}/>
              </div>
            )}
            <div className="card-hover" style={CARD}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, flexWrap:'wrap', gap:8 }}>
                <p style={{ ...SECTION_TITLE, marginBottom:0 }}>Registro de solicitudes</p>
                <div style={{ display:'flex', gap:6, alignItems:'center', flexWrap:'wrap' }}>
                  <Tag color={C.orange}>{leads.length} registros</Tag>
                  <button onClick={loadLeads} className="btn-base" style={{ padding:'5px 10px', borderRadius:7, fontSize:11, fontWeight:500, background:'rgba(255,255,255,0.04)', border:`1px solid ${C.border}`, color:C.textSub, cursor:'pointer', fontFamily:T.sans }}>↻</button>
                  {isAdmin && (
                    <button onClick={async()=>{
                      if(!confirm('¿Borrar todos los leads?'))return;
                      await fetch('/api/analytics',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'resetLeads'})});
                      setLeads([]);
                    }} className="btn-base" style={{ padding:'5px 10px', borderRadius:7, fontSize:11, fontWeight:500, background:C.redDim, border:`1px solid ${C.red}25`, color:C.red, cursor:'pointer', fontFamily:T.sans }}>Borrar</button>
                  )}
                </div>
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, empresa, WhatsApp o email..."
                value={leadSearch}
                onChange={e=>setLeadSearch(e.target.value)}
                style={{ width:'100%', marginBottom:12, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, padding:'9px 14px', color:C.text, fontSize:12, outline:'none', fontFamily:T.sans }}
                onFocus={e=>e.target.style.borderColor='rgba(255,255,255,0.2)'}
                onBlur={e=>e.target.style.borderColor=C.border}
              />
              {leadsLoad ? <Spinner/> : (
                <div style={{ overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12, minWidth: isMobile ? 560 : 'auto' }}>
                    <thead>
                      <tr>{['Fecha','Nombre','Empresa','WhatsApp','Email','Productos'].map(h=>(
                        <th key={h} style={{ color:C.textDim, fontWeight:500, padding:'8px 10px', textAlign:'left', borderBottom:`1px solid ${C.border}`, fontSize:10, textTransform:'uppercase', letterSpacing:'0.07em', fontFamily:T.sans, background:C.surface2, whiteSpace:'nowrap' }}>{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {leads
                        .filter(l => { const q=leadSearch.toLowerCase(); return !q||(l.nombre||'').toLowerCase().includes(q)||(l.empresa||'').toLowerCase().includes(q)||(l.email||'').toLowerCase().includes(q)||(l.whatsapp||'').includes(q); })
                        .map((l,i) => (
                          <tr key={i} className="row-hover" style={{ borderBottom:`1px solid ${C.border2}` }}>
                            <td style={{ padding:'8px 10px', color:C.textDim, fontFamily:T.mono, fontSize:10, whiteSpace:'nowrap' }}>{l.ts?new Date(l.ts).toLocaleString('es-MX',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):'—'}</td>
                            <td style={{ padding:'8px 10px', color:C.text, fontFamily:T.sans, fontWeight:500, whiteSpace:'nowrap' }}>{l.nombre}</td>
                            <td style={{ padding:'8px 10px', color:C.textSub, fontFamily:T.sans, whiteSpace:'nowrap' }}>{l.empresa}</td>
                            <td style={{ padding:'8px 10px' }}>
                              <a href={`https://wa.me/52${(l.whatsapp||'').replace(/\D/g,'')}`} target="_blank" style={{ color:C.green, fontFamily:T.mono, fontSize:11, textDecoration:'none', display:'flex', alignItems:'center', gap:4, whiteSpace:'nowrap' }}>📲 {l.whatsapp}</a>
                            </td>
                            <td style={{ padding:'8px 10px', color:C.blue, fontFamily:T.mono, fontSize:11, whiteSpace:'nowrap' }}>{l.email}</td>
                            <td style={{ padding:'8px 10px' }}>
                              {(l.productos||'').split(',').filter(Boolean).map((p,j)=>(<Tag key={j} color={C.orange}>{p.trim()}</Tag>))}
                              {!(l.productos||'').trim()&&<span style={{ color:C.textDim, fontSize:10 }}>—</span>}
                            </td>
                          </tr>
                        ))
                      }
                      {!leads.length&&!leadsLoad&&<tr><td colSpan={6} style={{ color:C.textDim, textAlign:'center', padding:40, fontFamily:T.sans, fontSize:12 }}>Sin solicitudes registradas aún</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RECRUITMENT */}
        {tab==='recruitment' && canSee('recruitment') && (
          <div className="tab-content" key="rc"><RecruitmentTab/></div>
        )}

        {/* AI */}
        {!loading && data && tab==='ai' && canSee('ai') && (
          <div className="tab-content" key="ai">
            <div className="card-hover" style={CARD}>
              <p style={SECTION_TITLE}>Análisis Inteligente · BotGO</p>
              <p style={{ color:C.textDim, fontSize:12, marginBottom:16, lineHeight:1.7, fontFamily:T.sans, maxWidth:520 }}>Genera un resumen ejecutivo basado en los datos del chatbot: patrones de comportamiento, productos destacados y recomendaciones comerciales.</p>
              <button onClick={doAI} disabled={genAI} className="btn-base" style={{ background:genAI?'rgba(255,255,255,0.04)':'rgba(255,255,255,0.9)', color:genAI?C.textDim:'#0a0a0a', border:'none', borderRadius:8, padding:'10px 20px', fontFamily:T.sans, fontSize:12, fontWeight:600, cursor:genAI?'not-allowed':'pointer', display:'flex', alignItems:'center', gap:8 }}>
                {genAI?<><div style={{ width:12, height:12, borderRadius:'50%', border:'1.5px solid rgba(0,0,0,0.2)', borderTop:'1.5px solid rgba(0,0,0,0.6)', animation:'spin 0.7s linear infinite' }}/>Analizando...</>:<>✦ Generar análisis</>}
              </button>
              {summary && (
                <div style={{ marginTop:16, padding:'16px 18px', background:C.surface2, border:`1px solid ${C.border}`, borderLeft:`2px solid ${C.blue}`, borderRadius:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                    <Dot active color={C.blue}/>
                    <span style={{ color:C.textDim, fontSize:10, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.07em', fontFamily:T.sans }}>Resumen ejecutivo · {periodLabel}</span>
                  </div>
                  <p style={{ color:C.text, fontSize:13, lineHeight:1.75, whiteSpace:'pre-wrap', fontFamily:T.sans }}>{summary}</p>
                </div>
              )}
              <div style={{ height:1, background:C.border, margin:'18px 0' }}/>
              <p style={{ ...SECTION_TITLE, marginBottom:10 }}>Últimas 20 consultas</p>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {(data.lastMessages||[]).slice(-20).reverse().map((m,i)=>{
                  const iC={compra:C.green,pdf:C.blue}, color=iC[m.intent]||'rgba(255,255,255,0.15)';
                  return (
                    <div key={i} style={{ padding:'8px 10px', background:C.surface2, borderRadius:6, border:`1px solid ${C.border}`, display:'flex', gap:8, alignItems:'center' }}>
                      <span style={{ color:C.textDim, fontSize:9, flexShrink:0, fontFamily:T.mono }}>{m.ts?new Date(m.ts).toLocaleDateString('es-MX',{day:'2-digit',month:'short'}):'—'}</span>
                      <span style={{ color:C.text, fontSize:12, flex:1, fontFamily:T.sans, wordBreak:'break-word', minWidth:0 }}>{m.user}</span>
                      <Tag color={color}>{m.intent||'otro'}</Tag>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab==='users' && canSee('users') && (
          <div className="tab-content" key="us"><UsersTab/></div>
        )}
      </div>
    </div>
  );
}

// ── Root Export ───────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [visible, setVisible] = useState(false);
  const [role,    setRole]    = useState(null);

  useEffect(() => {
    const fn = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '9') { e.preventDefault(); setVisible(p => !p); }
      if (e.key === 'Escape') { setVisible(false); setRole(null); }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  return (
    <div className="admin-panel-root">
      <style>{GLOBAL_CSS}</style>
      {visible && (
        <div className="admin-overlay visible" onClick={e => { if (e.target === e.currentTarget) { setVisible(false); setRole(null); } }}>
          {!role
            ? <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, width:'94vw', maxWidth:380, boxShadow:'0 40px 80px rgba(0,0,0,0.9)', position:'relative', overflow:'hidden' }}>
                <Login onLogin={r => setRole(r)}/>
              </div>
            : <Dash onClose={() => { setVisible(false); setRole(null); }} role={role}/>
          }
        </div>
      )}
    </div>
  );
}