import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import AstroPWA from '@vite-pwa/astro';
import node from '@astrojs/node';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  site: 'https://grupo-ortiz.com',

  output: 'server',
  adapter: node({ mode: 'standalone' }),

  // ← AÑADIDO AQUÍ AFUERA
  server: {
    host: true,
    port: 4321
  },

  integrations: [
    react(),
    mdx(),
    sitemap(),
    AstroPWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'GO - Grupo Ortiz',
        short_name: 'GO',
        description: 'UI GO',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 45000000,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/grupo-ortiz\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 86400 }
            }
          }
        ]
      }
    })
  ],

  vite: {
   
    ssr: {
      noExternal: ['three', 'cesium']
    },

    define: {
      CESIUM_BASE_URL: JSON.stringify('/cesium')
    }
  }
});