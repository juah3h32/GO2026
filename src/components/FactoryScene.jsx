import { useEffect } from 'react';
import * as THREE from 'three';

export default function FactoryScene() {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '-2'; // detrás del globo
    document.body.appendChild(renderer.domElement);

    // Suelo
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20,20),
      new THREE.MeshStandardMaterial({ color:0x444444 })
    );
    floor.rotation.x = -Math.PI/2;
    floor.position.y = -1.5;
    scene.add(floor);

    // Caja simulando fábrica
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(3,2,3),
      new THREE.MeshStandardMaterial({ color:0x888888 })
    );
    box.position.y = 0;
    scene.add(box);

    const light = new THREE.DirectionalLight(0xffffff,1);
    light.position.set(5,5,5);
    scene.add(light);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene,camera);
    };
    animate();

    return () => {
      document.body.removeChild(renderer.domElement);
    }
  }, []);

  return null;
}
