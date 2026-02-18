import type { Card, GameState } from '../types/game.types';
import { EMOJI_SETS } from '../types/game.types';

// Initial game state creator - demonstrates functional programming patterns
export const getInitialState = (difficulty: 'easy' | 'medium' | 'hard' = 'easy'): GameState => {
  const emojis = EMOJI_SETS[difficulty];
  const cardPairs = [...emojis, ...emojis];
  
  // Using flatMap to create and shuffle cards in one operation
  // This demonstrates how flatMap can transform and flatten data simultaneously
  const cards: Card[] = cardPairs
    .flatMap((emoji, index) => [
      { id: index * 2, emoji, isFlipped: false, isMatched: false },
      { id: index * 2 + 1, emoji, isFlipped: false, isMatched: false }
    ])
    .sort(() => Math.random() - 0.5);

  return {
    cards,
    flippedCards: [],
    moves: 0,
    matches: 0,
    gameStarted: false,
    gameCompleted: false,
    timer: 0,
    bestScore: parseInt(localStorage.getItem('memoryGameBestScore') || '999'),
    difficulty
  };
};

// Utility function to check if two cards match
export const checkCardMatch = (card1: Card, card2: Card): boolean => {
  return card1.emoji === card2.emoji;
};

// Utility function to calculate game completion percentage using reduce
export const calculateCompletionPercentage = (cards: Card[]): number => {
  if (cards.length === 0) return 0;
  
  // Using reduce to count matched cards and calculate percentage
  const matchedCount = cards.reduce((acc, card) => 
    card.isMatched ? acc + 1 : acc, 0
  );
  
  return Math.round((matchedCount / cards.length) * 100);
};

// Utility function to get matched cards using filter
export const getMatchedCards = (cards: Card[]): Card[] => {
  // Using filter to extract only matched cards
  return cards.filter(card => card.isMatched);
};

// Utility function to check if game is completed
export const isGameCompleted = (cards: Card[], difficulty: 'easy' | 'medium' | 'hard'): boolean => {
  const matchedCards = getMatchedCards(cards);
  const requiredMatches = EMOJI_SETS[difficulty].length;
  return (matchedCards.length / 2) === requiredMatches;
};
