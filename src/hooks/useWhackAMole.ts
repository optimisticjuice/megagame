import { useReducer, useEffect, useCallback, useState } from 'react';
import type { WhackAMoleState, WhackAMoleAction, Mole } from '../types/whackamole.types';
import { DIFFICULTY_CONFIGS } from '../types/whackamole.types';

// Reducer function for Whack-a-Mole game state management
// This demonstrates complex useReducer pattern with multiple action types
function whackAMoleReducer(state: WhackAMoleState, action: WhackAMoleAction): WhackAMoleState {
  switch (action.type) {
    case 'START_GAME': {
      // Initialize game state with difficulty-specific settings
      const config = DIFFICULTY_CONFIGS[state.difficulty];
      
      // Using flatMap to create initial moles array
      const initialMoles: Mole[] = Array.from({ length: config.moleCount }, (_, index) => ({
        id: index,
        isActive: false,
        isVisible: false,
        appearanceTime: 0,
        duration: config.baseDuration,
        points: 10,
        isHit: false
      }));

      return {
        ...state,
        gameActive: true,
        gameStarted: true,
        gameCompleted: false,
        score: 0,
        timeLeft: config.timeLimit,
        moles: initialMoles,
        hits: 0,
        misses: 0,
        streak: 0,
        maxStreak: 0,
        lastMoleTime: Date.now(),
        moleInterval: config.baseInterval
      };
    }

    case 'STOP_GAME': {
      return {
        ...state,
        gameActive: false,
        gameCompleted: true
      };
    }

    case 'RESET_GAME': {
      const config = DIFFICULTY_CONFIGS[state.difficulty];
      return {
        ...state,
        score: 0,
        timeLeft: config.timeLimit,
        gameActive: false,
        gameStarted: false,
        gameCompleted: false,
        moles: state.moles.map(mole => ({
          ...mole,
          isActive: false,
          isVisible: false,
          isHit: false
        })),
        hits: 0,
        misses: 0,
        streak: 0,
        maxStreak: 0
      };
    }

    case 'SET_DIFFICULTY': {
      const config = DIFFICULTY_CONFIGS[action.difficulty];
      return {
        ...state,
        difficulty: action.difficulty,
        timeLeft: config.timeLimit,
        moleInterval: config.baseInterval,
        gameActive: false,
        gameStarted: false,
        gameCompleted: false
      };
    }

    case 'SPAWN_MOLE': {
      // Using map to update specific mole in immutable way
      const newMoles = state.moles.map(mole => 
        mole.id === action.moleId 
          ? { 
              ...mole, 
              isActive: true, 
              isVisible: true, 
              appearanceTime: Date.now(),
              duration: action.duration,
              isHit: false
            }
          : mole
      );

      return {
        ...state,
        moles: newMoles,
        lastMoleTime: Date.now()
      };
    }

    case 'HIT_MOLE': {
      const hitMole = state.moles.find(m => m.id === action.moleId);
      if (!hitMole || !hitMole.isVisible || hitMole.isHit) return state;

      // Calculate score with streak bonus using functional updater
      const baseScore = hitMole.points;
      const streakBonus = state.streak > 2 ? state.streak * 5 : 0;
      const totalScore = baseScore + streakBonus;
      
      // Using map to update hit mole
      const newMoles = state.moles.map(mole => 
        mole.id === action.moleId 
          ? { ...mole, isHit: true, isVisible: false }
          : mole
      );

      return {
        ...state,
        moles: newMoles,
        score: state.score + totalScore,
        hits: state.hits + 1,
        streak: state.streak + 1,
        maxStreak: Math.max(state.maxStreak, state.streak + 1)
      };
    }

    case 'MISS_MOLE': {
      return {
        ...state,
        misses: state.misses + 1,
        streak: 0
      };
    }

    case 'DESPAWN_MOLE': {
      // Using filter to remove expired moles
      const newMoles = state.moles.map(mole => 
        mole.id === action.moleId 
          ? { ...mole, isActive: false, isVisible: false }
          : mole
      );

      return {
        ...state,
        moles: newMoles
      };
    }

    case 'UPDATE_TIMER': {
      const newTimeLeft = state.timeLeft - 1;
      
      // Check if game should end
      if (newTimeLeft <= 0) {
        return {
          ...state,
          timeLeft: 0,
          gameActive: false,
          gameCompleted: true,
          highScore: Math.max(state.highScore, state.score)
        };
      }

      return {
        ...state,
        timeLeft: newTimeLeft
      };
    }

    case 'INCREMENT_STREAK': {
      return {
        ...state,
        streak: state.streak + 1,
        maxStreak: Math.max(state.maxStreak, state.streak + 1)
      };
    }

    case 'RESET_STREAK': {
      return {
        ...state,
        streak: 0
      };
    }

    case 'SET_LEVEL': {
      return {
        ...state,
        level: action.level
      };
    }

    default:
      return state;
  }
}

