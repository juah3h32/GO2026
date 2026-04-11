// src/components/VacantesNotifPrompt.jsx
import { useState, useEffect } from 'react';

function urlBase64ToUint8Array(base64) {
  const pad = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + pad).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from([...atob(b64)].map(c => c.charCodeAt(0)));
}

function RobotIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none" width="48" height="48">
      <defs>
        <linearGradient id="vnRG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FB670B"/><stop offset="100%" stopColor="#D35400"/>
        </linearGradient>
      </defs>
      <line x1="20" y1="35" x2="15" y2="20" stroke="#FB670B" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="15" cy="20" r="4" fill="#FB670B"/>
      <line x1="80" y1="35" x2="85" y2="20" stroke="#FB670B" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="85" cy="20" r="4" fill="#FB670B"/>
      <circle cx="50" cy="55" r="40" fill="url(#vnRG)"/>
      <ellipse cx="50" cy="58" rx="32" ry="30" fill="#FFF5E6"/>
      <rect x="25" y="45" width="50" height="22" rx="10" fill="#FB670B"/>
      <circle cx="38" cy="56" r="5" fill="#FFD700"/>
      <circle cx="62" cy="56" r="5" fill="#FFD700"/>
      <circle cx="40" cy="54" r="2" fill="rgba(255,255,255,0.6)"/>
      <circle cx="64" cy="54" r="2" fill="rgba(255,255,255,0.6)"/>
      <ellipse cx="50" cy="78" rx="6" ry="2" fill="#D35400" opacity="0.8"/>
    </svg>
  );
}

const KEY = 'vnp-until';

