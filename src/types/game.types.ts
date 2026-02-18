// TypeScript interfaces for type safety in the Memory Game

export interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  cards: Card[];
  flippedCards: number[];
  moves: number;
  matches: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  timer: number;
  bestScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Action types for useReducer
export type GameAction = 
  | { type: 'FLIP_CARD'; cardId: number }
  | { type: 'CHECK_MATCH' }
  | { type: 'RESET_GAME' }
  | { type: 'SET_DIFFICULTY'; difficulty: 'easy' | 'medium' | 'hard' }
  | { type: 'START_GAME' }
  | { type: 'INCREMENT_TIMER' };

// Emoji arrays for different difficulty levels
export const EMOJI_SETS = {
  easy: ['🎈', '🎨', '🎭', '🎪'],
  medium: ['🌟', '🌙', '🌈', '🌺', '🌸', '🌼'],
  hard: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼']
} as const;
