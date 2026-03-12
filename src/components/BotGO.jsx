import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './BotGO.css';
import { translations } from '../i18n';

console.log('🚀 BotGO v4 (Astro Ready) CARGADO');

// ══════════════════════════════════════════
//  ICONS
// ══════════════════════════════════════════
const RobotIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="headGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FB670B"/><stop offset="100%" stopColor="#FB670B"/>
      </linearGradient>
    </defs>
    <line x1="20" y1="35" x2="15" y2="20" stroke="#FB670B" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="15" cy="20" r="4" fill="#FB670B"/>
    <line x1="80" y1="35" x2="85" y2="20" stroke="#FB670B" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="85" cy="20" r="4" fill="#FB670B"/>
    <circle cx="50" cy="55" r="40" fill="url(#headGrad)"/>
    <ellipse cx="50" cy="58" rx="32" ry="30" fill="#FFF5E6"/>
    <rect x="25" y="45" width="50" height="22" rx="10" fill="#FB670B"/>
    <circle cx="38" cy="56" r="5" fill="#FFD700"/>
    <circle cx="62" cy="56" r="5" fill="#FFD700"/>
    <ellipse cx="50" cy="78" rx="6" ry="2" fill="#D35400" opacity="0.8"/>
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const MicIcon = ({ isListening, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={isListening ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isListening ? "pulse-animation" : ""}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const BackArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const KeyboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <line x1="6" y1="8" x2="6" y2="8"/><line x1="10" y1="8" x2="10" y2="8"/>
    <line x1="14" y1="8" x2="14" y2="8"/><line x1="18" y1="8" x2="18" y2="8"/>
    <line x1="6" y1="12" x2="6" y2="12"/><line x1="10" y1="12" x2="10" y2="12"/>
    <line x1="14" y1="12" x2="14" y2="12"/><line x1="18" y1="12" x2="18" y2="12"/>
    <line x1="6" y1="16" x2="11" y2="16"/><line x1="15" y1="16" x2="18" y2="16"/>
  </svg>
);

const CloseIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const PdfIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);

// ── Tooltip capability icons ──
const VacanteIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-8 0v2"/><circle cx="12" cy="7" r="4"/></svg>);
const InfoIcon    = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>);
const CartIcon    = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg>);
const PhoneIcon   = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.86 19.86 0 013.1 5.18 2 2 0 015.09 3h3a2 2 0 012 1.72 12.07 12.07 0 00.7 2.81 2 2 0 01-.45 2.11L9.1 10.91a16 16 0 006.99 6.99l1.27-1.27a2 2 0 012.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/></svg>);
const FileIcon    = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>);

// Íconos en orden fijo — el texto viene de i18n
const TOOLTIP_ICONS = [VacanteIcon, InfoIcon, CartIcon, PhoneIcon, FileIcon];

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

// ══════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════
function detectarProducto(texto) {
  if (!texto) return null;
  const lower = texto.toLowerCase();
  const lista = ['stretch film','pelicula stretch','película stretch','stretch','empaque flexible','empaque','esquineros','esquinero','cuerdas','cuerda','arpillas','arpilla','malla','sacos','saco','rafia','flexible'];
  for (const p of lista) { if (lower.includes(p)) return p; }
  return null;
}

function esIntencionCompra(texto) {
  if (!texto) return false;
  const u = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const regexTolerantes = [
    /comp[a-z]{0,4}r/,/coti[a-z]{0,6}/,/preci[a-z]{0,3}/,/cuant[a-z]{0,2}/,
    /cost[a-z]{0,3}/,/presup[a-z]{0,6}/,/adquir[a-z]{0,4}/,/dispon[a-z]{0,8}/,
    /pedid[a-z]{0,2}/,/orden[a-z]{0,2}/,
  ];
  if (regexTolerantes.some(r => r.test(u))) return true;
  const frases = ['me interesa','me gustaria','quisiera','estoy interesad','hay stock','tienen stock','hay disponible','como compro','donde compro','voy a comprar','contactar','whatsapp','llamar'];
  if (frases.some(k => u.includes(k))) return true;
  const tieneProducto = detectarProducto(texto) !== null;
  if ((u.includes('quiero') || u.includes('necesito')) && tieneProducto) return true;
  return false;
}

