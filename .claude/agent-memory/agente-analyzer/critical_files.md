---
name: Critical Files
description: High fan-in modules — touching these affects many places
type: project
---

**Universal shell**: `src/layouts/BaseLayout.astro` — imported by every public page. Adding/removing a slot, prop, or global injection (Cursor, BotGO, DockMenu, AdminPanel root) ripples to all pages.

**i18n root**: `src/i18n/index.ts` — single source of truth for `translations` and `languages`. Imported by ~20 pages and components. A bad re-export breaks the whole site.

**DB facade**: `src/lib/analytics-db.js` — used by `chat.js`, `recruitment.js`, `analytics.js`, `vacantes.js`, `conversations.js`, `reports/*`, `notify.js`. Owns the schema bootstrap (ensureInit). Schema migrations are inline `try { ALTER TABLE ... } catch {}`.

**DB client factory**: `src/lib/turso.ts` — used by `auth.ts`, `admin/users.js`, `cron/daily-reports.js`, `reports/schedule.js`, `reports/send-now.js`. Throws if env vars missing.

**Auth gatekeeper**: `src/lib/verifyAdminToken.ts` — every admin endpoint calls it as the first line. Note: there are two near-identical files (`auth.ts` and `verifyAdminToken.ts` in `src/lib/`); APIs import the `.ts` variant. The `auth.ts` version reads `process.env.JWT_SECRET` at import time (top-level), which can be a pitfall in serverless cold starts; the `verifyAdminToken.ts` version reads at call time.

**Middleware**: `src/middleware.ts` — runs before every request. Changes to rate-limit windows or payload caps affect every API.

**Chatbot brain**: `src/pages/api/chat.js` — owns the BotGO conversation logic, recruitment flow extraction, intent classification, TTS. Long file with embedded prompts and product alias maps.

**Admin shell**: `src/components/AdminPanel.jsx` — Ctrl+K mounted from BaseLayout. Hosts RecruitmentTab, VacantesTab, ReportGenerator, ReportScheduler. Calls all admin APIs.

**Report rendering**: `src/components/ReportGenerator.jsx` — exports `DownloadReportButton` (UI) and `buildReportHTML` (server-callable HTML builder). The HTML is also used by `reports/send-now.js` rendered through Puppeteer for PDF export.

**Cloudinary video**: `src/components/CldVideoPlayer.astro` — lazy-loads the Cloudinary SDK on viewport intersect. Removing/changing this affects LCP on home + vacantes.

**Service worker**: `src/sw.js` — Workbox-based, handles push notifications + page caching. Registered from BaseLayout. Updates check every 30s.
