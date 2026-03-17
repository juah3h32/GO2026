import { defineConfig } from 'astro/config';
import fs from 'fs';

export default defineConfig({
  vite: {
    server: {
      https: {
        key: fs.readFileSync('./localhost-key.pem'),
        cert: fs.readFileSync('./localhost.pem'),
      },
    },
  },

  server: {
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://t.contentsquare.net https://www.google-analytics.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://unpkg.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://unpkg.com",
        "font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net https://unpkg.com",
        "img-src 'self' data: https:",
        "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://t.contentsquare.net https://api.openai.com https://speech.googleapis.com https://translate.google.com https://res.cloudinary.com",
        "frame-src 'self' https://my.matterport.com",
        "media-src 'self' blob: data: https://res.cloudinary.com",
        "worker-src 'self' blob:",
      ].join('; '),
    },
  },
});
