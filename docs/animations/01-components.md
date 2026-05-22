# Animaciones — Componentes Reutilizables

> Agente: antes de crear una animación nueva, verifica si ya existe un componente aquí.

---

## `EcoVideoDissolve.astro`

**Ruta:** `src/components/EcoVideoDissolve.astro`  
**Tipo:** Astro component con GSAP ScrollTrigger inline  
**Efecto:** Bordes del video se consumen con el gradiente ECO Skybound y el video se desvanece al hacer scroll hacia abajo.

### Uso básico

```astro
---
import EcoVideoDissolve from '@/components/EcoVideoDissolve.astro';
---

<EcoVideoDissolve videoSelector=".mi-video-wrap">
  <div class="mi-video-wrap">
    <video src="..." autoplay muted loop playsinline />
  </div>
</EcoVideoDissolve>
```

### Uso con Cloudinary

```astro
---
import EcoVideoDissolve from '@/components/EcoVideoDissolve.astro';
import { CldVideoPlayer } from 'astro-cloudinary';
---

<EcoVideoDissolve videoSelector=".hero__video-wrap" dissolveEnd="75% top">
  <div class="hero__video-wrap">
    <CldVideoPlayer src="mi-video" autoplay muted loop playsinline controls={false} />
  </div>
</EcoVideoDissolve>
```

### Props completas

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `videoSelector` | `string` | `undefined` | Selector CSS del wrapper de video para el fade directo |
| `zIndex` | `number` | `2` | z-index del wrapper. Debe ser **mayor** que el z-index de la sección siguiente |
| `dissolveEnd` | `string` | `'75% top'` | Cuándo completa el overlay ECO. Notación GSAP: `'80% top'` = cuando el 80% del elemento ha pasado el top del viewport |
| `fadeStart` | `string` | `'15% top'` | Cuándo inicia el fade del video |
| `fadeEnd` | `string` | `'80% top'` | Cuándo completa el fade del video |
| `scrub` | `number` | `1` | Suavizado del scrub. Mayor = más suave |
| `ease` | `string` | `'power3.in'` | Ease GSAP del overlay. `power3.in` = lento al inicio, rápido al final |
| `class` | `string` | `''` | Clases CSS extra para el wrapper raíz |

### Ajustar intensidad

| Quiero... | Cambiar |
|---|---|
| Efecto más agresivo en los bordes | Reducir el ellipse en el CSS: `44% 36%` → `35% 28%` |
| Que desaparezca más rápido | `dissolveEnd="60% top"` |
| Efecto más dramático al final | `ease="power4.in"` |
| Sin fade del video, solo bordes | Omitir `videoSelector` |
| Sobre sección con z-index 3 | `zIndex={4}` |

### Cómo funciona internamente

Dos animaciones GSAP en paralelo con `scrub`:

1. **Overlay opacity 0 → 1** — un `<div>` con:
   - Background: gradiente ECO Skybound + blanco en la base
   - `mask-image` radial: transparente en centro, opaco en bordes
   - Efecto: los bordes del video se "consumen" por el gradiente azul

2. **Video opacity 1 → 0** — el wrapper del video se desvanece directamente

Ver detalles del gradiente en `docs/animations/05-conventions.md` y en `ECO.md` (raíz).
