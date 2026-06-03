<!--
  GO2026 — Sitio Web Oficial de Grupo Ortiz
  Copyright (c) 2026 JUAN PABLO CORONA CORONA — Desarrollador Web.
  Todos los derechos reservados. Licencia propietaria (ver LICENSE).
-->

# Arquitectura del Sistema — GO2026 (grupo-ortiz.com)

Documento de arquitectura completa: cómo funciona la página, sus integraciones,
el bot de WhatsApp y el sistema de monitoreo con agentes.

**Autor:** Juan Pablo Corona Corona — Desarrollador Web
**Dominio:** https://grupo-ortiz.com

---

## 1. Stack y despliegue

| Capa | Tecnología |
|------|-----------|
| Framework | Astro (`output: server`, adaptador Vercel — SSR serverless) |
| Hosting | Vercel (funciones serverless, `maxDuration: 60s`) |
| Base de datos | Turso (libSQL) — `src/lib/turso.ts`, `src/lib/analytics-db.js` |
| Multimedia | Cloudinary (videos e imágenes) |
| Auth admin | JWT (`jose`) en cookie HttpOnly — `src/lib/verifyAdminToken.ts` |
| IA respuestas | OpenAI `gpt-4o-mini` (chat web + asistente WhatsApp) |
| IA diagnóstico | Anthropic Claude `claude-sonnet-4-6` (ANALYTIC BOT JP) |
| WhatsApp | WAHooks (`api.wahooks.com`) |
| PDF reportes | Puppeteer + `@sparticuz/chromium-min` (render del dashboard) |
| Cifrado | AES-256-GCM en reposo — `src/lib/secure-store.js` |
| i18n | 5 idiomas (es, en, pt, ar, zh) en `src/i18n/` |

---

## 2. Sitio web público

- Páginas en `src/pages/[lang]/` — el parámetro `lang` define el idioma. `/` redirige a `es`.
- Rutas: index, about, productos, arpillas, sacos, cuerdas, esquineros, rafias,
  stretch-film, empaques-flexibles, acolchado, bolsas, naturizable, catalogo,
  distribuidor, social, vacantes.
- Videos servidos desde Cloudinary (IDs `GO/...`); el WAF requiere `User-Agent`
  de navegador en llamadas server-side.
- **Monitoreo frontend:** cada página (vía `BaseLayout.astro`) reporta a `/api/logs`
  cualquier video/imagen/recurso que no cargue o error de JavaScript, en tiempo real.
- Aviso de copyright en la consola del navegador.

---

## 3. Base de datos (Turso)

Tablas principales:

| Tabla | Contenido | Cifrado |
|-------|-----------|---------|
| `messages` | Chat web (BotGO) | — |
| `wa_incoming` | Mensajes WhatsApp (phone, body, bot_reply, msg_id) | phone + body + reply (AES-256-GCM) |
| `wa_authorized` | Números autorizados + permisos | — |
| `wago_config` | Credenciales WhatsApp (token, secret) | token + secret (AES-256-GCM) |
| `system_logs` | Errores, advertencias, seguridad, actividad | — |
| (otras) | distribuidores, postulaciones, vacantes, usuarios | — |

Clave de cifrado: `DATA_ENC_KEY` (env). Sin ella, los datos cifrados no se leen.

---

## 4. Bot de WhatsApp — flujo completo

