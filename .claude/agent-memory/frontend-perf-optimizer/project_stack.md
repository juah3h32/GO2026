---
name: GO2026 Project Stack
description: Core tech stack, fonts, asset architecture, and key performance-relevant config for grupo-ortiz.com
type: project
---

Astro 5 SSR on Vercel (serverless adapter), React 19 for islands, Tailwind CSS, i18n with 5 languages (es/en/pt/zh/ar), PWA via @vite-pwa/astro.

**Why:** Commercial B2B site for a Mexican polymer manufacturer. Performance matters for international SEO across 5 locales.

**How to apply:** Always consider SSR/SSG trade-offs per page. `prerender = true` is used on index and most product pages. Global output is `server`. Pages are at `src/pages/[lang]/`.

Key dependencies: gsap + lenis (smooth scroll), framer-motion (installed but only used in unused ui/ components), three.js + @react-three/fiber (installed, 3D components not wired to any page), cesium (noExternal in vite SSR config), astro-cloudinary for video.

**Font strategy:** Custom fonts (MorganitePro, NeueMontreal, Morganite, Helony, Rolide, MyriadPro, Moisette, SF-Pro). All declared with `font-display: swap` in typography.css. fonts-inline.css (~118KB raw CSS, 4 base64 fonts) uses `font-display: block` — FOIT risk. CRITICAL: woff2 files missing for most fonts except NeueMontreal-Medium.woff2. Browser falls back to OTF/TTF on every page.

**CSS architecture:**
- `typography.css` — font-face declarations, type scale, CSS custom props (all pages via BaseLayout)
- `global.css` — Tailwind base + site-wide base styles (all pages via BaseLayout)
- `fonts-inline.css` — base64 inlined fonts (~118KB, bloats initial CSS parse, font-display: block = FOIT)
- `backgrounds.css` — loaded globally in BaseLayout
- Per-page CSS files imported in page frontmatter (correct scoping)

**Animation libraries:**
- GSAP 3 + ScrollTrigger — npm (bundled), ALSO duplicated via CDN on distribuidor page (double load)
- Lenis smooth scroll — npm bundled
- Three.js r128 — CDN on distribuidor (render-blocking even with defer attr + is:inline conflict)
- VanillaTilt 1.7.0 — CDN on distribuidor (same issue)
- AOS 2.3.1 — CDN on social page (deferred via preload trick, acceptable)

**Astro client directives in use:**
- client:idle — HeroHeadingTypewriter (hero heading typewriter — should be client:visible), InstallPWA, BotGO
- client:load — VacantesPage, VacantesNotifPrompt (vacantes page — appropriate for above-fold form)
- client:visible — ImpactoTimeline (social page — correct)

**Video assets:**
- Hero video: astro-cloudinary CldVideoPlayer (from npm astro-cloudinary), poster generated server-side with f_jpg,q_auto,so_0
- 2nd video (global section): also CldVideoPlayer, no preload concern
- Parallax section: /videos/4K.mp4 lazy-loaded via IntersectionObserver with data-src — correct
- ScrollVideoSection.astro: preload="auto" — incorrect, should be preload="none" with lazy load
- Product pages (stretch, empaques, rafias, sacos, esquineros, arpillas, cuerdas, naturizable): all use preload="auto" — each fetches full video on page load

**Preload/preconnect status:**
- NO preconnect to res.cloudinary.com in BaseLayout — missing critical hint
- NO preload for hero video poster in BaseLayout or index.astro head slot
- NO font preload for MorganitePro or NeueMontreal in BaseLayout
- catalogo.astro and productos.astro correctly use <link rel="preload" as="image"> for first image

**vercel.json cache headers:**
- Security headers present (HSTS, X-Frame-Options, CSP, etc.)
- MISSING: Cache-Control headers for static assets (_astro/, fonts/, images/, videos/)
- MISSING: immutable cache headers for hashed JS/CSS bundles

**Service Worker:**
- Strategy: NetworkFirst for all grupo-ortiz.com routes — good for freshness
- SW update polling: every 30 seconds — aggressive, wastes network requests
- globPatterns: caches JS, CSS, HTML, ICO — excludes parallax/ and videos/ (correct)

**Bundle concerns:**
- cesium in SSR noExternal — pulled into Vite bundle even though no page uses CesiumMap
- three.js in SSR noExternal — same issue, no page actively imports Scene3D or FactoryModel3D
- framer-motion installed, only used in src/components/ui/ files not wired to any page
- puppeteer/chromium: correctly in SSR external, server-side API only
- @sparticuz/chromium: large binary, server-side only — no client impact
- `motion` package installed separately from `framer-motion` (duplicate animation library)

**Brand color:** `#fb670b` (orange) — CSS variable `--dist-primary` / `--clr-accent`

**i18n:** Translation objects imported from `src/i18n/[lang].ts`. Pages at `src/pages/[lang]/` with `getStaticPaths()`.
