// src/pages/api/push/test.js — página HTML de diagnóstico push en el celular
export const prerender = false;

export async function GET({ request }) {
  if (!import.meta.env.DEV) return new Response('Not Found', { status: 404 });

  const url = new URL(request.url);
  const vapidPublic = import.meta.env.VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY || '';

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Push Test</title>
  <style>
    body { font-family: -apple-system, sans-serif; padding: 16px; background: #0f0f0f; color: #fff; }
    h2 { color: #FB670B; margin: 0 0 16px; }
    .row { display: flex; justify-content: space-between; align-items: center;
           padding: 10px 14px; margin: 6px 0; border-radius: 10px; background: #1a1a1a; font-size: 14px; }
    .ok  { color: #4ade80; font-weight: 700; }
    .err { color: #f87171; font-weight: 700; }
    .warn{ color: #fbbf24; font-weight: 700; }
    button { width: 100%; padding: 14px; margin: 10px 0; border-radius: 12px; border: none;
             background: #FB670B; color: #fff; font-size: 16px; font-weight: 700; cursor: pointer; }
    #log { background: #111; border-radius: 10px; padding: 12px; margin-top: 10px;
           font-size: 12px; font-family: monospace; white-space: pre-wrap; color: #a0a0a0;
           min-height: 80px; max-height: 300px; overflow-y: auto; }
    .step { color: #60a5fa; }
    .good { color: #4ade80; }
    .bad  { color: #f87171; }
  </style>
</head>
<body>
  <h2>Push Diagnostic</h2>

  <div class="row">
    <span>Notification API</span>
    <span id="chkNotif">...</span>
  </div>
  <div class="row">
    <span>ServiceWorker API</span>
    <span id="chkSW">...</span>
  </div>
  <div class="row">
    <span>PushManager API</span>
    <span id="chkPM">...</span>
  </div>
  <div class="row">
    <span>Permiso actual</span>
    <span id="chkPerm">...</span>
  </div>
  <div class="row">
    <span>Protocolo</span>
    <span id="chkProto">...</span>
  </div>
  <div class="row">
    <span>SW registrado</span>
    <span id="chkReg">...</span>
  </div>
  <div class="row">
    <span>VAPID key</span>
    <span id="chkVapid">...</span>
  </div>

  <button onclick="runTest()">Probar suscripción completa</button>
  <div id="log">Toca el botón para probar...\n</div>

  <script>
    const vapidKey = '${vapidPublic}';
    const log = document.getElementById('log');

    function addLog(msg, cls = '') {
      log.innerHTML += '<span class="' + cls + '">' + msg + '</span>\\n';
      log.scrollTop = log.scrollHeight;
    }

    function setCheck(id, ok, text) {
      const el = document.getElementById(id);
      el.textContent = text;
      el.className = ok === true ? 'ok' : ok === false ? 'err' : 'warn';
    }

    // Checks rápidos
    setCheck('chkNotif',  'Notification'   in window, 'Notification'   in window ? 'OK' : 'NO');
    setCheck('chkSW',     'serviceWorker'  in navigator, 'serviceWorker' in navigator ? 'OK' : 'NO');
    setCheck('chkPM',     'PushManager'    in window, 'PushManager'    in window ? 'OK' : 'NO');
    setCheck('chkPerm',   null, Notification.permission);
    setCheck('chkProto',  location.protocol === 'https:', location.protocol);
    setCheck('chkVapid',  vapidKey.length > 20, vapidKey ? vapidKey.slice(0,20)+'...' : 'FALTA');

    navigator.serviceWorker.getRegistrations().then(regs => {
      setCheck('chkReg', regs.length > 0,
        regs.length > 0 ? regs.length + ' SW(s): ' + regs.map(r => r.scope).join(', ') : 'Ninguno');
    });

    function urlBase64ToUint8Array(base64) {
      const pad = '='.repeat((4 - base64.length % 4) % 4);
      const b64 = (base64 + pad).replace(/-/g,'+').replace(/_/g,'/');
      return Uint8Array.from([...atob(b64)].map(c => c.charCodeAt(0)));
    }

    async function runTest() {
      log.innerHTML = '';
      addLog('=== Iniciando prueba ===', 'step');

      try {
        // 1. Permiso
        addLog('1. Solicitando permiso...', 'step');
        const perm = await Notification.requestPermission();
        addLog('   Permiso: ' + perm, perm === 'granted' ? 'good' : 'bad');
        if (perm !== 'granted') return;

        // 2. Registrar SW
        addLog('2. Registrando push-sw.js...', 'step');
        let reg;
        try {
          reg = await navigator.serviceWorker.register('/push-sw.js', { scope: '/' });
          addLog('   Registrado. Estado: ' + (reg.active?.state || reg.installing?.state || reg.waiting?.state || 'desconocido'), 'good');
        } catch(e) {
          addLog('   Error registro: ' + e.message, 'bad');
          // Fallback: usar SW existente
          addLog('   Intentando SW existente...', 'step');
          reg = await Promise.race([
            navigator.serviceWorker.ready,
            new Promise((_,r) => setTimeout(() => r(new Error('timeout 5s')), 5000))
          ]);
          addLog('   SW fallback activo', 'good');
        }

        // 3. Esperar activate
        addLog('3. Esperando activación...', 'step');
        if (!reg.active) {
          await new Promise(resolve => {
            const sw = reg.installing || reg.waiting;
            if (sw) {
              sw.addEventListener('statechange', function() {
                addLog('   Estado: ' + this.state, 'step');
                if (this.state === 'activated') resolve();
              });
            } else {
              setTimeout(resolve, 1000);
            }
          });
        }
        addLog('   Activo', 'good');

        // 4. Subscribe
        addLog('4. Suscribiendo a push...', 'step');
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey)
        });
        addLog('   Suscrito OK: ' + sub.endpoint.slice(0, 50) + '...', 'good');

        // 5. Guardar en servidor
        addLog('5. Guardando en servidor...', 'step');
        const res = await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: sub.toJSON() })
        });
        const data = await res.json();
        if (data.ok) {
          addLog('   Guardado en Turso OK', 'good');
          addLog('\\n=== ÉXITO — ahora crea una vacante activa ===', 'good');
        } else {
          addLog('   Error servidor: ' + JSON.stringify(data), 'bad');
        }

      } catch(e) {
        addLog('ERROR: [' + e.name + '] ' + e.message, 'bad');
      }
    }
  </script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
