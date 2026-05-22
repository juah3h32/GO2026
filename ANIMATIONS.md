# ANIMATIONS — Índice maestro

> Agente: lee este archivo primero. Luego navega al doc específico en `docs/animations/`.

---

## Estructura de documentación

```
docs/animations/
├── 01-components.md     Componentes reutilizables (EcoVideoDissolve)
├── 02-gsap-hero.md      Animaciones GSAP del Hero (entrance, parallax, dissolve)
├── 03-gsap-sections.md  Animaciones GSAP de las demás secciones
├── 04-css-keyframes.md  CSS @keyframes (tickers, pulsos, fallbacks)
└── 05-conventions.md    Reglas del proyecto (z-index, Lenis, GSAP context)
```

---

## Referencia de diseño

| Archivo | Contenido |
|---|---|
| `ECO.md` | Gradiente Skybound, colores, tipografía del sistema de diseño |

---

## Animaciones existentes — resumen rápido

| Nombre | Tipo | Dónde |
|---|---|---|
| Hero entrance | GSAP timeline | `02-gsap-hero.md` |
| Hero video parallax | GSAP scrub | `02-gsap-hero.md` |
| **ECO border-dissolve** | GSAP scrub + CSS mask | `01-components.md` · `02-gsap-hero.md` |
| Divisiones tape infinito | CSS `@keyframes` | `04-css-keyframes.md` |
| Certificaciones ticker | CSS `@keyframes` | `04-css-keyframes.md` |
| Por qué elegirnos slide | GSAP matchMedia | `03-gsap-sections.md` |
| Compromiso SVG rotation | GSAP scrub | `03-gsap-sections.md` |
| Count-up counters | Vanilla JS IntersectionObserver | `03-gsap-sections.md` |
| Global content entrance | GSAP ScrollTrigger | `03-gsap-sections.md` |

---

## Componentes reutilizables

| Componente | Ruta | Uso |
|---|---|---|
| `EcoVideoDissolve` | `src/components/EcoVideoDissolve.astro` | Wrap cualquier video para aplicar el dissolve ECO al hacer scroll |

---

## Stack técnico

GSAP + ScrollTrigger + Lenis + CSS `@keyframes`

Ver reglas completas → `docs/animations/05-conventions.md`
