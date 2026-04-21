// src/components/RecruitmentTab.jsx
import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { descargarPerfilPDF, exportarTodoCSV, exportarTodoPDF } from '../lib/recruitmentExport.js';

// ── PALETAS ───────────────────────────────────────────────────────────────────
const DARK_C = {
  bg:        '#080808', surface:   '#111111', surface2:  '#161616',
  surface3:  '#1c1c1c',
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
const LIGHT_C = {
  bg:        '#F8F9FB', surface:   '#FFFFFF', surface2:  '#F8F9FB',
  surface3:  '#F3F4F6',
  border:    '#E5E7EB', border2:   '#F3F4F6',
  text:      '#111827', textSub:   '#6B7280',
  textDim:   '#9CA3AF',
  orange:    '#FB670B', orangeDim: 'rgba(251,103,11,0.08)',
  green:     '#16A34A', greenDim:  'rgba(22,163,74,0.08)',
  blue:      '#2563EB', blueDim:   'rgba(37,99,235,0.08)',
  purple:    '#7C3AED', purpleDim: 'rgba(124,58,237,0.08)',
  amber:     '#B45309', amberDim:  'rgba(180,83,9,0.08)',
  red:       '#DC2626', redDim:    'rgba(220,38,38,0.08)',
  teal:      '#0D9488', tealDim:   'rgba(13,148,136,0.08)',
};

const CCtx = createContext(DARK_C);
const useC  = () => useContext(CCtx);

const T = {
  sans: "'DM Sans', system-ui, -apple-system, sans-serif",
  mono: "'DM Mono', 'Fira Mono', monospace",
};

// ── ICONOS SVG ────────────────────────────────────────────────────────────────
const Ic = {
  user:       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  userSm:     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  briefcase:  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  cake:       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><line x1="12" y1="11" x2="12" y2="7"/><polyline points="10 9 12 7 14 9"/></svg>,
  pin:        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  mail:       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  phone:      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  clip:       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
  chat:       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  wa:         <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.138.561 4.145 1.539 5.879L0 24l6.302-1.516A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.929 0-3.73-.5-5.29-1.378l-.38-.218-3.74.9.936-3.623-.239-.388A9.963 9.963 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>,
  download:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  pdf:        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  csv:        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><line x1="8" y1="9" x2="10" y2="9"/></svg>,
  send:       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  trash:      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  notes:      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>,
  plus:       <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  close:      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  chevronDown:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  chevronUp:  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>,
  refresh:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  search:     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  info:       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  clock:      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  eye:        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  check:      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  xmark:      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  star:       <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  filter:     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
};

// ── STATUS CONFIG ─────────────────────────────────────────────────────────────
const getStatusMap = (C) => ({
  nuevo:      { label: 'Nuevo',      icon: Ic.plus,   color: C.orange,  bg: C.orangeDim },
  visto:      { label: 'Revisado',   icon: Ic.eye,    color: C.purple,  bg: C.purpleDim },
  contactado: { label: 'Contactado', icon: Ic.phone,  color: C.blue,    bg: C.blueDim   },
  descartado: { label: 'No aplica',  icon: Ic.xmark,  color: C.textDim, bg: C.border2   },
  contratado: { label: 'Contratado', icon: Ic.star,   color: C.green,   bg: C.greenDim  },
});

function getStatus(c) { return c.status || c.estado || 'nuevo'; }

function getInitials(nombre) {
  if (!nombre) return '?';
  const parts = nombre.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : nombre.slice(0, 2).toUpperCase();
}

// ── Detección de género por nombre en español ─────────────────────────────────
const _NF = new Set(['maria','ana','rosa','laura','elena','sofia','isabella','valentina','lucia',
  'andrea','paula','diana','patricia','monica','claudia','sandra','jessica','gabriela','alejandra',
  'fernanda','daniela','carolina','mariana','natalia','veronica','adriana','lorena','beatriz',
  'silvia','irene','isabel','teresa','carmen','pilar','yolanda','rebeca','sara','nadia','miriam',
  'raquel','alicia','leticia','gloria','norma','esperanza','graciela','estela','marisol','rocio',
  'magdalena','guadalupe','luz','angelica','susana','martha','cecilia','liliana','blanca','edith',
  'julia','ruth','nancy','wendy','karla','karina','brenda','yaneth','anabel','xilonen','poolet',
  'lizbeth','fabiola','viviana','esmeralda','paola','minerva','ximena','montserrat','perla',
]);
const _NM = new Set(['jose','juan','carlos','luis','miguel','jesus','pedro','antonio','roberto',
  'francisco','manuel','rafael','jorge','alejandro','fernando','david','daniel','ricardo','sergio',
  'mario','eduardo','alberto','nicolas','enrique','arturo','hugo','javier','hector','pablo',
  'cesar','raul','omar','felipe','gerardo','marco','andres','diego','ivan','gabriel','ernesto',
  'oscar','alfredo','armando','ignacio','salvador','ruben','benjamin','samuel','abel','martin',
  'victor','gustavo','rogelio','jaime','gilberto','jonathan','emilio','carlos','bautista',
]);

function detectGender(nombre) {
  if (!nombre) return 'neutral';
  const first = nombre.trim().split(/\s+/)[0].toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (_NF.has(first)) return 'female';
  if (_NM.has(first)) return 'male';
  if (/ina$|ela$|ana$|ita$|ica$|ida$|isa$|iza$|ua$/.test(first)) return 'female';
  if (/(?<!m|b|c|g|p|z)a$/.test(first)) return 'female';
  if (/os$|el$|er$|on$|or$|uel$|iel$|o$/.test(first)) return 'male';
  return 'neutral';
}

// ── CSS avatar corporativo ────────────────────────────────────────────────────
const AVATAR_CSS = `
  @keyframes avIn {
    from { opacity:0; transform:scale(0.78); }
    to   { opacity:1; transform:scale(1);    }
  }
  .av-corp {
    animation: avIn 0.22s cubic-bezier(0.16,1,0.3,1) both;
    transition: box-shadow 0.18s ease, transform 0.18s ease;
    flex-shrink: 0;
  }
  .av-corp:hover { transform: translateY(-1px); }
`;

// ── Siluetas profesionales SVG (sin API externa) ──────────────────────────────
// Estilo: flat design corporativo, igual al de HR enterprise (Workday, SAP, BambooHR)

function AvatarMaleSVG({ size }) {
  const r = size / 2;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mgA" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e3a5f"/>
          <stop offset="100%" stopColor="#2563eb"/>
        </linearGradient>
        <linearGradient id="mgB" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0.06)"/>
        </linearGradient>
        <clipPath id="mc"><rect width="40" height="40" rx={Math.round(r * 0.52)}/></clipPath>
      </defs>
      <rect width="40" height="40" rx={Math.round(r * 0.52)} fill="url(#mgA)"/>
      <rect width="40" height="40" rx={Math.round(r * 0.52)} fill="url(#mgB)"/>
      {/* Cabeza */}
      <circle cx="20" cy="15" r="7" fill="rgba(255,255,255,0.92)"/>
      {/* Cuello */}
      <rect x="17.5" y="21" width="5" height="4" rx="1.5" fill="rgba(255,255,255,0.80)"/>
      {/* Hombros / traje — forma masculina más ancha */}
      <path d="M6 42 C6 31 34 31 34 42 Z" fill="rgba(255,255,255,0.92)"/>
      {/* Solapa de traje */}
      <path d="M17 25 L14 29 L20 28 L26 29 L23 25 L20 27 Z" fill="rgba(30,58,95,0.55)"/>
    </svg>
  );
}

