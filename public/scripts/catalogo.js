// =========================================
// CATÁLOGO - SCRIPT COMPLETO Y CORREGIDO
// =========================================

// Variable global (dentro del módulo) para guardar el estado del idioma móvil
let currentMobileLang = 'es'; 

document.addEventListener("DOMContentLoaded", () => {
  initAll();
});

document.addEventListener("astro:page-load", () => {
  initAll();
});

function initAll() {
  initCatalogCarousel();
  initScrollTrigger();
  initLanguageSelector(); // Lógica de Escritorio
  initMobileControls();   // <--- Lógica Móvil (NUEVA)
  initScrollAnimations();
  
  // Forzar actualización de datos móviles al inicio
  setTimeout(updateMobileData, 100);
}

/* =========================
   LÓGICA DE CONTROLES MÓVILES (NUEVA)
========================= */
function initMobileControls() {
  const mobileBtns = document.querySelectorAll('.mobile-lang-btn');
  
  if (mobileBtns.length === 0) return;

  mobileBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // 1. Cambio visual (Poner Naranja)
      document.querySelectorAll('.mobile-lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // 2. Guardar idioma seleccionado en variable
      currentMobileLang = btn.dataset.lang;

      // 3. Actualizar el link de descarga inmediatamente
      updateMobileData();
    });
  });
}

// Función maestra que conecta el carrusel con los botones de abajo
function updateMobileData() {
  const downloadBtn = document.getElementById('mobile-download-btn');
  const mainContainer = document.querySelector('.catalogo-main');
  
  // En tu lógica de carrusel, el elemento visible/centrado es SIEMPRE el 2do (:nth-child(2))
  const activeItem = document.querySelector('.carousel .list .item:nth-child(2)');

  if (!downloadBtn || !mainContainer || !activeItem) return;

  // Obtener datos del JSON incrustado en el HTML
  const catalogsData = JSON.parse(mainContainer.dataset.catalogs || '[]');
  const currentId = activeItem.dataset.catalogId;

  // Buscar URL en el JSON usando el ID del producto y el idioma seleccionado
  const productData = catalogsData.find(item => item.id === currentId);

  if (productData && productData.catalogs && productData.catalogs[currentMobileLang]) {
    // Actualizar HREF
    downloadBtn.href = productData.catalogs[currentMobileLang];
    
    // Pequeño efecto visual para confirmar cambio
    downloadBtn.style.transition = 'opacity 0.2s';
    downloadBtn.style.opacity = '0.7';
    setTimeout(() => downloadBtn.style.opacity = '1', 200);
  }
}

/* =========================
   INTERSECTION OBSERVER (Animaciones Scroll)
========================= */
function initScrollAnimations() {
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('animate-hero');
      else entry.target.classList.remove('animate-hero');
    });
  }, observerOptions);

  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroObserver.observe(heroSection);
    setTimeout(() => heroSection.classList.add('animate-hero'), 100);
  }

  const carouselObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('animate-in');
      else entry.target.classList.remove('animate-in');
    });
  }, observerOptions);

  ['.division-label', '.section-divider h2', '.carousel'].forEach(selector => {
    const el = document.querySelector(selector);
    if (el) carouselObserver.observe(el);
  });
}

