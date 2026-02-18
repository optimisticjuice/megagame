import React from 'react';
import { useWhackAMole } from '../hooks/useWhackAMole';
import { DIFFICULTY_CONFIGS } from '../types/whackamole.types';

// WhackAMoleGame component - demonstrates complex game logic with React patterns
// This is a medium-complexity game that builds on the Memory Game patterns
export const WhackAMoleGame: React.FC = () => {
  const {
    state,
    activeMoles,
    accuracy,
    performanceRating,
    startGame,
    stopGame,
    resetGame,
    setDifficulty,
    hitMole
  } = useWhackAMole();

  // Calculate grid layout based on difficulty
  const getGridColumns = () => {
    const config = DIFFICULTY_CONFIGS[state.difficulty];
    const cols = Math.ceil(Math.sqrt(config.moleCount));
    return `repeat(${cols}, 1fr)`;
  };

  // Using map to render mole grid - demonstrates array transformation
  const renderMoles = () => {
    return state.moles.map((mole) => (
      <div
        key={mole.id}
        className={`mole ${mole.isVisible ? 'visible' : ''} ${mole.isHit ? 'hit' : ''}`}
        onClick={() => hitMole(mole.id)}
        style={{
          width: '80px',
          height: '80px',
          margin: '5px',
          border: '3px solid #8B4513',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          cursor: state.gameActive && mole.isVisible && !mole.isHit ? 'pointer' : 'default',
          backgroundColor: mole.isVisible ? (mole.isHit ? '#4CAF50' : '#D2691E') : '#654321',
          transition: 'all 0.2s ease',
          transform: mole.isVisible ? 'scale(1.1)' : 'scale(1)',
          boxShadow: mole.isVisible ? '0 4px 8px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {mole.isVisible ? (mole.isHit ? '💥' : '🐹') : '🕳️'}
        
        {/* Points indicator when mole is hit */}
        {mole.isHit && (
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-10px',
            backgroundColor: '#FFD700',
            color: '#333',
            padding: '2px 6px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 'bold',
            animation: 'floatUp 1s ease-out'
          }}>
            +{mole.points}
          </div>
        )}
      </div>
    ));
  };

  // Using filter to count active moles for statistics
  const visibleMoles = state.moles.filter(mole => mole.isVisible);
  const hitMoles = state.moles.filter(mole => mole.isHit);

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#87CEEB',
      position: 'relative'
    }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          color: '#333', 
          fontSize: '2.5em',
          marginBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          🐹 Whack-a-Mole Challenge 🐹
        </h1>
        <p style={{ color: '#555', fontSize: '1.1em' }}>
          Hit the moles as quickly as you can! Build streaks for bonus points!
        </p>
      </header>

      {/* Game Statistics Dashboard */}
      <div style={{ 
        marginBottom: '25px', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '20px',
        flexWrap: 'wrap',
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '12px',
        border: '2px solid #8B4513'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.9em', color: '#666', fontWeight: 'bold' }}>Score</div>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#4CAF50' }}>{state.score}</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.9em', color: '#666', fontWeight: 'bold' }}>Time</div>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: state.timeLeft <= 10 ? '#f44336' : '#333' }}>
            {state.timeLeft}s
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.9em', color: '#666', fontWeight: 'bold' }}>Hits</div>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#2196F3' }}>{state.hits}</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.9em', color: '#666', fontWeight: 'bold' }}>Streak</div>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: state.streak > 2 ? '#FF9800' : '#333' }}>
            {state.streak}🔥
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.9em', color: '#666', fontWeight: 'bold' }}>Accuracy</div>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: accuracy >= 80 ? '#4CAF50' : accuracy >= 60 ? '#FF9800' : '#f44336' }}>
            {accuracy}%
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.9em', color: '#666', fontWeight: 'bold' }}>Best Score</div>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#9C27B0' }}>{state.highScore}</div>
        </div>
      </div>

      {/* Game Controls */}
      <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
        {!state.gameStarted ? (
          <button
            onClick={startGame}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
          >
            🎮 Start Game
          </button>
        ) : (
          <button
            onClick={stopGame}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
          >
            ⏹️ Stop Game
          </button>
        )}
        
        <button
          onClick={resetGame}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: 'bold'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
        >
          🔄 Reset
        </button>
      </div>

      {/* Difficulty Selector */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px', fontSize: '16px' }}>
          Difficulty:
        </label>
        <select 
          value={state.difficulty} 
          onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
          style={{ 
            padding: '8px 12px',
            borderRadius: '5px',
            border: '2px solid #8B4513',
            fontSize: '14px',
            backgroundColor: 'white'
          }}
          disabled={state.gameActive}
        >
          <option value="Easy">Easy (9 moles, 60s)</option>
          <option value="Medium">Medium (12 moles, 45s)</option>
          <option value="Hard">Hard (16 moles, 30s)</option>
        </select>
      </div>

      {/* Game Board */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px'
      }}>
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: getGridColumns(),
            gap: '10px',
            padding: '30px',
            backgroundColor: 'rgba(139, 69, 19, 0.1)',
            borderRadius: '15px',
            border: '3px solid #8B4513',
            maxWidth: '500px'
          }}
        >
          {renderMoles()}
        </div>
      </div>

      {/* Game Completion Message */}
      {state.gameCompleted && (
        <div style={{ 
          marginTop: '20px', 
          padding: '25px', 
          backgroundColor: '#4CAF50', 
          color: 'white',
          borderRadius: '12px',
          fontSize: '20px',
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-in',
          border: '3px solid #45a049'
        }}>
          <h2>🎉 Game Over! 🎉</h2>
          <p>Final Score: <strong>{state.score}</strong></p>
          <p>Accuracy: <strong>{accuracy}%</strong> ({performanceRating})</p>
          <p>Best Streak: <strong>{state.maxStreak}</strong> 🔥</p>
          {state.score === state.highScore && state.score > 0 && (
            <p style={{ 
              fontSize: '22px', 
              fontWeight: 'bold', 
              marginTop: '15px',
              color: '#FFD700'
            }}>
              🏆 New High Score! 🏆
            </p>
          )}
        </div>
      )}

      {/* Game Instructions */}
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        borderRadius: '12px',
        textAlign: 'left',
        maxWidth: '600px',
        margin: '30px auto 0',
        border: '2px solid #8B4513'
      }}>
        <h3 style={{ 
          color: '#333', 
          marginBottom: '15px',
          borderBottom: '2px solid #8B4513',
          paddingBottom: '8px'
        }}>
          How to Play:
        </h3>
        <ul style={{ lineHeight: '1.6', color: '#555', paddingLeft: '20px' }}>
          <li style={{ marginBottom: '8px' }}>
            <strong>Click on moles</strong> when they appear from their holes
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Build streaks</strong> by hitting consecutive moles for bonus points
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Act quickly</strong> - moles disappear after a short time
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Higher difficulty</strong> means more moles and less time
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Accuracy matters</strong> - track your hit rate and improve
          </li>
        </ul>
        
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: '#FFF3E0', 
          borderRadius: '8px',
          fontSize: '14px',
          color: '#E65100',
          border: '1px solid #FFB74D'
        }}>
          <strong>💡 Pro Tip:</strong> Focus on accuracy over speed - streak bonuses reward consistent hitting!
        </div>
      </div>
    </div>
  );
};
