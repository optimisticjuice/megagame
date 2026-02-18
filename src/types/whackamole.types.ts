// TypeScript types for Whack-a-Mole game
// This demonstrates complex game state typing with nested objects and arrays

export interface Mole {
  id: number;
  isActive: boolean;
  isVisible: boolean;
  appearanceTime: number;
  duration: number;
  points: number;
  isHit: boolean;
}

export interface WhackAMoleState {
  // Game state management
  score: number;
  timeLeft: number;
  gameActive: boolean;
  gameStarted: boolean;
  gameCompleted: boolean;
  
  // Moles array - demonstrates array typing
  moles: Mole[];
  
  // Difficulty and progression
  difficulty: 'Easy' | 'Medium' | 'Hard';
  level: number;
  highScore: number;
  
  // Statistics
  hits: number;
  misses: number;
  streak: number;
  maxStreak: number;
  
  // Timing
  lastMoleTime: number;
  moleInterval: number;
}

export type WhackAMoleAction =
  | { type: 'START_GAME' }
  | { type: 'STOP_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'SET_DIFFICULTY'; difficulty: 'Easy' | 'Medium' | 'Hard' }
  | { type: 'SPAWN_MOLE'; moleId: number; duration: number }
  | { type: 'HIT_MOLE'; moleId: number }
  | { type: 'MISS_MOLE'; moleId: number }
  | { type: 'DESPAWN_MOLE'; moleId: number }
  | { type: 'UPDATE_TIMER' }
  | { type: 'INCREMENT_STREAK' }
  | { type: 'RESET_STREAK' }
  | { type: 'SET_LEVEL'; level: number };

export interface GameConfig {
  moleCount: number;
  baseDuration: number;
  baseInterval: number;
  scoreMultiplier: number;
  timeLimit: number;
}

export const DIFFICULTY_CONFIGS: Record<'Easy' | 'Medium' | 'Hard', GameConfig> = {
  Easy: {
    moleCount: 9,
    baseDuration: 2000,
    baseInterval: 1500,
    scoreMultiplier: 1,
    timeLimit: 60
  },
  Medium: {
    moleCount: 12,
    baseDuration: 1500,
    baseInterval: 1000,
    scoreMultiplier: 1.5,
    timeLimit: 45
  },
  Hard: {
    moleCount: 16,
    baseDuration: 1000,
    baseInterval: 700,
    scoreMultiplier: 2,
    timeLimit: 30
  }
};