function AvatarFemaleSVG({ size }) {
  const r = size / 2;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fgA" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b1f6b"/>
          <stop offset="100%" stopColor="#7c3aed"/>
        </linearGradient>
        <linearGradient id="fgB" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.20)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0.05)"/>
        </linearGradient>
        <clipPath id="fc"><rect width="40" height="40" rx={Math.round(r * 0.52)}/></clipPath>
      </defs>
      <rect width="40" height="40" rx={Math.round(r * 0.52)} fill="url(#fgA)"/>
      <rect width="40" height="40" rx={Math.round(r * 0.52)} fill="url(#fgB)"/>
      {/* Cabello — más largo a los lados */}
      <ellipse cx="20" cy="14" rx="9" ry="8" fill="rgba(255,255,255,0.30)"/>
      <rect x="10" y="13" width="3" height="9" rx="1.5" fill="rgba(255,255,255,0.25)"/>
      <rect x="27" y="13" width="3" height="9" rx="1.5" fill="rgba(255,255,255,0.25)"/>
      {/* Cabeza */}
      <circle cx="20" cy="15" r="6.5" fill="rgba(255,255,255,0.92)"/>
      {/* Cuello */}
      <rect x="18" y="20.5" width="4" height="4" rx="1.5" fill="rgba(255,255,255,0.80)"/>
      {/* Hombros / blusa — forma más estrecha y redondeada */}
      <path d="M9 42 C9 32 31 32 31 42 Z" fill="rgba(255,255,255,0.92)"/>
    </svg>
  );
}

