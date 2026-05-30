---
name: GO2026 Project Stack
description: Core tech stack, fonts, asset architecture, and key performance-relevant config for grupo-ortiz.com
type: project
---

Astro 5 SSR on Vercel (serverless adapter), React 19 for islands, Tailwind CSS, i18n with 5 languages (es/en/pt/zh/ar), PWA via @vite-pwa/astro.

**Why:** Commercial B2B site for a Mexican polymer manufacturer. Performance matters for international SEO across 5 locales.

**How to apply:** Always consider SSR/SSG trade-offs per page. `prerender = true` is used on index and most product pages. Global output is `server`. Pages are at `src/pages/[lang]/`.

Key dependencies: gsap + lenis (smooth scroll), framer-motion (installed but only used in unused ui/ components), three.js + @react-three/fiber (installed, 3D components not wired to any page), cesium (noExternal in vite SSR config), astro-cloudinary for video.

**Font strategy:** Custom fonts (MorganitePro, NeueMontreal, Morganite, Helony, Rolide, MyriadPro, Moisette, SF-Pro). All declared with `font-display: swap` in typography.css. fonts-inline.css (~118KB, 3 base64 @font-faces) was previously imported statically (blocking). As of May 2026, removed from Astro import, copied to `public/styles/fonts-inline.css`, and loaded non-blocking via `<link media="print" onload="this.media='all'">` in BaseLayout. Vercel cache: immutable for /styles/.

**CSS architecture:**
- `typography.css` — font-face declarations, type scale, CSS custom props (all pages via BaseLayout)
- `global.css` — Tailwind base + site-wide base styles (all pages via BaseLayout)
- `fonts-inline.css` — base64 inlined fonts (~118KB, bloats initial CSS parse, font-display: block = FOIT)
- `backgrounds.css` — loaded globally in BaseLayout
- Per-page CSS files imported in page frontmatter (correct scoping)

**Animation libraries:**
- GSAP 3 + ScrollTrigger — npm (bundled). Product pages (cuerdas, rafias, arpillas, sacos, esquineros, stretch-film, empaques-flexibles) previously also loaded GSAP from unpkg CDN — REMOVED May 2026, replaced with CSS keyframe (`@keyframes _anim-fade-in` in cuerdas.css + `.js-animating` class toggle).
- Lenis smooth scroll — npm bundled
- Three.js — dynamic `import('three')` in distribuidor.astro, desktop-only guard — OK. NOT used anywhere else.
- VanillaTilt — dynamic `import('vanilla-tilt')` in distribuidor.astro — lazy, OK.
- AOS 2.3.1 — CDN on social page (deferred via preload trick, acceptable)

**Astro client directives in use:**
- client:idle — HeroHeadingTypewriter (hero heading typewriter — should be client:visible), InstallPWA, BotGO
- client:load — VacantesPage, VacantesNotifPrompt (vacantes page — appropriate for above-fold form)
- client:visible — ImpactoTimeline (social page — correct)

**Video assets:**
- Hero video: astro-cloudinary CldVideoPlayer (from npm astro-cloudinary), poster generated server-side with f_jpg,q_auto,so_0
- Product pages: All 7 product detail pages now use `preload="metadata"` for index=0 video only, `preload="none"` for all others. All have `poster` from Cloudinary `f_jpg,q_auto,so_0` pattern. First video poster also gets `<link rel="preload" fetchpriority="high">` in head slot.
- ScrollVideoSection.astro: preload="auto" — still incorrect, should be preload="none" with lazy load (not fixed yet)

**Preload/preconnect status:**
- preconnect to res.cloudinary.com present in BaseLayout (added previously)
- Hero video poster preloaded in index.astro head slot (fetchpriority high)
- Product page first-video poster now preloaded in each page's head slot (May 2026)
- NO font preload for MorganitePro or NeueMontreal in BaseLayout (fonts-inline.css handles this via swap)

**vercel.json cache headers:**
- Security headers present (HSTS, X-Frame-Options, CSP, etc.)
- /_astro/*: immutable, 1yr
- /fonts/*: immutable, 1yr
- /styles/*: immutable, 1yr (added May 2026)
- /images/*: 7d + stale-while-revalidate 1d

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
