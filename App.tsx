import React, { useState, useEffect } from 'react';
import { GameState, StoryScene, Choice } from './types';
import { getInitialScene, continueStory } from './services/geminiService';
import GameHud from './components/GameHud';
import StoryLog from './components/StoryLog';
import Flashlight from './components/Flashlight';
import { Play, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    health: 100,
    sanity: 100,
    depth: 0,
    scenes: [],
    status: 'start'
  });
  
  const [loading, setLoading] = useState(false);
  const [ambientColor, setAmbientColor] = useState('#000000');

  // Start the game
  const startGame = () => {
    const startScene = getInitialScene();
    setGameState({
      health: 100,
      sanity: 100,
      depth: 0,
      scenes: [startScene],
      status: 'playing'
    });
    setAmbientColor(startScene.colorHex);
  };

  // Handle user choice
  const handleChoice = async (choice: Choice) => {
    if (loading || gameState.status !== 'playing') return;
    
    setLoading(true);
    const lastScene = gameState.scenes[gameState.scenes.length - 1];
    
    try {
      // Call AI
      const nextScene = await continueStory(lastScene, choice.text, {
        health: gameState.health,
        sanity: gameState.sanity,
        depth: gameState.depth
      });

      // Update state based on AI response
      setGameState(prev => {
        const newHealth = Math.min(100, Math.max(0, prev.health + (nextScene.healthChange || 0)));
        const newSanity = Math.min(100, Math.max(0, prev.sanity + (nextScene.sanityChange || 0)));
        
        let newStatus = prev.status;
        if (nextScene.isGameOver) newStatus = 'gameover';
        if (nextScene.isWin) newStatus = 'victory';
        if (newHealth <= 0 || newSanity <= 0) newStatus = 'gameover';

        return {
          health: newHealth,
          sanity: newSanity,
          depth: nextScene.depth,
          scenes: [...prev.scenes, nextScene],
          status: newStatus
        };
      });
      
      if (nextScene.colorHex) {
        setAmbientColor(nextScene.colorHex);
      }
    } catch (error) {
      console.error("Critical game error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Background style transition
  const bgStyle = {
    backgroundColor: ambientColor,
    transition: 'background-color 2s ease-in-out'
  };

  const currentScene = gameState.scenes[gameState.scenes.length - 1];

  // Render Start Screen
  if (gameState.status === 'start') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 relative overflow-hidden">
         <div className="noise-overlay absolute inset-0 opacity-20"></div>
         <div className="z-10 max-w-lg text-center space-y-8 animate-in fade-in duration-1000">
            <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800">
              深渊潜行
            </h1>
            <p className="font-mono text-gray-400 leading-relaxed">
              一项单程任务。你将潜入地壳深处，面对未知的地质异常与古老的恐惧。
              <br/>
              保持理智。保持呼吸。
            </p>
            <button 
              onClick={startGame}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-mono font-bold tracking-widest uppercase hover:bg-emerald-400 transition-colors duration-300 cursor-pointer"
            >
              <Play size={18} />
              开始下潜
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col font-sans text-gray-200 overflow-hidden" style={bgStyle}>
      
      {/* Dynamic Background Effects */}
      <Flashlight active={gameState.status === 'playing'} intensity={0.6} />
      <div className="noise-overlay pointer-events-none fixed inset-0 z-40 opacity-[0.03]" />
      
      {/* HUD - z-index ensures it stays on top */}
      <GameHud 
        health={gameState.health} 
        sanity={gameState.sanity} 
        depth={gameState.depth} 
      />

      {/* Main Story Area */}
      <StoryLog history={gameState.scenes} loading={loading} />

      {/* Action Area (Bottom Sticky) - High z-index to be clickable */}
      <div className="z-50 p-4 md:p-8 bg-gradient-to-t from-black via-black/90 to-transparent">
        <div className="max-w-2xl mx-auto">
          {gameState.status === 'playing' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentScene?.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  disabled={loading}
                  className={`
                    py-4 px-4 text-left border border-white/10 bg-black/40 backdrop-blur-md
                    hover:bg-white/10 hover:border-white/40 transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                    flex flex-col gap-1 group relative overflow-hidden
                  `}
                >
                  {/* Loading shim over button */}
                  {loading && <div className="absolute inset-0 bg-white/5 animate-pulse" />}
                  
                  <span className={`
                    text-[10px] uppercase tracking-widest font-bold
                    ${choice.type === 'risk' ? 'text-red-400' : choice.type === 'action' ? 'text-blue-400' : 'text-emerald-400'}
                  `}>
                    {choice.type === 'risk' ? '高风险' : choice.type === 'action' ? '行动' : '移动'}
                  </span>
                  <span className="font-mono text-sm text-white group-hover:text-white/90">
                    {choice.text}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            // Game Over / Win State
            <div className="text-center space-y-6 bg-black/80 backdrop-blur-xl p-8 border border-white/10 rounded-lg animate-in zoom-in-95 duration-500 relative z-50">
              <h2 className={`font-display text-4xl font-bold ${gameState.status === 'victory' ? 'text-yellow-400' : 'text-red-500'}`}>
                {gameState.status === 'victory' ? '任务完成' : '信号丢失'}
              </h2>
              <p className="font-mono text-white/70">
                {gameState.status === 'victory' 
                  ? '你成功带着深渊的秘密回到了地表。' 
                  : '你的生命信号已在雷达上消失。深渊吞噬了另以个灵魂。'}
              </p>
              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-mono font-bold hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <RotateCcw size={16} />
                再次尝试
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default App;