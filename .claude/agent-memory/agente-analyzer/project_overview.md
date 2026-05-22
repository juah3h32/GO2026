---
name: Project Overview
description: High-level summary of GO2026 — what it is, who it serves, deployment target, and overall shape
type: project
---

GO2026 is the corporate website of Grupo Ortiz (https://grupo-ortiz.com), a Mexican manufacturer of plastic polymers and packaging (stretch film, sacos, cuerdas, rafia, arpillas, esquineros, empaques flexibles).

**Stack**: Astro 5.16 (output: 'server', adapter: '@astrojs/vercel/serverless'), React 19, TypeScript, Tailwind 3.4, PWA (vite-pwa with injectManifest custom SW).

**Deploy target**: Vercel serverless. Cron job at `/api/cron/daily-reports` runs daily (vercel.json). CSP headers configured at the Vercel layer.

**Database**: Turso (libsql) — accessed via `@libsql/client` in `src/lib/turso.ts` and `src/lib/analytics-db.js`. Tables: counters, daily, hourly, products, keywords, intents, messages, users, vacantes, recruitment_leads, recruiter_notes, push_subscriptions, report_schedules, candidate_notifications.

**Public-facing surfaces**:
- Multilingual product pages (es/en/pt/zh/ar)
- BotGO AI chatbot (OpenAI-powered, with TTS via msedge-tts/google-tts-api)
- Vacantes (job listings) page with web push subscriptions
- Distribuidor lead-capture form
- Admin Panel (Ctrl+K) with analytics dashboard, recruitment CRM, vacantes CRUD, report scheduling

**Why**: monorepo for marketing site + recruitment funnel + commercial chatbot, all in one Astro app, with a hidden admin panel mounted on every page via BaseLayout.
