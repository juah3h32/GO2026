import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap'; // Para animaciones suaves

export default function Simple3DModel() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- ESCENA Y CÁMARA ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    
    const INITIAL_Z = 2; 
    camera.position.z = INITIAL_Z;

    // --- RENDERER ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // --- LUCES ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // --- CARGAR MODELO ---
    const loader = new GLTFLoader();
    let model;

    loader.load('assets/models/yo2.glb', (gltf) => {
      model = gltf.scene;

      // Centrar modelo
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);

      scene.add(model);

      // Animación inicial de entrada
      gsap.from(model.position, { y: -1, duration: 1.5, ease: 'power3.out' });
    });

    // --- SCROLL SUAVIZADO (ZOOM) ---
    let targetZ = INITIAL_Z;
    const handleScroll = () => {
      targetZ = INITIAL_Z + window.scrollY * 0.002; // Zoom más suave
    };
    window.addEventListener('scroll', handleScroll);

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();

      if (model) {
        // Rotación lenta y flotante
        model.rotation.y += delta * 0.3; // rotación suave
        model.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.05; // levitación
      }

      // Suavizado de zoom con lerp
      camera.position.z += (targetZ - camera.position.z) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    // --- REDIMENSIONAR ---
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- CLEANUP ---
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          zIndex: -1, 
          pointerEvents: 'none'
        }}
      />
      <div style={{ height: '300vh' }}></div>
    </>
  );
}
