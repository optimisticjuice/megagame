import { useState, useCallback, useReducer, useEffect } from 'react';
import type { NavigationState, NavigationAction, GameConfig } from '../types/navigation.types';

// Reducer function for navigation state management
// This demonstrates useReducer for complex navigation logic
function navigationReducer(state: NavigationState, action: NavigationAction): NavigationState {
  switch (action.type) {
    case 'GO_TO_PREVIOUS': {
      // Using functional updater pattern to ensure state consistency
      const newIndex = Math.max(0, state.currentGameIndex - 1);
      return {
        ...state,
        currentGameIndex: newIndex,
        canGoPrevious: newIndex > 0,
        canGoNext: newIndex < state.totalGames - 1
      };
    }

    case 'GO_TO_NEXT': {
      // Demonstrates boundary checking with functional updates
      const newIndex = Math.min(state.totalGames - 1, state.currentGameIndex + 1);
      return {
        ...state,
        currentGameIndex: newIndex,
        canGoPrevious: newIndex > 0,
        canGoNext: newIndex < state.totalGames - 1
      };
    }

    case 'GO_TO_GAME': {
      // Direct navigation with validation
      const validIndex = Math.max(0, Math.min(action.index, state.totalGames - 1));
      return {
        ...state,
        currentGameIndex: validIndex,
        canGoPrevious: validIndex > 0,
        canGoNext: validIndex < state.totalGames - 1
      };
    }

    case 'SET_TOTAL_GAMES': {
      // Updates total games and recalculates navigation state
      const newTotal = action.total;
      const currentIndex = Math.min(state.currentGameIndex, newTotal - 1);
      return {
        ...state,
        totalGames: newTotal,
        currentGameIndex: currentIndex,
        canGoPrevious: currentIndex > 0,
        canGoNext: currentIndex < newTotal - 1
      };
    }

    default:
      return state;
  }
}

// Custom hook for game navigation
// This demonstrates custom hook creation with multiple React patterns
export const useGameNavigation = (games: GameConfig[]) => {
  // Using useReducer for complex navigation state management
  const initialState: NavigationState = {
    currentGameIndex: 0,
    totalGames: games.length,
    canGoPrevious: false,
    canGoNext: games.length > 1
  };

  const [state, dispatch] = useReducer(navigationReducer, initialState);

  // Using useState for additional navigation state
  const [isTransitioning, setIsTransitioning] = useState(false);

  // useEffect to update total games when games array changes
  // This demonstrates useEffect dependency management
  useEffect(() => {
    dispatch({ type: 'SET_TOTAL_GAMES', total: games.length });
  }, [games.length]);

  // useCallback for optimized navigation functions
  // This prevents unnecessary re-renders of child components
  const goToPrevious = useCallback(() => {
    if (state.canGoPrevious && !isTransitioning) {
      setIsTransitioning(true);
      dispatch({ type: 'GO_TO_PREVIOUS' });
      
      // Reset transition state after animation
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [state.canGoPrevious, isTransitioning]);

  const goToNext = useCallback(() => {
    if (state.canGoNext && !isTransitioning) {
      setIsTransitioning(true);
      dispatch({ type: 'GO_TO_NEXT' });
      
      // Reset transition state after animation
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [state.canGoNext, isTransitioning]);

  const goToGame = useCallback((index: number) => {
    if (index >= 0 && index < games.length && !isTransitioning) {
      setIsTransitioning(true);
      dispatch({ type: 'GO_TO_GAME', index });
      
      // Reset transition state after animation
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [games.length, isTransitioning]);

  // Get current game using array access
  const currentGame = games[state.currentGameIndex];
  
  // Calculate progress percentage using reduce
  const progressPercentage = Math.round(((state.currentGameIndex + 1) / state.totalGames) * 100);

  // Using filter to get completed games (for future progress tracking)
  const completedGames = games.slice(0, state.currentGameIndex + 1);

  return {
    // State
    currentGameIndex: state.currentGameIndex,
    totalGames: state.totalGames,
    canGoPrevious: state.canGoPrevious,
    canGoNext: state.canGoNext,
    isTransitioning,
    currentGame,
    progressPercentage,
    completedGames,
    
    // Actions
    goToPrevious,
    goToNext,
    goToGame
  };
};