function esSolicitudPDF(texto) {
  if (!texto) return false;
  const u = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return ['pdf','catalogo','ficha tecnica','ficha del producto','descargar','descarga','brochure','folleto','informacion del producto','mas informacion','especificaciones','hoja tecnica'].some(k => u.includes(k));
}

// ══════════════════════════════════════════
//  SUB-COMPONENTS
// ══════════════════════════════════════════
const MessageRenderer = ({ content, isAssistant }) => {
  if (!isAssistant) return <span>{content}</span>;
  const clean = content
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
      {waLink && (
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="msg-action-btn msg-action-wa">
          <WhatsAppIcon /> <span>{t?.salesBtn || 'Cotizar por WhatsApp'}</span>
        </a>
      )}
      {pdfData && (
        <a href={pdfData.url} target="_blank" rel="noopener noreferrer" className="msg-action-btn msg-action-pdf">
          <PdfIcon /> <span>{t?.pdfBtn || 'Ver catálogo PDF'}</span>
        </a>
      )}
    </div>
  );
};

// ══════════════════════════════════════════
//  MOBILE PILL — un solo elemento animado
//  Fases: entering → expanded → collapsing → done
//  En "done" queda SIEMPRE visible como pestaña
// ══════════════════════════════════════════
const MobilePill = ({ onOpen, t }) => {
  const [phase, setPhase] = useState('entering');

  useEffect(() => {
    // 0.1s  → expande hacia la izquierda mostrando el texto
    const t1 = setTimeout(() => setPhase('expanded'), 100);
    // 4.5s  → empieza a contraerse
    const t2 = setTimeout(() => setPhase('collapsing'), 4500);
    // 5.2s  → queda solo el ícono — NO se desmonta, sigue ahí
    const t3 = setTimeout(() => setPhase('done'), 5200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const handleClose = (e) => {
    e.stopPropagation();
    setPhase('collapsing');
    // Solo colapsa visualmente, nunca desaparece
    setTimeout(() => setPhase('done'), 700);
  };

  return (
    <div
      className={`botgo-pill-wrapper phase-${phase}`}
      onClick={onOpen}
      role="button"
      aria-label="Abrir asistente virtual BotGO"
    >
      {/* Ícono — siempre visible, es el "botón" final */}
      <div className="botgo-pill-icon">
        <RobotIcon className="botgo-btn-icon" />
        {phase !== 'done' && <span className="botgo-notif-dot" aria-hidden="true" />}
      </div>

      {/* Texto — se muestra/oculta con la animación de ancho */}
      <div className="botgo-pill-text">
        <span className="botgo-pill-label-small">{t?.pillLabelSmall || '¿En qué puedo'}</span>
        <span className="botgo-pill-label-big">{t?.pillLabelBig    || 'AYUDARTE HOY?'}</span>
      </div>

      {/* Cerrar */}
      <button className="botgo-pill-close" onClick={handleClose} aria-label="Cerrar">
        <CloseIcon size={13} />
      </button>
    </div>
  );
};

// ══════════════════════════════════════════
//  DESKTOP TOOLTIP — tarjeta flotante
// ══════════════════════════════════════════
const DesktopTooltip = ({ onOpen, onDismiss, t }) => {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  const dismiss = (open = false) => {
    setExiting(true);
    setTimeout(() => { setVisible(false); open ? onOpen() : onDismiss(); }, 300);
  };

  useEffect(() => {
    const timer = setTimeout(() => dismiss(false), 12000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  // Combina ícono (fijo) con texto (de i18n)
  const items = (t.tooltipItems || []).map((item, i) => ({
    icon: React.createElement(TOOLTIP_ICONS[i] || FileIcon),
    text: item.text,
    bold: item.bold,
  }));

  return (
    <div className={`botgo-tooltip ${exiting ? 'exiting' : ''}`} role="dialog" aria-label={`${t.tooltipTitle} ${t.tooltipAccent}`}>
      <div className="botgo-tooltip-header">
        <div className="botgo-tooltip-avatar">
          <RobotIcon className="botgo-tooltip-robot" />
        </div>
        <div className="botgo-tooltip-title">
          <span className="botgo-tooltip-title-main">{t.tooltipTitle  || '¿En qué puedo'}</span>
          <span className="botgo-tooltip-title-accent">{t.tooltipAccent || 'ayudarte hoy?'}</span>
        </div>
        <button className="botgo-tooltip-close" onClick={() => dismiss(false)} aria-label="Cerrar notificación">
          <CloseIcon size={16} />
        </button>
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

      <button className="botgo-tooltip-cta" onClick={() => dismiss(true)}>
        {t.tooltipCta || '¡Iniciar chat ahora!'}
      </button>

      <div className="botgo-tooltip-arrow" />
    </div>
  );
};

// ══════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════
export default function BotGO({ language = 'es' }) {
  const currentLangCode = translations[language] ? language : 'es';
  const t = translations[currentLangCode].chatbot;
  const isRTL = currentLangCode === 'ar';

  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: t.greeting,
    waLink: null,
    pdfData: null,
  }]);

  const [input,             setInput]             = useState('');
  const [loading,           setLoading]           = useState(false);
  const [isOpen,            setIsOpen]            = useState(false);
  const [viewMode,          setViewMode]          = useState('voice');
  const [isListening,       setIsListening]       = useState(false);
  const [lastVoiceResponse, setLastVoiceResponse] = useState(t.greeting);
  const [isBotSpeaking,     setIsBotSpeaking]     = useState(false);
  const [showTooltip,       setShowTooltip]       = useState(true);
  const [isMobile,          setIsMobile]          = useState(false);

  const chatWindowRef        = useRef(null);
  const inputRef             = useRef(null);
  const messagesContainerRef = useRef(null);
  const voiceTextRef         = useRef('');
  const productoCtxRef       = useRef(null);
  const audioRef             = useRef(null);
  const messagesEndRef       = useRef(null);

  // Detectar mobile una sola vez en el cliente
  useEffect(() => {
    setIsMobile(window.innerWidth <= 1024);
  }, []);

  // Auto-scroll mensajes
  useEffect(() => {
    if (viewMode === 'chat' && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 150);
    }
  }, [messages, loading, viewMode]);

  // Focus input al abrir chat desktop
  useEffect(() => {
    if (isOpen && viewMode === 'chat' && window.innerWidth > 768) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, viewMode]);

  // Atajos de teclado
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
    const onEsc      = (e) => { if (e.key === 'Escape') handleCloseChat(); };
    const onOutside  = (e) => {
      if (isOpen && chatWindowRef.current && !chatWindowRef.current.contains(e.target)) {
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
  }, [isOpen]);

  const handleCloseChat = () => {
    setIsOpen(false);
    setViewMode('voice');
    inputRef.current?.blur();
    window.focus();
  };

  const handleOpenChat = () => {
    setShowTooltip(false);
    setIsOpen(true);
  };

  const toggleListening = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; setIsBotSpeaking(false); }
    if (isListening) { setIsListening(false); return; }
    if (typeof window === 'undefined') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Tu navegador no soporta reconocimiento de voz.'); return; }
    const rec = new SR();
    rec.lang           = t?.voiceCode || 'es-ES';
    rec.continuous     = false;
    rec.interimResults = true;
    rec.onstart  = () => { setIsListening(true); voiceTextRef.current = ''; };
    rec.onresult = (e) => { const txt = Array.from(e.results).map(r => r[0].transcript).join(''); setInput(txt); voiceTextRef.current = txt; };
    rec.onerror  = () => setIsListening(false);
    rec.onend    = () => { setIsListening(false); if (voiceTextRef.current.trim()) setTimeout(() => sendMessage(null, voiceTextRef.current, true), 600); };
    try { rec.start(); } catch (err) { console.error(err); }
  };

  const playAudio = async (b64) => {
    if (!b64) return;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    const a = new Audio(b64);
    audioRef.current = a;
    a.onplay  = () => setIsBotSpeaking(true);
    a.onended = () => setIsBotSpeaking(false);
    a.onpause = () => setIsBotSpeaking(false);
    try { await a.play(); } catch (err) { setIsBotSpeaking(false); }
  };

  const sendMessage = async (e = null, textOverride = null, isVoice = false) => {
    if (e) e.preventDefault();
    const text = (textOverride ?? input).trim();
    if (!text) return;

    if (audioRef.current) { audioRef.current.pause(); setIsBotSpeaking(false); }
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();

    const userMsg = { role: 'user', content: text, waLink: null, pdfData: null };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const prodUser  = detectarProducto(text);
    if (prodUser) productoCtxRef.current = prodUser;
    const compraNow = esIntencionCompra(text);
    const pdfNow    = esSolicitudPDF(text);

    try {
      const res  = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: [...messages, userMsg], isVoice, language: currentLangCode }),
      });
      const data = await res.json();

      const replyText = data.reply    || '';
      const audioUrl  = data.audio    || null;
      const accionWA  = data.accionWA || false;
      const accionPDF = data.accionPDF || null;

      const prodReply = detectarProducto(replyText);
      if (prodReply && !prodUser) productoCtxRef.current = prodReply;
      const prodFinal = productoCtxRef.current || 'sus productos';

      const mostrarWA  = compraNow || accionWA === true;
      const mostrarPDF = pdfNow    || accionPDF != null;

      let waLink  = null;
      let pdfData = null;

      if (mostrarWA) {
        const waText = t.waStart || 'Hola Grupo Ortiz, me interesa cotizar';
        waLink = `https://wa.me/524432072593?text=${encodeURIComponent(waText + ' ' + prodFinal)}`;
      }
      if (mostrarPDF) {
        const clave = accionPDF || prodUser || prodReply || productoCtxRef.current || 'general';
        pdfData = PDF_MAP[clave] || PDF_MAP['general'];
      }

      setMessages(prev => [...prev, { role: 'assistant', content: replyText, waLink, pdfData }]);
      setLastVoiceResponse(replyText);
      if (isVoice && audioUrl) await playAudio(audioUrl);

    } catch (err) {
      console.error('❌', err);
      setMessages(prev => [...prev, { role: 'assistant', content: t.errorMsg || 'Error de conexión.', waLink: null, pdfData: null }]);
    } finally {
      setLoading(false);
      if (viewMode === 'chat' && typeof window !== 'undefined' && window.innerWidth > 768) {
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }
  };

  // ══════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════
  return (
    <div className={`botgo-container ${isOpen ? 'open' : ''}`} style={{ fontFamily: isRTL ? 'Tahoma, Arial, sans-serif' : 'inherit' }}>

      {/* ── Ventana del chat ── */}
      <div ref={chatWindowRef} className={`botgo-window ${isOpen ? 'show' : ''}`}>

        {/* VISTA VOZ */}
        {viewMode === 'voice' && (
          <div className="botgo-voice-interface">
            <div className="voice-header">
              <span>{t.voiceAssistantTitle || 'Asistente Virtual'}</span>
              <button className="voice-close-btn" onClick={handleCloseChat} aria-label="Cerrar asistente de voz">
                <CloseIcon />
              </button>
            </div>
            <div className="voice-content">
              <div className={`voice-orb-container ${loading ? 'thinking' : isBotSpeaking ? 'speaking' : isListening ? 'listening' : 'idle'}`}>
                <div className="voice-orb-core"/>
                <div className="voice-orb-ring ring-1"/>
                <div className="voice-orb-ring ring-2"/>
              </div>
              <div className="voice-text-display">
                {isListening ? (
                  <p className="user-listening-text">{input || t.listeningState || 'Escuchando...'}</p>
                ) : loading ? (
                  <p className="assistant-thinking-text">{t.thinking || 'Pensando...'}</p>
                ) : (
                  <div className="assistant-speech-text">
                    <ReactMarkdown>
                      {lastVoiceResponse
                        .replace(/\[ACCION:[^\]]+\]/gi, '')
                        .replace(/https?:\/\/\S+/g, '')
                        .split(/\n+/).filter(Boolean).slice(0, 2).join('\n\n')}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
            <div className="voice-controls">
              <button className="voice-control-btn secondary" onClick={() => setViewMode('chat')} aria-label="Cambiar a modo teclado">
                <KeyboardIcon />
              </button>
              <button className={`voice-control-btn primary-mic ${isListening ? 'active' : ''}`} onClick={toggleListening} aria-label={isListening ? 'Detener grabación' : 'Iniciar grabación'}>
                <MicIcon isListening={isListening} size={32}/>
              </button>
              <button className="voice-control-btn secondary" onClick={handleCloseChat} aria-label="Cerrar asistente">
                <CloseIcon />
              </button>
            </div>
          </div>
        )}

        {/* VISTA CHAT */}
        {viewMode === 'chat' && (
          <div className="botgo-chat-interface">
            <div className="botgo-header-clean" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <button onClick={() => setViewMode('voice')} className="header-back-btn" aria-label="Volver al modo de voz">
                <BackArrowIcon />
              </button>
              <div className="header-title"><h2>BotGo</h2></div>
              <div className="header-avatar-container"><RobotIcon className="header-robot-icon"/></div>
            </div>

            <div className="botgo-messages" ref={messagesContainerRef}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`msg-row ${msg.role}`}>
                  {msg.role === 'assistant' && (
                    <div className="msg-avatar-small"><RobotIcon className="msg-icon-svg"/></div>
                  )}
                  <div className="msg-col">
                    <div className={`msg-bubble ${msg.role}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                      <MessageRenderer content={msg.content} isAssistant={msg.role === 'assistant'}/>
                    </div>
                    {msg.role === 'assistant' && (msg.waLink || msg.pdfData) && (
                      <MessageActions waLink={msg.waLink} pdfData={msg.pdfData} t={t}/>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="msg-row assistant">
                  <div className="msg-avatar-small"><RobotIcon className="msg-icon-svg"/></div>
                  <div className="msg-col">
                    <div className="msg-bubble assistant typing">
                      <span className="dot"/><span className="dot"/><span className="dot"/>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="botgo-footer-curve">
              <form onSubmit={(e) => sendMessage(e, null, false)} className="botgo-input-capsule" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <button type="button" className="action-btn-mic" onClick={toggleListening} aria-label={isListening ? 'Detener grabación' : 'Activar micrófono'}>
                  <MicIcon isListening={isListening}/>
                </button>
                <input
                  ref={inputRef}
                  className="botgo-input-field"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? (t.listeningState || 'Escuchando...') : t.placeholder}
                  disabled={loading}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                <button type="submit" className="action-btn-send" disabled={loading || !input.trim()} aria-label="Enviar mensaje">
                  <SendIcon />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ── LAUNCHER — solo visible cuando el chat está cerrado ── */}
      {!isOpen && (
        <div className="botgo-launcher">

          {/* MÓVIL: pill — siempre montada, nunca se desmonta
              En phase-done queda como pestaña con solo el ícono */}
          {isMobile && (
            <MobilePill onOpen={handleOpenChat} t={t} />
          )}

          {/* DESKTOP: tooltip tarjeta + botón circular */}
          {!isMobile && (
            <>
              {showTooltip && (
                <DesktopTooltip
                  onOpen={handleOpenChat}
                  onDismiss={() => setShowTooltip(false)}
                  t={t}
                />
              )}
              <button
                className="botgo-button"
                onClick={handleOpenChat}
                aria-label="Abrir asistente virtual BotGO"
              >
                <RobotIcon className="botgo-btn-icon"/>
                {showTooltip && <span className="botgo-notif-dot" aria-hidden="true"/>}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}