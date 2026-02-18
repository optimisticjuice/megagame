import React from 'react';

interface GameControlsProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onReset: () => void;
  gameCompleted: boolean;
  moves: number;
  timer: number;
  bestScore: number;
}

// Game controls component - demonstrates event handling and conditional rendering
export const GameControls: React.FC<GameControlsProps> = ({ 
  difficulty, 
  onDifficultyChange, 
  onReset, 
  gameCompleted, 
  moves, 
  timer, 
  bestScore 
}) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Difficulty Selector */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>
          Difficulty:
        </label>
        <select 
          value={difficulty} 
          onChange={(e) => onDifficultyChange(e.target.value as 'easy' | 'medium' | 'hard')}
          style={{ 
            marginLeft: '10px', 
            padding: '8px 12px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        >
          <option value="easy">Easy (4 pairs)</option>
          <option value="medium">Medium (6 pairs)</option>
          <option value="hard">Hard (8 pairs)</option>
        </select>
      </div>

      {/* Game Control Buttons */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '15px' }}>
        <button 
          onClick={onReset}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
        >
          New Game
        </button>
      </div>

      {/* Game Completion Message */}
      {gameCompleted && (
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          backgroundColor: '#4CAF50', 
          color: 'white',
          borderRadius: '8px',
          fontSize: '18px',
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-in'
        }}>
          <h2>🎉 Congratulations! 🎉</h2>
          <p>You completed the game in {moves} moves and {timer} seconds!</p>
          {bestScore === moves && (
            <p style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              marginTop: '10px',
              color: '#FFD700'
            }}>
              🏆 New Best Score! 🏆
            </p>
          )}
        </div>
      )}
    </div>
  );
};
