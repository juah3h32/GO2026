import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import AstroPWA from '@vite-pwa/astro';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://grupo-ortiz.com',

  output: 'server',
  adapter: vercel({
    // Pasar headers CSP directamente al adapter también,
    // para que no los sobrescriba en rutas serverless
    isr: false,
  }),

  server: {
    host: true,
    port: 4321,
    allowedHosts: 'all',
  },

  integrations: [
    react(),
    mdx(),
    sitemap(),
    AstroPWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      devOptions: {
        enabled: true,
        type: 'module',
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
    { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    { src: 'pwa-monochrome.png', sizes: '192x192', type: 'image/png', purpose: 'monochrome' } // ✅ nuevo
  ]
},
      injectManifest: {
        maximumFileSizeToCacheInBytes: 45000000,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
      }
    })
  ],

vite: {
  envPrefix: ['TURSO_', 'JWT_', 'OPENAI_', 'NOTIFY_', 'VAPID_'],
  ssr: {
    noExternal: ['three', 'cesium'],
    // puppeteer-core, chromium y pdf-parse deben quedar externos en SSR (binarios/Node nativos)
    external: ['puppeteer-core', '@sparticuz/chromium', 'pdf-parse', 'web-push'],
  },
    define: {
      CESIUM_BASE_URL: JSON.stringify('/cesium')
    },
    // Permite que Vite no bloquee recursos externos en build
    server: {
      allowedHosts: true,
      headers: {
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://www.googletagmanager.com https://t.contentsquare.net https://www.google-analytics.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
          "font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net",
          "img-src 'self' data: https:",
          "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://t.contentsquare.net",
          "frame-src 'self' https://my.matterport.com",
          "media-src 'self' blob:",
          "worker-src 'self' blob:"
        ].join('; ')
      }
    }
  }
});
