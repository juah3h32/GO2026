import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import AstroPWA from '@vite-pwa/astro';
import vercel from '@astrojs/vercel/serverless';
import path from 'path';
import basicSsl from '@vitejs/plugin-basic-ssl';

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
    tailwind(),
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
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      injectManifest: {
        maximumFileSizeToCacheInBytes: 2000000,
        globPatterns: ['**/*.{js,css,html,ico}'],
        globIgnores: ['**/parallax/**', '**/videos/**'],
      }
    })
  ],

vite: {
  plugins: [basicSsl()],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  // ⚠️ CRÍTICO: Whitelist de prefijos de env seguros para SSR
  // Secretos como CRON_SECRET_EXTERNAL, WAHOOKS_TOKEN deben accederse SOLO via process.env en server
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
      allowedHosts: 'all',
      headers: {
        // ⚠️ ADVERTENCIA: CSP actual es muy permisiva para desarrollo
        // En producción, eliminar 'unsafe-inline' y 'unsafe-eval', usar nonces
        'Content-Security-Policy': [
          "default-src 'self'",
          // script-src: eliminar 'unsafe-inline' en producción. Usar nonces en inline scripts o cargar externos con SRI
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://www.googletagmanager.com https://t.contentsquare.net https://www.google-analytics.com",
          // style-src: considerar usar CSS-in-JS o archivos externos en producción
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
          "font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net",
          "img-src 'self' data: https:",
          "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://t.contentsquare.net https://api.openai.com",
          "frame-src 'self' https://my.matterport.com",
          "media-src 'self' blob:",
          "worker-src 'self' blob:",
          "object-src 'none'" // Deshabilitar plugins legacy
        ].join('; ')
      }
    }
  }
});
