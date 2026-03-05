import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, ContactShadows } from '@react-three/drei';

function Model(props) {
  // Ruta exacta a tu archivo en public
  const { scene } = useGLTF('/models/fabrica.glb');
  
  // Referencia para animar el modelo si quieres
  const ref = useRef();

  useFrame((state) => {
    // Rotación suave constante
    if (ref.current) {
      ref.current.rotation.y += 0.002;
    }
  });

  return <primitive object={scene} ref={ref} {...props} />;
}

export default function FactoryModel3D() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
        {/* Iluminación ambiental */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        {/* Animación de flotación suave */}
        <Float 
          speed={2} 
          rotationIntensity={0.5} 
          floatIntensity={0.5} 
          floatingRange={[-0.2, 0.2]}
        >
          <Model scale={1.5} position={[0, -1, 0]} />
        </Float>

        {/* Entorno e iluminación realista */}
        <Environment preset="city" />
        
        {/* Sombras en el suelo */}
        <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={1.5} far={4.5} />
      </Canvas>
    </div>
  );
}

// Precarga del modelo para evitar saltos visuales
useGLTF.preload('/models/fabrica.glb');