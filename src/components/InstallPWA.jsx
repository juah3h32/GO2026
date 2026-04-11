import { useState, useEffect, useRef } from 'react';

const isDev = import.meta.env.DEV;
const AUTO_DISMISS_MS = 5000;

/**
 * InstallPWA
 *
 * Props:
 *  pwa       — textos personalizables
 *  botOpen   — (opcional) booleano controlado desde el padre:
 *              true  → oculta el ícono flotante mientras el bot esté abierto
 *              false → lo vuelve a mostrar
 *
 * Eventos globales (alternativos al prop, útil si el bot es un widget externo):
 *  window.dispatchEvent(new Event('pwa:bot-open'))   → oculta el ícono
 *  window.dispatchEvent(new Event('pwa:bot-close'))  → lo restaura
 *
 * Ejemplo de uso desde el padre:
 *  <InstallPWA pwa={...} botOpen={isBotOpen} />
 *
 * Ejemplo disparando el evento desde el widget del bot:
 *  // cuando se abre el bot:
 *  window.dispatchEvent(new Event('pwa:bot-open'));
 *  // cuando se cierra:
 *  window.dispatchEvent(new Event('pwa:bot-close'));
 */
export default function InstallPWA({ pwa, botOpen = false }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [state, setState]     = useState('hidden');
  const [progress, setProgress] = useState(100);
  const [isBotOpen, setIsBotOpen] = useState(botOpen); // ← estado del bot

  const timeoutRef     = useRef(null);
  const autoDismissRef = useRef(null);
  const progressRef    = useRef(null);

  const txt = {
    appName:     pwa?.appName     || 'Grupo Ortiz',
    title:       pwa?.title       || 'Instalar GO App',
    description: pwa?.description || 'Acceso rápido desde tu pantalla de inicio',
    install:     pwa?.install     || 'Instalar',
    notNow:      pwa?.notNow      || 'Ahora no',
    timeLabel:   pwa?.timeLabel   || 'ahora',
  };

  const ORANGE      = '#FB670B';
  const ORANGE_DARK = '#e05500';

  // ── Sincroniza el prop botOpen con el estado interno ──────────────────────
  useEffect(() => {
    setIsBotOpen(botOpen);
  }, [botOpen]);

  // ── Escucha eventos globales del bot (widget externo) ─────────────────────
  useEffect(() => {
    const onBotOpen  = () => setIsBotOpen(true);
    const onBotClose = () => setIsBotOpen(false);
    window.addEventListener('pwa:bot-open',  onBotOpen);
    window.addEventListener('pwa:bot-close', onBotClose);
    return () => {
      window.removeEventListener('pwa:bot-open',  onBotOpen);
      window.removeEventListener('pwa:bot-close', onBotClose);
    };
  }, []);

  // ── Auto-dismiss ──────────────────────────────────────────────────────────
  const startAutoDismiss = () => {
    setProgress(100);
    const steps    = 60;
    const interval = AUTO_DISMISS_MS / steps;
    let   current  = steps;
    progressRef.current = setInterval(() => {
      current -= 1;
      setProgress((current / steps) * 100);
      if (current <= 0) clearInterval(progressRef.current);
    }, interval);
    autoDismissRef.current = setTimeout(() => {
      handleDismissNotification();
    }, AUTO_DISMISS_MS);
  };

  const cancelAutoDismiss = () => {
    if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
    if (progressRef.current)    clearInterval(progressRef.current);
    setProgress(100);
  };

  // ── Efecto principal ──────────────────────────────────────────────────────
  useEffect(() => {
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
// Solo mostrar en mobile
if (!isMobile) return;

    // No mostrar en la página de vacantes — tiene su propio prompt de notificaciones
    if (window.location.pathname.includes('/vacantes')) return;

    const installed = localStorage.getItem('pwa-installed');
    if (installed) return;

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    if (isStandalone) {
      localStorage.setItem('pwa-installed', 'true');
      return;
    }

    const bubbleCloseCount = parseInt(localStorage.getItem('pwa-bubble-close-count') || '0');
    const lastBubbleClosed = localStorage.getItem('pwa-bubble-closed');
    if (bubbleCloseCount >= 4) return;

    if (lastBubbleClosed) {
      const diff   = Date.now() - parseInt(lastBubbleClosed);
      const limits = [
        10 * 60 * 1000,
        7  * 24 * 60 * 60 * 1000,
        30 * 24 * 60 * 60 * 1000,
      ];
      const limit = limits[Math.min(bubbleCloseCount - 1, limits.length - 1)];
      if (diff < limit) return;
    }

    const alreadySaw = localStorage.getItem('pwa-saw-notification');
    if (alreadySaw) {
      setState('icon');
    } else {
      setState('notification');
      startAutoDismiss();
    }

    if (isDev) return;

    const handlePrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setState((prev) => {
        if (prev === 'hidden') {
          return localStorage.getItem('pwa-saw-notification') ? 'icon' : 'notification';
        }
        return prev;
      });
    };

    const handleInstalled = () => {
      localStorage.setItem('pwa-installed', 'true');
      setState('hidden');
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
      if (timeoutRef.current)     clearTimeout(timeoutRef.current);
      if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
      if (progressRef.current)    clearInterval(progressRef.current);
    };
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleInstall = async () => {
    cancelAutoDismiss();
    if (isDev) {
      alert('✅ En producción aquí se instalaría la app');
      localStorage.setItem('pwa-installed', 'true');
      setState('hidden');
      return;
    }
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') localStorage.setItem('pwa-installed', 'true');
    setState('hidden');
    setDeferredPrompt(null);
  };

  const handleDismissNotification = () => {
    cancelAutoDismiss();
    localStorage.setItem('pwa-saw-notification', 'true');
    localStorage.setItem('pwa-bubble-close-count',
      String(parseInt(localStorage.getItem('pwa-bubble-close-count') || '0') + 1));
    localStorage.setItem('pwa-bubble-closed', Date.now().toString());
    setState('exiting');
    // Va directo a 'hidden' — no deja ícono flotante
    timeoutRef.current = setTimeout(() => setState('hidden'), 400);
  };

  const handleIconClick = () => {
    setState('notification');
    startAutoDismiss();
  };

  const handleBubbleClose = () => {
    const count = parseInt(localStorage.getItem('pwa-bubble-close-count') || '0') + 1;
    localStorage.setItem('pwa-bubble-close-count', count.toString());
    localStorage.setItem('pwa-bubble-closed', Date.now().toString());
    localStorage.setItem('pwa-saw-notification', 'true');
    setState('hidden');
  };

  if (state === 'hidden') return null;

  return (
    <>
      <style>{`
        @keyframes pwaSlideDown {
          from { transform: translateX(-50%) translateY(-110%); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0);     opacity: 1; }
        }
        @keyframes pwaShrinkUp {
          from { transform: translateX(-50%) scale(1);   opacity: 1; }
          to   { transform: translateX(-50%) scale(0.1); opacity: 0; }
        }
        @keyframes pwaIconPop {
          from { transform: scale(0) rotate(-15deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg);   opacity: 1; }
        }
        @keyframes pwaPulse {
          0%, 100% { box-shadow: 0 4px 18px rgba(251,103,11,0.35); }
          50%       { box-shadow: 0 4px 28px rgba(251,103,11,0.65); }
        }
        @keyframes pwaNotifDot {
          0%, 100% { box-shadow: 0 0 0 0   rgba(255,59,48,0.7); }
          50%      { box-shadow: 0 0 0 5px rgba(255,59,48,0);   }
        }
        .pwa-install-btn:hover { background: rgba(251,103,11,0.12) !important; }
        .pwa-dismiss-btn:hover { background: rgba(255,255,255,0.05) !important; }
      `}</style>

      {/* ══ NOTIFICACIÓN — siempre visible aunque el bot esté abierto ══ */}
      {(state === 'notification' || state === 'exiting') && (
        <div
          onMouseEnter={cancelAutoDismiss}
          onTouchStart={cancelAutoDismiss}
          style={{
            position:      'fixed',
            top:           '12px',
            left:          '50%',
            transform:     'translateX(-50%)',
            width:         'calc(100% - 28px)',
            maxWidth:      '360px',
            zIndex:        2147483647,
            animation:     state === 'exiting'
              ? 'pwaShrinkUp 0.38s cubic-bezier(0.4,0,0.2,1) forwards'
              : 'pwaSlideDown 0.48s cubic-bezier(0.16,1,0.3,1)',
            pointerEvents: state === 'exiting' ? 'none' : 'auto',
          }}
        >
          <div style={{
            background:           'rgba(20, 20, 20, 0.97)',
            backdropFilter:       'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius:         '18px',
            overflow:             'hidden',
            boxShadow:            '0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.07)',
            border:               `1px solid rgba(251,103,11,0.2)`,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '10px 14px 9px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <img src="/pwa-192x192.png" width="16" height="16" alt="Grupo Ortiz"
                style={{ borderRadius: '4px', flexShrink: 0 }} />
              <span style={{
                fontSize: '11px', color: 'rgba(255,255,255,0.45)',
                fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase',
              }}>{txt.appName}</span>
              <span style={{
                fontSize: '11px', color: 'rgba(255,255,255,0.25)',
                marginLeft: 'auto', flexShrink: 0,
              }}>{txt.timeLabel}</span>
            </div>

            <div style={{ padding: '14px 14px 10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                  background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 4px 14px rgba(251,103,11,0.4)`,
                }}>
                  <img src="/pwa-192x192.png" width="34" height="34" alt="GO App"
                    style={{ borderRadius: '8px' }} />
                </div>
                <div>
                  <div style={{
                    fontWeight: 700, fontSize: '14px', color: '#fff',
                    marginBottom: '3px', letterSpacing: '-0.2px',
                  }}>{txt.title}</div>
                  <div style={{
                    fontSize: '12px', color: 'rgba(255,255,255,0.48)', lineHeight: 1.35,
                  }}>{txt.description}</div>
                </div>
              </div>
            </div>

            <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', margin: '0 14px', borderRadius: '2px' }}>
              <div style={{
                height: '100%', width: `${progress}%`, borderRadius: '2px',
                background: `linear-gradient(90deg, ${ORANGE}, #ffaa55)`,
                transition: 'width 0.08s linear',
              }} />
            </div>

            <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '10px' }}>
              <button className="pwa-dismiss-btn" onClick={handleDismissNotification} style={{
                flex: 1, padding: '13px', background: 'transparent', border: 'none',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.45)',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s',
              }}>{txt.notNow}</button>
              <button className="pwa-install-btn" onClick={handleInstall} style={{
                flex: 1, padding: '13px', background: 'transparent', border: 'none',
                color: ORANGE, fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                transition: 'background 0.2s',
              }}>{txt.install}</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ ÍCONO FLOTANTE — se oculta cuando el bot está abierto ══ */}
      {state === 'icon' && !isBotOpen && (
        <div style={{
          position:  'fixed',
          bottom:    '130px',
          right:     '16px',
          zIndex:    2147483647,
          animation: 'pwaIconPop 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <button onClick={handleIconClick} style={{
            width: '54px', height: '54px', borderRadius: '16px',
            border: `2.5px solid rgba(251,103,11,0.5)`,
            background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 6px 20px rgba(251,103,11,0.45)`,
            animation: 'pwaPulse 2.5s ease-in-out infinite',
            position: 'relative',
          }}>
            <img src="/pwa-192x192.png" width="32" height="32"
              alt="Instalar Grupo Ortiz App" style={{ borderRadius: '7px' }} />
            <div style={{
              position: 'absolute', top: '-4px', right: '-4px',
              width: '16px', height: '16px', borderRadius: '50%',
              background: '#ff3b30', border: '2.5px solid #141414',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'pwaNotifDot 2s ease infinite',
            }}>
              <span style={{ fontSize: '9px', color: '#fff', fontWeight: 800 }}>1</span>
            </div>
          </button>

          <button onClick={handleBubbleClose} style={{
  position: 'absolute', top: '-14px', right: '-14px',
  width: '44px', height: '44px', borderRadius: '50%',
  border: 'none', background: 'transparent',
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}}>
  <span style={{
    width: '20px', height: '20px', borderRadius: '50%',
    border: '1.5px solid rgba(255,255,255,0.15)',
    background: '#1a1a1a', color: 'rgba(255,255,255,0.5)',
    fontSize: '10px', fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    lineHeight: 1, pointerEvents: 'none',
  }}>✕</span>
</button>
        </div>
      )}
    </>
  );
}