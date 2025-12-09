import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SimulationConfig, Point4D } from '../types';

interface HyperGeometryProps {
  config: SimulationConfig;
}

const HyperGeometry: React.FC<HyperGeometryProps> = ({ config }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate initial 4D points on the Clifford Torus
  // This runs only when particleCount changes
  const { particles, colors, positions } = useMemo(() => {
    const tempParticles: Point4D[] = [];
    const tempPositions = new Float32Array(config.particleCount * 3);
    const tempColors = new Float32Array(config.particleCount * 3);
    
    const color1 = new THREE.Color();
    const color2 = new THREE.Color();

    if (config.colorScheme === 'cyber') {
      color1.set(0x00ffff); // Cyan
      color2.set(0xff00ff); // Magenta
    } else if (config.colorScheme === 'thermal') {
      color1.set(0xffaa00); // Orange
      color2.set(0x0000ff); // Blue
    } else {
      color1.set(0xffffff);
      color2.set(0x333333);
    }

    for (let i = 0; i < config.particleCount; i++) {
      // Parameterize S1 x S1
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;

      // Definition of Clifford Torus in R4 (subset of S3)
      // Circle 1 in XY plane, Circle 2 in ZW plane
      const x = Math.cos(u);
      const y = Math.sin(u);
      const z = Math.cos(v);
      const w = Math.sin(v);

      tempParticles.push({ x, y, z, w, u, v });

      // Calculate static colors based on topology parameters (u) to visualize the manifold structure
      const mixFactor = (Math.cos(u) + 1) / 2;
      const finalColor = color1.clone().lerp(color2, mixFactor);
      
      tempColors[i * 3] = finalColor.r;
      tempColors[i * 3 + 1] = finalColor.g;
      tempColors[i * 3 + 2] = finalColor.b;
    }

    return { 
      particles: tempParticles, 
      positions: tempPositions, 
      colors: tempColors 
    };
  }, [config.particleCount, config.colorScheme]);

  // Animation Loop
  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const positionsAttribute = pointsRef.current.geometry.attributes.position;
    
    // Rotation logic
    const xwAngle = time * config.xwSpeed; // The "4th dimension" rotation
    const yzAngle = time * config.yzSpeed; // Standard 3D tumbling

    const cosXW = Math.cos(xwAngle);
    const sinXW = Math.sin(xwAngle);
    const cosYZ = Math.cos(yzAngle);
    const sinYZ = Math.sin(yzAngle);

    for (let i = 0; i < config.particleCount; i++) {
      const p = particles[i];

      // 1. Rotate in XW plane (4D Rotation) - mixing X and W coordinates
      // This creates the "inside-out" eversion effect
      const x_r1 = p.x * cosXW - p.w * sinXW;
      const w_r1 = p.x * sinXW + p.w * cosXW;
      const y_r1 = p.y;
      const z_r1 = p.z;

      // 2. Rotate in YZ plane (3D Rotation)
      const x_r2 = x_r1;
      const y_r2 = y_r1 * cosYZ - z_r1 * sinYZ;
      const z_r2 = y_r1 * sinYZ + z_r1 * cosYZ;
      const w_r2 = w_r1;

      // 3. Stereographic Projection R4 -> R3
      // Project from North Pole (0,0,0,1) to hyperplane w = 0
      // Formula: P3 = P4 / (R - w)
      const r = config.projectionDistance;
      const denominator = r - w_r2;
      
      // Prevent division by zero or extreme explosion near the pole
      const safeDiv = Math.abs(denominator) < 0.01 ? 0.01 : denominator;
      const factor = r / safeDiv;

      positionsAttribute.setXYZ(
        i, 
        x_r2 * factor, 
        y_r2 * factor, 
        z_r2 * factor
      );
    }

    positionsAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={config.particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={config.particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={config.pointSize}
        vertexColors
        transparent
        opacity={config.opacity}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default HyperGeometry;