// Custom hook for Whack-a-Mole game logic
// This demonstrates complex game logic with multiple React patterns
export const useWhackAMole = (difficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy') => {
  // Initial state
  const initialState: WhackAMoleState = {
    score: 0,
    timeLeft: DIFFICULTY_CONFIGS[difficulty].timeLimit,
    gameActive: false,
    gameStarted: false,
    gameCompleted: false,
    moles: [],
    difficulty,
    level: 1,
    highScore: parseInt(localStorage.getItem('whackamoleHighScore') || '0'),
    hits: 0,
    misses: 0,
    streak: 0,
    maxStreak: 0,
    lastMoleTime: 0,
    moleInterval: DIFFICULTY_CONFIGS[difficulty].baseInterval
  };

  // Using useReducer for complex state management
  const [state, dispatch] = useReducer(whackAMoleReducer, initialState);

  // Using useState for timer management
  const [gameTimer, setGameTimer] = useState<number | null>(null);
  const [moleTimer, setMoleTimer] = useState<number | null>(null);

  // useEffect for game timer - demonstrates cleanup patterns
  useEffect(() => {
    if (state.gameActive && !state.gameCompleted) {
      const timer = setInterval(() => {
        dispatch({ type: 'UPDATE_TIMER' });
      }, 1000);
      setGameTimer(timer);
    } else {
      if (gameTimer) {
        clearInterval(gameTimer);
        setGameTimer(null);
      }
    }

    // Cleanup function
    return () => {
      if (gameTimer) {
        clearInterval(gameTimer);
      }
    };
  }, [state.gameActive, state.gameCompleted]);

  // useEffect for mole spawning logic
  useEffect(() => {
    if (state.gameActive && !state.gameCompleted) {
      const spawnMole = () => {
        // Using filter to find inactive moles
        const inactiveMoles = state.moles.filter(mole => !mole.isActive);
        
        if (inactiveMoles.length > 0) {
          // Using Math.random and array access for random selection
          const randomMole = inactiveMoles[Math.floor(Math.random() * inactiveMoles.length)];
          const config = DIFFICULTY_CONFIGS[state.difficulty];
          const duration = config.baseDuration * (0.8 + Math.random() * 0.4); // Random variation
          
          dispatch({ type: 'SPAWN_MOLE', moleId: randomMole.id, duration });

          // Auto-despawn after duration
          setTimeout(() => {
            dispatch({ type: 'DESPAWN_MOLE', moleId: randomMole.id });
          }, duration);
        }
      };

      const timer = setInterval(spawnMole, state.moleInterval);
      setMoleTimer(timer);

      return () => clearInterval(timer);
    } else {
      if (moleTimer) {
        clearInterval(moleTimer);
        setMoleTimer(null);
      }
    }
  }, [state.gameActive, state.gameCompleted, state.moleInterval, state.moles]);

  // useEffect for high score persistence
  useEffect(() => {
    if (state.gameCompleted && state.score > 0) {
      localStorage.setItem('whackamoleHighScore', state.highScore.toString());
    }
  }, [state.gameCompleted, state.highScore, state.score]);

  // useCallback for optimized event handlers
  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const stopGame = useCallback(() => {
    dispatch({ type: 'STOP_GAME' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const setDifficulty = useCallback((difficulty: 'Easy' | 'Medium' | 'Hard') => {
    dispatch({ type: 'SET_DIFFICULTY', difficulty });
  }, []);

  const hitMole = useCallback((moleId: number) => {
    if (state.gameActive && !state.gameCompleted) {
      const mole = state.moles.find(m => m.id === moleId);
      if (mole && mole.isVisible && !mole.isHit) {
        dispatch({ type: 'HIT_MOLE', moleId });
      } else {
        dispatch({ type: 'MISS_MOLE', moleId });
      }
    }
  }, [state.gameActive, state.gameCompleted, state.moles]);

  // Calculate accuracy using reduce
  const accuracy = state.hits + state.misses > 0 
    ? Math.round((state.hits / (state.hits + state.misses)) * 100)
    : 0;

  // Calculate performance metrics using filter and map
  const activeMoles = state.moles.filter(mole => mole.isVisible);
  const performanceRating = accuracy >= 80 ? 'Excellent' : accuracy >= 60 ? 'Good' : 'Needs Practice';

  return {
    // State
    state,
    activeMoles,
    accuracy,
    performanceRating,
    
    // Actions
    startGame,
    stopGame,
    resetGame,
    setDifficulty,
    hitMole
  };
};
