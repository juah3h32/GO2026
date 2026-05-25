# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Stack

- **Framework:** Astro (`output: 'server'`, adaptador Vercel — NO es SSG puro)
- **Deploy:** Vercel (serverless) + `vercel.json`
- **Animaciones:** GSAP + ScrollTrigger, Lenis (smooth scroll, solo desktop)
- **i18n:** 5 idiomas — `es`, `en`, `pt`, `ar`, `zh` — en `src/i18n/`
- **Video/imágenes:** Cloudinary (`astro-cloudinary`)
- **CSS:** archivos por sección en `src/styles/`; Tailwind disponible pero se usa marginalmente
- **React:** componentes `.jsx`/`.tsx` en `src/components/` con `client:load` o `client:visible`
- **DB:** Turso (libSQL) via `src/lib/turso.ts` y `src/lib/analytics-db.js`
- **Auth:** JWT (`jose`) + `src/lib/auth.ts`; tokens verificados en `src/lib/verifyAdminToken.ts`
- **PWA:** `@vite-pwa/astro` con `injectManifest` estrategia

---

## Comandos de desarrollo

```bash
npm run dev          # servidor local en http://localhost:4321
npm run build        # build de producción
npm run preview      # preview del build
npm run dev:tunnel   # dev + cloudflared tunnel expuesto al exterior
```

---

## Routing e i18n

Todas las páginas públicas viven en `src/pages/[lang]/` — el parámetro `lang` es uno de `es | en | pt | ar | zh`. La raíz `/` redirige al idioma por defecto (`es`).

Para agregar texto nuevo: editar **todos** los archivos `src/i18n/{es,en,pt,ar,zh}.ts` y el objeto de tipo en `src/i18n/index.ts`. El tipo se infiere del objeto `es` — si falta una clave en otro idioma TypeScript no siempre lo atrapa; verificar manualmente.

---

## API / Backend

Endpoints en `src/pages/api/`. Patrones importantes:

- Autenticación admin: `src/lib/verifyAdminToken.ts` — todos los endpoints admin deben llamarlo.
- Rate limiting: manejado en `src/middleware.ts` (sliding window en memoria, suficiente por instancia Vercel).
- Límites de payload: chat 50 KB, CV 6 MB, PDF 10 MB, resto 100 KB — ver middleware.
- Secretos (`CRON_SECRET_EXTERNAL`, `WAHOOKS_TOKEN`, etc.) solo se acceden via `process.env` en código server-side; NO exponerlos con el prefijo `TURSO_`/`JWT_`/etc. de `envPrefix`.

---

## Carrusel de Divisiones (home)

**Sección:** `.divisiones` → `.div-tape-wrap` → `.div-tape`  
**Archivos:** `src/pages/[lang]/index.astro` (`initDivTape`) + `src/styles/home.css`

| Acción | Resultado |
|--------|-----------|
| Auto | Scroll infinito continuo (RAF JS, ~60 s/ciclo) |
| `mouseenter` | Pausa inmediata en posición exacta |
| `mouseleave` | Reanuda desde donde quedó |
| Drag | Tape sigue cursor; al soltar → snap al producto más cercano |
| Rueda del ratón | **Eliminada** — no restaurar |

Reglas críticas:
- Control 100% JS via `requestAnimationFrame` — **no usar CSS animation**.
- `e.preventDefault()` en `mousedown` previene selección de texto al arrastrar.
- Contenido duplicado (`divLoop = [...divItems, ...divItems]`); `totalWidth = tape.scrollWidth / 2`.
- `isSnapping` tiene prioridad absoluta en el loop RAF.
- `destroyDivTape()` en `astro:before-swap` y al inicio de cada `run()`.
- Mobile: `overflow-x: scroll` CSS nativo — `initDivTape` solo corre si `!isMobile`.

---

## Convenciones generales

- Lenis solo en desktop (`window.innerWidth > 768`).
- `run()` se registra en `DOMContentLoaded`, `astro:page-load` y `pageshow` (bfcache).
- Cleanup en `astro:before-swap`: Lenis, GSAP context, ScrollTrigger, RAF del carrusel.
- Alias `@` → `src/` disponible en Vite para imports absolutos.
- `noExternal` en Vite SSR: `three`, `cesium`. Externos: `puppeteer-core`, `@sparticuz/chromium`, `pdf-parse`, `web-push`.
