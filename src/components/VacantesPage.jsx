// src/components/VacantesPage.jsx
// Renderiza las tarjetas de vacantes activas en la página pública.
// Usa las variables CSS de vacantes.css y las fuentes del sitio (DM Sans / DM Mono).
import React, { useState, useEffect, useRef } from 'react';

const FONT_SANS = "'DM Sans', system-ui, -apple-system, sans-serif";
const FONT_MONO = "'DM Mono', 'Fira Mono', monospace";

// ── ICONOS SVG ─────────────────────────────────────────────────────────────────
const IcCheck = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcBot = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8"/><rect x="4" y="8" width="16" height="12" rx="2"/>
    <path d="M2 14h2"/><path d="M20 14h2"/>
    <path d="M9 13v2"/><path d="M15 13v2"/>
  </svg>
);
const IcClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IcBriefcase = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
);

// Formatea salario: agrega comas de miles y símbolo $ si aplica
// "10000 mensual" → "$10,000 mensual" · "Negociable" → "Negociable"
function fmtSalario(raw) {
  if (!raw) return null;
  let str = raw.trim().replace(/\b(\d{4,})\b/g, n => Number(n).toLocaleString('es-MX'));
  if (!str.includes('$') && /^\d/.test(str)) str = `$${str}`;
  return str;
}

const VISIBLE_DEFAULT = 8;

const DEFAULT_BENEFICIOS = [
  'Prestaciones de ley','Transporte de personal','Tarjeta de vales de despensa',
  'Despensa física','Bono de producción','Uniformes','Apoyo escolar','Oportunidades de crecimiento',
];

