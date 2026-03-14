import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import './BotGO.css';
import { translations } from '../i18n';

console.log('🚀 BotGO v9 (3 bugs fixed) CARGADO');

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
  rafia:      { label: 'Catálogo Rafia',            url: 'https://drive.google.com/file/d/1uAiR4uxO2iX_LsNFul6kXeb7jnnCEV_J/view' },
  stretch:    { label: 'Catálogo Stretch Film',     url: 'https://drive.google.com/file/d/1HYGcpgkRO_7OX22IcWvRpzpLZKgpYV3A/view' },
  cuerda:     { label: 'Catálogo Cuerdas',          url: 'https://drive.google.com/file/d/14GrV9P1ViQKvFp3BucYjgmryRgWKLEZh/view' },
  cuerdas:    { label: 'Catálogo Cuerdas',          url: 'https://drive.google.com/file/d/14GrV9P1ViQKvFp3BucYjgmryRgWKLEZh/view' },
  saco:       { label: 'Catálogo Sacos',            url: 'https://drive.google.com/file/d/16S43-PUrQECO9q2J1fOgbN-YeIxQ2GhP/view' },
  sacos:      { label: 'Catálogo Sacos',            url: 'https://drive.google.com/file/d/16S43-PUrQECO9q2J1fOgbN-YeIxQ2GhP/view' },
  arpilla:    { label: 'Catálogo Arpillas',         url: 'https://drive.google.com/file/d/1OQKGpnRCfA2yFdAlT6q7GczYua2FFFVU/view' },
  arpillas:   { label: 'Catálogo Arpillas',         url: 'https://drive.google.com/file/d/1OQKGpnRCfA2yFdAlT6q7GczYua2FFFVU/view' },
  malla:      { label: 'Catálogo Arpillas',         url: 'https://drive.google.com/file/d/1OQKGpnRCfA2yFdAlT6q7GczYua2FFFVU/view' },
  esquinero:  { label: 'Catálogo Esquineros',       url: 'https://drive.google.com/file/d/181Hvr0HQffLU3rmcXkccYoqj-Y_A-gxr/view' },
  esquineros: { label: 'Catálogo Esquineros',       url: 'https://drive.google.com/file/d/181Hvr0HQffLU3rmcXkccYoqj-Y_A-gxr/view' },
  flexible:   { label: 'Catálogo Empaque Flexible', url: 'https://drive.google.com/file/d/1TGxUcGHjW1NHF8K8YkRisbRE8uAuTnPO/view' },
  empaque:    { label: 'Catálogo Empaque Flexible', url: 'https://drive.google.com/file/d/1TGxUcGHjW1NHF8K8YkRisbRE8uAuTnPO/view' },
  general:    { label: 'Catálogo General',          url: 'https://drive.google.com/file/d/1348E3b37R1KmpggjAURhsuQMfARyBaXB/view' },
};

function detectarProducto(texto) {
  if (!texto) return null;
  const lower = texto.toLowerCase();
  const lista = ['stretch film', 'pelicula stretch', 'película stretch', 'stretch', 'empaque flexible', 'empaque', 'esquineros', 'esquinero', 'cuerdas', 'cuerda', 'arpillas', 'arpilla', 'malla', 'sacos', 'saco', 'rafia', 'flexible'];
  for (const p of lista) { if (lower.includes(p)) return p; }
  return null;
}

function esIntencionCompra(texto) {
  if (!texto) return false;
  const u = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const regexTolerantes = [/comp[a-z]{0,4}r/, /coti[a-z]{0,6}/, /preci[a-z]{0,3}/, /cuant[a-z]{0,2}/, /cost[a-z]{0,3}/, /presup[a-z]{0,6}/, /adquir[a-z]{0,4}/, /dispon[a-z]{0,8}/, /pedid[a-z]{0,2}/, /orden[a-z]{0,2}/];
  if (regexTolerantes.some(r => r.test(u))) return true;
  const frases = ['me interesa', 'me gustaria', 'quisiera', 'estoy interesad', 'hay stock', 'tienen stock', 'hay disponible', 'como compro', 'donde compro', 'voy a comprar', 'contactar', 'whatsapp', 'llamar'];
  if (frases.some(k => u.includes(k))) return true;
  const tieneProducto = detectarProducto(texto) !== null;
  if ((u.includes('quiero') || u.includes('necesito')) && tieneProducto) return true;
  return false;
}