```
Cliente/Admin manda WhatsApp
        │
        ▼
WAHooks (api.wahooks.com)  ──webhook──►  /api/webhook/whatsapp  (push, firma HMAC)
        │                                         │
        └──(el worker push puede no entregar)      │
        ▼                                          ▼
/api/webhook/wa-poll (cron cada minuto)  ───►  handleIncomingMessage()
   jala mensajes nuevos de los chats             │
   autorizados (fallback confiable)              ▼
                                          ┌───────────────────────────┐
                                          │ 1. claim atómico (anti-    │
                                          │    duplicado por msg_id)   │
                                          │ 2. nota de voz → Whisper   │
                                          │ 3. ¿número autorizado?     │
                                          └───────────┬───────────────┘
                          ┌───────────────────────────┴───────────────┐
                   SÍ (admin)                                  NO (cliente)
                          ▼                                            ▼
              ┌──────────────────────┐                    BotGO público (/api/chat)
              │ comando secreto .jp? │                    chatbot de ventas, sin
              │  → manual capacidades│                    acceso a datos internos
              └──────────┬───────────┘
                         ▼
              Asistente IA (OpenAI gpt-4o-mini)
              wa-assistant.js — entiende lenguaje
              natural y ejecuta herramientas (tools)
                         │
                         ▼
              Respuesta / PDF adjunto, enviada por
              WAHooks al número real (no @lid)
```

### Reglas clave del bot
- **Anti-duplicado:** claim atómico por `msg_id` (índice único). Solo 1 proceso responde.
- **Reintento:** si el envío falla, se libera el claim y el siguiente poll reintenta.
- **Acceso:** solo números en `wa_authorized` (activos) llegan al asistente con datos.
  El resto cae al chatbot público sin información interna.
- **Envío:** siempre al número real (`msg.phone`); JIDs `@lid` se preservan sin manglear.
- **Reportes:** se envían como PDF adjunto (nunca link), idénticos al dashboard.

### Las dos IAs (separadas por función)
- **OpenAI** (`gpt-4o-mini`): responde las consultas y conversaciones. Rápido, alto volumen.
- **Claude** (`claude-sonnet-4-6`): SOLO diagnóstico del sistema (ANALYTIC BOT JP). Solo lectura.

---

## 5. Asistente WhatsApp — herramientas (tools)

El asistente (OpenAI) ejecuta acciones según el permiso del usuario. Cada tool valida
permisos en código (no solo en el prompt). Comando secreto **`.jp`** lista todo esto.

| Herramienta | Qué hace | Permiso |
|-------------|----------|---------|
| `obtener_estadisticas` | Métricas de uso por periodo | reports |
| `comparar_periodos` | Compara dos periodos | reports |
| `metricas_dashboard` | Panorama completo del negocio | reports |
| `enviar_reporte_pdf` | Genera y envía PDF (resumen/comparativo, por mes/rango) | reports |
| `obtener_distribuidores` | Lista distribuidores | distribuidores |
| `obtener_candidatos` | Candidatos de reclutamiento | candidates |
| `postulaciones_por_vacante` | Postulaciones por puesto | candidates |
| `obtener_vacantes` | Vacantes abiertas | vacantes |
| `obtener_consultas_recientes` | Consultas de clientes web | messages |
| `revisar_sistema` | Diagnóstico de logs (ANALYTIC BOT JP) | * |
| `rastrear_sitio` | Recorre el sitio en vivo, busca rutas/recursos rotos | * |
| `analisis_del_dia` | Orquesta los 4 agentes por área | * |

---

## 6. Monitoreo — ANALYTIC BOT JP (orquestador + agentes)

Sistema de monitoreo SOLO LECTURA. No modifica ni borra nada; solo detecta y avisa.

```
                  ANALYTIC BOT JP (orquestador)
                  src/lib/orchestrator.js
                          │ corre en paralelo
        ┌─────────────┬───┴────────┬──────────────┐
        ▼             ▼            ▼              ▼
     JP-WEB        JP-SEC       JP-API         JP-DATA
   rutas/videos  seguridad   backend/API     negocio
   recursos      rate-limit  WhatsApp/PDF    distrib./postul.
   404, JS       extracción  reportes        caídas anómalas
        └─────────────┴────────────┴──────────────┘
                          │
                          ▼
            Reporte consolidado (Claude)
            severidad: ok | atención | URGENTE
                          │
                          ▼
              WhatsApp a los admins
```

Cada agente: recolecta datos de su área (rápido, DB) y diagnostica con Claude bajo su rol.

### Fuentes de datos del monitoreo
- `system_logs`: alimentada por el monitor de frontend, el middleware (rate-limit =
  evento de seguridad), el webhook (fallos de envío/reporte) y el crawler.
