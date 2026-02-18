import React from 'react';
import { EMOJI_SETS } from '../types/game.types';
import type { Card as CardType } from '../types/game.types';
import { calculateCompletionPercentage } from '../utils/gameLogic';

interface GameStatsProps {
  moves: number;
  timer: number;
  matches: number;
  bestScore: number;
  cards: CardType[];
  difficulty: 'easy' | 'medium' | 'hard';
}

// Game statistics component - demonstrates computed properties and array operations
export const GameStats: React.FC<GameStatsProps> = ({ 
  moves, 
  timer, 
  matches, 
  bestScore, 
  cards, 
  difficulty 
}) => {
  // Using utility function that uses reduce internally
  const completionPercentage = calculateCompletionPercentage(cards);
  
  // Calculate remaining pairs
  const totalPairs = EMOJI_SETS[difficulty].length;
  const remainingPairs = totalPairs - matches;

  return (
    <div style={{ 
      marginBottom: '20px', 
      display: 'flex', 
      justifyContent: 'center', 
      gap: '20px',
      flexWrap: 'wrap',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      <div>
        <div style={{ fontSize: '0.9em', color: '#666' }}>Moves</div>
        <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{moves}</div>
      </div>
      
      <div>
        <div style={{ fontSize: '0.9em', color: '#666' }}>Time</div>
        <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{timer}s</div>
      </div>
      
      <div>
        <div style={{ fontSize: '0.9em', color: '#666' }}>Matches</div>
        <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
          {matches}/{totalPairs}
        </div>
      </div>
      
      <div>
        <div style={{ fontSize: '0.9em', color: '#666' }}>Best Score</div>
        <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
          {bestScore === 999 ? '-' : bestScore}
        </div>
      </div>
      
      <div>
        <div style={{ fontSize: '0.9em', color: '#666' }}>Progress</div>
        <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
          {completionPercentage}%
        </div>
      </div>
      
      <div>
        <div style={{ fontSize: '0.9em', color: '#666' }}>Remaining</div>
        <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
          {remainingPairs} pairs
        </div>
      </div>
    </div>
  );
};