function AvatarNeutralSVG({ size }) {
  const r = size / 2;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ngA" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1f2937"/>
          <stop offset="100%" stopColor="#374151"/>
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx={Math.round(r * 0.52)} fill="url(#ngA)"/>
      <circle cx="20" cy="15" r="7" fill="rgba(255,255,255,0.85)"/>
      <path d="M7 42 C7 31 33 31 33 42 Z" fill="rgba(255,255,255,0.85)"/>
    </svg>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
function AvatarIcon({ nombre, size = 36, statusColor }) {
  const gender = detectGender(nombre);

  const border = gender === 'female'
    ? 'rgba(124,58,237,0.40)'
    : gender === 'male'
    ? 'rgba(37,99,235,0.40)'
    : 'rgba(100,100,100,0.25)';

  const shadow = gender === 'female'
    ? '0 2px 8px rgba(124,58,237,0.20)'
    : gender === 'male'
    ? '0 2px 8px rgba(37,99,235,0.20)'
    : '0 1px 4px rgba(0,0,0,0.15)';

  const br = size > 30 ? 10 : 7;

  return (
    <>
      <style>{AVATAR_CSS}</style>
      <div className="av-corp" style={{ width:size, height:size, borderRadius:br, overflow:'hidden', border:`1.5px solid ${border}`, boxShadow:shadow }}>
        {gender === 'female'  && <AvatarFemaleSVG  size={size}/>}
        {gender === 'male'    && <AvatarMaleSVG    size={size}/>}
        {gender === 'neutral' && <AvatarNeutralSVG size={size}/>}
      </div>
    </>
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

function fmtShort(ts) {
  if (!ts) return '';
  try {
    const iso = ts.trim().replace(' ','T') + (ts.includes('Z') ? '' : 'Z');
    return new Date(iso).toLocaleString('es-MX', { timeZone:'America/Mexico_City', day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
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

// ── StatusBadge ───────────────────────────────────────────────────────────────
function StatusBadge({ status, small = false }) {
  const C = useC();
  const s = getStatusMap(C)[status] || getStatusMap(C).nuevo;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding: small ? '2px 8px' : '3px 10px', borderRadius:20, fontSize: small ? 10 : 11, fontWeight:500, background:'transparent', color:s.color, border:`1px solid ${s.color}35`, fontFamily:T.sans, lineHeight:1.5, whiteSpace:'nowrap' }}>
      <span style={{ width:5, height:5, borderRadius:'50%', background:s.color, display:'inline-block', flexShrink:0 }}/>
      {s.label}
    </span>
  );
}

// ── FieldChip ─────────────────────────────────────────────────────────────────
function FieldChip({ icon, label, value, color: _color, mono = false }) {
  const C = useC();
  const color = _color || C.textSub;
  if (!value) return null;
  return (
    <div style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, padding:'10px 13px' }}>
      <div style={{ color:C.textDim, fontSize:9, fontFamily:T.sans, letterSpacing:'0.09em', textTransform:'uppercase', marginBottom:5, display:'flex', alignItems:'center', gap:5 }}>
        <span style={{ display:'flex', color:C.textDim }}>{icon}</span>{label}
      </div>
      <div style={{ color, fontSize:12.5, fontFamily: mono ? T.mono : T.sans, wordBreak:'break-word', fontWeight:500 }}>{value}</div>
    </div>
  );
}

// ── CVChip ────────────────────────────────────────────────────────────────────
function CVChip({ candidate }) {
  const C = useC();
  const [hover, setHover] = useState(false);
  if (!candidate.cv_nombre) return null;
  return (
    <div style={{ background:C.surface2, border:`1px solid ${C.teal}28`, borderRadius:9, padding:'10px 13px' }}>
      <div style={{ color:C.textDim, fontSize:9, fontFamily:T.sans, letterSpacing:'0.09em', textTransform:'uppercase', marginBottom:5, display:'flex', alignItems:'center', gap:5 }}>
        <span style={{ display:'flex', color:C.teal }}>{Ic.clip}</span>Curriculum Vitae
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
        <span style={{ color:C.teal, fontSize:11.5, fontFamily:T.sans, wordBreak:'break-all', flex:1, minWidth:80, fontWeight:500 }}>{candidate.cv_nombre}</span>
        {candidate.cv_base64 ? (
          <button onClick={() => abrirCV(candidate)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
            style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 11px', borderRadius:7, cursor:'pointer', background: hover ? `rgba(20,184,166,0.22)` : C.tealDim, border:`1px solid ${C.teal}35`, color:C.teal, fontSize:11, fontWeight:600, fontFamily:T.sans, whiteSpace:'nowrap', flexShrink:0, transition:'background 0.13s ease' }}>
            {Ic.download}<span>Descargar</span>
          </button>
        ) : (
          <span style={{ color:C.textDim, fontSize:10, fontStyle:'italic' }}>sin archivo</span>
        )}
      </div>
    </div>
  );
}

// ── IconBtn ────────────────────────────────────────────────────────────────────
function IconBtn({ onClick, icon, label, color, bg, bgHover, border, title, disabled, style: s = {} }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} title={title} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 11px', borderRadius:7, fontSize:11, fontWeight:600, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily:T.sans, whiteSpace:'nowrap', border, background: h && !disabled ? bgHover : bg, color, transition:'background 0.13s ease', opacity: disabled ? 0.5 : 1, ...s }}>
      <span style={{ display:'flex' }}>{icon}</span>{label}
    </button>
  );
}

// ── TrackingPanel — seguimiento interno del reclutador ───────────────────────
function TrackingPanel({ candidateId }) {
  const C = useC();
  const [notes,    setNotes]    = useState(null);
  const [input,    setInput]    = useState('');
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);
  const textRef = useRef(null);

  const loadNotes = useCallback(async () => {
    try {
      const r = await fetch('/api/recruitment', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'getNotes', candidateId }) });
      const j = await r.json();
      setNotes(j.ok ? j.notes : []);
    } catch { setNotes([]); }
  }, [candidateId]);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  const addNote = async () => {
    const nota = input.trim();
    if (!nota) return;
    setSaving(true);
    try {
      await fetch('/api/recruitment', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'addNote', candidateId, nota }) });
      setInput('');
      await loadNotes();
      textRef.current?.focus();
    } catch(e) { console.error(e); }
    setSaving(false);
  };

  const deleteNote = async (noteId) => {
    setDeleting(noteId);
    try {
      await fetch('/api/recruitment', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'deleteNote', noteId }) });
      setNotes(prev => prev.filter(n => n.id !== noteId));
    } catch(e) { console.error(e); }
    setDeleting(null);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
        <div style={{ width:26, height:26, borderRadius:7, background:C.amberDim, border:`1px solid ${C.amber}30`, display:'flex', alignItems:'center', justifyContent:'center', color:C.amber, flexShrink:0 }}>{Ic.notes}</div>
        <span style={{ color:C.amber, fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', fontFamily:T.sans }}>Seguimiento del Reclutador</span>
        {notes !== null && notes.length > 0 && (
          <span style={{ background:C.amberDim, border:`1px solid ${C.amber}30`, borderRadius:10, padding:'1px 7px', fontSize:9.5, fontWeight:700, color:C.amber, fontFamily:T.mono }}>{notes.length}</span>
        )}
      </div>

      {/* Input */}
      <div style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, overflow:'hidden', marginBottom:14 }}>
        <textarea
          ref={textRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key==='Enter' && (e.ctrlKey||e.metaKey)) addNote(); }}
          placeholder="Escribe una nota de seguimiento… ej: No califica por falta de experiencia en el área · Ctrl+Enter para guardar"
          rows={2}
          style={{ width:'100%', background:'transparent', border:'none', padding:'11px 13px', color:C.text, fontSize:12, fontFamily:T.sans, resize:'vertical', outline:'none', lineHeight:1.6, boxSizing:'border-box' }}
        />
        <div style={{ padding:'8px 12px', borderTop:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:C.surface3 }}>
          <span style={{ color:C.textDim, fontSize:9.5, fontFamily:T.sans }}>Ctrl + Enter para guardar rápido</span>
          <button onClick={addNote} disabled={saving || !input.trim()}
            style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 14px', borderRadius:7, fontSize:11, fontWeight:700, cursor: saving || !input.trim() ? 'not-allowed' : 'pointer', fontFamily:T.sans, background: input.trim() ? C.amber : 'transparent', color: input.trim() ? '#fff' : C.textDim, border:`1px solid ${input.trim() ? C.amber : C.border}`, transition:'all 0.13s', opacity: saving ? 0.6 : 1 }}>
            {saving ? <><span style={{ width:10, height:10, borderRadius:'50%', border:`1.5px solid rgba(255,255,255,0.3)`, borderTop:`1.5px solid #fff`, animation:'spin 0.7s linear infinite', display:'inline-block' }}/> Guardando</> : <>{Ic.plus} Agregar nota</>}
          </button>
        </div>
      </div>

      {/* Lista de notas */}
      {notes === null ? (
        <div style={{ color:C.textDim, fontSize:11, fontFamily:T.sans, padding:'8px 0', display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ width:10, height:10, borderRadius:'50%', border:`1.5px solid ${C.border}`, borderTop:`1.5px solid ${C.amber}`, animation:'spin 0.7s linear infinite' }}/>
          Cargando notas…
        </div>
      ) : notes.length === 0 ? (
        <div style={{ padding:'14px 16px', borderRadius:9, border:`1px dashed ${C.border}`, textAlign:'center' }}>
          <div style={{ color:C.textDim, fontSize:11, fontFamily:T.sans }}>Sin notas de seguimiento.</div>
          <div style={{ color:C.textDim, fontSize:10, fontFamily:T.sans, marginTop:3, opacity:0.7 }}>Agrega observaciones, comentarios o el resultado de cada contacto.</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          {notes.map((n, idx) => (
            <div key={n.id} style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:9, padding:'11px 13px', display:'flex', gap:10, alignItems:'flex-start', position:'relative' }}>
              {/* Línea de tiempo */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, flexShrink:0 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:C.amber, marginTop:4, flexShrink:0 }}/>
                {idx < notes.length - 1 && <div style={{ width:1, flex:1, minHeight:16, background:C.border }}/>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ color:C.text, fontSize:12.5, fontFamily:T.sans, lineHeight:1.65, whiteSpace:'pre-wrap', wordBreak:'break-word' }}>{n.nota}</div>
                <div style={{ color:C.textDim, fontSize:9.5, fontFamily:T.mono, marginTop:6, display:'flex', alignItems:'center', gap:4 }}>
                  {Ic.clock} {fmtShort(n.created_at)}
                </div>
              </div>
              <button onClick={() => deleteNote(n.id)} disabled={deleting === n.id} title="Eliminar nota"
                style={{ padding:'4px 7px', borderRadius:6, fontSize:10, cursor: deleting===n.id ? 'wait' : 'pointer', background:C.redDim, color:C.red, border:`1px solid ${C.red}22`, flexShrink:0, opacity: deleting===n.id ? 0.5 : 0.7, transition:'opacity 0.13s', display:'flex', alignItems:'center' }}>
                {Ic.trash}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CandidateCard({ candidate, onStatusChange, onDelete, onRequestDelete, expanded, onToggle, isNew, canDelete }) {
  const C = useC();
  const [updating,  setUpdating]  = useState(false);
  const [sendOpen,  setSendOpen]  = useState(false);
  const [sendPhone, setSendPhone] = useState('');
  
  // PROTECCIÓN: Validamos que candidate exista antes de pasarlo a funciones de estatus
  const currentStatus = candidate ? getStatus(candidate) : 'nuevo';
  const STATUS_MAP    = getStatusMap(C);

  const changeStatus = async (newStatus) => {
    if(!candidate?.id) return; // Seguridad extra
    setUpdating(true);
    try {
      await fetch('/api/recruitment', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'updateStatus', id:candidate.id, status:newStatus }) });
      onStatusChange(candidate.id, newStatus);
    } catch(e) { console.error(e); }
    setUpdating(false);
  };

