export interface Choice {
  id: string;
  text: string;
  type: 'move' | 'action' | 'risk';
}

export interface StoryScene {
  id: string;
  title: string;
  description: string;
  depth: number;
  choices: Choice[];
  // Visuals
  colorHex: string; // The ambient color of the scene
  icon: string; // lucide icon name
  // State changes
  healthChange: number;
  sanityChange: number;
  isGameOver: boolean;
  isWin: boolean;
}

export interface LogEntry {
  type: 'story' | 'choice' | 'system';
  content: string;
  metadata?: any;
}

export interface GameState {
  health: number;
  sanity: number;
  depth: number;
  scenes: StoryScene[]; // History of scenes
  status: 'start' | 'playing' | 'gameover' | 'victory';
}

export interface LevelData {
  id: number;
  depth: number;
  title: string;
  description: string;
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  opacity: number;
  icon: string;
}

export interface AnalysisResult {
  scanId: string;
  composition: string;
  dangerLevel: string;
  note: string;
}