// src/sw.js — Service Worker personalizado (injectManifest strategy)
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

self.skipWaiting();
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST || []);

registerRoute(
  ({ url }) => url.origin === 'https://grupo-ortiz.com',
  new NetworkFirst({
    cacheName: 'pages-cache',
    plugins: [],
  })
);

// ── Push: mostrar notificación ─────────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data = {};
  try { data = event.data.json(); } catch { data = { body: event.data.text() }; }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Grupo Ortiz', {
      body:     data.body  || 'Nueva vacante disponible — ¡Aplica ahora!',
      icon:     '/pwa-192x192.png',      // cajón de notificaciones (con color)
      badge:    '/pwa-monochrome.png',   // ✅ barra superior (blanco/transparente)
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

// ── Clic en notificación: abrir la página ──────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'cerrar') return;

  const url = event.notification.data?.url || '/es/vacantes';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      const match = wins.find(w => w.url.includes(url));
      if (match && 'focus' in match) return match.focus(); // ya estaba abierta
      return clients.openWindow(url);                      // abrir nueva pestaña
    })
  );
});