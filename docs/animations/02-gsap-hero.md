# Animaciones — Hero (GSAP)

**Archivo:** `src/pages/[lang]/index.astro`  
**Contexto GSAP:** `homeCtx = gsap.context()`  
**Smooth scroll:** Lenis conectado a ScrollTrigger

---

## 1. Hero entrance (entrada de pantalla completa)

**Tipo:** GSAP timeline (no scroll-linked, se ejecuta al cargar)  
**Delay:** 0.1s  
**Ease:** `power3.out`

```
eyebrow    → 0.85s  y: 28 → 0, autoAlpha: 0 → 1
heading-top → 0.90s  y: 44 → 0, autoAlpha: 0 → 1  (overlap -0.52s)
heading-bot → 0.85s  y: 32 → 0, autoAlpha: 0 → 1  (overlap -0.65s)
actions     → 0.75s  y: 22 → 0, autoAlpha: 0 → 1  (overlap -0.42s)
stats/sep   → 0.55s  autoAlpha: 0 → 1, stagger amount: 0.35s
```

**Clases:** `.hero__eyebrow`, `.hero__heading-top`, `.hero__heading-bottom`, `.hero__actions--center`, `.hero__stat`, `.hero__stat-sep`

**Fallback CSS:** `animation: hero-fallback-reveal 0.6s ease forwards` con `animation-delay: 0.8s` — si GSAP tarda, el CSS revela el contenido igual.

---

## 2. Hero video parallax

**Tipo:** GSAP ScrollTrigger scrub  
**Trigger:** `.hero` · `start: top top` · `end: bottom top`  

```js
gsap.to('.hero__video-wrap', {
  yPercent: 20, ease: 'none', scrub: 1.5
});
```

El video se mueve a ⅕ de la velocidad del scroll → sensación de profundidad.

---

## 3. ECO border-dissolve (video desaparece al scrollear)

**Tipo:** 2 animaciones GSAP scrub en paralelo  
**Ver componente:** `src/components/EcoVideoDissolve.astro`  
**Ver docs completos:** `docs/animations/01-components.md`

### Overlay ECO
```js
gsap.to('.hero__eco-overlay', {
  opacity: 1,
  ease: 'power3.in',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: '75% top', scrub: 1 }
});
```

### Video fade directo
```js
gsap.to('.hero__video-wrap', {
  opacity: 0,
  ease: 'power2.in',
  scrollTrigger: { trigger: '.hero', start: '15% top', end: '80% top', scrub: 1 }
});
```

**Nota z-index:** `.hero--static` tiene `z-index: 2`. Divisiones tiene `z-index: 1`. El hero debe estar encima para que el overlay sea visible durante la transición.

---

## Estados de los elementos al montar

GSAP hace `set` antes de la timeline para garantizar el estado inicial:

```js
gsap.set('.hero__eyebrow',          { autoAlpha: 0, y: 28 });
gsap.set('.hero__heading-top',      { autoAlpha: 0, y: 44 });
gsap.set('.hero__heading-bottom',   { autoAlpha: 0, y: 32 });
gsap.set('.hero__actions--center',  { autoAlpha: 0, y: 22 });
gsap.set('.hero__stat, .hero__stat-sep', { autoAlpha: 0 });
```

## `prefers-reduced-motion`

Si el usuario tiene reducción de movimiento activada, GSAP hace early return y los elementos se revelan con `autoAlpha: 1, clearProps: 'transform'` directamente.
