// src/components/AdminPanel.jsx
// BotGO · Panel Admin v14 · Visual Redesign · Paleta: #262626 · #535353 · #ECEBE0 · #FB670B
// Ctrl + K → abre el panel

import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { DownloadReportButton } from './ReportGenerator';
import RecruitmentTab from './RecruitmentTab';
import ReportScheduler from './ReportScheduler';
import VacantesTab from './VacantesTab';

// ── COUNTRY CODES (GSC alpha-3) → nombre + bandera ───────────────────────────
const COUNTRY_MAP = {
  mex:{name:'México',          flag:'🇲🇽'}, usa:{name:'Estados Unidos', flag:'🇺🇸'},
  col:{name:'Colombia',        flag:'🇨🇴'}, arg:{name:'Argentina',      flag:'🇦🇷'},
  esp:{name:'España',          flag:'🇪🇸'}, chl:{name:'Chile',          flag:'🇨🇱'},
  per:{name:'Perú',            flag:'🇵🇪'}, gtm:{name:'Guatemala',      flag:'🇬🇹'},
  bra:{name:'Brasil',          flag:'🇧🇷'}, can:{name:'Canadá',         flag:'🇨🇦'},
  gbr:{name:'Reino Unido',     flag:'🇬🇧'}, deu:{name:'Alemania',       flag:'🇩🇪'},
  fra:{name:'Francia',         flag:'🇫🇷'}, ita:{name:'Italia',         flag:'🇮🇹'},
  jpn:{name:'Japón',           flag:'🇯🇵'}, cri:{name:'Costa Rica',     flag:'🇨🇷'},
  ven:{name:'Venezuela',       flag:'🇻🇪'}, ecu:{name:'Ecuador',        flag:'🇪🇨'},
  bol:{name:'Bolivia',         flag:'🇧🇴'}, pry:{name:'Paraguay',       flag:'🇵🇾'},
  ury:{name:'Uruguay',         flag:'🇺🇾'}, pan:{name:'Panamá',         flag:'🇵🇦'},
  hnd:{name:'Honduras',        flag:'🇭🇳'}, slv:{name:'El Salvador',    flag:'🇸🇻'},
  nic:{name:'Nicaragua',       flag:'🇳🇮'},
};

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

// ── PALETAS OFICIAL (DARK / LIGHT) ────────────────────────────────────────────
const DARK_P = {
  black:       '#262626',
  gray:        '#535353',
  cream:       '#ECEBE0',
  orange:      '#FB670B',
  orangeDark:  '#D4530A',
  orangeWarm:  '#FD8A40',
  orangeSoft:  '#FE9B5E',
  grayMid:     '#8A8A7A',
  grayLight:   '#C4C3B5',
  creamDark:   '#D8D6C5',
  bg:          '#0F0E0C',
  surface:     '#181714',
  surface2:    '#201F1C',
  surface3:    '#2A2926',
  surfaceGlass:'rgba(24,23,20,0.85)',
  border:      'rgba(236,235,224,0.11)',
  border2:     'rgba(236,235,224,0.06)',
  borderHover: 'rgba(251,103,11,0.28)',
  borderActive:'rgba(251,103,11,0.45)',
  text:        'rgba(236,235,224,0.97)',
  textSub:     'rgba(236,235,224,0.58)',
  textDim:     'rgba(236,235,224,0.30)',
  textMuted:   'rgba(236,235,224,0.16)',
  ok:          '#FB670B',
  okDim:       'rgba(251,103,11,0.13)',
  okGlow:      'rgba(251,103,11,0.22)',
  warn:        '#C4C3B5',
  warnDim:     'rgba(196,195,181,0.10)',
  err:         '#535353',
  errDim:      'rgba(83,83,83,0.18)',
};

const LIGHT_P = {
  black:       '#111827',
  gray:        '#6B7280',
  cream:       '#F8F9FB',
  orange:      '#FB670B',
  orangeDark:  '#D4530A',
  orangeWarm:  '#FD8A40',
  orangeSoft:  '#FE9B5E',
  grayMid:     '#9CA3AF',
  grayLight:   '#D1D5DB',
  creamDark:   '#E5E7EB',
  bg:          '#F8F9FB',
  surface:     '#FFFFFF',
  surface2:    '#F8F9FB',
  surface3:    '#F3F4F6',
  surfaceGlass:'rgba(255,255,255,0.98)',
  border:      '#E5E7EB',
  border2:     '#F3F4F6',
  borderHover: 'rgba(251,103,11,0.28)',
  borderActive:'rgba(251,103,11,0.45)',
  text:        '#111827',
  textSub:     '#6B7280',
  textDim:     '#9CA3AF',
  textMuted:   '#D1D5DB',
  ok:          '#FB670B',
  okDim:       'rgba(251,103,11,0.08)',
  okGlow:      'rgba(251,103,11,0.15)',
  warn:        '#9CA3AF',
  warnDim:     'rgba(156,163,175,0.10)',
  err:         '#DC2626',
  errDim:      'rgba(220,38,38,0.08)',
};

// Contexto de paleta — permite que todos los sub-componentes lean el tema activo
const PCtx = createContext(DARK_P);
const useP  = () => useContext(PCtx);

// Alias module-level para default params (valor estático, no cambia)
const P = DARK_P;

