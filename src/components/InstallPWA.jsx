import { useState, useEffect, useRef } from 'react';

const isDev = import.meta.env.DEV;
const AUTO_DISMISS_MS = 5000; // ⏱ segundos antes de auto-cerrarse

export default function InstallPWA({ pwa }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [state, setState] = useState('hidden');
  const [progress, setProgress] = useState(100); // barra de progreso 100→0
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

  // ─── Arranca el contador de auto-dismiss ───────────────────────────────────
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

  // ─── Cancela el contador (cuando el usuario interactúa) ───────────────────
  const cancelAutoDismiss = () => {
    if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
    if (progressRef.current)    clearInterval(progressRef.current);
    setProgress(100);
  };

  // ─── Efecto principal ──────────────────────────────────────────────────────
  useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile) return;

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
          const saw = localStorage.getItem('pwa-saw-notification');
          return saw ? 'icon' : 'notification';
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

  // ─── Handlers ──────────────────────────────────────────────────────────────
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
    setState('exiting');
    timeoutRef.current = setTimeout(() => setState('icon'), 400);
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
        @keyframes pwaDropDown {
          from { transform: translateX(-50%) translateY(-120%); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0);     opacity: 1; }
        }
        @keyframes pwaShrinkToBubble {
          from { transform: translateX(-50%) translateY(0) scale(1);   opacity: 1; }
          to   { transform: translateX(-50%) translateY(0) scale(0.1); opacity: 0; }
        }
        @keyframes pwaIconPop {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes pwaPulse {
          0%, 100% { box-shadow: 0 4px 16px rgba(255,102,0,0.3); }
          50%      { box-shadow: 0 4px 24px rgba(255,102,0,0.6); }
        }
      `}</style>

      {/* ── NOTIFICACIÓN ── */}
      {(state === 'notification' || state === 'exiting') && (
        <div
          onMouseEnter={cancelAutoDismiss}
          onTouchStart={cancelAutoDismiss}
          style={{
            position:  'fixed',
            top:       '12px',
            left:      '50%',
            transform: 'translateX(-50%)',
            width:     'calc(100% - 24px)',
            maxWidth:  '340px',
            zIndex:    2147483647,
            animation: state === 'exiting'
              ? 'pwaShrinkToBubble 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards'
              : 'pwaDropDown 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: state === 'exiting' ? 'none' : 'auto',
          }}
        >
          <div style={{
            background:          'rgba(25, 25, 25, 0.98)',
            backdropFilter:      'blur(20px)',
            WebkitBackdropFilter:'blur(20px)',
            borderRadius:        '14px',
            overflow:            'hidden',
            boxShadow:           '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
          }}>

            {/* Header */}
            <div style={{
              display:      'flex',
              alignItems:   'center',
              gap:          '6px',
              padding:      '10px 14px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              {/* ✅ alt agregado */}
              <img
                src="/pwa-192x192.png"
                width="16"
                height="16"
                alt="Grupo Ortiz App"
                style={{ borderRadius: '4px' }}
              />
              <span style={{
                fontSize:      '11px',
                color:         'rgba(255,255,255,0.45)',
                fontWeight:    600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}>
                {txt.appName}
              </span>
              <span style={{
                fontSize:   '11px',
                color:      'rgba(255,255,255,0.25)',
                marginLeft: 'auto',
              }}>
                {txt.timeLabel}
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* ✅ alt agregado */}
                <img
                  src="/pwa-192x192.png"
                  width="42"
                  height="42"
                  alt="Grupo Ortiz App"
                  style={{ borderRadius: '10px', flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#fff', marginBottom: '2px' }}>
                    {txt.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.3 }}>
                    {txt.description}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Barra de progreso del auto-dismiss ── */}
            <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)' }}>
              <div style={{
                height:     '2px',
                width:      `${progress}%`,
                background: 'linear-gradient(90deg, #ff6600, #ff8533)',
                transition: 'width 0.08s linear',
              }} />
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={handleDismissNotification} style={{
                flex:       1,
                padding:    '12px',
                background: 'transparent',
                border:     'none',
                borderRight:'1px solid rgba(255,255,255,0.06)',
                color:      'rgba(255,255,255,0.5)',
                fontSize:   '13px',
                fontWeight: 600,
                cursor:     'pointer',
              }}>
                {txt.notNow}
              </button>
              <button onClick={handleInstall} style={{
                flex:       1,
                padding:    '12px',
                background: 'transparent',
                border:     'none',
                color:      '#ff6600',
                fontSize:   '13px',
                fontWeight: 700,
                cursor:     'pointer',
              }}>
                {txt.install}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ICONO FLOTANTE ── */}
      {state === 'icon' && (
        <div style={{
          position:  'fixed',
          bottom:    '140px',
          right:     '16px',
          zIndex:    2147483647,
          animation: 'pwaIconPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          <button onClick={handleIconClick} style={{
            width:         '52px',
            height:        '52px',
            borderRadius:  '50%',
            border:        'none',
            background:    'linear-gradient(135deg, #ff6600, #ff8533)',
            cursor:        'pointer',
            display:       'flex',
            alignItems:    'center',
            justifyContent:'center',
            boxShadow:     '0 4px 16px rgba(255,102,0,0.4)',
            animation:     'pwaPulse 2s ease-in-out infinite',
            position:      'relative',
          }}>
            {/* ✅ alt agregado */}
            <img
              src="/pwa-192x192.png"
              width="30"
              height="30"
              alt="Instalar Grupo Ortiz App"
              style={{ borderRadius: '6px' }}
            />
            <div style={{
              position:      'absolute',
              top:           '-2px',
              right:         '-2px',
              width:         '18px',
              height:        '18px',
              borderRadius:  '50%',
              background:    '#ff3333',
              border:        '2px solid #1a1a1a',
              display:       'flex',
              alignItems:    'center',
              justifyContent:'center',
            }}>
              <span style={{ fontSize: '10px', color: '#fff', fontWeight: 700 }}>1</span>
            </div>
          </button>

          <button onClick={handleBubbleClose} style={{
            position:      'absolute',
            top:           '-6px',
            left:          '-6px',
            width:         '22px',
            height:        '22px',
            borderRadius:  '50%',
            border:        '2px solid #333',
            background:    '#1a1a1a',
            color:         'rgba(255,255,255,0.6)',
            fontSize:      '12px',
            fontWeight:    700,
            cursor:        'pointer',
            display:       'flex',
            alignItems:    'center',
            justifyContent:'center',
            lineHeight:    1,
          }}>
            ✕
          </button>
        </div>
      )}
    </>
  );
}