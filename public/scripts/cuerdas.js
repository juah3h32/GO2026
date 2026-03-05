// src/scripts/cuerdas.js

/* -------------------------------------------------------------------------- */
/* 1. SELECTORES DE LA INTERFAZ (UI) */
/* -------------------------------------------------------------------------- */
const thumbs = document.querySelectorAll(".thumb-item");
const productImages = document.querySelectorAll(".wheel-item");
const mainContainer = document.querySelector(".main-container");
const title = document.getElementById("product-title");
const desc = document.getElementById("product-desc");
const textArea = document.querySelector(".text-area");
// ELIMINADO: const rafiaModel = ... (Ya no existe)

// ESPECIFICACIONES TÉCNICAS
const specLoad = document.getElementById("spec-load");       // Rendimiento
const specDiam = document.getElementById("spec-diam");       // Unidad
const specMat = document.getElementById("spec-mat");         // Material
const specElong = document.getElementById("spec-elong");     // Peso
const specGrip = document.getElementById("spec-grip");       // Resistencia
const specLoadResist = document.getElementById("spec-loadresist"); // Carga

/* -------------------------------------------------------------------------- */
/* 2. OBTENCIÓN Y FUSIÓN DE DATOS */
/* -------------------------------------------------------------------------- */

// A. Configuración Visual (Solo 3 productos, sin 3D)
// Asegúrate de que el orden coincida con el array 'products' en tus archivos de traducción
const visualConfig = [
  { bg: "var(--bg-cuerda)" }, // Producto 0
  { bg: "var(--bg-strech)" }, // Producto 1
  { bg: "var(--bg-arpilla)"}  // Producto 2 (Antes era el 4to, ajusta el color si es necesario)
];

// B. Obtener datos traducidos desde el HTML
let productData = [];

try {
  // Leemos el string JSON que Astro puso en el atributo data-products
  const rawData = mainContainer.getAttribute('data-products');
  
  if (rawData) {
      const translatedData = JSON.parse(rawData);

      // C. Combinar traducción + config visual
      productData = translatedData.map((item, index) => {
        const config = visualConfig[index] || {};
        return { ...item, ...config };
      });
  } else {
      console.warn("No se encontró el atributo data-products en mainContainer");
      productData = visualConfig;
  }

} catch (error) {
  console.error("Error al leer los datos de productos traducidos:", error);
  // Fallback
  productData = visualConfig; 
}

let currentThumb = thumbs[0];

/* -------------------------------------------------------------------------- */
/* 3. FUNCIÓN DE ACTUALIZACIÓN VISUAL */
/* -------------------------------------------------------------------------- */
function updateProduct(index) {
  const data = productData[index];
  if (!data) return;

  // 1. Fondo
  if (data.bg) mainContainer.style.background = data.bg;

  // 2. Lógica de Imágenes (Simplificada, sin 3D)
  productImages.forEach((img) => img.classList.remove("active"));
  
  // Siempre mostramos la imagen correspondiente
  if (productImages[index]) {
    productImages[index].classList.add("active");
  }

  // 3. Textos (Validamos que existan antes de asignarlos)
  if (title && data.name) title.innerText = data.name;
  if (desc && data.description) desc.innerText = data.description;

  // 4. Specs
  const specs = data.specs_values || {}; 

  if (specLoad) specLoad.innerText = specs.load || '--';
  if (specDiam) specDiam.innerText = specs.unit || '--';
  if (specMat) specMat.innerText = specs.mat || '--';
  if (specElong) specElong.innerText = specs.weight || '--';
  if (specGrip) specGrip.innerText = specs.resist || '--';
  if (specLoadResist) specLoadResist.innerText = specs.charge || '--';

  // 5. Miniaturas (Thumbs)
  thumbs.forEach((t) => t.classList.remove("active"));
  if (thumbs[index]) thumbs[index].classList.add("active");
  currentThumb = thumbs[index];

  // 6. Animación de entrada de texto
  if (textArea) {
      title.classList.remove("fade-in-text");
      desc.classList.remove("fade-in-text");
      
      // Trigger reflow (reiniciar animación CSS)
      void textArea.offsetWidth; 
      
      title.classList.add("fade-in-text");
      desc.classList.add("fade-in-text");
  }
}

/* -------------------------------------------------------------------------- */
/* 4. EVENTOS */
/* -------------------------------------------------------------------------- */
thumbs.forEach((thumb, index) => {
  thumb.addEventListener("click", () => {
    // Integración de Audio
    if (typeof window.playGlobalClick === 'function') {
        window.playGlobalClick();
    }
    updateProduct(index);
  });
});

/* -------------------------------------------------------------------------- */
/* 5. INICIALIZAR */
/* -------------------------------------------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  // Iniciamos con el primer producto
  updateProduct(0);
});