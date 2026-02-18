// TypeScript types for Advanced Breakout game
// This demonstrates complex physics and game state typing

export interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  radius: number;
  speed: number;
  trail: { x: number; y: number }[]; // for visual effects
  lastHitBrickId: number | null;

}

export interface Brick {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  maxHealth: number;
  points: number;
  powerUp?: PowerUpType;
  color: string;
  isDestroyed: boolean;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
}

export interface PowerUp {
  id: number;
  type: PowerUpType;
  x: number;
  y: number;
  vy: number;
  width: number;
  height: number;
  color: string;
  icon: string;
  duration: number;
}

export type PowerUpType = 'MULTI_BALL' | 'WIDE_PADDLE' | 'LASER' | 'SLOW_BALL' | 'EXTRA_LIFE';

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export interface BreakoutState {
  // Game state
  score: number;
  lives: number;
  level: number;
  gameActive: boolean;
  gameStarted: boolean;
  gameCompleted: boolean;
  gamePaused: boolean;
  gameOver: boolean;
  
  // Game objects
  balls: Ball[];
  paddle: Paddle;
  bricks: Brick[];
  powerUps: PowerUp[];
  particles: Particle[];
  
  // Power-up states
  activePowerUps: Array<{
    type: PowerUpType;
    endTime: number;
  }>;
  
  // Physics and timing
  lastTime: number;
  deltaTime: number;
  
  // Statistics
  bricksDestroyed: number;
  totalBricks: number;
  combo: number;
  maxCombo: number;
  powerUpsCollected: number;
  
  // High scores
  highScore: number;
  levelHighScore: number;
}

export type BreakoutAction =
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'GAME_OVER' }
  | { type: 'LEVEL_COMPLETE' }
  | { type: 'NEXT_LEVEL' }
  | { type: 'UPDATE_PHYSICS'; deltaTime: number }
  | { type: 'MOVE_PADDLE'; x: number }
  | { type: 'LAUNCH_BALL' }
  | { type: 'ADD_BALL'; ball: Ball }
  | { type: 'REMOVE_BALL'; ballId: number }
  | { type: 'HIT_BRICK'; brickId: number; ballId: number }
  | { type: 'DESTROY_BRICK'; brickId: number }
  | { type: 'COLLECT_POWER_UP'; powerUpId: number }
  | { type: 'ACTIVATE_POWER_UP'; powerUpType: PowerUpType }
  | { type: 'DEACTIVATE_POWER_UP'; powerUpType: PowerUpType }
  | { type: 'CREATE_PARTICLES'; particles: Particle[] }
  | { type: 'UPDATE_PARTICLES'; deltaTime: number }
  | { type: 'INCREMENT_COMBO' }
  | { type: 'RESET_COMBO' }
  | { type: 'ADD_SCORE'; points: number };

export interface LevelConfig {
  id: number;
  name: string;
  brickLayout: number[][];
  ballSpeed: number;
  paddleWidth: number;
  powerUpChance: number;
  backgroundColor: string;
  brickColors: string[];
}

export const POWER_UP_CONFIGS: Record<PowerUpType, {
  color: string;
  icon: string;
  duration: number;
  description: string;
  chance: number;
}> = {
  MULTI_BALL: {
    color: '#FF6B6B',
    icon: '⚡',
    duration: 0, // Instant effect
    description: 'Splits ball into 3',
    chance: 0.15
  },
  WIDE_PADDLE: {
    color: '#4ECDC4',
    icon: '↔️',
    duration: 10000,
    description: 'Wider paddle for 10s',
    chance: 0.2
  },
  LASER: {
    color: '#FF6B35',
    icon: '🔫',
    duration: 8000,
    description: 'Shoot lasers for 8s',
    chance: 0.1
  },
  SLOW_BALL: {
    color: '#95E77E',
    icon: '🐌',
    duration: 7000,
    description: 'Slows ball for 7s',
    chance: 0.25
  },
  EXTRA_LIFE: {
    color: '#FF1744',
    icon: '❤️',
    duration: 0, // Instant effect
    description: 'Extra life',
    chance: 0.05
  }
};

export const BRICK_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
];

export const PHYSICS_CONFIG = {
  GRAVITY: 0,
  FRICTION: 0.98,
  BALL_MAX_SPEED: 15,
  BALL_MIN_SPEED: 3,
  PADDLE_SPEED: 8,
  POWER_UP_SPEED: 2,
  PARTICLE_GRAVITY: 0.2
};
