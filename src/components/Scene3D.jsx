import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Stage, PresentationControls, OrbitControls } from '@react-three/drei';

function Model({ url }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (modelRef.current) {
      modelRef.current.rotation.y = Math.sin(t / 8) * 0.1;
    }
  });

  useEffect(() => {
    console.log('Model loaded:', scene);
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        if (child.material) {
          child.material = child.material.clone();
          
          const materialName = child.material.name?.toLowerCase() || '';
          const meshName = child.name?.toLowerCase() || '';
          
          if (materialName.includes('metal') || meshName.includes('metal')) {
            child.material.metalness = 0.95;
            child.material.roughness = 0.15;
            child.material.envMapIntensity = 3.5;
          } 
          else if (materialName.includes('paint') || materialName.includes('body')) {
            child.material.metalness = 0.3;
            child.material.roughness = 0.35;
            child.material.envMapIntensity = 2.2;
          } 
          else {
            child.material.metalness = 0.6;
            child.material.roughness = 0.3;
            child.material.envMapIntensity = 2.5;
          }
          
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={7}
      position={[0, -2.5, 0]}
    />
  );
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function Scene3D() {
  console.log('Scene3D rendering...');
  
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{ position: [5, 2, 5], fov: 50 }}
      >
        <Suspense fallback={<Loader />}>
          <Stage
            preset="soft"
            intensity={1}
            environment="warehouse"
            adjustCamera={1.6}
          >
            <PresentationControls
              global
              zoom={1.5}
              rotation={[0, -Math.PI / 6, 0]}
              polar={[-Math.PI / 6, Math.PI / 6]}
              azimuth={[-Math.PI / 4, Math.PI / 4]}
            >
              <Model url="/models/maquinaSMLPowerCast.glb" />
            </PresentationControls>
          </Stage>
        </Suspense>
        
        <OrbitControls />
      </Canvas>
    </div>
  );
}
