# Animaciones — CSS @keyframes

**Archivo fuente:** `src/styles/home.css`  
Estas animaciones son CSS puras — no requieren JS ni GSAP.

---

## `divTapeScroll` — Tape infinito de productos

```css
.div-tape {
  animation: divTapeScroll 60s linear infinite;
}
.div-tape:hover { animation-play-state: paused; }

@keyframes divTapeScroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

**Cómo funciona el loop:** Los ítems se duplican en el HTML (`divLoop = [...items, ...items]`).
El track tiene `width: max-content`. Animar a `-50%` mueve exactamente un set completo,
luego vuelve al inicio sin salto visual.

**Ajustar velocidad:** cambiar `60s`. Más bajo = más rápido.  
**Pausa en hover:** `.div-tape:hover { animation-play-state: paused }` — ya incluido.  
**Reducción de movimiento:** `@media (prefers-reduced-motion) { .div-tape { animation: none } }`

---

## `certScroll` — Ticker de certificaciones

```css
.certs__track {
  animation: certScroll 22s linear infinite;
}

@keyframes certScroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

Mismo patrón que `divTapeScroll`. Ítems duplicados en `certsLoop = [...certs, ...certs]`.  
Velocidad: `22s` (más rápido que el tape de productos).

---

## `scrollLine` — Línea decorativa animada

```css
animation: scrollLine 2s infinite;

@keyframes scrollLine {
  /* pulso / movimiento de una línea decorativa */
}
```

Usado en elementos decorativos de separación.

---

## `soon-pulse` — Badge "Próximamente"

```css
.div-card__soon-badge {
  animation: soon-pulse 3.5s ease-in-out infinite;
}

@keyframes soon-pulse {
  0%,100% { opacity:1; transform:translate(-50%,-50%) scale(1); }
  50%     { opacity:.72; transform:translate(-50%,-50%) scale(.96); }
}
```

Pulso suave en los cards de divisiones marcados como `soon: true`.  
**Móvil:** `animation: none` (sin animación en viewport pequeño).

---

## `hero-fallback-reveal` — Fallback si GSAP tarda

```css
.hero__eyebrow,
.hero__heading-top,
.hero__heading-bottom,
.hero__actions--center,
.hero__stat,
.hero__stat-sep {
  animation: hero-fallback-reveal 0.6s ease forwards;
  animation-delay: 0.8s;
  opacity: 0;
}

@keyframes hero-fallback-reveal {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

GSAP sobreescribe estos con inline styles (mayor especificidad). Si GSAP falla o no carga,
el CSS revela el contenido del hero a los 0.8s automáticamente.

---

## Patrón para nuevos tickers infinitos

Para agregar un nuevo ticker de imágenes/cards:

1. **HTML:** duplicar los ítems `[...items, ...items]`
2. **CSS container:** `overflow: hidden` + `mask-image` para fade en bordes
3. **CSS track:** `display: flex; width: max-content; animation: miTicker Xs linear infinite`
4. **Keyframe:** `0% { translateX(0) }  100% { translateX(-50%) }`
5. **Hover pause:** `.mi-track:hover { animation-play-state: paused }`
6. **Reduced motion:** deshabilitar en `@media (prefers-reduced-motion: reduce)`
