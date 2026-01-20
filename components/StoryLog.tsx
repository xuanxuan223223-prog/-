import React, { useEffect, useRef } from 'react';
import { StoryScene } from '../types';
import { Sun, Cloud, ArrowDown, Diamond, Waves, Flame, Skull, Zap, Ghost, Eye, AlertTriangle } from 'lucide-react';

interface StoryLogProps {
  history: StoryScene[];
  loading: boolean;
}

const StoryLog: React.FC<StoryLogProps> = ({ history, loading }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, loading]);

  const getIcon = (iconName: string) => {
    const props = { size: 24, className: "text-white/80" };
    switch (iconName.toLowerCase()) {
      case 'sun': return <Sun {...props} />;
      case 'cloud': return <Cloud {...props} />;
      case 'arrow-down': return <ArrowDown {...props} />;
      case 'diamond': return <Diamond {...props} />;
      case 'waves': return <Waves {...props} />;
      case 'flame': return <Flame {...props} />;
      case 'skull': return <Skull {...props} />;
      case 'zap': return <Zap {...props} />;
      case 'ghost': return <Ghost {...props} />;
      case 'eye': return <Eye {...props} />;
      default: return <AlertTriangle {...props} />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar py-24 px-4 md:px-0">
      <div className="max-w-2xl mx-auto space-y-12">
        {history.map((scene, index) => (
          <div 
            key={scene.id} 
            className={`
              relative pl-8 md:pl-12 border-l border-white/10
              animate-in fade-in slide-in-from-bottom-4 duration-700
            `}
          >
            {/* Timeline node */}
            <div className="absolute -left-3 top-0 md:-left-4 bg-black p-1 md:p-2 rounded-full border border-white/20 z-10">
              {getIcon(scene.icon || 'circle')}
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                 <h2 className="font-display text-xl md:text-2xl font-bold text-white tracking-wide">
                   {scene.title}
                 </h2>
                 <span className="font-mono text-xs text-white/30">Depth: {scene.depth}m</span>
              </div>

              {/* Stat changes feedback */}
              {(scene.healthChange !== 0 || scene.sanityChange !== 0) && index > 0 && (
                 <div className="flex gap-3 text-xs font-mono py-1">
                    {scene.healthChange < 0 && <span className="text-red-400">生命 {scene.healthChange}</span>}
                    {scene.healthChange > 0 && <span className="text-green-400">生命 +{scene.healthChange}</span>}
                    {scene.sanityChange < 0 && <span className="text-purple-400">理智 {scene.sanityChange}</span>}
                    {scene.sanityChange > 0 && <span className="text-blue-400">理智 +{scene.sanityChange}</span>}
                 </div>
              )}

              <p className="font-mono text-sm md:text-base leading-relaxed text-gray-300">
                {scene.description}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="pl-12 animate-pulse flex items-center gap-2 text-white/40 font-mono text-xs">
             <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
             <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
             <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
             <span>AI 正在推演现实...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default StoryLog;