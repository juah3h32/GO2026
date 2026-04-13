// src/components/ReportScheduler.jsx
// BotGO · Programador de Reportes v3 · Modal fix + diseño premium
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';

const C = {
  orange:    '#FB670B',
  black:     '#262626',
  gray:      '#535353',
  grayMid:   '#8A8A7A',
  grayLight: '#C4C3B5',
  cream:     '#ECEBE0',
  white:     '#FFFFFF',
  surface:   '#1E1D1B',
  surface2:  '#252420',
  surface3:  '#2D2C28',
  surface4:  '#333230',
  border:    'rgba(236,235,224,0.07)',
  border2:   'rgba(236,235,224,0.12)',
  border3:   'rgba(236,235,224,0.18)',
  text:      'rgba(236,235,224,0.93)',
  textSub:   'rgba(236,235,224,0.52)',
  textDim:   'rgba(236,235,224,0.26)',
  textGhost: 'rgba(236,235,224,0.14)',
};

// ── Iconos SVG inline ─────────────────────────────────────────────────────────
const Ic = {
  chart:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  truck:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 6v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  recruit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>,
  clock:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  cal:     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  phone:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3"/></svg>,
  send:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  play:    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  pause:   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="6" y1="4" x2="6" y2="20"/><line x1="18" y1="4" x2="18" y2="20"/></svg>,
  edit:    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:   <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  add:     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  close:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check:   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  range:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/></svg>,
  info:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  ai:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L9.27 9.27 3 12l6.27 2.73L12 21l2.73-6.27L21 12l-6.27-2.73L12 3z"/></svg>,
};

const REPORT_TYPES = [
  { value:'resumen',       label:'Resumen',        icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>, color:'#A855F7', desc:'Vista ejecutiva · 1 página completa' },
  { value:'general',       label:'General',        icon:Ic.chart,   color:C.orange,    desc:'Analytics, distribuidores y reclutamiento' },
  { value:'distribuidor',  label:'Distribuidores', icon:Ic.truck,   color:'#0088DD',   desc:'Red de distribución y solicitudes' },
  { value:'reclutamiento', label:'Reclutamiento',  icon:Ic.recruit, color:'#22C55E',   desc:'Pipeline de candidatos y talento' },
  { value:'candidatos_ia', label:'IA · Candidatos',icon:Ic.ai,      color:'#8B5CF6',   desc:'Ranking IA de candidatos por vacante y perfil' },
];
const PERIODS = [
  { value:'today', label:'Hoy'      },
  { value:'7d',   label:'7 días'   },
  { value:'30d',  label:'30 días'  },
  { value:'month',label:'Este mes' },
  { value:'custom',label:'Rango…'  },
];
const FREQUENCIES = [
  { value:'daily',  label:'Diario',  sub:'Cada día'    },
  { value:'weekly', label:'Semanal', sub:'Cada semana' },
  { value:'monthly',label:'Mensual', sub:'Cada mes'    },
];
const DAYS_WEEK = [
  {v:0,l:'D'},{v:1,l:'L'},{v:2,l:'M'},{v:3,l:'X'},{v:4,l:'J'},{v:5,l:'V'},{v:6,l:'S'},
];

const DEFAULT_FORM = {
  name:'', report_type:'general', frequency:'weekly',
  day_of_week:1, day_of_month:1, hour:9, minute:0,
  period:'7d', period_from:'', period_to:'',
  phones:[{ phone:'' }],
};