const handleDelete = () => {
  if (!canDelete || !candidate) return;
  onRequestDelete({ id: candidate.id, nombre: candidate.nombre, puesto: candidate.puesto });
};

  // PROTECCIÓN: Valores por defecto para evitar errores de renderizado
  const folio   = candidate?.id ? `#${String(candidate.id).padStart(5,'0')}` : '—';
  const tieneCv = !!(candidate?.cv_nombre);
  const tsLabel = formatFecha(candidate?.created_at || candidate?.ts);
  const recent  = isNew || isRecent(candidate?.created_at || candidate?.ts);
  const sm      = getStatusMap(C)[currentStatus] || getStatusMap(C).nuevo;

  const esEspera   = candidate?.en_lista_espera === 1 || candidate?.en_lista_espera === true;
  const esPrioridad = candidate?.prioridad === 1 || candidate?.prioridad === true;

  if (!candidate) return null; // Si por alguna razón no hay objeto, no renderizamos nada

  return (
    <div style={{ display:'flex', background: expanded ? `${sm.color}18` : `${sm.color}0e`, border:`1px solid ${expanded ? sm.color+'70' : sm.color+'45'}`, borderRadius:10, overflow:'hidden', transition:'border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease', boxShadow: expanded ? `0 2px 14px ${sm.color}25` : `0 1px 3px ${sm.color}15`, animation: recent ? 'newCardIn 0.4s ease both' : 'none' }}>

      {/* Status side bar */}
      <div style={{ width:6, flexShrink:0, background:sm.color }}/>

      <div style={{ flex:1, minWidth:0 }}>

        {/* Clickable row — 48px height target */}
        <div onClick={onToggle} style={{ padding:'10px 14px', display:'flex', alignItems:'center', gap:12, cursor:'pointer', background: expanded ? `${C.orange}04` : 'transparent', transition:'background 0.12s ease', flexWrap:'wrap', rowGap:6, minHeight:48 }}>

          {/* Avatar */}
          <AvatarIcon nombre={candidate?.nombre} size={36} statusColor={sm.color}/>

          {/* Info central */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3, flexWrap:'wrap' }}>
              <span style={{ color:C.text, fontWeight:600, fontSize:13.5, fontFamily:T.sans, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:220 }}>
                {candidate?.nombre || 'Sin nombre registrado'}
              </span>
              <StatusBadge status={currentStatus} small />
              {recent && (
                <span style={{ display:'inline-flex', alignItems:'center', gap:3, padding:'1px 7px', borderRadius:10, fontSize:9, fontWeight:700, background:C.greenDim, color:C.green, border:`1px solid ${C.green}28`, fontFamily:T.sans, letterSpacing:'0.04em' }}>
                  NUEVO
                </span>
              )}
              {esEspera && (
                <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'1px 7px', borderRadius:10, fontSize:9, fontWeight:700, background:C.orangeDim, color:C.orange, border:`1px solid ${C.orange}28`, fontFamily:T.sans }}>
                  EN ESPERA
                </span>
              )}
              {esPrioridad && (
                <span style={{ display:'inline-flex', alignItems:'center', gap:3, padding:'2px 8px', borderRadius:10, fontSize:9, fontWeight:800, background:'rgba(234,179,8,0.15)', color:'#B45309', border:'1px solid rgba(234,179,8,0.4)', fontFamily:T.sans, letterSpacing:'0.05em' }}>
                  ★ PRIORIDAD
                </span>
              )}
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
              {candidate?.puesto && (
                <span style={{ color:C.orange, fontSize:11.5, fontFamily:T.sans, fontWeight:600 }}>
                  {candidate.puesto}
                </span>
              )}
              <span style={{ color:C.textDim, fontSize:10, fontFamily:T.mono, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:4, padding:'1px 6px' }}>{folio}</span>
            </div>
          </div>

          {/* Acciones rápidas - PROTEGIDAS */}
          <div style={{ display:'flex', gap:5, alignItems:'center', flexShrink:0, flexWrap:'wrap' }} onClick={e => e.stopPropagation()}>
            {candidate?.email && (
              <a href={`mailto:${candidate.email}`} title={candidate.email}
                style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'5px 11px', borderRadius:7, fontSize:11, fontWeight:600, background:C.blueDim, color:C.blue, border:`1.5px solid ${C.blue}22`, textDecoration:'none' }}>
                {Ic.mail} Email
              </a>
            )}
            {candidate?.telefono && (
              <a href={`https://wa.me/${(candidate.telefono || '').replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'5px 11px', borderRadius:7, fontSize:11, fontWeight:600, background:C.greenDim, color:C.green, border:`1.5px solid ${C.green}22`, textDecoration:'none' }}>
                {Ic.wa} WA
              </a>
            )}
          </div>
        </div>
        
        {/* Panel expandido */}
        {expanded && candidate && (
          <div style={{ borderTop:`1px solid ${C.border}`, background: C.surface2 }} onClick={e => e.stopPropagation()}>

            {/* ── Fila de estatus ── */}
            <div style={{ padding:'12px 16px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
              {Object.entries(getStatusMap(C)).map(([key, sm]) => (
                <button key={key} disabled={updating} onClick={() => changeStatus(key)}
                  style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'5px 13px', borderRadius:20,
                    fontSize:11, fontWeight: currentStatus===key ? 700 : 500, fontFamily:T.sans, cursor:'pointer',
                    border:`1.5px solid ${currentStatus===key ? sm.color : C.border}`,
                    background: currentStatus===key ? sm.color : 'transparent',
                    color: currentStatus===key ? '#fff' : C.textSub,
                    transition:'all 0.12s ease', opacity: updating ? 0.6 : 1 }}>
                  {currentStatus===key && <span style={{ width:5, height:5, borderRadius:'50%', background:'rgba(255,255,255,0.75)', display:'inline-block' }}/>}
                  {sm.label}
                </button>
              ))}
              {canDelete && (
                <button onClick={handleDelete}
                  style={{ marginLeft:'auto', display:'inline-flex', alignItems:'center', gap:5, padding:'5px 12px', borderRadius:20,
                    fontSize:11, fontWeight:600, fontFamily:T.sans, cursor:'pointer',
                    background:'transparent', border:`1.5px solid ${C.red}35`, color:C.red, transition:'all 0.12s ease' }}>
                  {Ic.trash} Eliminar
                </button>
              )}
            </div>

            {/* ── Dos columnas: info izq | notas der ── */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0 }}>

              {/* Columna izquierda — datos + CV + mensaje */}
              <div style={{ padding:'16px', borderRight:`1px solid ${C.border}` }}>

                {/* Datos de contacto */}
                <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                  {candidate.email && (
                    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                      <span style={{ width:28, height:28, borderRadius:8, background:`${C.orange}12`, border:`1px solid ${C.orange}20`, display:'flex', alignItems:'center', justifyContent:'center', color:C.orange, flexShrink:0 }}>{Ic.email}</span>
                      <div>
                        <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:C.textDim, fontFamily:T.sans, marginBottom:1 }}>Email</div>
                        <a href={`mailto:${candidate.email}`} style={{ fontSize:12, color:C.orange, fontFamily:T.sans, textDecoration:'none', fontWeight:500 }}>{candidate.email}</a>
                      </div>
                    </div>
                  )}
                  {candidate.telefono && (
                    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                      <span style={{ width:28, height:28, borderRadius:8, background:`${C.teal}12`, border:`1px solid ${C.teal}20`, display:'flex', alignItems:'center', justifyContent:'center', color:C.teal, flexShrink:0 }}>{Ic.phone}</span>
                      <div>
                        <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:C.textDim, fontFamily:T.sans, marginBottom:1 }}>Teléfono</div>
                        <a href={`https://wa.me/${(candidate.telefono||'').replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:C.teal, fontFamily:T.sans, textDecoration:'none', fontWeight:500 }}>{candidate.telefono}</a>
                      </div>
                    </div>
                  )}
                  <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                    {candidate.edad && (
                      <div>
                        <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:C.textDim, fontFamily:T.sans, marginBottom:1 }}>Edad</div>
                        <div style={{ fontSize:12, color:C.text, fontFamily:T.sans, fontWeight:500 }}>{candidate.edad} años</div>
                      </div>
                    )}
                    {candidate.estado_rep && (
                      <div>
                        <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:C.textDim, fontFamily:T.sans, marginBottom:1 }}>Ubicación</div>
                        <div style={{ fontSize:12, color:C.text, fontFamily:T.sans, fontWeight:500 }}>{candidate.colonia ? `${candidate.colonia}, ` : ''}{candidate.estado_rep}</div>
                      </div>
                    )}
                    {tsLabel && (
                      <div>
                        <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:C.textDim, fontFamily:T.sans, marginBottom:1 }}>Registrado</div>
                        <div style={{ fontSize:11, color:C.textSub, fontFamily:T.sans }}>{tsLabel}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* CV */}
                {tieneCv && (
                  <button onClick={() => abrirCV(candidate)}
                    style={{ marginTop:14, display:'inline-flex', alignItems:'center', gap:6, padding:'7px 13px', borderRadius:8,
                      fontSize:11, fontWeight:600, fontFamily:T.sans, cursor:'pointer', width:'100%',
                      background:C.surface, border:`1px solid ${C.border}`, color:C.teal, justifyContent:'center' }}>
                    {Ic.clip} Ver CV — {candidate.cv_nombre}
                  </button>
                )}

                {/* Perfil PDF */}
                <button onClick={() => descargarPerfilPDF(candidate)}
                  style={{ marginTop:8, display:'inline-flex', alignItems:'center', gap:6, padding:'7px 13px', borderRadius:8,
                    fontSize:11, fontWeight:600, fontFamily:T.sans, cursor:'pointer', width:'100%',
                    background:C.surface, border:`1px solid ${C.border}`, color:C.orange, justifyContent:'center' }}>
                  {Ic.pdf} Descargar Perfil PDF
                </button>

                {/* Mensaje */}
                {candidate.mensaje && (
                  <div style={{ marginTop:14 }}>
                    <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:C.textDim, fontFamily:T.sans, marginBottom:6 }}>Mensaje del candidato</div>
                    <div style={{ fontSize:11.5, color:C.textSub, fontFamily:T.sans, lineHeight:1.65, whiteSpace:'pre-wrap',
                      background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:'9px 11px' }}>
                      {candidate.mensaje}
                    </div>
                  </div>
                )}
              </div>

              {/* Columna derecha — seguimiento */}
              <div style={{ padding:'16px' }}>
                <TrackingPanel candidateId={candidate.id}/>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
