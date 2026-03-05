import React, { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function GlobePlanetClient() {
  useEffect(() => {
    const container = document.getElementById('planetContainer');
    if (!container) return;
    container.innerHTML = '';

    const isMobile = window.innerWidth < 768;

    // --- ESCENA ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = isMobile ? 5.2 : 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(0, 0, 5);
    scene.add(light);

    const pivot = new THREE.Group();
    
    // --- ÁNGULOS ---
    const ROTATION_LATAM = -4.9; 
    const ROTATION_MICHOACAN = -4.5; 
    const ROTATION_MISSION = -4.5; 
    const ROTATION_VISION = -4.5; 

    let targetRotationY = ROTATION_LATAM;
    let isRotationLocked = false;
    let currentLerpFactor = 0.035;

    // --- VARIABLES DE INTENSIDAD DINÁMICA ---
    let configIntensityBase = 1.0;
    let configIntensityMin = 0.3;
    let configIntensityMax = 1.2;
    let isBreathingActive = true; 

    // --- VARIABLES PARA TRANSICIÓN SUAVE DE TEXTURAS ---
    let targetTexture = null;
    let targetColor = 0xff7a00;
    let transitionProgress = 1; // 1 = completamente en textura actual, 0 = en transición
    let isTransitioning = false;

    // Posición inicial
    pivot.rotation.y = ROTATION_LATAM - 3.5;
    pivot.scale.set(0, 0, 0);
    scene.add(pivot);

    // --- TEXTURAS ---
    const texLoader = new THREE.TextureLoader();
    const texLatam = texLoader.load('/assets/textures/latam_emissive.png');
    const texMichoacan = texLoader.load('/assets/textures/michoacan_emissive.png'); 
    const texMission = texLoader.load('/assets/textures/mission_emissive.png'); 
    const texVision = texLoader.load('/assets/textures/vision_emissive.png');
    
    let planetRef = null;
    let isReadyDispatched = false;
    let currentIntensity = 0;
    let pulseTime = 0;

    // --- MARCADORES PING ---
    const pingMarkers = [];
    let showPingMarkers = false;
    let targetShowPingMarkers = false;
    let pingMarkersOpacity = 0;

    // Función para convertir coordenadas geográficas a cartesianas
    const latLonToVector3 = (lat, lon, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);

      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);

      return new THREE.Vector3(x, y, z);
    };

    // Función para crear un marcador de ping
    const createPingMarker = (lat, lon, radius = 1.05) => {
      const group = new THREE.Group();

      // Posición en el globo
      const position = latLonToVector3(lat, lon, radius);
      group.position.copy(position);

      // Pin central (punto fijo brillante)
      const pinGeometry = new THREE.SphereGeometry(0.018, 16, 16);
      const pinMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff3333,
        transparent: true,
        opacity: 0,
        depthTest: false,
        depthWrite: false
      });
      const pin = new THREE.Mesh(pinGeometry, pinMaterial);
      pin.renderOrder = 999;
      group.add(pin);

      // Halo interno brillante
      const haloGeometry = new THREE.SphereGeometry(0.025, 16, 16);
      const haloMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6644,
        transparent: true,
        opacity: 0,
        depthTest: false,
        depthWrite: false
      });
      const halo = new THREE.Mesh(haloGeometry, haloMaterial);
      halo.renderOrder = 998;
      group.add(halo);

      // Crear anillos usando SPRITES para mantener forma circular
      const rings = [];
      for (let i = 0; i < 3; i++) {
        // Crear textura de anillo circular
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Dibujar anillo circular
        const centerX = 64;
        const centerY = 64;
        const gradient = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, 64);
        gradient.addColorStop(0, 'rgba(255, 102, 68, 0)');
        gradient.addColorStop(0.7, 'rgba(255, 102, 68, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 102, 68, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 64, 0, Math.PI * 2);
        ctx.fill();
        
        // Círculo interior transparente
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
        ctx.fill();
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: 0,
          depthTest: false,
          depthWrite: false
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(0.08, 0.08, 1);
        sprite.renderOrder = 997;
        
        sprite.userData.delay = i * 0.7;
        sprite.userData.phase = 0;
        sprite.userData.baseScale = 0.08;
        sprite.userData.baseOpacity = 0;
        
        group.add(sprite);
        rings.push(sprite);
      }

      group.userData.rings = rings;
      group.userData.pin = pin;
      group.userData.halo = halo;

      return group;
    };

    // --- COORDENADAS AJUSTADAS PARA MAPA DE LATINOAMÉRICA ---
    const locations = [
      // MICHOACÁN (Índice 0 - PUNTO DE ORIGEN)
      { lat: 9.7060, lon: -19.1844, name: 'Michoacán' }, // 0
      
      // LATINOAMÉRICA
      { lat: 9.4326, lon: -34.1332, name: 'México' },      // 1
      { lat: -23.5505, lon: -91.6333, name: 'Brasil' },    // 2
      { lat: 49.7110, lon: -44.0721, name: 'Colombia' },    // 3
      { lat: -24.6037, lon: -68.3816, name: 'Argentina' }, // 4
      
      // EUROPA
      { lat: 40.4168, lon: -52.7038, name: 'España' },      // 5
      { lat: 38.8566, lon: 2.3522, name: 'Francia' },      // 6
      { lat: 35.5200, lon: -23.4050, name: 'Alemania' },     // 7
      { lat: 61.5074, lon: -1.1278, name: 'Reino Unido' }, // 8
    ];

    // Crear todos los marcadores
    locations.forEach(loc => {
      const marker = createPingMarker(loc.lat, loc.lon);
      marker.visible = false;
      pivot.add(marker);
      pingMarkers.push(marker);
    });

    // --- LÍNEAS CONECTORAS ---
    const connectionLines = [];
    
    const createConnectionLine = (startLat, startLon, endLat, endLon) => {
      const startPos = latLonToVector3(startLat, startLon, 1.05);
      const endPos = latLonToVector3(endLat, endLon, 1.05);
      
      // Punto medio elevado para la curva
      const midPoint = new THREE.Vector3()
        .addVectors(startPos, endPos)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(1.6);

      const curve = new THREE.QuadraticBezierCurve3(
        startPos,
        midPoint,
        endPos
      );

      const points = curve.getPoints(100);
      
      // Crear tubo
      const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.004, 8, false);
      const tubeMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6644,
        transparent: true,
        opacity: 0,
        depthTest: false,
        depthWrite: false
      });

      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
      tube.renderOrder = 996;
      tube.visible = false;
      tube.userData.baseOpacity = 0;
      
      return tube;
    };

    // --- CONEXIONES: DESDE MICHOACÁN HACIA LATINOAMÉRICA Y EUROPA ---
    const connections = [
      // HACIA LATINOAMÉRICA
      [0, 1], // Michoacán -> México
      [0, 2], // Michoacán -> Brasil
      [0, 3], // Michoacán -> Colombia
      [0, 4], // Michoacán -> Argentina
      
      // HACIA EUROPA
      [0, 5], // Michoacán -> España
      [0, 6], // Michoacán -> Francia
      [0, 7], // Michoacán -> Alemania
      [0, 8], // Michoacán -> Reino Unido
    ];

    connections.forEach(([startIdx, endIdx]) => {
      const startLoc = locations[startIdx];
      const endLoc = locations[endIdx];
      const line = createConnectionLine(startLoc.lat, startLoc.lon, endLoc.lat, endLoc.lon);
      pivot.add(line);
      connectionLines.push(line);
    });

    // --- CARGA MODELO ---
    const loader = new GLTFLoader();
    loader.load('/assets/models/mundo.glb', (gltf) => {
      const planet = gltf.scene;
      planetRef = planet;

      planet.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.emissive = new THREE.Color(0xff7a00);
          child.material.emissiveIntensity = 0;
          child.material.emissiveMap = texLatam;
          child.material.needsUpdate = true;
        }
      });

      const box = new THREE.Box3().setFromObject(planet);
      const center = box.getCenter(new THREE.Vector3());
      planet.position.sub(center);

      pivot.add(planet);
    });

    // --- ACTUALIZADOR CON TRANSICIÓN SUAVE ---
    const updateEmissiveState = (tex, colorHex, intensitySettings) => {
        configIntensityBase = intensitySettings.base;
        configIntensityMin = intensitySettings.min;
        configIntensityMax = intensitySettings.max;

        // Configurar transición
        targetTexture = tex;
        targetColor = colorHex;
        isTransitioning = true;
        transitionProgress = 0; // Iniciar transición desde 0
    };

    // --- MODOS ---
    
    // 1. LATAM: SI RESPIRA
    const handleLatamMode = () => {
        console.log('Modo LATAM activado');
        isBreathingActive = true;
        targetShowPingMarkers = false;
        updateEmissiveState(texLatam, 0xff7a00, {
            base: 1.0,
            min: 0.3,
            max: 1.2
        });
        targetRotationY = ROTATION_LATAM;
        currentLerpFactor = 0.035;
        isRotationLocked = false;
    };

    // 2. MICHOACÁN: FIJO (NO RESPIRA)
    const handleMichoacanMode = () => {
        console.log('Modo MICHOACÁN activado');
        isBreathingActive = false;
        targetShowPingMarkers = false;
        updateEmissiveState(texMichoacan, 0xffffff, {
            base: 2.0, 
            min: 1.0,
            max: 2.8
        });
        targetRotationY = ROTATION_MICHOACAN;
        currentLerpFactor = 0.08;
        isRotationLocked = false;
    };

    // 3. MISIÓN: FIJO CON MARCADORES
    const handleMissionMode = () => {
        console.log('Modo MISIÓN activado - Mostrando marcadores');
        isBreathingActive = false;
        targetShowPingMarkers = true;
        updateEmissiveState(texMission, 0xffffff, {
            base: 2.0, 
            min: 1.0,
            max: 2.8 
        });
        targetRotationY = ROTATION_MISSION;
        currentLerpFactor = 0.08;
        isRotationLocked = false;
    };

    // 4. VISIÓN: FIJO SIN MARCADORES (SOLO TEXTURA)
    const handleVisionMode = () => {
        console.log('Modo VISIÓN activado - Solo textura');
        isBreathingActive = false;
        targetShowPingMarkers = false;
         updateEmissiveState(texMission, 0xffffff, {
            base: 2.0, 
            min: 1.0,
            max: 2.8 
        });
        targetRotationY = ROTATION_VISION;
        currentLerpFactor = 0.08;
        isRotationLocked = false;
    };

    window.addEventListener('show-latam', handleLatamMode);
    window.addEventListener('show-michoacan', handleMichoacanMode);
    window.addEventListener('show-vision', handleMissionMode);
    window.addEventListener('show-global', handleVisionMode);

    // --- ANIMACIÓN ---
    const animate = () => {
      requestAnimationFrame(animate);

      pivot.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
      
      if (!isRotationLocked) {
        const diff = targetRotationY - pivot.rotation.y;
        pivot.rotation.y += diff * currentLerpFactor; 
      }
      pivot.rotation.x = 0.15;

      // --- TRANSICIÓN SUAVE DE TEXTURAS ---
      if (isTransitioning && planetRef) {
        // Incrementar progreso de transición suavemente
        transitionProgress += 0.03; // Velocidad de transición (más bajo = más lento)
        
        if (transitionProgress >= 1) {
          transitionProgress = 1;
          isTransitioning = false;
          
          // Aplicar textura final
          planetRef.traverse((child) => {
            if (child.isMesh && child.material) {
              child.material.emissiveMap = targetTexture;
              child.material.emissive.setHex(targetColor);
              child.material.needsUpdate = true;
            }
          });
        } else {
          // Durante la transición: fade out -> fade in
          const easedProgress = transitionProgress < 0.5 
            ? transitionProgress * 2 // Fade out (0 a 1)
            : (transitionProgress - 0.5) * 2; // Fade in (0 a 1)
          
          planetRef.traverse((child) => {
            if (child.isMesh && child.material?.emissiveMap) {
              if (transitionProgress < 0.5) {
                // Primera mitad: fade out (reducir intensidad)
                const fadeOut = 1 - easedProgress;
                child.material.emissiveIntensity = currentIntensity * fadeOut * 0.3;
              } else {
                // Segunda mitad: aplicar nueva textura y fade in
                if (child.material.emissiveMap !== targetTexture) {
                  child.material.emissiveMap = targetTexture;
                  child.material.emissive.setHex(targetColor);
                  child.material.needsUpdate = true;
                }
                child.material.emissiveIntensity = currentIntensity * easedProgress * 0.6;
              }
            }
          });
        }
      }

      // --- TRANSICIÓN SUAVE DE MARCADORES ---
      if (targetShowPingMarkers !== showPingMarkers) {
        if (targetShowPingMarkers) {
          // Aparecer gradualmente
          pingMarkersOpacity = Math.min(pingMarkersOpacity + 0.04, 1);
          if (pingMarkersOpacity >= 0.95) {
            showPingMarkers = true;
            pingMarkers.forEach(marker => marker.visible = true);
            connectionLines.forEach(line => line.visible = true);
          }
        } else {
          // Desaparecer gradualmente
          pingMarkersOpacity = Math.max(pingMarkersOpacity - 0.04, 0);
          if (pingMarkersOpacity <= 0.05) {
            showPingMarkers = false;
            pingMarkers.forEach(marker => marker.visible = false);
            connectionLines.forEach(line => line.visible = false);
          }
        }
      }

      // ANIMAR MARCADORES PING
      if (showPingMarkers || pingMarkersOpacity > 0) {
        pingMarkers.forEach(marker => {
          if (!marker.visible && pingMarkersOpacity < 0.05) return;

          // Animar sprites (anillos)
          marker.userData.rings.forEach((sprite, idx) => {
            sprite.userData.phase += 0.015;
            
            const progress = (sprite.userData.phase - sprite.userData.delay) % 3;
            
            if (progress > 0 && progress < 2.5) {
              const normalizedProgress = progress / 2.5;
              
              // Escala del sprite
              const scale = sprite.userData.baseScale * (1 + normalizedProgress * 4);
              sprite.scale.set(scale, scale, 1);
              
              // Opacidad con curva suave y fade general
              const opacityCurve = Math.sin(normalizedProgress * Math.PI);
              sprite.material.opacity = opacityCurve * 0.5 * pingMarkersOpacity;
            } else {
              sprite.material.opacity = 0;
              sprite.scale.set(sprite.userData.baseScale, sprite.userData.baseScale, 1);
            }
          });

          // Pulso suave del pin central
          const time = Date.now() * 0.003;
          const pinPulse = Math.sin(time) * 0.08 + 1;
          marker.userData.pin.scale.set(pinPulse, pinPulse, pinPulse);
          marker.userData.pin.material.opacity = 1 * pingMarkersOpacity;
          
          // Pulso del halo
          const haloPulse = Math.sin(time * 1.3) * 0.12 + 1;
          marker.userData.halo.scale.set(haloPulse, haloPulse, haloPulse);
          marker.userData.halo.material.opacity = (0.25 + Math.sin(time) * 0.08) * pingMarkersOpacity;
        });

        // Animar opacidad de líneas con efecto de flujo
        connectionLines.forEach((line, idx) => {
          if (!line.visible && pingMarkersOpacity < 0.05) return;
          const flowEffect = Math.sin(Date.now() * 0.001 + idx * 0.5) * 0.5 + 0.5;
          const targetOpacity = (0.15 + flowEffect * 0.15) * pingMarkersOpacity;
          line.material.opacity = THREE.MathUtils.lerp(
            line.material.opacity,
            targetOpacity,
            0.08
          );
        });
      }

      // LÓGICA INTENSIDAD DEL PLANETA (solo si NO está en transición)
      if (planetRef && !isTransitioning) {
        const diff = targetRotationY - pivot.rotation.y;
        const stopThreshold = 0.12;
        const isStopped = Math.abs(diff) < stopThreshold;

        if (isStopped) {
          currentIntensity = THREE.MathUtils.lerp(currentIntensity, configIntensityBase, 0.08);
          
          let finalValue = currentIntensity;

          if (isBreathingActive) {
            pulseTime += 0.016; 
            const breathe = Math.sin(pulseTime * 1.5) * 0.5;
            const glowPulse = Math.sin(pulseTime * 0.5) * 0.3;
            finalValue += breathe + glowPulse;
            finalValue = Math.max(configIntensityMin, Math.min(configIntensityMax, finalValue));
          } else {
             pulseTime = 0; 
             finalValue = configIntensityBase; 
          }

          planetRef.traverse((child) => {
            if (child.isMesh && child.material?.emissiveMap) {
              child.material.emissiveIntensity = finalValue;
            }
          });
          
        } else {
          currentIntensity = THREE.MathUtils.lerp(currentIntensity, 0.2, 0.1);
          planetRef.traverse((child) => {
            if (child.isMesh && child.material?.emissiveMap) {
              child.material.emissiveIntensity = currentIntensity;
            }
          });
        }
      }

      const diffReady = targetRotationY - pivot.rotation.y;
      if (!isReadyDispatched && Math.abs(diffReady) < 0.25 && pivot.scale.x > 0.92) {
        isReadyDispatched = true;
        window.dispatchEvent(new CustomEvent('planet-ready'));
      }

      renderer.render(scene, camera);
    };

    animate();

    setTimeout(() => {
        if(!isReadyDispatched) {
            isReadyDispatched = true;
            window.dispatchEvent(new CustomEvent('planet-ready'));
        }
    }, 1200); 

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('show-latam', handleLatamMode);
      window.removeEventListener('show-michoacan', handleMichoacanMode);
      window.removeEventListener('show-vision', handleMissionMode);
      window.removeEventListener('show-global', handleVisionMode);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div id="planetContainer" style={{ width: '100%', height: '100%' }} />
    </div>
  );
}