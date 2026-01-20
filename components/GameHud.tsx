import React from 'react';
import { Heart, Brain, ArrowDown } from 'lucide-react';

interface GameHudProps {
  health: number;
  sanity: number;
  depth: number;
}

const GameHud: React.FC<GameHudProps> = ({ health, sanity, depth }) => {
  // Helper to determine color based on value
  const getStatusColor = (val: number) => {
    if (val > 60) return 'text-emerald-400';
    if (val > 30) return 'text-yellow-400';
    return 'text-red-500 animate-pulse';
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 p-4 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]">
      <div className="max-w-3xl mx-auto flex justify-between items-center font-mono text-sm md:text-base">
        
        {/* Left: Vitals */}
        <div className="flex gap-6">
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/10">
            <Heart size={16} className={getStatusColor(health)} fill="currentColor" fillOpacity={0.2} />
            <span className="text-white font-bold">{health}%</span>
            <span className="hidden md:inline text-white/40 text-xs">生命</span>
          </div>

          <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/10">
            <Brain size={16} className={getStatusColor(sanity)} />
            <span className="text-white font-bold">{sanity}%</span>
            <span className="hidden md:inline text-white/40 text-xs">理智</span>
          </div>
        </div>

        {/* Right: Depth */}
        <div className="flex items-center gap-2 text-white mix-blend-difference">
          <div className="flex flex-col items-end leading-none">
            <span className="text-2xl font-display font-bold">-{depth}</span>
            <span className="text-[10px] text-white/60">METERS</span>
          </div>
          <ArrowDown size={20} className="text-white/60" />
        </div>

      </div>
      
      {/* Critical Overlay */}
      {(health < 20 || sanity < 20) && (
        <div className="absolute inset-0 border-b-2 border-red-500/50 pointer-events-none animate-pulse" />
      )}
    </div>
  );
};

export default GameHud;