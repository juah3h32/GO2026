import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function Simple3DModel() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(5, 5, 5);
    scene.add(light, new THREE.AmbientLight(0xffffff, 1));

    const loader = new GLTFLoader();
    loader.load('/models/yo2.glb', (gltf) => {
      const model = gltf.scene;
      scene.add(model);
      
      // Hacemos el modelo accesible globalmente para inicio.js
      window.myModel = model;
      
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      // Rotación constante sutil
      if (window.myModel) window.myModel.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="fanta" 
      style={{ 
        position: 'absolute', 
        width: '40%', 
        height: '100vh', 
        zIndex: 2, 
        pointerEvents: 'none' 
      }}
    />
  );
}