const T = { sans:"'DM Sans',system-ui,sans-serif", mono:"'DM Mono','Fira Mono',monospace" };

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  /* ── OVERLAY ── */
  .admin-overlay {
    position:fixed; inset:0; z-index:99999999;
    background:rgba(6,5,4,0.82);
    backdrop-filter:blur(32px) saturate(120%);
    -webkit-backdrop-filter:blur(32px) saturate(120%);
    display:flex; align-items:center; justify-content:center;
    padding:8px; opacity:0; transition:opacity 0.30s ease;
  }
  .admin-overlay.visible { opacity:1; }

  /* ── DOT GRID BACKGROUND ── */
  .admin-bg-dots {
    position:relative;
  }
  .admin-bg-dots::before {
    content:'';
    position:absolute; inset:0;
    background-image: radial-gradient(circle, rgba(236,235,224,0.055) 1px, transparent 1px);
    background-size: 24px 24px;
    pointer-events:none; z-index:0;
    border-radius:inherit;
  }

  /* ── FONTS ── */
  .aroot, .aroot * { font-family:'DM Sans',system-ui,sans-serif !important; }
  .aroot .mono, .aroot code, .aroot pre { font-family:'DM Mono','Fira Mono',monospace !important; }
  .aroot .stat-num { font-family:'DM Mono','Fira Mono',monospace !important; }

  /* ── SCROLLBAR ── */
  /* Outer panel never scrolls — hide its scrollbar completely */
  .adash { scrollbar-width:none; overflow:hidden; }
  .adash::-webkit-scrollbar { display:none; }
  /* Inner content area (other tabs that need scroll) */
  .adash-scroll { scrollbar-width:thin; scrollbar-color:rgba(251,103,11,0.18) transparent; }
  .adash-scroll::-webkit-scrollbar { width:3px; }
  .adash-scroll::-webkit-scrollbar-thumb { background:rgba(251,103,11,0.18); border-radius:2px; }
  .adash-scroll::-webkit-scrollbar-track { background:transparent; }

  /* ── KEYFRAMES ── */
  @keyframes spin       { to { transform:rotate(360deg); } }
  @keyframes pulse      { 0%,100%{opacity:1} 50%{opacity:.3} }
  @keyframes fadeUp     { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn     { from{opacity:0} to{opacity:1} }
  @keyframes slideIn    { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
  @keyframes barGrow    { from{width:0} }
  @keyframes scanline   { 0%{top:-8%;} 100%{top:108%;} }
  @keyframes counterUp  { from{transform:translateY(8px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes glow       { 0%,100%{box-shadow:0 0 0 0 rgba(251,103,11,0)} 50%{box-shadow:0 0 20px 2px rgba(251,103,11,0.18)} }
  @keyframes shimmer    { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  @keyframes borderGlow { 0%,100%{border-color:rgba(251,103,11,0.20)} 50%{border-color:rgba(251,103,11,0.45)} }
  @keyframes float      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  @keyframes ripple     { 0%{transform:scale(0);opacity:0.5} 100%{transform:scale(3);opacity:0} }
  @keyframes gradShift  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

  /* ── PANEL ENTER ── */
  .panel-enter { animation:fadeUp 0.36s cubic-bezier(0.16,1,0.3,1) both; }
  .card-enter  { animation:fadeUp 0.28s cubic-bezier(0.16,1,0.3,1) both; }
  .card-enter:nth-child(1) { animation-delay:0.04s; }
  .card-enter:nth-child(2) { animation-delay:0.08s; }
  .card-enter:nth-child(3) { animation-delay:0.12s; }
  .card-enter:nth-child(4) { animation-delay:0.16s; }
  .bar-fill    { animation:barGrow 0.70s cubic-bezier(0.16,1,0.3,1) both; }
  .tab-content { animation:fadeUp 0.22s ease both; }
  .slide-in    { animation:slideIn 0.24s ease both; }

  /* ── CARD HOVER ── */
  .card-hover {
    transition:border-color 0.16s ease, transform 0.16s ease, box-shadow 0.16s ease;
    cursor:default;
  }
  .card-hover:hover {
    border-color:rgba(251,103,11,0.20) !important;
    transform:translateY(-1px);
    box-shadow:0 4px 16px rgba(0,0,0,0.22), 0 0 0 1px rgba(251,103,11,0.06) !important;
  }

  /* ── TABS ── */
  .tab-btn {
    position:relative;
    transition:color 0.14s ease, border-color 0.14s ease;
    border-radius:0;
    display:flex; align-items:center; gap:6px;
    border-bottom:2px solid transparent;
    margin-bottom:-1px;
  }
  .tab-btn:hover { background:transparent; color:rgba(236,235,224,0.85) !important; }
  .tab-btn.active {
    background:transparent;
    color:${P.orange} !important;
    border-bottom-color:${P.orange};
  }
  .tab-btn.active::after { display:none; }

  /* ── BUTTONS ── */
  .btn-base {
    transition:opacity 0.13s ease, background 0.13s ease,
               transform 0.10s ease, box-shadow 0.13s ease;
    cursor:pointer;
  }
  .btn-base:hover:not(:disabled)  { opacity:0.88; }
  .btn-base:active:not(:disabled) { transform:scale(0.95); }

  .btn-primary {
    background:${P.orange};
    color:#fff;
    border:none;
    box-shadow:0 2px 12px ${P.orange}35;
    transition:all 0.14s ease;
  }
  .btn-primary:hover { background:${P.orangeDark}; box-shadow:0 4px 20px ${P.orange}50; }

  /* ── ROW HOVER ── */
  .row-hover { transition:background 0.09s ease; }
  .row-hover:hover { background:rgba(251,103,11,0.04) !important; }

  /* ── PERIOD PILLS ── */
  .period-btn {
    padding:4px 11px; border-radius:7px; font-size:11px; font-weight:500;
    cursor:pointer; transition:all 0.13s ease; white-space:nowrap;
    border:1px solid transparent; background:transparent;
    color:rgba(236,235,224,0.35); letter-spacing:0.01em;
  }
  .period-btn:hover  { color:rgba(236,235,224,0.75); background:rgba(236,235,224,0.05); }
  .period-btn.active {
    background:rgba(251,103,11,0.12);
    border-color:rgba(251,103,11,0.28);
    color:${P.orange};
    box-shadow:0 0 12px rgba(251,103,11,0.15);
  }

  .period-date-input {
    background:rgba(236,235,224,0.05); border:1px solid rgba(236,235,224,0.10);
    border-radius:7px; padding:4px 9px; color:rgba(236,235,224,0.85);
    font-size:11px; outline:none; cursor:pointer;
    transition:border-color 0.13s ease, box-shadow 0.13s ease; color-scheme:dark;
  }
  .period-date-input:focus {
    border-color:rgba(251,103,11,0.40);
    box-shadow:0 0 0 3px rgba(251,103,11,0.08);
  }

  .period-apply {
    padding:4px 13px; border-radius:7px; font-size:11px; font-weight:600;
    cursor:pointer; background:${P.orange}; color:#fff; border:none;
    box-shadow:0 2px 8px ${P.orange}35;
    transition:all 0.13s ease;
  }
  .period-apply:disabled { background:rgba(236,235,224,0.07); color:rgba(236,235,224,0.20); cursor:not-allowed; box-shadow:none; }
  .period-apply:hover:not(:disabled) { background:${P.orangeDark}; transform:translateY(-1px); }

  /* ── INPUT AUTOFILL ── */
  input:-webkit-autofill {
    -webkit-box-shadow:0 0 0 100px ${P.bg} inset !important;
    -webkit-text-fill-color:rgba(236,235,224,0.9) !important;
  }

  /* ── SCANLINE (login) ── */
  .scanline-wrap { position:relative; overflow:hidden; }
  .scanline-wrap::after {
    content:''; position:absolute; left:0; right:0; height:8%;
    background:linear-gradient(transparent,rgba(251,103,11,0.04),transparent);
    animation:scanline 5s linear infinite; pointer-events:none;
  }

  /* ── SKELETON ── */
  .skel {
    background:linear-gradient(90deg,rgba(236,235,224,0.04) 25%,rgba(236,235,224,0.09) 50%,rgba(236,235,224,0.04) 75%);
    background-size:400px 100%;
    animation:shimmer 1.5s ease infinite;
    border-radius:6px;
  }

  /* ── KPI GLOW ── */
  .kpi-glow:hover { box-shadow:0 0 0 1px rgba(251,103,11,0.15), 0 8px 32px rgba(0,0,0,0.5) !important; }

  /* ── STAT NUM ── */
  .stat-num-anim { animation:counterUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }

  /* ── GRADIENT BORDER CARD ── */
  .grad-border {
    position:relative;
    background:${P.surface};
    border-radius:12px;
  }
  .grad-border::before {
    content:''; position:absolute; inset:-1px;
    border-radius:13px;
    background:linear-gradient(135deg, rgba(251,103,11,0.22), rgba(236,235,224,0.06) 50%, rgba(251,103,11,0.08));
    z-index:-1;
    transition:opacity 0.2s ease;
    opacity:0;
  }
  .grad-border:hover::before { opacity:1; }

  /* ── ORANGE BADGE ── */
  .badge-glow {
    box-shadow:0 0 12px rgba(251,103,11,0.35);
    animation:glow 3s ease infinite;
  }

  /* ── INPUT FOCUS ── */
  .input-field {
    width:100%;
    background:${P.surface2};
    border:1px solid ${P.border};
    border-radius:9px;
    padding:11px 42px 11px 14px;
    color:${P.text};
    font-size:12px;
    outline:none;
    box-sizing:border-box;
    transition:border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .input-field:focus {
    border-color:rgba(251,103,11,0.40);
    box-shadow:0 0 0 3px rgba(251,103,11,0.08);
  }

  /* ── STAT CARD GRADIENT ── */
  .stat-card-inner {
    position:relative;
    overflow:hidden;
  }
  .stat-card-inner::after {
    content:''; position:absolute;
    top:-30px; right:-30px;
    width:100px; height:100px;
    border-radius:50%;
    background:radial-gradient(circle, var(--accent-color, rgba(251,103,11,0.10)) 0%, transparent 70%);
    pointer-events:none;
  }

  /* ── RESPONSIVE ── */
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

  /* ── LIGHT THEME: Executive B2B SaaS style ─────────────────────────── */
  [data-theme="light"] .admin-overlay {
    background: rgba(0,0,0,0.40);
    backdrop-filter: blur(16px) saturate(120%);
    -webkit-backdrop-filter: blur(16px) saturate(120%);
  }
  /* No dot grid in light mode — cleaner */
  [data-theme="light"] .admin-bg-dots::before {
    display: none;
  }
  /* Panel: clean white, minimal shadow */
  [data-theme="light"] .adash {
    box-shadow: 0 8px 40px rgba(0,0,0,0.12), 0 0 0 1px #E5E7EB !important;
    scrollbar-color: rgba(251,103,11,0.22) transparent;
  }
  /* Header: solid white, clean border */
  [data-theme="light"] .dash-header {
    background: #FFFFFF !important;
    border-bottom: 1px solid #E5E7EB !important;
    box-shadow: none !important;
  }
  /* Remove orange accent bar in header for light mode */
  [data-theme="light"] .dash-header > div:first-child {
    display: none !important;
  }
  /* Tabs row: white bg, underline style */
  [data-theme="light"] .tabs-row {
    background: #FFFFFF !important;
    border-bottom: 1px solid #E5E7EB !important;
    padding: 0 22px !important;
    gap: 0 !important;
  }
  [data-theme="light"] .tab-btn {
    border-radius: 0 !important;
    padding: 13px 16px !important;
    font-weight: 500 !important;
    color: #6B7280 !important;
    border: none !important;
    border-bottom: 2px solid transparent !important;
    margin-bottom: -1px !important;
    background: transparent !important;
  }
  [data-theme="light"] .tab-btn:hover:not(.active) {
    background: transparent !important;
    color: #111827 !important;
  }
  [data-theme="light"] .tab-btn.active {
    background: transparent !important;
    color: #111827 !important;
    border-bottom: 2px solid #FB670B !important;
    font-weight: 600 !important;
    box-shadow: none !important;
  }
  [data-theme="light"] .tab-btn.active::after { display: none !important; }
  /* Content: flat off-white background */
  [data-theme="light"] .dash-content {
    background: #F8F9FB !important;
  }
  /* Cards: white, 1px border, minimal shadow */
  [data-theme="light"] .card-hover {
    background: #FFFFFF !important;
    border-color: #E5E7EB !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important;
  }
  [data-theme="light"] .card-hover:hover {
    border-color: rgba(251,103,11,0.20) !important;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
    transform: translateY(-1px);
  }
  /* Stat cards: clean white */
  [data-theme="light"] .stat-card-inner {
    background: #FFFFFF !important;
    border-color: #E5E7EB !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important;
  }
  [data-theme="light"] .stat-num {
    font-size: 38px !important;
    letter-spacing: -0.03em !important;
  }
  /* Bar chart: clean tracks */
  [data-theme="light"] .bar-track {
    border-radius: 4px !important;
    background: #F3F4F6 !important;
  }
  [data-theme="light"] .bar-fill { border-radius: 3px !important; }
  /* Skeleton shimmer */
  [data-theme="light"] .skel {
    background: linear-gradient(90deg, #F3F4F6 25%, #E9EAEC 50%, #F3F4F6 75%);
    background-size: 400px 100%;
    animation: shimmer 1.5s ease infinite;
  }
  /* Period selector */
  [data-theme="light"] .period-btn { color: #9CA3AF; }
  [data-theme="light"] .period-btn:hover { color: #374151; background: #F3F4F6; }
  [data-theme="light"] .period-btn.active {
    background: rgba(251,103,11,0.08); border-color: rgba(251,103,11,0.25);
    color: #FB670B; box-shadow: none;
  }
  [data-theme="light"] .period-date-input {
    background: #F8F9FB; border-color: #E5E7EB;
    color: #374151; color-scheme: light;
  }
  [data-theme="light"] .period-date-input:focus {
    border-color: rgba(251,103,11,0.40); box-shadow: 0 0 0 3px rgba(251,103,11,0.08);
  }
  /* Table rows */
  [data-theme="light"] .row-hover:hover { background: #F9FAFB !important; }
  /* Inputs */
  [data-theme="light"] .input-field {
    background: #FFFFFF; border-color: #E5E7EB; color: #111827;
  }
  [data-theme="light"] .input-field:focus {
    border-color: rgba(251,103,11,0.40); box-shadow: 0 0 0 3px rgba(251,103,11,0.08);
  }
  [data-theme="light"] .grad-border { background: #FFFFFF; }
  [data-theme="light"] .kpi-glow:hover {
    box-shadow: 0 0 0 1px rgba(251,103,11,0.15), 0 4px 16px rgba(0,0,0,0.08) !important;
  }
  [data-theme="light"] input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px #FFFFFF inset !important;
    -webkit-text-fill-color: #111827 !important;
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
  { id:'24h',   label:'24h',  getRange:()=>({ from:toYMD(addDays(new Date(),-1)),  to:toYMD(new Date()) }) },
  { id:'7d',    label:'7D',   getRange:()=>({ from:toYMD(addDays(new Date(),-6)),  to:toYMD(new Date()) }) },
  { id:'28d',   label:'28D',  getRange:()=>({ from:toYMD(addDays(new Date(),-27)), to:toYMD(new Date()) }) },
  { id:'3m',    label:'3M',   getRange:()=>({ from:toYMD(addDays(new Date(),-89)), to:toYMD(new Date()) }) },
  { id:'all',   label:'Todo', getRange:()=>({ from:toYMD(addDays(new Date(),-487)),to:toYMD(new Date()) }) },
  { id:'custom',label:'↔',   getRange:()=>null },
];

// ── ICONS (modernos, limpios) ─────────────────────────────────────────────────
const Icons = {
  lock:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  edit:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  eye:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  check:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  alert:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  sync:     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  close:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  chevron:  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  download: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  users:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  bar:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  sparkle:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>,
  file:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  truck:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 6v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  recruit:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>,
  pause:    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  play:     <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  trash:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
};

// ── MICRO COMPONENTS ──────────────────────────────────────────────────────────
const Dot = ({ active, color: _color }) => {
  const P = useP(); const color = _color || P.orange;
  return <span style={{ width:6, height:6, borderRadius:'50%', background:active ? color : P.textMuted,
    display:'inline-block', flexShrink:0, boxShadow:active ? `0 0 8px ${color}` : 'none',
    animation:active ? 'pulse 2.2s infinite' : 'none' }}/>;
};

const Tag = ({ children, color: _color, size=10 }) => {
  const P = useP(); const color = _color || P.orange;
  return <span style={{ display:'inline-flex', alignItems:'center', padding:'2px 8px', borderRadius:5,
    fontSize:size, fontWeight:600, letterSpacing:'0.03em', background:`${color}16`, color,
    border:`1px solid ${color}28`, lineHeight:1.5, whiteSpace:'nowrap' }}>{children}</span>;
};

const OrangeBar = ({ width='100%', height=1, opacity=0.40 }) => {
  const P = useP();
  return <div style={{ width, height, background:`linear-gradient(90deg,${P.orange},${P.orangeWarm},transparent)`, opacity, flexShrink:0, borderRadius:1 }}/>;
};

// ── SPINNER ───────────────────────────────────────────────────────────────────
function Spinner() {
  const P = useP();
  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', padding:'80px 0', flexDirection:'column', gap:16 }}>
      <div style={{ position:'relative', width:36, height:36 }}>
        <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:`2px solid ${P.border}` }}/>
        <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:`2px solid transparent`,
          borderTop:`2px solid ${P.orange}`, animation:'spin 0.70s linear infinite',
          boxShadow:`0 0 10px ${P.orange}40` }}/>
      </div>
      <span style={{ color:P.textDim, fontSize:11, letterSpacing:'0.10em', textTransform:'uppercase', fontWeight:500 }}>Cargando</span>
    </div>
  );
}

// ── SKELETON CARDS ────────────────────────────────────────────────────────────
function SkeletonCard() {
  const P = useP();
  return (
    <div style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:12, padding:'18px 20px' }}>
      <div className="skel" style={{ height:10, width:'40%', marginBottom:16 }}/>
      <div className="skel" style={{ height:36, width:'55%', marginBottom:10 }}/>
      <div className="skel" style={{ height:9, width:'32%' }}/>
    </div>
  );
}

// ── BAR CHART ─────────────────────────────────────────────────────────────────
function BarChart({ data=[], color: _color, max=8 }) {
  const P = useP(); const color = _color || P.orange;
  const sorted = [...data].sort((a,b)=>b.value-a.value).slice(0,max);
  const mv     = sorted[0]?.value || 1;
  if (!sorted.length)
    return <div style={{ textAlign:'center', padding:'44px 0', color:P.textDim, fontSize:11 }}>Sin datos disponibles</div>;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
      {sorted.map((item,i) => {
        const pct=Math.round((item.value/mv)*100), isTop=i===0;
        return (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:9, padding:'6px 8px',
            borderRadius:7, transition:'background 0.1s ease', cursor:'default' }}
            onMouseEnter={e=>e.currentTarget.style.background=`${P.orange}06`}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <span className="mono" style={{ color:isTop?P.orange:P.textDim, fontSize:10, width:16, textAlign:'right', flexShrink:0, fontWeight:isTop?600:400 }}>{i+1}</span>
            <span style={{ color:P.textSub, fontSize:11, width:96, textAlign:'right', flexShrink:0, overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis' }}>{item.label}</span>
            <div className="bar-track" style={{ flex:1, position:'relative', height:isTop?8:6, background:P.border2, borderRadius:4, overflow:'hidden' }}>
              <div className="bar-fill" style={{ width:`${pct}%`, height:'100%', borderRadius:4,
                background:isTop ? `linear-gradient(90deg,${P.orange},${P.orangeWarm})` : `${color}60`,
                animationDelay:`${i*0.04}s`,
                boxShadow:isTop?`0 0 8px ${P.orange}50`:'none' }}/>
            </div>
            <span className="mono" style={{ color:isTop?P.orange:P.text, fontSize:11, fontWeight:isTop?600:500, width:30, textAlign:'right', flexShrink:0 }}>{item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── LINE CHART ────────────────────────────────────────────────────────────────
function LineChart({ daily }) {
  const P = useP();
  const entries = Object.entries(daily||{}).sort(([a],[b])=>a.localeCompare(b)).slice(-14);
  if (entries.length < 2)
    return <div style={{ textAlign:'center', padding:'44px 0', color:P.textDim, fontSize:11 }}>Se necesitan al menos 2 días de datos</div>;
  const vals   = entries.map(([,v])=>v.messages||0);
  const waVals = entries.map(([,v])=>v.wa||0);
  const mv=Math.max(...vals,...waVals,1), mn=0;
  const W=440, H=80, step=W/(vals.length-1);
  const py = v => H - ((v-mn)/Math.max(mv-mn,1))*(H-16) - 8;
  const pts    = vals.map((v,i)=>({ x:i*step, y:py(v) }));
  const waPts  = waVals.map((v,i)=>({ x:i*step, y:py(v) }));
  const pathD  = pts.map((p,i)=>`${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const waPath = waPts.map((p,i)=>`${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaD  = `${pathD} L${W},${H+4} L0,${H+4} Z`;
  return (
    <svg width="100%" viewBox={`-4 -4 ${W+8} ${H+58}`} style={{ display:'block' }}>
      <defs>
        <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={P.orange} stopOpacity="0.22"/>
          <stop offset="100%" stopColor={P.orange} stopOpacity="0"/>
        </linearGradient>
        <filter id="lglow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {[0.25,0.5,0.75,1].map(p=><line key={p} x1={0} y1={H-p*(H-16)-8} x2={W} y2={H-p*(H-16)-8} stroke={P.border} strokeWidth="1"/>)}
      <path d={areaD} fill="url(#ag1)"/>
      <path d={pathD} fill="none" stroke={P.orange} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" filter="url(#lglow)"/>
      <path d={waPath} fill="none" stroke={P.grayMid} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="4,3"/>
      {pts.map((p,i)=>(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill={P.bg} stroke={P.orange} strokeWidth="2"/>
          <circle cx={p.x} cy={p.y} r="1.5" fill={P.orange}/>
          <text x={p.x} y={H+36} textAnchor="middle" fill={P.textDim} fontSize="9" fontFamily="DM Sans,system-ui">{entries[i][0].slice(5)}</text>
        </g>
      ))}
      <g>
        <circle cx={10} cy={H+52} r="3.5" fill={P.orange}/>
        <text x={18} y={H+55.5} fill={P.textSub} fontSize="9" fontFamily="DM Sans,system-ui">Mensajes</text>
        <line x1={82} y1={H+52} x2={96} y2={H+52} stroke={P.grayMid} strokeWidth="1.5" strokeDasharray="3,2"/>
        <text x={100} y={H+55.5} fill={P.textSub} fontSize="9" fontFamily="DM Sans,system-ui">WhatsApp</text>
      </g>
    </svg>
  );
}

// ── SC LINE CHART (Google Search Console) — multi-métrica ────────────────────
const SC_METRIC_CFG = {
  clicks:      { color:'#4285F4', label:'Clics' },
  impressions: { color:'#9333EA', label:'Impresiones' },
  ctr:         { color:'#34A853', label:'CTR' },
  position:    { color:'#FB670B', label:'Posición' },
};

function SCLineChart({ dailyClicks, fill, activeMetrics }) {
  const P = useP();
  const entries = dailyClicks || [];
  if (entries.length < 2) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:P.textDim,fontSize:11}}>Sin datos de Search Console</div>
  );
  const metrics = (activeMetrics && activeMetrics.length > 0) ? activeMetrics : ['clicks'];
  const n = entries.length;
  const W = 440, H = 100;
  const step = n > 1 ? W / (n-1) : W;
  const showDots = n <= 28;
  const labelEvery = n > 60 ? Math.ceil(n/6) : n > 28 ? 7 : 1;

  const renderLine = (metricId) => {
    const cfg = SC_METRIC_CFG[metricId] || { color:'#4285F4', label:metricId };
    const vals = entries.map(d => d[metricId] || 0);
    const mv = Math.max(...vals, 1);
    const py = v => H - ((v/mv) * (H-16)) - 8;
    const pts = vals.map((v,i) => ({ x: i*step, y: py(v) }));
    const pathD = pts.map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const isSingle = metrics.length === 1;
    const areaD = isSingle ? `${pathD} L${W},${H+2} L0,${H+2} Z` : null;
    const sw = n > 60 ? 1.5 : 2;
    return (
      <g key={metricId}>
        {isSingle && (
          <defs>
            <linearGradient id={`ag_${metricId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={cfg.color} stopOpacity="0.18"/>
              <stop offset="100%" stopColor={cfg.color} stopOpacity="0"/>
            </linearGradient>
          </defs>
        )}
        {isSingle && areaD && <path d={areaD} fill={`url(#ag_${metricId})`}/>}
        <path d={pathD} fill="none" stroke={cfg.color} strokeWidth={sw}
          strokeLinejoin="round" strokeLinecap="round"/>
        {showDots && pts.map((p,i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="2.5" fill={P.bg} stroke={cfg.color} strokeWidth="1.5"/>
            <circle cx={p.x} cy={p.y} r="1" fill={cfg.color}/>
          </g>
        ))}
      </g>
    );
  };

  // viewBox: just chart + date labels — legend lives ABOVE as HTML
  return (
    <div style={{ display:'flex', flexDirection:'column', width:'100%', height: fill ? '100%' : 'auto', minHeight:0, gap:6 }}>
      {/* Legend at TOP — HTML so it never affects SVG sizing */}
      <div style={{ display:'flex', gap:14, flexWrap:'wrap', flexShrink:0, paddingLeft:2 }}>
        {metrics.map(m => {
          const cfg = SC_METRIC_CFG[m] || { color:'#4285F4', label:m };
          return (
            <div key={m} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ width:10, height:3, borderRadius:2, background:cfg.color, flexShrink:0 }}/>
              <span style={{ color:P.textSub, fontSize:9, fontFamily:"'DM Sans',sans-serif" }}>{cfg.label}</span>
            </div>
          );
        })}
      </div>
      {/* Chart SVG — fills remaining space, fixed viewBox ratio */}
      <svg style={{ flex:1, minHeight:0, display:'block', width:'100%', overflow:'visible' }}
        viewBox={`-8 -4 ${W+16} ${H+28}`}
        preserveAspectRatio="xMidYMid meet">
        {[0.25,0.5,0.75,1].map(p => (
          <line key={p} x1={0} y1={H-p*(H-16)-8} x2={W} y2={H-p*(H-16)-8} stroke={P.border} strokeWidth="1"/>
        ))}
        {metrics.map(m => renderLine(m))}
        {entries.map((e,i) => (
          i % labelEvery === 0 &&
          <text key={i} x={(i*step).toFixed(1)} y={H+20} textAnchor="middle" fill={P.textDim} fontSize="9" fontFamily="DM Sans,system-ui">{e.date.slice(5)}</text>
        ))}
      </svg>
    </div>
  );
}

// ── DONUT CHART ───────────────────────────────────────────────────────────────
function DonutChart({ intents }) {
  const P = useP();
  const COLORS = [P.orange, P.grayLight, P.grayMid, P.gray, P.creamDark];
  const LABELS = { compra:'Compra', pdf:'PDF', info:'Info', reclutamiento:'Empleo', otro:'Consulta General' };
  const ents   = Object.entries(intents||{}).filter(([,v])=>v>0);
  const total  = ents.reduce((s,[,v])=>s+v,0)||1;
  let cumul=0;
  const R=42, CX=54, CY=54;
  const polar = pct => { const a=pct*2*Math.PI-Math.PI/2; return [CX+R*Math.cos(a), CY+R*Math.sin(a)]; };
  const slices = ents.map(([key,val])=>{ const pct=val/total, start=cumul; cumul+=pct; return {key,val,pct,start}; });
  return (
    <div style={{ display:'flex', alignItems:'center', gap:24, flexWrap:'wrap' }}>
      <svg width={108} height={108} viewBox="0 0 108 108" style={{ flexShrink:0 }}>
        {slices.length===0
          ? <circle cx={CX} cy={CY} r={R} fill={P.border2} stroke={P.border} strokeWidth="1.5"/>
          : slices.map(({key,pct,start},i) => {
              const [x1,y1]=polar(start+0.004), [x2,y2]=polar(start+pct-0.004);
              return <path key={key} d={`M${CX},${CY} L${x1},${y1} A${R},${R} 0 ${pct>.5?1:0},1 ${x2},${y2} Z`}
                fill={COLORS[i%COLORS.length]} opacity="0.90"/>;
            })}
        <circle cx={CX} cy={CY} r={30} fill={P.bg}/>
        <circle cx={CX} cy={CY} r={30} fill="none" stroke={P.border} strokeWidth="1.5"/>
        <text x={CX} y={CY-8} textAnchor="middle" fill={P.textDim} fontSize="7.5" fontFamily="DM Sans,system-ui" letterSpacing="0.1em">TOTAL</text>
        <text x={CX} y={CY+13} textAnchor="middle" fill={P.text} fontSize="22" fontFamily="DM Mono,monospace" fontWeight="500">{total}</text>
      </svg>
      <div style={{ display:'flex', flexDirection:'column', gap:8, flex:1, minWidth:130 }}>
        {ents.map(([key,val],i)=>{ const color=COLORS[i%COLORS.length], pct=Math.round((val/total)*100); return (
          <div key={key} style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:3, height:14, borderRadius:2, background:color, flexShrink:0, opacity:0.9 }}/>
            <span style={{ color:P.textSub, fontSize:11, flex:1 }}>{LABELS[key]||key}</span>
            <span className="mono" style={{ color:P.text, fontSize:11, fontWeight:600 }}>{val}</span>
            <span className="mono" style={{ color:P.textDim, fontSize:10, width:32, textAlign:'right' }}>{pct}%</span>
          </div>
        ); })}
        {!ents.length&&<span style={{ color:P.textDim, fontSize:11 }}>Sin datos</span>}
      </div>
    </div>
  );
}

// ── LEADS LINE + BAR CHART ────────────────────────────────────────────────────
function LeadsLineChart({ leads }) {
  const P = useP();
  if (!leads.length) return null;

  // Parseo correcto de fechas (igual que parseTursoDate)
  const byDay = {};
  leads.forEach(l => {
    if (!l.ts) return;
    const iso = String(l.ts).trim().replace(' ', 'T') + (String(l.ts).includes('Z') ? '' : 'Z');
    const d = new Date(iso);
    if (isNaN(d.getTime())) return;
    const key = d.toLocaleString('en-CA', { timeZone: 'America/Mexico_City' }).split(',')[0];
    if (key) byDay[key] = (byDay[key] || 0) + 1;
  });

  const entries = Object.entries(byDay).sort(([a],[b]) => a.localeCompare(b)).slice(-14);
  if (!entries.length) return <div style={{ textAlign:'center', padding:'32px 0', color:P.textDim, fontSize:11 }}>Sin datos de registros</div>;

  const vals = entries.map(([,v]) => v);
  const mv   = Math.max(...vals, 1);
  const n    = entries.length;
  const W=440, H=80, PT=10, PB=30, GAP=4;
  const barW = n === 1 ? 40 : Math.max((W - GAP*(n-1)) / n, 8);
  const step = n === 1 ? W/2 : (W - barW) / Math.max(n-1, 1);
  const bx   = i => n === 1 ? (W - barW) / 2 : i * step;
  const bh   = v  => Math.max((v / mv) * (H - PT), 4);
  const cy   = v  => H - bh(v) + PT;  // top of bar
  // line path through bar centers
  const pts  = vals.map((v, i) => ({ x: bx(i) + barW/2, y: cy(v) }));
  const pathD = pts.map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const maxIdx = vals.indexOf(Math.max(...vals));

  return (
    <svg width="100%" viewBox={`-6 -6 ${W+12} ${H+PB+16}`} style={{ display:'block', overflow:'visible' }}>
      <defs>
        <linearGradient id="lg2a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={P.orange} stopOpacity="0.80"/>
          <stop offset="100%" stopColor={P.orange} stopOpacity="0.35"/>
        </linearGradient>
        <linearGradient id="lg2b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={P.orange} stopOpacity="0.22"/>
          <stop offset="100%" stopColor={P.orange} stopOpacity="0"/>
        </linearGradient>
        <filter id="barGlow2"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* Grid lines */}
      {[0.25,0.5,0.75,1].map(p=>(
        <line key={p} x1={0} y1={(H - (H-PT)*p + PT).toFixed(1)} x2={W} y2={(H - (H-PT)*p + PT).toFixed(1)}
          stroke={P.border} strokeWidth="1" strokeDasharray={p===1?'none':'3,3'}/>
      ))}

      {/* Bars */}
      {entries.map(([,v],i)=>{
        const x=bx(i), h=bh(v), y=H-h+PT, isMax=i===maxIdx;
        return (
          <g key={i}>
            {isMax && <rect x={(x-2).toFixed(1)} y={(y-4).toFixed(1)} width={(barW+4).toFixed(1)} height={(h+4).toFixed(1)}
              fill={P.orange} fillOpacity="0.08" rx="6"/>}
            <rect x={x.toFixed(1)} y={y.toFixed(1)} width={barW.toFixed(1)} height={h.toFixed(1)}
              fill={isMax ? 'url(#lg2a)' : P.border2} rx="5"
              filter={isMax ? 'url(#barGlow2)' : 'none'}/>
          </g>
        );
      })}

      {/* Area + line */}
      {n > 1 && <>
        <path d={`${pathD} L${pts[n-1].x.toFixed(1)},${H+PT} L${pts[0].x.toFixed(1)},${H+PT} Z`} fill="url(#lg2b)"/>
        <path d={pathD} fill="none" stroke={P.orange} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      </>}

      {/* Dots + values */}
      {pts.map((p,i)=>{
        const isMax=i===maxIdx;
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={isMax?4.5:3} fill={P.bg} stroke={P.orange} strokeWidth="2"/>
            <circle cx={p.x} cy={p.y} r={isMax?2:1.2} fill={P.orange}/>
            {isMax && <text x={p.x} y={(p.y-8).toFixed(1)} textAnchor="middle"
              fill={P.orange} fontSize="10" fontWeight="700" fontFamily="DM Mono,monospace">{vals[i]}</text>}
          </g>
        );
      })}

      {/* Date labels — mostrar cada 2 para no saturar */}
      {entries.map(([date],i)=>{
        if(n > 7 && i % 2 !== 0 && i !== n-1) return null;
        return <text key={i} x={(bx(i)+barW/2).toFixed(1)} y={H+PT+18} textAnchor="middle"
          fill={P.textDim} fontSize="8.5" fontFamily="DM Sans,system-ui">{date.slice(5)}</text>;
      })}

      {/* Y-axis: max label */}
      <text x={-4} y={(PT+4).toFixed(1)} textAnchor="end" fill={P.textDim} fontSize="8" fontFamily="DM Sans,system-ui">{mv}</text>
      <text x={-4} y={(H+PT).toFixed(1)} textAnchor="end" fill={P.textDim} fontSize="8" fontFamily="DM Sans,system-ui">0</text>
    </svg>
  );
}

// ── STAT CARD ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color: _color, icon, trend, small }) {
  const P = useP(); const color = _color || P.orange;
  const [disp, setDisp] = useState(0);
  const [key, setKey]   = useState(0);
  const target = typeof value==='number' ? value : 0;
  useEffect(()=>{
    setKey(k=>k+1);
    if (!target) { setDisp(0); return; }
    const dur=750, t0=Date.now();
    const tick=()=>{ const p=Math.min((Date.now()-t0)/dur,1), e=1-Math.pow(1-p,3); setDisp(Math.round(target*e)); if(p<1)requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  },[target]);
  const trendPos=trend>0, trendNeg=trend<0;
  return (
    <div className="card-enter card-hover kpi-glow stat-card-inner"
      style={{ '--accent-color':`${color}18`,
        background: P.surface,
        border:`1px solid ${P.border}`,
        borderRadius: small?9:12, padding: small?'10px 13px':'20px 22px',
        position:'relative', overflow:'hidden', cursor:'default',
        boxShadow:`0 1px 3px rgba(0,0,0,0.06)` }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'2.5px', background:color, opacity:0.6 }}/>
      <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%',
        background:`radial-gradient(circle, ${color}10 0%, transparent 70%)`, pointerEvents:'none' }}/>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom: small?5:12 }}>
        <span style={{ color:P.textDim, fontSize: small?9:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.10em' }}>{label}</span>
        {icon && <span style={{ fontSize: small?12:15, opacity:0.22 }}>{icon}</span>}
      </div>
      <p key={key} className="stat-num stat-num-anim"
        style={{ color:P.text, fontSize: small?24:36, marginBottom: small?4:8, fontFamily:"'DM Mono',monospace", fontWeight:500, letterSpacing:'-0.02em' }}>
        {typeof value==='number' ? disp.toLocaleString('es-MX') : (value??'—')}
      </p>
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        {sub && <span style={{ color:P.textDim, fontSize: small?9:11 }}>{sub}</span>}
        {trend!==undefined && trend!==0 && (
          <span className="mono" style={{ fontSize:9, fontWeight:600, padding:'2px 6px', borderRadius:5,
            background:trendPos?P.okDim:trendNeg?P.errDim:P.warnDim,
            color:trendPos?P.orange:trendNeg?P.grayMid:P.textDim,
            border:`1px solid ${trendPos?P.orange+'25':P.border}` }}>
            {trend>0?'+':''}{trend}
          </span>
        )}
      </div>
    </div>
  );
}

// ── SECTION LABEL ─────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  const P = useP();
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
      <span style={{ color:P.textSub, fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.10em', flexShrink:0 }}>{children}</span>
      <div style={{ flex:1, height:1, background:P.border }}/>
    </div>
  );
}

// ── EYE ICON ──────────────────────────────────────────────────────────────────
function EyeIcon({ open }) { return open ? Icons.eye : Icons.eyeOff; }

// ── NOTIFY CONFIG SECTION ─────────────────────────────────────────────────────
function NotifyConfigSection({ theme, P }) {
  const [configs,   setConfigs]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [newName,   setNewName]   = useState('');
  const [newPhone,  setNewPhone]  = useState('');
  const [testingId, setTestingId] = useState(null);
  const [toast,     setToast]     = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    try {
      const r = await fetch('/api/reports/notify-config', { credentials:'include' });
      const j = await r.json();
      if (j.ok) setConfigs(j.configs || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    const name  = newName.trim();
    const phone = newPhone.trim().replace(/\D/g, '');
    if (!name || !phone) return;
    setSaving(true);
    try {
      const r = await fetch('/api/reports/notify-config', {
        method: 'POST', credentials:'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', name, phones: [{ phone, name }], active: true }),
      });
      const j = await r.json();
      if (j.ok) { setNewName(''); setNewPhone(''); await load(); showToast('Notificación configurada'); }
      else showToast(j.error || 'Error al guardar', false);
    } catch (e) { showToast(e.message, false); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await fetch('/api/reports/notify-config', {
      method: 'POST', credentials:'include', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    });
    await load();
  };

  const handleToggle = async (cfg) => {
    await fetch('/api/reports/notify-config', {
      method: 'POST', credentials:'include', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', id: cfg.id, name: cfg.name, phones: cfg.phones, active: !cfg.active }),
    });
    await load();
  };

  const handleTest = async (cfg) => {
    setTestingId(cfg.id);
    try {
      const r = await fetch('/api/reports/notify-config', {
        method: 'POST', credentials:'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test', id: cfg.id, phones: cfg.phones }),
      });
      const j = await r.json();
      showToast(j.ok ? 'Prueba enviada' : (j.error || 'Error en prueba'), j.ok);
    } catch (e) { showToast(e.message, false); }
    setTestingId(null);
  };

  const inp = {
    background: P.surface2, border: `1px solid ${P.border}`, borderRadius: 8,
    color: P.text, fontSize: 12, padding: '7px 10px', outline: 'none',
    fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.13s ease',
  };

  return (
    <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 12,
      padding: '18px 20px', position: 'relative', overflow: 'hidden',
      boxShadow: `0 2px 16px rgba(0,0,0,0.35)` }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2.5,
        background: 'linear-gradient(90deg,#22C55E,#16A34A,transparent)', opacity: 0.7 }}/>
      {toast && (
        <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 10, padding: '7px 14px',
          borderRadius: 8, background: toast.ok ? '#16A34A' : '#DC2626', color: '#fff',
          fontSize: 11, fontWeight: 600, boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0, color: '#22C55E' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: P.text, letterSpacing: '-0.01em' }}>
            Notificaciones de Nuevos Candidatos
          </div>
          <div style={{ fontSize: 10, color: P.textDim, marginTop: 1 }}>
            WhatsApp con PDF del perfil al registrarse un nuevo candidato
          </div>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div style={{ color: P.textDim, fontSize: 11, padding: '8px 0' }}>Cargando…</div>
      ) : configs.length === 0 ? (
        <div style={{ color: P.textDim, fontSize: 11, padding: '8px 0 12px', opacity: 0.6 }}>
          Sin receptores configurados. Agrega uno abajo.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
          {configs.map(cfg => (
            <div key={cfg.id} style={{ display: 'flex', alignItems: 'center', gap: 8,
              background: P.surface2, borderRadius: 9, padding: '9px 12px',
              border: `1px solid ${cfg.active ? P.border : P.border2}`, opacity: cfg.active ? 1 : 0.55 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: P.text, whiteSpace: 'nowrap',
                  overflow: 'hidden', textOverflow: 'ellipsis' }}>{cfg.name}</div>
                <div style={{ fontSize: 10, color: P.textDim, marginTop: 1 }}>
                  {(cfg.phones || []).map(p => (typeof p === 'string' ? p : p?.phone) || '').join(', ')}
                </div>
              </div>
              <button onClick={() => handleTest(cfg)} disabled={testingId === cfg.id}
                style={{ padding: '4px 9px', borderRadius: 6, border: `1px solid ${P.border}`,
                  background: 'transparent', color: P.textDim, fontSize: 10, cursor: 'pointer' }}>
                {testingId === cfg.id ? '…' : 'Probar'}
              </button>
              <button onClick={() => handleToggle(cfg)}
                style={{ padding: '4px 9px', borderRadius: 6, border: `1px solid ${cfg.active ? '#22C55E40' : P.border}`,
                  background: cfg.active ? 'rgba(34,197,94,0.08)' : 'transparent',
                  color: cfg.active ? '#22C55E' : P.textDim, fontSize: 10, cursor: 'pointer' }}>
                {cfg.active ? 'Activo' : 'Inactivo'}
              </button>
              <button onClick={() => handleDelete(cfg.id)}
                style={{ width: 24, height: 24, borderRadius: 6, border: `1px solid rgba(239,68,68,0.25)`,
                  background: 'rgba(239,68,68,0.07)', color: '#EF4444', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Agregar nuevo */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input placeholder="Nombre (ej: Sandra RH)" value={newName}
          onChange={e => setNewName(e.target.value)} style={{ ...inp, flex: '1 1 140px', minWidth: 120 }}
          onFocus={e => e.target.style.borderColor = P.orange}
          onBlur={e  => e.target.style.borderColor = P.border}/>
        <input placeholder="Teléfono (10 dígitos)" value={newPhone}
          onChange={e => setNewPhone(e.target.value)} style={{ ...inp, flex: '1 1 140px', minWidth: 120 }}
          onFocus={e => e.target.style.borderColor = P.orange}
          onBlur={e  => e.target.style.borderColor = P.border}/>
        <button onClick={handleAdd} disabled={saving || !newName.trim() || !newPhone.trim()}
          style={{ padding: '7px 16px', borderRadius: 8, border: 'none',
            background: saving ? P.surface3 : P.orange, color: '#fff',
            fontSize: 11, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? 'Guardando…' : '+ Agregar'}
        </button>
      </div>
    </div>
  );
}

// ── PERIOD SELECTOR ───────────────────────────────────────────────────────────
function PeriodSelector({ activeId, onSelect, customFrom, customTo, setCustomFrom, setCustomTo, onApplyCustom }) {
  const P = useP();
  return (
    <div style={{ display:'flex', alignItems:'center', gap:3, flexWrap:'wrap', rowGap:6 }}>
      <span style={{ color:P.textDim, fontSize:10, marginRight:6, letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:600 }}>Período</span>
      {PERIOD_PRESETS.filter(p=>p.id!=='custom').map(p=>(
        <button key={p.id} className={`period-btn ${activeId===p.id?'active':''}`} onClick={()=>onSelect(p)}>{p.label}</button>
      ))}
      <div style={{ width:1, height:14, background:P.border, margin:'0 3px' }}/>
      <button className={`period-btn ${activeId==='custom'?'active':''}`} onClick={()=>onSelect(PERIOD_PRESETS.find(p=>p.id==='custom'))}>
        Rango ↔
      </button>
      {activeId==='custom'&&(
        <div style={{ display:'flex', alignItems:'center', gap:6, animation:'fadeIn 0.16s ease', flexWrap:'wrap', rowGap:4 }}>
          <input type="date" className="period-date-input" value={customFrom} max={customTo||toYMD(new Date())} onChange={e=>setCustomFrom(e.target.value)}/>
          <span style={{ color:P.textDim, fontSize:10 }}>–</span>
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
// Tabs disponibles para asignar permisos
const ALL_PERMS = [
  {id:'overview'},{id:'console'},{id:'activity'},{id:'products'},{id:'keywords'},
  {id:'messages'},{id:'conversations'},{id:'distribuidores'},
  {id:'recruitment'},{id:'vacantes'},{id:'ai'},{id:'reportes'},
];

const PERM_GROUPS = [
  {
    label: 'Analítica y ventas',
    color: '#FB670B',
    items: [
      {id:'overview',      label:'Resumen'},
      {id:'console',       label:'Console'},
      {id:'activity',      label:'Actividad'},
      {id:'products',      label:'Productos'},
      {id:'keywords',      label:'Búsquedas'},
      {id:'messages',      label:'Mensajes'},
      {id:'conversations', label:'Conversaciones'},
      {id:'distribuidores',label:'Distribuidores'},
    ],
  },
  {
    label: 'Reclutamiento',
    color: '#8B5CF6',
    items: [
      {id:'recruitment',   label:'Candidatos y pipeline'},
    ],
  },
  {
    label: 'Vacantes',
    color: '#0EA5E9',
    items: [
      {id:'vacantes',      label:'Publicación de vacantes'},
    ],
  },
  {
    label: 'Administración',
    color: '#14B8A6',
    items: [
      {id:'ai',            label:'Análisis IA'},
      {id:'reportes',      label:'Reportes'},
    ],
  },
];

function UserManageCard({ user, onUpdate }) {
  const P = useP();
  const [open,setOpen]         = useState(false);
  const [activeTab,setActiveTab] = useState('perms');
  const [pw,setPw]             = useState(''), [confirm,setConfirm] = useState('');
  const [showPw,setShowPw]     = useState(false), [showCf,setShowCf] = useState(false);
  const [newName,setNewName]   = useState('');
  const [selTabs,setSelTabs]   = useState(user.tabs||[]);
  const [canDl,setCanDl]       = useState(user.canDownload);
  const [isActive,setIsActive] = useState(user.active);
  const [loading,setLoading]   = useState(false);
  const [status,setStatus]     = useState(null), [msg,setMsg] = useState('');
  const [dispName,setDispName] = useState(user.name);
  const pwRef = useRef(null), nameRef = useRef(null);

  const strength = getStrength(pw);
  const match = pw&&confirm&&pw===confirm, mismatch = pw&&confirm&&pw!==confirm;
  const canSavePw   = pw.length>=6&&match&&!loading;
  const canSaveName = newName.trim().length>=2&&newName.trim()!==dispName&&!loading;
  const uc = user.color||'#FB670B';

  const handleOpen = (tab='perms') => {
    setOpen(true); setActiveTab(tab);
    setPw(''); setConfirm(''); setNewName('');
    setSelTabs(user.tabs||[]); setCanDl(user.canDownload); setIsActive(user.active);
    setStatus(null); setMsg('');
    setTimeout(()=>(tab==='name'?nameRef:pwRef).current?.focus(), 120);
  };
  const handleCancel = () => { setOpen(false); setStatus(null); setMsg(''); };
  const toggleTab = id => setSelTabs(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id]);

  const api = async body => {
    const r = await fetch('/api/admin/users',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    return r.json();
  };

  const handleSavePw = async () => {
    if(!canSavePw) return; setLoading(true); setStatus(null);
    const j = await api({action:'changePassword', id:user.id, newPassword:pw});
    if(j.ok){setStatus('ok');setMsg('Contraseña actualizada');setTimeout(()=>{setOpen(false);setPw('');setConfirm('');setStatus(null);},2000);}
    else{setStatus('error');setMsg(j.error||'Error');}
    setLoading(false);
  };
  const handleSaveName = async () => {
    if(!canSaveName) return; setLoading(true); setStatus(null);
    const j = await api({action:'changeName', id:user.id, newName:newName.trim()});
    if(j.ok){setDispName(newName.trim());setStatus('ok');setMsg('Nombre actualizado');onUpdate();setTimeout(()=>{setOpen(false);setNewName('');setStatus(null);},2000);}
    else{setStatus('error');setMsg(j.error||'Error');}
    setLoading(false);
  };
  const handleSavePerms = async () => {
    setLoading(true); setStatus(null);
    const j = await api({action:'updatePermissions', id:user.id, tabs:selTabs, canDownload:canDl, active:isActive});
    if(j.ok){setStatus('ok');setMsg('Permisos guardados');onUpdate();setTimeout(()=>setStatus(null),2500);}
    else{setStatus('error');setMsg(j.error||'Error');}
    setLoading(false);
  };

  const fld = { width:'100%', background:P.surface2, border:`1px solid ${P.border}`, borderRadius:9,
    padding:'11px 42px 11px 14px', color:P.text, fontSize:12, outline:'none',
    boxSizing:'border-box', transition:'border-color 0.15s ease, box-shadow 0.15s ease' };
  const spin = <div style={{ width:13,height:13,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.2)',borderTop:'2px solid #fff',animation:'spin 0.65s linear infinite' }}/>;

  return (
    <div style={{ background:P.surface, border:`1px solid ${open?uc+'50':P.border}`, borderRadius:14, overflow:'hidden',
      transition:'border-color 0.20s ease, box-shadow 0.20s ease', opacity:user.active?1:0.6,
      boxShadow:open?`0 0 0 1px ${uc}22, 0 6px 32px rgba(0,0,0,0.45)`:`0 2px 12px rgba(0,0,0,0.30)` }}>
      <div style={{ height:2.5, background:`linear-gradient(90deg,${uc},${uc}60,transparent)` }}/>
      <div style={{ display:'flex', alignItems:'flex-start', gap:14, padding:'16px 20px', flexWrap:'wrap' }}>
        <div style={{ width:44,height:44,borderRadius:11,background:`${uc}18`,border:`1.5px solid ${uc}30`,
          display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0,
          fontWeight:700,color:uc,letterSpacing:'-0.02em',boxShadow:`0 0 14px ${uc}18`,marginTop:1 }}>
          {dispName.slice(0,2).toUpperCase()}
        </div>
        <div style={{ flex:1, minWidth:130 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:6, flexWrap:'wrap' }}>
            <span style={{ fontWeight:700, fontSize:13.5, color:P.text, letterSpacing:'-0.01em' }}>{dispName}</span>
            {user.canDownload && <Tag color={P.orange}>Admin</Tag>}
            {!user.active && <Tag color={P.gray}>Inactivo</Tag>}
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
            {(user.tabs||[]).slice(0,6).map(t=>{
              const p = ALL_PERMS.find(x=>x.id===t);
              return p ? <span key={t} style={{ fontSize:9.5,fontWeight:600,padding:'2px 8px',borderRadius:20,
                background:`${uc}10`,border:`1px solid ${uc}22`,color:uc }}>{p.label}</span> : null;
            })}
            {(user.tabs||[]).length>6 && <span style={{ fontSize:9.5,color:P.textDim,padding:'2px 5px' }}>+{user.tabs.length-6}</span>}
            {(user.tabs||[]).length===0 && <span style={{ fontSize:10,color:P.textDim,fontStyle:'italic' }}>Sin acceso</span>}
          </div>
        </div>
        {!open&&(
          <div style={{ display:'flex', gap:6, flexShrink:0, flexWrap:'wrap', alignItems:'center' }}>
            {[{label:'Permisos',tab:'perms'},{label:'Contraseña',tab:'password'},{label:'Nombre',tab:'name'}].map(btn=>(
              <button key={btn.tab} onClick={()=>handleOpen(btn.tab)}
                style={{ padding:'7px 11px',borderRadius:8,border:`1px solid ${P.border}`,background:P.border2,
                  color:P.textSub,fontSize:11,fontWeight:500,cursor:'pointer',transition:'all 0.14s ease',
                  display:'flex',alignItems:'center',gap:5 }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=uc+'55';e.currentTarget.style.color=uc;e.currentTarget.style.background=`${uc}0C`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=P.border;e.currentTarget.style.color=P.textSub;e.currentTarget.style.background=P.border2;}}>
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {open&&(
        <div style={{ padding:'0 20px 20px', animation:'fadeUp 0.22s cubic-bezier(0.16,1,0.3,1) both' }}>
          <OrangeBar/>
          <div style={{ height:12 }}/>
          <div style={{ display:'flex',gap:3,padding:'3px',background:P.surface2,borderRadius:9,marginBottom:16,border:`1px solid ${P.border}` }}>
            {[{id:'perms',label:'Permisos'},{id:'password',label:'Contraseña'},{id:'name',label:'Nombre'}].map(t=>(
              <button key={t.id} onClick={()=>{setActiveTab(t.id);setStatus(null);}}
                style={{ flex:1,padding:'8px 0',borderRadius:7,border:'none',cursor:'pointer',fontSize:11,
                  fontWeight:t.id===activeTab?600:400,transition:'all 0.14s ease',
                  background:t.id===activeTab?P.surface3:'transparent',
                  color:t.id===activeTab?P.text:P.textDim,
                  boxShadow:t.id===activeTab?'0 1px 4px rgba(0,0,0,0.3)':'none' }}>{t.label}</button>
            ))}
          </div>

          {/* ── PERMISOS ── */}
          {activeTab==='perms'&&(
            <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
              <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
                {PERM_GROUPS.map(g=>(
                  <div key={g.label}>
                    <div style={{ fontSize:9,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',
                      color:g.color,marginBottom:6,display:'flex',alignItems:'center',gap:5 }}>
                      <span style={{ display:'inline-block',width:6,height:6,borderRadius:'50%',background:g.color }}/>
                      {g.label}
                    </div>
                    <div style={{ display:'flex',flexWrap:'wrap',gap:5 }}>
                      {g.items.map(p=>{
                        const on = selTabs.includes(p.id);
                        return (
                          <button key={p.id} onClick={()=>toggleTab(p.id)}
                            style={{ padding:'5px 11px',borderRadius:20,border:`1px solid ${on?g.color+'55':P.border}`,
                              background:on?`${g.color}14`:P.border2,color:on?g.color:P.textSub,
                              fontSize:11,fontWeight:on?600:400,cursor:'pointer',transition:'all 0.14s ease' }}>
                            {on&&'✓ '}{p.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
                {[
                  {val:canDl,set:setCanDl,label:'Notificaciones y envíos automáticos',sub:'Notificaciones de candidatos + envíos programados',ac:P.orange,acDim:P.okDim},
                  {val:isActive,set:setIsActive,label:'Usuario activo',sub:'Puede iniciar sesión',ac:'#22C55E',acDim:'rgba(34,197,94,0.08)'},
                ].map((opt,i)=>(
                  <label key={i} style={{ display:'flex',alignItems:'center',gap:10,cursor:'pointer',
                    padding:'10px 14px',borderRadius:10,border:`1px solid ${opt.val?opt.ac+'40':P.border}`,
                    background:opt.val?opt.acDim:P.border2,flex:1,minWidth:160 }}>
                    <input type="checkbox" checked={opt.val} onChange={e=>opt.set(e.target.checked)}
                      style={{ width:14,height:14,cursor:'pointer',accentColor:opt.ac }}/>
                    <div>
                      <div style={{ fontSize:11.5,fontWeight:600,color:P.text }}>{opt.label}</div>
                      <div style={{ fontSize:10,color:P.textDim }}>{opt.sub}</div>
                    </div>
                  </label>
                ))}
              </div>
              {status&&<div style={{ padding:'9px 13px',borderRadius:9,fontSize:11,background:status==='ok'?P.okDim:P.errDim,border:`1px solid ${status==='ok'?P.orange+'35':P.gray+'35'}`,color:status==='ok'?P.orange:P.grayMid,display:'flex',alignItems:'center',gap:8 }}>{status==='ok'?Icons.check:Icons.alert} {msg}</div>}
              <div style={{ display:'flex',gap:8 }}>
                <button onClick={handleSavePerms} disabled={loading}
                  style={{ flex:1,padding:'11px 0',borderRadius:9,border:'none',cursor:loading?'not-allowed':'pointer',
                    background:loading?P.surface2:P.orange,color:loading?P.textDim:'#fff',
                    fontSize:12,fontWeight:600,transition:'all 0.15s ease',display:'flex',alignItems:'center',justifyContent:'center',gap:8,
                    boxShadow:!loading?`0 4px 14px ${P.orange}35`:'none' }}>
                  {loading?<>{spin}Guardando...</>:'Guardar permisos'}
                </button>
                <button onClick={handleCancel} style={{ padding:'11px 16px',borderRadius:9,border:`1px solid ${P.border}`,background:'transparent',color:P.textSub,fontSize:12,fontWeight:500,cursor:'pointer' }}>Cancelar</button>
              </div>
            </div>
          )}

          {/* ── CONTRASEÑA ── */}
          {activeTab==='password'&&(
            <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
              <div style={{ position:'relative' }}>
                <input ref={pwRef} type={showPw?'text':'password'} placeholder="Nueva contraseña (mín. 6 caracteres)" value={pw} onChange={e=>{setPw(e.target.value);setStatus(null);}} style={fld}
                  onFocus={e=>{e.target.style.borderColor='rgba(251,103,11,0.45)';e.target.style.boxShadow='0 0 0 3px rgba(251,103,11,0.08)';}}
                  onBlur={e=>{e.target.style.borderColor=P.border;e.target.style.boxShadow='none';}}/>
                <button onClick={()=>setShowPw(s=>!s)} style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:P.textDim,padding:2 }}><EyeIcon open={showPw}/></button>
              </div>
              {pw&&<div style={{ display:'flex',alignItems:'center',gap:8 }}><div style={{ flex:1,height:3,background:P.border,borderRadius:2,overflow:'hidden' }}><div style={{ height:'100%',width:`${(strength.score/5)*100}%`,background:strength.color,borderRadius:2,transition:'width 0.32s ease' }}/></div><span style={{ color:strength.color,fontSize:10,fontWeight:600,minWidth:66,textAlign:'right' }}>{strength.label}</span></div>}
              <div style={{ position:'relative' }}>
                <input type={showCf?'text':'password'} placeholder="Confirmar contraseña" value={confirm} onChange={e=>{setConfirm(e.target.value);setStatus(null);}} style={{ ...fld,borderColor:mismatch?P.gray+'90':match?P.orange+'60':P.border,paddingRight:42 }}/>
                <button onClick={()=>setShowCf(s=>!s)} style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:P.textDim,padding:2 }}><EyeIcon open={showCf}/></button>
              </div>
              {mismatch&&<p style={{ color:P.grayMid,fontSize:11,margin:0 }}>Las contraseñas no coinciden</p>}
              {status&&<div style={{ padding:'9px 13px',borderRadius:9,fontSize:11,background:status==='ok'?P.okDim:P.errDim,border:`1px solid ${status==='ok'?P.orange+'35':P.gray+'35'}`,color:status==='ok'?P.orange:P.grayMid,display:'flex',alignItems:'center',gap:8 }}>{status==='ok'?Icons.check:Icons.alert} {msg}</div>}
              <div style={{ display:'flex',gap:8 }}>
                <button onClick={handleSavePw} disabled={!canSavePw} style={{ flex:1,padding:'11px 0',borderRadius:9,border:'none',cursor:canSavePw?'pointer':'not-allowed',background:canSavePw?P.orange:P.surface2,color:canSavePw?'#fff':P.textDim,fontSize:12,fontWeight:600,transition:'all 0.15s ease',display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:canSavePw?`0 4px 14px ${P.orange}35`:'none' }}>
                  {loading?<>{spin}Guardando...</>:'Guardar contraseña'}
                </button>
                <button onClick={handleCancel} style={{ padding:'11px 16px',borderRadius:9,border:`1px solid ${P.border}`,background:'transparent',color:P.textSub,fontSize:12,fontWeight:500,cursor:'pointer' }}>Cancelar</button>
              </div>
            </div>
          )}

          {/* ── NOMBRE ── */}
          {activeTab==='name'&&(
            <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
              <input ref={nameRef} type="text" placeholder={`Nombre actual: ${dispName}`} value={newName} onChange={e=>{setNewName(e.target.value);setStatus(null);}} maxLength={40}
                style={{ ...fld,paddingRight:14 }}
                onFocus={e=>{e.target.style.borderColor='rgba(251,103,11,0.45)';e.target.style.boxShadow='0 0 0 3px rgba(251,103,11,0.08)';}}
                onBlur={e=>{e.target.style.borderColor=P.border;e.target.style.boxShadow='none';}}/>
              <p style={{ color:P.textDim,fontSize:10,margin:0,lineHeight:1.6 }}>Cambia el nombre visible. No afecta contraseña ni rol.</p>
              {status&&<div style={{ padding:'9px 13px',borderRadius:9,fontSize:11,background:status==='ok'?P.okDim:P.errDim,border:`1px solid ${status==='ok'?P.orange+'35':P.gray+'35'}`,color:status==='ok'?P.orange:P.grayMid,display:'flex',alignItems:'center',gap:8 }}>{status==='ok'?Icons.check:Icons.alert} {msg}</div>}
              <div style={{ display:'flex',gap:8 }}>
                <button onClick={handleSaveName} disabled={!canSaveName} style={{ flex:1,padding:'11px 0',borderRadius:9,border:'none',cursor:canSaveName?'pointer':'not-allowed',background:canSaveName?P.orange:P.surface2,color:canSaveName?'#fff':P.textDim,fontSize:12,fontWeight:600,transition:'all 0.15s ease',display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:canSaveName?`0 4px 14px ${P.orange}35`:'none' }}>
                  {loading?<>{spin}Guardando...</>:'Guardar nombre'}
                </button>
                <button onClick={handleCancel} style={{ padding:'11px 16px',borderRadius:9,border:`1px solid ${P.border}`,background:'transparent',color:P.textSub,fontSize:12,fontWeight:500,cursor:'pointer' }}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AddUserModal({ onClose, onCreated }) {
  const P = useP();
  const COLORS = ['#FB670B','#22C55E','#0077CC','#A855F7','#EC4899','#F59E0B','#8A8A7A','#64748B'];
  const [name,setName]       = useState('');
  const [pw,setPw]           = useState(''), [confirm,setConfirm] = useState('');
  const [selTabs,setSelTabs] = useState([]);
  const [canDl,setCanDl]     = useState(false);
  const [color,setColor]     = useState('#8A8A7A');
  const [loading,setLoading] = useState(false);
  const [err,setErr]         = useState('');

  // Mantener el cursor personalizado encima del backdrop del portal
  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) document.body.appendChild(cursor);
  }, []);

  const match    = pw&&confirm&&pw===confirm;
  const mismatch = pw&&confirm&&pw!==confirm;
  const canSave  = name.trim().length>=2&&pw.length>=6&&match&&!loading;
  const toggleTab = id => setSelTabs(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);

  const handleSave = async () => {
    if(!canSave) return; setLoading(true); setErr('');
    const r = await fetch('/api/admin/users',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({action:'addUser',name:name.trim(),password:pw,tabs:selTabs,canDownload:canDl,color})});
    const j = await r.json();
    if(j.ok){onCreated();onClose();}else{setErr(j.error||'Error al crear');}
    setLoading(false);
  };

  return (
    <div style={{ position:'fixed',inset:0,zIndex:2147483647,background:'rgba(8,7,6,0.82)',backdropFilter:'blur(12px)',
      overflowY:'auto' }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100%',padding:20 }}>
      <div style={{ background:P.surface,border:`1px solid ${P.border2}`,borderRadius:18,width:'100%',maxWidth:520,
        flexShrink:0,display:'flex',flexDirection:'column',
        boxShadow:'0 40px 120px rgba(0,0,0,0.85)',animation:'fadeUp 0.25s cubic-bezier(0.16,1,0.3,1)' }}>
        {/* Header */}
        <div style={{ padding:'20px 24px 16px',borderBottom:`1px solid ${P.border}`,flexShrink:0,position:'relative' }}>
          <div style={{ position:'absolute',top:0,left:0,right:0,height:2.5,background:`linear-gradient(90deg,${P.orange},rgba(251,103,11,0.4),transparent)`,borderRadius:'18px 18px 0 0' }}/>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
            <span style={{ fontWeight:700,fontSize:15,color:P.text,letterSpacing:'-0.025em' }}>Nuevo usuario</span>
            <button onClick={onClose} style={{ width:28,height:28,borderRadius:7,border:`1px solid ${P.border}`,background:P.border2,color:P.textSub,cursor:'pointer',fontSize:15,display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
          </div>
        </div>
        {/* Body */}
        <div style={{ overflow:'auto',flex:1,padding:'20px 24px',display:'flex',flexDirection:'column',gap:16 }}>
          {/* Nombre */}
          <div>
            <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:P.textDim,marginBottom:6 }}>Nombre del usuario</div>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ej: Marketing, Ventas…"
              style={{ width:'100%',background:P.surface2,border:`1px solid ${P.border}`,borderRadius:9,padding:'10px 14px',color:P.text,fontSize:12.5,outline:'none',boxSizing:'border-box' }}
              onFocus={e=>e.target.style.borderColor='rgba(251,103,11,0.45)'}
              onBlur={e=>e.target.style.borderColor=P.border}/>
          </div>
          {/* Color */}
          <div>
            <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:P.textDim,marginBottom:7 }}>Color del badge</div>
            <div style={{ display:'flex',gap:8 }}>
              {COLORS.map(c=>(
                <button key={c} onClick={()=>setColor(c)}
                  style={{ width:28,height:28,borderRadius:7,background:c,cursor:'pointer',
                    border:`2.5px solid ${color===c?P.text:'transparent'}`,boxSizing:'border-box',transition:'border 0.13s' }}/>
              ))}
            </div>
          </div>
          {/* Contraseña */}
          <div>
            <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:P.textDim,marginBottom:6 }}>Contraseña</div>
            <div style={{ display:'flex',flexDirection:'column',gap:7 }}>
              <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Mínimo 6 caracteres"
                style={{ width:'100%',background:P.surface2,border:`1px solid ${P.border}`,borderRadius:9,padding:'10px 14px',color:P.text,fontSize:12.5,outline:'none',boxSizing:'border-box' }}
                onFocus={e=>e.target.style.borderColor='rgba(251,103,11,0.45)'} onBlur={e=>e.target.style.borderColor=P.border}/>
              <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirmar contraseña"
                style={{ width:'100%',background:P.surface2,border:`1px solid ${mismatch?'rgba(239,68,68,0.5)':match?'rgba(251,103,11,0.45)':P.border}`,borderRadius:9,padding:'10px 14px',color:P.text,fontSize:12.5,outline:'none',boxSizing:'border-box' }}
                onFocus={e=>e.target.style.borderColor='rgba(251,103,11,0.45)'} onBlur={e=>e.target.style.borderColor=P.border}/>
            </div>
          </div>
          {/* Secciones */}
          <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
            {PERM_GROUPS.map(g=>(
              <div key={g.label}>
                <div style={{ fontSize:9,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',
                  color:g.color,marginBottom:6,display:'flex',alignItems:'center',gap:5 }}>
                  <span style={{ display:'inline-block',width:6,height:6,borderRadius:'50%',background:g.color }}/>
                  {g.label}
                </div>
                <div style={{ display:'flex',flexWrap:'wrap',gap:5 }}>
                  {g.items.map(p=>{
                    const on = selTabs.includes(p.id);
                    return (
                      <button key={p.id} onClick={()=>toggleTab(p.id)}
                        style={{ padding:'5px 11px',borderRadius:20,border:`1px solid ${on?g.color+'55':P.border}`,
                          background:on?`${g.color}14`:P.border2,color:on?g.color:P.textSub,
                          fontSize:11,fontWeight:on?600:400,cursor:'pointer',transition:'all 0.14s ease' }}>
                        {on&&'✓ '}{p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {/* Can download */}
          <label style={{ display:'flex',alignItems:'center',gap:10,cursor:'pointer',padding:'11px 14px',borderRadius:10,
            border:`1px solid ${canDl?P.orange+'40':P.border}`,background:canDl?P.okDim:P.border2 }}>
            <input type="checkbox" checked={canDl} onChange={e=>setCanDl(e.target.checked)}
              style={{ width:14,height:14,cursor:'pointer',accentColor:P.orange }}/>
            <div>
              <div style={{ fontSize:11.5,fontWeight:600,color:P.text }}>Notificaciones y envíos automáticos</div>
              <div style={{ fontSize:10,color:P.textDim }}>Notificaciones de candidatos + envíos programados</div>
            </div>
          </label>
          {err&&<div style={{ padding:'9px 13px',borderRadius:9,fontSize:11,background:P.errDim,border:`1px solid ${P.gray}35`,color:P.grayMid,display:'flex',alignItems:'center',gap:8 }}>{Icons.alert} {err}</div>}
        </div>
        {/* Footer */}
        <div style={{ padding:'14px 24px',borderTop:`1px solid ${P.border}`,display:'flex',gap:8,justifyContent:'flex-end',flexShrink:0,background:P.surface2 }}>
          <button onClick={onClose} style={{ padding:'10px 18px',borderRadius:9,border:`1px solid ${P.border}`,background:'transparent',color:P.textSub,fontSize:12,fontWeight:500,cursor:'pointer' }}>Cancelar</button>
          <button onClick={handleSave} disabled={!canSave}
            style={{ padding:'10px 22px',borderRadius:9,border:'none',cursor:canSave?'pointer':'not-allowed',
              background:canSave?P.orange:P.surface2,color:canSave?'#fff':P.textDim,
              fontSize:12.5,fontWeight:700,transition:'all 0.15s ease',display:'flex',alignItems:'center',gap:7,
              boxShadow:canSave?`0 4px 16px ${P.orange}30`:'none' }}>
            {loading?<><div style={{ width:12,height:12,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.2)',borderTop:'2px solid #fff',animation:'spin 0.65s linear infinite' }}/>Creando...</>:'+ Crear usuario'}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

function UsersTab() {
  const P = useP();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/users', { credentials: 'include' });
      const j = await r.json();
      if (j.ok) setUsers(j.users || []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  return (
    <div style={{ animation:'fadeUp 0.22s ease both' }}>
      <div style={{ marginBottom:16, padding:'14px 18px',
        background:P.surface,
        border:`1px solid ${P.border}`, borderRadius:12,
        boxShadow:`0 1px 3px rgba(0,0,0,0.06)`,
        display:'flex', alignItems:'center', justifyContent:'space-between', gap:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:38, height:38, borderRadius:9, background:P.okDim, border:`1px solid ${P.orange}25`,
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            boxShadow:`0 0 16px ${P.orange}20` }}>
            <span style={{ color:P.orange }}>{Icons.lock}</span>
          </div>
          <div>
            <p style={{ fontWeight:700, fontSize:13, color:P.text, margin:'0 0 3px', letterSpacing:'-0.01em' }}>Gestión de accesos</p>
            <p style={{ fontSize:11, color:P.textDim, margin:0, lineHeight:1.55 }}>Permisos, contraseña y nombre de cada usuario. Cambios aplicados inmediatamente.</p>
          </div>
        </div>
        <button onClick={() => setShowAdd(true)} style={{
          padding:'7px 14px', borderRadius:8, border:'none', cursor:'pointer',
          background:P.orange, color:'#fff', fontSize:12, fontWeight:700,
          whiteSpace:'nowrap', flexShrink:0,
        }}>+ Nuevo usuario</button>
      </div>

      {loading ? (
        <p style={{ color:P.textDim, fontSize:13, textAlign:'center', padding:24 }}>Cargando usuarios...</p>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {users.map(u => <UserManageCard key={u.id} user={u} onUpdate={loadUsers}/>)}
        </div>
      )}

      {showAdd && createPortal(
        <AddUserModal onClose={() => setShowAdd(false)} onCreated={() => { setShowAdd(false); loadUsers(); }}/>,
        document.body
      )}
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
const RobotIcon = ({ size=36 }) => {
  const P = useP();
  return <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
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
  </svg>;
};

function Login({ onLogin }) {
  const P = useP();
  const [pw,setPw]=useState(''), [err,setErr]=useState(false), [loading,setLoading]=useState(false);
  const [focused,setFocused]=useState(false), [showPw,setShowPw]=useState(false);
  const inputRef=useRef(null), cardRef=useRef(null);
  useEffect(()=>{ setTimeout(()=>inputRef.current?.focus(),280); },[]);
  const shake=()=>{ const el=cardRef.current; if(!el)return; [-7,7,-4,4,-2,2,0].forEach((x,i)=>setTimeout(()=>{el.style.transform=`translateX(${x}px)`;},i*50)); };
  const go=async(e)=>{ e.preventDefault(); setLoading(true); try{ const res=await fetch('/api/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})}); const data=await res.json(); if(data.ok){onLogin(data.role);}else{setErr(true);shake();setTimeout(()=>setErr(false),2500);} }catch{setErr(true);shake();setTimeout(()=>setErr(false),2500);} setLoading(false); };
  return (
    <div ref={cardRef} className="scanline-wrap" style={{ padding:'48px 40px 40px', transition:'transform 0.05s ease' }}>
      {/* Top gradient */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3,
        background:`linear-gradient(90deg,transparent,${P.orange},${P.orangeWarm},transparent)`, opacity:0.7 }}/>
      {/* Subtle corner bg light */}
      <div style={{ position:'absolute', top:-60, right:-60, width:180, height:180, borderRadius:'50%',
        background:`radial-gradient(circle, ${P.orange}12 0%, transparent 70%)`, pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:-40, left:-40, width:140, height:140, borderRadius:'50%',
        background:`radial-gradient(circle, ${P.orange}08 0%, transparent 70%)`, pointerEvents:'none' }}/>

      <div style={{ textAlign:'center', marginBottom:32, position:'relative' }}>
        <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center',
          width:72, height:72, borderRadius:18, background:P.surface2,
          border:`1px solid ${P.border}`, marginBottom:22,
          boxShadow:`0 0 32px ${P.orange}25, 0 8px 24px rgba(0,0,0,0.5)`,
          position:'relative', animation:'float 4s ease infinite' }}>
          <RobotIcon size={48}/>
          <div style={{ position:'absolute', bottom:-5, right:-5, width:16, height:16, borderRadius:'50%',
            background:P.orange, border:`2.5px solid ${P.surface}`, animation:'pulse 2s infinite',
            boxShadow:`0 0 8px ${P.orange}` }}/>
        </div>
        <h2 style={{ fontWeight:700, fontSize:22, color:P.text, letterSpacing:'-0.03em', marginBottom:6 }}>Panel Admin</h2>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <span style={{ display:'inline-block', width:24, height:1, background:`linear-gradient(90deg,transparent,${P.orange})`, opacity:0.7 }}/>
          <span style={{ color:P.textDim, fontSize:11, letterSpacing:'0.07em', textTransform:'uppercase', fontWeight:500 }}>BotGO · Grupo Ortiz</span>
          <span style={{ display:'inline-block', width:24, height:1, background:`linear-gradient(90deg,${P.orange},transparent)`, opacity:0.7 }}/>
        </div>
      </div>

      <form onSubmit={go} style={{ display:'flex', flexDirection:'column', gap:11, position:'relative' }}>
        <div style={{ position:'relative' }}>
          <input ref={inputRef} type={showPw?'text':'password'} value={pw} onChange={e=>setPw(e.target.value)}
            onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
            placeholder="Contraseña"
            style={{ width:'100%', background:P.surface2,
              border:`1px solid ${err?P.gray+'80':focused?P.orange+'55':P.border}`,
              borderRadius:10, padding:'13px 44px 13px 16px', color:P.text, fontSize:13, outline:'none',
              boxSizing:'border-box', transition:'border-color 0.15s ease, box-shadow 0.15s ease',
              letterSpacing:showPw?'normal':'0.07em',
              boxShadow:focused?`0 0 0 3px ${P.orange}10`:'none' }}/>
          <button type="button" onClick={()=>setShowPw(s=>!s)}
            style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)',
              background:'none', border:'none', cursor:'pointer', color:P.textDim, padding:2 }}>
            <EyeIcon open={showPw}/>
          </button>
        </div>
        {err&&(
          <div style={{ background:P.errDim, border:`1px solid ${P.gray}38`, borderRadius:8,
            padding:'9px 13px', color:P.grayLight, fontSize:11, display:'flex', alignItems:'center', gap:7 }}>
            <span style={{ color:P.grayMid }}>{Icons.alert}</span> Contraseña incorrecta
          </div>
        )}
        <button type="submit" disabled={loading||!pw} className="btn-base"
          style={{ background:loading||!pw?P.surface3:P.orange,
            color:loading||!pw?P.textDim:'#fff', border:'none', borderRadius:10,
            padding:'13px 0', fontSize:13, fontWeight:600,
            cursor:loading||!pw?'not-allowed':'pointer', transition:'all 0.16s ease',
            boxShadow:!loading&&pw?`0 4px 20px ${P.orange}40`:'none',
            letterSpacing:'-0.01em' }}>
          {loading
            ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <div style={{ width:13,height:13,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.2)',borderTop:'2px solid #fff',animation:'spin 0.65s linear infinite' }}/>
                Verificando
              </span>
            : 'Continuar →'}
        </button>
      </form>
    </div>
  );
}

// ── SC METRIC DEFS (used in Dash + Console toggle cards) ─────────────────────
const SC_METRICS = [
  { id:'clicks',      label:'Clics totales',      color:'#4285F4', sub:'visitas al sitio',    getVal: d => d.totalClicks },
  { id:'impressions', label:'Impresiones totales', color:'#9333EA', sub:'búsquedas en Google', getVal: d => d.totalImpressions },
  { id:'ctr',         label:'CTR medio',           color:'#34A853', sub:'tasa de clic',        getVal: d => d.avgCtr+'%' },
  { id:'position',    label:'Posición media',      color:'#FB670B', sub:'posición promedio',   getVal: d => d.avgPos },
];

// ── DASH ──────────────────────────────────────────────────────────────────────
function Dash({ onClose, role, theme='dark', toggleTheme }) {
  const P = useP();
  const w=useWindowWidth(), isMobile=w<640, isTablet=w<900;
  const [data,setData]=useState(null), [loading,setLoading]=useState(true);
  const [summary,setSummary]=useState(''), [genAI,setGenAI]=useState(false);
  const [tab,setTab]=useState(role.tabs[0]), [last,setLast]=useState(null);
  const [auto,setAuto]=useState(true), [menuOpen,setMenuOpen]=useState(false);
  const itvRef=useRef(null);
  const _defPreset = role.name==='Marketing' ? 'all' : '28d';
  const [activePresetId,setActivePresetId]=useState(_defPreset);
  const [activePeriod,setActivePeriod]=useState(()=>PERIOD_PRESETS.find(p=>p.id===_defPreset).getRange());
  const [customFrom,setCustomFrom]=useState(''), [customTo,setCustomTo]=useState('');
  const [leads,setLeads]=useState([]), [leadsLoad,setLeadsLoad]=useState(false), [leadSearch,setLeadSearch]=useState('');
  const [convSessions,setConvSessions]=useState([]), [convLoading,setConvLoading]=useState(false);
  const [selectedConv,setSelectedConv]=useState(null), [convMessages,setConvMessages]=useState([]), [convMsgLoad,setConvMsgLoad]=useState(false);
  const [scData,setScData]=useState(null), [scLoading,setScLoading]=useState(false);
  const [activeMetrics,setActiveMetrics]=useState(['clicks','impressions']);

const isAdmin     = role.canDownload;
  const isOnlyAdmin = role.canDelete ?? (role.name === 'Admin' || role.name === 'Super Admin');

const isRH        = role.name === 'RH' || role.role === 'Recursos Humanos';
const isMarketing = role.name === 'Marketing';

  // 1. Reglas para las pestañas generales
  const canSee = id => role.tabs.includes(id);

  const load=useCallback(async(silent=false,from=null,to=null)=>{
    if(!silent)setLoading(true);
    try{ const body={action:'get'}; if(from)body.from=from; if(to)body.to=to;
      const r=await fetch('/api/analytics',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const j=await r.json(); if(j.ok){setData(j.data);setLast(new Date());}
    }catch(e){console.error(e);}
    if(!silent)setLoading(false);
  },[]);

  const loadLeads=useCallback(async()=>{
    setLeadsLoad(true);
    try{ const r=await fetch('/api/analytics',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'getLeads'})}); const j=await r.json(); if(j.ok)setLeads(j.leads||[]); }catch(e){console.error(e);}
    setLeadsLoad(false);
  },[]);

  const loadConversations=useCallback(async()=>{
    setConvLoading(true);
    try{
      const r=await fetch('/api/conversations',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'list',limit:80})});
      const j=await r.json(); if(j.ok)setConvSessions(j.sessions||[]);
    }catch(e){console.error(e);}
    setConvLoading(false);
  },[]);

  const loadSC=useCallback(async(from,to)=>{
    setScLoading(true);
    try{
      const today=new Date().toISOString().slice(0,10);
      const d30=new Date(); d30.setDate(d30.getDate()-29);
      const startDate=from||d30.toISOString().slice(0,10);
      const endDate=to||today;
      const r=await fetch('/api/search-console',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({startDate,endDate})});
      const j=await r.json();
      console.log('[SC] respuesta completa:', j);
      if(j.ok){
        console.log(`[SC] ✅ Impresiones totales: ${j.totalImpressions} | Clics: ${j.totalClicks} | CTR: ${j.avgCtr}% | Pos: ${j.avgPos}`);
        console.log('[SC] Top consultas:', j.topQueries);
        console.log('[SC] Top países:', j.topCountries);
        setScData(j);
      } else {
        console.warn('[SC] ❌ Error:', j.error);
      }
    }catch(e){console.error('[SC] excepción:', e);}
    setScLoading(false);
  },[]);

  const loadConvMessages=useCallback(async(sessionId)=>{
    setConvMsgLoad(true); setConvMessages([]);
    try{
      const r=await fetch('/api/conversations',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'messages',session_id:sessionId})});
      const j=await r.json(); if(j.ok)setConvMessages(j.messages||[]);
    }catch(e){console.error(e);}
    setConvMsgLoad(false);
  },[]);

  useEffect(()=>{
    if(canSee('overview')||canSee('activity')||canSee('products')||canSee('keywords')||canSee('messages')||canSee('ai')){
      const p=PERIOD_PRESETS.find(p=>p.id===_defPreset), range=p.getRange();
      load(false,range?.from,range?.to);
    } else { setLoading(false); }
  },[]);

  useEffect(()=>{ if(tab==='distribuidores')loadLeads(); },[tab]);
  useEffect(()=>{ if(tab==='overview'||tab==='console')loadSC(activePeriod?.from,activePeriod?.to); },[tab]);
  useEffect(()=>{ if(tab==='conversations'){setSelectedConv(null);setConvMessages([]);loadConversations();} },[tab]);
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
    setTab(t=>{ if(t==='overview'||t==='console') loadSC(range?.from,range?.to); return t; });
  },[load,loadSC]);

  const handleApplyCustom=useCallback(()=>{
    if(!customFrom||!customTo)return;
    setActivePeriod({from:customFrom,to:customTo});
    load(false,customFrom,customTo);
    setTab(t=>{ if(t==='overview'||t==='console') loadSC(customFrom,customTo); return t; });
  },[customFrom,customTo,load,loadSC]);

  const reset=async()=>{
    if(!isOnlyAdmin)return;
    if(!confirm('¿Borrar TODAS las estadísticas? Esta acción no se puede deshacer.'))return;
    await fetch('/api/analytics',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'reset'})});
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
      const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:prompt}],language:'es',isVoice:false,noLog:true})});
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
    {id:'overview',label:'Resumen',        icon:'◉'},
    {id:'console', label:'Console',        icon:'◌'},
    {id:'activity',label:'Actividad',      icon:'◈'},
    {id:'products',label:'Productos',      icon:'◆'},
    {id:'keywords',label:'Búsquedas',      icon:'◎'},
    {id:'messages',label:'Mensajes',       icon:'◐'},
    {id:'conversations',label:'Conversaciones',icon:'◧'},
    {id:'distribuidores',label:'Distribuidores',icon:'◑'},
    {id:'recruitment',label:'Reclutamiento',icon:'◒'},
    {id:'vacantes', label:'Vacantes', icon:'◓'},
    {id:'ai',label:'Análisis IA',          icon:'✦'},
    {id:'reportes',label:'Reportes',       icon:'◫'},
    {id:'users',label:'Usuarios',          icon:'◴'},
  ];
  
  // ✅ CORRECCIÓN FINAL: Permitimos nombres de Admin y banderas de Admin, PERO bloqueamos a RH explícitamente.
  const canSeeReportes = !isRH && (role.name === 'Admin' || role.name === 'Super Admin' || role.role === 'Administrador' || isAdmin || isOnlyAdmin || role.tabs.includes('reportes'));
  
  const TABS=ALL_TABS.filter(t => t.id==='reportes' ? canSeeReportes : canSee(t.id));
  // Shared card style
  const CARD={
    background:P.surface,
    border:`1px solid ${P.border}`,
    borderRadius:12,
    padding:isMobile?'16px':'20px 22px',
    marginBottom:10,
    position:'relative',
    overflow:'hidden',
    boxShadow:`0 1px 3px rgba(0,0,0,0.06)`
  };
  const ST={ fontWeight:700, fontSize:13, color:P.text, letterSpacing:'-0.02em', marginBottom:18 };

  const roleBadgeColor=role.color||P.orange;
  const currentTabLabel=TABS.find(t=>t.id===tab)?.label||'';

  const CardTopBar = ({color=P.orange}) => (
    <div style={{ position:'absolute', top:0, left:0, right:0, height:'2.5px',
      background:color, opacity:0.50 }}/>
  );

  return (
    <div className="adash aroot panel-enter admin-bg-dots"
      style={{ background:P.bg, border:`1px solid ${P.border}`, borderRadius:isMobile?10:16,
        width:'100%', maxWidth:isMobile?'100%':isTablet?'98vw':1200,
        height:isMobile?'100dvh':'90vh', maxHeight:isMobile?'100dvh':'90vh',
        display:'flex', flexDirection:'column', overflow:'hidden',
        boxShadow:`0 24px 80px rgba(0,0,0,0.60), 0 0 0 1px ${P.border}`,
        position:'relative' }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── HEADER ── */}
      <div className="dash-header" style={{ padding:isMobile?'10px 14px':'14px 22px', borderBottom:`1px solid ${P.border}`,
        background:P.surfaceGlass,
        flexShrink:0, position:'relative', zIndex:10 }}>
        {/* Header accent — only visible in dark mode */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2.5,
          background:`linear-gradient(90deg,${P.orange},${P.orangeWarm},${P.orangeSoft},transparent)`, opacity:0.65 }}/>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, marginBottom:isAdmin&&!isMobile?12:isAdmin?8:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:13, minWidth:0 }}>
            {/* Logo badge */}
            <div style={{ width:36, height:36, borderRadius:10,
              background:`linear-gradient(135deg,${P.okDim},rgba(251,103,11,0.08))`,
              border:`1px solid ${P.orange}35`,
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              boxShadow:`0 0 20px ${P.orange}25` }}>
              <RobotIcon size={26}/>
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3, flexWrap:'wrap' }}>
                <span style={{ fontWeight:700, fontSize:isMobile?13:15, color:P.text, letterSpacing:'-0.025em' }}>BotGO Admin</span>
                {!isMobile&&<Tag color={P.orange} size={9}>Grupo Ortiz</Tag>}
                <Tag color={roleBadgeColor} size={9}>{role.name}</Tag>
              </div>
              {isAdmin&&!isMobile&&(
                <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <Dot active={auto}/>
                  <span style={{ color:P.textDim, fontSize:10 }}>
                    {auto?'Live · 10s':'Pausado'}
                    {last&&` · ${last.toLocaleTimeString('es-MX',{timeZone:'America/Mexico_City'})}`}
                  </span>
                  {periodLabel&&(
                    <span style={{ padding:'2px 8px', borderRadius:5,
                      background:P.okDim, border:`1px solid ${P.orange}25`,
                      color:P.orange, fontSize:10, fontWeight:600 }}>{periodLabel}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display:'flex', gap:5, alignItems:'center', flexShrink:0 }}>
            {isAdmin&&!isMobile&&[
              { label:'', icon: auto ? Icons.pause : Icons.play,
                tooltip: auto?'Pausar':'Live',
                onClick:()=>setAuto(s=>!s),
                style:{background:auto?P.okDim:P.border2,border:`1px solid ${auto?P.orange+'40':P.border}`,color:auto?P.orange:P.textSub} },
              { label:'', icon:Icons.sync, tooltip:'Sincronizar',
                onClick:()=>load(false,activePeriod?.from,activePeriod?.to),
                style:{background:P.border2,border:`1px solid ${P.border}`,color:P.textSub} },
              ...(isOnlyAdmin ? [{ label:'Reset', icon:Icons.trash, tooltip:'Borrar estadísticas',
                onClick:reset,
                style:{background:P.errDim,border:`1px solid ${P.gray}30`,color:P.grayLight} }] : []),
            ].map(b=>(
              <button key={b.tooltip} onClick={b.onClick} className="btn-base" title={b.tooltip}
                style={{ padding:'7px 10px', borderRadius:8, fontSize:11, fontWeight:500,
                  cursor:'pointer', display:'flex', alignItems:'center', gap:5, ...b.style }}>
                {b.icon}{b.label}
              </button>
            ))}
            {isMobile&&isAdmin&&(
              <button onClick={()=>load(false,activePeriod?.from,activePeriod?.to)} className="btn-base"
                style={{ padding:'7px 10px', borderRadius:8, border:`1px solid ${P.border}`,
                  background:P.border2, color:P.textSub, cursor:'pointer' }}>
                {Icons.sync}
              </button>
            )}
            {isAdmin&&!isMobile&&<DownloadReportButton data={data} periodMeta={{preset:activePresetId,from:activePeriod?.from,to:activePeriod?.to}} reportType="resumen"/>}
            {/* Botón tema global */}
            {toggleTheme&&(
              <button onClick={toggleTheme} title={theme==='dark'?'Tema claro':'Tema oscuro'}
                style={{ padding:'7px 10px', borderRadius:8, border:`1px solid ${P.border}`,
                  background:P.border2, color:P.textSub, cursor:'pointer',
                  transition:'all 0.14s ease', display:'flex', alignItems:'center', justifyContent:'center' }}
                onMouseEnter={e=>{e.currentTarget.style.color=P.text;e.currentTarget.style.borderColor=P.border2;e.currentTarget.style.background=P.surface3;}}
                onMouseLeave={e=>{e.currentTarget.style.color=P.textSub;e.currentTarget.style.borderColor=P.border;e.currentTarget.style.background=P.border2;}}>
                {theme==='dark'
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                }
              </button>
            )}
            <button onClick={onClose} title="Cerrar sesión"
              style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 13px', borderRadius:9,
                border:'none', background:P.orange, color:'#fff', cursor:'pointer',
                fontSize:12, fontWeight:600, letterSpacing:'-0.01em',
                boxShadow:`0 3px 14px ${P.orange}45`, transition:'all 0.15s ease' }}
              onMouseEnter={e=>{e.currentTarget.style.background=P.orangeDark;e.currentTarget.style.boxShadow=`0 4px 18px ${P.orange}55`;}}
              onMouseLeave={e=>{e.currentTarget.style.background=P.orange;e.currentTarget.style.boxShadow=`0 3px 14px ${P.orange}45`;}}>
              {Icons.close}
            </button>
          </div>
        </div>

        {/* Period selector */}
        {(isAdmin||canSee('console')||canSee('overview'))&&!isMobile&&(
          <div style={{ display:'flex', alignItems:'center', padding:'6px 10px', marginTop:10,
            background:P.surface2, borderRadius:9, border:`1px solid ${P.border}` }}>
            <PeriodSelector activeId={activePresetId} onSelect={handlePresetSelect} customFrom={customFrom} customTo={customTo} setCustomFrom={setCustomFrom} setCustomTo={setCustomTo} onApplyCustom={handleApplyCustom}/>
          </div>
        )}
        {(isAdmin||canSee('console')||canSee('overview'))&&isMobile&&(
          <div style={{ marginTop:10 }}>
            <PeriodSelector activeId={activePresetId} onSelect={handlePresetSelect} customFrom={customFrom} customTo={customTo} setCustomFrom={setCustomFrom} setCustomTo={setCustomTo} onApplyCustom={handleApplyCustom}/>
          </div>
        )}
      </div>

      {/* ── TABS ── */}
      {!isMobile ? (
        <div className="tabs-row" style={{ padding:'0 22px', borderBottom:`1px solid ${P.border}`,
          display:'flex', gap:0, overflowX:'auto',
          background:P.surface, flexShrink:0 }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`tab-btn ${tab===t.id?'active':''}`}
              style={{ background:'transparent',
                color:tab===t.id?P.orange:P.textDim,
                border:'none', padding:'12px 16px',
                cursor:'pointer', fontSize:12,
                fontWeight:tab===t.id?600:400,
                whiteSpace:'nowrap',
                letterSpacing: '-0.01em' }}>
              {t.label}
              {t.id==='distribuidores'&&leads.length>0&&(
                <span style={{ marginLeft:5, background:P.okDim, color:P.orange,
                  borderRadius:10, padding:'1px 7px', fontSize:9, fontWeight:700 }}>{leads.length}</span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ padding:'8px 14px', borderBottom:`1px solid ${P.border}`,
          background:P.surface, flexShrink:0, position:'relative' }}>
          <button onClick={()=>setMenuOpen(s=>!s)}
            style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'9px 13px', background:P.surface2, border:`1px solid ${P.border}`,
              borderRadius:9, color:P.text, fontSize:12, fontWeight:500, cursor:'pointer' }}>
            <span>{currentTabLabel}</span>
            <span style={{ transform:menuOpen?'rotate(180deg)':'rotate(0)', transition:'transform 0.2s', color:P.textDim }}>{Icons.chevron}</span>
          </button>
          {menuOpen&&(
            <div style={{ position:'absolute', top:'calc(100% + 2px)', left:14, right:14,
              background:P.surface, border:`1px solid ${P.border}`, borderRadius:10,
              zIndex:100, overflow:'hidden', boxShadow:`0 12px 40px rgba(0,0,0,0.8)`,
              animation:'fadeUp 0.15s ease' }}>
              {TABS.map(t=>(
                <button key={t.id} onClick={()=>{setTab(t.id);setMenuOpen(false);}}
                  style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'12px 15px', background:tab===t.id?P.okDim:'transparent',
                    border:'none', borderBottom:`1px solid ${P.border2}`,
                    color:tab===t.id?P.orange:P.textSub, fontSize:12,
                    fontWeight:tab===t.id?600:400, cursor:'pointer', textAlign:'left' }}>
                  {t.label}
                  {t.id==='distribuidores'&&leads.length>0&&(
                    <span style={{ background:P.okDim, color:P.orange, borderRadius:10, padding:'1px 7px', fontSize:9 }}>{leads.length}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── CONTENT ── */}
      <div className="adash-scroll"
        style={{
          flex:1, minHeight:0,
          overflowY:(tab==='overview'||tab==='console')?'hidden':'auto',
          overflowX:'hidden',
          padding: isMobile ? '12px 12px 16px' : (tab==='overview'||tab==='console') ? '14px 20px 14px' : '20px 24px 36px',
          background:P.bg,
          display:(tab==='overview'||tab==='console')?'flex':'block',
          flexDirection:'column'
        }}
        onClick={()=>menuOpen&&setMenuOpen(false)}>

        {loading&&tab!=='distribuidores'&&tab!=='recruitment'&&tab!=='users'&&<Spinner/>}

        {/* ── OVERVIEW ── */}
        {!loading&&data&&tab==='overview'&&canSee('overview')&&(
          <div style={{display:'flex',flexDirection:'column',flex:1,minHeight:0,gap:6}}>
            {/* Fila acumulado */}
            <div style={{flexShrink:0}}>
              <div style={{marginBottom:5}}>
                <span style={{color:P.textDim,fontSize:9,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.10em'}}>Acumulado · {periodLabel}</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)',gap:6}}>
                <StatCard small label="Sesiones"  value={data.totalSessions} sub="conversaciones"      color={P.orange}     icon="💬"/>
                <StatCard small label="Mensajes"  value={data.totalMessages} sub="preguntas recibidas" color={P.grayLight}  icon="📩"/>
                <StatCard small label="WhatsApp"  value={data.totalWhatsApp} sub="leads generados"     color={P.orangeWarm} icon="🛒"/>
                <StatCard small label="PDFs"      value={data.totalPDFs}     sub="catálogos enviados"  color={P.grayMid}    icon="📄"/>
              </div>
            </div>
            {/* Fila hoy */}
            <div style={{flexShrink:0}}>
              <div style={{marginBottom:5}}>
                <span style={{color:P.textDim,fontSize:9,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.10em'}}>Hoy · {new Date().toLocaleDateString('es-MX',{timeZone:'America/Mexico_City',day:'numeric',month:'short'})}</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)',gap:6}}>
                <StatCard small label="Mensajes"  value={td.messages} sub={`ayer: ${yd.messages}`}  color={P.orange}     icon="📆" trend={td.messages-yd.messages}/>
                <StatCard small label="Sesiones"  value={td.sessions} sub={`ayer: ${yd.sessions}`}  color={P.grayLight}  icon="👤" trend={td.sessions-yd.sessions}/>
                <StatCard small label="WhatsApp"  value={td.wa||0}    sub={`ayer: ${yd.wa||0}`}     color={P.orangeWarm} icon="📲" trend={(td.wa||0)-(yd.wa||0)}/>
                <StatCard small label="PDFs"      value={td.pdf||0}   sub={`ayer: ${yd.pdf||0}`}    color={P.grayMid}    icon="📋" trend={(td.pdf||0)-(yd.pdf||0)}/>
              </div>
            </div>
            {/* Gráficas — llenan el espacio restante, flex:1 con minHeight:0 garantiza sin overflow */}
            <div style={{flex:1,minHeight:0,display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:7}}>
              <div className="card-hover" style={{...CARD,padding:'10px 14px',display:'flex',flexDirection:'column',minHeight:0,marginBottom:0}}>
                <CardTopBar/>
                <p style={{...ST,marginBottom:6,fontSize:10}}>Distribución de intenciones</p>
                <div style={{flex:1,minHeight:0,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                  <DonutChart intents={data.intents}/>
                </div>
              </div>
              <div className="card-hover" style={{...CARD,padding:'10px 14px',display:'flex',flexDirection:'column',minHeight:0,marginBottom:0}}>
                <CardTopBar/>
                <p style={{...ST,marginBottom:6,fontSize:10}}>Actividad — últimos 14 días</p>
                <div style={{flex:1,minHeight:0,display:'flex',alignItems:'center',overflow:'hidden'}}>
                  <LineChart daily={data.daily}/>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CONSOLE (Google Search Console) ── */}
        {tab==='console'&&canSee('console')&&(
          <div style={{display:'flex',flexDirection:'column',flex:1,minHeight:0,gap:8}}>
            {/* Header */}
            <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
              <svg width="15" height="15" viewBox="0 0 48 48" style={{flexShrink:0}}>
                <path fill="#4285F4" d="M43.6 24.5c0-1.5-.1-3-.4-4.5H24v8.5h11c-.5 2.5-1.9 4.6-3.9 6v5h6.3c3.7-3.4 5.9-8.4 5.9-15z"/>
                <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.4-4.9l-6.3-5c-1.8 1.2-4.2 1.9-7.1 1.9-5.5 0-10.1-3.7-11.7-8.7H5.8v5.2C9.1 39.7 16 44 24 44z"/>
                <path fill="#FBBC05" d="M12.3 27.3c-.4-1.2-.7-2.5-.7-3.8s.3-2.6.7-3.8V14.5H5.8C4.3 17.5 3.5 20.7 3.5 24s.8 6.5 2.3 9.5l6.5-6.2z"/>
                <path fill="#EA4335" d="M24 12.5c3.1 0 5.9 1.1 8.1 3.2l6-6C34.1 6.3 29.4 4.5 24 4.5c-7.9 0-14.8 4.3-18.2 10.8l6.5 5.2c1.6-5 6.2-8 11.7-8z"/>
              </svg>
              <span style={{color:P.textDim,fontSize:9,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.12em'}}>Google Search Console · grupo-ortiz.com</span>
              {scLoading&&<span style={{color:'#4285F4',fontSize:9,opacity:0.7}}>cargando…</span>}
              {scData?.ok&&<span style={{color:P.textDim,fontSize:9,marginLeft:'auto'}}>{scData.startDate} – {scData.endDate}</span>}
            </div>

            {/* 4 métricas interactivas — clic para mostrar/ocultar en la gráfica */}
            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)',gap:6,flexShrink:0}}>
              {scLoading&&!scData
                ? [0,1,2,3].map(i=><SkeletonCard key={i}/>)
                : scData?.ok
                  ? SC_METRICS.map(m => {
                      const isActive = activeMetrics.includes(m.id);
                      const rawVal = m.getVal(scData);
                      const toggle = () => setActiveMetrics(cur =>
                        cur.includes(m.id)
                          ? cur.length > 1 ? cur.filter(x=>x!==m.id) : cur
                          : [...cur, m.id]
                      );
                      return (
                        <div key={m.id} onClick={toggle}
                          style={{
                            background: P.surface,
                            border: `1.5px solid ${isActive ? m.color+'55' : P.border}`,
                            borderRadius: 10, padding:'10px 13px',
                            cursor:'pointer', position:'relative', overflow:'hidden',
                            transition:'border-color 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
                            boxShadow: isActive ? `0 0 0 1px ${m.color}20, 0 2px 10px ${m.color}12` : '0 1px 3px rgba(0,0,0,0.06)',
                            opacity: isActive ? 1 : 0.50,
                            minHeight: 78,
                            boxSizing:'border-box',
                          }}>
                          <div style={{position:'absolute',top:0,left:0,right:0,height:'2.5px',background:m.color,transition:'opacity 0.15s ease',opacity:isActive?0.75:0.18}}/>
                          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:5}}>
                            <span style={{color:P.textDim,fontSize:9,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.10em',lineHeight:1.3}}>{m.label}</span>
                            {/* Checkbox: always same size, checkmark fades in/out */}
                            <div style={{width:14,height:14,borderRadius:3,border:`1.5px solid ${isActive?m.color:P.border}`,background:isActive?m.color:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all 0.15s ease'}}>
                              <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{opacity:isActive?1:0,transition:'opacity 0.15s ease'}}>
                                <polyline points="2 6 5 9 10 3"/>
                              </svg>
                            </div>
                          </div>
                          <div style={{color:P.text,fontSize:22,fontFamily:"'DM Mono',monospace",fontWeight:500,letterSpacing:'-0.02em',lineHeight:1.1,marginBottom:3}}>{rawVal}</div>
                          <div style={{color:P.textDim,fontSize:9}}>{m.sub}</div>
                        </div>
                      );
                    })
                  : [0,1,2,3].map(i=><SkeletonCard key={i}/>)
              }
            </div>

            {/* Bento grid — llena espacio restante */}
            {scData?.ok&&(
              <div style={{
                flex:1, minHeight:0,
                display:'grid',
                gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1.6fr 1fr 1fr',
                gridTemplateRows:    isMobile ? 'auto' : isTablet ? 'auto 1fr 1fr' : '1fr 1fr',
                gap:7
              }}>
                {/* ── Gráfica de clics: span 2 filas (desktop) o 2 cols (tablet) ── */}
                <div className="card-hover" style={{...CARD,padding:'12px 14px',display:'flex',flexDirection:'column',minHeight:0,marginBottom:0,
                  gridRow:    (!isMobile&&!isTablet) ? '1 / 3' : undefined,
                  gridColumn: isTablet ? '1 / 3' : undefined }}>
                  <CardTopBar/>
                  <p style={{...ST,marginBottom:6}}>Rendimiento · {periodLabel}</p>
                  <div style={{flex:1,minHeight:0,overflow:'hidden'}}>
                    <SCLineChart dailyClicks={scData.dailyClicks} fill activeMetrics={activeMetrics}/>
                  </div>
                </div>

                {/* ── Consultas ── */}
                <div className="card-hover" style={{...CARD,padding:'12px 14px',display:'flex',flexDirection:'column',minHeight:0,marginBottom:0,overflow:'hidden'}}>
                  <CardTopBar/>
                  <p style={{...ST,marginBottom:6}}>Top consultas</p>
                  <div style={{flex:1,overflowY:'auto'}}>
                    {(scData.topQueries||[]).slice(0,8).map((q,i)=>{
                      const maxC=scData.topQueries[0]?.clicks||1,pct=Math.round(q.clicks/maxC*100);
                      return(
                        <div key={i} style={{display:'flex',alignItems:'center',gap:7,padding:'4px 0',borderBottom:`1px solid ${P.border2}`}}>
                          <span style={{color:i===0?P.text:P.textSub,fontSize:10,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:i===0?600:400}}>{q.query}</span>
                          <div style={{width:32,height:3,background:P.border2,borderRadius:2,overflow:'hidden',flexShrink:0}}>
                            <div style={{width:`${pct}%`,height:'100%',background:'#4285F4',borderRadius:2}}/>
                          </div>
                          <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#4285F4',minWidth:20,textAlign:'right',fontWeight:600}}>{q.clicks}</span>
                          <span style={{fontSize:9,color:P.textDim,minWidth:26,textAlign:'right'}}>{q.ctr}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Países ── */}
                <div className="card-hover" style={{...CARD,padding:'12px 14px',display:'flex',flexDirection:'column',minHeight:0,marginBottom:0,overflow:'hidden'}}>
                  <CardTopBar/>
                  <p style={{...ST,marginBottom:6}}>Por país</p>
                  <div style={{flex:1,overflowY:'auto'}}>
                    {(scData.topCountries||[]).slice(0,8).map((c,i)=>{
                      const maxC=(scData.topCountries[0]?.clicks)||1,pct=Math.round(c.clicks/maxC*100);
                      const entry=COUNTRY_MAP[c.country]||{name:c.country.toUpperCase(),flag:'🌐'};
                      return(
                        <div key={i} style={{display:'flex',alignItems:'center',gap:6,padding:'4px 0',borderBottom:`1px solid ${P.border2}`}}>
                          <span style={{fontSize:12,flexShrink:0,lineHeight:1}}>{entry.flag}</span>
                          <span style={{color:i===0?P.text:P.textSub,fontSize:10,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:i===0?600:400}}>{entry.name}</span>
                          <div style={{width:30,height:3,background:P.border2,borderRadius:2,overflow:'hidden',flexShrink:0}}>
                            <div style={{width:`${pct}%`,height:'100%',background:'#34A853',borderRadius:2}}/>
                          </div>
                          <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#34A853',minWidth:18,textAlign:'right',fontWeight:600}}>{c.clicks}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Top páginas ── */}
                <div className="card-hover" style={{...CARD,padding:'12px 14px',display:'flex',flexDirection:'column',minHeight:0,marginBottom:0,overflow:'hidden'}}>
                  <CardTopBar/>
                  <p style={{...ST,marginBottom:6}}>Top páginas</p>
                  <div style={{flex:1,overflowY:'auto'}}>
                    {(scData.topPages||[]).slice(0,6).map((pg,i)=>{
                      const maxC=(scData.topPages[0]?.clicks)||1,pct=Math.round(pg.clicks/maxC*100);
                      return(
                        <div key={i} style={{display:'flex',alignItems:'center',gap:7,padding:'4px 0',borderBottom:`1px solid ${P.border2}`}}>
                          <span style={{color:i===0?P.text:P.textSub,fontSize:10,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:i===0?600:400}}>{pg.page||'/'}</span>
                          <div style={{width:30,height:3,background:P.border2,borderRadius:2,overflow:'hidden',flexShrink:0}}>
                            <div style={{width:`${pct}%`,height:'100%',background:'#FBBC04',borderRadius:2}}/>
                          </div>
                          <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#FBBC04',minWidth:18,textAlign:'right',fontWeight:600}}>{pg.clicks}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Dispositivos ── */}
                <div className="card-hover" style={{...CARD,padding:'12px 14px',display:'flex',flexDirection:'column',minHeight:0,marginBottom:0,overflow:'hidden'}}>
                  <CardTopBar/>
                  <p style={{...ST,marginBottom:8}}>Dispositivos</p>
                  {(()=>{
                    const devs=scData.topDevices||[];
                    const total=devs.reduce((s,d)=>s+d.clicks,0)||1;
                    const CLR={DESKTOP:'#4285F4',MOBILE:'#34A853',TABLET:P.orange,SMARTTV:'#EA4335'};
                    const LBL={DESKTOP:'Escritorio',MOBILE:'Móvil',TABLET:'Tablet',SMARTTV:'Smart TV'};
                    const ICO={DESKTOP:'💻',MOBILE:'📱',TABLET:'⬜',SMARTTV:'📺'};
                    return(<>
                      {/* Barra de distribución */}
                      <div style={{height:7,borderRadius:4,overflow:'hidden',display:'flex',gap:2,marginBottom:10,flexShrink:0}}>
                        {devs.map((d,i)=>(
                          <div key={i} style={{
                            flex:d.clicks/total,
                            background:CLR[d.device]||P.grayMid,
                            borderRadius:3,minWidth:3
                          }}/>
                        ))}
                      </div>
                      {/* Lista */}
                      <div style={{flex:1,overflowY:'auto'}}>
                        {devs.map((d,i)=>{
                          const pct=Math.round(d.clicks/total*100);
                          const clr=CLR[d.device]||P.grayMid;
                          return(
                            <div key={i} style={{display:'flex',alignItems:'center',gap:7,padding:'5px 0',borderBottom:`1px solid ${P.border2}`}}>
                              <span style={{fontSize:13,flexShrink:0}}>{ICO[d.device]||'📊'}</span>
                              <span style={{color:i===0?P.text:P.textSub,fontSize:10,flex:1,fontWeight:i===0?600:400}}>{LBL[d.device]||d.device}</span>
                              <span style={{fontSize:9,color:P.textDim,minWidth:26,textAlign:'right'}}>{pct}%</span>
                              <div style={{width:30,height:3,background:P.border2,borderRadius:2,overflow:'hidden',flexShrink:0}}>
                                <div style={{width:`${pct}%`,height:'100%',background:clr,borderRadius:2}}/>
                              </div>
                              <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:clr,minWidth:18,textAlign:'right',fontWeight:600}}>{d.clicks}</span>
                            </div>
                          );
                        })}
                      </div>
                    </>);
                  })()}
                </div>
              </div>
            )}

            {!scLoading&&!scData?.ok&&(
              <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',background:P.surface,border:`1px solid ${P.border}`,borderRadius:12,color:P.textDim,fontSize:12}}>
                Sin datos de Search Console para el período seleccionado
              </div>
            )}
          </div>
        )}

        {/* ── ACTIVITY ── */}
        {!loading&&data&&tab==='activity'&&canSee('activity')&&(
          <div className="tab-content" key="ac">
            <div className="card-hover" style={CARD}>
              <CardTopBar/>
              <p style={ST}>Historial diario</p>
              <div style={{ overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12, minWidth:isMobile?480:'auto' }}>
                  <thead><tr>{['Fecha','Sesiones','Mensajes','WhatsApp','PDFs','Conv.%'].map(h=>(
                    <th key={h} style={{ color:P.textDim, fontWeight:600, padding:'9px 11px', textAlign:'left',
                      borderBottom:`1px solid ${P.border}`, fontSize:10, textTransform:'uppercase',
                      letterSpacing:'0.08em', background:P.surface2, whiteSpace:'nowrap' }}>{h}</th>
                  ))}</tr></thead>
                  <tbody>
                    {Object.entries(data.daily||{}).sort(([a],[b])=>b.localeCompare(a)).map(([date,v])=>{
                      const conv=v.messages?Math.round(((v.wa||0)/v.messages)*100):0, isToday=date===today;
                      return (
                        <tr key={date} className="row-hover" style={{ background:isToday?`${P.orange}07`:'transparent', borderBottom:`1px solid ${P.border2}` }}>
                          <td style={{ padding:'9px 11px', color:P.text, fontFamily:T.mono, fontSize:11, whiteSpace:'nowrap' }}>
                            {isToday&&<Tag color={P.orange} size={9}>hoy</Tag>} {date}
                          </td>
                          <td className="mono" style={{ padding:'9px 11px', color:P.textSub }}>{v.sessions||0}</td>
                          <td className="mono" style={{ padding:'9px 11px', color:P.text, fontWeight:600 }}>{v.messages||0}</td>
                          <td className="mono" style={{ padding:'9px 11px', color:P.orange, fontWeight:600 }}>{v.wa||0}</td>
                          <td className="mono" style={{ padding:'9px 11px', color:P.grayMid }}>{v.pdf||0}</td>
                          <td style={{ padding:'9px 11px' }}>
                            <span style={{ padding:'2px 7px', borderRadius:5,
                              background:conv>10?P.okDim:conv>0?P.warnDim:'transparent',
                              color:conv>10?P.orange:conv>0?P.grayLight:P.textDim,
                              fontSize:10, fontFamily:T.mono, fontWeight:600 }}>{conv}%</span>
                          </td>
                        </tr>
                      );
                    })}
                    {!Object.keys(data.daily||{}).length&&<tr><td colSpan={6} style={{ color:P.textDim, textAlign:'center', padding:44, fontSize:11 }}>Sin datos</td></tr>}
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

        {/* ── PRODUCTS ── */}
        {!loading&&data&&tab==='products'&&canSee('products')&&(
          <div className="tab-content" key="pr">
            <div className="card-hover" style={CARD}>
              <CardTopBar/>
              <p style={ST}>Productos más consultados</p>
              <BarChart data={prodD} color={P.orange} max={10}/>
              {prodD.length>0&&(()=>{ const top=[...prodD].sort((a,b)=>b.value-a.value)[0]; return (
                <div style={{ marginTop:20, padding:'14px 16px',
                  background:`linear-gradient(135deg,${P.surface2},${P.surface3})`,
                  borderRadius:10, border:`1px solid ${P.orange}28`,
                  borderLeft:`3px solid ${P.orange}`,
                  display:'flex', alignItems:'center', gap:14,
                  boxShadow:`0 0 20px ${P.orange}10` }}>
                  <div>
                    <span style={{ color:P.textDim, fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>⭐ Producto estrella</span>
                    <p style={{ margin:'5px 0 0', fontWeight:700, fontSize:16, color:P.text, letterSpacing:'-0.01em' }}>
                      {top?.label}
                      <span className="mono" style={{ color:P.orange, marginLeft:10, fontWeight:500, fontSize:14 }}>×{top?.value}</span>
                    </p>
                  </div>
                </div>
              ); })()}
            </div>
          </div>
        )}

        {/* ── KEYWORDS ── */}
        {!loading&&data&&tab==='keywords'&&canSee('keywords')&&(
          <div className="tab-content" key="kw" style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:12 }}>
            <div className="card-hover" style={CARD}><CardTopBar/><p style={ST}>Palabras clave</p><BarChart data={kwD} color={P.orange} max={12}/></div>
            <div className="card-hover" style={CARD}><CardTopBar color={P.grayLight}/><p style={ST}>Productos mencionados</p><BarChart data={prodD} color={P.grayLight} max={8}/></div>
          </div>
        )}

        {/* ── MESSAGES ── */}
        {!loading&&data&&tab==='messages'&&canSee('messages')&&(
          <div className="tab-content" key="ms">
            <div className="card-hover" style={CARD}>
              <CardTopBar/>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:8 }}>
                <p style={{ ...ST, marginBottom:0 }}>Consultas en tiempo real</p>
                <Tag color={P.orange}>{data.lastMessages?.length||0} registros</Tag>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {(data.lastMessages||[]).slice().reverse().map((m,i)=>{
                  const iColor={compra:P.orange,pdf:P.grayLight,reclutamiento:P.grayMid}, color=iColor[m.intent]||P.border;
                  return (
                    <div key={i} className="row-hover"
                      style={{ padding:'9px 12px', background:P.surface2, borderRadius:8,
                        border:`1px solid ${P.border}`, display:'flex', gap:10, alignItems:'center' }}>
                      <div style={{ width:2.5, height:30, borderRadius:2, background:color, flexShrink:0, boxShadow:`0 0 6px ${color}60` }}/>
                      <div style={{ flexShrink:0, minWidth:48 }}>
                        <div className="mono" style={{ color:P.textSub, fontSize:10 }}>{fmtHora(m.ts)}</div>
                        <div className="mono" style={{ color:P.textDim, fontSize:9 }}>{fmtFecha(m.ts)}</div>
                      </div>
                      <span style={{ color:P.text, fontSize:12, flex:1, lineHeight:1.55, wordBreak:'break-word', minWidth:0 }}>{m.user}</span>
                      {m.prod&&!isMobile&&<Tag color={P.grayMid}>{m.prod}</Tag>}
                      <Tag color={color} size={9}>{m.intent||'otro'}</Tag>
                    </div>
                  );
                })}
                {!(data.lastMessages||[]).length&&<div style={{ textAlign:'center', padding:'48px 0', color:P.textDim, fontSize:12 }}>Sin mensajes registrados</div>}
              </div>
            </div>
          </div>
        )}

        {/* ── CONVERSACIONES ── */}
        {tab==='conversations'&&canSee('conversations')&&(
          <div className="tab-content" key="conv">
            <div style={{ display:'flex', gap:12, alignItems:'flex-start', flexWrap:isMobile?'wrap':'nowrap' }}>

              {/* ── Lista de sesiones ── */}
              <div className="card-hover" style={{ ...CARD, flex:'0 0 auto', width:isMobile?'100%':300, minWidth:0 }}>
                <CardTopBar/>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, gap:8 }}>
                  <p style={{ ...ST, marginBottom:0 }}>Sesiones</p>
                  <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                    {convSessions.length>0&&<Tag color={P.orange}>{convSessions.length}</Tag>}
                    <button onClick={loadConversations} className="btn-base"
                      style={{ padding:'5px 10px', borderRadius:7, fontSize:11, background:P.border2, border:`1px solid ${P.border}`, color:P.textSub, cursor:'pointer', display:'flex', alignItems:'center' }}>
                      {Icons.sync}
                    </button>
                  </div>
                </div>
                {convLoading&&<div style={{ textAlign:'center', padding:'36px 0', color:P.textDim, fontSize:12 }}>Cargando...</div>}
                {!convLoading&&convSessions.length===0&&<div style={{ textAlign:'center', padding:'36px 0', color:P.textDim, fontSize:12 }}>Sin conversaciones registradas</div>}
                <div style={{ display:'flex', flexDirection:'column', gap:5, maxHeight:560, overflowY:'auto' }}>
                  {convSessions.map(s=>{
                    const isSelected=selectedConv===s.session_id;
                    const intents=(Array.isArray(s.intents)?s.intents:(s.intents||'').split(',').filter(Boolean)).slice(0,3);
                    const iColor={compra:P.orange,pdf:P.grayLight,reclutamiento:P.grayMid};
                    return (
                      <button key={s.session_id} onClick={()=>{ setSelectedConv(s.session_id); loadConvMessages(s.session_id); }}
                        className="row-hover btn-base"
                        style={{ textAlign:'left', padding:'9px 10px', borderRadius:8, cursor:'pointer',
                          background:isSelected?P.border2:P.surface2,
                          border:`1px solid ${isSelected?P.orange:P.border}`,
                          display:'flex', flexDirection:'column', gap:3 }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:6 }}>
                          <span className="mono" style={{ fontSize:9, color:P.textDim }}>{fmtFecha(s.started_at)}</span>
                          <Tag color={P.grayMid} size={9}>{s.msg_count} msgs</Tag>
                        </div>
                        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                          {intents.map(it=><Tag key={it} color={iColor[it.trim()]||P.border} size={8}>{it.trim()}</Tag>)}
                        </div>
                        {s.products&&s.products.length>0&&<span style={{ fontSize:9, color:P.textDim, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'100%' }}>{(Array.isArray(s.products)?s.products:s.products.split(',').filter(Boolean)).slice(0,2).join(', ')}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Hilo de mensajes ── */}
              <div className="card-hover" style={{ ...CARD, flex:1, minWidth:0 }}>
                <CardTopBar/>
                {!selectedConv&&(
                  <div style={{ textAlign:'center', padding:'64px 0', color:P.textDim, fontSize:12 }}>
                    Selecciona una sesión para ver la conversación
                  </div>
                )}
                {selectedConv&&(
                  <>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, gap:8 }}>
                      <p style={{ ...ST, marginBottom:0 }}>Conversación</p>
                      <span className="mono" style={{ fontSize:9, color:P.textDim, overflow:'hidden', textOverflow:'ellipsis', maxWidth:200, display:'inline-block' }}>{selectedConv}</span>
                    </div>
                    {convMsgLoad&&<div style={{ textAlign:'center', padding:'36px 0', color:P.textDim, fontSize:12 }}>Cargando mensajes...</div>}
                    <div style={{ display:'flex', flexDirection:'column', gap:10, maxHeight:560, overflowY:'auto' }}>
                      {convMessages.map((m,i)=>(
                        <div key={m.id||i} style={{ display:'flex', flexDirection:'column', gap:4 }}>
                          {/* Usuario */}
                          <div style={{ display:'flex', justifyContent:'flex-end' }}>
                            <div style={{ background:P.orange+'22', border:`1px solid ${P.orange}44`, borderRadius:'12px 12px 3px 12px',
                              padding:'7px 11px', maxWidth:'80%' }}>
                              <div style={{ fontSize:11, color:P.text, lineHeight:1.5, wordBreak:'break-word' }}>{m.user_msg}</div>
                              <div className="mono" style={{ fontSize:8, color:P.textDim, marginTop:3, textAlign:'right' }}>{fmtHora(m.ts)}</div>
                            </div>
                          </div>
                          {/* Bot */}
                          <div style={{ display:'flex', justifyContent:'flex-start' }}>
                            <div style={{ background:P.surface2, border:`1px solid ${P.border}`, borderRadius:'12px 12px 12px 3px',
                              padding:'7px 11px', maxWidth:'80%' }}>
                              <div style={{ fontSize:11, color:P.textSub, lineHeight:1.5, wordBreak:'break-word' }}>{m.bot_reply}</div>
                              {(m.intent||m.product)&&(
                                <div style={{ display:'flex', gap:4, marginTop:5, flexWrap:'wrap' }}>
                                  {m.intent&&<Tag color={P.grayMid} size={8}>{m.intent}</Tag>}
                                  {m.product&&<Tag color={P.grayLight} size={8}>{m.product}</Tag>}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {!convMsgLoad&&convMessages.length===0&&<div style={{ textAlign:'center', padding:'36px 0', color:P.textDim, fontSize:12 }}>Sin mensajes</div>}
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ── DISTRIBUIDORES ── */}
        {tab==='distribuidores'&&canSee('distribuidores')&&(
          <div className="tab-content" key="dist">
            <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr 1fr':'repeat(auto-fit,minmax(175px,1fr))', gap:10, marginBottom:16 }}>
              <StatCard label="Total"        value={leads.length}  sub="solicitudes acumuladas" color={P.orange}     icon="🤝"/>
              <StatCard label="Esta semana"  value={leadsSemana}   sub="últimos 7 días"          color={P.grayLight}  icon="📅"/>
              <StatCard label="Hoy"          value={leadsHoy}      sub="nuevas hoy"              color={P.orangeWarm} icon="⚡"/>
            </div>
            {leads.length>=1&&(()=>{
              const _bd={}; leads.forEach(l=>{ if(!l.ts)return; const iso=String(l.ts).trim().replace(' ','T')+(String(l.ts).includes('Z')?'':'Z'); const d=new Date(iso); if(isNaN(d.getTime()))return; const k=d.toLocaleString('en-CA',{timeZone:'America/Mexico_City'}).split(',')[0]; if(k)_bd[k]=(_bd[k]||0)+1; });
              const _peak=Object.values(_bd).length ? Math.max(...Object.values(_bd)) : 0;
              return (
                <div className="card-hover" style={{ ...CARD, marginBottom:12 }}>
                  <CardTopBar/>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:6 }}>
                    <p style={{ ...ST, marginBottom:0 }}>Registros diarios — últimos 14 días</p>
                    {_peak>0&&<Tag color={P.orange} size={9}>pico: {_peak} en un día</Tag>}
                  </div>
                  <LeadsLineChart leads={leads}/>
                </div>
              );
            })()}
            {leadsProdData.length>0&&(
              <div className="card-hover" style={{ ...CARD, marginBottom:12 }}>
                <CardTopBar/>
                <p style={ST}>Productos de interés</p>
                <BarChart data={leadsProdData} color={P.orange} max={8}/>
              </div>
            )}
            <div className="card-hover" style={CARD}>
              <CardTopBar/>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:8 }}>
                <p style={{ ...ST, marginBottom:0 }}>Registro de solicitudes</p>
                <div style={{ display:'flex', gap:6, alignItems:'center', flexWrap:'wrap' }}>
                  <Tag color={P.orange}>{leads.length} registros</Tag>
                  <button onClick={loadLeads} className="btn-base"
                    style={{ padding:'5px 10px', borderRadius:7, fontSize:11, fontWeight:500,
                      background:P.border2, border:`1px solid ${P.border}`,
                      color:P.textSub, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
                    {Icons.sync}
                  </button>
                  {isOnlyAdmin&&<button onClick={async()=>{ if(!confirm('¿Borrar todos los leads?'))return; await fetch('/api/analytics',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'resetLeads'})}); setLeads([]); }} className="btn-base"
                    style={{ padding:'5px 10px', borderRadius:7, fontSize:11, fontWeight:500,
                      background:P.errDim, border:`1px solid ${P.gray}28`, color:P.grayLight,
                      cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
                    {Icons.trash} Borrar
                  </button>}
                </div>
              </div>
              <input type="text" placeholder="Buscar por nombre, empresa, WhatsApp o email..."
                value={leadSearch} onChange={e=>setLeadSearch(e.target.value)}
                style={{ width:'100%', marginBottom:14, background:P.surface2,
                  border:`1px solid ${P.border}`, borderRadius:9, padding:'10px 15px',
                  color:P.text, fontSize:12, outline:'none', transition:'border-color 0.15s ease' }}
                onFocus={e=>e.target.style.borderColor=P.orange+'48'}
                onBlur={e=>e.target.style.borderColor=P.border}/>
              {leadsLoad?<Spinner/>:(
                <div style={{ overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12, minWidth:isMobile?560:'auto' }}>
                    <thead><tr>{['Fecha','Nombre','Empresa','WhatsApp','Email','Productos','Nota'].map(h=>(
                      <th key={h} style={{ color:P.textDim, fontWeight:600, padding:'9px 11px', textAlign:'left',
                        borderBottom:`1px solid ${P.border}`, fontSize:10, textTransform:'uppercase',
                        letterSpacing:'0.08em', background:P.surface2, whiteSpace:'nowrap' }}>{h}</th>
                    ))}</tr></thead>
                    <tbody>
                      {leads.filter(l=>{ const q=leadSearch.toLowerCase(); return !q||(l.nombre||'').toLowerCase().includes(q)||(l.empresa||'').toLowerCase().includes(q)||(l.email||'').toLowerCase().includes(q)||(l.whatsapp||'').includes(q); }).map((l,i)=>(
                        <tr key={i} className="row-hover" style={{ borderBottom:`1px solid ${P.border2}` }}>
                          <td className="mono" style={{ padding:'9px 11px', color:P.textDim, fontSize:10, whiteSpace:'nowrap' }}>{fmtFechaHora(l.ts)}</td>
                          <td style={{ padding:'9px 11px', color:P.text, fontWeight:600, whiteSpace:'nowrap' }}>{l.nombre}</td>
                          <td style={{ padding:'9px 11px', color:P.textSub, whiteSpace:'nowrap' }}>{l.empresa}</td>
                          <td style={{ padding:'9px 11px' }}>
                            <a href={`https://wa.me/52${(l.whatsapp||'').replace(/\D/g,'')}`} target="_blank"
                              style={{ color:P.orange, fontFamily:T.mono, fontSize:11, textDecoration:'none',
                                display:'flex', alignItems:'center', gap:5, whiteSpace:'nowrap',
                                fontWeight:600 }}>
                              📲 {l.whatsapp}
                            </a>
                          </td>
                          <td className="mono" style={{ padding:'9px 11px', color:P.textSub, fontSize:11, whiteSpace:'nowrap' }}>{l.email}</td>
                          <td style={{ padding:'9px 11px' }}>
                            {(l.productos||'').split(',').filter(Boolean).map((pr,j)=><Tag key={j} color={P.orange} size={9}>{pr.trim()}</Tag>)}
                            {!(l.productos||'').trim()&&<span style={{ color:P.textDim, fontSize:10 }}>—</span>}
                          </td>
                          <td style={{ padding:'9px 11px' }}>
                            {l.comentarios
                              ? <div title={l.comentarios} style={{ display:'inline-flex', alignItems:'center', gap:4, background:'rgba(251,103,11,0.1)', border:'1px solid rgba(251,103,11,0.3)', borderRadius:6, padding:'3px 7px', cursor:'default' }}>
                                  <span style={{ fontSize:10 }}>💬</span>
                                  <span style={{ fontSize:9, color:'#FB670B', fontWeight:600, maxWidth:100, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', display:'inline-block' }}>{l.comentarios.slice(0,40)}{l.comentarios.length>40?'…':''}</span>
                                </div>
                              : <span style={{ color:'rgba(236,235,224,0.20)', fontSize:10 }}>—</span>
                            }
                          </td>
                        </tr>
                      ))}
                      {!leads.length&&!leadsLoad&&<tr><td colSpan={7} style={{ color:P.textDim, textAlign:'center', padding:44, fontSize:12 }}>Sin solicitudes registradas</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── RECRUITMENT ── */}
        
        {tab==='recruitment'&&canSee('recruitment')&&(
          <div className="tab-content" key="rc"><RecruitmentTab canDelete={isOnlyAdmin || role.name === 'RH'} theme={theme}/></div>
        )}
        

        {/* ── AI ── */}
        {!loading&&data&&tab==='ai'&&canSee('ai')&&(
          <div className="tab-content" key="ai">
            <div className="card-hover" style={CARD}>
              <CardTopBar/>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:P.okDim,
                  border:`1px solid ${P.orange}28`, display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:`0 0 16px ${P.orange}20` }}>
                  <span style={{ color:P.orange, fontSize:16 }}>✦</span>
                </div>
                <div>
                  <p style={{ ...ST, marginBottom:2 }}>Análisis Inteligente · BotGO</p>
                  <p style={{ color:P.textDim, fontSize:11, margin:0, lineHeight:1.5 }}>Resumen ejecutivo con patrones de comportamiento y recomendaciones comerciales.</p>
                </div>
              </div>
              <button onClick={doAI} disabled={genAI} className="btn-base"
                style={{ background:genAI?P.surface3:P.orange,
                  color:genAI?P.textDim:'#fff', border:'none', borderRadius:9,
                  padding:'11px 24px', fontSize:12, fontWeight:600,
                  cursor:genAI?'not-allowed':'pointer',
                  display:'flex', alignItems:'center', gap:8,
                  boxShadow:!genAI?`0 4px 18px ${P.orange}38`:'none' }}>
                {genAI
                  ? <><div style={{ width:12,height:12,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.2)',borderTop:'2px solid #fff',animation:'spin 0.65s linear infinite' }}/>Analizando...</>
                  : <>✦ Generar análisis</>}
              </button>
              {summary&&(
                <div style={{ marginTop:18, padding:'18px 20px',
                  background:`linear-gradient(135deg,${P.surface2},${P.surface3})`,
                  border:`1px solid ${P.orange}30`, borderLeft:`3px solid ${P.orange}`,
                  borderRadius:10, boxShadow:`0 4px 24px rgba(0,0,0,0.4), 0 0 32px ${P.orange}08` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                    <Dot active color={P.orange}/>
                    <span style={{ color:P.textDim, fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>Resumen ejecutivo · {periodLabel}</span>
                  </div>
                  <p style={{ color:P.text, fontSize:13, lineHeight:1.80, whiteSpace:'pre-wrap' }}>{summary}</p>
                </div>
              )}
              <div style={{ height:1, background:`linear-gradient(90deg,${P.border},transparent)`, margin:'20px 0' }}/>
              <p style={{ ...ST, marginBottom:12 }}>Últimas 20 consultas</p>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {(data.lastMessages||[]).slice(-20).reverse().map((m,i)=>{
                  const iColor={compra:P.orange,pdf:P.grayLight}, color=iColor[m.intent]||P.border;
                  return (
                    <div key={i} style={{ padding:'9px 12px', background:P.surface2, borderRadius:7,
                      border:`1px solid ${P.border}`, display:'flex', gap:9, alignItems:'center' }}>
                      <span className="mono" style={{ color:P.textDim, fontSize:9, flexShrink:0 }}>{fmtFecha(m.ts)}</span>
                      <span style={{ color:P.text, fontSize:12, flex:1, wordBreak:'break-word', minWidth:0 }}>{m.user}</span>
                      <Tag color={color} size={9}>{m.intent||'otro'}</Tag>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── REPORTES ── */}
        {tab==='reportes'&&canSeeReportes&&(
          <div className="tab-content" key="rep" style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Header con selector de período incrustado */}
            <div style={{ background:P.surface, border:`1px solid ${P.border}`,
              borderRadius:12, borderLeft:`3px solid ${P.orange}`,
              boxShadow:`0 2px 16px rgba(0,0,0,0.35)`, overflow:'hidden' }}>
              <div style={{ display:'flex', alignItems:'center', gap:13, padding:'16px 20px' }}>
                <div style={{ width:36, height:36, borderRadius:9, background:P.okDim,
                  border:`1px solid ${P.orange}28`, display:'flex', alignItems:'center', justifyContent:'center',
                  flexShrink:0, boxShadow:`0 0 14px ${P.orange}20` }}>
                  <span style={{ color:P.orange }}>{Icons.file}</span>
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:P.text, letterSpacing:'-0.02em' }}>Reportes PDF</div>
                  <div style={{ fontSize:11, color:P.textDim, marginTop:2 }}>
                    Período activo: <span style={{ color:P.orange, fontWeight:700 }}>{periodLabel}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Report cards — 4 en una sola fila */}
            <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)', gap:10 }}>
              {[
                { type:'resumen',       label:'Resumen',        desc:'Vista ejecutiva · 1 página completa', icon:Icons.bar,     accent:'#A855F7' },
                { type:'general',       label:'General',        desc:'Analytics · Distrib. · RH',           icon:Icons.bar,     accent:P.orange },
                { type:'distribuidor',  label:'Distribuidores', desc:'Red de distribución · solicitudes',   icon:Icons.truck,   accent:'#0077CC' },
                { type:'reclutamiento', label:'Reclutamiento',  desc:'Candidatos · pipeline de talento',    icon:Icons.recruit, accent:'#22C55E' },
              ].map(rt=>(
                <div key={rt.type}
                  style={{ background:P.surface, border:`1px solid ${P.border}`,
                    borderRadius:12, padding:'14px 14px 16px',
                    display:'flex', flexDirection:'column', gap:10,
                    position:'relative', overflow:'hidden',
                    boxShadow:`0 2px 12px rgba(0,0,0,0.35)`,
                    transition:'transform 0.14s ease, box-shadow 0.14s ease' }}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 8px 28px rgba(0,0,0,0.50), 0 0 0 1px ${rt.accent}30`;}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.35)';}}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:2.5,
                    background:`linear-gradient(90deg,${rt.accent},${rt.accent}50,transparent)` }}/>
                  <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                    <div style={{ width:30, height:30, borderRadius:7, background:`${rt.accent}14`,
                      border:`1px solid ${rt.accent}25`, display:'flex', alignItems:'center', justifyContent:'center',
                      flexShrink:0, color:rt.accent }}>
                      {rt.icon}
                    </div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:12.5, color:P.text, letterSpacing:'-0.01em', whiteSpace:'nowrap' }}>{rt.label}</div>
                      <div style={{ fontSize:9.5, color:P.textDim, lineHeight:1.4, marginTop:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{rt.desc}</div>
                    </div>
                  </div>
                  <DownloadReportButton
                    data={data}
                    periodMeta={{ preset:activePresetId, from:activePeriod?.from, to:activePeriod?.to }}
                    reportType={rt.type}
                    style={{ fontSize:10.5, padding:'8px 12px', width:'100%', justifyContent:'center' }}
                  />
                </div>
              ))}
            </div>

            {/* Notificaciones y envíos — solo con permiso canDownload */}
            {isAdmin && <NotifyConfigSection theme={theme} P={P}/>}

            {isAdmin && (
              <div style={{ background:P.surface, border:`1px solid ${P.border}`,
                borderRadius:12, padding:'18px 20px', position:'relative', overflow:'hidden',
                boxShadow:`0 2px 16px rgba(0,0,0,0.35)` }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2.5,
                  background:`linear-gradient(90deg,${P.orange},${P.orangeWarm},transparent)`, opacity:0.55 }}/>
                <ReportScheduler theme={theme}/>
              </div>
            )}
          </div>
        )}

        {/* ── USERS ── */}
        {tab==='users'&&canSee('users')&&(
          <div className="tab-content" key="us"><UsersTab/></div>
        )}
              {/* ── VACANTES ── */}
        {tab==='vacantes'&&canSee('vacantes')&&(
          <div className="tab-content" key="vac">
            <VacantesTab theme={theme}/>
          </div>
        )}
      </div>
     
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function AdminPanel() {
  
  const [visible,setVisible]=useState(false), [role,setRole]=useState(null);

  // Lee el tema del sistema del sitio (mismo key que el navbar: 'theme')
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') return stored;
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    } catch { return 'dark'; }
  });

  const palette = theme === 'dark' ? DARK_P : LIGHT_P;

  // Aplica el tema al <html> y sincroniza con el navbar del sitio
  const applyTheme = useCallback((next) => {
    try {
      localStorage.setItem('theme', next);
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      document.documentElement.setAttribute('data-theme', next);
      // Sincroniza los checkboxes del navbar visualmente
      document.querySelectorAll('.js-theme-toggle').forEach(el => {
        if (el instanceof HTMLInputElement) el.checked = next === 'dark';
      });
    } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      return next;
    });
  }, [applyTheme]);

  // Escucha cambios del navbar (MutationObserver en html.classList)
  useEffect(() => {
    const obs = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      const next = isDark ? 'dark' : 'light';
      setTheme(next);
      document.documentElement.setAttribute('data-theme', next);
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // Aplica data-theme inicial
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(()=>{
    const fn=e=>{
      if((e.ctrlKey||e.metaKey)&&e.key==='k'){ e.preventDefault(); setVisible(s=>!s); }
    };
    window.addEventListener('keydown',fn);
    return()=>window.removeEventListener('keydown',fn);
  },[]);

  useEffect(()=>{
    if(visible){
      const scrollY=window.scrollY;
      document.documentElement.style.overflow='hidden';
      document.body.style.overflow='hidden';
      document.body.style.position='fixed';
      document.body.style.top=`-${scrollY}px`;
      document.body.style.width='100%';
      document.body.dataset.scrollY=scrollY;
    } else {
      const scrollY=parseInt(document.body.dataset.scrollY||'0',10);
      document.documentElement.style.overflow='';
      document.body.style.overflow='';
      document.body.style.position='';
      document.body.style.top='';
      document.body.style.width='';
      window.scrollTo(0,scrollY);
    }
    return()=>{
      const scrollY=parseInt(document.body.dataset.scrollY||'0',10);
      document.documentElement.style.overflow='';
      document.body.style.overflow='';
      document.body.style.position='';
      document.body.style.top='';
      document.body.style.width='';
      window.scrollTo(0,scrollY);
    };
  },[visible]);

  return (
    <PCtx.Provider value={palette}>
      <div className="aroot" data-theme={theme}>
        <style>{GLOBAL_CSS}</style>
        {visible&&(
          <div className="admin-overlay visible">
            {!role
              ? <div style={{ background:palette.surface, border:`1px solid ${palette.border}`,
                  borderRadius:18, width:'94vw', maxWidth:400,
                  boxShadow:`0 48px 120px rgba(0,0,0,0.80), 0 0 0 1px ${palette.orange}18`,
                  position:'relative', overflow:'hidden' }}>
                  <Login onLogin={r=>setRole(r)}/>
                </div>
              : <Dash onClose={()=>{setVisible(false);setRole(null);}} role={role} theme={theme} toggleTheme={toggleTheme}/>
            }
          </div>
        )}
      </div>
    </PCtx.Provider>
  );
}