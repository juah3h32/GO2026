// src/components/GlobePlanetClient.jsx

import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// --- COMPONENTE AUXILIAR PARA NÚMEROS ANIMADOS (Opcional) ---
const AnimatedStat = ({ value, label }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const target = parseInt(value.replace(/\D/g, ''));
    let start = 0;
    const duration = 1500;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplayValue(target);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="stat-square">
      <div className="stat-number">
        {value.includes('+') && '+'}{displayValue.toLocaleString()}{value.includes('h') && 'h'}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

// --- DATOS DE LAS DIAPOSITIVAS ---
const SLIDES = [
  {
    eyebrow: 'NUESTRA EMPRESA',
    title: 'GRUPO ORTIZ',
    text: `Grupo Ortiz opera a través de seis divisiones especializadas, lo que nos permite atender de manera integral las necesidades de empaque y embalaje de nuestros clientes.`
  },
  {
    eyebrow: 'DIVISIONES',
    title: 'SOLUCIONES',
    text: `Arpillas, Cuerdas, Empaque flexible, Rafia, Sacos, Stretch film y esquineros.`
  },
  {
    eyebrow: 'DESARROLLO',
    title: 'INNOVACIÓN',
    text: `Mantenemos un proceso constante de desarrollo de nuevos productos, adaptándonos a las demandas del mercado y a las necesidades de cada industria.`
  }
];

// --- COMPONENTE PRINCIPAL ---
export default function GlobePlanetClient() {
  // Estados de Control
  const [slideIndex, setSlideIndex] = useState(0);
  const isScrolling = useRef(false);
  const [showUI, setShowUI] = useState(false);
  const [isPlanetLoaded, setIsPlanetLoaded] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  
  // Estados para contadores y líneas
  const [latamCount, setLatamCount] = useState(0);
  const [europeCount, setEuropeCount] = useState(0);
  const latamTextRef = useRef(null);
  const europeTextRef = useRef(null);
  const [latamLineWidth, setLatamLineWidth] = useState(0);
  const [europeLineWidth, setEuropeLineWidth] = useState(0);

  // 1. BLOQUEAR SCROLL DEL BODY CUANDO SE MUESTRA LA UI
  useEffect(() => {
    if (showUI) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showUI]);

  // 2. MANEJO DEL SCROLL (WHEEL) PARA CAMBIAR SLIDES
  useEffect(() => {
    const onWheel = (e) => {
      if (!showUI) return;
      if (isScrolling.current) return;

      isScrolling.current = true;

      if (e.deltaY > 0) {
        setSlideIndex(i => Math.min(i + 1, SLIDES.length - 1));
      } else {
        setSlideIndex(i => Math.max(i - 1, 0));
      }

      setTimeout(() => {
        isScrolling.current = false;
      }, 700);
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [showUI]);

  // 3. ANIMACIÓN DE CONTADORES Y LÍNEAS (CUANDO APARECEN FLECHAS)
  useEffect(() => {
    if (showArrows) {
      // Calcular ancho de las líneas según el texto
      if (latamTextRef.current) setLatamLineWidth(latamTextRef.current.offsetWidth);
      if (europeTextRef.current) setEuropeLineWidth(europeTextRef.current.offsetWidth);

      // Animación conteo LATAM
      let latam = 0;
      const latamInterval = setInterval(() => {
        if (latam < 33) { latam++; setLatamCount(latam); } else clearInterval(latamInterval);
      }, 40);

      // Animación conteo EUROPA
      let eu = 0;
      const euInterval = setInterval(() => {
        if (eu < 44) { eu++; setEuropeCount(eu); } else clearInterval(euInterval);
      }, 40);
    }
  }, [showArrows]);

  // 4. THREE.JS - LÓGICA DEL PLANETA
  useEffect(() => {
    const container = document.getElementById('planetContainer');
    if (!container) return;
    container.innerHTML = '';

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    // Escena y Cámara
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = isMobile ? 5.2 : isTablet ? 4.6 : 4;

    // Renderizador
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Luces
    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(0, 0, 5);
    scene.add(light);

    // Pivote (Grupo contenedor para rotar todo junto)
    const pivot = new THREE.Group();
    pivot.scale.set(0, 0, 0); // Empieza invisible/pequeño
    scene.add(pivot);

    // Variables de referencia
    let planetRef = null;
    let glowSprite = null; 

    // Cargar Modelo GLB
    const loader = new GLTFLoader();
    const texLoader = new THREE.TextureLoader();
    
    loader.load('/assets/models/mundo.glb', (gltf) => {
      const planet = gltf.scene;
      planetRef = planet;

      // Aplicar texturas emisivas
      planet.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.emissive = new THREE.Color(0xff7a00);
          child.material.emissiveIntensity = 0;
          child.material.emissiveMap = texLoader.load('/assets/textures/latam_emissive.png');
          child.material.needsUpdate = true;
        }
      });

      // Centrar geometría
      const box = new THREE.Box3().setFromObject(planet);
      const center = box.getCenter(new THREE.Vector3());
      planet.position.sub(center);

      pivot.add(planet);
      setIsPlanetLoaded(true);
    });

    // Configuración de Animación
    const LATAM_ROT_Y = -4.9;
    const EXTRA_ROT_Y = 0.35;
    const TARGET_PIVOT_X = isMobile ? 0 : isTablet ? -0.6 : -1;

    let targetRotY = 0;
    let autoRotate = true;
    let latamLocked = false;
    let hasClicked = false;

    const targetScale = new THREE.Vector3(
      isMobile ? 0.85 : 1,
      isMobile ? 0.85 : 1,
      isMobile ? 0.85 : 1
    );

    // Evento Click
    container.addEventListener('click', () => {
      if (!autoRotate && !hasClicked) {
        hasClicked = true;
        setShowUI(true);
        setShowArrows(false); // Oculta flechas temporalmente si se desea
        targetRotY = LATAM_ROT_Y + EXTRA_ROT_Y;
      }
    });

    // Evento Resize
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Loop de Animación
    const animate = () => {
      requestAnimationFrame(animate);

      // Efecto de entrada (Scale up)
      pivot.scale.lerp(targetScale, 0.03);

      if (autoRotate) {
        const diff = LATAM_ROT_Y - targetRotY;

        // Agregar Glow justo antes de detenerse
        if (!glowSprite && Math.abs(diff) < 0.04) { 
          const glowTexture = new THREE.TextureLoader().load('/assets/textures/glow.png');
          const glowMaterial = new THREE.SpriteMaterial({
            map: glowTexture,
            color: 0xff7a00,
            transparent: true,
            opacity: 1.9,
            blending: THREE.AdditiveBlending
          });
          glowSprite = new THREE.Sprite(glowMaterial);
          glowSprite.scale.set(3.5, 3.5, 1);
          glowSprite.position.set(0.6, -0, -0.1);
          pivot.add(glowSprite);
        }

        // Lógica de frenado
        if (Math.abs(diff) > 0.01) {
          targetRotY += diff * 0.02;
        } else {
          autoRotate = false;
          latamLocked = true;
          setShowArrows(true); // Mostrar flechas al terminar rotación inicial
        }
      }

      // Animación pulsante del Glow
      if (glowSprite) {
        glowSprite.material.opacity = 0.5 + Math.sin(Date.now() * 0.005) * 0.3;
      }

      // Interpolación de rotación y posición
      pivot.rotation.y += (targetRotY - pivot.rotation.y) * 0.06;
      pivot.rotation.x += (0 - pivot.rotation.x) * 0.1;

      // Movimiento lateral al hacer click (para dar espacio al texto)
      if (hasClicked) pivot.position.x += (TARGET_PIVOT_X - pivot.position.x) * 0.05;

      // Parpadeo de textura emisiva (mapa naranja)
      if (latamLocked && planetRef) {
        planetRef.traverse((child) => {
          if (child.isMesh && child.material?.emissiveMap) {
            const blink = 0.6 + Math.sin(Date.now() * 0.01) * 0.3;
            child.material.emissiveIntensity += (blink - child.material.emissiveIntensity) * 0.05;
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      // Eliminar el canvas al desmontar
      if(container) container.innerHTML = '';
    };
  }, []);

  // --- RENDERIZADO (JSX) ---
  return (
    <div className="scene-wrapper">
      
      {/* Contenedor del Planeta 3D */}
      <div className="planet-wrap">
        <div id="planetContainer" />
      </div>

      {/* UI DESLIZANTE (Aparece al hacer click) */}
      {showUI && (
        <div className="ui-wrap">
          {/* Barra Slider a la derecha */}
          <div className="slider-sidebar">
             <div className="slider-diamond"></div>
             <div className="slider-track">
                {/* Calcula la posición de la barra activa según el slide actual */}
                <div 
                  className="slider-active-bar" 
                  style={{ 
                    top: `${(slideIndex / (SLIDES.length - 1)) * 60 + 20}%` 
                  }}
                ></div>
             </div>
             <div className="slider-diamond"></div>
             <div className="slider-label">DESLIZA</div>
          </div>

          {/* Contenido de Texto */}
          <div className="ui-text-content">
            <span className="ui-eyebrow" key={`eyebrow-${slideIndex}`}>
              {SLIDES[slideIndex].eyebrow}
            </span>

            <h1 className="ui-title" key={`title-${slideIndex}`}>
              {SLIDES[slideIndex].title}
            </h1>

            <p className="ui-description" key={`desc-${slideIndex}`}>
              {SLIDES[slideIndex].text}
            </p>

            <button className="ui-btn">LEARN MORE</button>
          </div>
        </div>
      )}

      {/* FLECHAS Y ESTADÍSTICAS (Aparece al detenerse, desaparece al click) */}
      {showArrows && !showUI && (
        <>
          {/* LATAM */}
          <div
            className="arrow-line2"
            style={{ top: '60%', left: '8%', width: `${latamLineWidth}px` }}
          />
          <div ref={latamTextRef} className="arrow-text" style={{ top: '55%', left: '8%' }}>
            LATINOAMÉRICA
          </div>
          <div className="country-count" style={{ top: '62%', left: '8%' }}>
            {latamCount} PAISES
          </div>

          {/* EUROPA */}
          <div
            className="arrow-line2"
            style={{ top: '30%', left: '72%', width: `${europeLineWidth}px` }}
          />
          <div ref={europeTextRef} className="arrow-text" style={{ top: '25%', left: '72%' }}>
            EUROPA
          </div>
          <div className="country-count" style={{ top: '32%', left: '72%' }}>
            {europeCount} PAISES
          </div>
        </>
      )}

      {/* --- ESTILOS CSS INCRUSTADOS --- */}
      <style>{`
        /* Fuentes */
        body, html, .scene-wrapper, .planet-wrap, #planetContainer,
        .ui-wrap, .ui-eyebrow, .ui-title, .ui-description, .ui-btn,
        .arrow-text, .country-count, .country-list, .slider-label {
          font-family: 'Blauer Neue', 'Conthic', 'Morganite Pro', sans-serif;
        }

        /* Layout Principal */
        .scene-wrapper { 
          position: relative; 
          width: 100%; 
          height: 100vh; 
          overflow: hidden; /* Evita doble scroll */
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background: #000; /* Fondo negro por seguridad si no carga imagen */
        }

        .planet-wrap {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
        }

        #planetContainer {
          width: 100%;
          height: 100%;
        }

        /* UI Wrapper - Texto a Izquierda, Slider a Derecha */
        .ui-wrap { 
          position: absolute; 
          right: 8%; 
          top: 50%; 
          transform: translateY(-50%); 
          max-width: 650px; 
          width: 100%;
          z-index: 10;
          pointer-events: none; /* Deja pasar clicks al fondo si no tocas elementos */
          display: flex; 
          flex-direction: row-reverse; /* Pone el slider a la derecha del texto */
          gap: 35px;
          align-items: center;
        }

        /* Slider Lateral */
        .slider-sidebar {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 180px;
          pointer-events: auto;
        }

        .slider-diamond {
          width: 6px;
          height: 6px;
          background-color: #FB670B;
          transform: rotate(45deg);
          margin: 4px 0;
        }

        .slider-track {
          flex: 1;
          width: 1px;
          background: rgba(255, 255, 255, 0.3);
          position: relative;
          margin: 4px 0;
        }

        .slider-active-bar {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 20%; /* Altura fija o dinámica */
          background-color: #FB670B;
          transition: top 0.5s ease-out;
        }

        .slider-label {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 20px; 
          right: auto;
          color: #FB670B;
          font-size: 14px;
          letter-spacing: 2px;
          font-weight: 600;
          white-space: nowrap;
          writing-mode: vertical-rl; /* Opcional: texto vertical */
          text-orientation: mixed;
        }

        /* Contenido de Texto */
        .ui-text-content {
          flex: 1;
          text-align: right; /* Alineado hacia el slider */
          pointer-events: auto;
        }

        .ui-eyebrow { 
          font-size: 22px; 
          letter-spacing: 2px; 
          opacity: 0.6; 
          display: block;
          color: #fff;
        }

        .ui-title { 
          font-size: 60px; /* Un poco más grande para impacto */
          margin: 10px 0;
          color: #fff;
          text-transform: uppercase;
          line-height: 1;
        }

        .ui-description { 
          font-size: 16px; 
          line-height: 1.6; 
          opacity: 0.8; 
          margin-bottom: 30px; 
          color: #ccc;
          max-width: 400px;
          margin-left: auto; /* Empuja el texto a la derecha */
        }

        .ui-btn { 
          padding: 12px 30px; 
          border-radius: 30px; 
          border: none; 
          font-weight: 700; 
          font-size: 14px;
          cursor: pointer; 
          background: #fff;
          color: #000;
          letter-spacing: 1px;
          transition: transform 0.2s;
        }
        
        .ui-btn:hover {
          transform: scale(1.05);
        }

        /* Animaciones de Entrada */
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ui-eyebrow, .ui-title, .ui-description, .ui-btn {
          animation: fadeSlide 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        
        .ui-title { animation-delay: 0.1s; }
        .ui-description { animation-delay: 0.2s; }
        .ui-btn { animation-delay: 0.3s; }

        /* Flechas y Stats */
        .arrow-line2 {
          position: absolute;
          height: 2px;
          background: #FB670B;
          z-index: 5;
          transform-origin: left;
          animation: growLine 1s ease forwards;
        }

        .arrow-text { 
          position: absolute; 
          color: #fff; 
          font-size: 24px; 
          font-weight: 600; 
          letter-spacing: 1px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
          z-index: 5;
        }

        .country-count { 
          position: absolute; 
          color: #FB670B; 
          font-size: 42px; 
          font-weight: 700; 
          z-index: 5;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        @keyframes growLine {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .ui-wrap { 
            position: absolute;
            bottom: 5%;
            top: auto;
            right: 0;
            left: 0;
            width: 100%;
            padding: 0 20px;
            transform: none; 
            text-align: center; 
            flex-direction: column; 
            gap: 20px;
          }
          
          .ui-text-content {
            text-align: center;
            margin: 0 auto;
          }

          .ui-description {
            margin: 0 auto 20px auto;
          }

          .slider-sidebar {
            display: none; /* Ocultar slider en móvil si se desea */
          }

          .ui-title { font-size: 40px; }
          .country-count { font-size: 32px; }
          .arrow-text { font-size: 18px; }
        }
      `}</style>

    </div>
  );
}