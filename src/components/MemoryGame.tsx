import React from 'react';
import { useMemoryGame } from '../hooks/useMemoryGame';
import { GameBoard } from './GameBoard';
import { GameStats } from './GameStats';
import { GameControls } from './GameControls';
import { GameInstructions } from './GameInstructions';

// Main Memory Game component - demonstrates component composition and custom hooks
// This is the refactored version that uses modular components
export const MemoryGame: React.FC = () => {
  // Using custom hook that encapsulates all game logic
  // This demonstrates how to separate concerns and create reusable logic
  const {
    state,
    handleCardClick,
    handleDifficultyChange,
    handleReset
  } = useMemoryGame();

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          color: '#333', 
          fontSize: '2.5em',
          marginBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          🧠 Memory Card Match Game 🧠
        </h1>
        <p style={{ color: '#666', fontSize: '1.1em' }}>
          Test your memory by finding matching emoji pairs!
        </p>
      </header>

      <main>
        {/* Game Statistics - demonstrates props drilling and component composition */}
        <GameStats
          moves={state.moves}
          timer={state.timer}
          matches={state.matches}
          bestScore={state.bestScore}
          cards={state.cards}
          difficulty={state.difficulty}
        />

        {/* Game Controls - demonstrates event handling and state management */}
        <GameControls
          difficulty={state.difficulty}
          onDifficultyChange={handleDifficultyChange}
          onReset={handleReset}
          gameCompleted={state.gameCompleted}
          moves={state.moves}
          timer={state.timer}
          bestScore={state.bestScore}
        />

        {/* Game Board - demonstrates list rendering and interaction */}
        <GameBoard
          cards={state.cards}
          onCardClick={handleCardClick}
          difficulty={state.difficulty}
        />

        {/* Game Instructions - demonstrates static content component */}
        <GameInstructions />
      </main>

      <footer style={{ 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: '#333', 
        color: 'white',
        borderRadius: '8px'
      }}>
        <p style={{ margin: 0, fontSize: '14px' }}>
          Built with React, TypeScript, and modern hooks patterns
        </p>
        <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#ccc' }}>
          Demonstrates useState, useReducer, useEffect, useCallback, and array operations
        </p>
      </footer>
    </div>
  );
};
