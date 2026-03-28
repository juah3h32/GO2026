import { defineConfig } from 'astro/config';
import fs from 'fs';

// 1. Verificamos si los archivos existen antes de intentar usarlos.
// Esto evita el error en Vercel (donde NO existen).
const httpsConfig = () => {
  if (fs.existsSync('./localhost-key.pem') && fs.existsSync('./localhost.pem')) {
    return {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    };
  }
  return false; // Si no existen (como en Vercel), devolvemos false (sin HTTPS local)
};

export default defineConfig({
  build: {
    inlineStylesheets: 'auto', // CSS < 4KB se inlinea automáticamente
  },
  vite: {
    server: {
      https: httpsConfig(), // <-- 2. Usamos la función de verificación aquí
    },
  },

  // Tu configuración de CSP sigue igual
  server: {
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.contentsquare.net https://www.google-analytics.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://unpkg.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://unpkg.com",
        "font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net https://unpkg.com",
        "img-src 'self' data: https:",
        "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://*.contentsquare.net https://api.openai.com https://speech.googleapis.com https://translate.google.com https://res.cloudinary.com https://analytics-api-s.cloudinary.com https://unpkg.com",
        "frame-src 'self' https://my.matterport.com",
        "media-src 'self' blob: data: https://res.cloudinary.com",
        "worker-src 'self' blob:",
      ].join('; '),
    },
  },
});