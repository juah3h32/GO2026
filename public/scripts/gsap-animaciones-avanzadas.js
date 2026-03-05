// ============================================================================
// GSAP ANIMACIONES AVANZADAS - EXTRAS
// Animaciones adicionales que puedes agregar a tu página
// ============================================================================

/**
 * 1. CURSOR PERSONALIZADO CON SEGUIMIENTO SMOOTH
 */
function initCustomCursor() {
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  const cursorFollower = document.createElement('div');
  cursorFollower.classList.add('cursor-follower');
  document.body.appendChild(cursorFollower);

  gsap.set([cursor, cursorFollower], { xPercent: -50, yPercent: -50 });

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const mouse = { x: pos.x, y: pos.y };
  const speed = 0.35;

  const xSet = gsap.quickSetter(cursor, "x", "px");
  const ySet = gsap.quickSetter(cursor, "y", "px");
  const xFollowSet = gsap.quickSetter(cursorFollower, "x", "px");
  const yFollowSet = gsap.quickSetter(cursorFollower, "y", "px");

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  gsap.ticker.add(() => {
    const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
    
    pos.x += (mouse.x - pos.x) * dt;
    pos.y += (mouse.y - pos.y) * dt;
    
    xSet(pos.x);
    ySet(pos.y);
    xFollowSet(pos.x);
    yFollowSet(pos.y);
  });

  // Hover effects en cards
  document.querySelectorAll('.comprometidos-card, .vision-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(cursor, { scale: 3, duration: 0.3 });
      gsap.to(cursorFollower, { scale: 1.5, duration: 0.3 });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(cursor, { scale: 1, duration: 0.3 });
      gsap.to(cursorFollower, { scale: 1, duration: 0.3 });
    });
  });
}

/* CSS para el cursor personalizado:
.custom-cursor {
  position: fixed;
  width: 10px;
  height: 10px;
  background: var(--color-primary);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
}

.cursor-follower {
  position: fixed;
  width: 40px;
  height: 40px;
  border: 2px solid var(--color-primary);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  opacity: 0.5;
}
*/

/**
 * 2. MAGNETIC BUTTONS - Botones que siguen el cursor
 */
function initMagneticButtons() {
  document.querySelectorAll('.cta-button, .comprometidos-card-link').forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)"
      });
    });
  });
}

/**
 * 3. SCROLL PROGRESS INDICATOR
 */
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.classList.add('scroll-progress');
  document.body.appendChild(progressBar);

  gsap.to(progressBar, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3
    }
  });
}

/* CSS para el progress bar:
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--color-primary);
  transform-origin: left;
  transform: scaleX(0);
  z-index: 9999;
}
*/

/**
 * 4. TEXTO ANIMADO CON SPLIT
 */
function initSplitTextAnimation() {
  // Requiere SplitType library
  const titles = document.querySelectorAll('.section-title');
  
  titles.forEach(title => {
    const split = new SplitType(title, { types: 'chars' });
    
    gsap.from(split.chars, {
      scrollTrigger: {
        trigger: title,
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      opacity: 0,
      y: 50,
      rotateX: -90,
      stagger: 0.03,
      duration: 0.8,
      ease: "back.out(1.7)"
    });
  });
}

/* Para usar SplitType, agregar:
<script src="https://unpkg.com/split-type"></script>
*/

/**
 * 5. INFINITE SCROLL LOGOS (PARTNERS/CLIENTS)
 */
function initInfiniteScroll() {
  const track = document.querySelector('.logo-track');
  if (!track) return;

  const items = gsap.utils.toArray('.logo-item');
  const tl = gsap.timeline({ repeat: -1 });

  tl.to(track, {
    x: -track.scrollWidth / 2,
    duration: 30,
    ease: "none"
  });

  // Pause on hover
  track.addEventListener('mouseenter', () => tl.pause());
  track.addEventListener('mouseleave', () => tl.play());
}

/**
 * 6. MORPHING SHAPES BACKGROUND
 */
function initMorphingShapes() {
  const shapes = document.querySelectorAll('.morph-shape');
  
  shapes.forEach(shape => {
    gsap.to(shape, {
      morphSVG: shape.dataset.morphTo,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  });
}

/**
 * 7. NUMBER COUNTER CON DECIMALES Y FORMATO
 */
function animateCounter(element, options = {}) {
  const {
    duration = 2,
    start = 0,
    end = parseInt(element.dataset.count),
    decimals = 0,
    prefix = '',
    suffix = '',
    separator = ','
  } = options;

  const obj = { val: start };
  
  gsap.to(obj, {
    val: end,
    duration: duration,
    ease: "power2.out",
    onUpdate: () => {
      let value = obj.val.toFixed(decimals);
      
      // Add thousand separators
      if (separator) {
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      }
      
      element.textContent = prefix + value + suffix;
    },
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });
}

// Uso:
// animateCounter(document.querySelector('.stat-number'), {
//   prefix: '$',
//   suffix: 'M',
//   decimals: 1,
//   separator: ','
// });

/**
 * 8. CARDS SHUFFLE/SORT ANIMATION
 */
function initCardShuffle() {
  const container = document.querySelector('.comprometidos-grid');
  const cards = gsap.utils.toArray('.comprometidos-card');

  function shuffle() {
    const state = Flip.getState(cards);
    
    // Shuffle array
    cards.sort(() => Math.random() - 0.5);
    
    // Reorder in DOM
    cards.forEach(card => container.appendChild(card));
    
    // Animate
    Flip.from(state, {
      duration: 0.7,
      ease: "power1.inOut",
      stagger: 0.08,
      absolute: true
    });
  }

  // Trigger shuffle on button click
  document.querySelector('.shuffle-btn')?.addEventListener('click', shuffle);
}

/**
 * 9. REVEAL TEXT ON SCROLL (CLIP-PATH)
 */
function initTextReveal() {
  const reveals = document.querySelectorAll('.text-reveal');
  
  reveals.forEach(text => {
    gsap.from(text, {
      scrollTrigger: {
        trigger: text,
        start: "top 85%",
        end: "top 50%",
        scrub: 1
      },
      clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)",
      ease: "none"
    });
  });
}

/* CSS:
.text-reveal {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}
*/

/**
 * 10. SMOOTH SCROLL CON LENIS
 */
function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Sync with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

/* Para usar Lenis:
<script src="https://cdn.jsdelivr.net/gh/studio-freight/lenis@latest/bundled/lenis.min.js"></script>
*/

/**
 * 11. STICKY SECTIONS CON FADE
 */
function initStickySections() {
  const sections = gsap.utils.toArray('.sticky-section');
  
  sections.forEach((section, i) => {
    const nextSection = sections[i + 1];
    
    if (nextSection) {
      gsap.to(section, {
        opacity: 0,
        scale: 0.9,
        scrollTrigger: {
          trigger: nextSection,
          start: "top bottom",
          end: "top top",
          scrub: 1
        }
      });
    }
  });
}

/**
 * 12. IMAGE ZOOM ON SCROLL
 */
function initImageZoom() {
  const images = document.querySelectorAll('.zoom-image');
  
  images.forEach(img => {
    gsap.to(img, {
      scale: 1.2,
      scrollTrigger: {
        trigger: img.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });
  });
}

/**
 * 13. HORIZONTAL SCROLL SECTION
 */
function initHorizontalScroll() {
  const container = document.querySelector('.horizontal-scroll');
  if (!container) return;

  const sections = gsap.utils.toArray('.horizontal-section');
  
  gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1,
      snap: 1 / (sections.length - 1),
      end: () => "+=" + container.offsetWidth
    }
  });
}

