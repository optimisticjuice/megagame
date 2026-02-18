import React from 'react';
import { useGameNavigation } from '../hooks/useGameNavigation';
import { NavigationButtons } from './NavigationButtons';
import { MemoryGame } from './MemoryGame';
import { WhackAMoleGame } from './WhackAMoleGame';
import { BreakoutGame } from './BreakoutGame';
import type { GameConfig } from '../types/navigation.types';

// GameSlider component - demonstrates component composition and navigation patterns
// This is the main wrapper that manages game switching and navigation
export const GameSlider: React.FC = () => {
  // Define game configurations with progressive difficulty
  // This demonstrates how to structure game metadata for navigation
  const games: GameConfig[] = [
    {
      id: 0,
      name: 'Memory Match',
      component: <MemoryGame />,
      difficulty: 'Easy',
      description: 'Match pairs of cards to test your memory',
      features: ['Card matching', 'Timer', 'Score tracking', 'Multiple difficulties']
    },
    {
      id: 1,
      name: 'Whack-a-Mole',
      component: <WhackAMoleGame />,
      difficulty: 'Medium',
      description: 'Hit moles as quickly as possible for points',
      features: ['Timing challenges', 'Streak bonuses', 'Accuracy tracking', 'Progressive speed']
    },
    {
      id: 2,
      name: 'Advanced Breakout',
      component: <BreakoutGame />,
      difficulty: 'Hard',
      description: 'Destroy bricks with physics and power-ups',
      features: ['Real-time physics', 'Power-up system', 'Particle effects', 'Combo scoring']
    }
  ];

  // Using custom hook for navigation logic
  // This demonstrates custom hook usage with complex state management
  const {
    currentGameIndex,
    totalGames,
    canGoPrevious,
    canGoNext,
    isTransitioning,
    currentGame,
    progressPercentage,
    goToPrevious,
    goToNext
  } = useGameNavigation(games);

  // Calculate difficulty progression using array operations
  const completedGames = games.slice(0, currentGameIndex + 1);
  const difficultyProgression = completedGames.map(game => game.difficulty);
  
  // Using filter to get upcoming games
  const upcomingGames = games.slice(currentGameIndex + 1);
  
  // Using reduce to calculate total features across all games
  const totalFeatures = games.reduce((acc, game) => acc + game.features.length, 0);

  return (
    <div style={{ 
      position: 'relative',
      minHeight: '100vh',
      backgroundColor: '#000',
      paddingBottom: '100px' // Space for navigation buttons
    }}>
      {/* Game Progress Indicator */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px 20px',
        zIndex: 999,
        backdropFilter: 'blur(10px)',
        borderBottom: '2px solid #333'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#4CAF50' }}>
              🎮 Game Slider
            </h3>
            <span style={{ fontSize: '14px', opacity: 0.8 }}>
              Progress: {currentGameIndex + 1}/{totalGames}
            </span>
          </div>
          
          {/* Mini Progress Bar */}
          <div style={{
            width: '200px',
            height: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercentage}%`,
              height: '100%',
              backgroundColor: '#4CAF50',
              transition: 'width 0.5s ease',
              borderRadius: '3px'
            }} />
          </div>
          
          <div style={{ fontSize: '14px', opacity: 0.8 }}>
            {progressPercentage}% Complete
          </div>
        </div>
      </div>

      {/* Game Information Panel */}
      <div style={{
        position: 'fixed',
        top: '70px',
        right: '20px',
        width: '250px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        border: '1px solid #333',
        zIndex: 998,
        fontSize: '12px',
        backdropFilter: 'blur(10px)'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#4CAF50', fontSize: '14px' }}>
          Current Game Info
        </h4>
        <div style={{ marginBottom: '8px' }}>
          <strong>Name:</strong> {currentGame?.name}
        </div>
        <div style={{ marginBottom: '8px' }}>
          <strong>Difficulty:</strong> 
          <span style={{ 
            color: currentGame?.difficulty === 'Easy' ? '#4CAF50' : 
                   currentGame?.difficulty === 'Medium' ? '#FF9800' : '#f44336'
          }}>
            {currentGame?.difficulty}
          </span>
        </div>
        <div style={{ marginBottom: '8px' }}>
          <strong>Description:</strong> {currentGame?.description}
        </div>
        <div style={{ marginBottom: '8px' }}>
          <strong>Features:</strong>
          <ul style={{ margin: '5px 0 0 15px', padding: 0 }}>
            {currentGame?.features.map((feature, index) => (
              <li key={index} style={{ fontSize: '11px', marginBottom: '2px' }}>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Difficulty Progression Indicator */}
      <div style={{
        position: 'fixed',
        top: '70px',
        left: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        border: '1px solid #333',
        zIndex: 998,
        fontSize: '12px',
        backdropFilter: 'blur(10px)'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#4CAF50', fontSize: '14px' }}>
          Difficulty Path
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {games.map((game, index) => (
            <div 
              key={game.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px',
                borderRadius: '5px',
                backgroundColor: index <= currentGameIndex ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                border: index === currentGameIndex ? '1px solid #4CAF50' : '1px solid transparent'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: index < currentGameIndex ? '#4CAF50' : 
                               index === currentGameIndex ? '#FF9800' : '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                {index < currentGameIndex ? '✓' : index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '11px' }}>{game.name}</div>
                <div style={{ fontSize: '10px', opacity: 0.7 }}>{game.difficulty}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Container with Transition */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '70px',
        transition: 'opacity 0.3s ease',
        opacity: isTransitioning ? 0.5 : 1
      }}>
        {/* Current Game Component */}
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          transition: 'transform 0.3s ease',
          transform: isTransitioning ? 'scale(0.95)' : 'scale(1)'
        }}>
          {currentGame?.component}
        </div>
      </div>

      {/* Navigation Buttons */}
      <NavigationButtons
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        onPrevious={goToPrevious}
        onNext={goToNext}
        currentGameIndex={currentGameIndex}
        totalGames={totalGames}
        currentGameName={currentGame?.name || ''}
        isTransitioning={isTransitioning}
        progressPercentage={progressPercentage}
      />

      {/* Game Completion Summary (when all games are completed) */}
      {currentGameIndex === totalGames - 1 && (
        <div style={{
          position: 'fixed',
          bottom: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(76, 175, 80, 0.9)',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '10px',
          border: '2px solid #4CAF50',
          zIndex: 997,
          textAlign: 'center',
          backdropFilter: 'blur(10px)'
        }}>
          <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
            🎉 All Games Completed! 🎉
          </h4>
          <p style={{ margin: 0, fontSize: '12px' }}>
            You've mastered all {totalGames} games with {totalFeatures} total features!
          </p>
        </div>
      )}

      {/* Instructions Overlay */}
      {currentGameIndex === 0 && (
        <div style={{
          position: 'fixed',
          bottom: '120px',
          right: '20px',
          backgroundColor: 'rgba(33, 150, 243, 0.9)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '8px',
          border: '1px solid #2196F3',
          zIndex: 997,
          fontSize: '11px',
          maxWidth: '200px',
          backdropFilter: 'blur(10px)'
        }}>
          <strong>💡 Navigation Tip:</strong><br />
          Use the Previous/Next buttons at the bottom to switch between games. Difficulty increases with each game!
        </div>
      )}
    </div>
  );
};
