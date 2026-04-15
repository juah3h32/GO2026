// src/components/BotGO.jsx
import React, { useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react';
import './BotGO.css';
import { translations } from '../i18n';

// ✅ FIX: ReactMarkdown cargado de forma lazy
const ReactMarkdown = lazy(() => import('react-markdown'));

const INTENT_COMPRA_REGEX = [
  /\bcompr[a-z]{2,}/, /coti[a-z]{0,6}/, /preci[a-z]{0,3}/, /cuant[a-z]{0,2}/,
  /cost[a-z]{0,3}/, /presup[a-z]{0,6}/, /adquir[a-z]{0,4}/, /dispon[a-z]{0,8}/,
  /pedid[a-z]{0,2}/, /orden[a-z]{0,2}/,
];
const INTENT_COMPRA_FRASES = [
  'hay stock', 'tienen stock', 'hay disponible', 'como compro', 'donde compro',
  'voy a comprar', 'quiero comprar', 'necesito comprar',
];

// Palabras que indican contexto de empleo — nunca deben activar intención de compra
const INTENT_EMPLEO_REGEX = /postular|vacante|empleo|trabajo|solicitud.*empleo|quiero trabajar|aplicar.*puesto|registro.*empleo|puesto de/i;

function fmtSalario(raw) {
  if (!raw) return null;
  let str = raw.trim().replace(/\b(\d{4,})\b/g, n => Number(n).toLocaleString('es-MX'));
  if (!str.includes('$') && /^\d/.test(str)) str = `$${str}`;
  return str;
}
const INTENT_PDF_KEYS = [
  'pdf', 'catalogo', 'ficha tecnica', 'ficha del producto', 'descargar', 'descarga',
  'brochure', 'folleto', 'informacion del producto', 'mas informacion',
  'especificaciones', 'hoja tecnica',
];
const PRODUCTOS_LISTA = [
  'stretch film', 'pelicula stretch', 'película stretch', 'stretch', 'empaque flexible',
  'empaque', 'esquineros', 'esquinero', 'cuerdas', 'cuerda', 'arpillas', 'arpilla',
  'malla', 'sacos', 'saco', 'rafia', 'flexible',
];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const RobotIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="headGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FB670B" /><stop offset="100%" stopColor="#FB670B" />
      </linearGradient>
    </defs>
    <line x1="20" y1="35" x2="15" y2="20" stroke="#FB670B" strokeWidth="4" strokeLinecap="round" />
    <circle cx="15" cy="20" r="4" fill="#FB670B" />
    <line x1="80" y1="35" x2="85" y2="20" stroke="#FB670B" strokeWidth="4" strokeLinecap="round" />
    <circle cx="85" cy="20" r="4" fill="#FB670B" />
    <circle cx="50" cy="55" r="40" fill="url(#headGrad)" />
    <ellipse cx="50" cy="58" rx="32" ry="30" fill="#FFF5E6" />
    <rect x="25" y="45" width="50" height="22" rx="10" fill="#FB670B" />
    <circle cx="38" cy="56" r="5" fill="#FFD700" />
    <circle cx="62" cy="56" r="5" fill="#FFD700" />
    <ellipse cx="50" cy="78" rx="6" ry="2" fill="#D35400" opacity="0.8" />
  </svg>
);
const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const MicIcon = ({ isListening, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={isListening ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isListening ? 'pulse-animation' : ''}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);
const BackArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const KeyboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <line x1="6" y1="8" x2="6" y2="8" /><line x1="10" y1="8" x2="10" y2="8" />
    <line x1="14" y1="8" x2="14" y2="8" /><line x1="18" y1="8" x2="18" y2="8" />
    <line x1="6" y1="12" x2="6" y2="12" /><line x1="10" y1="12" x2="10" y2="12" />
    <line x1="14" y1="12" x2="14" y2="12" /><line x1="18" y1="12" x2="18" y2="18" />
    <line x1="6" y1="16" x2="11" y2="16" /><line x1="15" y1="16" x2="18" y2="16" />
  </svg>
);
const CloseIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);
const PdfIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const AttachIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const SuccessIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const VacanteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 00-8 0v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const PencilIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
const CartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2A19.86 19.86 0 013.1 5.18 2 2 0 015.09 3h3a2 2 0 012 1.72 12.07 12.07 0 00.7 2.81 2 2 0 01-.45 2.11L9.1 10.91a16 16 0 006.99 6.99l1.27-1.27a2 2 0 012.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const FileIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);
const StoreIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const ICON_BY_KEYWORD = {
  vacan: VacanteIcon, inform: InfoIcon, produc: InfoIcon,
  pedido: CartIcon, orden: CartIcon, contac: PhoneIcon,
  atencion: PhoneIcon, catalog: FileIcon, descar: FileIcon, ficha: FileIcon,
};

