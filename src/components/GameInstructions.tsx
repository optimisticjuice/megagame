import React from 'react';

// Game instructions component - demonstrates static content component
export const GameInstructions: React.FC = () => {
  return (
    <div style={{ 
      marginTop: '30px', 
      padding: '20px', 
      backgroundColor: '#f8f9fa', 
      borderRadius: '8px',
      textAlign: 'left',
      maxWidth: '600px',
      margin: '30px auto 0',
      border: '1px solid #dee2e6'
    }}>
      <h3 style={{ 
        color: '#333', 
        marginBottom: '15px',
        borderBottom: '2px solid #4CAF50',
        paddingBottom: '8px'
      }}>
        How to Play:
      </h3>
      <ul style={{ 
        lineHeight: '1.6', 
        color: '#555',
        paddingLeft: '20px'
      }}>
        <li style={{ marginBottom: '8px' }}>
          <strong>Click on cards</strong> to flip them over and reveal emojis
        </li>
        <li style={{ marginBottom: '8px' }}>
          <strong>Find matching pairs</strong> of emojis by remembering card positions
        </li>
        <li style={{ marginBottom: '8px' }}>
          <strong>Matched pairs</strong> stay flipped and can't be selected again
        </li>
        <li style={{ marginBottom: '8px' }}>
          <strong>Complete the game</strong> by finding all matching pairs
        </li>
        <li style={{ marginBottom: '8px' }}>
          <strong>Try to minimize moves</strong> - your best score is saved locally
        </li>
        <li style={{ marginBottom: '8px' }}>
          <strong>Challenge yourself</strong> with different difficulty levels!
        </li>
      </ul>
      
      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '5px',
        fontSize: '14px',
        color: '#1976d2'
      }}>
        <strong>💡 Pro Tip:</strong> Pay attention to the timer and try to improve your memory skills!
      </div>
    </div>
  );
};
