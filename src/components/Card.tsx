import React from 'react';
import type { Card as CardType } from '../types/game.types';

interface CardProps {
  card: CardType;
  onClick: (cardId: number) => void;
}

// Individual card component - demonstrates component composition and props
export const Card: React.FC<CardProps> = ({ card, onClick }) => {
  return (
    <div
      key={card.id}
      className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
      onClick={() => onClick(card.id)}
      style={{
        width: '80px',
        height: '80px',
        margin: '5px',
        border: '2px solid #333',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        cursor: 'pointer',
        backgroundColor: card.isFlipped || card.isMatched ? '#fff' : '#4CAF50',
        transition: 'all 0.3s ease',
        transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)',
        boxShadow: card.isMatched ? '0 0 10px rgba(76, 175, 80, 0.5)' : '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      {card.isFlipped || card.isMatched ? card.emoji : '?'}
    </div>
  );
};
