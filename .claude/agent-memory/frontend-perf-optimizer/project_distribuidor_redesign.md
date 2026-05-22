---
name: Distribuidor Page Redesign — May 2026
description: Visual improvements applied to distribuidor.astro and distribuidor.css — animations, card hover, stats, form polish
type: project
---

Modernized the `/distribuidor` page (wholesale/dealer portal) with CSS-only animation upgrades and JS scroll-reveal enhancements while preserving all i18n, brand colors, and functionality.

**Changes applied:**

- **Cards**: Added `data-num` overlay accent (large translucent number top-right), shimmer sweep `::after` on hover, `cubic-bezier(0.34, 1.56, 0.64, 1)` spring on `transform`, icon wrap with bounce-rotate on hover. Border-radius bumped to 20px.
- **Stats row**: Changed from `flex` to `CSS grid (repeat(3, 1fr))` on desktop. Added `in-view` class toggled by JS scroll listener that activates CSS `stat-bar` progress bars and a gradient bottom-line sweep via `::before`. Added `.stat-bar-wrap` / `.stat-bar` per stat with `--bar-width` CSS custom property.
- **Section divider**: New `.section-divider` element with `::before`/`::after` fading lines and a pulsing orange dot between hero and cards.
- **Form CTA panel**: Added two CSS animated concentric rings (`::before`/`::after`) using `orbitSpin` keyframe for depth. `box-shadow` on `.form-section` for lift.
- **Buttons (CTA + submit)**: Shimmer sweep `::after` fires on hover, spring easing on hover transform, arrow icon slides right 4px on CTA hover.
- **Input fields**: Upgraded border to 1.5px, added `box-shadow: 0 0 0 3px rgba(251,103,11,0.12)` on focus, label color transitions to orange on `focus-within`, hover state shows partial orange border.
- **Product selector buttons**: Spring transform `translateY(-2px) scale(1.04)` on checked state.
- **New keyframes**: `shimmer`, `pulseGlow`, `fadeSlideUp`, `scaleIn`, `lineGrow`, `dotPulse`, `orbitSpin`.
- **GSAP**: Added `filter: blur()` entrance for `.gs-title` and `.gs-img`. Cards animate with `filter: blur(6px)` → `blur(0)`. New form fields stagger animation on scroll entry.

**Why:** User requested modern animations and improved visual hierarchy while keeping white background and orange brand color (#fb670b).

**How to apply:** All changes are CSS-only or inline GSAP script — no new npm deps. The `in-view` class pattern (JS adds class, CSS handles transition) is the preferred approach for stats/bars on this project.
