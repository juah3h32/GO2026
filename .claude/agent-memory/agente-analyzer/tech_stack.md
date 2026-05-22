---
name: Tech Stack
description: Frameworks, libraries, and configuration choices that shape the codebase
type: project
---

**Core framework**: Astro 5.16 with `output: 'server'` and `@astrojs/vercel/serverless` adapter. Most pages opt into `export const prerender = true` so they're statically generated per locale; only API routes and a few dynamic spots run server-side. View Transitions are enabled on some pages (`astro:page-load` listeners).

**UI libraries**:
- React 19 (via `@astrojs/react`) for interactive components — usually mounted with `client:idle` or `client:load`.
- Tailwind 3.4 (`@astrojs/tailwind`) — extended with `--background/--foreground/--primary` HSL variables, very minimal config; bulk of styling is in raw CSS files under `src/styles/`.
- Framer Motion (`motion`) — used in `ui/blur-fade.tsx` and other reveal animations.
- GSAP 3.14 + ScrollTrigger — sticky sections, cinematic globe, distribuidor scenes, BuyButton truck animation.
- Lenis 1.3 — smooth scroll (used selectively).
- Lucide React + Remixicon (CDN) — icon sets.
- shadcn-style helpers via `clsx` + `tailwind-merge` (`src/lib/utils.ts` `cn()`).

**3D/Graphics**:
- Three.js 0.182 (forced bundled via `vite.ssr.noExternal: ['three']`) + `@react-three/fiber` + `@react-three/drei`.
- Cesium 1.136 (also `noExternal`, with `CESIUM_BASE_URL = '/cesium'`).
- d3-geo (used in WireframeDottedGlobe for orthographic projection).

**Backend libraries**:
- `@libsql/client` — Turso SQLite over HTTP.
- `jose` — JWT sign/verify.
- `bcryptjs` — password hashing (auto-migrates legacy plaintext on first login).
- `web-push` — VAPID push (kept external in SSR).
- `puppeteer-core` + `@sparticuz/chromium` — PDF generation (kept external in SSR; falls back to local Chrome in dev).
- `pdf-parse` — CV text extraction (kept external; CJS/ESM double-wrap normalization needed).
- `@anthropic-ai/sdk` — Claude for recruitment-ia ranking.
- `openai`, `@google/generative-ai` — alt LLMs (OpenAI is primary for chat).
- `googleapis` — Search Console.
- `formidable` — multipart parser for CV upload (custom body parser bypass).
- `msedge-tts` / `google-tts-api` — TTS for BotGO.
- `astro-cloudinary` — `<CldVideoPlayer>` direct integration (separate from custom `CldVideoPlayer.astro` component).

**PWA**: `@vite-pwa/astro` with `injectManifest` strategy, custom SW at `src/sw.js` using Workbox (precaching, NetworkFirst for grupo-ortiz.com, push handler, notification click). Install prompt managed via `InstallPWA.jsx` + `window.beforeinstallprompt` capture inline in BaseLayout.

**Env prefixes** (allowed by Vite): `TURSO_`, `JWT_`, `OPENAI_`, `NOTIFY_`, `VAPID_`. Plus `PUBLIC_CLOUDINARY_CLOUD_NAME`, `GSC_*`, `CHROME_PATH`.

**Path alias**: `@/*` -> `./src/*` (vite + tsconfig).

**CSP**: enforced both in `astro.config.mjs` (dev server) and `vercel.json` (production). Allows openai.com, contentsquare, GA, Cloudinary, unpkg, jsdelivr, cdnjs, fonts.

**Deploy quirks**: `vercel.json` sets HSTS, X-Frame-Options=SAMEORIGIN, Permissions-Policy with microphone=self (required for BotGO voice), and a strict CSP.
