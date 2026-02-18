import React, { useEffect, useRef } from 'react';
import { useBreakout } from '../hooks/useBreakout';
import { POWER_UP_CONFIGS } from '../types/breakout.types';

// BreakoutGame component - demonstrates advanced physics and collision detection
// This is the most complex game with real-time physics and particle effects
export const BreakoutGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    state,
    accuracy,
    handleMouseMove,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    launchBall,
    nextLevel
  } = useBreakout();

  // Canvas rendering effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 800, 600);

    // Draw bricks using map
    state.bricks.forEach(brick => {
      if (!brick.isDestroyed) {
        // Calculate opacity based on health
        const opacity = brick.health / brick.maxHealth;
        ctx.globalAlpha = opacity;
        
        // Draw brick
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        
        // Draw brick border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        
        // Draw health indicator for multi-hit bricks
        if (brick.health > 1) {
          ctx.fillStyle = '#fff';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(brick.health.toString(), brick.x + brick.width / 2, brick.y + brick.height / 2 + 4);
        }
        
        ctx.globalAlpha = 1;
      }
    });

    // Draw paddle
    ctx.fillStyle = state.paddle.color;
    ctx.fillRect(state.paddle.x, state.paddle.y, state.paddle.width, state.paddle.height);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(state.paddle.x, state.paddle.y, state.paddle.width, state.paddle.height);

    // Draw balls with trails
    state.balls.forEach(ball => {
      // Draw trail
      ball.trail.forEach((point, index) => {
        ctx.globalAlpha = index / ball.trail.length * 0.5;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(point.x, point.y, ball.radius * (index / ball.trail.length), 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw ball
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw power-ups
    state.powerUps.forEach(powerUp => {
      const config = POWER_UP_CONFIGS[powerUp.type];
      ctx.fillStyle = config.color;
      ctx.fillRect(powerUp.x - powerUp.width / 2, powerUp.y - powerUp.height / 2, powerUp.width, powerUp.height);
      ctx.fillStyle = '#fff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(config.icon, powerUp.x, powerUp.y + 5);
    });

    // Draw particles
    state.particles.forEach(particle => {
      ctx.globalAlpha = particle.life;
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
    });
    
    ctx.globalAlpha = 1;

    // Draw game state overlays
    if (!state.gameStarted) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, 800, 600);
      ctx.fillStyle = '#fff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('BREAKOUT', 400, 250);
      ctx.font = '24px Arial';
      ctx.fillText('Click Start Game to begin', 400, 320);
    } else if (state.gamePaused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, 800, 600);
      ctx.fillStyle = '#fff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', 400, 300);
    } else if (state.gameCompleted) {
      ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
      ctx.fillRect(0, 0, 800, 600);
      ctx.fillStyle = '#fff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('LEVEL COMPLETE!', 400, 250);
      ctx.font = '24px Arial';
      ctx.fillText(`Score: ${state.score}`, 400, 320);
    } else if (state.gameOver) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.fillRect(0, 0, 800, 600);
      ctx.fillStyle = '#fff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', 400, 250);
      ctx.font = '24px Arial';
      ctx.fillText(`Final Score: ${state.score}`, 400, 320);
    }

    // Draw active power-ups indicator
    if (state.activePowerUps.length > 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(10, 10, 200, state.activePowerUps.length * 30);
      state.activePowerUps.forEach((powerUp, index) => {
        const config = POWER_UP_CONFIGS[powerUp.type];
        ctx.fillStyle = config.color;
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${config.icon} ${config.description}`, 20, 30 + index * 25);
      });
    }

  }, [state]);

  // Mouse movement handler
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      handleMouseMove(x);
    }
  };

  // Calculate statistics using reduce
  const totalBricks = state.bricks.length;
  const destroyedBricks = state.bricks.filter(brick => brick.isDestroyed).length;
  const remainingBricks = totalBricks - destroyedBricks;

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#0f0f23',
      color: 'white'
    }}>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ 
          color: '#fff', 
          fontSize: '2.5em',
          marginBottom: '10px',
          textShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
        }}>
          🧱 Advanced Breakout 🧱
        </h1>
        <p style={{ color: '#ccc', fontSize: '1.1em' }}>
          Destroy all bricks with advanced physics and power-ups!
        </p>
      </header>

      {/* Game Statistics */}
      <div style={{ 
        marginBottom: '20px', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '20px',
        flexWrap: 'wrap',
        padding: '15px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div>
          <div style={{ fontSize: '0.9em', color: '#aaa', fontWeight: 'bold' }}>Score</div>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#4CAF50' }}>{state.score}</div>
        </div>
        
        <div>
          <div style={{ fontSize: '0.9em', color: '#aaa', fontWeight: 'bold' }}>Lives</div>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: state.lives <= 1 ? '#f44336' : '#2196F3' }}>
            {state.lives} ❤️
          </div>
        </div>
        
        <div>
          <div style={{ fontSize: '0.9em', color: '#aaa', fontWeight: 'bold' }}>Level</div>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#FF9800' }}>{state.level}</div>
        </div>
        
        <div>
          <div style={{ fontSize: '0.9em', color: '#aaa', fontWeight: 'bold' }}>Combo</div>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: state.combo > 5 ? '#FFD700' : '#fff' }}>
            {state.combo}x 🔥
          </div>
        </div>
        
        <div>
          <div style={{ fontSize: '0.9em', color: '#aaa', fontWeight: 'bold' }}>Bricks</div>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#9C27B0' }}>
            {remainingBricks}/{totalBricks}
          </div>
        </div>
        
        <div>
          <div style={{ fontSize: '0.9em', color: '#aaa', fontWeight: 'bold' }}>Power-ups</div>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#00BCD4' }}>
            {state.powerUpsCollected}
          </div>
        </div>
        
        <div>
          <div style={{ fontSize: '0.9em', color: '#aaa', fontWeight: 'bold' }}>High Score</div>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#E91E63' }}>{state.highScore}</div>
        </div>
      </div>

      {/* Game Controls */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {!state.gameStarted ? (
          <button
            onClick={startGame}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
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
          <>
            {state.gamePaused ? (
              <button
                onClick={resumeGame}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: 'bold'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
              >
                ▶️ Resume
              </button>
            ) : (
              <button
                onClick={pauseGame}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  backgroundColor: '#FF9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: 'bold'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F57C00'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF9800'}
              >
                ⏸️ Pause
              </button>
            )}
            
            <button
              onClick={launchBall}
              disabled={state.balls.some(ball => ball.vy !== 0)}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: state.balls.some(ball => ball.vy !== 0) ? '#666' : '#9C27B0',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: state.balls.some(ball => ball.vy !== 0) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: 'bold',
                opacity: state.balls.some(ball => ball.vy !== 0) ? 0.5 : 1
              }}
              onMouseOver={(e) => {
                if (!state.balls.some(ball => ball.vy !== 0)) {
                  e.currentTarget.style.backgroundColor = '#7B1FA2';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = state.balls.some(ball => ball.vy !== 0) ? '#666' : '#9C27B0';
              }}
            >
              🚀 Launch Ball
            </button>
          </>
        )}
        
        <button
          onClick={resetGame}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: 'bold'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
        >
          🔄 Reset
        </button>
        
        {state.gameCompleted && (
          <button
            onClick={nextLevel}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
          >
            ➡️ Next Level
          </button>
        )}
      </div>

      {/* Game Canvas */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '20px',
        position: 'relative'
      }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseMove={handleCanvasMouseMove}
          onClick={launchBall}
          style={{
            border: '3px solid #333',
            borderRadius: '10px',
            backgroundColor: '#1a1a2e',
            cursor: 'crosshair',
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)'
          }}
        />
      </div>

      {/* Game Instructions */}
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '10px',
        textAlign: 'left',
        maxWidth: '800px',
        margin: '20px auto 0',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h3 style={{ 
          color: '#fff', 
          marginBottom: '15px',
          borderBottom: '2px solid #4CAF50',
          paddingBottom: '8px'
        }}>
          How to Play:
        </h3>
        <ul style={{ lineHeight: '1.6', color: '#ccc', paddingLeft: '20px' }}>
          <li style={{ marginBottom: '8px' }}>
            <strong>Move mouse</strong> to control the paddle
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Click or press Launch</strong> to release the ball
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Destroy all bricks</strong> to complete the level
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Collect power-ups</strong> for special abilities
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Build combos</strong> by hitting multiple bricks quickly
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Watch your lives</strong> - lose them all and it's game over
          </li>
        </ul>
        
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: 'rgba(76, 175, 80, 0.2)', 
          borderRadius: '8px',
          fontSize: '14px',
          color: '#4CAF50',
          border: '1px solid #4CAF50'
        }}>
          <strong>💡 Power-ups:</strong> ⚡ Multi-ball | ↔️ Wide Paddle | 🔫 Laser | 🐌 Slow Ball | ❤️ Extra Life
        </div>
      </div>
    </div>
  );
};
