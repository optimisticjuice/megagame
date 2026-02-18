// TypeScript types for the game navigation system
// This demonstrates complex type definitions for a multi-game system

import type { ReactNode } from 'react';

// Game configuration interface - shows how to type game metadata
export interface GameConfig {
  id: number;
  name: string;
  component: ReactNode;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  features: string[];
}

// Navigation state interface - demonstrates useState typing
export interface NavigationState {
  currentGameIndex: number;
  totalGames: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

// Navigation action types - shows useReducer action typing
export type NavigationAction = 
  | { type: 'GO_TO_PREVIOUS' }
  | { type: 'GO_TO_NEXT' }
  | { type: 'GO_TO_GAME'; index: number }
  | { type: 'SET_TOTAL_GAMES'; total: number };

// Game difficulty progression interface
export interface DifficultyProgression {
  currentLevel: number;
  maxLevel: number;
  scoreThreshold: number;
  isUnlocked: boolean;
}

// Game statistics interface for tracking progress across games
export interface GameStats {
  gamesPlayed: number;
  totalScore: number;
  bestScores: Record<string, number>;
  timeSpent: Record<string, number>;
  difficultyPreferences: Record<string, 'Easy' | 'Medium' | 'Hard'>;
}
