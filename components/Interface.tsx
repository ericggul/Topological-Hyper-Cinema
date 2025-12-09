import React from 'react';
import { SimulationConfig } from '../types';
import { Settings, Info, Play, Pause, RefreshCw } from 'lucide-react';

interface InterfaceProps {
  config: SimulationConfig;
  setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
}

const Interface: React.FC<InterfaceProps> = ({ config, setConfig }) => {
  const [showInfo, setShowInfo] = React.useState(true);
  const [paused, setPaused] = React.useState(false);

  const handleSliderChange = (key: keyof SimulationConfig, value: number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const togglePause = () => {
    setPaused(!paused);
    // Note: In a real implementation, we would pass 'paused' to the canvas loop, 
    // but for this visualizer, setting speed to 0 is visually equivalent for the user.
    if (!paused) {
      setConfig(prev => ({ ...prev, xwSpeed: 0, yzSpeed: 0 }));
    } else {
      setConfig(prev => ({ ...prev, xwSpeed: 0.5, yzSpeed: 0.2 }));
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
      {/* Header / Academic Context */}
      <header className="pointer-events-auto bg-black/60 backdrop-blur-md border-l-4 border-cyan-500 p-4 max-w-lg rounded-r-lg shadow-2xl shadow-cyan-900/20">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-cyan-400 font-mono text-xl tracking-wider font-bold">
              TOPOLOGICAL HYPER-CINEMA
            </h1>
            <h2 className="text-zinc-500 text-xs font-mono uppercase tracking-widest mt-1">
              {'Manifold Analysis: $S^1 \\times S^1 \\subset \\mathbb{R}^4$'}
            </h2>
          </div>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <Info size={20} />
          </button>
        </div>
        
        {showInfo && (
          <div className="text-zinc-400 text-sm space-y-3 font-light leading-relaxed border-t border-zinc-800 pt-3 mt-2">
            <p>
              <strong className="text-zinc-200">The Duocylinder</strong> (Clifford Torus) is a surface in 4D Euclidean space. It is the Cartesian product of two circles.
            </p>
            <p>
              Unlike a 3D torus, the Clifford Torus is "flat" in the sense of intrinsic geometry. The visualization applies a <span className="text-cyan-400">Stereographic Projection</span> to map 4D coordinates $(x,y,z,w)$ into 3D visible space.
            </p>
            <p className="text-xs font-mono bg-zinc-900 p-2 rounded border border-zinc-800">
              {'Transform: $P_3 = \\frac{r}{r-w} (x, y, z)$'}
            </p>
          </div>
        )}
      </header>

      {/* Footer / Controls */}
      <footer className="pointer-events-auto w-full max-w-md self-end bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-lg p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-2">
          <div className="flex items-center space-x-2 text-cyan-500">
            <Settings size={16} />
            <span className="text-xs font-mono font-bold uppercase">Parameter Control</span>
          </div>
          <div className="flex space-x-2">
             <button onClick={togglePause} className="text-zinc-400 hover:text-cyan-400 transition-colors">
               {paused ? <Play size={16} /> : <Pause size={16} />}
             </button>
             <button 
               onClick={() => setConfig(prev => ({ ...prev, colorScheme: prev.colorScheme === 'cyber' ? 'thermal' : 'cyber' }))}
               className="text-zinc-400 hover:text-cyan-400 transition-colors"
             >
               <RefreshCw size={16} />
             </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Slider 1: 4D Rotation */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono text-zinc-400">
              <span>XW-Plane Rotation (4th Dim)</span>
              <span className="text-cyan-400">{config.xwSpeed.toFixed(2)} rad/s</span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.01"
              value={config.xwSpeed}
              onChange={(e) => handleSliderChange('xwSpeed', parseFloat(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Slider 2: Projection Distance */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono text-zinc-400">
              <span>Stereographic Distance ($r$)</span>
              <span className="text-cyan-400">{config.projectionDistance.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1.1"
              max="5"
              step="0.1"
              value={config.projectionDistance}
              onChange={(e) => handleSliderChange('projectionDistance', parseFloat(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

           {/* Slider 3: Opacity */}
           <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono text-zinc-400">
              <span>Manifold Density</span>
              <span className="text-cyan-400">{(config.opacity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={config.opacity}
              onChange={(e) => handleSliderChange('opacity', parseFloat(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Interface;