/* =========================
   CARRUSEL PRINCIPAL
========================= */
function initCatalogCarousel() {
  const nextButton = document.getElementById("next");
  const prevButton = document.getElementById("prev");
  const carousel = document.querySelector(".carousel");
  const listHTML = document.querySelector(".carousel .list");

  if (!nextButton || !prevButton || !carousel || !listHTML) return;

  let unAcceptClick;

  nextButton.onclick = () => showSlider("next");
  prevButton.onclick = () => showSlider("prev");

  function showSlider(type) {
    nextButton.style.pointerEvents = "none";
    prevButton.style.pointerEvents = "none";

    carousel.classList.remove("next", "prev");

    // ✅ Forzar reflow para que el browser registre la remoción de clases
    // antes de volver a añadirlas — evita que las animaciones se "salten"
    void carousel.offsetWidth;

    const items = document.querySelectorAll(".carousel .list .item");

    if (type === "next") {
      listHTML.appendChild(items[0]);
      carousel.classList.add("next");
    } else {
      listHTML.prepend(items[items.length - 1]);
      carousel.classList.add("prev");
    }

    // Actualizar datos móviles al cambiar de slide
    setTimeout(updateMobileData, 50);

    clearTimeout(unAcceptClick);
    // ✅ Reducido de 500ms → 300ms: los botones se reactivan antes
    //    y updateMobileData() dispara más rápido
    unAcceptClick = setTimeout(() => {
      nextButton.style.pointerEvents = "auto";
      prevButton.style.pointerEvents = "auto";
      updateMobileData();
    }, 300);
  }

  /* MOUSE DRAG */
  let isDragging = false;
  let startX = 0;
  const DRAG_THRESHOLD = 50;

  carousel.addEventListener("mousedown", (e) => {
    if (carousel.classList.contains("showDetail") || e.target.closest('button') || e.target.closest('.download-btn') || e.target.closest('.lang-btn')) return;
    isDragging = true;
    startX = e.clientX;
    carousel.classList.add("dragging");
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
  });

  window.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    carousel.classList.remove("dragging");
    const endX = e.clientX;
    const diff = endX - startX;
    if (Math.abs(diff) > DRAG_THRESHOLD) {
      if (diff > 0) showSlider("prev");
      else showSlider("next");
    }
  });

  /* TOUCH SWIPE (MÓVIL) */
  let touchStartX = 0;
  let touchEndX = 0;
  const SWIPE_THRESHOLD = 50;

  carousel.addEventListener('touchstart', (e) => {
    if (carousel.classList.contains("showDetail") || e.target.closest('button') || e.target.closest('.download-btn') || e.target.closest('.lang-btn')) return;
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    if (carousel.classList.contains("showDetail") || e.target.closest('button') || e.target.closest('.download-btn') || e.target.closest('.lang-btn')) return;
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
  }, { passive: true });

  function handleGesture() {
    if (touchEndX < touchStartX - SWIPE_THRESHOLD) {
      showSlider('next');
    } else if (touchEndX > touchStartX + SWIPE_THRESHOLD) {
      showSlider('prev');
    }
  }
}

/* =========================
   SCROLL INDICATOR
========================= */
function initScrollTrigger() {
  const scrollTrigger = document.getElementById('scroll-trigger');
  const carouselTarget = document.getElementById('carousel-target');

  if (scrollTrigger && carouselTarget) {
    scrollTrigger.addEventListener('click', () => {
      carouselTarget.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* =========================
   SELECTOR DE IDIOMA (ESCRITORIO)
========================= */
function initLanguageSelector() {
  const mainElement = document.querySelector('.catalogo-main');
  if (!mainElement) return;

  const catalogsData = JSON.parse(mainElement.dataset.catalogs || '[]');
  const catalogsById = {};
  if (Array.isArray(catalogsData)) {
    catalogsData.forEach(item => { catalogsById[item.id] = item.catalogs; });
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      const catalogId = this.dataset.catalogId;
      const selectedLang = this.dataset.lang;
      const item = this.closest('.item');

      if (!item) return;

      item.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const downloadBtn = item.querySelector('.download-btn');
      if (downloadBtn && catalogsById[catalogId] && catalogsById[catalogId][selectedLang]) {
        downloadBtn.href = catalogsById[catalogId][selectedLang];
        downloadBtn.style.opacity = '0.5';
        setTimeout(() => downloadBtn.style.opacity = '1', 200);
      }
    });
  });

  document.querySelectorAll('.catalog-actions').forEach(actions => {
    actions.addEventListener('mousedown', (e) => e.stopPropagation());
    actions.addEventListener('touchstart', (e) => e.stopPropagation());
  });
}

/* =========================
   EVENTOS GLOBALES
========================= */
document.addEventListener("astro:before-swap", () => {
  const carousel = document.querySelector(".carousel");
  if (carousel) {
    const newCarousel = carousel.cloneNode(true);
    carousel.parentNode.replaceChild(newCarousel, carousel);
  }
});