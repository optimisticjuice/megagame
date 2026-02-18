import React from 'react';

// NavigationButtons component - demonstrates event handling and conditional rendering
// This component provides Previous/Next navigation with visual feedback
interface NavigationButtonsProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  currentGameIndex: number;
  totalGames: number;
  currentGameName: string;
  isTransitioning: boolean;
  progressPercentage: number;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  currentGameIndex,
  totalGames,
  currentGameName,
  isTransitioning,
  progressPercentage
}) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(10px)'
    }}>
      {/* Previous Button - Bottom Left */}
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious || isTransitioning}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: canGoPrevious && !isTransitioning ? '#f44336' : '#666',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: canGoPrevious && !isTransitioning ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease',
          opacity: canGoPrevious ? 1 : 0.5,
          transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseOver={(e) => {
          if (canGoPrevious && !isTransitioning) {
            e.currentTarget.style.backgroundColor = '#d32f2f';
            e.currentTarget.style.transform = 'scale(1.05)';
          }
        }}
        onMouseOut={(e) => {
          if (canGoPrevious && !isTransitioning) {
            e.currentTarget.style.backgroundColor = '#f44336';
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
      >
        <span style={{ fontSize: '20px' }}>←</span>
        Previous
      </button>

      {/* Center Information - Game Progress */}
      <div style={{
        textAlign: 'center',
        flex: 1,
        margin: '0 20px'
      }}>
        <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '5px' }}>
          Game {currentGameIndex + 1} of {totalGames}
        </div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
          {currentGameName}
        </div>
        
        {/* Progress Bar - demonstrates visual progress indication */}
        <div style={{
          width: '200px',
          height: '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '3px',
          margin: '0 auto',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercentage}%`,
            height: '100%',
            backgroundColor: '#4CAF50',
            transition: 'width 0.3s ease',
            borderRadius: '3px'
          }} />
        </div>
        
        <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>
          {progressPercentage}% Complete
        </div>
      </div>

      {/* Next Button - Bottom Right */}
      <button
        onClick={onNext}
        disabled={!canGoNext || isTransitioning}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: canGoNext && !isTransitioning ? '#4CAF50' : '#666',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: canGoNext && !isTransitioning ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease',
          opacity: canGoNext ? 1 : 0.5,
          transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseOver={(e) => {
          if (canGoNext && !isTransitioning) {
            e.currentTarget.style.backgroundColor = '#45a049';
            e.currentTarget.style.transform = 'scale(1.05)';
          }
        }}
        onMouseOut={(e) => {
          if (canGoNext && !isTransitioning) {
            e.currentTarget.style.backgroundColor = '#4CAF50';
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
      >
        Next
        <span style={{ fontSize: '20px' }}>→</span>
      </button>

      {/* Transition Indicator */}
      {isTransitioning && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '12px',
          opacity: 0.8,
          animation: 'pulse 1s infinite'
        }}>
          Loading next game...
        </div>
      )}
    </div>
  );
};
