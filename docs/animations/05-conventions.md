# Animaciones — Convenciones del Proyecto

Reglas que todos los agentes deben seguir al crear o modificar animaciones.

---

## Stack de herramientas

| Herramienta | Versión | Uso |
|---|---|---|
| GSAP | (ver package.json) | Animaciones scroll-linked, entradas, timelines |
| ScrollTrigger | plugin de GSAP | Triggers basados en scroll, scrub |
| Lenis | (ver package.json) | Smooth scroll — conectado a ScrollTrigger |
| CSS `@keyframes` | — | Loops infinitos, pulsos, fallbacks |

---

## Regla 1 — GSAP Context

Todas las animaciones GSAP del homepage van dentro de `homeCtx`:

```js
homeCtx = gsap.context(() => {
  // todas las animaciones aquí
});
```

**Por qué:** `homeCtx.revert()` limpia TODAS las animaciones al navegar a otra página
(View Transitions de Astro). Sin esto, los ScrollTriggers se acumulan y hay bugs.

---

## Regla 2 — Lenis + ScrollTrigger

Lenis y ScrollTrigger deben estar sincronizados:

```js
lenis = new Lenis({ duration: 1.4, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
lenisTicker = (time) => { lenis.raf(time * 1000); };
gsap.ticker.add(lenisTicker);
gsap.ticker.lagSmoothing(0);
```

**No crear** un Lenis nuevo sin destruir el anterior (`lenis.destroy()`).

---

## Regla 3 — Inicialización doble

Todos los `init()` deben escuchar ambos eventos:

```js
document.addEventListener('DOMContentLoaded', init);
document.addEventListener('astro:page-load',  init);
```

`astro:page-load` cubre las navegaciones con View Transitions.
`pageshow` para bfcache (botón Atrás del navegador):

```js
window.addEventListener('pageshow', (e) => { if (e.persisted) run(); });
```

---

## Regla 4 — `prefers-reduced-motion`

Siempre respetar la preferencia del usuario:

```js
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // revelar todo estáticamente y hacer early return
  gsap.set('[selector]', { autoAlpha: 1, clearProps: 'transform' });
  return;
}
```

Para CSS `@keyframes`:
```css
@media (prefers-reduced-motion: reduce) {
  .mi-animacion { animation: none; }
}
```

---

## Regla 5 — doble RAF antes de ScrollTrigger

Al crear ScrollTriggers, siempre dentro de doble `requestAnimationFrame`:

```js
window.scrollTo({ top: 0, behavior: 'instant' });
requestAnimationFrame(() => requestAnimationFrame(() => {
  // crear Lenis y ScrollTriggers aquí
  ScrollTrigger.refresh();
}));
```

**Por qué:** El 1er RAF procesa el `scrollTo`. El 2do garantiza que el layout esté calculado
antes de que ScrollTrigger registre las posiciones.

---

## Stack de z-index (secciones sticky)

Las secciones usan `position: sticky` con z-index escalonado. Las secciones posteriores
se pintan encima de las anteriores al hacer scroll.

| Sección | z-index | Nota |
|---|---|---|
| `.hero--static` | `2` | Encima de divisiones durante el dissolve |
| `.divisiones` | `1` | isolation: isolate |
| `.porque` (StickySection) | `2` | |
| `.parallax-section` | `3` | |
| `.certs` | `4` | |
| `.compromiso` | `5` | |
| `.global` | `6` | |
| `.cta` | `7` | Encima de todo |

**Regla:** si agregas una sección sticky nueva, dale el siguiente z-index en la secuencia.
Si un componente necesita ser visible encima de la sección siguiente, su z-index debe
superar al de esa sección.

---

## Gradiente ECO Skybound

Del archivo `ECO.md` en la raíz del proyecto:

```css
/* Gradiente horizontal — izq: azul oscuro, der: azul claro */
linear-gradient(90deg, rgb(28, 83, 189) 71%, rgb(83, 173, 254))

/* Token CSS */
--gradient-skybound-gradient: linear-gradient(90deg, rgb(28, 83, 189) 71%, rgb(83, 173, 254));
```

Usado en: `EcoVideoDissolve.astro`, `.hero__eco-overlay`

---

## Convenciones de nomenclatura

| Tipo | Patrón | Ejemplo |
|---|---|---|
| CSS class overlay | `[seccion]__eco-overlay` | `.hero__eco-overlay` |
| CSS class wrapper dissolve | `eco-dissolve-wrap` | (del componente) |
| `@keyframes` nombre | camelCase descriptivo | `divTapeScroll`, `certScroll` |
| GSAP data-attribute | `data-[prop]` | `data-dissolve-end`, `data-scrub` |