function esSolicitudPDF(texto) {
  if (!texto) return false;
  const u = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return ['pdf', 'catalogo', 'ficha tecnica', 'ficha del producto', 'descargar', 'descarga', 'brochure', 'folleto', 'informacion del producto', 'mas informacion', 'especificaciones', 'hoja tecnica'].some(k => u.includes(k));
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─────────────────────────────────────────────────────────────────────────────
// FIX BUG #1: extraerDatosDeHistorial — ahora detecta quick replies correctamente.
// El problema era que cuando el usuario elegía un quick reply (ej. "Producción"),
// el mensaje del bot anterior preguntaba "¿A qué puesto te gustaría aplicar?"
// pero el regex solo buscaba "puesto|posición|aplicar a" — ahora también detecta
// la pregunta inicial del flujo de reclutamiento para capturar el puesto.
// ─────────────────────────────────────────────────────────────────────────────
function extraerDatosDeHistorial(msgs) {
  const data = { nombre: '', puesto: '', edad: '', estado: '', colonia: '', email: '', telefono: '' };
  for (let i = 0; i < msgs.length - 1; i++) {
    const bot  = msgs[i];
    const user = msgs[i + 1];
    if (bot.role !== 'assistant' || user.role !== 'user') continue;
    const pregunta  = (bot.content  || '').toLowerCase();
    const respuesta = (user.content || '').trim();
    if (!respuesta || respuesta.length < 2) continue;

    // FIX: regex ampliado para capturar más variantes de la pregunta de puesto
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
  { key: 'puesto',  label: 'Puesto',  Icon: RpIcons.puesto,  regex: /puesto|posici[oó]n|aplicar a|qu[eé] puesto/i },
  { key: 'nombre',  label: 'Nombre',  Icon: RpIcons.nombre,  regex: /nombre completo|c[oó]mo te llamas/i },
  { key: 'edad',    label: 'Edad',    Icon: RpIcons.edad,    regex: /cu[aá]ntos a[nñ]os|a[nñ]os tienes|edad/i },
  { key: 'estado',  label: 'Estado',  Icon: RpIcons.estado,  regex: /estado.*rep[uú]blica|estado.*vives|qu[eé] estado/i },
  { key: 'colonia', label: 'Col.',    Icon: RpIcons.colonia, regex: /colonia|municipio|localidad/i },
  { key: 'email',   label: 'Email',   Icon: RpIcons.email,   regex: /correo|email|e-mail/i },
  { key: 'tel',     label: 'Tel',     Icon: RpIcons.tel,     regex: /whatsapp|tel[eé]fono|n[uú]mero.*contact/i },
  { key: 'cv',      label: 'CV',      Icon: RpIcons.cv,      regex: /tienes.*cv|adjunta.*cv|cv.*disponible/i },
];

function calcularPasoActual(messages) {
  let completed = 0;
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
        <span className="rp-title">📋 Solicitud de empleo</span>
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
  );
};

const MessageActions = ({ waLink, pdfData, t }) => {
  if (!waLink && !pdfData) return null;
  return (
    <div className="msg-actions">
      {waLink  && <a href={waLink}      target="_blank" rel="noopener noreferrer" className="msg-action-btn msg-action-wa"><WhatsAppIcon /><span>{t?.salesBtn || 'Cotizar por WhatsApp'}</span></a>}
      {pdfData && <a href={pdfData.url} target="_blank" rel="noopener noreferrer" className="msg-action-btn msg-action-pdf"><PdfIcon /><span>{t?.pdfBtn || 'Ver catálogo PDF'}</span></a>}
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

  const handleClick = () => {
    inputRef.current?.click();
  };

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
      {/* Input oculto — activado por ref, no por label/htmlFor */}
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

// ─── RECRUITMENT CONFIRMATION ─────────────────────────────────────────────────
const RecruitmentConfirmation = ({ candidato, t }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(timer);
  }, []);

  // FIX BUG #1: Limpiar el puesto — eliminar texto de sistema como "Postúlate a nue..."
  // El puesto viene del campo `puesto` de candidato; si contiene texto del sistema
  // o está truncado, mostrar el valor del campo directamente sin modificar.
  const puestoMostrar = candidato?.puesto
    ? candidato.puesto.replace(/^postúlate a nue.*$/i, '').trim() || candidato.puesto
    : '';

  return (
    <div className={`recruitment-confirmation ${visible ? 'confirmation-visible' : ''}`} role="status" aria-live="polite">
      <div className="confirmation-icon-wrapper">
        <div className="confirmation-icon-circle"><SuccessIcon /></div>
        <div className="confirmation-icon-ring" />
      </div>
      <div className="confirmation-body">
        <p className="confirmation-title">{t?.confirmTitle || '¡Solicitud registrada con éxito!'}</p>
        <p className="confirmation-subtitle">{t?.confirmSubtitle || 'Nuestro equipo de RH se pondrá en contacto contigo pronto.'}</p>
        {candidato && (
          <div className="confirmation-badge">
            {candidato.nombre && (
              <div className="confirmation-badge-row">
                <span className="confirmation-badge-label">Nombre</span>
                <span className="confirmation-badge-value">{candidato.nombre}</span>
              </div>
            )}
            {/* FIX BUG #1: mostrar puesto real, no texto de sistema */}
            {puestoMostrar && (
              <div className="confirmation-badge-row">
                <span className="confirmation-badge-label">Puesto</span>
                <span className="confirmation-badge-value">{puestoMostrar}</span>
              </div>
            )}
            {candidato.id && (
              <div className="confirmation-badge-row">
                <span className="confirmation-badge-label">Folio</span>
                <span className="confirmation-badge-value confirmation-folio">#{String(candidato.id).padStart(5, '0')}</span>
              </div>
            )}
          </div>
        )}
      </div>
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

// ─────────────────────────────────────────────────────────────────────────────
// FIX BUG #3: MicToast — alerta inline en lugar de alert() bloqueante.
// Reemplaza todos los alert() del micrófono por un toast no bloqueante
// que aparece dentro del chat y desaparece solo en 4 segundos.
// ─────────────────────────────────────────────────────────────────────────────
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
        position: 'absolute',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(30,30,30,0.92)',
        color: '#fff',
        borderRadius: '12px',
        padding: '10px 16px',
        fontSize: '13px',
        maxWidth: '88%',
        textAlign: 'center',
        zIndex: 9999,
        lineHeight: 1.4,
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
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
    waLink: null, pdfData: null,
    showCVUpload: false, quickReplies: null, quickRepliesUsed: false,
  }]);

  const [input,             setInput]             = useState('');
  const [loading,           setLoading]           = useState(false);
  const [isOpen,            setIsOpen]            = useState(false);
  const [viewMode,          setViewMode]          = useState('voice');
  const [isListening,       setIsListening]       = useState(false);
  const [lastVoiceResponse, setLastVoiceResponse] = useState(t.greeting);
  const [isBotSpeaking,     setIsBotSpeaking]     = useState(false);
  const [showTooltip,       setShowTooltip]       = useState(true);

  const [cvPendiente,    setCvPendiente]    = useState(null);
  const [cvSubido,       setCvSubido]       = useState(null);
  const [cvUploading,    setCvUploading]    = useState(false);
  const [mostrarSubirCV, setMostrarSubirCV] = useState(false);

  const [candidatoRegistrado, setCandidatoRegistrado] = useState(null);
  const [mounted,    setMounted]    = useState(false);
  const [isMobile,   setIsMobile]   = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);

  // FIX BUG #3: estado para el toast del micrófono (reemplaza alert())
  const [micToast, setMicToast] = useState('');

  const chatWindowRef        = useRef(null);
  const inputRef             = useRef(null);
  const messagesContainerRef = useRef(null);
  const voiceTextRef         = useRef('');
  const productoCtxRef       = useRef(null);
  const audioRef             = useRef(null);
  const messagesEndRef       = useRef(null);
  const recRef               = useRef(null);
  const abortedRef           = useRef(false);

  // ── Detección flujo reclutamiento ──────────────────────────────────────────
  const enFlujoReclutamiento = messages.some(m =>
    m.role === 'assistant' &&
    /vacante|empleo|puesto|reclutamiento|aplicar|solicitud.*empleo|trabajo/i.test(m.content || '')
  );

  // ── Detección de plataforma ────────────────────────────────────────────────
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

  // ── Auto-scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (viewMode === 'chat' && messagesEndRef.current) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [messages, loading, viewMode]);

  // ── Focus en input (solo desktop) ──────────────────────────────────────────
  useEffect(() => {
    if (isOpen && viewMode === 'chat' && window.innerWidth > 1024) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, viewMode]);

  // ── Keyboard shortcuts + click outside ────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === 'f') {
        const tag = e.target.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && !e.target.isContentEditable) {
          e.preventDefault();
          setIsOpen(true);
        }
      }
    };
    const onEsc = (e) => { if (e.key === 'Escape') handleCloseChat(); };
    const onOutside = (e) => {
      if (!isOpen) return;
      if (chatWindowRef.current && !chatWindowRef.current.contains(e.target)) {
        const btn = document.querySelector('.botgo-pill-wrapper, .botgo-button');
        if (btn && btn.contains(e.target)) return;
        handleCloseChat();
      }
    };
    window.addEventListener('keydown', onKey);
    if (isOpen) {
      document.addEventListener('mousedown', onOutside);
      document.addEventListener('keydown', onEsc);
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCloseChat = () => {
    if (recRef.current) {
      abortedRef.current = true;
      try { recRef.current.abort(); } catch {}
      recRef.current = null;
    }
    setIsListening(false);
    setIsOpen(false);
    setViewMode('voice');
    inputRef.current?.blur();
    try { window.focus(); } catch {}
    window.dispatchEvent(new Event('pwa:bot-close'));
  };

  const handleOpenChat = () => {
    setShowTooltip(false);
    setIsOpen(true);
    window.dispatchEvent(new Event('pwa:bot-open'));
  };

  // ── QUICK REPLIES ──────────────────────────────────────────────────────────
  const handleQuickReply = async (opt, msgIdx) => {
    setMessages(prev => prev.map((m, i) => i === msgIdx ? { ...m, quickRepliesUsed: true } : m));
    if (opt.action === 'solicitar_cv') {
      // FIX CV: activar el botón ANTES de llamar sendMessage.
      // React batching puede retrasar el render si setMostrarSubirCV y
      // sendMessage se llaman juntos — con flushSync garantizamos render inmediato.
      setMostrarSubirCV(true);
      // Dar un tick para que React renderice el botón antes del await
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

  // ── CV ─────────────────────────────────────────────────────────────────────
  const handleCVFileSelect = async (file) => {
    if (!file) return;
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
    ];
    if (!allowedTypes.includes(file.type)) {
      setMicToast('Tipo de archivo no permitido. Usa PDF, DOC, DOCX, JPG o PNG.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMicToast('El archivo es demasiado grande. Máximo 5MB.');
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

  // ── VOZ ─────────────────────────────────────────────────────────────────────
  // CRÍTICO: toggleListening debe ser SÍNCRONO — no puede tener ningún `await`
  // antes de rec.start(). Los navegadores en HTTPS (Vercel, producción) solo
  // permiten SpeechRecognition si se llama dentro del mismo "user gesture tick".
  // Cualquier await rompe esa cadena y causa not-allowed aunque el permiso esté activo.
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
        // Verificar si el permiso ya está concedido — si sí, el problema es
        // de configuración del servidor, no del usuario
        navigator.permissions?.query({ name: 'microphone' }).then(perm => {
          if (perm.state === 'granted') {
            // Permiso concedido pero SpeechRecognition bloqueado = problema de headers
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
      // no-speech: silencioso
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

    // rec.start() debe llamarse DIRECTAMENTE aquí, en el mismo tick síncrono
    // del click del usuario. Cualquier await antes de esta línea lo rompe.
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
      audioRef.current = null;
    }
    try {
      const a = new Audio(b64);
      audioRef.current = a;
      a.onplay  = () => setIsBotSpeaking(true);
      a.onended = () => setIsBotSpeaking(false);
      a.onpause = () => setIsBotSpeaking(false);
      a.onerror = () => setIsBotSpeaking(false);
      await a.play();
    } catch {
      setIsBotSpeaking(false);
    }
  };

  // ── SEND MESSAGE ───────────────────────────────────────────────────────────
  const sendMessage = async (e = null, textOverride = null, isVoice = false, cvAdjunto = null) => {
    if (e) e.preventDefault();
    const text = (textOverride ?? input).trim();
    if (!text) return;

    if (audioRef.current) {
      audioRef.current.pause();
      setIsBotSpeaking(false);
    }
    try { window.speechSynthesis?.cancel(); } catch {}

    const cvParaEnviar = cvAdjunto || cvPendiente || null;
    const userMsg = {
      role: 'user',
      content: text,
      waLink: null,
      pdfData: null,
      showCVUpload: false,
      quickReplies: null,
      quickRepliesUsed: false,
      cvAdjunto: cvParaEnviar ? { nombre: cvParaEnviar.nombre, tamaño: cvParaEnviar.tamaño } : null,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    if (cvParaEnviar) setCvPendiente(null);
    setLoading(true);

    const prodUser  = detectarProducto(text);
    if (prodUser) productoCtxRef.current = prodUser;
    const compraNow = esIntencionCompra(text);
    const pdfNow    = esSolicitudPDF(text);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          isVoice,
          language: currentLangCode,
          cvAdjunto: cvParaEnviar
            ? { nombre: cvParaEnviar.nombre, tipo: cvParaEnviar.tipo, base64: cvParaEnviar.base64, tamaño: cvParaEnviar.tamaño }
            : null,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const replyText            = data.reply              || '';
      const audioUrl             = data.audio              || null;
      const accionWA             = data.accionWA           || false;
      const accionPDF            = data.accionPDF          ?? null;
      const accionCV             = data.accionCV           || false;
      const accionReclutamiento  = data.accionReclutamiento || false;
      const candidatoId          = data.candidatoId        || null;
      const quickReplies         = data.quickReplies       || null;

      const prodReply = detectarProducto(replyText);
      if (prodReply && !prodUser) productoCtxRef.current = prodReply;
      const prodFinal = productoCtxRef.current || 'sus productos';

      let waLink  = null;
      let pdfData = null;

      if (compraNow || accionWA === true) {
        const waText = t.waStart || 'Hola Grupo Ortiz, me interesa cotizar';
        waLink = `https://wa.me/524432072593?text=${encodeURIComponent(waText + ' ' + prodFinal)}`;
      }
      if (pdfNow || accionPDF != null) {
        const clave = accionPDF || prodUser || prodReply || productoCtxRef.current || 'general';
        pdfData = PDF_MAP[clave] || PDF_MAP['general'];
      }

      // Activar CV upload si el servidor lo indica (y no hay CV subido ya)
      if (accionCV && !cvSubido) {
        setMostrarSubirCV(true);
      }

      if (accionReclutamiento && candidatoId) {
        // FIX BUG #1: extraer datos del historial para mostrar el puesto real
        const todosLosMsgs   = [...messages, userMsg];
        const datosExtraidos = extraerDatosDeHistorial(todosLosMsgs);
        setCandidatoRegistrado({
          id:     candidatoId,
          nombre: datosExtraidos.nombre || '',
          // FIX BUG #1: usar el puesto extraído del historial conversacional
          puesto: datosExtraidos.puesto || '',
        });
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: replyText,
        waLink,
        pdfData,
        showCVUpload: accionCV && !cvSubido,
        quickReplies,
        quickRepliesUsed: false,
      }]);
      setLastVoiceResponse(replyText);
      if (isVoice && audioUrl) await playAudio(audioUrl);

    } catch (err) {
      console.error('❌ sendMessage error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: t.errorMsg || 'Error de conexión. Intenta de nuevo.',
        waLink: null, pdfData: null, showCVUpload: false, quickReplies: null, quickRepliesUsed: false,
      }]);
    } finally {
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

        {/* ══════════════════════════════════════════════════
            VOICE INTERFACE
        ══════════════════════════════════════════════════ */}
        {viewMode === 'voice' && (
          <div className="botgo-voice-interface" style={{ position: 'relative' }}>
            <div className="voice-header">
              <span>{t.voiceAssistantTitle || 'Asistente Virtual'}</span>
              <button className="voice-close-btn" onClick={handleCloseChat} aria-label="Cerrar"><CloseIcon /></button>
            </div>
            <div className="voice-content">
              <div className={`voice-orb-container ${loading ? 'thinking' : isBotSpeaking ? 'speaking' : isListening ? 'listening' : 'idle'}`}>
                <div className="voice-orb-core" />
                <div className="voice-orb-ring ring-1" />
                <div className="voice-orb-ring ring-2" />
              </div>
              <div className="voice-text-display">
                {isListening ? (
                  <p className="user-listening-text">{input || t.listeningState || 'Escuchando...'}</p>
                ) : loading ? (
                  <p className="assistant-thinking-text">{t.thinking || 'Pensando...'}</p>
                ) : (
                  <div className="assistant-speech-text">
                    <ReactMarkdown>
                      {(lastVoiceResponse || '')
                        .replace(/\[ACCION:[^\]]+\]/gi, '')
                        .replace(/https?:\/\/\S+/g, '')
                        .split(/\n+/)
                        .filter(Boolean)
                        .slice(0, 2)
                        .join('\n\n')}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
              {!isListening && !loading && !isBotSpeaking && (
                <div className="voice-caps-grid">
                  {(t.tooltipItems || []).map((item, i) => {
                    const Icon = getIconForItem(item);
                    return (
                      <button
                        key={i}
                        className="voice-cap-card"
                        style={{ animationDelay: `${i * 0.07}s` }}
                        onClick={() => {
                          const query = `${item.text} ${item.bold}`;
                          setInput(query);
                          setViewMode('chat');
                          setTimeout(() => sendMessage(null, query, false), 100);
                        }}
                      >
                        <span className="voice-cap-icon"><Icon /></span>
                        <span className="voice-cap-text">{item.text} <strong>{item.bold}</strong></span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="voice-controls">
              <button className="voice-control-btn secondary" onClick={() => setViewMode('chat')} aria-label="Modo teclado"><KeyboardIcon /></button>
              <button className={`voice-control-btn primary-mic ${isListening ? 'active' : ''}`} onClick={toggleListening} aria-label={isListening ? 'Detener' : 'Hablar'}>
                <MicIcon isListening={isListening} size={32} />
              </button>
              <button className="voice-control-btn secondary" onClick={handleCloseChat} aria-label="Cerrar"><CloseIcon /></button>
            </div>
            {/* FIX BUG #3: toast inline para errores de micrófono */}
            <MicToast message={micToast} onDismiss={() => setMicToast('')} />
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            CHAT INTERFACE
        ══════════════════════════════════════════════════ */}
        {viewMode === 'chat' && (
          <div className="botgo-chat-interface" style={{ position: 'relative' }}>
            <div className="botgo-header-clean" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <button onClick={() => setViewMode('voice')} className="header-back-btn" aria-label="Volver al modo de voz"><BackArrowIcon /></button>
              <div className="header-title"><h2>BotGo</h2></div>
              <div className="header-avatar-container"><RobotIcon className="header-robot-icon" /></div>
            </div>

            {enFlujoReclutamiento && <RecruitmentProgress messages={messages} />}

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

                    {msg.role === 'assistant' && (msg.waLink || msg.pdfData) && (
                      <MessageActions waLink={msg.waLink} pdfData={msg.pdfData} t={t} />
                    )}

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

              {/* ── CV UPLOAD — controlado por estado, aparece inmediato ── */}
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

              {candidatoRegistrado && <RecruitmentConfirmation candidato={candidatoRegistrado} t={t} />}
              <div ref={messagesEndRef} />
            </div>

            <div className="botgo-footer-curve">
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

            {/* FIX BUG #3: toast también visible en chat mode */}
            <MicToast message={micToast} onDismiss={() => setMicToast('')} />
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════
          LAUNCHER (botón flotante)
      ══════════════════════════════════════════════════ */}
      {!isOpen && mounted && (
        <div className="botgo-launcher">
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