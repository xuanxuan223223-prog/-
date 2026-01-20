import React from 'react';
import { ArrowDown } from 'lucide-react';

interface DepthGaugeProps {
  currentDepth: number;
  maxDepth: number;
}

const DepthGauge: React.FC<DepthGaugeProps> = ({ currentDepth, maxDepth }) => {
  // Format depth to be uniform e.g. 0050m
  const formattedDepth = Math.round(currentDepth).toString().padStart(4, '0');
  
  return (
    <div className="fixed top-8 right-8 z-50 flex flex-col items-end mix-blend-difference text-white">
      <div className="flex items-center gap-2 font-display text-4xl font-bold tracking-tighter">
        <span>-{formattedDepth}</span>
        <span className="text-sm font-mono opacity-60">米</span>
      </div>
      <div className="flex items-center gap-2 text-xs font-mono opacity-60 mt-1">
        <span>当前深度</span>
        <ArrowDown size={12} className="animate-bounce" />
      </div>
      
      {/* Progress Bar */}
      <div className="w-1 h-32 bg-white/10 mt-4 rounded-full overflow-hidden relative">
        <div 
          className="absolute top-0 left-0 w-full bg-white transition-all duration-100 ease-linear"
          style={{ height: `${(currentDepth / maxDepth) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default DepthGauge;