export default function VacantesPage() {
  const [vacantes,    setVacantes]    = useState([]);
  const [beneficios,  setBeneficios]  = useState(DEFAULT_BENEFICIOS);
  const [loading,     setLoading]     = useState(true);
  const [selected,  setSelected]  = useState(null);
  const savedScrollRef = useRef(0);
  const [showAll,   setShowAll]   = useState(false);
  const tapCountRef   = useRef(0);
  const tapTimerRef   = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const prevScrollRef    = useRef(0);
  const collapseTimerRef = useRef(null);
  const scrollBoxRef     = useRef(null);

  // Doble toque en CUALQUIER parte del modal para cerrar
  const handleTouchStart = (e) => {
    if (e.target.closest('button, a')) return;
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e) => {
    if (e.target.closest('button, a')) return;
    const t  = e.changedTouches[0];
    const dx = Math.abs(t.clientX - touchStartRef.current.x);
    const dy = Math.abs(t.clientY - touchStartRef.current.y);
    if (dx > 10 || dy > 10) return; // fue scroll, no tap

    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);

    if (tapCountRef.current >= 2) {
      tapCountRef.current = 0;
      e.preventDefault(); // evita selección de texto en el segundo tap
      setSelected(null);
    } else {
      // Si el segundo tap no llega en 380ms, reinicia
      tapTimerRef.current = setTimeout(() => { tapCountRef.current = 0; }, 380);
    }
  };

  // En móvil: mostrar todas desde el inicio (el carrusel horizontal las maneja)
  useEffect(() => {
    if (window.innerWidth <= 768) setShowAll(true);
  }, []);

  // Desktop: wheel encima del scroll box — colapsar inmediatamente si está en el tope y sube
  useEffect(() => {
    if (!showAll || window.innerWidth <= 768) return;
    const box = scrollBoxRef.current;
    if (!box) return;

    const handleWheel = (e) => {
      if (e.deltaY < 0 && box.scrollTop === 0) {
        if (collapseTimerRef.current) { clearTimeout(collapseTimerRef.current); collapseTimerRef.current = null; }
        setShowAll(false);
        const header = document.getElementById('vacantes-header');
        if (header) header.classList.remove('is-sticky');
      }
    };

    box.addEventListener('wheel', handleWheel, { passive: true });
    return () => box.removeEventListener('wheel', handleWheel);
  }, [showAll]);

  // Desktop: si el usuario sube de scroll estando en modo "ver más", colapsar de vuelta
  useEffect(() => {
    if (!showAll || window.innerWidth <= 768) return;

    prevScrollRef.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollingUp = currentY < prevScrollRef.current;
      prevScrollRef.current = currentY;

      if (!scrollingUp) {
        // Si vuelve a bajar, cancelar el timer — no colapsar
        if (collapseTimerRef.current) { clearTimeout(collapseTimerRef.current); collapseTimerRef.current = null; }
        return;
      }

      const section = document.getElementById('vacantes');
      if (!section) return;

      if (currentY < section.offsetTop) {
        // Solo colapsar si el usuario permanece arriba 500ms sin volver a bajar
        if (!collapseTimerRef.current) {
          collapseTimerRef.current = setTimeout(() => {
            collapseTimerRef.current = null;
            setShowAll(false);
            const header = document.getElementById('vacantes-header');
            if (header) header.classList.remove('is-sticky');
          }, 250);
        }
      } else {
        if (collapseTimerRef.current) { clearTimeout(collapseTimerRef.current); collapseTimerRef.current = null; }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    };
  }, [showAll]);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (selected) {
      savedScrollRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollRef.current}px`;
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, savedScrollRef.current);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [selected]);

  useEffect(() => {
    fetch('/api/vacantes')
      .then(r => r.json())
      .then(j => {
        const lista = j.ok ? (j.vacantes || []) : [];
        setVacantes(lista);
        if (j.beneficios?.length) setBeneficios(j.beneficios);
        const activas = lista.filter(v => v.activa).length;
        const el = document.getElementById('vac-count');
        if (el) el.textContent = activas > 0 ? String(activas) : '—';
        window.dispatchEvent(new CustomEvent('vacantes:loaded', { detail: { total: activas } }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePostular = (v) => {
    window.dispatchEvent(new CustomEvent('botgo:open-vacancy', {
      detail: { id: v.id, titulo: v.titulo, area: v.area, tipo: v.tipo, ubicacion: v.ubicacion, requisitos: v.requisitos },
    }));
    setSelected(null);
  };

  // ── Spinner ──
  if (loading) {
    return (
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', padding:'80px 0', gap:14 }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width:22, height:22, borderRadius:'50%', border:'2.5px solid var(--vac-border)', borderTop:'2.5px solid #FB670B', animation:'spin 0.75s linear infinite' }}/>
        <span style={{ fontFamily:FONT_SANS, fontSize:14, color:'var(--vac-muted)', fontWeight:500 }}>Cargando vacantes…</span>
      </div>
    );
  }

  const activas  = vacantes.filter(v => v.activa);
  const visibles = showAll ? activas : activas.slice(0, VISIBLE_DEFAULT);
  const ocultas  = activas.length - VISIBLE_DEFAULT;

  // ── Sin vacantes ──
  if (!activas.length) {
    return (
      <>
        <style>{`
          @keyframes vp-bob {
            0%,100% { transform: translateY(-5px); }
            50%      { transform: translateY(5px); }
          }
          @keyframes vp-sign-swing {
            0%,100% { transform: rotate(-1.5deg); }
            50%      { transform: rotate(1.5deg); }
          }
          @keyframes vp-gear-cw  { to { transform: rotate(360deg); } }
          @keyframes vp-gear-ccw { to { transform: rotate(-360deg); } }
          @keyframes vp-spark {
            0%,100% { opacity:.75; transform: translateY(0) scale(1); }
            50%     { opacity:.1;  transform: translateY(-11px) scale(.5); }
          }
          @keyframes vp-fadein {
            from { opacity:0; transform:translateY(18px); }
            to   { opacity:1; transform:translateY(0); }
          }
          .vp-ew { animation: vp-fadein .5s ease-out both; }
          .vp-rb { animation: vp-bob 3.2s ease-in-out infinite; transform-box:fill-box; transform-origin:center bottom; }
          .vp-sg { animation: vp-sign-swing 3.2s ease-in-out infinite; transform-box:fill-box; transform-origin:center top; }
          .vp-gc { animation: vp-gear-cw  10s linear infinite; transform-box:fill-box; transform-origin:center; }
          .vp-gx { animation: vp-gear-ccw  7s linear infinite; transform-box:fill-box; transform-origin:center; }
          .vp-s1 { animation: vp-spark 2s ease-in-out infinite; }
          .vp-s2 { animation: vp-spark 2s ease-in-out infinite .55s; }
          .vp-s3 { animation: vp-spark 2s ease-in-out infinite 1.1s; }
          .vp-empty-cta {
            display:inline-flex; align-items:center; gap:10px;
            background:#FB670B; color:#fff; border:none; border-radius:50px;
            padding:14px 30px; font-size:14px; font-weight:700;
            cursor:pointer; letter-spacing:-.01em;
            box-shadow:0 4px 24px rgba(251,103,11,.35);
            transition:transform .15s ease, box-shadow .15s ease;
          }
          .vp-empty-cta:hover  { transform:translateY(-2px); box-shadow:0 8px 32px rgba(251,103,11,.45); }
          .vp-empty-cta:active { transform:translateY(0); }
        `}</style>

        <div className="vp-ew" style={{ textAlign:'center', padding:'48px 20px' }}>

          <div style={{ display:'inline-block', marginBottom:24 }}>
            <svg viewBox="0 0 240 210" fill="none" width="240" height="210" style={{ overflow:'visible', maxWidth:'100%' }}>
              <defs>
                <linearGradient id="vph" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FD8A40"/><stop offset="100%" stopColor="#FB670B"/>
                </linearGradient>
                <linearGradient id="vpb" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FB670B"/><stop offset="100%" stopColor="#C94E00"/>
                </linearGradient>
                <linearGradient id="vpsign" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF7B20"/><stop offset="100%" stopColor="#D44E00"/>
                </linearGradient>
              </defs>

              {/* Sombra suelo */}
              <ellipse cx="120" cy="206" rx="82" ry="7" fill="rgba(0,0,0,0.07)"/>

              {/* Engranaje izquierdo decorativo */}
              <g transform="translate(22,58)">
                <g className="vp-gx">
                  <rect x="-3" y="-16" width="6" height="7" rx="1.5" fill="#E2E8F0"/>
                  <rect x="-3" y="9"   width="6" height="7" rx="1.5" fill="#E2E8F0"/>
                  <rect x="-16" y="-3" width="7" height="6" rx="1.5" fill="#E2E8F0"/>
                  <rect x="9"  y="-3"  width="7" height="6" rx="1.5" fill="#E2E8F0"/>
                  <g transform="rotate(45)">
                    <rect x="-3" y="-16" width="6" height="7" rx="1.5" fill="#E2E8F0"/>
                    <rect x="-3" y="9"   width="6" height="7" rx="1.5" fill="#E2E8F0"/>
                    <rect x="-16" y="-3" width="7" height="6" rx="1.5" fill="#E2E8F0"/>
                    <rect x="9"  y="-3"  width="7" height="6" rx="1.5" fill="#E2E8F0"/>
                  </g>
                  <circle r="11" fill="#F1F5F9"/>
                  <circle r="4.5" fill="white"/>
                  <circle r="2"  fill="#E2E8F0"/>
                </g>
              </g>

              {/* Engranaje derecho decorativo */}
              <g transform="translate(218,52)">
                <g className="vp-gc">
                  <rect x="-3.5" y="-18" width="7" height="8" rx="1.5" fill="#E2E8F0"/>
                  <rect x="-3.5" y="10"  width="7" height="8" rx="1.5" fill="#E2E8F0"/>
                  <rect x="-18"  y="-3.5" width="8" height="7" rx="1.5" fill="#E2E8F0"/>
                  <rect x="10"   y="-3.5" width="8" height="7" rx="1.5" fill="#E2E8F0"/>
                  <g transform="rotate(45)">
                    <rect x="-3.5" y="-18" width="7" height="8" rx="1.5" fill="#E2E8F0"/>
                    <rect x="-3.5" y="10"  width="7" height="8" rx="1.5" fill="#E2E8F0"/>
                    <rect x="-18"  y="-3.5" width="8" height="7" rx="1.5" fill="#E2E8F0"/>
                    <rect x="10"   y="-3.5" width="8" height="7" rx="1.5" fill="#E2E8F0"/>
                  </g>
                  <circle r="13" fill="#F1F5F9"/>
                  <circle r="5.5" fill="white"/>
                  <circle r="2.5" fill="#E2E8F0"/>
                </g>
              </g>

              {/* Robot completo (bob) */}
              <g className="vp-rb">

                {/* Cuello */}
                <rect x="109" y="89" width="22" height="13" rx="5" fill="#C94E00"/>
                {/* Cables */}
                <path d="M109 93 Q97 99 90 109"  stroke="#FB670B" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.55"/>
                <path d="M131 93 Q143 99 150 109" stroke="#FB670B" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.55"/>

                {/* Cuerpo (detrás del letrero) */}
                <rect x="90" y="99" width="60" height="52" rx="13" fill="url(#vpb)" opacity="0.6"/>

                {/* Hombros */}
                <circle cx="90"  cy="108" r="11" fill="#C94E00"/>
                <circle cx="150" cy="108" r="11" fill="#C94E00"/>

                {/* Brazo izquierdo */}
                <path d="M84,108 Q60,124 44,152" stroke="#FB670B" strokeWidth="18" strokeLinecap="round" fill="none"/>
                <path d="M84,108 Q60,124 44,152" stroke="#FD8A40" strokeWidth="9"  strokeLinecap="round" fill="none" opacity="0.35"/>
                <circle cx="61" cy="124" r="10" fill="#C94E00"/>

                {/* Brazo derecho */}
                <path d="M156,108 Q180,124 196,152" stroke="#FB670B" strokeWidth="18" strokeLinecap="round" fill="none"/>
                <path d="M156,108 Q180,124 196,152" stroke="#FD8A40" strokeWidth="9"  strokeLinecap="round" fill="none" opacity="0.35"/>
                <circle cx="179" cy="124" r="10" fill="#C94E00"/>

                {/* Letrero (swing) */}
                <g className="vp-sg">
                  {/* Sombra letrero */}
                  <rect x="43" y="141" width="154" height="68" rx="13" fill="#8B3000" opacity="0.35"/>
                  {/* Fondo principal */}
                  <rect x="41" y="137" width="158" height="68" rx="13" fill="url(#vpsign)"/>
                  {/* Barra header oscura */}
                  <rect x="41" y="137" width="158" height="24" rx="13" fill="rgba(0,0,0,0.28)"/>
                  <rect x="41" y="149"  width="158" height="12" fill="rgba(0,0,0,0.28)"/>
                  {/* Brillo superior */}
                  <rect x="43" y="138" width="154" height="5" rx="8" fill="rgba(255,255,255,0.2)"/>
                  {/* Label STATUS */}
                  <text x="120" y="153" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="8.5" fontWeight="700" fontFamily="monospace" letterSpacing="3.5">● STATUS</text>
                  {/* Número grande 503 */}
                  <text x="120" y="194" textAnchor="middle" fill="white" fontSize="42" fontWeight="900" fontFamily="DM Mono, Fira Mono, monospace" letterSpacing="-2">503</text>
                </g>

                {/* Manos */}
                <circle cx="44"  cy="152" r="12" fill="#C94E00"/>
                <circle cx="44"  cy="152" r="6.5" fill="#B84700"/>
                <circle cx="196" cy="152" r="12" fill="#C94E00"/>
                <circle cx="196" cy="152" r="6.5" fill="#B84700"/>

                {/* Antena */}
                <line x1="120" y1="12" x2="120" y2="26" stroke="#FB670B" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="120" cy="7"  r="8"   fill="#FB670B"/>
                <circle cx="120" cy="7"  r="4"   fill="#FFD700"/>

                {/* Cabeza */}
                <circle cx="120" cy="53" r="39" fill="url(#vph)"/>
                <rect x="77"  y="43" width="11" height="22" rx="5.5" fill="#C94E00"/>
                <rect x="152" y="43" width="11" height="22" rx="5.5" fill="#C94E00"/>
                <ellipse cx="120" cy="56" rx="31" ry="28" fill="#FFF5E6"/>
                <path d="M96 41 Q102 35 109 40"  stroke="#C94E00" strokeWidth="4" strokeLinecap="round" fill="none"/>
                <path d="M131 40 Q138 35 144 41" stroke="#C94E00" strokeWidth="4" strokeLinecap="round" fill="none"/>
                <rect x="91" y="46" width="58" height="21" rx="9.5" fill="#FB670B"/>
                <circle cx="107" cy="56.5" r="7.5" fill="#FFD700"/>
                <circle cx="133" cy="56.5" r="7.5" fill="#FFD700"/>
                <circle cx="107" cy="58"   r="3.8" fill="#D35400"/>
                <circle cx="133" cy="58"   r="3.8" fill="#D35400"/>
                <circle cx="104" cy="53.5" r="2.5" fill="rgba(255,255,255,0.8)"/>
                <circle cx="130" cy="53.5" r="2.5" fill="rgba(255,255,255,0.8)"/>
                <path d="M108 70 Q120 65 132 70" stroke="#D35400" strokeWidth="3.2" strokeLinecap="round" fill="none"/>
                <ellipse cx="120" cy="80" rx="8" ry="2.5" fill="#D35400" opacity="0.4"/>

              </g>

              {/* Chispas */}
              <circle className="vp-s1" cx="175" cy="16" r="5"   fill="#FB670B" opacity="0.65"/>
              <circle className="vp-s2" cx="188" cy="32" r="3.2" fill="#FD8A40" opacity="0.45"/>
              <circle className="vp-s3" cx="165" cy="34" r="2"   fill="#FB670B" opacity="0.3"/>

            </svg>
          </div>

          <p style={{ fontSize:20, fontWeight:800, color:'var(--vac-text)', margin:'0 0 6px', lineHeight:1.3, fontFamily:FONT_SANS }}>
            Status 503: Buscando Talento.
          </p>
          <p style={{ fontSize:14, color:'var(--vac-muted)', lineHeight:1.75, maxWidth:360, margin:'0 auto' }}>
            Estamos actualizando nuestras ofertas.{' '}
            <strong style={{ color:'var(--vac-text)', fontWeight:600 }}>Vuelve pronto</strong>{' '}
            para ver nuevas oportunidades.
          </p>

          <div style={{ marginTop:28 }}>
            <button className="vp-empty-cta"
              onClick={() => window.dispatchEvent(new CustomEvent('botgo:open-vacancy', { detail: { esListaEspera: true } }))}>
              <IcBot />
              Avisar cuando haya vacantes
            </button>
          </div>

          <p style={{ fontSize:11, color:'var(--vac-muted)', marginTop:14, opacity:0.5 }}>
            El asistente registra tu perfil · sin compromiso
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .vp-modal-overlay { position:fixed; inset:0; z-index:1000002; display:flex; align-items:center; justify-content:center; padding:16px; }
        .vp-modal-backdrop { position:absolute; inset:0; background:rgba(0,0,0,0.58); backdrop-filter:blur(5px); }
        .vp-modal-box { position:relative; background:var(--clr-surface); width:100%; max-width:580px; max-height:88vh; border-radius:18px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,0.45); animation:fadeUp 0.2s ease-out; }
        .vp-modal-scroll { overflow-y:auto; padding:32px 30px 24px; flex:1; min-height:0; overscroll-behavior:contain; }
        .vp-double-tap-hint { display: none; }
        @media (max-width: 768px) {
          .vp-modal-overlay { align-items: flex-end; padding: 0; }
          .vp-modal-box { border-radius: 0; width: 100%; max-width: 100%; height: 100dvh; max-height: 100dvh; animation: slideUp 0.28s cubic-bezier(0.16,1,0.3,1) both; touch-action: manipulation; }
          .vp-double-tap-hint { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px 20px 10px; color: var(--clr-muted); font-size: 11px; font-weight: 500; letter-spacing: 0.02em; border-bottom: 1px solid var(--clr-border); flex-shrink: 0; user-select: none; }
        }
        @keyframes slideUp { from { opacity:0; transform:translateY(60px); } to { opacity:1; transform:translateY(0); } }
        .vp-modal-footer { padding:20px 30px; border-top:1px solid var(--clr-border); background:var(--clr-surface); border-bottom-left-radius:18px; border-bottom-right-radius:18px; }
        .vp-req-list { padding-left:18px; margin:0; color:var(--clr-muted); font-size:14px; line-height:1.75; }
        .vp-req-list li { margin-bottom:6px; }
        .vp-postular-btn { width:100%; background:#FB670B; color:#fff; border:none; padding:16px; border-radius:12px; font-size:15px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:9px; box-shadow:0 4px 16px rgba(251,103,11,0.28); transition:background 0.15s ease, transform 0.1s ease; font-family:${FONT_SANS}; }
        .vp-postular-btn:hover { background:#D45500; }
        .vp-postular-btn:active { transform:scale(0.98); }
      `}</style>

      {/* ── GRID DE TARJETAS ── */}
      {/* Cuando está expandido: caja scrollable con máscara que "se come" las cards */}
      <div className={showAll ? 'vac-scroll-box' : undefined} ref={showAll ? scrollBoxRef : null}>
        <div className="vac-positions-grid">
          {visibles.map((v) => {
            const salarioFmt = fmtSalario(v.salario);

            const tagsVerdes = [salarioFmt, v.tipo].filter(Boolean);
            const tagsGrises = [v.horario].filter(Boolean);

            return (
              <button
                key={v.id}
                className="vac-position-card"
                onClick={() => setSelected(v)}
              >
                <div className="vac-position-body">

                  {/* Fila área + badge */}
                  <div className="vac-position-top">
                    <span className="vac-position-area">{v.area}</span>
                    <span className="vac-position-badge">Activa</span>
                  </div>

                  {/* Título */}
                  <div className="vac-position-title">{v.titulo}</div>

                  {/* Empresa · Ubicación */}
                  <div className="vac-position-meta">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, opacity:0.55 }}>
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span style={{ fontWeight:600, color:'var(--clr-text)', opacity:0.8 }}>{v.empresa || 'Grupo Ortiz'}</span>
                    <span className="vac-position-meta-dot"/>
                    {v.ubicacion || 'Morelia, Mich.'}
                  </div>

                  {/* Salario */}
                  {salarioFmt && (
                    <div style={{ marginBottom:12 }}>
                      <span className="vac-position-salary">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        {salarioFmt}
                      </span>
                    </div>
                  )}

                  {/* Tags: tipo + horario */}
                  <div className="vac-position-tags">
                    {v.tipo && (
                      <span className="vac-tag">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        {v.tipo}
                      </span>
                    )}
                    {v.horario && (
                      <span className="vac-tag">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {v.horario}
                      </span>
                    )}
                    {v.multiples && (
                      <span className="vac-tag" style={{ color:'#FB670B', borderColor:'rgba(251,103,11,0.22)', background:'rgba(251,103,11,0.06)' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="17" cy="7" r="3"/><circle cx="7" cy="17" r="3"/><path d="M7 7h6M11 17h6"/></svg>
                        Varias posiciones
                      </span>
                    )}
                  </div>

                  <div className="vac-position-spacer"/>
                </div>

                {/* CTA footer */}
                <span className="vac-position-cta">
                  <span>Ver detalle y postularme</span>
                  <span className="vac-position-cta-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── VER MÁS ── */}
      {!showAll && ocultas > 0 && (
        <div className="vac-ver-mas-btn" style={{ textAlign:'center', marginTop:36 }}>
          <button
            onClick={() => {
              setShowAll(true);
              window.dispatchEvent(new CustomEvent('vacantes:expand'));
              // Lleva el header de la sección al tope para que el sticky se active de inmediato
              requestAnimationFrame(() => {
                const header = document.getElementById('vacantes-header');
                if (header) {
                  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '80', 10);
                  const top  = header.getBoundingClientRect().top + window.scrollY - navH;
                  window.scrollTo({ top, behavior: 'smooth' });
                }
              });
            }}
            style={{
              display:'inline-flex', alignItems:'center', gap:10,
              background:'transparent', border:'1.5px solid #FB670B',
              color:'#FB670B', padding:'13px 28px', borderRadius:12,
              fontSize:14, fontWeight:700, cursor:'pointer',
              fontFamily:FONT_SANS, letterSpacing:'-0.01em',
              transition:'background 0.15s ease, color 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='#FB670B'; e.currentTarget.style.color='#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#FB670B'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            Ver {ocultas} vacante{ocultas !== 1 ? 's' : ''} más
          </button>
        </div>
      )}

      {/* ── CTA: NO ENCONTRÉ MI PUESTO ── */}
      <div style={{ textAlign:'center', marginTop:36, padding:'36px 20px 36px', borderTop:'1px solid var(--clr-border)' }}>
        <p style={{ fontFamily:FONT_SANS, fontSize:13, color:'var(--vac-muted)', margin:'0 0 14px', opacity:0.75 }}>
          ¿No ves la vacante que buscas?
        </p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('botgo:open-vacancy', { detail: { esListaEspera: true, sinPuesto: true } }))}
          style={{
            display:'inline-flex', alignItems:'center', gap:9,
            background:'transparent', border:'1.5px solid #FB670B',
            color:'#FB670B', padding:'11px 24px', borderRadius:50,
            fontSize:13, fontWeight:700, cursor:'pointer',
            fontFamily:FONT_SANS, letterSpacing:'-0.01em',
            transition:'background 0.15s ease, color 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background='#FB670B'; e.currentTarget.style.color='#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#FB670B'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          Regístrame y avísame cuando se publique
        </button>
        <p style={{ fontFamily:FONT_SANS, fontSize:11, color:'var(--vac-muted)', marginTop:10, opacity:0.45 }}>
          El asistente registra tu perfil · sin compromiso
        </p>
      </div>

      {/* ── MODAL: DETALLE DE VACANTE ── */}
      {selected && (
        <div className="vp-modal-overlay">
          <div className="vp-modal-backdrop" onClick={() => setSelected(null)} />
          <div className="vp-modal-box" style={{ fontFamily:FONT_SANS }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

            {/* Hint móvil — solo visible en pantallas táctiles */}
            <div className="vp-double-tap-hint">
              <svg width="28" height="4" viewBox="0 0 28 4"><rect width="28" height="4" rx="2" fill="currentColor"/></svg>
              <span>Toca dos veces en cualquier parte para cerrar</span>
            </div>

            <button
              onClick={() => setSelected(null)}
              style={{ position:'absolute', top:14, right:14, background:'var(--clr-bg)', border:'1px solid var(--clr-border)', width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--clr-muted)', zIndex:10 }}>
              <IcClose />
            </button>

            <div className="vp-modal-scroll">
              {/* Área */}
              <div style={{ fontFamily:FONT_SANS, fontSize:11, fontWeight:700, color:'#FB670B', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:10 }}>{selected.area}</div>

              {/* Título — override global h2 display font */}
              <h2 style={{ fontFamily:FONT_SANS, fontSize:22, fontWeight:800, color:'var(--clr-text)', margin:'0 0 6px', paddingRight:36, lineHeight:1.25, textTransform:'none', letterSpacing:'-0.02em' }}>
                {selected.titulo}
              </h2>

              {/* Empresa */}
              <div style={{ fontFamily:FONT_SANS, fontSize:14, color:'var(--clr-muted)', marginBottom:18 }}>
                <span style={{ fontWeight:600, color:'var(--clr-text)' }}>{selected.empresa || 'Grupo Ortiz'}</span> · {selected.ubicacion || 'Morelia, Mich.'}
              </div>

              {/* Badge múltiples */}
              {selected.multiples && (
                <div style={{ fontFamily:FONT_SANS, display:'inline-flex', alignItems:'center', gap:6, background:'rgba(251,103,11,0.08)', border:'1px solid rgba(251,103,11,0.22)', color:'#FB670B', borderRadius:6, padding:'4px 10px', fontSize:11, fontWeight:700, marginBottom:14 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="17" cy="7" r="3"/><circle cx="7" cy="17" r="3"/><path d="M7 7h6M11 17h6"/></svg>
                  Contratando a varios candidatos
                </div>
              )}

              {/* Tags */}
              <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:20 }}>
                {[
                  fmtSalario(selected.salario),
                  selected.tipo,
                ].filter(Boolean).map((tag, j) => (
                  <span key={j} style={{ fontFamily:FONT_SANS, display:'inline-flex', alignItems:'center', gap:4, background:'rgba(34,197,94,0.10)', color:'#16a34a', border:'1px solid rgba(34,197,94,0.20)', padding:'4px 11px', borderRadius:6, fontSize:12, fontWeight:700 }}>
                    <IcCheck />{tag}
                  </span>
                ))}
                {selected.horario && (
                  <span style={{ fontFamily:FONT_SANS, background:'var(--clr-bg)', color:'var(--clr-muted)', border:'1px solid var(--clr-border)', padding:'4px 11px', borderRadius:6, fontSize:12, fontWeight:600 }}>{selected.horario}</span>
                )}
              </div>

              <div style={{ height:1, background:'var(--clr-border)', margin:'0 0 20px' }} />

              {/* Descripción */}
              {selected.descripcion && (
                <div style={{ marginBottom:20 }}>
                  <p style={{ fontFamily:FONT_SANS, fontSize:11, fontWeight:700, color:'var(--clr-muted)', textTransform:'uppercase', letterSpacing:'0.10em', margin:'0 0 10px' }}>Descripción del puesto</p>
                  <p style={{ fontFamily:FONT_SANS, fontSize:14, color:'var(--clr-muted)', lineHeight:1.8, whiteSpace:'pre-wrap', margin:0 }}>{selected.descripcion}</p>
                </div>
              )}

              {/* Requisitos */}
              {selected.requisitos && (
                <div style={{ marginBottom:20 }}>
                  <p style={{ fontFamily:FONT_SANS, fontSize:11, fontWeight:700, color:'var(--clr-muted)', textTransform:'uppercase', letterSpacing:'0.10em', margin:'0 0 10px' }}>Requisitos y detalles</p>
                  <ul className="vp-req-list">
                    {selected.requisitos.split('\n').filter(l => l.trim()).map((line, idx) => (
                      <li key={idx}>{line.replace(/^[-•*]\s*/, '').trim()}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Beneficios fijos — aplican a todas las vacantes */}
              <div style={{ height:1, background:'var(--clr-border)', margin:'0 0 20px' }} />
              <div>
                <p style={{ fontFamily:FONT_SANS, fontSize:11, fontWeight:700, color:'var(--clr-muted)', textTransform:'uppercase', letterSpacing:'0.10em', margin:'0 0 12px' }}>Lo que ofrecemos</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px 12px' }}>
                  {beneficios.map((b, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:8, fontFamily:FONT_SANS, fontSize:13, color:'var(--clr-text)' }}>
                      <span style={{ display:'flex', flexShrink:0, width:18, height:18, borderRadius:'50%', background:'rgba(22,163,74,0.10)', alignItems:'center', justifyContent:'center', color:'#16a34a' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </span>
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="vp-modal-footer">
              <button className="vp-postular-btn" onClick={() => handlePostular(selected)}>
                <IcBot /> Postularme a esta vacante
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
