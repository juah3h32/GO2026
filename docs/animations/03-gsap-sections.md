# Animaciones — Secciones (GSAP)

**Archivo:** `src/pages/[lang]/index.astro`  
**Contexto GSAP:** `homeCtx = gsap.context()`

Todas usan ScrollTrigger con `start` en el rango 78%-88% del viewport (justo antes de que la sección sea completamente visible).

---

## Divisiones

| Animación | Selector | Start | Config |
|---|---|---|---|
| Head entrance | `.divisiones__head-inner` | `top 84%` | `autoAlpha: 0→1`, `y: 50→0`, `duration: 0.9` |
| Tape entrance | `.div-tape-wrap` | `top 88%` | `autoAlpha: 0→1`, `y: 40→0`, `duration: 1` |

**Tape scroll infinito:** ver `docs/animations/04-css-keyframes.md`

---

## Por qué elegirnos

Usa `gsap.matchMedia()` para comportamiento diferente en desktop vs móvil.

### Desktop (`≥ 1101px`)

```
.porque__left   → x: -64 → 0, autoAlpha  (trigger: .porque__inner, start: top 78%)
.porque__right  → x:  64 → 0, autoAlpha  (mismo trigger)
imagen parallax → yPercent: -8, scrub: 1.5  (trigger: .porque__right, full scroll)
.compromiso__card--light → x: -72 → 0  (trigger: .compromiso, start: top 82%)
.compromiso__card--dark  → x:  72 → 0  (mismo trigger)
```

### Mobile (`≤ 1100px`)

```
.porque__left, .porque__right → y: 50 → 0, stagger: 0.18  (start: top 80%)
.compromiso__card             → y: 50 → 0, stagger: 0.18  (start: top 84%)
```

---

## Compromiso — SVG decorativo

```js
gsap.to('.compromiso__deco', {
  rotation: 22, ease: 'none',
  scrollTrigger: { trigger: '.compromiso', start: 'top bottom', end: 'bottom top', scrub: 2 }
});
```

Los iconos SVG rotan suavemente durante todo el scroll de la sección.

---

## Certificaciones

```js
gsap.from('.certs__title', {
  autoAlpha: 0, y: 60, duration: 0.9,
  scrollTrigger: { trigger: '.certs__head', start: 'top 84%' }
});
```

El ticker de certificaciones es CSS puro — ver `docs/animations/04-css-keyframes.md`.

---

## Global / Exportación

```js
// Contenido: tag + heading + descripción en stagger
gsap.from('.global__inner .section-tag, .global__inner .section-heading--light, .global__desc', {
  autoAlpha: 0, y: 44, duration: 0.85, stagger: 0.14,
  scrollTrigger: { trigger: '.global__inner', start: 'top 80%' }
});

// Stats
gsap.from('.global__stat', {
  autoAlpha: 0, y: 36, duration: 0.7, stagger: 0.1,
  scrollTrigger: { trigger: '.global__stats', start: 'top 84%' }
});
```

---

## Contadores (count-up)

**Tipo:** Vanilla JS `IntersectionObserver` (no GSAP)  
**Selector:** `.count-anim`  
**Atributos:** `data-target`, `data-prefix`, `data-suffix`  
**Duración:** 2000ms  
**Ease:** `1 - (1-p)^3` (cubic ease-out manual)  
**Reset:** vuelve a `0` cuando el elemento sale del viewport.

```html
<span class="count-anim" data-target="65" data-suffix="+" data-prefix="">0</span>
```
