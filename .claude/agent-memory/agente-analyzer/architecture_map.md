---
name: Architecture Map
description: How the layers fit together — entry points, layout, components, libs, APIs, middleware
type: project
---

**Entry points**:
- `src/pages/index.astro` — root redirect, detects Accept-Language and redirects to `/${lang}/`
- `src/pages/[lang]/index.astro` — homepage per language
- `src/middleware.ts` — runs before every request: rate-limits by route family (chat 20/min, leads 15/min, admin 60/min, generic-api 30/min) and enforces payload size limits (50KB chat, 6MB CV multipart, 10MB PDF export, 100KB other)

**Layout layer**:
- `src/layouts/BaseLayout.astro` is the universal shell. Every product/lang page wraps in it. It injects:
  - Loader, FondoGlobal, CustomCursor, Navbar (Nadbar.astro), DockMenu, BotGO (client:idle), InstallPWA, AdminPanel root
  - Global CSS (global, fonts-inline, typography, backgrounds)
  - GTM, Contentsquare, PWA service worker registration
  - SEO meta + hreflang for 5 languages
  - Lazy-mount AdminPanel via `import('react-dom/client')` after window load
- `src/layouts/Layout.astro` — minimal alternate layout (rarely used)

**Page family** (`src/pages/[lang]/`): about, catalogo, productos, distribuidor, social, vacantes, index + 7 product detail pages (cuerdas, rafias, sacos, arpillas, esquineros, stretch-film, empaques-flexibles). Almost all use `export const prerender = true` for static generation per language. They call `getStaticPaths()` returning the 5 languages.

**Components** (`src/components/`):
- Astro: Nadbar (navbar), Footer, BaseHead, BaseLayout consumers, Loader, DockMenu, CustomCursor, FondoGlobal, BuyButton, BackButton, BaseHead, CldVideoPlayer (lazy Cloudinary SDK), HeroDistributor, ScrollVideoSection, StickySection (GSAP pin), StarsBackground, AudioVisualizer, TextRotator, FormattedDate, HeaderLink, Catalogo, Inicio
- React (general): BotGO (chatbot), VacantesPage (job grid), VacantesNotifPrompt (push opt-in), InstallPWA, ImpactoTimeline, BlurText, BlurFadeCTA, HeroHeadingTypewriter, HeroTitleBlur, TypewriterHero, ProgressSlider, OrangeTitle, SplitText, GlobeCinematic, WireframeDottedGlobe (d3-geo orthographic), DistribuidorCinematic (GSAP cinematic)
- React (admin): AdminPanel, RecruitmentTab, VacantesTab, CVAnalysisTab, ReportGenerator (also exports buildReportHTML), ReportScheduler, PeriodSelector
- 3D: Scene3D, FactoryScene, FactoryModel3D, Simple3DModel (react-three-fiber + drei + three), CesiumGlobe (cesium via CDN)
- shadcn-style ui: `src/components/ui/{typewriter,blur-fade,minimalist-hero}.tsx`

**Lib** (`src/lib/`):
- `turso.ts` — getTurso() factory (reads TURSO_DATABASE_URL + TURSO_AUTH_TOKEN)
- `analytics-db.js` — main DB layer: ensureInit (auto-creates tables), logInteraction, saveLead, readLeads, saveRecruitmentLead, readRecruitmentLeads, updateRecruitmentStatus, addRecruiterNote, saveVacante, readVacantes, saveCandidateNotification, readConversations, etc. Used by 8+ API routes.
- `notify.js` — generates candidate WhatsApp notifications (renders HTML with Puppeteer to PDF, sends via Wahooks)
- `notify.ts` — distributor + English-lead notifications via ntfy.sh (encrypts payload AES-GCM)
- `push.js` — server-only web-push to all subscribers (VAPID)
- `auth.ts` / `verifyAdminToken.ts` — JWT cookie verification (jose)
- `recruitment-db.js` — empty (legacy)
- `recruitmentExport.js` — CSV/PDF export of candidate data
- `utils.ts` — `cn()` helper (clsx + tailwind-merge)

**API routes** (`src/pages/api/`):
- `chat.js` (public) — main BotGO endpoint, OpenAI-powered, TTS, intent detection, recruitment flow extraction, logs to analytics-db
- `recruitment.js` (mixed) — CV upload (multipart), candidate save, admin CRUD on candidates
- `analytics.js` (admin) — dashboard data with date-range filtering
- `auth.ts` (mixed) — login, password change, name change, JWT issue
- `conversations.js` (admin) — list chat sessions, read messages
- `vacantes.js` (mixed: GET public, POST admin) — vacantes CRUD + push fanout on create
- `vacantes-ia.js` (admin) — OpenAI rewrite of vacante description/requisitos
- `ai-analysis.js` (admin) — proxy to /api/chat to summarize analytics into 4 bullets
- `export-pdf.ts` (admin) — Puppeteer renders provided HTML to PDF
- `search-console.js` (admin) — Google Search Console API (service-account JWT)
- `admin/users.js` (admin) — user CRUD + permissions
- `admin/analizar-cv.js` (admin) — CV upload + GPT-4o-mini analysis (returns JSON)
- `cron/daily-reports.js` — Vercel cron, evaluates report_schedules table, fires send-now for due ones (MX timezone)
- `reports/{schedule,notify-config,recruitment-ia,send-now}.js` — report scheduling + ad-hoc PDF report
- `push/{vapid-key,subscribe,send-vacante,test,debug}.js` — web push lifecycle
- `rss.xml.js` — RSS feed (root-level)