const AUTO_REFRESH_MS = 20_000;

export default function RecruitmentTab({ canDelete = false, theme = 'dark' }) {
  const palette = theme === 'dark' ? DARK_C : LIGHT_C;
  const C = palette;

  const [candidates, setCandidates] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded,   setExpanded]   = useState(null);
  const [filter,     setFilter]     = useState('todos');
  const [search,     setSearch]     = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [newIds,     setNewIds]     = useState(new Set());
  const [exporting,  setExporting]  = useState(null);
  const [iaReporting,    setIaReporting]   = useState(false);
  const [iaReportPuesto, setIaReportPuesto] = useState(''); // legacy, no se usa
 const [deleteTarget, setDeleteTarget] = useState(null); // { id, nombre, puesto }
const [deleting,     setDeleting]     = useState(false);
 
  const [iaVacanteId,    setIaVacanteId]   = useState(''); // '' = todos, 'otro' = sin vacante, número = vacante específica
  const [vacantes,       setVacantes]      = useState([]);
  const prevIdsRef  = useRef(new Set());
  const intervalRef = useRef(null);

  const load = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true); else setLoading(true);
    try {
      const [r, rv] = await Promise.all([
        fetch('/api/recruitment', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'list' }) }),
        fetch('/api/recruitment', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'list-vacantes' }) }),
      ]);
      const j = await r.json();
      if (!j.ok) { console.error(j); return; }
      const jv = await rv.json().catch(() => ({ ok: false }));
      if (jv.ok && Array.isArray(jv.vacantes)) setVacantes(jv.vacantes);
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

  const handleStatusChange = (id, st) => setCandidates(prev => prev.map(c => c.id === id ? { ...c, status:st, estado:st } : c));
  const handleDelete        = (id)     => setCandidates(prev => prev.filter(c => c.id !== id));

  const STATUS_MAP = getStatusMap(C);
  const counts = Object.fromEntries(Object.keys(STATUS_MAP).map(k => [k, candidates.filter(c => getStatus(c) === k).length]));

  // Coincidencia candidato ↔ vacante (igual que backend)
  const matchVacante = (c, vac) => {
    const p = (c.puesto || '').toLowerCase().trim();
    const t = (vac.titulo || '').toLowerCase().trim();
    const words = t.split(/\s+/).filter(w => w.length > 3);
    return p && (t.includes(p) || p.includes(t) || words.some(w => p.includes(w)));
  };

  const filtered = candidates.filter(c => {
    const esEsp = c.en_lista_espera === 1 || c.en_lista_espera === true;

    // ── Filtro por vacante / lista de espera ──
    if (iaVacanteId === 'otro') {
      if (!esEsp) return false; // solo lista de espera
    } else if (iaVacanteId) {
      const vac = vacantes.find(v => String(v.id) === String(iaVacanteId));
      if (!vac || !matchVacante(c, vac)) return false;
    }

    // ── Filtro por estatus ──
    const mf = filter === 'todos'
      ? !esEsp
      : filter === 'espera'
        ? esEsp
        : getStatus(c) === filter && !esEsp;

    // ── Búsqueda de texto ──
    const q  = search.toLowerCase();
    const ms = !q || [c.nombre, c.email, c.telefono, c.puesto, c.edad, c.estado_rep, c.colonia, c.cv_nombre].some(v => (v||'').toLowerCase().includes(q));
    return mf && ms;
  });

  const countEspera = candidates.filter(c => c.en_lista_espera === 1 || c.en_lista_espera === true).length;

  const conCv     = candidates.filter(c => c.cv_nombre).length;
  const hoy       = new Date().toISOString().split('T')[0];
  const nuevosHoy = candidates.filter(c => (c.created_at||c.ts||'').replace(' ','T').split('T')[0] === hoy).length;

  const doExport = (type) => {
    setExporting(type);
    const list = filtered.length && filtered.length < candidates.length ? filtered : candidates;
    try { 
      if (type === 'csv') exportarTodoCSV(list);
      else exportarTodoPDF(list);
    }
    finally { setTimeout(() => setExporting(null), 1400); }
  };

  // Puestos únicos de los candidatos actuales para el filtro
  const puestosUnicos = [...new Set(candidates.map(c => (c.puesto||'').trim()).filter(Boolean))].sort();

  const doReporteIA = async () => {
    setIaReporting(true);
    try {
      // Construir label para nombre del archivo
      let slug = '';
      if (iaVacanteId === 'otro') {
        slug = '_Sin_Vacante';
      } else if (iaVacanteId) {
        const vac = vacantes.find(v => String(v.id) === String(iaVacanteId));
        if (vac) slug = `_${vac.titulo.replace(/\s+/g, '_')}`;
      }

      const r = await fetch('/api/reports/recruitment-ia', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ format: 'pdf', vacanteId: iaVacanteId || '' }),
      });
      if (!r.ok) {
        const txt = await r.text().catch(() => '');
        try { const j = JSON.parse(txt); throw new Error(j.error || `HTTP ${r.status}`); } catch(pe) { if (pe.message !== txt) throw pe; }
        throw new Error(txt.replace(/<[^>]+>/g, '').slice(0, 200) || `HTTP ${r.status}`);
      }
      const blob = await r.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `Reporte_IA_Reclutamiento${slug}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (e) {
      alert('Error generando reporte IA: ' + e.message);
    } finally {
      setIaReporting(false);
    }
  };
const confirmDelete = async () => {
  if (!deleteTarget) return;
  setDeleting(true);
  try {
    await fetch('/api/recruitment', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'delete', id: deleteTarget.id }) });
    handleDelete(deleteTarget.id);
  } catch(e) { console.error(e); }
  setDeleting(false);
  setDeleteTarget(null);
};
  if (loading) return (
    <CCtx.Provider value={palette}>
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', padding:'80px 0', flexDirection:'column', gap:12 }}>
        <div style={{ width:22, height:22, borderRadius:'50%', border:`1.5px solid ${C.border}`, borderTop:`1.5px solid ${C.orange}`, animation:'spin 0.7s linear infinite' }}/>
        <span style={{ color:C.textDim, fontSize:11, fontFamily:T.sans, letterSpacing:'0.06em' }}>Cargando candidatos…</span>
      </div>
    </CCtx.Provider>
  );

  const kpis = [
    { label:'Total',       value:candidates.length,       icon:Ic.user,      color:C.orange },
    { label:'Hoy',         value:nuevosHoy,               icon:Ic.clock,     color:C.blue   },
    { label:'Con CV',      value:conCv,                   icon:Ic.clip,      color:C.teal   },
    { label:'Sin CV',      value:candidates.length-conCv, icon:Ic.pdf,       color:C.textDim},
    { label:'Contratados', value:counts.contratado||0,    icon:Ic.star,      color:C.green  },
  ];

  const CARD = { background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:'20px 22px', marginBottom:10, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' };

  return (
    <CCtx.Provider value={palette}>
      <div>
        <style>{`
          @keyframes spin        { to { transform:rotate(360deg); } }
          @keyframes pulse       { 0%,100%{opacity:1} 50%{opacity:0.4} }
          @keyframes newCardIn   { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
          @keyframes shimmer     { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
          .ia-skeleton-line { border-radius:6px; animation:shimmer 1.4s infinite linear; }
          .ia-overlay { position:absolute;inset:0;z-index:10;border-radius:12px;backdrop-filter:blur(2px); }
        `}</style>

        {/* KPIs */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:8, marginBottom:12 }}>
          {kpis.map(kpi => (
            <div key={kpi.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:'20px 22px', position:'relative', overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
              {/* Thin top accent bar */}
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2.5, background:kpi.color, opacity:0.55, borderRadius:'12px 12px 0 0' }}/>
              <div style={{ color:C.textDim, fontSize:10, fontFamily:T.sans, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14 }}>{kpi.label}</div>
              <div style={{ color:C.text, fontSize:36, fontFamily:T.mono, fontWeight:500, lineHeight:1, letterSpacing:'-0.04em' }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Pipeline visual */}
        {candidates.length > 0 && (
          <div style={{ ...CARD, padding:'16px 20px', marginBottom:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
              <span style={{ color:C.textDim, fontSize:10, fontFamily:T.sans, letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:600 }}>Pipeline</span>
              <span style={{ color:C.textDim, fontSize:10, fontFamily:T.mono, marginLeft:'auto' }}>{candidates.length} total</span>
            </div>
            {/* Thin stacked progress bar */}
            <div style={{ height:4, borderRadius:4, overflow:'hidden', display:'flex', gap:1, marginBottom:14, background:C.border2 }}>
              {Object.entries(STATUS_MAP).map(([key,{color}]) => {
                const n = counts[key]||0;
                if (!n) return null;
                return <div key={key} style={{ flex:n, background:color, opacity:0.70, transition:'flex 0.4s ease', minWidth:3 }}/>;
              })}
            </div>
            {/* Legend: compact pill buttons */}
            <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
              {Object.entries(STATUS_MAP).map(([key,{label, color}]) => {
                const n = counts[key]||0;
                if (!n) return null;
                const pct = Math.round((n / candidates.length) * 100);
                return (
                  <div key={key} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:20, background:C.surface2, border:`1px solid ${C.border}`, cursor:'pointer', transition:'border-color 0.13s ease' }}
                    onClick={() => setFilter(key)}
                    onMouseEnter={e => e.currentTarget.style.borderColor=`${color}40`}
                    onMouseLeave={e => e.currentTarget.style.borderColor=C.border}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:color, flexShrink:0 }}/>
                    <span style={{ color:C.textSub, fontSize:11, fontFamily:T.sans, fontWeight:500 }}>{label}</span>
                    <span style={{ color:C.text, fontSize:11, fontFamily:T.mono, fontWeight:600 }}>{n}</span>
                    <span style={{ color:C.textDim, fontSize:10 }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Lista */}
        <div style={{ ...CARD, position:'relative' }}>

          {/* Skeleton overlay mientras genera el reporte IA */}
          {iaReporting && (
            <div className="ia-overlay" style={{ background: theme==='light' ? 'rgba(237,242,250,0.88)' : 'rgba(8,8,8,0.88)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20 }}>
              <div style={{ textAlign:'center', marginBottom:4 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center', marginBottom:8 }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${C.purple}30`, borderTop:`2px solid ${C.purple}`, animation:'spin 0.8s linear infinite' }}/>
                  <span style={{ color:C.purple, fontSize:13, fontWeight:700, fontFamily:T.sans }}>Generando Reporte IA…</span>
                </div>
                <span style={{ color:C.textDim, fontSize:10.5, fontFamily:T.sans }}>
                  {iaVacanteId === 'otro'
                    ? 'Lista de espera'
                    : iaVacanteId
                      ? `Vacante: ${vacantes.find(v => String(v.id) === String(iaVacanteId))?.titulo || iaVacanteId}`
                      : 'Todos los candidatos'
                  } · leyendo CVs y calculando ranking
                </span>
              </div>
              {/* Skeleton cards */}
              <div style={{ width:'100%', maxWidth:560, display:'flex', flexDirection:'column', gap:9, padding:'0 8px' }}>
                {[1,2,3,4].map(n => {
                  const shimmerBg = `linear-gradient(90deg, ${theme==='light'?'#e2e8f0':'#1c1c1c'} 25%, ${theme==='light'?'#f1f5f9':'#242424'} 50%, ${theme==='light'?'#e2e8f0':'#1c1c1c'} 75%)`;
                  return (
                    <div key={n} style={{ background: theme==='light'?'#fff':'#111', border:`1px solid ${C.border}`, borderRadius:9, padding:'12px 14px', display:'flex', gap:12, alignItems:'center' }}>
                      <div className="ia-skeleton-line" style={{ width:32, height:32, borderRadius:'50%', backgroundImage:shimmerBg, backgroundSize:'600px 100%', flexShrink:0 }}/>
                      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:6 }}>
                        <div className="ia-skeleton-line" style={{ height:10, width:`${55+n*8}%`, backgroundImage:shimmerBg, backgroundSize:'600px 100%' }}/>
                        <div className="ia-skeleton-line" style={{ height:8,  width:`${30+n*5}%`, backgroundImage:shimmerBg, backgroundSize:'600px 100%' }}/>
                      </div>
                      <div className="ia-skeleton-line" style={{ width:36, height:22, borderRadius:5, backgroundImage:shimmerBg, backgroundSize:'600px 100%', flexShrink:0 }}/>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* Toolbar */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, flexWrap:'wrap', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ color:C.text, fontSize:13, fontWeight:600, fontFamily:T.sans, letterSpacing:'-0.02em' }}>
                {iaVacanteId === 'otro'
                  ? 'Lista de espera'
                  : iaVacanteId
                    ? (vacantes.find(v => String(v.id) === String(iaVacanteId))?.titulo || 'Candidatos')
                    : 'Candidatos'}
                <span style={{ color:C.textDim, fontWeight:400, fontSize:11, marginLeft:6 }}>
                  ({filtered.length}{iaVacanteId ? '' : ` de ${candidates.length}`})
                </span>
              </span>
              {refreshing && (
                <div style={{ display:'flex', alignItems:'center', gap:5, color:C.textDim, fontSize:10, fontFamily:T.sans }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', border:`1.5px solid ${C.border2}`, borderTop:`1.5px solid ${C.orange}`, animation:'spin 0.7s linear infinite' }}/>actualizando…
                </div>
              )}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
              {lastUpdate && <span style={{ display:'flex', alignItems:'center', gap:4, color:C.textDim, fontSize:10, fontFamily:T.mono }}>{Ic.clock} {lastUpdate.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</span>}
              <IconBtn onClick={() => load(false)} icon={Ic.refresh} label="Actualizar" bg="transparent" bgHover={C.surface2} color={C.textSub} border={`1px solid ${C.border}`} />
              {candidates.length > 0 && (<>
                <IconBtn onClick={() => doExport('csv')} icon={Ic.csv} label={exporting==='csv' ? 'Exportando…' : 'CSV'} bg={C.greenDim} bgHover="rgba(34,197,94,0.16)" color={C.green} border={`1px solid ${C.green}28`} disabled={exporting==='csv'} />
                <IconBtn onClick={() => doExport('pdf')} icon={Ic.pdf} label={exporting==='pdf' ? 'Generando…' : 'PDF'} bg={C.blueDim} bgHover="rgba(59,130,246,0.16)" color={C.blue} border={`1px solid ${C.blue}28`} disabled={exporting==='pdf'} />
                {/* Dropdown de vacantes para filtrar el reporte IA */}
                <select
                  value={iaVacanteId}
                  onChange={e => setIaVacanteId(e.target.value)}
                  disabled={iaReporting}
                  style={{ height:28, padding:'0 8px', borderRadius:6, border:`1px solid ${C.purple}40`, background:C.purpleDim, color:C.purple, fontSize:10.5, fontFamily:T.sans, fontWeight:600, cursor:'pointer', outline:'none', maxWidth:160 }}
                  title="Filtrar reporte IA por vacante"
                >
                  <option value="">General (todos)</option>
                  {vacantes.map(v => (
                    <option key={v.id} value={String(v.id)}>
                      {v.titulo}{v.area ? ` · ${v.area}` : ''}
                    </option>
                  ))}
                  <option value="otro">Lista de espera</option>
                </select>
                <IconBtn
                  onClick={doReporteIA}
                  icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L9.27 9.27 3 12l6.27 2.73L12 21l2.73-6.27L21 12l-6.27-2.73L12 3z"/></svg>}
                  label={iaReporting ? 'Generando…' : 'Reporte IA'}
                  bg={C.purpleDim} bgHover="rgba(139,92,246,0.16)"
                  color={C.purple} border={`1px solid ${C.purple}28`}
                  disabled={iaReporting}
                />
              </>)}
            </div>
          </div>

          {/* Filtros de estatus */}
          <div style={{ display:'flex', gap:4, marginBottom:12, flexWrap:'wrap', alignItems:'center' }}>
            <button onClick={() => setFilter('todos')}
              style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'5px 12px', borderRadius:20, fontSize:11, fontWeight: filter==='todos' ? 600 : 500, cursor:'pointer', fontFamily:T.sans, background: filter==='todos' ? C.text : 'transparent', color: filter==='todos' ? C.bg : C.textDim, border:`1px solid ${filter==='todos' ? C.text : C.border}`, transition:'all 0.13s ease', letterSpacing:'-0.01em' }}>
              Todos {candidates.length > 0 && `(${candidates.length})`}
            </button>
            {Object.entries(STATUS_MAP).map(([key,{label, color}]) => {
              const active = filter === key;
              const count  = counts[key] || 0;
              return (
                <button key={key} onClick={() => setFilter(key)}
                  style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'5px 12px', borderRadius:20, fontSize:11, fontWeight: active ? 600 : 500, cursor:'pointer', fontFamily:T.sans, background: active ? C.text : 'transparent', color: active ? '#FFFFFF' : C.textDim, border:`1px solid ${active ? C.text : C.border}`, transition:'all 0.13s ease', letterSpacing:'-0.01em' }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background: active ? '#FFFFFF' : color, display:'inline-block', flexShrink:0, opacity: active ? 0.8 : 1 }}/>
                  {label}{count > 0 && ` (${count})`}
                </button>
              );
            })}
            {/* Lista de Espera */}
            {(() => {
              const active = filter === 'espera';
              return (
                <button onClick={() => setFilter('espera')}
                  style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'5px 12px', borderRadius:20, fontSize:11, fontWeight: active ? 600 : 500, cursor:'pointer', fontFamily:T.sans, background: active ? C.text : 'transparent', color: active ? '#FFFFFF' : C.textDim, border:`1px solid ${active ? C.text : C.border}`, transition:'all 0.13s ease', letterSpacing:'-0.01em' }}>
                  En Espera{countEspera > 0 && ` (${countEspera})`}
                </button>
              );
            })()}
            {/* Buscador */}
            <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, padding:'6px 11px', minWidth:200 }}>
              <span style={{ color:C.textDim, display:'flex', flexShrink:0 }}>{Ic.search}</span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar nombre, puesto, estado…"
                style={{ background:'transparent', border:'none', color:C.text, fontSize:11, fontFamily:T.sans, outline:'none', width:'100%', minWidth:0 }}
                onFocus={e => e.target.parentElement.style.borderColor = C.orange+'48'}
                onBlur={e  => e.target.parentElement.style.borderColor = C.border}
              />
              {search && <button onClick={() => setSearch('')} style={{ background:'none', border:'none', color:C.textDim, cursor:'pointer', display:'flex', padding:0 }}>{Ic.close}</button>}
            </div>
          </div>

          {/* Tarjetas */}
          {!filtered.length ? (
            <div style={{ textAlign:'center', padding:'50px 0', color:C.textDim, fontFamily:T.sans, fontSize:12 }}>
              <div style={{ marginBottom:8 }}>{Ic.search}</div>
              {candidates.length === 0 ? 'Sin candidatos. Se registran automáticamente desde el chatbot.' : 'Sin resultados para el filtro seleccionado.'}
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              {[...filtered].sort((a,b) => {
                const order = {nuevo:0,visto:1,contactado:2,contratado:3,descartado:4};
                const sa = order[getStatus(a)]??1, sb = order[getStatus(b)]??1;
                if (sa!==sb) return sa-sb;
                return (b.id||0)-(a.id||0);
              }).map(c => (
              <CandidateCard key={c.id} candidate={c}
  onStatusChange={handleStatusChange} onDelete={handleDelete}
  onRequestDelete={setDeleteTarget}
  expanded={expanded === c.id} onToggle={() => setExpanded(expanded === c.id ? null : c.id)}
  isNew={newIds.has(c.id)} canDelete={canDelete}
/>
              ))}
            </div>
          )}
        </div>
{/* ── MODAL ELIMINAR CANDIDATO ── */}
{deleteTarget && createPortal(
  <div style={{
    position:'fixed', inset:0, zIndex:99999999,
    background:'rgba(6,5,4,0.75)',
    backdropFilter:'blur(16px)',
    display:'flex', alignItems:'center', justifyContent:'center',
    padding:16, animation:'fadeIn 0.18s ease',
  }}>
    <div style={{
      background: theme==='dark' ? C.surface2 : '#FFFFFF',
      border:`1px solid ${theme==='dark' ? C.border : '#E5E7EB'}`,
      borderRadius:14, width:'100%', maxWidth:400,
      overflow:'hidden', position:'relative',
      boxShadow: theme==='dark' ? '0 24px 64px rgba(0,0,0,0.70)' : '0 8px 40px rgba(0,0,0,0.10)',
      animation:'newCardIn 0.22s cubic-bezier(0.16,1,0.3,1) both',
    }}>
      {/* Barra roja top */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2.5, background:'linear-gradient(90deg,#DC2626,#EF4444,transparent)' }}/>

      {/* Header */}
      <div style={{ padding:'24px 24px 16px', display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:40, height:40, borderRadius:10, background: theme==='dark' ? 'rgba(220,38,38,0.12)' : 'rgba(220,38,38,0.07)', border:`1px solid ${theme==='dark' ? 'rgba(220,38,38,0.25)' : 'rgba(220,38,38,0.20)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          {Ic.trash}
        </div>
        <div>
          <p style={{ fontWeight:700, fontSize:15, margin:'0 0 3px', color: theme==='dark' ? C.text : '#111827', letterSpacing:'-0.02em' }}>Eliminar candidato</p>
          <p style={{ fontSize:11, margin:0, color: theme==='dark' ? C.textDim : '#9CA3AF' }}>Esta acción no se puede deshacer</p>
        </div>
      </div>

      {/* Chip candidato */}
      <div style={{ padding:'0 24px 16px' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 12px', borderRadius:9, background: theme==='dark' ? C.surface3 : '#F8F9FB', border:`1px solid ${theme==='dark' ? C.border : '#E5E7EB'}` }}>
          <AvatarIcon nombre={deleteTarget.nombre} size={28} statusColor={C.orange}/>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color: theme==='dark' ? C.text : '#374151', fontFamily:T.sans }}>{deleteTarget.nombre}</div>
            <div style={{ fontSize:10, color: theme==='dark' ? C.textDim : '#9CA3AF', marginTop:1, fontFamily:T.sans }}>{deleteTarget.puesto || 'Candidato · Reclutamiento'}</div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height:1, background: theme==='dark' ? C.border2 : '#F3F4F6', margin:'0 24px' }}/>

      {/* Descripción */}
      <div style={{ padding:'14px 24px' }}>
        <p style={{ fontSize:13, lineHeight:1.65, margin:0, color: theme==='dark' ? C.textSub : '#6B7280', fontFamily:T.sans }}>
          Se eliminará permanentemente el perfil, historial y documentos.
          Esta operación <strong style={{ color: theme==='dark' ? C.text : '#374151' }}>no puede revertirse</strong>.
        </p>
      </div>

      {/* Botones */}
      <div style={{ padding:'12px 24px 20px', display:'flex', gap:8 }}>
        <button onClick={() => setDeleteTarget(null)} disabled={deleting}
          style={{ flex:1, padding:'10px 0', borderRadius:9, fontSize:12, fontWeight:500, cursor:'pointer', fontFamily:T.sans, background:'transparent', border:`1px solid ${theme==='dark' ? C.border : '#E5E7EB'}`, color: theme==='dark' ? C.textSub : '#6B7280', transition:'all 0.13s ease' }}>
          Cancelar
        </button>
        <button onClick={confirmDelete} disabled={deleting}
          style={{ flex:1, padding:'10px 0', borderRadius:9, fontSize:12, fontWeight:700, cursor: deleting ? 'not-allowed' : 'pointer', fontFamily:T.sans, border:'none', color:'#fff', background: deleting ? '#9CA3AF' : '#DC2626', boxShadow: deleting ? 'none' : '0 4px 14px rgba(220,38,38,0.30)', display:'flex', alignItems:'center', justifyContent:'center', gap:7, transition:'all 0.13s ease' }}>
          {deleting
            ? <><div style={{ width:12,height:12,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',animation:'spin 0.65s linear infinite' }}/>Eliminando…</>
            : <>{Ic.trash} Eliminar</>}
        </button>
      </div>
    </div>
  </div>,
  document.body
)}
        {/* Footer info */}
        <div style={{ padding:'10px 14px', borderRadius:9, background:C.surface2, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ color:C.textDim, display:'flex', flexShrink:0 }}>{Ic.info}</span>
          <span style={{ color:C.textDim, fontSize:10, fontFamily:T.sans, lineHeight:1.6 }}>
            Candidatos registrados automáticamente por el chatbot · Actualización cada <strong style={{ color:C.textSub }}>20 seg</strong>
            {candidates.length > 0 && <> · <strong style={{ color:C.textSub }}>Perfil</strong> = PDF individual · <strong style={{ color:C.textSub }}>Excel/CSV</strong> = exportar todo</>}
          </span>
        </div>
        
      </div>
    </CCtx.Provider>
  );
}
