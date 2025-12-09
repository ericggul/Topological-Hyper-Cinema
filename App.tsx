import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import HyperGeometry from './components/HyperGeometry';
import Interface from './components/Interface';
import { SimulationConfig } from './types';

const App: React.FC = () => {
  const [config, setConfig] = useState<SimulationConfig>({
    xwSpeed: 0.5,
    yzSpeed: 0.2,
    projectionDistance: 2.5,
    particleCount: 15000,
    opacity: 0.6,
    pointSize: 0.05,
    colorScheme: 'cyber'
  });

  return (
    <div className="w-full h-screen bg-black relative font-sans antialiased overflow-hidden">
      
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ antialias: true, alpha: false }}>
          <color attach="background" args={['#050505']} />
          <Suspense fallback={null}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <HyperGeometry config={config} />
            <OrbitControls 
              makeDefault
              enablePan={true} 
              enableZoom={true} 
              enableRotate={true}
              minDistance={1} 
              maxDistance={20} 
              enableDamping={true}
              dampingFactor={0.05}
              autoRotate={false}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Interface config={config} setConfig={setConfig} />
      </div>

    </div>
  );
};

export default App;