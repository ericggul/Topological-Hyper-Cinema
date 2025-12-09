export interface SimulationConfig {
  xwSpeed: number; // 4D Rotation speed (The "Inside-Out" morph)
  yzSpeed: number; // 3D Rotation speed (Tumbling)
  projectionDistance: number; // Stereographic projection radius
  particleCount: number;
  opacity: number;
  pointSize: number;
  colorScheme: 'thermal' | 'cyber' | 'monochrome';
}

export interface Point4D {
  x: number;
  y: number;
  z: number;
  w: number;
  u: number; // Parameter 1 (0-2PI)
  v: number; // Parameter 2 (0-2PI)
}