function getIconForItem(item) {
  const key = `${item.text} ${item.bold}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [kw, Icon] of Object.entries(ICON_BY_KEYWORD)) {
    if (key.includes(kw)) return Icon;
  }
  return FileIcon;
}

// ─── PDF MAP ──────────────────────────────────────────────────────────────────
const PDF_MAP = {
  rafia:      { label: 'Catálogo Rafia',           url: 'https://drive.google.com/file/d/1uAiR4uxO2iX_LsNFul6kXeb7jnnCEV_J/view' },
  stretch:    { label: 'Catálogo Stretch Film',    url: 'https://drive.google.com/file/d/1HYGcpgkRO_7OX22IcWvRpzpLZKgpYV3A/view' },
  cuerda:     { label: 'Catálogo Cuerdas',         url: 'https://drive.google.com/file/d/14GrV9P1ViQKvFp3BucYjgmryRgWKLEZh/view' },
  cuerdas:    { label: 'Catálogo Cuerdas',         url: 'https://drive.google.com/file/d/14GrV9P1ViQKvFp3BucYjgmryRgWKLEZh/view' },
  saco:       { label: 'Catálogo Sacos',           url: 'https://drive.google.com/file/d/16S43-PUrQECO9q2J1fOgbN-YeIxQ2GhP/view' },
  sacos:      { label: 'Catálogo Sacos',           url: 'https://drive.google.com/file/d/16S43-PUrQECO9q2J1fOgbN-YeIxQ2GhP/view' },
  arpilla:    { label: 'Catálogo Arpillas',        url: 'https://drive.google.com/file/d/1OQKGpnRCfA2yFdAlT6q7GczYua2FFFVU/view' },
  arpillas:   { label: 'Catálogo Arpillas',        url: 'https://drive.google.com/file/d/1OQKGpnRCfA2yFdAlT6q7GczYua2FFFVU/view' },
  malla:      { label: 'Catálogo Arpillas',        url: 'https://drive.google.com/file/d/1OQKGpnRCfA2yFdAlT6q7GczYua2FFFVU/view' },
  esquinero:  { label: 'Catálogo Esquineros',      url: 'https://drive.google.com/file/d/181Hvr0HQffLU3rmcXkccYoqj-Y_A-gxr/view' },
  esquineros: { label: 'Catálogo Esquineros',      url: 'https://drive.google.com/file/d/181Hvr0HQffLU3rmcXkccYoqj-Y_A-gxr/view' },
  flexible:   { label: 'Catálogo Empaque Flexible', url: 'https://drive.google.com/file/d/1TGxUcGHjW1NHF8K8YkRisbRE8uAuTnPO/view' },
  empaque:    { label: 'Catálogo Empaque Flexible', url: 'https://drive.google.com/file/d/1TGxUcGHjW1NHF8K8YkRisbRE8uAuTnPO/view' },
  general:    { label: 'Catálogo General',         url: 'https://drive.google.com/file/d/1348E3b37R1KmpggjAURhsuQMfARyBaXB/view' },
};

function detectarProducto(texto) {
  if (!texto) return null;
  const lower = texto.toLowerCase();
  for (const p of PRODUCTOS_LISTA) {
    if (lower.includes(p)) return p;
  }
  return null;
}

function esIntencionCompra(texto, historial = []) {
  if (!texto) return false;
  // Si el mensaje actual habla de empleo/vacante → nunca es intención de compra
  if (INTENT_EMPLEO_REGEX.test(texto)) return false;
  // Si el historial reciente contiene mensajes de empleo → no activar compra
  const historialReciente = historial.slice(-6).map(m => m.content || '').join(' ');
  if (INTENT_EMPLEO_REGEX.test(historialReciente)) return false;
  const u = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (INTENT_COMPRA_REGEX.some(r => r.test(u))) return true;
  if (INTENT_COMPRA_FRASES.some(k => u.includes(k))) return true;
  const tieneProducto = detectarProducto(texto) !== null;
  if ((u.includes('quiero') || u.includes('necesito')) && tieneProducto) return true;
  return false;
}

function esSolicitudPDF(texto) {
  if (!texto) return false;
  const u = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return INTENT_PDF_KEYS.some(k => u.includes(k));
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ✅ FIX CLAVE: Esta función ahora atrapa "Quiero postularme a la vacante de X" y guarda el puesto en memoria automáticamente
function extraerDatosDeHistorial(msgs) {
  const data = { nombre: '', puesto: '', edad: '', estado: '', colonia: '', email: '', telefono: '' };
  
  // 1. Detección automática del puesto desde el mensaje oculto del sistema
  for (const m of msgs) {
    if (m.role === 'user') {
      const match = (m.content || '').match(/postularme a la vacante de (.*)/i);
      if (match) data.puesto = match[1].trim();
    }
  }

  // 2. Detección por preguntas del bot (flujo normal)
  for (let i = 0; i < msgs.length - 1; i++) {
    const bot  = msgs[i];
    const user = msgs[i + 1];
    if (bot.role !== 'assistant' || user.role !== 'user') continue;
    
    const pregunta  = (bot.content  || '').toLowerCase();
    const respuesta = (user.content || '').trim();
    if (!respuesta || respuesta.length < 2) continue;

    if (/puesto|posici[oó]n|[aá]rea|trabajo.*interesa|tipo de puesto|aplicar a|qu[eé] puesto|a qu[eé] puesto|cu[aá]l.*puesto/i.test(pregunta) && !data.puesto) {
      data.puesto = respuesta;
    } else if (/nombre completo|c[oó]mo te llamas|tu nombre|cu[aá]l es tu nombre/i.test(pregunta) && !data.nombre) {
      if (!/^\d+$/.test(respuesta)) data.nombre = respuesta;
    } else if (/cu[aá]ntos a[nñ]os|a[nñ]os tienes|edad/i.test(pregunta) && !data.edad) {
      data.edad = respuesta;
    } else if (/estado.*rep[uú]blica|estado.*vives|qu[eé] estado|en qu[eé] estado/i.test(pregunta) && !data.estado) {
      data.estado = respuesta;
    } else if (/colonia|municipio|localidad/i.test(pregunta) && !data.colonia) {
      data.colonia = respuesta;
    } else if (/correo|email|e-mail|mail/i.test(pregunta) && !data.email) {
      const emailMatch = respuesta.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
      data.email = emailMatch ? emailMatch[0] : respuesta;
    } else if (/whatsapp|tel[eé]fono|n[uú]mero|celular/i.test(pregunta) && !data.telefono) {
      data.telefono = respuesta;
    }
  }
  return data;
}

// ─── RECRUITMENT PROGRESS ─────────────────────────────────────────────────────
const RpIcons = {
  puesto:  () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>,
  nombre:  () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  edad:    () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  estado:  () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>,
  colonia: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  email:   () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
  tel:     () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.86 19.86 0 013.1 5.18 2 2 0 015.09 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.1 10.91a16 16 0 006.99 6.99l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>,
  cv:      () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
};

const RECRUIT_STEPS = [
  { key: 'puesto',      label: 'Puesto',  Icon: RpIcons.puesto,  regex: /puesto|posici[oó]n|aplicar a|qu[eé] puesto/i },
  { key: 'nombre',      label: 'Nombre',  Icon: RpIcons.nombre,  regex: /nombre completo|c[oó]mo te llamas/i },
  { key: 'edad',        label: 'Edad',    Icon: RpIcons.edad,    regex: /cu[aá]ntos a[nñ]os|a[nñ]os tienes|edad/i },
  { key: 'estado',      label: 'Estado',  Icon: RpIcons.estado,  regex: /estado.*rep[uú]blica|estado.*vives|qu[eé] estado/i },
  { key: 'colonia',     label: 'Col.',    Icon: RpIcons.colonia, regex: /colonia|municipio|localidad/i },
  { key: 'email',       label: 'Email',   Icon: RpIcons.email,   regex: /correo|email|e-mail/i },
  { key: 'tel',         label: 'Tel',     Icon: RpIcons.tel,     regex: /whatsapp|tel[eé]fono|n[uú]mero.*contact/i },
  { key: 'cv',          label: 'CV',      Icon: RpIcons.cv,      regex: /tienes.*cv|adjunta.*cv|cv.*disponible/i },
  { key: 'comentarios', label: 'Nota',    Icon: RpIcons.cv,      regex: /algo.*agregar|algo.*compartir|comentario|experiencia.*perfil/i },
];

function calcularPasoActual(messages) {
  let completed = 0;
  
  // Si el usuario ya mandó el mensaje de postulación directo, marcamos Puesto como completado (0 -> 1)
  const yaDijoPuesto = messages.some(m => m.role === 'user' && /postularme a la vacante/i.test(m.content));
  if (yaDijoPuesto) completed = 1;

  for (let i = 0; i < messages.length - 1; i++) {
    const bot  = messages[i];
    const user = messages[i + 1];
    if (bot.role !== 'assistant' || user.role !== 'user') continue;
    const pregunta  = (bot.content || '');
    const respuesta = (user.content || '').trim();
    if (!respuesta || respuesta.length < 1) continue;
    for (let s = 0; s < RECRUIT_STEPS.length; s++) {
      if (RECRUIT_STEPS[s].regex.test(pregunta)) {
        completed = Math.max(completed, s + 1);
      }
    }
  }
  return completed;
}

const RecruitmentProgress = ({ messages }) => {
  const completed = calcularPasoActual(messages);
  const pct = Math.round((completed / RECRUIT_STEPS.length) * 100);
  return (
    <div className="rp-wrapper">
      <div className="rp-header">
        <span className="rp-title">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',verticalAlign:'middle',marginRight:'5px',marginTop:'-2px'}}>
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            <line x1="12" y1="12" x2="12" y2="16"/>
            <line x1="10" y1="14" x2="14" y2="14"/>
          </svg>
          Solicitud de empleo
        </span>
        <span className="rp-badge">{pct}% completado</span>
      </div>
      <div className="rp-bar-track">
        <div className="rp-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="rp-steps">
        {RECRUIT_STEPS.map((step, i) => {
          const state = i < completed ? 'done' : i === completed ? 'active' : 'pending';
          return (
            <div key={step.key} className={`rp-step rp-step--${state}`}>
              <div className="rp-step-dot">
                {state === 'done'
                  ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  : <step.Icon />}
              </div>
              <span className="rp-step-label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── RENDERERS ────────────────────────────────────────────────────────────────
const MessageRenderer = ({ content, isAssistant }) => {
  if (!isAssistant) return <span>{content}</span>;
  const clean = (content || '')
    .replace(/\[ACCION:[^\]]+\]/gi, '')
    .replace(/👉\s*https?:\/\/\S+/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return (
    <Suspense fallback={<span>{clean}</span>}>
      <ReactMarkdown components={{
        p:      ({ children }) => <p className="msg-p">{children}</p>,
        strong: ({ children }) => <strong className="msg-strong">{children}</strong>,
        ul:     ({ children }) => <ul className="msg-ul">{children}</ul>,
        ol:     ({ children }) => <ol className="msg-ol">{children}</ol>,
        li:     ({ children }) => <li className="msg-li">{children}</li>,
        a:      ({ children }) => <span className="msg-link-stripped">{children}</span>,
      }}>
        {clean}
      </ReactMarkdown>
    </Suspense>
  );
};

const MessageActions = ({ waLink, pdfData, distLink, t }) => {
  if (!waLink && !pdfData && !distLink) return null;
  return (
    <div className="msg-actions">
      {waLink    && <a href={waLink}      target="_blank" rel="noopener noreferrer" className="msg-action-btn msg-action-wa"><WhatsAppIcon /><span>{t?.salesBtn || 'Cotizar por WhatsApp'}</span></a>}
      {pdfData   && <a href={pdfData.url} target="_blank" rel="noopener noreferrer" className="msg-action-btn msg-action-pdf"><PdfIcon /><span>{t?.pdfBtn || 'Ver catálogo PDF'}</span></a>}
   {distLink && (
  <a 
    href={distLink} 
    className="msg-action-btn msg-action-dist"
    data-astro-reload="true"
    onClick={(e) => {
      // Opcional: si ya estás en la ruta de distribuidor, haz scroll suave
      if (window.location.pathname.includes('/distribuidor')) {
        e.preventDefault();
        document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' });
      }
    }}
  >
    <StoreIcon /><span>Registrarme como Distribuidor</span>
  </a>
)}
    </div>
  );
};

// ─── QUICK REPLY ICONS ───────────────────────────────────────────────────────
const QR_ICONS = {
  'Sí, tengo CV':     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" /></svg>,
  'No tengo CV':      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>,
  'Producción':       () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
  'Logística':        () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
  'Ventas':           () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
  'Técnico':          () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>,
  'Ay. Gral.':        () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>,
  'Otro puesto':      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  'Michoacán':        () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>,
  'Ciudad de México': () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>,
  'Jalisco':          () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>,
  'Nuevo León':       () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>,
  'Guanajuato':       () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>,
  'Otro estado':      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
};

// ─── QUICK REPLIES ────────────────────────────────────────────────────────────
const QuickReplies = ({ options, type, onSelect, disabled }) => {
  const [selected, setSelected] = useState(null);
  const isGrid = type === 'puesto' || type === 'estado';

  const handleClick = (opt) => {
    if (disabled || selected) return;
    setSelected(opt.value);
    onSelect(opt);
  };

  // ── Tarjetas blancas de vacantes reales ──────────────────────────────────────
  if (type === 'vacante') {
    const cards  = options.filter(o => o.action !== 'input');
    const otroPuesto = options.find(o => o.action === 'input');
    return (
      <div className="vacpanel" style={{ marginTop: 6 }}>
        <div className="vacpanel-hdr">
          <div className="vacpanel-hdr-left">
            <span className="vacpanel-dot" />
            <span>Elige una vacante</span>
          </div>
        </div>
        <div className="vacpanel-list" style={{ marginBottom: otroPuesto ? 10 : 0 }}>
          {cards.map(opt => (
            <div
              key={opt.value}
              className={`vacpanel-card ${selected === opt.value ? 'vacpanel-card--selected' : ''} ${selected && selected !== opt.value ? 'vacpanel-card--faded' : ''}`}
              style={{ opacity: disabled ? 0.6 : 1 }}
            >
              <div className="vacpanel-card-body">
                {opt.area && <span className="vacpanel-card-area">{opt.area}</span>}
                <span className="vacpanel-card-title">{opt.label}</span>
                <div className="vacpanel-card-tags">
                  {fmtSalario(opt.salario) && <span className="vacpanel-tag">{fmtSalario(opt.salario)}</span>}
                  {opt.tipo && <span className="vacpanel-tag">{opt.tipo}</span>}
                </div>
              </div>
              <button
                className="vacpanel-card-btn"
                onClick={() => handleClick(opt)}
                disabled={disabled || !!selected}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Postularme
              </button>
            </div>
          ))}
        </div>
        {otroPuesto && (
          <button
            className="vacpanel-more"
            onClick={() => handleClick(otroPuesto)}
            disabled={disabled || !!selected}
            style={{ width: '100%', background: 'none', cursor: disabled || selected ? 'default' : 'pointer' }}
          >
            + Otro puesto
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`quick-replies-container ${isGrid ? 'quick-replies-grid' : ''}`}>
      {options.map((opt, i) => {
        const Icon = QR_ICONS[opt.label];
        return (
          <button
            key={opt.value}
            className={`quick-reply-btn ${isGrid ? 'quick-reply-btn--grid' : ''} ${opt.action === 'input' ? 'quick-reply-btn--outline' : ''} ${selected === opt.value ? 'selected' : ''} ${selected && selected !== opt.value ? 'faded' : ''}`}
            onClick={() => handleClick(opt)}
            disabled={disabled || !!selected}
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            {Icon && <span className="qr-icon"><Icon /></span>}
            <span className="qr-label">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ─── CV UPLOAD ────────────────────────────────────────────────────────────────
const CVUploadButton = ({ onFileSelect, cvSubido, uploading, t }) => {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = '';
  };

  const handleClick = () => { inputRef.current?.click(); };

  if (cvSubido) {
    return (
      <div className="cv-upload-success" title={cvSubido.nombre}>
        <CheckCircleIcon />
        <span className="cv-upload-filename">{cvSubido.nombre}</span>
        <span className="cv-upload-size">{formatFileSize(cvSubido.tamaño)}</span>
      </div>
    );
  }
  if (uploading) {
    return (
      <div className="cv-upload-zone">
        <span className="msg-action-btn msg-action-cv" style={{ opacity: 0.65, cursor: 'wait' }}>
          <AttachIcon /><span>{t?.cvUploading || 'Subiendo CV...'}</span>
        </span>
      </div>
    );
  }
  return (
    <div className="cv-upload-zone">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      <button
        type="button"
        className="msg-action-btn msg-action-cv"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        <AttachIcon />
        <span>{t?.cvBtn || 'Adjuntar CV (PDF, DOC, imagen)'}</span>
      </button>
      <p className="cv-upload-hint">{t?.cvHint || 'Máx. 5MB · PDF, DOC, DOCX, JPG, PNG'}</p>
    </div>
  );
};

// ─── PRE-REGISTRO REVIEW (revisar antes de confirmar) ────────────────────────
const PreRegistroReview = ({ candidato, t, onConfirmar }) => {
  const [visible, setVisible] = useState(false);
  const [campos, setCampos] = useState({
    nombre:   candidato?.nombre   || '',
    puesto:   (candidato?.puesto  || '').replace(/^postúlate a nue.*$/i, '').trim() || (candidato?.puesto || ''),
    edad:     candidato?.edad     || '',
    estado:   candidato?.estado   || '',
    colonia:  candidato?.colonia  || '',
    email:    candidato?.email    || '',
    telefono: candidato?.telefono || '',
  });
  const [editando,    setEditando]    = useState(null);
  const [valorEdit,   setValorEdit]   = useState('');
  const [savedKey,    setSavedKey]    = useState(null);
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(timer);
  }, []);

  const LABELS = {
    nombre: 'Nombre', puesto: 'Puesto', edad: 'Edad',
    estado: 'Estado', colonia: 'Municipio',
    email: 'Correo', telefono: 'WhatsApp / Tel.',
  };

  const handleEdit   = (key) => { setEditando(key); setValorEdit(campos[key]); };
  const handleCancel = ()    => { setEditando(null); setValorEdit(''); };

  // Solo actualiza estado local — el guardado en DB ocurre al confirmar
  const handleSave = (key) => {
    const nuevo = valorEdit.trim();
    if (!nuevo || nuevo === campos[key]) { handleCancel(); return; }
    setCampos(prev => ({ ...prev, [key]: nuevo }));
    setSavedKey(key);
    setTimeout(() => setSavedKey(null), 2000);
    setEditando(null);
    setValorEdit('');
  };

  const handleConfirmar = async () => {
    setConfirmando(true);
    await new Promise(r => setTimeout(r, 300));
    onConfirmar({ ...candidato, ...campos });
  };

  const fieldOrder   = ['nombre', 'puesto', 'edad', 'estado', 'colonia', 'email', 'telefono'];
  const fieldsToShow = fieldOrder.filter(k => campos[k]);

  return (
    <div className={`pre-registro-review ${visible ? 'pre-registro-visible' : ''}`} role="status" aria-live="polite">
      <div className="pre-registro-header">
        <div className="pre-registro-icon">
          <PencilIcon size={18} />
        </div>
        <div className="pre-registro-titles">
          <p className="pre-registro-title">Revisa tus datos antes de confirmar</p>
          <p className="pre-registro-subtitle">Toca el lápiz para corregir cualquier campo.</p>
        </div>
      </div>

      <div className="pre-registro-fields">
        {fieldsToShow.map(key => {
          const isEditing = editando === key;
          const wasSaved  = savedKey  === key;
          return (
            <div key={key} className="pre-registro-row">
              <span className="pre-registro-label">{LABELS[key]}</span>
              {isEditing ? (
                <div className="conf-edit-group">
                  <input
                    className="conf-edit-input pre-registro-input"
                    value={valorEdit}
                    onChange={e => setValorEdit(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter')  handleSave(key);
                      if (e.key === 'Escape') handleCancel();
                    }}
                    autoFocus
                  />
                  <button className="conf-edit-ok pre-registro-ok" onClick={() => handleSave(key)}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </button>
                  <button className="conf-edit-x" onClick={handleCancel}>
                    <CloseIcon size={11} />
                  </button>
                </div>
              ) : (
                <div className="conf-value-wrap">
                  <span className={`pre-registro-value${wasSaved ? ' conf-saved-flash' : ''}`}>{campos[key]}</span>
                  <button className="conf-pencil-btn pre-registro-pencil" onClick={() => handleEdit(key)} title={`Editar ${LABELS[key]}`}>
                    <PencilIcon size={12} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        className={`pre-registro-confirm-btn${confirmando ? ' pre-registro-confirm-btn--loading' : ''}`}
        onClick={handleConfirmar}
        disabled={confirmando || !!editando}
      >
        {confirmando ? (
          <><span className="pre-registro-spinner" />Enviando...</>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Confirmar y enviar solicitud
          </>
        )}
      </button>
    </div>
  );
};

// ─── RECRUITMENT CONFIRMATION ─────────────────────────────────────────────────
const RecruitmentConfirmation = ({ candidato, t }) => {
  const [visible, setVisible] = useState(false);
  const [campos, setCampos] = useState({
    nombre:   candidato?.nombre   || '',
    puesto:   (candidato?.puesto  || '').replace(/^postúlate a nue.*$/i, '').trim() || (candidato?.puesto || ''),
    edad:     candidato?.edad     || '',
    estado:   candidato?.estado   || '',
    colonia:  candidato?.colonia  || '',
    email:    candidato?.email    || '',
    telefono: candidato?.telefono || '',
  });
  const [editando,  setEditando]  = useState(null);
  const [valorEdit, setValorEdit] = useState('');
  const [saving,    setSaving]    = useState(false);
  const [savedKey,  setSavedKey]  = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(timer);
  }, []);

  const LABELS = {
    nombre: 'Nombre', puesto: 'Puesto', edad: 'Edad',
    estado: 'Estado', colonia: 'Municipio',
    email: 'Correo', telefono: 'WhatsApp / Tel.',
  };

  const handleEdit = (key) => { setEditando(key); setValorEdit(campos[key]); };
  const handleCancel = () => { setEditando(null); setValorEdit(''); };

  const handleSave = async (key) => {
    const nuevo = valorEdit.trim();
    if (!nuevo || nuevo === campos[key]) { handleCancel(); return; }
    setSaving(true);
    try {
      await fetch('/api/recruitment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateLead', id: candidato.id, campo: key, valor: nuevo }),
      });
      setCampos(prev => ({ ...prev, [key]: nuevo }));
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 2000);
    } catch { /* el dato se actualiza localmente de todas formas */ }
    setSaving(false);
    setEditando(null);
    setValorEdit('');
  };

  const fieldOrder = ['nombre', 'puesto', 'edad', 'estado', 'colonia', 'email', 'telefono'];
  const fieldsToShow = fieldOrder.filter(k => campos[k]);

  return (
    <div className={`recruitment-confirmation ${visible ? 'confirmation-visible' : ''}`} role="status" aria-live="polite">
      <div className="confirmation-icon-wrapper">
        <div className="confirmation-icon-circle"><SuccessIcon /></div>
        <div className="confirmation-icon-ring" />
      </div>
      <div className="confirmation-body">
        <p className="confirmation-title">{t?.confirmTitle || '¡Solicitud registrada con éxito!'}</p>
        <p className="confirmation-subtitle">{t?.confirmSubtitle || 'Nuestro equipo de RH se pondrá en contacto contigo pronto.'}</p>

        <div className="confirmation-badge">
          {candidato?.id && (
            <div className="confirmation-badge-row">
              <span className="confirmation-badge-label">Folio</span>
              <span className="confirmation-badge-value confirmation-folio">#{String(candidato.id).padStart(5, '0')}</span>
            </div>
          )}

          {fieldsToShow.length > 0 && (
            <p className="conf-edit-hint">
              ¿Algo está mal?&nbsp;Toca&nbsp;
              <span className="conf-edit-hint-icon"><PencilIcon size={10} /></span>
              &nbsp;para corregirlo.
            </p>
          )}

          {fieldsToShow.map(key => {
            const isEditing = editando === key;
            const wasSaved  = savedKey  === key;
            return (
              <div key={key} className="confirmation-badge-row conf-editable-row">
                <span className="confirmation-badge-label">{LABELS[key]}</span>
                {isEditing ? (
                  <div className="conf-edit-group">
                    <input
                      className="conf-edit-input"
                      value={valorEdit}
                      onChange={e => setValorEdit(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter')  handleSave(key);
                        if (e.key === 'Escape') handleCancel();
                      }}
                      autoFocus
                    />
                    <button className="conf-edit-ok" onClick={() => handleSave(key)} disabled={saving}>
                      {saving
                        ? <span style={{ fontSize: 11, lineHeight: 1 }}>…</span>
                        : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      }
                    </button>
                    <button className="conf-edit-x" onClick={handleCancel}>
                      <CloseIcon size={11} />
                    </button>
                  </div>
                ) : (
                  <div className="conf-value-wrap">
                    <span className={`confirmation-badge-value${wasSaved ? ' conf-saved-flash' : ''}`}>
                      {campos[key]}
                    </span>
                    <button className="conf-pencil-btn" onClick={() => handleEdit(key)} title={`Editar ${LABELS[key]}`}>
                      <PencilIcon size={12} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── DUPLICATE NOTICE ─────────────────────────────────────────────────────────
const DuplicateNotice = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 6,
      background: 'rgba(251,103,11,0.08)', border: '1px solid rgba(251,103,11,0.25)',
      borderRadius: 10, padding: '10px 13px',
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(6px)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
    }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#FB670B', marginBottom: 2 }}>Solicitud ya registrada</div>
        <div style={{ fontSize: 11, color: 'rgba(236,235,224,0.65)', lineHeight: 1.5 }}>Ya tenemos tus datos en nuestro sistema. El equipo de RH te contactará pronto.</div>
      </div>
    </div>
  );
};

// ─── RECRUIT INFO NOTE ────────────────────────────────────────────────────────
const RinInfoIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#63B3ED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const RecruitInfoNote = () => {
  // phase: 'idle' → 'entering' → 'leaving' → 'pill' → 'reopening' → 'leaving' → 'pill' …
  const [phase, setPhase] = useState('idle');
  const t1 = useRef(null); const t2 = useRef(null); const t3 = useRef(null);

  const collapse = () => {
    clearTimeout(t2.current); clearTimeout(t3.current);
    setPhase('leaving');
    t3.current = setTimeout(() => setPhase('pill'), 380);
  };

  const expand = () => {
    setPhase('reopening');
    t2.current = setTimeout(() => collapse(), 5000);
  };

  useEffect(() => {
    t1.current = setTimeout(() => {
      setPhase('entering');
      t2.current = setTimeout(() => collapse(), 4500);
    }, 500);
    return () => { clearTimeout(t1.current); clearTimeout(t2.current); clearTimeout(t3.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === 'idle') return null;

  if (phase === 'pill') {
    return (
      <button className="rin-pill" onClick={expand} aria-label="Ver nota informativa">
        <RinInfoIcon />
        <span className="rin-pill-text">Podrás revisar tus datos al final</span>
      </button>
    );
  }

  const isLeaving = phase === 'leaving';
  return (
    <div className={`rin-note ${isLeaving ? 'rin-leaving' : 'rin-entering'}`}>
      <div className="rin-note-header">
        <span className="rin-note-label">
          <RinInfoIcon />
          Información
        </span>
        <button className="rin-note-close" onClick={collapse} aria-label="Cerrar">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <p className="rin-note-body">
        Al terminar podrás <strong>revisar y corregir</strong> tus datos antes de confirmar el envío.
      </p>
    </div>
  );
};

// ─── MOBILE PILL ──────────────────────────────────────────────────────────────
const MobilePill = ({ onOpen, t }) => {
  const [phase, setPhase] = useState('entering');
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('expanded'),   400);
    const t2 = setTimeout(() => setPhase('collapsing'), 3800);
    const t3 = setTimeout(() => setPhase('done'),       4300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  const handleClose = (e) => {
    e.stopPropagation();
    setPhase('collapsing');
    setTimeout(() => setPhase('done'), 700);
  };
  return (
    <div className={`botgo-pill-wrapper phase-${phase}`} onClick={onOpen} role="button" aria-label="Abrir asistente virtual BotGO">
      <div className="botgo-pill-icon">
        <RobotIcon className="botgo-btn-icon" />
        {phase === 'expanded' && <span className="botgo-notif-dot" aria-hidden="true" />}
      </div>
      <div className="botgo-pill-text">
        <span className="botgo-pill-label-small">{t?.pillLabelSmall || '¿En qué puedo'}</span>
        <span className="botgo-pill-label-big">{t?.pillLabelBig || 'AYUDARTE HOY?'}</span>
      </div>
      <button className="botgo-pill-close" onClick={handleClose} aria-label="Cerrar"><CloseIcon size={13} /></button>
    </div>
  );
};

// ─── DESKTOP TOOLTIP ─────────────────────────────────────────────────────────
const DesktopTooltip = ({ onOpen, onDismiss, t }) => {
  const [visible, setVisible]   = useState(true);
  const [exiting, setExiting]   = useState(false);
  const timerRef                = useRef(null);

  const dismiss = useCallback((open = false) => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      if (open) onOpen();
      else onDismiss();
    }, 300);
  }, [onOpen, onDismiss]);

  useEffect(() => {
    timerRef.current = setTimeout(() => dismiss(false), 12000);
    return () => clearTimeout(timerRef.current);
  }, [dismiss]);

  if (!visible) return null;
  const items = (t.tooltipItems || []).map((item) => ({
    icon: React.createElement(getIconForItem(item)),
    text: item.text,
    bold: item.bold,
  }));

  return (
    <div className={`botgo-tooltip ${exiting ? 'exiting' : ''}`} role="dialog" aria-label={`${t.tooltipTitle} ${t.tooltipAccent}`}>
      <div className="botgo-tooltip-header">
        <div className="botgo-tooltip-avatar"><RobotIcon className="botgo-tooltip-robot" /></div>
        <div className="botgo-tooltip-title">
          <span className="botgo-tooltip-title-main">{t.tooltipTitle || '¿En qué puedo'}</span>
          <span className="botgo-tooltip-title-accent">{t.tooltipAccent || 'ayudarte hoy?'}</span>
        </div>
        <button className="botgo-tooltip-close" onClick={() => dismiss(false)} aria-label="Cerrar notificación"><CloseIcon size={16} /></button>
      </div>
      <div className="botgo-tooltip-divider" />
      <ul className="botgo-tooltip-list">
        {items.map((item, i) => (
          <li key={i} className="botgo-tooltip-item" style={{ animationDelay: `${0.25 + i * 0.1}s` }}>
            <span className="botgo-tooltip-dot">{item.icon}</span>
            <span className="botgo-tooltip-text">{item.text} <strong>{item.bold}</strong></span>
          </li>
        ))}
      </ul>
      <button className="botgo-tooltip-cta" onClick={() => dismiss(true)}>{t.tooltipCta || '¡Iniciar chat ahora!'}</button>
      <div className="botgo-tooltip-arrow" />
    </div>
  );
};

// ─── MIC TOAST ────────────────────────────────────────────────────────────────
const MicToast = ({ message, onDismiss }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;
  return (
    <div
      role="alert"
      style={{
        position: 'absolute', bottom: '80px', left: '50%',
        transform: 'translateX(-50%)', background: 'rgba(30,30,30,0.92)',
        color: '#fff', borderRadius: '12px', padding: '10px 16px',
        fontSize: '13px', maxWidth: '88%', textAlign: 'center',
        zIndex: 9999, lineHeight: 1.4, boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        animation: 'fadeInUp 0.25s ease',
      }}
    >
      🎤 {message}
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function BotGO({ language = 'es' }) {
  const currentLangCode = translations[language] ? language : 'es';
  const t = translations[currentLangCode].chatbot;
  const isRTL = currentLangCode === 'ar';

  const [messages, setMessages] = useState([{
    role: 'assistant', content: t.greeting,
    waLink: null, pdfData: null, distLink: null, isDuplicate: false,
    showCVUpload: false, quickReplies: null, quickRepliesUsed: false,
  }]);

  // ✅ FIX CLAVE: Referencia de mensajes para evitar cierres obsoletos (Stale Closures)
  const messagesRef = useRef(messages);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  const [input,             setInput]             = useState('');
  const [loading,           setLoading]           = useState(false);
  const [isOpen,            setIsOpen]            = useState(false);
  const [viewMode,          setViewMode]          = useState('voice');
  const [isListening,       setIsListening]       = useState(false);
  const [lastVoiceResponse, setLastVoiceResponse] = useState(t.greeting);
  const [isBotSpeaking,     setIsBotSpeaking]     = useState(false);
  const [showTooltip,       setShowTooltip]       = useState(true);
  const [voiceActivated,    setVoiceActivated]    = useState(false);
  const [cvPendiente,       setCvPendiente]       = useState(null);
  const [cvSubido,          setCvSubido]          = useState(null);
  const [cvUploading,       setCvUploading]       = useState(false);
  const [mostrarSubirCV,    setMostrarSubirCV]    = useState(false);
  const [candidatoRegistrado,  setCandidatoRegistrado]  = useState(null);
  const [preRegistroPendiente, setPreRegistroPendiente] = useState(null);
  const [vacancyCards,         setVacancyCards]         = useState(null);
  const [mounted,    setMounted]    = useState(false);
  const [isMobile,   setIsMobile]   = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);
  const [micToast,   setMicToast]   = useState('');
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [pwaInstalled,          setPwaInstalled]          = useState(false);
  const installPromptRef = useRef(null); // ref para evitar clausuras desactualizadas

  const chatWindowRef        = useRef(null);
  const inputRef             = useRef(null);
  const messagesContainerRef = useRef(null);
  const voiceTextRef         = useRef('');
  const productoCtxRef       = useRef(null);
  const audioRef             = useRef(null);
  const messagesEndRef       = useRef(null);
  const recRef               = useRef(null);
  const abortedRef           = useRef(false);
  const waveCanvasRef        = useRef(null);
  const waveAnimRef          = useRef(null);
  const sessionIdRef         = useRef(`s_${Date.now()}_${Math.random().toString(36).slice(2,8)}`);
  const fetchAbortRef        = useRef(null); // cancela fetch anterior si llega uno nuevo
  const vacListRef           = useRef([]);   // vacantes activas cargadas (para quickReplies dinámicos)

  // Memoizado para que MicToast no reinicie su timer en cada render del padre
  const dismissMicToast = useCallback(() => setMicToast(''), []);

  const enFlujoReclutamiento = (() => {
    const hayReclutamiento = messages.some(m =>
      (m.role === 'assistant' || m.role === 'user') &&
      /vacante|empleo|puesto|reclutamiento|aplicar|solicitud.*empleo|trabajo/i.test(m.content || '')
    );
    if (!hayReclutamiento) return false;
    if (candidatoRegistrado) return false;
    const ultimos = messages.slice(-4);
    const salioDeFlujo = ultimos.some(m => {
      const txt = (m.content || '').toLowerCase();
      // No salir del flujo si el mensaje contiene contexto de empleo
      if (INTENT_EMPLEO_REGEX.test(m.content || '')) return false;
      return /catálogo|catalogo|rafia|stretch|saco|arpilla|cuerda|esquinero|empaque|cotiz|pdf|ficha técnica|ficha tecnica/i.test(txt);
    });
    if (salioDeFlujo) return false;
    return true;
  })();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    const path = window.location.pathname.replace(/\/$/, '');
    const home = ['', '/', '/es', '/en', '/index', '/home'].includes(path);
    checkMobile();
    setIsHomePage(home);
    setMounted(true);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ── Bloquear scroll del body en móvil cuando el bot está abierto ─────────────
  useEffect(() => {
    if (!isMobile) return;
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow   = 'hidden';
      document.body.style.position   = 'fixed';
      document.body.style.top        = `-${scrollY}px`;
      document.body.style.width      = '100%';
      document.body.dataset.scrollY  = scrollY;
    } else {
      const savedY = parseInt(document.body.dataset.scrollY || '0', 10);
      document.body.style.overflow   = '';
      document.body.style.position   = '';
      document.body.style.top        = '';
      document.body.style.width      = '';
      delete document.body.dataset.scrollY;
      window.scrollTo(0, savedY);
    }
    return () => {
      // Limpieza al desmontar: restaurar siempre
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top      = '';
      document.body.style.width    = '';
    };
  }, [isOpen, isMobile]);

  // ── PWA install prompt handling ───────────────────────────────────────────────
  useEffect(() => {
    // Check if already installed (standalone mode or flag set)
    const alreadyInstalled =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      localStorage.getItem('pwa-installed') === 'true';
    if (alreadyInstalled) { setPwaInstalled(true); return; }

    // El evento beforeinstallprompt puede dispararse antes de que React monte.
    // Lo capturamos en un script is:inline en <head> y lo leemos aquí.
    if (window.__pwaInstallPrompt) {
      installPromptRef.current = window.__pwaInstallPrompt;
      setDeferredInstallPrompt(window.__pwaInstallPrompt);
    }

    const handler = (e) => {
      e.preventDefault();
      window.__pwaInstallPrompt = e;
      installPromptRef.current = e;
      setDeferredInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const installedHandler = () => {
      setPwaInstalled(true);
      installPromptRef.current = null;
      setDeferredInstallPrompt(null);
      window.__pwaInstallPrompt = null;
      try { localStorage.setItem('pwa-installed', 'true'); } catch {}
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  // ── Cargar vacantes activas al montar (para quickReplies dinámicos) ──────────
  useEffect(() => {
    fetch('/api/vacantes')
      .then(r => r.json())
      .then(data => {
        if (data.ok) vacListRef.current = (data.vacantes || []).filter(v => v.activa);
      })
      .catch(() => {});
  }, []);

  // ── Trigger externo desde página de vacantes (Corregido con messagesRef) ──
  useEffect(() => {
    const handler = (e) => {
      const titulo = e.detail?.titulo || '';
      const esListaEspera = !!e.detail?.esListaEspera;
      setIsOpen(true);
      setViewMode('chat');
      if (window.history && window.history.pushState) {
        window.history.pushState({ botOpen: true }, '');
      }
      window.dispatchEvent(new Event('pwa:bot-open'));
      const resetConversacion = () => {
        setMessages([{
          role: 'assistant', content: t.greeting,
          waLink: null, pdfData: null, distLink: null, isDuplicate: false,
          showCVUpload: false, quickReplies: null, quickRepliesUsed: false,
        }]);
        setCandidatoRegistrado(null);
        setPreRegistroPendiente(null);
        setMostrarSubirCV(false);
        setCvSubido(null);
        setCvPendiente(null);
        setVacancyCards(null);
      };
      if (esListaEspera) {
        const sinPuesto = !!e.detail?.sinPuesto;
        resetConversacion();
        setTimeout(() => {
          const msg = sinPuesto
            ? 'Quiero registrarme en lista de espera. No encontré vacante para mi perfil en la lista actual, pero me interesa trabajar en Grupo Ortiz.'
            : 'Me interesa trabajar con Grupo Ortiz. No hay vacantes abiertas por ahora pero quiero dejar mis datos para que me contacten cuando se abra una oportunidad.';
          sendMessage(null, msg, false);
        }, 600);
      } else if (titulo) {
        // Resetear conversación al cambiar de vacante para que la barra de progreso empiece desde cero
        resetConversacion();
        setTimeout(() => {
          sendMessage(null, `Quiero postularme a la vacante de ${titulo}`, false);
        }, 600);
      } else {
        // Sin vacante específica: mostrar tarjetas en pantalla principal
        setViewMode('voice');
        setVacancyCards(false); // false = cargando; [] = sin resultados; [...] = con resultados
        fetch('/api/vacantes')
          .then(r => r.json())
          .then(data => {
            if (data.ok) {
              const activas = (data.vacantes || []).filter(v => v.activa);
              vacListRef.current = activas; // sincronizar ref para quickReplies
              setVacancyCards(activas.slice(0, 4));
            } else {
              setVacancyCards(null);
            }
          })
          .catch(() => setVacancyCards(null));
      }
    };
    window.addEventListener('botgo:open-vacancy', handler);
    return () => window.removeEventListener('botgo:open-vacancy', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (viewMode === 'chat' && messagesEndRef.current) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [messages, loading, viewMode]);

  useEffect(() => {
    if (isOpen && viewMode === 'chat' && window.innerWidth > 1024) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, viewMode]);

  // Cierre completo — solo para el botón X explícito
  const handleCloseChat = useCallback(() => {
    if (recRef.current) {
      abortedRef.current = true;
      try { recRef.current.abort(); } catch {}
      recRef.current = null;
    }
    setIsListening(false);
    setIsOpen(false);
    setViewMode('voice');
    setVoiceActivated(false);
    setMessages([{
      role: 'assistant', content: t.greeting,
      waLink: null, pdfData: null, distLink: null, isDuplicate: false,
      showCVUpload: false, quickReplies: null, quickRepliesUsed: false,
    }]);
    setCvSubido(null);
    setCvPendiente(null);
    setMostrarSubirCV(false);
    setCandidatoRegistrado(null);
    setPreRegistroPendiente(null);
    setVacancyCards(null);
    setLastVoiceResponse(t.greeting);
    productoCtxRef.current = null;
    inputRef.current?.blur();
    try { window.focus(); } catch {}
    window.dispatchEvent(new Event('pwa:bot-close'));
  }, [t.greeting]);

  // Confirmación del registro: guarda en DB y pasa a pantalla de éxito
  const handleConfirmarRegistro = useCallback(async (datos) => {
    const cvActual = cvSubido;
    try {
      const res = await fetch('/api/recruitment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action:        'save',
          nombre:        datos.nombre        || '',
          email:         datos.email         || '',
          telefono:      datos.telefono      || '',
          puesto:        datos.puesto        || '',
          edad:          datos.edad          || '',
          estado:        datos.estado        || '',
          colonia:       datos.colonia       || '',
          cvNombre:      cvActual?.nombre    || '',
          cvBase64:      cvActual?.base64    || '',
          cvTipo:        cvActual?.tipo      || '',
          comentarios:   datos.comentarios   || '',
          sessionId:     sessionIdRef.current,
          esListaEspera: datos.esListaEspera || false,
        }),
      });
      const result = await res.json();
      setCandidatoRegistrado({ ...datos, id: result.id || null });
    } catch {
      // Mostrar éxito de todas formas para no bloquear al usuario
      setCandidatoRegistrado({ ...datos, id: null });
    }
    setPreRegistroPendiente(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvSubido]);

  // Solo ocultar — preserva toda la conversación y estado de registro
  const handleHideChat = useCallback(() => {
    if (recRef.current) {
      abortedRef.current = true;
      try { recRef.current.abort(); } catch {}
      recRef.current = null;
    }
    setIsListening(false);
    setIsOpen(false);
    inputRef.current?.blur();
    window.dispatchEvent(new Event('pwa:bot-close'));
  }, []);

  // ── PWA install handler ───────────────────────────────────────────────────────
  const handleInstallPWA = useCallback(async () => {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isIOS) {
      setViewMode('chat');
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Para instalar la app en iPhone:\n\n1. Toca el ícono **Compartir** (⬆) en la barra de Safari\n2. Desplázate y toca **"Agregar a pantalla de inicio"**\n3. Toca **Agregar** — ¡listo!\n\nDespués ábrela desde tu pantalla de inicio.',
          waLink: null, pdfData: null, distLink: null, isDuplicate: false,
          showCVUpload: false, quickReplies: null, quickRepliesUsed: false,
        }]);
      }, 100);
      return;
    }

    // Leer siempre el ref (valor más reciente, nunca una clausura antigua)
    const prompt = installPromptRef.current || window.__pwaInstallPrompt || null;

    if (prompt) {
      try {
        await prompt.prompt();
        const { outcome } = await prompt.userChoice;
        if (outcome === 'accepted') {
          setPwaInstalled(true);
          installPromptRef.current = null;
          setDeferredInstallPrompt(null);
          window.__pwaInstallPrompt = null;
          try { localStorage.setItem('pwa-installed', 'true'); } catch {}
        }
      } catch {
        // El prompt ya fue usado; limpiar
        installPromptRef.current = null;
        setDeferredInstallPrompt(null);
        window.__pwaInstallPrompt = null;
      }
      return;
    }

    // Sin prompt disponible (ya rechazado por Chrome o navegador no compatible)
    setViewMode('chat');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Para instalar la app GO en tu celular:\n\n1. Toca los **3 puntos** (⋮) arriba a la derecha en Chrome\n2. Selecciona **"Instalar app"** o **"Agregar a pantalla de inicio"**\n3. Confirma tocando **Instalar**\n\nSi ya la instalaste antes, búscala en tu pantalla de inicio.',
        waLink: null, pdfData: null, distLink: null, isDuplicate: false,
        showCVUpload: false, quickReplies: null, quickRepliesUsed: false,
      }]);
    }, 100);
  }, []); // sin dependencias — usa ref, siempre tiene el valor actual

  const handleOpenChat = useCallback(() => {
    setShowTooltip(false);
    setIsOpen(true);
    // Push history entry para interceptar el botón atrás en móvil
    if (window.history && window.history.pushState) {
      window.history.pushState({ botOpen: true }, '');
    }
    window.dispatchEvent(new Event('pwa:bot-open'));
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key && e.key.toLowerCase() === 'f') {
        const tag = e.target.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && !e.target.isContentEditable) {
          e.preventDefault();
          setIsOpen(true);
        }
      }
    };
    // ESC solo oculta, no reinicia
    const onEsc = (e) => { if (e.key === 'Escape') handleHideChat(); };
    // Click fuera solo oculta, no reinicia
    const onOutside = (e) => {
      if (!isOpen) return;
      if (chatWindowRef.current && !chatWindowRef.current.contains(e.target)) {
        const btn = document.querySelector('.botgo-pill-wrapper, .botgo-button');
        if (btn && btn.contains(e.target)) return;
        handleHideChat();
      }
    };
    // Botón atrás en móvil: solo oculta si el estado de history era botOpen
    const onPopState = (e) => {
      if (isOpen) {
        handleHideChat();
        // Re-push el state para que el historial quede limpio si vuelven a abrir
      }
    };
    window.addEventListener('keydown', onKey);
    if (isOpen) {
      document.addEventListener('mousedown', onOutside);
      document.addEventListener('keydown', onEsc);
      window.addEventListener('popstate', onPopState);
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onEsc);
      window.removeEventListener('popstate', onPopState);
    };
  }, [isOpen, handleHideChat]);

  useEffect(() => {
    if (!isBotSpeaking) {
      if (waveAnimRef.current) { cancelAnimationFrame(waveAnimRef.current); waveAnimRef.current = null; }
      return;
    }
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;
    const WAVES = [
      { color: '#FB670B', amp: 26, freq: 0.013, speed: 0.022, phase: 0,    alpha: 0.65, yRatio: 0.42 },
      { color: '#FB670B', amp: 16, freq: 0.019, speed: 0.032, phase: 1.2, alpha: 0.30, yRatio: 0.50 },
      { color: '#C5C5C5', amp: 20, freq: 0.015, speed: 0.018, phase: 2.4, alpha: 0.28, yRatio: 0.46 },
      { color: '#535353', amp: 30, freq: 0.009, speed: 0.014, phase: 0.8, alpha: 0.38, yRatio: 0.54 },
      { color: '#C5C5C5', amp: 12, freq: 0.023, speed: 0.027, phase: 3.1, alpha: 0.18, yRatio: 0.38 },
      { color: '#FB670B', amp: 18, freq: 0.017, speed: 0.024, phase: 1.7, alpha: 0.22, yRatio: 0.58 },
    ];

    function resize() {
      const r = canvas.parentElement.getBoundingClientRect();
      canvas.width  = r.width;
      canvas.height = r.height;
    }
    function drawWave(w) {
      const cw = canvas.width, ch = canvas.height;
      const yBase = ch * w.yRatio;
      ctx.beginPath();
      ctx.moveTo(0, ch);
      for (let x = 0; x <= cw; x += 2) {
        const y = yBase
          + Math.sin(x * w.freq + t * w.speed + w.phase) * w.amp
          + Math.sin(x * w.freq * 0.55 + t * w.speed * 1.4 + w.phase + 1) * w.amp * 0.38;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(cw, ch); ctx.lineTo(0, ch); ctx.closePath();
      const hex = Math.round(w.alpha * 255).toString(16).padStart(2, '0');
      const grad = ctx.createLinearGradient(0, yBase - w.amp * 2, 0, ch);
      grad.addColorStop(0, w.color + hex);
      grad.addColorStop(1, w.color + '00');
      ctx.fillStyle = grad;
      ctx.fill();
    }
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      WAVES.forEach(drawWave);
      t++;
      waveAnimRef.current = requestAnimationFrame(animate);
    }
    resize();
    animate();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(waveAnimRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isBotSpeaking]);

  const handleQuickReply = async (opt, msgIdx) => {
    setMessages(prev => prev.map((m, i) => i === msgIdx ? { ...m, quickRepliesUsed: true } : m));
    if (opt.action === 'solicitar_cv') {
      setViewMode('chat');
      setMostrarSubirCV(true);
      await new Promise(r => setTimeout(r, 50));
      await sendMessage(null, 'Sí, tengo mi CV para adjuntar', false);
    } else if (opt.action === 'continuar') {
      setMostrarSubirCV(false);
      await sendMessage(null, 'No, no tengo CV en este momento', false);
    } else if (opt.action === 'text') {
      await sendMessage(null, opt.value, false);
    } else if (opt.action === 'input') {
      setInput('');
      if (window.innerWidth > 1024) {
        setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } else {
      await sendMessage(null, opt.label, false);
    }
  };

  const handleCVFileSelect = async (file) => {
    if (!file) return;
    const allowedTypes = [
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg', 'image/png',
    ];
    const MAX_CV_BYTES = 3 * 1024 * 1024; // 3 MB — límite que permite lectura IA
    const MB = (n) => (n / (1024 * 1024)).toFixed(1);

    if (!allowedTypes.includes(file.type)) {
      setViewMode('chat');
      setTimeout(() => setMessages(prev => [...prev, {
        role: 'assistant',
        content: `El archivo **${file.name}** no es un formato compatible.\n\nFormatos aceptados: **PDF, JPG, PNG**.\n\n_Los archivos DOC/DOCX no se pueden leer automáticamente — conviértelo a PDF antes de enviarlo._`,
        waLink: null, pdfData: null, distLink: null, isDuplicate: false,
        showCVUpload: false, quickReplies: null, quickRepliesUsed: false,
      }]), 100);
      return;
    }
    if (file.size > MAX_CV_BYTES) {
      setViewMode('chat');
      setTimeout(() => setMessages(prev => [...prev, {
        role: 'assistant',
        content: `El archivo **${file.name}** pesa **${MB(file.size)} MB** y supera el límite permitido de **3 MB**.\n\nPor favor comprime o reduce el archivo:\n• En iPhone: comparte la foto en tamaño "Mediano"\n• En Android: usa una app de compresión de PDF/imagen\n• En computadora: guarda el PDF con compresión o exporta la imagen en menor resolución`,
        waLink: null, pdfData: null, distLink: null, isDuplicate: false,
        showCVUpload: false, quickReplies: null, quickRepliesUsed: false,
      }]), 100);
      return;
    }
    setCvUploading(true);
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result.split(',')[1]);
        reader.onerror = () => reject(new Error('Error leyendo archivo'));
        reader.readAsDataURL(file);
      });
      const cvData = { nombre: file.name, tipo: file.type, base64, tamaño: file.size };
      try {
        const formData = new FormData();
        formData.append('cv', file);
        formData.append('sessionId', Date.now().toString());
        const res = await fetch('/api/recruitment', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          const finalCv = data.ok ? (data.cv || cvData) : cvData;
          setCvSubido(finalCv);
          setCvPendiente(finalCv);
        } else {
          setCvSubido(cvData);
          setCvPendiente(cvData);
        }
      } catch {
        setCvSubido(cvData);
        setCvPendiente(cvData);
      }
      setMostrarSubirCV(false);
      await sendMessage(null, t?.cvConfirmMsg || '📎 CV adjuntado correctamente.', false, cvData);
    } catch (err) {
      console.error('❌ CV upload error:', err);
      setMicToast('Ocurrió un error al procesar el archivo. Intenta de nuevo.');
    } finally {
      setCvUploading(false);
    }
  };

  const toggleListening = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsBotSpeaking(false);
    }
    if (isListening) {
      abortedRef.current = true;
      try { recRef.current?.stop(); } catch {}
      recRef.current = null;
      setIsListening(false);
      return;
    }
    if (typeof window === 'undefined') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMicToast('Tu navegador no soporta voz. Usa Chrome o Edge.');
      return;
    }
    if (recRef.current) {
      abortedRef.current = true;
      try { recRef.current.abort(); } catch {}
      recRef.current = null;
    }
    abortedRef.current   = false;
    voiceTextRef.current = '';
    setInput('');
    setVoiceActivated(true);
    const rec = new SR();
    recRef.current = rec;
    rec.lang            = t?.voiceCode || 'es-MX';
    rec.continuous      = false;
    rec.interimResults  = true;
    rec.maxAlternatives = 1;
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e) => {
      let finalText = '';
      let interimText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += transcript;
        else interimText += transcript;
      }
      const detected = finalText || interimText;
      if (detected) {
        setInput(detected);
        voiceTextRef.current = detected;
      }
    };
    rec.onerror = (e) => {
      console.warn('🎤 error:', e.error);
      setIsListening(false);
      recRef.current = null;
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        navigator.permissions?.query({ name: 'microphone' }).then(perm => {
          if (perm.state === 'granted') {
            setMicToast('Recarga la página (F5) e intenta de nuevo con el micrófono.');
          } else {
            const esMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
            setMicToast(esMobile
              ? 'Permite el micrófono: Ajustes > Apps > Chrome/Safari > Micrófono.'
              : 'Permite el micrófono: haz clic en 🔒 junto a la URL y actívalo.'
            );
          }
        }).catch(() => {
          setMicToast('Recarga la página e intenta de nuevo con el micrófono.');
        });
      } else if (e.error === 'network') {
        setMicToast('Error de red. Verifica tu conexión e intenta de nuevo.');
      } else if (e.error === 'audio-capture') {
        setMicToast('No se detectó micrófono. Verifica que esté conectado.');
      }
    };
    rec.onend = () => {
      setIsListening(false);
      recRef.current = null;
      if (abortedRef.current) {
        abortedRef.current = false;
        return;
      }
      const texto = voiceTextRef.current.trim();
      if (texto) setTimeout(() => sendMessage(null, texto, true), 300);
    };
    try {
      rec.start();
    } catch (err) {
      console.error('🎤 start error:', err);
      setIsListening(false);
      recRef.current = null;
    }
  };

  const playAudio = async (b64) => {
    if (!b64) return;
    if (audioRef.current) {
      audioRef.current.pause();
      URL.revokeObjectURL(audioRef.current._blobUrl || '');
      audioRef.current = null;
    }
    try {
      let src = b64;
      if (b64.startsWith('data:')) {
        const [meta, base64Data] = b64.split(',');
        const mimeType = meta.match(/:(.*?);/)?.[1] || 'audio/mpeg';
        const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: mimeType });
        src = URL.createObjectURL(blob);
      }
      const a = new Audio(src);
      a._blobUrl = src.startsWith('blob:') ? src : null;
      audioRef.current = a;
      a.onplay  = () => setIsBotSpeaking(true);
      a.onended = () => { setIsBotSpeaking(false); URL.revokeObjectURL(a._blobUrl || ''); };
      a.onpause = () => setIsBotSpeaking(false);
      a.onerror = () => { setIsBotSpeaking(false); URL.revokeObjectURL(a._blobUrl || ''); };
      await a.play();
    } catch (err) {
      console.warn('🔊 playAudio error:', err);
      setIsBotSpeaking(false);
    }
  };

  // ✅ FIX CLAVE: Se usa `messagesRef.current` para armar el body del fetch 
  const sendMessage = async (e = null, textOverride = null, isVoice = false, cvAdjunto = null) => {
    if (e) e.preventDefault();
    const text = (textOverride ?? input).trim();
    if (!text) return;
    if (loading) return; // evitar envíos concurrentes (quick replies, voz, teclado)

    // Cancelar cualquier fetch anterior que siga en vuelo
    if (fetchAbortRef.current) { fetchAbortRef.current.abort(); fetchAbortRef.current = null; }
    const controller = new AbortController();
    fetchAbortRef.current = controller;

    if (audioRef.current) {
      audioRef.current.pause();
      setIsBotSpeaking(false);
    }
    try { window.speechSynthesis?.cancel(); } catch {}
    
    const cvParaEnviar = cvAdjunto || cvPendiente || null;
    const userMsg = {
      role: 'user', content: text,
      waLink: null, pdfData: null,
      showCVUpload: false, quickReplies: null, quickRepliesUsed: false,
      cvAdjunto: cvParaEnviar ? { nombre: cvParaEnviar.nombre, tamaño: cvParaEnviar.tamaño } : null,
    };
    
    // Extreamos el estado congelado del Ref para no sobreescribir la memoria del bot
    const currentMsgs = messagesRef.current;
    
    setMessages(prev => [
      ...prev.map(m => m.quickReplies && !m.quickRepliesUsed ? { ...m, quickRepliesUsed: true } : m),
      userMsg,
    ]);
    setInput('');
    if (cvParaEnviar) setCvPendiente(null);
    setLoading(true);
    
    const prodUser  = detectarProducto(text);
    if (prodUser) productoCtxRef.current = prodUser;

    // Si el usuario ya estaba registrado pero ahora pide una vacante diferente,
    // limpiar el estado para permitir un nuevo registro
    if (candidatoRegistrado) {
      const esNuevaVacante = INTENT_EMPLEO_REGEX.test(text) || /postularme|aplicar|registrar|otra vacante|diferente/i.test(text);
      const puestoAnterior = (candidatoRegistrado.puesto || '').toLowerCase();
      const menciona_otro_puesto = esNuevaVacante && !text.toLowerCase().includes(puestoAnterior);
      if (esNuevaVacante && (!puestoAnterior || menciona_otro_puesto)) {
        setCandidatoRegistrado(null);
        setPreRegistroPendiente(null);
        setCvSubido(null);
        setCvPendiente(null);
        setMostrarSubirCV(false);
      }
    }

    // Detectar si el historial actual indica flujo de reclutamiento
    const historialActual = messagesRef.current;
    const enReclutamiento = historialActual.some(m =>
      INTENT_EMPLEO_REGEX.test(m.content || '')
    );
    // Solo activar intención de compra si NO estamos en flujo de empleo
    const compraNow = enReclutamiento ? false : esIntencionCompra(text, historialActual);
    const pdfNow    = enReclutamiento ? false : esSolicitudPDF(text);
    
    // Lista segura para el body del request
    const payloadMessages = [
      ...currentMsgs.map(m => m.quickReplies ? { ...m, quickRepliesUsed: true } : m),
      userMsg
    ];

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: payloadMessages,
          isVoice, language: currentLangCode,
          sessionId: sessionIdRef.current,
          cvAdjunto: cvParaEnviar
            ? { nombre: cvParaEnviar.nombre, tipo: cvParaEnviar.tipo, base64: cvParaEnviar.base64, tamaño: cvParaEnviar.tamaño }
            : null,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      const replyText           = data.reply              || '';
      const audioUrl            = data.audio              || null;
      const accionWA            = data.accionWA           || false;
      const accionPDF           = data.accionPDF          ?? null;
      const accionCV            = data.accionCV           || false;
      const accionReclutamiento = data.accionReclutamiento || false;
      const accionDistribuidor  = data.accionDistribuidor  || false;
      const isDuplicate         = data.isDuplicate         || false;
      const recruitDataFromApi  = data.recruitData         || null;
      const esListaEsperaFlag   = data.esListaEspera       || false;
      
      let quickReplies = data.quickReplies || null;
      if (!quickReplies && replyText) {
        if (/tienes.*cv|adjuntar.*cv|cv.*disponible|tienes un cv|tiene.*curriculum/i.test(replyText)) {
          quickReplies = {
            type: 'cv',
            options: [
              { label: 'Sí, tengo CV', value: 'si_cv', action: 'solicitar_cv' },
              { label: 'No tengo CV',  value: 'no_cv',  action: 'continuar'   },
            ],
          };
        } else if (/que puesto|a que puesto|cual.*puesto|aplicar a/i.test(replyText)) {
          const usingRealVac = vacListRef.current.length > 0;
          const vacOpts = usingRealVac
            ? vacListRef.current.map(v => ({ label: v.titulo, value: v.titulo, action: 'text', area: v.area, salario: v.salario, tipo: v.tipo }))
            : [
                { label: 'Producción', value: 'Operador de producción', action: 'text'  },
                { label: 'Logística',  value: 'Logística',              action: 'text'  },
                { label: 'Ventas',     value: 'Ventas',                 action: 'text'  },
                { label: 'Técnico',    value: 'Mantenimiento',          action: 'text'  },
                { label: 'Ay. Gral.',  value: 'Ayudante General',       action: 'text'  },
              ];
          quickReplies = {
            type: usingRealVac ? 'vacante' : 'puesto',
            options: [
              ...vacOpts,
              { label: 'Otro puesto', value: 'otro', action: 'input' },
            ],
          };
        } else if (/que estado|en que estado|estado.*republica|donde vives/i.test(replyText)) {
          quickReplies = {
            type: 'estado',
            options: [
              { label: 'Michoacán',        value: 'Michoacán',        action: 'text'  },
              { label: 'Ciudad de México', value: 'Ciudad de México', action: 'text'  },
              { label: 'Jalisco',          value: 'Jalisco',          action: 'text'  },
              { label: 'Nuevo León',       value: 'Nuevo León',       action: 'text'  },
              { label: 'Guanajuato',       value: 'Guanajuato',       action: 'text'  },
              { label: 'Otro estado',      value: 'otro',             action: 'input' },
            ],
          };
        }
      }
      const prodReply = detectarProducto(replyText);
      if (prodReply && !prodUser) productoCtxRef.current = prodReply;
      const prodFinal = productoCtxRef.current || 'sus productos';
      
      let waLink    = null;
      let pdfData   = null;
      let distLink  = null;
      if ((compraNow || accionWA === true) && !enReclutamiento) {
        const waText = t.waStart || 'Hola Grupo Ortiz, me interesa cotizar';
        waLink = `https://wa.me/524432072593?text=${encodeURIComponent(waText + ' ' + prodFinal)}`;
      }
      if ((pdfNow || accionPDF != null) && !enReclutamiento) {
        const clave = accionPDF || prodUser || prodReply || productoCtxRef.current || 'general';
        pdfData = PDF_MAP[clave] || PDF_MAP['general'];
      }
      const pedirCV = (accionCV || /adjunta.*cv|por favor.*adjunta|sube.*cv|envía.*cv|manda.*cv/i.test(replyText)) && !cvSubido;
      if (pedirCV) setMostrarSubirCV(true);
      if (accionDistribuidor) {
        distLink = `/${currentLangCode}/distribuidor#formulario`;
      }
      
      if (accionReclutamiento && recruitDataFromApi) {
        // Combinar datos del API con datos del historial para máxima completitud
        const todosLosMsgs   = [...payloadMessages, { role: 'assistant', content: replyText }];
        const datosHistorial = extraerDatosDeHistorial(todosLosMsgs);
        // Los datos del API tienen precedencia; el historial rellena huecos
        setPreRegistroPendiente({
          id:           null,  // aún no guardado en DB
          esListaEspera: esListaEsperaFlag,
          nombre:   recruitDataFromApi.nombre   || datosHistorial.nombre   || '',
          puesto:   recruitDataFromApi.puesto   || datosHistorial.puesto   || '',
          edad:     recruitDataFromApi.edad     || datosHistorial.edad     || '',
          estado:   recruitDataFromApi.estado   || datosHistorial.estado   || '',
          colonia:  recruitDataFromApi.colonia  || datosHistorial.colonia  || '',
          email:    recruitDataFromApi.email    || datosHistorial.email    || '',
          telefono: recruitDataFromApi.telefono || datosHistorial.telefono || '',
        });
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant', content: replyText,
        waLink, pdfData, distLink,
        showCVUpload: accionCV && !cvSubido,
        isDuplicate,
        quickReplies, quickRepliesUsed: false,
      }]);
      setLastVoiceResponse(replyText);
      if (isVoice && audioUrl) await playAudio(audioUrl);
      
    } catch (err) {
      if (err.name === 'AbortError') return; // fetch cancelado por mensaje más nuevo — ignorar silenciosamente
      console.error('❌ sendMessage error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: t.errorMsg || 'Error de conexión. Intenta de nuevo.',
        waLink: null, pdfData: null, showCVUpload: false, quickReplies: null, quickRepliesUsed: false,
      }]);
    } finally {
      fetchAbortRef.current = null;
      setLoading(false);
      if (viewMode === 'chat' && window.innerWidth > 1024) {
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className={`botgo-container ${isOpen ? 'open' : ''}`} style={{ fontFamily: isRTL ? 'Tahoma, Arial, sans-serif' : 'inherit' }}>
      <div ref={chatWindowRef} className={`botgo-window ${isOpen ? 'show' : ''}`}>

        {viewMode === 'voice' && (
          <div className="botgo-voice-interface" style={{ position: 'relative' }}>
            <div className="voice-header">
              <span>{t.voiceAssistantTitle || 'Asistente Virtual'}</span>
              <button className="voice-close-btn" onClick={handleCloseChat} aria-label="Cerrar"><CloseIcon /></button>
            </div>
            <div className="voice-content">
              {voiceActivated ? (
                <div className="voice-orb-only">
                  <div className={`voice-orb-container ${loading ? 'thinking' : isBotSpeaking ? 'speaking' : isListening ? 'listening' : 'idle'}`}>
                    <div className="voice-orb-core" />
                    <div className="voice-orb-ring ring-1" />
                    <div className="voice-orb-ring ring-2" />
                    <div className="voice-orb-ring ring-3" />
                  </div>
                  <p className="voice-orb-status">
                    {isListening
                      ? (input || t.listeningState || 'Escuchando...')
                      : loading
                        ? (t.thinking || 'Pensando...')
                        : isBotSpeaking
                          ? 'Hablando...'
                          : 'Presiona el micrófono para hablar'}
                  </p>
                </div>
              ) : (
                <>
                  <div className={`voice-orb-container ${loading ? 'thinking' : isBotSpeaking ? 'speaking' : isListening ? 'listening' : 'idle'}`}>
                    <div className="voice-orb-core" />
                    <div className="voice-orb-ring ring-1" />
                    <div className="voice-orb-ring ring-2" />
                  </div>
                  <div className="voice-text-display">
                    <div className="assistant-speech-text">
                      <Suspense fallback={<span>{lastVoiceResponse}</span>}>
                        <ReactMarkdown>
                          {(lastVoiceResponse || '')
                            .replace(/\[ACCION:[^\]]+\]/gi, '')
                            .replace(/https?:\/\/\S+/g, '')
                            .split(/\n+/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .join('\n\n')}
                        </ReactMarkdown>
                      </Suspense>
                    </div>
                  </div>
                  {vacancyCards !== null ? (
                    <div className="vacpanel">
                      <div className="vacpanel-hdr">
                        <div className="vacpanel-hdr-left">
                          <span className="vacpanel-dot" />
                          <span>Vacantes abiertas</span>
                        </div>
                        <button className="vacpanel-close" onClick={() => setVacancyCards(null)}>×</button>
                      </div>
                      {!Array.isArray(vacancyCards) ? (
                        <div className="vacpanel-loading">
                          <span className="vacpanel-spinner" />
                          Cargando vacantes…
                        </div>
                      ) : vacancyCards.length === 0 ? (
                        <div className="vacpanel-loading">
                          <span style={{ fontSize: 13, color: 'var(--clr-muted)', lineHeight: 1.5 }}>
                            No hay vacantes abiertas por ahora.<br/>Puedes dejar tus datos y te avisamos.
                          </span>
                        </div>
                      ) : (
                        <div className="vacpanel-list">
                          {vacancyCards.map(v => (
                            <div key={v.id} className="vacpanel-card">
                              <div className="vacpanel-card-body">
                                <span className="vacpanel-card-area">{v.area}</span>
                                <span className="vacpanel-card-title">{v.titulo}</span>
                                <div className="vacpanel-card-tags">
                                  {fmtSalario(v.salario) && <span className="vacpanel-tag">{fmtSalario(v.salario)}</span>}
                                  {v.tipo && <span className="vacpanel-tag">{v.tipo}</span>}
                                </div>
                              </div>
                              <button
                                className="vacpanel-card-btn"
                                onClick={() => {
                                  setVacancyCards(null);
                                  setViewMode('chat');
                                  setTimeout(() => sendMessage(null, `Quiero postularme a la vacante de ${v.titulo}`, false), 100);
                                }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                Postularme
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
<a
  href={`/${currentLangCode}/vacantes#vacantes`}
  className="vacpanel-more"
  data-astro-reload="true" // <- FUERZA A ASTRO A RESPETAR EL HASH AL CAMBIAR DE PÁGINA
  onClick={(e) => {
    // Cerramos el bot visualmente
    setIsOpen(false);
    setVacancyCards(null);

    // ¿Ya estamos en la página de vacantes?
    if (window.location.pathname.includes('/vacantes')) {
      e.preventDefault(); // Solo cancelamos la navegación si ya estamos ahí
      
      // Damos 300ms para que la animación del bot termine de cerrarse
      // y la pantalla vuelva a su altura normal antes de calcular el scroll
      setTimeout(() => {
        const seccion = document.getElementById('vacantes');
        if (seccion) {
          // Calculamos la posición exacta ignorando animaciones
          const elementPosition = seccion.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY; // Puedes restar unos 80px si tienes un header fijo
  
          window.scrollTo({
  top: offsetPosition,
  behavior: 'instant' // <-- Cámbialo aquí también
});
          
          window.history.pushState(null, '', '#vacantes');
        }
      }, 300); 
    }
    // Si no estamos en la página de vacantes, dejamos que el <a href="...">
    // actúe con normalidad. El data-astro-reload forzará la caída en la sección.
  }}
>
  Ver todas las vacantes
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
</a>
                    </div>
                  ) : (
                    <div className="voice-caps-grid">
                      {(t.tooltipItems || []).map((item, i) => {
                        const Icon = getIconForItem(item);
                        const isVacantes = /vacante/i.test(item.bold || '');
                        return (
                          <button
                            key={i}
                            className="voice-cap-card"
                            style={{ animationDelay: `${i * 0.07}s` }}
                            onClick={() => {
                              if (isVacantes) {
                                // Mostrar panel de vacantes en lugar de ir al chat
                                if (vacListRef.current.length > 0) {
                                  setVacancyCards(vacListRef.current.slice(0, 4));
                                } else {
                                  setVacancyCards(false); // false = cargando
                                  fetch('/api/vacantes')
                                    .then(r => r.json())
                                    .then(data => {
                                      if (data.ok) {
                                        const activas = (data.vacantes || []).filter(v => v.activa);
                                        vacListRef.current = activas;
                                        setVacancyCards(activas.slice(0, 4));
                                      } else { setVacancyCards(null); }
                                    })
                                    .catch(() => setVacancyCards(null));
                                }
                              } else {
                                const query = `${item.text} ${item.bold}`;
                                setInput(query);
                                setViewMode('chat');
                                setTimeout(() => sendMessage(null, query, false), 100);
                              }
                            }}
                          >
                            <span className="voice-cap-icon"><Icon /></span>
                            <span className="voice-cap-text">{item.text} <strong>{item.bold}</strong></span>
                          </button>
                        );
                      })}
                      {isMobile && !pwaInstalled && (
                        <button
                          className="voice-cap-card voice-cap-card--install"
                          style={{ animationDelay: `${(t.tooltipItems || []).length * 0.07}s` }}
                          onClick={handleInstallPWA}
                        >
                          <span className="voice-cap-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 2v13M7 11l5 5 5-5"/><path d="M3 18v2a1 1 0 001 1h16a1 1 0 001-1v-2"/>
                            </svg>
                          </span>
                          <span className="voice-cap-text">Instala la <strong>App GO</strong></span>
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            {isBotSpeaking && (
              <div className="voice-wave-area">
                <canvas ref={waveCanvasRef} className="voice-wave-canvas" />
              </div>
            )}
            <div className="voice-controls">
              <button className="voice-control-btn secondary" onClick={() => setViewMode('chat')} aria-label="Modo teclado"><KeyboardIcon /></button>
              <button className={`voice-control-btn primary-mic ${isListening ? 'active' : ''}`} onClick={toggleListening} aria-label={isListening ? 'Detener' : 'Hablar'}>
                <MicIcon isListening={isListening} size={32} />
              </button>
              <button className="voice-control-btn secondary" onClick={handleCloseChat} aria-label="Cerrar"><CloseIcon /></button>
            </div>
            <MicToast message={micToast} onDismiss={dismissMicToast} />
          </div>
        )}

        {viewMode === 'chat' && (
          <div className="botgo-chat-interface" style={{ position: 'relative' }}>
            <div className="botgo-header-clean" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <button onClick={() => setViewMode('voice')} className="header-back-btn" aria-label="Volver al modo de voz"><BackArrowIcon /></button>
              <div className="header-title"><h2>BotGo</h2></div>
              <div className="header-avatar-container"><RobotIcon className="header-robot-icon" /></div>
            </div>
            {enFlujoReclutamiento && <RecruitmentProgress messages={messages} />}
            {enFlujoReclutamiento && !preRegistroPendiente && !candidatoRegistrado && <RecruitInfoNote />}
            <div className="botgo-messages" ref={messagesContainerRef}>

              {messages.map((msg, idx) => (
                <div key={idx} className={`msg-row ${msg.role}`}>
                  {msg.role === 'assistant' && (
                    <div className="msg-avatar-small"><RobotIcon className="msg-icon-svg" /></div>
                  )}
                  <div className="msg-col">
                    <div className={`msg-bubble ${msg.role}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                      <MessageRenderer content={msg.content} isAssistant={msg.role === 'assistant'} />
                    </div>
                    {msg.role === 'user' && msg.cvAdjunto && (
                      <div className="msg-cv-badge">
                        <AttachIcon />
                        <span className="msg-cv-badge-name">{msg.cvAdjunto.nombre}</span>
                        <span className="msg-cv-badge-size">{formatFileSize(msg.cvAdjunto.tamaño)}</span>
                      </div>
                    )}
                    {msg.role === 'assistant' && (msg.waLink || msg.pdfData || msg.distLink) && (
                      <MessageActions waLink={msg.waLink} pdfData={msg.pdfData} distLink={msg.distLink} t={t} />
                    )}
                    {msg.role === 'assistant' && msg.isDuplicate && <DuplicateNotice />}
                    {msg.role === 'assistant' && msg.quickReplies && (
                      <QuickReplies
                        options={msg.quickReplies.options}
                        type={msg.quickReplies.type}
                        onSelect={(opt) => handleQuickReply(opt, idx)}
                        disabled={msg.quickRepliesUsed || loading}
                      />
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="msg-row assistant">
                  <div className="msg-avatar-small"><RobotIcon className="msg-icon-svg" /></div>
                  <div className="msg-col">
                    <div className="msg-bubble assistant typing">
                      <span className="dot" /><span className="dot" /><span className="dot" />
                    </div>
                  </div>
                </div>
              )}
              {mostrarSubirCV && !cvSubido && (
                <div className="msg-row assistant">
                  <div className="msg-avatar-small"><RobotIcon className="msg-icon-svg" /></div>
                  <div className="msg-col">
                    <CVUploadButton
                      onFileSelect={handleCVFileSelect}
                      cvSubido={cvSubido}
                      uploading={cvUploading}
                      t={t}
                    />
                  </div>
                </div>
              )}
              {preRegistroPendiente && !candidatoRegistrado && (
                <PreRegistroReview
                  candidato={preRegistroPendiente}
                  t={t}
                  onConfirmar={handleConfirmarRegistro}
                />
              )}
              {candidatoRegistrado && <RecruitmentConfirmation candidato={candidatoRegistrado} t={t} />}
              <div ref={messagesEndRef} />
            </div>
            <div className="botgo-footer-curve">
              {isMobile && !pwaInstalled && (
  <button
    type="button"
    className="footer-install-btn"
    onClick={handleInstallPWA}
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v13M7 11l5 5 5-5"/><path d="M3 18v2a1 1 0 001 1h16a1 1 0 001-1v-2"/>
    </svg>
    Instalar App GO en tu celular
  </button>
)}
              {cvSubido && !mostrarSubirCV && (
                <div className="footer-cv-badge">
                  <CheckCircleIcon />
                  <span>{cvSubido.nombre} · {formatFileSize(cvSubido.tamaño)}</span>
                </div>
              )}
              <form onSubmit={(e) => sendMessage(e, null, false)} className="botgo-input-capsule" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                {(() => {
                  const lastPdf = [...messages].reverse().find(m => m.role === 'assistant' && m.pdfData)?.pdfData;
                  return lastPdf ? (
                    <a href={lastPdf.url} target="_blank" rel="noopener noreferrer" className="action-btn-pdf-footer" aria-label="Ver catálogo PDF" title={lastPdf.label}>
                      <PdfIcon />
                    </a>
                  ) : (
                    <button type="button" className="action-btn-mic" onClick={toggleListening} aria-label={isListening ? 'Detener grabación' : 'Activar micrófono'}>
                      <MicIcon isListening={isListening} />
                    </button>
                  );
                })()}
                <input
                  ref={inputRef}
                  className="botgo-input-field"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? (t.listeningState || 'Escuchando...') : t.placeholder}
                  disabled={loading}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
                <button type="submit" className="action-btn-send" disabled={loading || !input.trim()} aria-label="Enviar mensaje">
                  <SendIcon />
                </button>
              </form>
            </div>
            <MicToast message={micToast} onDismiss={dismissMicToast} />
          </div>
        )}
      </div>

      {!isOpen && (
        <div className={`botgo-launcher ${mounted ? 'launcher-ready' : 'launcher-prerender'}`}>
          {isMobile && isHomePage  && <MobilePill onOpen={handleOpenChat} t={t} />}
          {isMobile && !isHomePage && (
            <button className="botgo-button" onClick={handleOpenChat} aria-label="Abrir asistente virtual BotGO">
              <RobotIcon className="botgo-btn-icon" />
            </button>
          )}
          {!isMobile && isHomePage && (
            <DesktopTooltip onOpen={handleOpenChat} onDismiss={() => setShowTooltip(false)} t={t} />
          )}
          {!isMobile && (
            <button className="botgo-button" onClick={handleOpenChat} aria-label="Abrir asistente virtual BotGO">
              <RobotIcon className="botgo-btn-icon" />
              {isHomePage && showTooltip && <span className="botgo-notif-dot" aria-hidden="true" />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}