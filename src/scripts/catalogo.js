/* =========================================
   LÓGICA PARA CONTROLES MÓVILES
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('.catalogo-main');
    const mobileLangBtns = document.querySelectorAll('.mobile-lang-btn');
    const mobileDownloadBtn = document.getElementById('mobile-download-btn');
    
    // 1. Obtener todos los datos de los catálogos del JSON
    const catalogsData = JSON.parse(mainContainer.dataset.catalogs || '[]');
    
    // Variable para guardar el idioma actual seleccionado en móvil (por defecto español)
    let currentMobileLang = 'es';

    // FUNCIÓN: Actualizar el enlace de descarga móvil
    function updateMobileDownloadLink() {
        // En tu carrusel, el elemento visible (activo) es siempre el 2do en la lista (index 1)
        // debido a cómo funciona la animación CSS (:nth-child(2))
        const activeItem = document.querySelector('.carousel .list .item:nth-child(2)');
        
        if (!activeItem || !mobileDownloadBtn) return;

        // Obtener el ID del catálogo actual desde el item activo
        const currentCatalogId = activeItem.dataset.catalogId;

        // Buscar la URL correcta en el JSON
        const catalogInfo = catalogsData.find(c => c.id === currentCatalogId);
        
        if (catalogInfo && catalogInfo.catalogs[currentMobileLang]) {
            // Actualizar el href del botón de descarga
            mobileDownloadBtn.href = catalogInfo.catalogs[currentMobileLang];
            // Opcional: Actualizar texto del botón si quisieras poner el idioma
            // mobileDownloadBtn.innerHTML = `DESCARGAR PDF (${currentMobileLang.toUpperCase()})`;
        }
    }

    // 2. EVENTO: Clic en botones de idioma móvil
    mobileLangBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Evitar saltos raros

            // A) CAMBIO VISUAL (Poner naranja)
            // Quitar clase active de todos
            mobileLangBtns.forEach(b => b.classList.remove('active'));
            // Poner clase active al clickeado
            btn.classList.add('active');

            // B) ACTUALIZAR LÓGICA
            currentMobileLang = btn.dataset.lang;
            
            // C) Actualizar el link de descarga inmediatamente
            updateMobileDownloadLink();
        });
    });

    // 3. EVENTO: Sincronizar cuando el carrusel se mueve
    // Tienes que detectar cuando el usuario da click a "Siguiente" o "Anterior"
    // para actualizar el link de descarga con el NUEVO producto.
    
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');

    const updateLinkOnSlide = () => {
        // Esperamos un poco a que termine la animación (o el cambio de DOM)
        // 50ms es suficiente si el cambio de DOM es rápido, si es animación CSS pura, 
        // tal vez necesites ajustarlo a lo que tarda tu animación.
        setTimeout(() => {
            updateMobileDownloadLink();
        }, 100); 
    };

    if (nextBtn) nextBtn.addEventListener('click', updateLinkOnSlide);
    if (prevBtn) prevBtn.addEventListener('click', updateLinkOnSlide);

    // Inicializar al cargar la página
    updateMobileDownloadLink();
});