/**
 * 14. STAGGER GRID ANIMATION
 */
function initStaggerGrid() {
  const grid = document.querySelector('.stagger-grid');
  if (!grid) return;

  const items = gsap.utils.toArray('.grid-item');
  
  gsap.from(items, {
    scrollTrigger: {
      trigger: grid,
      start: "top 70%",
      toggleActions: "play none none reverse"
    },
    opacity: 0,
    scale: 0.8,
    y: 50,
    stagger: {
      amount: 1,
      grid: "auto",
      from: "start"
    },
    duration: 0.8,
    ease: "back.out(1.7)"
  });
}

/**
 * 15. DRAW SVG PATH ANIMATION
 */
function initSVGDraw() {
  const paths = document.querySelectorAll('.draw-path');
  
  paths.forEach(path => {
    const length = path.getTotalLength();
    
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length
    });
    
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 2,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: path,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  });
}

// ============================================================================
// FUNCIÓN MASTER - INICIALIZA TODO
// ============================================================================

function initAllAdvancedAnimations() {
  console.log('🚀 Initializing Advanced GSAP Animations...');

  // Básicas (siempre activar)
  initMagneticButtons();
  initScrollProgress();
  initImageZoom();
  initStaggerGrid();
  
  // Opcionales (activar según necesidad)
  // initCustomCursor();
  // initSmoothScroll();
  // initHorizontalScroll();
  // initSplitTextAnimation();
  // initCardShuffle();
  
  console.log('✨ All animations ready!');
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initAllAdvancedAnimations);

// ============================================================================
// PERFORMANCE TIPS
// ============================================================================

/**
 * OPTIMIZACIÓN 1: Lazy Load de animaciones
 * Solo inicializa animaciones cuando el usuario hace scroll cerca
 */
function lazyLoadAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animType = entry.target.dataset.animation;
          
          switch(animType) {
            case 'fade':
              gsap.from(entry.target, { opacity: 0, y: 50, duration: 1 });
              break;
            case 'scale':
              gsap.from(entry.target, { scale: 0, duration: 1, ease: "back.out" });
              break;
            // Agregar más tipos según necesidad
          }
          
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '50px' }
  );

  document.querySelectorAll('[data-animation]').forEach(el => {
    observer.observe(el);
  });
}

/**
 * OPTIMIZACIÓN 2: Kill animaciones al salir de viewport
 * Ahorra CPU/GPU
 */
ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true
});

/**
 * OPTIMIZACIÓN 3: Batch similar animations
 */
ScrollTrigger.batch(".fade-batch", {
  onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1 }),
  onLeave: batch => gsap.to(batch, { opacity: 0, y: 50 }),
  onEnterBack: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1 }),
  onLeaveBack: batch => gsap.to(batch, { opacity: 0, y: 50 }),
  start: "top 80%",
  end: "bottom 20%"
});

// ============================================================================
// DEBUGGING HELPERS
// ============================================================================

/**
 * Visualizar ScrollTrigger markers (solo desarrollo)
 */
function showScrollTriggerMarkers() {
  ScrollTrigger.getAll().forEach(trigger => {
    trigger.vars.markers = true;
  });
  ScrollTrigger.refresh();
}

// Usar en consola: showScrollTriggerMarkers()

/**
 * Log de todas las animaciones activas
 */
function logActiveAnimations() {
  const activeAnimations = gsap.globalTimeline.getChildren();
  console.log('📊 Active Animations:', activeAnimations.length);
  activeAnimations.forEach((anim, i) => {
    console.log(`${i + 1}.`, anim.vars.id || 'unnamed', anim);
  });
}

// ============================================================================
// EXPORT (si usas módulos)
// ============================================================================

export {
  initCustomCursor,
  initMagneticButtons,
  initScrollProgress,
  initSplitTextAnimation,
  initSmoothScroll,
  initHorizontalScroll,
  initAllAdvancedAnimations
};