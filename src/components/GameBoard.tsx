import React from 'react';
import { Card } from './Card';
import type { Card as CardType } from '../types/game.types';

interface GameBoardProps {
  cards: CardType[];
  onCardClick: (cardId: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Game board component - demonstrates map for rendering lists
export const GameBoard: React.FC<GameBoardProps> = ({ cards, onCardClick, difficulty }) => {
  // Using map to render the card grid - demonstrates array transformation
  const renderCards = () => {
    return cards.map((card) => (
      <Card
        key={card.id}
        card={card}
        onClick={onCardClick}
      />
    ));
  };

  // Calculate grid columns based on difficulty
  const getGridColumns = () => {
    switch (difficulty) {
      case 'easy':
        return 'repeat(4, 1fr)';
      case 'medium':
        return 'repeat(4, 1fr)';
      case 'hard':
        return 'repeat(4, 1fr)';
      default:
        return 'repeat(4, 1fr)';
    }
  };

  return (
    <div 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: getGridColumns(),
        gap: '10px',
        justifyContent: 'center',
        marginBottom: '20px',
        maxWidth: '400px',
        margin: '0 auto 20px'
      }}
    >
      {renderCards()}
    </div>
  );
};
