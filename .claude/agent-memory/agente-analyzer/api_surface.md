---
name: API Surface
description: All API endpoints, who can call them, and what they touch
type: project
---

**Public (no auth)**:
- `POST /api/chat` — BotGO main endpoint. Body: `{ messages, language, isVoice }`. Calls OpenAI, generates TTS (msedge-tts or google-tts-api), logs to analytics-db, runs recruitment flow detection. Rate-limited 20/min.
- `POST /api/analytics` (action='log') — interaction logging from BotGO. (Other actions require admin.)
- `POST /api/recruitment` (action='save' or multipart CV upload) — candidate registration. (Admin actions require auth.)
- `GET /api/vacantes` — list active vacantes + beneficios.
- `GET /api/push/vapid-key` — public key for push subscription.
- `POST /api/push/subscribe` — store/remove a push subscription.

**Admin only (JWT cookie required)**:
- `POST /api/auth` — login, changePassword, changeName. Sets `admin_token` httpOnly cookie (8h, jose-signed HS256).
- `POST /api/analytics` — actions: get, reset, getLeads, resetLeads, etc.
- `POST /api/conversations` — list/messages of chat sessions.
- `POST /api/vacantes` — create, update, delete, toggle, reorder, beneficios config. On create with active=true: triggers `sendPushToAll` and `asignarEsperaAVacante` + `notifyEsperaVacante`.
- `POST /api/vacantes-ia` — OpenAI rewrite of descripcion or requisitos.
- `POST /api/ai-analysis` — proxies to /api/chat with an analyst prompt to summarize dashboard data.
- `POST /api/export-pdf` — Puppeteer-renders provided HTML, returns PDF stream.
- `POST /api/search-console` — Google Search Console queries (service account JWT).
- `GET|POST /api/admin/users` — user CRUD + permissions (canDownload required).
- `POST /api/admin/analizar-cv` — multipart CV upload, extract text, GPT-4o-mini structured analysis. Special: uses `formidable` and disables Astro body parser.
- `GET|POST /api/reports/schedule` — CRUD on `report_schedules` table.
- `GET|POST /api/reports/notify-config` — CRUD on `candidate_notifications` table.
- `POST /api/reports/recruitment-ia` — Claude/Anthropic-powered ranking of candidates per vacancy, returns PDF.
- `POST /api/reports/send-now` — generate full analytics PDF and send via Wahooks (WhatsApp).
- `POST /api/push/send-vacante` — manual push fanout.

**Cron (Vercel)**:
- `GET /api/cron/daily-reports` — fires every day per vercel.json `0 0 * * *`. Iterates `report_schedules`, calls `send-now` for due ones using MX timezone.

**External services touched**:
- OpenAI (chat, vacantes-ia, admin/analizar-cv, ai-analysis)
- Anthropic Claude (reports/recruitment-ia via @anthropic-ai/sdk)
- Google Search Console (search-console)
- Google TTS / MS Edge TTS (chat)
- Cloudinary (video player + posters via PUBLIC_CLOUDINARY_CLOUD_NAME)
- Wahooks (WhatsApp PDF sending in notify.js + reports/send-now)
- ntfy.sh (notify.ts encrypted topic notifications)
- Web Push (web-push lib, VAPID)
- Puppeteer + @sparticuz/chromium (PDF generation in serverless; falls back to local Chrome paths in dev)

**Auth model**: roles are rows in `users` table with `name`, `tabs` (JSON array of admin tab keys), `can_download` (Admin role marker). JWT payload `{ role: { name, color, tabs, canDownload, canDelete, isAdminRole } }` signed HS256, 8h expiry.