- `/api/health-crawl`: visita cada página en vivo y verifica recursos.

---

## 7. Tareas programadas (cron — Vercel, horario UTC)

| Hora (CDMX) | UTC | Tarea | Qué hace |
|-------------|-----|-------|----------|
| cada minuto | — | `/api/webhook/wa-poll` | Lee mensajes WhatsApp + alerta inmediata de fallas |
| 9:05am | 15:05 | `/api/health-crawl` | Rastrea rutas y recursos del sitio |
| 9:10am | 15:10 | `/api/orchestrator?always=1` | **Reporte diario completo por WhatsApp** |
| 6:00pm (UTC 0:00) | 0:00 | `/api/cron/daily-reports` | Reportes programados del panel |

Alertas inmediatas: el poll (cada minuto) avisa al momento si hay falla crítica o
evento de seguridad nuevo (anti-spam 30 min).

---

## 8. Seguridad

- **Transporte:** HTTPS/TLS extremo a extremo (Vercel, WAHooks, Turso, Cloudinary).
- **En reposo:** mensajes y credenciales cifrados AES-256-GCM (`DATA_ENC_KEY`).
- **Webhook:** firma HMAC verificada en tiempo constante + anti-replay (timestamp ±5 min).
- **Admin:** JWT en cookie HttpOnly; todos los endpoints admin llaman `verifyAdminToken`.
- **Rate limiting:** `src/middleware.ts` (sliding window por IP); exceso = evento de seguridad.
- **Headers:** CSP, HSTS, X-Frame-Options, etc. en `vercel.json`.
- **Monitoreo activo:** ANALYTIC BOT JP detecta posible extracción de datos y avisa.

---

## 9. Variables de entorno críticas (Vercel)

| Variable | Uso |
|----------|-----|
| `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` | Base de datos |
| `DATA_ENC_KEY` | Cifrado en reposo (sin ella se rompe WhatsApp) |
| `OPENAI_API_KEY` | Respuestas del asistente |
| `ANTHROPIC_API_KEY` | Diagnóstico ANALYTIC BOT JP |
| `WAGO_URL`, `WAGO_TOKEN`, `WAGO_CONNECTION_ID`, `WAGO_WEBHOOK_SECRET` | WhatsApp (también en DB) |
| `CRON_SECRET_EXTERNAL` | Protege endpoints de cron |
| `PUBLIC_CLOUDINARY_CLOUD_NAME` | Multimedia |
| `JWT_SECRET` | Auth admin |
| `WA_SECRET_COMMAND` | Comando secreto del bot (default `.jp`) |

---

## 10. Archivos clave

| Archivo | Rol |
|---------|-----|
| `src/pages/api/webhook/whatsapp.js` | Núcleo del bot: recibe, procesa y responde |
| `src/pages/api/webhook/wa-poll.js` | Poll de mensajes (fallback de entrada) + alertas |
| `src/lib/wa-assistant.js` | Asistente IA (OpenAI) + herramientas |
| `src/lib/notify.js` | Envío WhatsApp, PDF, voz (Whisper), Cloudinary |
| `src/lib/claude-diagnose.js` | Diagnóstico con Claude (ANALYTIC BOT JP) |
| `src/lib/agents.js` | Agentes por área (JP-WEB/SEC/API/DATA) |
| `src/lib/orchestrator.js` | Orquestador del análisis diario |
| `src/lib/health-alert.js` | Alerta inmediata de fallas críticas |
| `src/pages/api/health-crawl.js` | Rastreo del sitio (rutas/recursos) |
| `src/pages/api/orchestrator.js` | Endpoint del análisis diario |
| `src/lib/analytics-db.js` | Acceso a datos + logs |
| `src/lib/secure-store.js` | Cifrado AES-256-GCM |
| `src/lib/verifyAdminToken.ts` | Verificación JWT admin |
| `src/middleware.ts` | Rate limiting + seguridad |

---

_Sistema desarrollado por Juan Pablo Corona Corona. Documento generado 2026._