export default function VacantesNotifPrompt() {
  const [show,  setShow]  = useState(false);
  // 'idle' | 'loading' | 'success' | 'denied' | 'unsupported' | 'ios'
  const [phase, setPhase] = useState('idle');

  useEffect(() => {
    // Revisar si ya lo descartó
    try {
      const until = localStorage.getItem(KEY);
      if (until && Date.now() < Number(until)) return;
    } catch {}

    // Mostrar tras 1.5 s
    const t = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    try { localStorage.setItem(KEY, String(Date.now() + 7 * 86_400_000)); } catch {}
    setShow(false);
  }

  async function activar() {
    // ── Detectar iOS sin PWA ──────────────────────────────────────────────────
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isPWA = window.matchMedia('(display-mode: standalone)').matches
               || window.navigator.standalone === true;
    if (isIOS && !isPWA) { setPhase('ios'); return; }

    // ── HTTP en red local (no localhost) — necesita HTTPS ─────────────────────
    const isHttp     = location.protocol === 'http:';
    const isLocalNet = /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(location.hostname);
    if (isHttp && isLocalNet) { setPhase('http'); return; }

    // ── Verificar soporte real ────────────────────────────────────────────────
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('[push] unsupported:', {
        Notification: 'Notification' in window,
        serviceWorker: 'serviceWorker' in navigator,
        PushManager: 'PushManager' in window,
      });
      setPhase('unsupported'); return;
    }

    // ── Ya tiene permiso ──────────────────────────────────────────────────────
    if (Notification.permission === 'granted') { setPhase('success'); setTimeout(dismiss, 2000); return; }

    setPhase('loading');

    try {
      // 1. Pedir permiso al sistema operativo
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') { setPhase('denied'); setTimeout(dismiss, 2500); return; }

      // 2. Obtener clave pública VAPID
      const kr = await fetch('/api/push/vapid-key');
      if (!kr.ok) throw new Error('Sin clave VAPID');
      const { publicKey } = await kr.json();

      // 3. Registrar el SW de push propio (independiente del PWA)
      let pushReg = await navigator.serviceWorker.register('/push-sw.js', {
        scope: '/push-scope/',
      }).catch(() => null);

      // Si falla el scope personalizado, intentar con el SW del PWA
      if (!pushReg) {
        pushReg = await Promise.race([
          navigator.serviceWorker.ready,
          new Promise((_, reject) => setTimeout(() => reject(new Error('sw-timeout')), 8000)),
        ]);
      } else {
        // Esperar a que se active (máx 6s)
        await Promise.race([
          new Promise(resolve => {
            if (pushReg.active) { resolve(); return; }
            const sw = pushReg.installing || pushReg.waiting;
            if (sw) sw.addEventListener('statechange', function () { if (this.state === 'activated') resolve(); });
            else resolve();
          }),
          new Promise(resolve => setTimeout(resolve, 6000)),
        ]);
        // Si después del timeout no está activo, forzar update
        if (!pushReg.active) await pushReg.update();
      }

      const sub = await pushReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      // 4. Guardar suscripción en servidor
      const sr = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });
      if (!sr.ok) throw new Error('Error guardando suscripción');

      setPhase('success');
      setTimeout(dismiss, 3000);
    } catch (e) {
      console.error('[push] ERROR:', e?.name, e?.message);
      if (e.message === 'sw-timeout') {
        setPhase('swpending');
      } else if (e?.name === 'NotAllowedError') {
        setPhase('denied');
      } else {
        // Mostrar el error real en consola para diagnóstico
        setPhase('denied');
      }
      setTimeout(dismiss, 3000);
    }
  }

  if (!show) return null;

  // ── Textos por fase ──────────────────────────────────────────────────────────
  const copy = {
    idle:        { title: '¿Buscas trabajo?',             sub: 'Activa las alertas y te avisamos cuando Grupo Ortiz publique una nueva vacante en Morelia.',        cta: true  },
    loading:     { title: 'Activando...',                  sub: 'Acepta el permiso que aparecerá en tu pantalla.',                                                   cta: false },
    success:     { title: '¡Listo, te tenemos en cuenta!', sub: 'Recibirás una alerta al instante cuando haya nueva vacante.',                                       cta: false },
    denied:      { title: 'Notificaciones bloqueadas',     sub: 'Puedes activarlas desde Configuración → Privacidad → Notificaciones en tu navegador.',              cta: false },
    unsupported: { title: 'Actualiza tu navegador',        sub: 'Asegúrate de usar Chrome actualizado. Si ya lo tienes, prueba desde el sitio en producción.',      cta: false },
    http:        { title: 'Requiere conexión segura',      sub: 'Las notificaciones funcionan en el sitio oficial (grupo-ortiz.com). En local accede por HTTPS.',    cta: false },
    swpending:   { title: 'Funciona en el sitio oficial',  sub: 'En local el servicio puede tardar. Entra a grupo-ortiz.com desde tu celular y actívalo ahí.',        cta: false },
    ios:         { title: 'Un paso antes en iPhone',       sub: 'Toca el ícono Compartir (⬆) → "Agregar a pantalla de inicio". Vuelve aquí y activa las alertas.', cta: false },
  }[phase];

  const barColor = phase === 'success' ? '#22c55e' : phase === 'denied' ? '#94a3b8' : '#FB670B';

  return (
    <>
      <style>{`
        /* Desktop: oculto */
        .vnp { display: none; }

        /* Mobile: visible */
        @media (max-width: 768px) {
          .vnp {
            display: block;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            z-index: 199998;
            padding-bottom: env(safe-area-inset-bottom, 0);
          }
          .vnp-card {
            margin: 0 10px 10px;
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 -1px 0 rgba(0,0,0,0.06), 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
            animation: vnpUp 0.4s cubic-bezier(0.34,1.5,0.64,1) both;
          }
          @keyframes vnpUp {
            from { opacity:0; transform:translateY(32px) scale(0.96); }
            to   { opacity:1; transform:translateY(0)    scale(1);    }
          }
          .vnp-stripe {
            height: 4px;
          }
          .vnp-body {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 14px 10px;
          }
          .vnp-avatar {
            flex-shrink: 0;
            width: 56px; height: 56px;
            background: #fff8f3;
            border: 1.5px solid rgba(251,103,11,0.18);
            border-radius: 16px;
            display: flex; align-items: center; justify-content: center;
            animation: vnpBob 2.2s ease-in-out infinite;
          }
          @keyframes vnpBob {
            0%,100% { transform: translateY(0);  }
            50%      { transform: translateY(-5px); }
          }
          .vnp-text { flex: 1; }
          .vnp-title {
            font-size: 15px;
            font-weight: 700;
            color: #111;
            margin: 0 24px 3px 0;
            line-height: 1.25;
            font-family: inherit;
          }
          .vnp-sub {
            font-size: 12.5px;
            color: #666;
            line-height: 1.5;
            margin: 0;
            font-family: inherit;
          }
          .vnp-actions {
            display: flex;
            gap: 8px;
            padding: 0 14px 14px;
          }
          .vnp-yes {
            flex: 1;
            padding: 12px 0;
            border-radius: 12px;
            border: none;
            background: #FB670B;
            color: #fff;
            font-weight: 700;
            font-size: 14.5px;
            cursor: pointer;
            font-family: inherit;
            box-shadow: 0 4px 16px rgba(251,103,11,0.38);
            -webkit-tap-highlight-color: transparent;
          }
          .vnp-yes:active { filter: brightness(0.88); }
          .vnp-no {
            padding: 12px 14px;
            border-radius: 12px;
            border: 1.5px solid #e5e7eb;
            background: transparent;
            color: #999;
            font-size: 13.5px;
            font-weight: 500;
            cursor: pointer;
            font-family: inherit;
            -webkit-tap-highlight-color: transparent;
          }
          .vnp-no:active { background: #f9f9f9; }
          .vnp-x {
            position: absolute;
            top: 12px; right: 12px;
            background: none; border: none;
            padding: 4px; cursor: pointer;
            color: #bbb; line-height: 1;
            -webkit-tap-highlight-color: transparent;
          }
        }
      `}</style>

      <div className="vnp" role="dialog" aria-label="Notificaciones de vacantes">
        <div className="vnp-card" style={{ position: 'relative' }}>

          <div className="vnp-stripe" style={{ background: barColor }} />

          <button className="vnp-x" onClick={dismiss} aria-label="Cerrar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <div className="vnp-body">
            <div className="vnp-avatar">
              {phase === 'success'
                ? <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                : phase === 'loading'
                ? <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FB670B" strokeWidth="2.2" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></path></svg>
                : <RobotIcon />
              }
            </div>
            <div className="vnp-text">
              <p className="vnp-title">{copy.title}</p>
              <p className="vnp-sub">{copy.sub}</p>
            </div>
          </div>

          {copy.cta && (
            <div className="vnp-actions">
              <button className="vnp-yes" onClick={activar}>Activar notificaciones</button>
              <button className="vnp-no"  onClick={dismiss}>Ahora no</button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
