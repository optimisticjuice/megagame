import { useReducer, useEffect, useCallback, useState } from 'react';
import type { GameState, GameAction } from '../types/game.types';
import { getInitialState } from '../utils/gameLogic';

// Reducer function for complex state management
// This demonstrates useReducer pattern for complex state logic
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'FLIP_CARD': {
      // Prevent flipping if already 2 cards are flipped or card is matched
      if (state.flippedCards.length >= 2) return state;
      if (state.cards.find(c => c.id === action.cardId)?.isMatched) return state;
      if (state.flippedCards.includes(action.cardId)) return state;

      // Using functional updater pattern to ensure state consistency
      const newFlippedCards = [...state.flippedCards, action.cardId];
      
      // Using map to update specific card in immutable way
      const newCards = state.cards.map(card =>
        card.id === action.cardId ? { ...card, isFlipped: true } : card
      );

      return {
        ...state,
        cards: newCards,
        flippedCards: newFlippedCards,
        gameStarted: true,
        moves: state.gameStarted ? state.moves : state.moves + 1
      };
    }

    case 'CHECK_MATCH': {
      if (state.flippedCards.length !== 2) return state;

      const [first, second] = state.flippedCards;
      const firstCard = state.cards.find(c => c.id === first);
      const secondCard = state.cards.find(c => c.id === second);

      if (!firstCard || !secondCard) return state;

      const isMatch = firstCard.emoji === secondCard.emoji;

      // Using map to update cards based on match result
      const newCards = state.cards.map(card => {
        if (card.id === first || card.id === second) {
          return { ...card, isMatched: isMatch, isFlipped: isMatch };
        }
        return card;
      });

      // Using filter to count matched pairs
      const totalMatches = newCards.filter(card => card.isMatched).length / 2;
      const gameCompleted = totalMatches === (state.difficulty === 'easy' ? 4 : state.difficulty === 'medium' ? 6 : 8);

      // Calculate new best score using reduce pattern
      const currentScore = state.moves;
      const newBestScore = Math.min(state.bestScore, currentScore);

      return {
        ...state,
        cards: newCards,
        flippedCards: [],
        matches: totalMatches,
        gameCompleted,
        bestScore: gameCompleted ? newBestScore : state.bestScore
      };
    }

    case 'RESET_GAME':
      return getInitialState(state.difficulty);

    case 'SET_DIFFICULTY':
      return getInitialState(action.difficulty);

    case 'START_GAME':
      return { ...state, gameStarted: true };

    case 'INCREMENT_TIMER':
      return { ...state, timer: state.timer + 1 };

    default:
      return state;
  }
}

// Custom hook that encapsulates all game logic
// This demonstrates how to create reusable game logic with hooks
export const useMemoryGame = () => {
  // Using useReducer for complex state management
  const [state, dispatch] = useReducer(gameReducer, getInitialState());

  // Using useState for timer interval management
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  // useEffect for timer management - demonstrates cleanup patterns
  useEffect(() => {
    if (state.gameStarted && !state.gameCompleted) {
      const interval = setInterval(() => {
        dispatch({ type: 'INCREMENT_TIMER' });
      }, 1000);
      setTimerInterval(interval);
    } else {
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }

    // Cleanup function - important for preventing memory leaks
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [state.gameStarted, state.gameCompleted]);

  // useEffect for checking matches when two cards are flipped
  useEffect(() => {
    if (state.flippedCards.length === 2) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CHECK_MATCH' });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [state.flippedCards]);

  // useEffect for saving best score to localStorage
  useEffect(() => {
    if (state.gameCompleted && state.bestScore < 999) {
      localStorage.setItem('memoryGameBestScore', state.bestScore.toString());
    }
  }, [state.gameCompleted, state.bestScore]);

  // Using useCallback for optimized event handlers
  // This prevents unnecessary re-renders of child components
  const handleCardClick = useCallback((cardId: number) => {
    dispatch({ type: 'FLIP_CARD', cardId });
  }, []);

  const handleDifficultyChange = useCallback((difficulty: 'easy' | 'medium' | 'hard') => {
    dispatch({ type: 'SET_DIFFICULTY', difficulty });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  return {
    // State
    state,
    
    // Actions
    handleCardClick,
    handleDifficultyChange,
    handleReset,
    
    // Computed values
    timerInterval
  };
};