// ── CSS global ─────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  .rsc-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    background: rgba(8,7,6,0.82);
    backdrop-filter: blur(12px) saturate(120%);
    -webkit-backdrop-filter: blur(12px) saturate(120%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: rscFadeIn 0.2s ease;
    cursor: default;
  }
  .rsc-modal * {
    cursor: default;
  }
  .rsc-modal input,
  .rsc-modal textarea {
    cursor: text;
  }
  .rsc-modal button,
  .rsc-modal [role="button"] {
    cursor: pointer;
  }
  .rsc-modal input[type="date"],
  .rsc-modal input[type="number"] {
    cursor: text;
  }
  @keyframes rscFadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes rscSlideUp { from{opacity:0;transform:translateY(18px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes rscToastIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes rscPulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes rscSpin    { to{transform:rotate(360deg)} }

  .rsc-modal {
    background: ${C.surface};
    border: 1px solid ${C.border2};
    border-radius: 18px;
    width: 100%;
    max-width: 580px;
    max-height: calc(100dvh - 32px);
    display: flex;
    flex-direction: column;
    box-shadow: 0 40px 120px rgba(0,0,0,0.85), 0 0 0 1px rgba(251,103,11,0.08);
    animation: rscSlideUp 0.3s cubic-bezier(0.16,1,0.3,1);
    overflow: hidden;
  }

  .rsc-scroll {
    overflow-y: auto;
    flex: 1;
    min-height: 0;
    scrollbar-width: thin;
    scrollbar-color: rgba(236,235,224,0.08) transparent;
  }
  .rsc-scroll::-webkit-scrollbar { width: 3px; }
  .rsc-scroll::-webkit-scrollbar-thumb { background: rgba(236,235,224,0.08); border-radius:2px; }

  .rsc-card-hover {
    transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
  }
  .rsc-card-hover:hover {
    background: rgba(236,235,224,0.03) !important;
    border-color: rgba(236,235,224,0.13) !important;
    transform: translateY(-1px);
  }

  .rsc-btn-type {
    padding: 13px 11px;
    border-radius: 11px;
    cursor: pointer;
    text-align: left;
    border: 1px solid ${C.border};
    background: rgba(236,235,224,0.02);
    transition: all 0.16s ease;
    position: relative;
    overflow: hidden;
  }
  .rsc-btn-type:hover { border-color: rgba(236,235,224,0.16) !important; }

  .rsc-period-pill {
    padding: 6px 13px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
    font-family: 'DM Sans',system-ui,sans-serif;
    border: 1px solid ${C.border};
    background: rgba(236,235,224,0.03);
    color: ${C.textSub};
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .rsc-period-pill:hover  { border-color: ${C.border3}; color: ${C.text}; }
  .rsc-period-pill.active { border-color: rgba(251,103,11,0.45); background: rgba(251,103,11,0.10); color: ${C.orange}; }

  .rsc-freq-card {
    padding: 12px;
    border-radius: 10px;
    cursor: pointer;
    text-align: center;
    border: 1px solid ${C.border};
    background: rgba(236,235,224,0.02);
    transition: all 0.16s ease;
  }
  .rsc-freq-card:hover { border-color: ${C.border3}; }
  .rsc-freq-card.active { border-color: rgba(251,103,11,0.45); background: rgba(251,103,11,0.09); }

  .rsc-day-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 700;
    font-family: 'DM Sans',system-ui,sans-serif;
    border: 1px solid ${C.border};
    background: rgba(236,235,224,0.03);
    color: ${C.textSub};
    transition: all 0.14s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .rsc-day-btn:hover  { border-color: ${C.border3}; color: ${C.text}; }
  .rsc-day-btn.active { border-color: rgba(251,103,11,0.5); background: rgba(251,103,11,0.14); color: ${C.orange}; }

  .rsc-min-btn {
    padding: 7px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 11.5px;
    font-weight: 700;
    font-family: 'DM Mono',monospace;
    min-width: 40px;
    text-align: center;
    border: 1px solid ${C.border};
    background: rgba(236,235,224,0.03);
    color: ${C.textSub};
    transition: all 0.14s ease;
  }
  .rsc-min-btn:hover  { border-color: ${C.border3}; }
  .rsc-min-btn.active { border-color: rgba(251,103,11,0.5); background: rgba(251,103,11,0.14); color: ${C.orange}; }

  .rsc-input {
    width: 100%;
    padding: 10px 13px;
    border-radius: 9px;
    border: 1px solid ${C.border};
    background: rgba(236,235,224,0.04);
    font-family: 'DM Sans',system-ui,sans-serif;
    font-size: 12.5px;
    color: ${C.text};
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s ease, background 0.15s ease;
  }
  .rsc-input:focus {
    border-color: rgba(251,103,11,0.38);
    background: rgba(251,103,11,0.04);
  }
  .rsc-input::placeholder { color: ${C.textDim}; }

  .rsc-hour-input {
    width: 68px;
    padding: 9px 0;
    border-radius: 9px;
    border: 1px solid ${C.border};
    background: rgba(236,235,224,0.04);
    font-family: 'DM Mono',monospace;
    font-size: 18px;
    font-weight: 700;
    color: ${C.text};
    outline: none;
    text-align: center;
    transition: border-color 0.15s ease;
    -moz-appearance: textfield;
  }
  .rsc-hour-input::-webkit-outer-spin-button,
  .rsc-hour-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  .rsc-hour-input:focus { border-color: rgba(251,103,11,0.38); }

  .rsc-date-input {
    flex: 1;
    padding: 9px 11px;
    border-radius: 9px;
    border: 1px solid ${C.border};
    background: rgba(236,235,224,0.04);
    font-family: 'DM Sans',system-ui,sans-serif;
    font-size: 12px;
    color: ${C.text};
    outline: none;
    color-scheme: dark;
    cursor: pointer;
    transition: border-color 0.15s ease;
  }
  .rsc-date-input:focus { border-color: rgba(251,103,11,0.38); }

  .rsc-schedule-row {
    background: ${C.surface2};
    border: 1px solid ${C.border};
    border-radius: 12px;
    padding: 13px 15px;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  .rsc-schedule-row:hover { border-color: ${C.border2}; }

  .rsc-ghost-btn {
    padding: 7px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'DM Sans',system-ui,sans-serif;
    font-size: 11px;
    font-weight: 500;
    background: rgba(236,235,224,0.04);
    border: 1px solid ${C.border};
    color: ${C.textSub};
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.14s ease;
    flex-shrink: 0;
  }
  .rsc-ghost-btn:hover { background: rgba(236,235,224,0.07); border-color: ${C.border3}; color: ${C.text}; }

  .rsc-danger-btn {
    padding: 7px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'DM Sans',system-ui,sans-serif;
    font-size: 11px;
    font-weight: 500;
    background: rgba(239,68,68,0.07);
    border: 1px solid rgba(239,68,68,0.18);
    color: rgba(248,113,113,0.75);
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.14s ease;
    flex-shrink: 0;
  }
  .rsc-danger-btn:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.3); color: rgba(248,113,113,1); }

  .rsc-send-btn {
    padding: 6px 13px;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'DM Sans',system-ui,sans-serif;
    font-size: 11px;
    font-weight: 700;
    background: rgba(251,103,11,0.12);
    border: 1px solid rgba(251,103,11,0.28);
    color: ${C.orange};
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.14s ease;
    flex-shrink: 0;
  }
  .rsc-send-btn:hover:not(:disabled) { background: rgba(251,103,11,0.20); border-color: rgba(251,103,11,0.45); }
  .rsc-send-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .rsc-primary-btn {
    padding: 11px 22px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans',system-ui,sans-serif;
    font-weight: 700;
    font-size: 12.5px;
    background: ${C.orange};
    color: #fff;
    display: flex;
    align-items: center;
    gap: 7px;
    transition: all 0.15s ease;
    box-shadow: 0 4px 16px rgba(251,103,11,0.28);
  }
  .rsc-primary-btn:hover:not(:disabled) { background: #e85a00; box-shadow: 0 6px 22px rgba(251,103,11,0.4); transform: translateY(-1px); }
  .rsc-primary-btn:active:not(:disabled) { transform: translateY(0); }
  .rsc-primary-btn:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }

  .rsc-cancel-btn {
    padding: 11px 18px;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'DM Sans',system-ui,sans-serif;
    font-weight: 500;
    font-size: 12.5px;
    background: rgba(236,235,224,0.04);
    border: 1px solid ${C.border};
    color: ${C.textSub};
    transition: all 0.14s ease;
  }
  .rsc-cancel-btn:hover { background: rgba(236,235,224,0.07); color: ${C.text}; }

  .rsc-new-btn {
    padding: 9px 16px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans',system-ui,sans-serif;
    font-weight: 700;
    font-size: 12px;
    background: ${C.orange};
    color: #fff;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.15s ease;
    box-shadow: 0 3px 12px rgba(251,103,11,0.25);
  }
  .rsc-new-btn:hover { background: #e85a00; transform: translateY(-1px); }

  .rsc-spinner {
    width: 13px; height: 13px;
    border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.18);
    border-top-color: #fff;
    animation: rscSpin 0.65s linear infinite;
    flex-shrink: 0;
  }

  .rsc-toast {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 2147483647;
    padding: 12px 18px;
    border-radius: 11px;
    font-family: 'DM Sans',system-ui,sans-serif;
    font-weight: 600;
    font-size: 12px;
    max-width: 340px;
    display: flex;
    align-items: center;
    gap: 9px;
    box-shadow: 0 8px 36px rgba(0,0,0,0.6);
    animation: rscToastIn 0.25s cubic-bezier(0.16,1,0.3,1);
  }

  .rsc-section-sep {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
    margin-top: 4px;
  }

  .rsc-empty-state {
    padding: 36px 20px;
    text-align: center;
    background: rgba(236,235,224,0.015);
    border: 1.5px dashed ${C.border};
    border-radius: 14px;
    animation: rscFadeIn 0.3s ease;
  }

  @media (max-width: 480px) {
    .rsc-modal { border-radius: 14px; max-height: calc(100dvh - 16px); }
    .rsc-type-grid { grid-template-columns: 1fr !important; }
  }

  /* ── LIGHT THEME ── */
  html[data-theme="light"] .rsc-modal-overlay { background: rgba(185,205,230,0.75); }
  html[data-theme="light"] .rsc-modal {
    background: #FFFFFF; border-color: rgba(26,35,50,0.12);
    box-shadow: 0 24px 80px rgba(0,0,0,0.14), 0 0 0 1px rgba(251,103,11,0.08);
  }
  html[data-theme="light"] .rsc-scroll { scrollbar-color: rgba(26,35,50,0.10) transparent; }
  html[data-theme="light"] .rsc-input {
    background: rgba(26,35,50,0.04); border-color: rgba(26,35,50,0.12); color: rgba(26,35,50,0.90);
  }
  html[data-theme="light"] .rsc-input:focus { border-color: rgba(251,103,11,0.40); background: rgba(251,103,11,0.03); }
  html[data-theme="light"] .rsc-input::placeholder { color: rgba(26,35,50,0.28); }
  html[data-theme="light"] .rsc-hour-input {
    background: rgba(26,35,50,0.04); border-color: rgba(26,35,50,0.12); color: rgba(26,35,50,0.90);
  }
  html[data-theme="light"] .rsc-date-input {
    background: rgba(26,35,50,0.04); border-color: rgba(26,35,50,0.12); color: rgba(26,35,50,0.85); color-scheme: light;
  }
  html[data-theme="light"] .rsc-btn-type { border-color: rgba(26,35,50,0.10); background: rgba(26,35,50,0.02); }
  html[data-theme="light"] .rsc-btn-type:hover { border-color: rgba(26,35,50,0.18) !important; }
  html[data-theme="light"] .rsc-period-pill { border-color: rgba(26,35,50,0.10); background: rgba(26,35,50,0.03); color: rgba(26,35,50,0.50); }
  html[data-theme="light"] .rsc-period-pill:hover { border-color: rgba(26,35,50,0.20); color: rgba(26,35,50,0.80); }
  html[data-theme="light"] .rsc-period-pill.active { border-color: rgba(251,103,11,0.45); background: rgba(251,103,11,0.10); color: #FB670B; }
  html[data-theme="light"] .rsc-freq-card { border-color: rgba(26,35,50,0.10); background: rgba(26,35,50,0.02); }
  html[data-theme="light"] .rsc-freq-card.active { border-color: rgba(251,103,11,0.45); background: rgba(251,103,11,0.09); }
  html[data-theme="light"] .rsc-day-btn { border-color: rgba(26,35,50,0.10); background: rgba(26,35,50,0.03); color: rgba(26,35,50,0.50); }
  html[data-theme="light"] .rsc-day-btn:hover { border-color: rgba(26,35,50,0.20); color: rgba(26,35,50,0.80); }
  html[data-theme="light"] .rsc-day-btn.active { border-color: rgba(251,103,11,0.5); background: rgba(251,103,11,0.14); color: #FB670B; }
  html[data-theme="light"] .rsc-ghost-btn { background: rgba(26,35,50,0.04); border-color: rgba(26,35,50,0.10); color: rgba(26,35,50,0.50); }
  html[data-theme="light"] .rsc-ghost-btn:hover { background: rgba(26,35,50,0.08); border-color: rgba(26,35,50,0.18); color: rgba(26,35,50,0.80); }
  html[data-theme="light"] .rsc-schedule-row { background: #FFFFFF; border-color: rgba(26,35,50,0.10); }
  html[data-theme="light"] .rsc-schedule-row:hover { border-color: rgba(26,35,50,0.18); }
  html[data-theme="light"] .rsc-empty-state { background: rgba(26,35,50,0.015); border-color: rgba(26,35,50,0.12); }
  html[data-theme="light"] .rsc-cancel-btn { background: rgba(26,35,50,0.04); border-color: rgba(26,35,50,0.12); color: rgba(26,35,50,0.55); }
  html[data-theme="light"] .rsc-cancel-btn:hover { background: rgba(26,35,50,0.07); color: rgba(26,35,50,0.80); }

  /* ── CALENDAR (react-day-picker) ─────────────────────────────────────────── */
  .rsc-cal-root {
    width: 100%;
    font-family: 'DM Sans',system-ui,sans-serif;
    position: relative;
  }
  .rsc-cal-months {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
  .rsc-cal-month {
    flex: 1;
    min-width: 220px;
  }
  .rsc-cal-caption {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 34px;
    margin: 0 40px 8px;
  }
  .rsc-cal-caption-label {
    font-family: 'DM Sans',system-ui,sans-serif;
    font-size: 12.5px;
    font-weight: 700;
    color: rgba(236,235,224,0.93);
    letter-spacing: -0.01em;
    text-transform: capitalize;
  }
  .rsc-cal-nav {
    position: absolute;
    top: 0;
    display: flex;
    width: 100%;
    justify-content: space-between;
    z-index: 10;
  }
  .rsc-cal-nav-btn {
    width: 30px;
    height: 30px;
    border-radius: 7px;
    cursor: pointer;
    border: 1px solid rgba(236,235,224,0.08);
    background: rgba(236,235,224,0.03);
    color: rgba(236,235,224,0.45);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.13s ease;
    padding: 0;
  }
  .rsc-cal-nav-btn:hover { border-color: rgba(236,235,224,0.18); color: rgba(236,235,224,0.90); background: rgba(236,235,224,0.07); }
  .rsc-cal-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: 2px;
  }
  .rsc-cal-weekday {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    font-family: 'DM Sans',system-ui,sans-serif;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(236,235,224,0.22);
  }
  .rsc-cal-weeks {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .rsc-cal-week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0;
  }
  .rsc-cal-day {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1px 0;
    position: relative;
  }
  .rsc-cal-day-btn {
    width: 32px;
    height: 32px;
    border-radius: 7px;
    cursor: pointer;
    border: none;
    background: transparent;
    font-family: 'DM Sans',system-ui,sans-serif;
    font-size: 12px;
    color: rgba(236,235,224,0.90);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.13s ease, color 0.13s ease;
    position: relative;
    z-index: 1;
    outline: none;
  }
  .rsc-cal-day-btn:hover:not(:disabled) {
    background: rgba(236,235,224,0.08);
  }
  .rsc-cal-today .rsc-cal-day-btn {
    color: #FB670B;
    font-weight: 700;
  }
  /* Range start */
  .rsc-cal-range-start .rsc-cal-day-btn {
    background: #FB670B !important;
    color: #fff !important;
    border-radius: 7px 0 0 7px;
  }
  /* Range end */
  .rsc-cal-range-end .rsc-cal-day-btn {
    background: #FB670B !important;
    color: #fff !important;
    border-radius: 0 7px 7px 0;
  }
  /* Single selected (start == end) */
  .rsc-cal-range-start.rsc-cal-range-end .rsc-cal-day-btn {
    border-radius: 7px !important;
  }
  /* Range middle */
  .rsc-cal-range-middle {
    background: rgba(251,103,11,0.12);
  }
  .rsc-cal-range-middle .rsc-cal-day-btn {
    background: transparent !important;
    color: rgba(236,235,224,0.90) !important;
    border-radius: 0;
  }
  .rsc-cal-range-middle .rsc-cal-day-btn:hover {
    background: rgba(251,103,11,0.15) !important;
  }
  /* Outside (other month days) */
  .rsc-cal-outside .rsc-cal-day-btn {
    color: rgba(236,235,224,0.20) !important;
  }
  .rsc-cal-outside.rsc-cal-range-middle { background: transparent; }
  /* Disabled (fechas futuras) */
  .rsc-cal-disabled .rsc-cal-day-btn,
  .rsc-cal-day-btn:disabled {
    color: rgba(236,235,224,0.18) !important;
    cursor: not-allowed;
    background: transparent !important;
  }
  .rsc-cal-hidden { visibility: hidden; }

  /* Light theme overrides */
  html[data-theme="light"] .rsc-cal-caption-label { color: rgba(26,35,50,0.90); }
  html[data-theme="light"] .rsc-cal-nav-btn { border-color: rgba(26,35,50,0.10); background: rgba(26,35,50,0.03); color: rgba(26,35,50,0.45); }
  html[data-theme="light"] .rsc-cal-nav-btn:hover { border-color: rgba(26,35,50,0.20); color: rgba(26,35,50,0.80); background: rgba(26,35,50,0.06); }
  html[data-theme="light"] .rsc-cal-weekday { color: rgba(26,35,50,0.28); }
  html[data-theme="light"] .rsc-cal-day-btn { color: rgba(26,35,50,0.87); }
  html[data-theme="light"] .rsc-cal-day-btn:hover:not(:disabled) { background: rgba(26,35,50,0.06); }
  html[data-theme="light"] .rsc-cal-today .rsc-cal-day-btn { color: #FB670B; }
  html[data-theme="light"] .rsc-cal-range-middle { background: rgba(251,103,11,0.10); }
  html[data-theme="light"] .rsc-cal-outside .rsc-cal-day-btn { color: rgba(26,35,50,0.22) !important; }
  html[data-theme="light"] .rsc-cal-disabled .rsc-cal-day-btn,
  html[data-theme="light"] .rsc-cal-day-btn:disabled { color: rgba(26,35,50,0.18) !important; }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────

// Formatea Date → "YYYY-MM-DD"
function fmtDate(d) {
  if (!d) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Calendario de rango de fechas (usa react-day-picker v9)
function DateRangePicker({ from, to, onChange }) {
  const [month, setMonth] = useState(() =>
    from ? new Date(from + 'T00:00:00') : new Date()
  );

  const selected = {
    from: from ? new Date(from + 'T00:00:00') : undefined,
    to:   to   ? new Date(to   + 'T00:00:00') : undefined,
  };

  const handleSelect = (range) => {
    onChange(fmtDate(range?.from), fmtDate(range?.to));
  };

  const calClassNames = {
    root:           'rsc-cal-root',
    months:         'rsc-cal-months',
    month:          'rsc-cal-month',
    month_caption:  'rsc-cal-caption',
    caption_label:  'rsc-cal-caption-label',
    nav:            'rsc-cal-nav',
    button_previous:'rsc-cal-nav-btn',
    button_next:    'rsc-cal-nav-btn',
    weekdays:       'rsc-cal-weekdays',
    weekday:        'rsc-cal-weekday',
    weeks:          'rsc-cal-weeks',
    week:           'rsc-cal-week',
    day:            'rsc-cal-day',
    day_button:     'rsc-cal-day-btn',
    range_start:    'rsc-cal-range-start',
    range_end:      'rsc-cal-range-end',
    range_middle:   'rsc-cal-range-middle',
    today:          'rsc-cal-today',
    outside:        'rsc-cal-outside',
    disabled:       'rsc-cal-disabled',
    hidden:         'rsc-cal-hidden',
  };

  return (
    <DayPicker
      mode="range"
      selected={selected}
      onSelect={handleSelect}
      numberOfMonths={2}
      month={month}
      onMonthChange={setMonth}
      disabled={{ after: new Date() }}
      classNames={calClassNames}
      locale={es}
    />
  );
}

const lbl = {
  fontSize: 9.5,
  fontWeight: 700,
  letterSpacing: '0.13em',
  textTransform: 'uppercase',
  color: C.textDim,
  display: 'block',
  marginBottom: 7,
  fontFamily: "'DM Sans',system-ui,sans-serif",
};

function SectionSep({ icon, label, theme: _theme }) {
  const SC = _theme || C;
  return (
    <div className="rsc-section-sep">
      <div style={{ width: 22, height: 22, borderRadius: 7, background: `${SC.orange}18`, border: `1px solid ${SC.orange}28`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: SC.orange, flexShrink: 0 }}>{icon}</div>
      <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: SC.textDim,
        fontFamily: "'DM Sans',system-ui,sans-serif" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: SC.border }} />
    </div>
  );
}

// ── Modal como componente independiente (evita perder foco en re-renders) ─────
const ScheduleModal = React.memo(function ScheduleModal({ form, setForm, editId, saving, onSave, onClose, T: TC }) {
  const CM = TC || C; // paleta adaptada al tema activo
  const lbl = { fontSize: 9.5, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase',
    color: CM.textDim, display: 'block', marginBottom: 7, fontFamily: "'DM Sans',system-ui,sans-serif" };
  const set = useCallback((k, v) => setForm(f => ({ ...f, [k]: v })), [setForm]);
  const setPhone    = useCallback((i, v) => setForm(f => { const p = [...f.phones]; p[i] = { phone: v }; return { ...f, phones: p }; }), [setForm]);
  const addPhone    = useCallback(() => setForm(f => ({ ...f, phones: [...f.phones, { phone: '' }] })), [setForm]);
  const removePhone = useCallback(i  => setForm(f => ({ ...f, phones: f.phones.filter((_, j) => j !== i) })), [setForm]);

  return (
    <div className="rsc-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rsc-modal">
        {/* Header */}
        <div style={{ padding: '22px 26px 18px', borderBottom: `1px solid ${CM.border}`, flexShrink: 0, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${CM.orange} 0%,rgba(251,103,11,0.4) 55%,transparent 100%)`, borderRadius: '18px 18px 0 0' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${CM.orange}18`, border: `1px solid ${CM.orange}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: CM.orange, flexShrink: 0 }}>
                  {editId ? Ic.edit : Ic.add}
                </div>
                <span style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontWeight: 700, fontSize: 15.5, color: CM.text, letterSpacing: '-0.025em' }}>
                  {editId ? 'Editar programación' : 'Nueva programación'}
                </span>
              </div>
              <p style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 11.5, color: CM.textDim, margin: 0, paddingLeft: 40 }}>
                Configura el reporte, frecuencia y destinatarios
              </p>
            </div>
            <button onClick={onClose} className="rsc-ghost-btn" style={{ padding: '7px', flexShrink: 0 }}>{Ic.close}</button>
          </div>
        </div>

        {/* Body scrollable */}
        <div className="rsc-scroll" style={{ padding: '22px 26px' }}>

          {/* Nombre */}
          <div style={{ marginBottom: 24 }}>
            <label style={lbl}>Nombre de la programación</label>
            <input className="rsc-input" placeholder="Ej: Reporte semanal de ventas"
              value={form.name} onChange={e => set('name', e.target.value)} />
          </div>

          {/* Tipo de reporte */}
          <div style={{ marginBottom: 24 }}>
            <SectionSep icon={Ic.chart} label="Tipo de reporte" theme={CM} />
            <div className="rsc-type-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {REPORT_TYPES.map(t => (
                <button key={t.value} className="rsc-btn-type" onClick={() => set('report_type', t.value)}
                  style={{ borderColor: form.report_type === t.value ? `${t.color}50` : CM.border, background: form.report_type === t.value ? `${t.color}0E` : CM.border2 }}>
                  {form.report_type === t.value && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${t.color},transparent)` }} />}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6, color: form.report_type === t.value ? t.color : CM.textSub }}>
                    {t.icon}
                    <span style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontWeight: 700, fontSize: 12, color: form.report_type === t.value ? t.color : CM.text }}>{t.label}</span>
                  </div>
                  <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 10.5, color: CM.textDim, lineHeight: 1.45 }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Período */}
          <div style={{ marginBottom: 24 }}>
            <SectionSep icon={Ic.range} label="Período del reporte" theme={CM} />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              {PERIODS.map(p => (
                <button key={p.value} type="button"
                  className={`rsc-period-pill ${form.period === p.value ? 'active' : ''}`}
                  onClick={() => set('period', p.value)}
                  style={form.period === p.value ? { borderColor:'rgba(251,103,11,0.45)', background:'rgba(251,103,11,0.10)', color: CM.orange } : undefined}>
                  {p.value === 'custom' && <span style={{ opacity: 0.7 }}>{Ic.range}</span>}
                  {p.label}
                </button>
              ))}
            </div>
            {/* Siempre en DOM, visible/oculto con CSS — evita perder foco al montar/desmontar */}
            <div style={{ display: form.period === 'custom' ? 'block' : 'none', padding: '14px 16px', background: 'rgba(251,103,11,0.05)', border: `1px solid rgba(251,103,11,0.22)`, borderRadius: 11, marginTop: 6 }}>
              <DateRangePicker
                from={form.period_from}
                to={form.period_to}
                onChange={(from, to) => { set('period_from', from || ''); set('period_to', to || ''); }}
              />
              {form.period_from && form.period_to && (
                <div style={{ marginTop: 10, fontSize: 10.5, color: CM.textSub, display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'DM Sans',system-ui,sans-serif" }}>
                  {Ic.cal}
                  <strong style={{ color: CM.orange, fontFamily: "'DM Mono',monospace" }}>
                    {Math.round((new Date(form.period_to) - new Date(form.period_from)) / (1000 * 60 * 60 * 24) + 1)}
                  </strong>{' días · '}
                  {new Date(form.period_from + 'T00:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'long' })}
                  {' — '}
                  {new Date(form.period_to + 'T00:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
              )}
            </div>
          </div>

          {/* Frecuencia */}
          <div style={{ marginBottom: 24 }}>
            <SectionSep icon={Ic.clock} label="Frecuencia de envío" theme={CM} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
              {FREQUENCIES.map(f => (
                <button key={f.value} type="button"
                  className={`rsc-freq-card ${form.frequency === f.value ? 'active' : ''}`}
                  onClick={() => set('frequency', f.value)}
                  style={form.frequency === f.value ? { borderColor:'rgba(251,103,11,0.45)', background:'rgba(251,103,11,0.09)' } : undefined}>
                  <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontWeight: 700, fontSize: 12.5, color: form.frequency === f.value ? CM.orange : CM.text, marginBottom: 3 }}>{f.label}</div>
                  <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 10, color: CM.textDim }}>{f.sub}</div>
                </button>
              ))}
            </div>

            {/* Siempre en DOM, visible con CSS */}
            <div style={{ display: form.frequency === 'weekly' ? 'block' : 'none', marginBottom: 14 }}>
              <label style={lbl}>Día de envío</label>
              <div style={{ display: 'flex', gap: 5 }}>
                {DAYS_WEEK.map(d => (
                  <button key={d.v} type="button"
                    className={`rsc-day-btn ${form.day_of_week === d.v ? 'active' : ''}`}
                    onClick={() => set('day_of_week', d.v)}
                    style={form.day_of_week === d.v ? { borderColor:'rgba(251,103,11,0.5)', background:'rgba(251,103,11,0.14)', color: CM.orange } : undefined}>
                    {d.l}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: form.frequency === 'monthly' ? 'block' : 'none', marginBottom: 14, maxWidth: 160 }}>
              <label style={lbl}>Día del mes (1–28)</label>
              <input type="number" min="1" max="28" className="rsc-input" value={form.day_of_month} onChange={e => set('day_of_month', Number(e.target.value))} />
            </div>

            {/* Hora */}
            <div>
              <label style={lbl}>Hora de envío (hora México)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input type="number" min="0" max="23" className="rsc-hour-input" value={form.hour}
                  onChange={e => { const v = e.target.value; set('hour', v === '' ? '' : Math.min(23, Math.max(0, Number(v)))); }}
                  onBlur={e => set('hour', Math.min(23, Math.max(0, Number(e.target.value) || 0)))} />
                <span style={{ color: CM.textDim, fontSize: 22, fontWeight: 700, fontFamily: "'DM Mono',monospace", flexShrink: 0, lineHeight: 1 }}>:</span>
                <input type="number" min="0" max="59" className="rsc-hour-input" value={form.minute ?? 0}
                  onChange={e => { const v = e.target.value; set('minute', v === '' ? '' : Math.min(59, Math.max(0, Number(v)))); }}
                  onBlur={e => set('minute', Math.min(59, Math.max(0, Number(e.target.value) || 0)))} />
              </div>
              <div style={{ marginTop: 7, fontSize: 10.5, color: CM.textSub, display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'DM Sans',system-ui,sans-serif" }}>
                {Ic.clock} Envío a las{' '}
                <strong style={{ color: CM.text, fontFamily: "'DM Mono',monospace" }}>
                  {String(form.hour || 0).padStart(2, '0')}:{String(form.minute ?? 0).padStart(2, '0')} hrs
                </strong>
              </div>
            </div>
          </div>

          {/* Destinatarios */}
          <div style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <SectionSep icon={Ic.phone} label="Destinatarios WhatsApp" theme={CM} />
              <button onClick={addPhone} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 11px', borderRadius: 8, cursor: 'pointer', fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 11, fontWeight: 700, background: 'rgba(251,103,11,0.12)', border: '1px solid rgba(251,103,11,0.28)', color: CM.orange, transition: 'all 0.14s ease', flexShrink: 0, marginBottom: 14 }}>
                {Ic.add} Agregar
              </button>
            </div>
            <div style={{ padding: '10px 13px', background: CM.border2, border: `1px solid ${CM.border}`, borderRadius: 9, marginBottom: 12, display: 'flex', alignItems: 'flex-start', gap: 7 }}>
              <span style={{ color: CM.textDim, flexShrink: 0, marginTop: 1 }}>{Ic.info}</span>
              <span style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 11, color: CM.textDim, lineHeight: 1.55 }}>
                Número con código de país, sin espacios. <span style={{ color: CM.textSub }}>Ej: 523312345678</span>
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {form.phones.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7, background: CM.surface3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9.5, fontWeight: 700, color: CM.textDim, flexShrink: 0, fontFamily: "'DM Mono',monospace" }}>{i + 1}</div>
                  <input className="rsc-input" placeholder="523312345678" value={p.phone} onChange={e => setPhone(i, e.target.value)} />
                  {form.phones.length > 1 && (
                    <button onClick={() => removePhone(i)} className="rsc-danger-btn" style={{ padding: '7px 9px' }}>{Ic.trash}</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 26px', borderTop: `1px solid ${CM.border}`, display: 'flex', gap: 8, justifyContent: 'flex-end', flexShrink: 0, background: CM.surface2 }}>
          <button onClick={onClose} className="rsc-cancel-btn">Cancelar</button>
          <button onClick={onSave} disabled={saving} className="rsc-primary-btn">
            {saving ? <><div className="rsc-spinner" />Guardando…</> : editId ? 'Guardar cambios' : 'Crear programación'}
          </button>
        </div>
      </div>
    </div>
  );
});

// ── Componente principal ──────────────────────────────────────────────────────
export default function ReportScheduler({ theme = 'dark' }) {
  const [schedules,  setSchedules]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [form,       setForm]       = useState(DEFAULT_FORM);
  const [editId,     setEditId]     = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [sending,    setSending]    = useState(null);
  const [toasts,     setToasts]     = useState([]);
  const [confirmDel, setConfirmDel] = useState(null); // { id, name }

  const isDark = theme === 'dark';
  const T = isDark ? C : {
    ...C,
    surface: '#F7F6F2', surface2: '#FFFFFF', surface3: '#EDECEA', surface4: '#E4E2DC',
    border: 'rgba(38,38,38,0.10)', border2: 'rgba(38,38,38,0.15)', border3: 'rgba(38,38,38,0.22)',
    text: 'rgba(38,38,38,0.92)', textSub: 'rgba(38,38,38,0.52)', textDim: 'rgba(38,38,38,0.32)', textGhost: 'rgba(38,38,38,0.14)',
  };

  const showToast = (msg, ok = true) => {
    const id = Date.now();
    setToasts(ts => [...ts, { id, msg, ok }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 4000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/reports/schedule');
      const j = await r.json();
      setSchedules(j.schedules || []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (showForm) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [showForm]);

  const openCreate = () => { setForm(DEFAULT_FORM); setEditId(null); setShowForm(true); };
  const openEdit = s => {
    setForm({
      name: s.name, report_type: s.report_type, frequency: s.frequency,
      day_of_week: s.day_of_week, day_of_month: s.day_of_month,
      hour: s.hour, minute: s.minute ?? 0, period: s.period,
      period_from: s.period_from || '', period_to: s.period_to || '',
      phones: (s.phones || []).length
        ? s.phones.map(p => ({ phone: typeof p === 'string' ? p : p.phone || '' }))
        : [{ phone: '' }],
    });
    setEditId(s.id);
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name.trim()) { showToast('Agrega un nombre a la programación', false); return; }
    if (!form.phones.some(p => p.phone.trim())) { showToast('Agrega al menos un número de WhatsApp', false); return; }
    if (form.period === 'custom' && (!form.period_from || !form.period_to)) { showToast('Selecciona el rango de fechas completo', false); return; }
    setSaving(true);
    const payload = {
      action: editId ? 'update' : 'create',
      ...(editId && { id: editId }),
      ...form,
      phones: form.phones.filter(p => p.phone.trim()),
      active: true,
      minute: form.minute ?? 0,
    };
    const r = await fetch('/api/reports/schedule', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const j = await r.json();
    setSaving(false);
    if (j.ok) { showToast(editId ? 'Programación actualizada' : 'Programación creada'); setShowForm(false); load(); }
    else showToast('Error: ' + j.error, false);
  };

  const del = (id, name) => setConfirmDel({ id, name });
  const confirmDelete = async () => {
    if (!confirmDel) return;
    await fetch('/api/reports/schedule', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id: confirmDel.id }) });
    setConfirmDel(null);
    load();
  };
  const toggle = async s => {
    await fetch('/api/reports/schedule', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update', id: s.id, ...s, phones: s.phones, active: !s.active, minute: s.minute ?? 0 }) });
    load();
  };
  const sendNow = async s => {
    setSending(s.id);
    try {
      const r = await fetch('/api/reports/send-now', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ schedule_id: s.id, report_type: s.report_type, period: s.period, period_from: s.period_from || null, period_to: s.period_to || null, phones: s.phones, name: s.name }) });
      const j = await r.json();
      if (j.results?.every(x => x.ok)) showToast(`PDF enviado a ${j.results.length} número(s)`, true);
      else { const e = j.results?.find(x => !x.ok)?.error || j.error || 'Error desconocido'; showToast(`Error: ${String(e).slice(0, 90)}`, false); }
    } catch { showToast('Error al enviar', false); }
    setSending(null);
  };

  const typeOf      = v      => REPORT_TYPES.find(t => t.value === v) || REPORT_TYPES[0];

  const periodLabel = s => {
    if (s.period === 'custom' && s.period_from && s.period_to) {
      const fmt = d => new Date(d + 'T00:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
      return `${fmt(s.period_from)} — ${fmt(s.period_to)}`;
    }
    return PERIODS.find(p => p.value === s.period)?.label || s.period;
  };

  // ── Render principal ──────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", color: isDark ? C.text : 'rgba(38,38,38,0.92)',
      background: isDark ? 'transparent' : '#F7F6F2', borderRadius: 12, padding: isDark ? 0 : 16 }}>
      <style>{STYLES}</style>

      {/* Toasts apilables via portal */}
      {createPortal(
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2147483647, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', pointerEvents: 'none' }}>
          {toasts.map(t => (
            <div key={t.id} className="rsc-toast" style={{
              pointerEvents: 'auto',
              background: t.ok
                ? (isDark ? 'rgba(10,30,15,0.97)' : 'rgba(230,250,235,0.98)')
                : (isDark ? 'rgba(30,10,10,0.97)' : 'rgba(255,235,235,0.98)'),
              border: `1px solid ${t.ok ? (isDark ? '#1a5c28' : '#22c55e60') : (isDark ? '#5c1a1a' : '#ef444460')}`,
              color: t.ok ? (isDark ? '#86efac' : '#166534') : (isDark ? '#fca5a5' : '#991b1b'),
              boxShadow: `0 8px 32px ${t.ok ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)'}, 0 2px 8px rgba(0,0,0,0.2)`,
            }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                background: t.ok ? (isDark ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.12)') : (isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.10)'),
                color: t.ok ? '#4ade80' : '#f87171' }}>
                {t.ok ? Ic.check : Ic.close}
              </div>
              <span style={{ flex: 1 }}>{t.msg}</span>
              <button onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.45, padding: '0 2px', fontSize: 14, lineHeight: 1 }}>✕</button>
            </div>
          ))}
        </div>,
        document.body
      )}

      {/* Modal de confirmación de eliminación */}
      {confirmDel && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 2147483647, background: 'rgba(8,7,6,0.80)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, cursor: 'default' }}
          onClick={e => { if (e.target === e.currentTarget) setConfirmDel(null); }}>
          <div style={{ background: isDark ? C.surface : '#FFFFFF', border: `1px solid ${isDark ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.20)'}`,
            borderRadius: 16, padding: '28px 28px 24px', maxWidth: 380, width: '100%',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(239,68,68,0.08)',
            animation: 'rscSlideUp 0.25s cubic-bezier(0.16,1,0.3,1)' }}>
            {/* Icono */}
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, color: '#f87171' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontWeight: 700, fontSize: 15, color: isDark ? C.text : '#262626', marginBottom: 8, letterSpacing: '-0.02em' }}>
              Eliminar programación
            </div>
            <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 12.5, color: isDark ? C.textSub : 'rgba(38,38,38,0.55)', lineHeight: 1.6, marginBottom: 24 }}>
              ¿Seguro que quieres eliminar <strong style={{ color: isDark ? C.text : '#262626' }}>"{confirmDel.name}"</strong>?
              Esta acción no se puede deshacer.
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmDel(null)} className="rsc-cancel-btn" style={{ cursor: 'pointer' }}>Cancelar</button>
              <button onClick={confirmDelete} style={{ padding: '10px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
                fontFamily: "'DM Sans',system-ui,sans-serif", fontWeight: 700, fontSize: 12.5,
                background: 'linear-gradient(135deg,#dc2626,#b91c1c)', color: '#fff',
                boxShadow: '0 4px 16px rgba(220,38,38,0.35)', transition: 'all 0.14s ease' }}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Header de sección */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: `${T.orange}14`,
            border: `1px solid ${T.orange}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.orange, flexShrink: 0 }}>
            {Ic.send}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: isDark ? C.text : 'rgba(38,38,38,0.92)', letterSpacing: '-0.015em' }}>Envíos Automáticos</div>
            <div style={{ fontSize: 11, color: isDark ? C.textDim : 'rgba(38,38,38,0.40)', marginTop: 2 }}>
              {schedules.length > 0
                ? `${schedules.filter(s=>s.active).length} activo${schedules.filter(s=>s.active).length!==1?'s':''} · ${schedules.length} total`
                : 'Reportes PDF programados por WhatsApp'}
            </div>
          </div>
        </div>
        <button className="rsc-new-btn" onClick={openCreate}>
          {Ic.add} Nueva programación
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: T.textDim, fontSize: 12 }}>Cargando…</div>
      ) : schedules.length === 0 ? (
        <div className="rsc-empty-state">
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${T.orange}12`, border: `1px solid ${T.orange}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: T.orange }}>{Ic.send}</div>
          <div style={{ fontWeight: 700, fontSize: 13, color: T.text, marginBottom: 5 }}>Sin programaciones activas</div>
          <div style={{ fontSize: 11, color: T.textDim }}>Crea tu primera programación para automatizar el envío.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {schedules.map(s => {
            const ti       = typeOf(s.report_type);
            const freq     = FREQUENCIES.find(f => f.value === s.frequency)?.label || s.frequency;
            const dowLabel = DAYS_WEEK.find(d => d.v === Number(s.day_of_week))?.l || '';
            const hhmm     = `${String(s.hour ?? 9).padStart(2,'0')}:${String(s.minute ?? 0).padStart(2,'0')}`;
            const last     = s.last_sent
              ? new Date(s.last_sent).toLocaleString('es-MX',{ timeZone:'America/Mexico_City', day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })
              : null;
            const freqStr  = s.frequency === 'weekly'  ? `${freq} · ${dowLabel} ${hhmm}h`
                           : s.frequency === 'monthly' ? `${freq} · Día ${s.day_of_month} ${hhmm}h`
                           : `${freq} · ${hhmm}h`;
            const numDest  = (s.phones || []).length;

            return (
              <div key={s.id} style={{
                borderRadius: 14, overflow: 'hidden', opacity: s.active ? 1 : 0.55,
                border: `1px solid ${s.active ? ti.color + '30' : T.border}`,
                background: isDark ? T.surface2 : '#FFFFFF',
                boxShadow: s.active ? `0 2px 16px ${ti.color}10` : 'none',
                transition: 'opacity 0.2s ease',
              }}>
                {/* Color bar top */}
                <div style={{ height: 3, background: `linear-gradient(90deg,${ti.color},${ti.color}55,transparent)` }}/>

                <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>

                  {/* Icono tipo reporte */}
                  <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: `${ti.color}14`, border: `1.5px solid ${ti.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: ti.color }}>
                    <span style={{ transform: 'scale(1.35)' }}>{ti.icon}</span>
                  </div>

                  {/* Info principal */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Nombre + tipo + estado */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontWeight: 700, fontSize: 13.5, color: T.text, letterSpacing: '-0.01em' }}>{s.name}</span>
                      <span style={{ fontSize: 9.5, fontWeight: 700, color: ti.color,
                        background: `${ti.color}12`, border: `1px solid ${ti.color}28`,
                        borderRadius: 6, padding: '2px 8px', letterSpacing: '0.04em', textTransform: 'uppercase',
                        fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                        {ti.label}
                      </span>
                      {!s.active && (
                        <span style={{ fontSize: 9.5, fontWeight: 700, color: T.textDim,
                          background: T.border2, border: `1px solid ${T.border}`,
                          borderRadius: 6, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.04em',
                          fontFamily:"'DM Sans',system-ui,sans-serif" }}>Pausado</span>
                      )}
                    </div>

                    {/* Pills de info */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {[
                        { icon: Ic.clock, label: freqStr },
                        { icon: Ic.cal,   label: periodLabel(s) },
                        { icon: Ic.phone, label: `${numDest} destinatario${numDest !== 1 ? 's' : ''}` },
                      ].map((pill, i) => (
                        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
                          background: isDark ? T.surface3 : '#F3F4F6',
                          border: `1px solid ${T.border}`,
                          borderRadius: 20, padding: '4px 10px',
                          fontSize: 11, color: T.textSub, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                          <span style={{ opacity: 0.65 }}>{pill.icon}</span>
                          {pill.label}
                        </span>
                      ))}
                      {last && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
                          borderRadius: 20, padding: '4px 10px',
                          fontSize: 10.5, color: T.textDim, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                          Último envío: {last}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
                    <button onClick={() => sendNow(s)} disabled={sending === s.id}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '8px 14px', borderRadius: 9, border: 'none',
                        background: sending === s.id ? T.border2 : ti.color,
                        color: '#fff', fontSize: 11.5, fontWeight: 700, cursor: sending === s.id ? 'not-allowed' : 'pointer',
                        fontFamily:"'DM Sans',system-ui,sans-serif", transition: 'opacity 0.13s',
                        boxShadow: sending !== s.id ? `0 2px 10px ${ti.color}40` : 'none' }}>
                      {sending === s.id
                        ? <><div className="rsc-spinner" style={{ borderTopColor:'#fff', borderColor:'rgba(255,255,255,0.2)', width:10, height:10 }}/>Enviando</>
                        : <>{Ic.send} Enviar</>}
                    </button>
                    <button onClick={() => toggle(s)} title={s.active ? 'Pausar' : 'Activar'}
                      style={{ width: 34, height: 34, borderRadius: 9,
                        border: `1px solid ${T.border2}`, background: T.surface3,
                        color: s.active ? T.orange : T.textDim, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {s.active ? Ic.pause : Ic.play}
                    </button>
                    <button onClick={() => openEdit(s)} title="Editar"
                      style={{ width: 34, height: 34, borderRadius: 9,
                        border: `1px solid ${T.border2}`, background: T.surface3,
                        color: T.textSub, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {Ic.edit}
                    </button>
                    <button onClick={() => del(s.id, s.name)} title="Eliminar"
                      style={{ width: 34, height: 34, borderRadius: 9,
                        border: '1px solid rgba(239,68,68,0.22)', background: 'rgba(239,68,68,0.07)',
                        color: '#EF4444', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {Ic.trash}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal via Portal — componente externo estable, no se destruye en cada keystroke */}
      {showForm && createPortal(
        <ScheduleModal
          form={form}
          setForm={setForm}
          editId={editId}
          saving={saving}
          onSave={save}
          onClose={() => setShowForm(false)}
          T={T}
        />,
        document.body
      )}
    </div>
  );
}