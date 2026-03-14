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
});