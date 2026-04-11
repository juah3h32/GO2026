// public/push-sw.js — Service Worker de push puro, sin workbox ni imports.
// Independiente del PWA SW. Se registra solo para manejar notificaciones.

self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e  => e.waitUntil(clients.claim()));

self.addEventListener('push', (event) => {
  if (!event.data) return;
  let data = {};
  try { data = event.data.json(); } catch { data = { body: event.data.text() }; }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Grupo Ortiz', {
      body:     data.body  || 'Nueva vacante disponible en Morelia.',
      icon:     '/pwa-192x192.png',
      badge:    '/pwa-192x192.png',
      tag:      'vacante-go',
      renotify: true,
      data:     { url: data.url || '/es/vacantes' },
      actions: [
        { action: 'ver',    title: 'Ver vacantes' },
        { action: 'cerrar', title: 'Cerrar'       },
      ],
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'cerrar') return;
  const url = event.notification.data?.url || '/es/vacantes';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        if ('focus' in w) return w.focus();
      }
      return clients.openWindow(url);
    })
  );
});
