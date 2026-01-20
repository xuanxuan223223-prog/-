import React, { useState } from 'react';
import { Scan, Activity, AlertTriangle, Database } from 'lucide-react';
import { analyzeEnvironment } from '../services/geminiService';
import { LevelData, AnalysisResult } from '../types';

interface ScannerProps {
  level: LevelData;
}

const Scanner: React.FC<ScannerProps> = ({ level }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    setIsOpen(true);
    // Simulate scanner delay for effect
    await new Promise(r => setTimeout(r, 800));
    const data = await analyzeEnvironment(level);
    setResult(data);
    setLoading(false);
  };

  const closeScanner = () => {
    setIsOpen(false);
    setResult(null);
  };

  return (
    <div className="fixed bottom-8 left-8 z-50">
      {!isOpen && (
        <button
          onClick={handleScan}
          className="group flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full text-white hover:bg-white hover:text-black transition-all duration-300"
        >
          <Scan className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span className="font-mono text-sm tracking-widest uppercase">扫描区域</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-black/80 backdrop-blur-xl border border-white/20 p-6 rounded-2xl w-80 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <Activity className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
              <span className="font-mono text-xs uppercase tracking-widest">
                {loading ? '环境分析中...' : '分析完成'}
              </span>
            </div>
            <button 
              onClick={closeScanner}
              className="text-white/40 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>

          {loading ? (
            <div className="space-y-2">
              <div className="h-2 bg-white/10 rounded w-full animate-pulse" />
              <div className="h-2 bg-white/10 rounded w-3/4 animate-pulse" />
              <div className="h-2 bg-white/10 rounded w-1/2 animate-pulse" />
            </div>
          ) : result ? (
            <div className="space-y-4 text-sm font-mono text-gray-300">
              <div className="border-b border-white/10 pb-2">
                <span className="text-xs text-gray-500 uppercase block mb-1">地质成分</span>
                <div className="flex items-start gap-2">
                   <Database className="w-3 h-3 mt-1 text-blue-400 shrink-0" />
                   {result.composition}
                </div>
              </div>
              
              <div className="border-b border-white/10 pb-2">
                <span className="text-xs text-gray-500 uppercase block mb-1">威胁等级</span>
                 <div className="flex items-center gap-2">
                   <AlertTriangle className={`w-3 h-3 ${result.dangerLevel.includes('低') || result.dangerLevel.includes('Safe') ? 'text-green-500' : 'text-red-500'}`} />
                   <span className={result.dangerLevel.includes('低') || result.dangerLevel.includes('Safe') ? 'text-green-400' : 'text-red-400'}>
                     {result.dangerLevel}
                   </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-500 uppercase block mb-1">AI 日志</span>
                <p className="italic text-white/80 border-l-2 border-white/30 pl-3 leading-relaxed">
                  "{result.note}"
                </p>
              </div>
              
              <div className="text-[10px] text-right text-white/20 pt-2">
                ID: {result.scanId}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Scanner;