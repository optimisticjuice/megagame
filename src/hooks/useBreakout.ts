  import { useReducer, useEffect, useCallback, useRef } from 'react';
  import type { BreakoutState, BreakoutAction, Ball, Brick, Paddle, Particle } from '../types/breakout.types';
  import { POWER_UP_CONFIGS, PHYSICS_CONFIG, BRICK_COLORS } from '../types/breakout.types';
  import type { PowerUpType } from '../types/breakout.types';

  // Physics engine for Breakout game
  // This demonstrates complex physics calculations and collision detection
  class PhysicsEngine {
    static checkBallBrickCollision(ball: Ball, brick: Brick): boolean {
      if (brick.isDestroyed) return false;
      
      // AABB collision detection
      const ballLeft = ball.x - ball.radius;
      const ballRight = ball.x + ball.radius;
      const ballTop = ball.y - ball.radius;
      const ballBottom = ball.y + ball.radius;
      
      const brickLeft = brick.x;
      const brickRight = brick.x + brick.width;
      const brickTop = brick.y;
      const brickBottom = brick.y + brick.height;
      
      return ballRight >= brickLeft && ballLeft <= brickRight &&
            ballBottom >= brickTop && ballTop <= brickBottom;
    }
    
    static checkBallPaddleCollision(ball: Ball, paddle: Paddle): boolean {
      const ballLeft = ball.x - ball.radius;
      const ballRight = ball.x + ball.radius;
      const ballTop = ball.y - ball.radius;
      const ballBottom = ball.y + ball.radius;
      
      const paddleLeft = paddle.x;
      const paddleRight = paddle.x + paddle.width;
      const paddleTop = paddle.y;
      const paddleBottom = paddle.y + paddle.height;
      
      return ballRight >= paddleLeft && ballLeft <= paddleRight &&
            ballBottom >= paddleTop && ballTop <= paddleBottom;
    }
    
    static resolveBallBrickCollision(ball: Ball, brick: Brick): void {
      // Calculate collision normal
      const ballCenterX = ball.x;
      const ballCenterY = ball.y;
      const brickCenterX = brick.x + brick.width / 2;
      const brickCenterY = brick.y + brick.height / 2;
      
      const dx = ballCenterX - brickCenterX;
      const dy = ballCenterY - brickCenterY;
      
      // Determine collision side and reflect velocity
      if (Math.abs(dx) > Math.abs(dy)) {
        ball.vx = -ball.vx;
      } else {
        ball.vy = -ball.vy;
      }
      
      // Add some randomness to prevent stuck balls
      ball.vx += (Math.random() - 0.5) * 0.5;
      ball.vy += (Math.random() - 0.5) * 0.5;
      
      // Ensure minimum speed
      const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      if (speed < PHYSICS_CONFIG.BALL_MIN_SPEED) {
        const factor = PHYSICS_CONFIG.BALL_MIN_SPEED / speed;
        ball.vx *= factor;
        ball.vy *= factor;
      }
    }
    
    static resolveBallPaddleCollision(ball: Ball, paddle: Paddle): void {
      // Calculate hit position on paddle (-1 to 1)
      const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
      
      // Reflect and add angle based on hit position
      ball.vy = -Math.abs(ball.vy);
      ball.vx = hitPos * 5; // Max horizontal velocity
      
      // Ensure speed limits
      const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      if (speed > PHYSICS_CONFIG.BALL_MAX_SPEED) {
        const factor = PHYSICS_CONFIG.BALL_MAX_SPEED / speed;
        ball.vx *= factor;
        ball.vy *= factor;
      }
    }
    
    static updateBallPosition(ball: Ball, deltaTime: number): void {
      ball.x += ball.vx * deltaTime;
      ball.y += ball.vy * deltaTime;
      
      // Update trail for visual effects
      ball.trail.push({ x: ball.x, y: ball.y });
      if (ball.trail.length > 10) {
        ball.trail.shift();
      }
    }
    
    static checkWallCollisions(ball: Ball, gameWidth: number, gameHeight: number): boolean {
      let hitBottom = false;
      
      // Left and right walls
      if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= gameWidth) {
        ball.vx = -ball.vx;
        ball.x = ball.x - ball.radius <= 0 ? ball.radius : gameWidth - ball.radius;
      }
      
      // Top wall
      if (ball.y - ball.radius <= 0) {
        ball.vy = -ball.vy;
        ball.y = ball.radius;
      }
      
      // Bottom wall (lose life)
      if (ball.y - ball.radius >= gameHeight) {
        hitBottom = true;
      }
      
      return hitBottom;
    }
  }

  // Reducer function for Breakout game state management
  // This demonstrates complex useReducer with physics integration
  function breakoutReducer(state: BreakoutState, action: BreakoutAction): BreakoutState {
    switch (action.type) {
      case 'START_GAME': {
        return {
          ...state,
          gameActive: true,
          gameStarted: true,
          gamePaused: false,
          gameOver: false,
          gameCompleted: false
        };
      }

      case 'PAUSE_GAME': {
        return {
          ...state,
          gamePaused: true
        };
      }

      case 'RESUME_GAME': {
        return {
          ...state,
          gamePaused: false
        };
      }

      case 'RESET_GAME': {
        return getInitialState();
      }

      case 'GAME_OVER': {
        return {
          ...state,
          gameActive: false,
          gameOver: true,
          highScore: Math.max(state.highScore, state.score)
        };
      }

      case 'LEVEL_COMPLETE': {
        return {
          ...state,
          gameActive: false,
          gameCompleted: true,
          levelHighScore: Math.max(state.levelHighScore, state.score)
        };
      }

      case 'NEXT_LEVEL': {
        const newLevel = state.level + 1;
        return {
          ...getInitialState(),
          level: newLevel,
          score: state.score,
          lives: state.lives,
          highScore: state.highScore
        };
      }

      case 'UPDATE_PHYSICS': {
    const newState = { ...state };

    newState.balls = state.balls.map((ball) => {
      const newBall = { ...ball };

      // Move ball
      newBall.x += newBall.vx;
      newBall.y += newBall.vy;

      // Wall collisions
      if (newBall.x - newBall.radius <= 0 || newBall.x + newBall.radius >= 800) {
        newBall.vx *= -1;
      }

      if (newBall.y - newBall.radius <= 0) {
        newBall.vy *= -1;
      }

      // Paddle collision
      if (
        newBall.y + newBall.radius >= state.paddle.y &&
        newBall.x >= state.paddle.x &&
        newBall.x <= state.paddle.x + state.paddle.width &&
        newBall.vy > 0
      ) {
        newBall.vy *= -1;
      }

      // Brick collision (ONLY ONE PER FRAME)
      let brickHitId: number | null = null;

      for (const brick of state.bricks) {
        if (
          !brick.isDestroyed &&
          PhysicsEngine.checkBallBrickCollision(newBall, brick) &&
          newBall.lastHitBrickId !== brick.id
        ) {
          PhysicsEngine.resolveBallBrickCollision(newBall, brick);
          brickHitId = brick.id;
          newBall.lastHitBrickId = brick.id;
          break;
        }
      }

      // Update bricks immutably if one was hit
      if (brickHitId !== null) {
        newState.bricks = state.bricks.map((brick) => {
          if (brick.id !== brickHitId) return brick;

          const newHealth = brick.health - 1;

          return {
            ...brick,
            health: newHealth,
            isDestroyed: newHealth <= 0,
          };
        });

        newState.score += 10;
      }

      // Reset hit lock if no longer touching any brick
      const stillTouching = state.bricks.some((brick) =>
        PhysicsEngine.checkBallBrickCollision(newBall, brick)
      );

      if (!stillTouching) {
        newBall.lastHitBrickId = null;
      }

      return newBall;
    });

    return newState;
  }

      case 'MOVE_PADDLE': {
        return {
          ...state,
          paddle: {
            ...state.paddle,
            x: Math.max(0, Math.min(800 - state.paddle.width, action.x - state.paddle.width / 2))
          }
        };
      }

      case 'LAUNCH_BALL': {
        if (state.balls.length > 0 && state.balls[0].vx === 0 && state.balls[0].vy === 0) {
          return {
            ...state,
            balls: state.balls.map((ball, index) => 
              index === 0 
                ? { ...ball, vx: (Math.random() - 0.5) * 4, vy: -8 }
                : ball
            )
          };
        }
        return state;
      }

      case 'HIT_BRICK': {
        const brick = state.bricks.find(b => b.id === action.brickId);
        if (!brick || brick.isDestroyed) return state;
        
        const newHealth = brick.health - 1;
        const isDestroyed = newHealth <= 0;
        
        // Using map to update brick
        const newBricks = state.bricks.map(b => 
          b.id === action.brickId 
            ? { ...b, health: newHealth, isDestroyed }
            : b
        );
        
        if (isDestroyed) {
          // Create particles
          const particles: Particle[] = Array.from({ length: 10 }, (_, i) => ({
            id: Date.now() + i,
            x: brick.x + brick.width / 2,
            y: brick.y + brick.height / 2,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 1,
            color: brick.color,
            size: Math.random() * 4 + 2
          }));
          
          // Create power-up chance
          const powerUpKeys = Object.keys(POWER_UP_CONFIGS) as PowerUpType[];
          const randomKey = powerUpKeys[Math.floor(Math.random() * powerUpKeys.length)];
          const config = POWER_UP_CONFIGS[randomKey];
          const powerUp = Math.random() < 0.2 ? {
            id: Date.now(),
            type: randomKey,
            x: brick.x + brick.width / 2,
            y: brick.y + brick.height / 2,
            vy: 2,
            width: 30,
            height: 30,
            color: config.color,
            icon: config.icon,
            duration: config.duration
          } : null;
          
          return {
            ...state,
            bricks: newBricks,
            score: state.score + brick.points * (state.combo + 1),
            bricksDestroyed: state.bricksDestroyed + 1,
            combo: state.combo + 1,
            maxCombo: Math.max(state.maxCombo, state.combo + 1),
            particles: [...state.particles, ...particles],
            powerUps: powerUp ? [...state.powerUps, powerUp] : state.powerUps
          };
        }
        
        return {
          ...state,
          bricks: newBricks,
          score: state.score + Math.floor(brick.points / 2)
        };
      }

      case 'DESTROY_BRICK': {
        const newBricks = state.bricks.map(brick => 
          brick.id === action.brickId 
            ? { ...brick, isDestroyed: true }
            : brick
        );
        
        // Check if level is complete
        const remainingBricks = newBricks.filter(brick => !brick.isDestroyed);
        if (remainingBricks.length === 0) {
          return breakoutReducer({ ...state, bricks: newBricks }, { type: 'LEVEL_COMPLETE' });
        }
        
        return { ...state, bricks: newBricks };
      }

      case 'COLLECT_POWER_UP': {
        const powerUp = state.powerUps.find(p => p.id === action.powerUpId);
        if (!powerUp) return state;
        
        // Remove collected power-up
        const newPowerUps = state.powerUps.filter(p => p.id !== action.powerUpId);
        
        // Apply instant effects
        let newState = { ...state, powerUps: newPowerUps };
        
        if (powerUp.type === 'MULTI_BALL') {
          // Split current balls
          const additionalBalls: Ball[] = [];
          state.balls.forEach(ball => {
            for (let i = 0; i < 2; i++) {
              additionalBalls.push({
                ...ball,
                id: Date.now() + i,
                vx: (Math.random() - 0.5) * 8,
                vy: -Math.abs(ball.vy)
              });
            }
          });
          newState.balls = [...state.balls, ...additionalBalls];
        } else if (powerUp.type === 'EXTRA_LIFE') {
          newState.lives = state.lives + 1;
        } else {
          // Add timed power-up
          newState.activePowerUps = [
            ...state.activePowerUps,
            {
              type: powerUp.type,
              endTime: Date.now() + powerUp.duration
            }
          ];
        }
        
        newState.score += 50;
        newState.powerUpsCollected = state.powerUpsCollected + 1;
        
        return newState;
      }

      case 'INCREMENT_COMBO': {
        return {
          ...state,
          combo: state.combo + 1,
          maxCombo: Math.max(state.maxCombo, state.combo + 1)
        };
      }

      case 'RESET_COMBO': {
        return {
          ...state,
          combo: 0
        };
      }

      case 'ADD_SCORE': {
        return {
          ...state,
          score: state.score + action.points
        };
      }

      default:
        return state;
    }
  }

  // Initial state generator
  function getInitialState(): BreakoutState {
    // Create initial bricks layout
    const bricks: Brick[] = [];
    const rows = 5;
    const cols = 10;
    const brickWidth = 70;
    const brickHeight = 20;
    const offsetX = (800 - cols * (brickWidth + 5)) / 2;
    const offsetY = 60;
    
    let brickId = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const health = rows - row; // Top bricks have more health
        bricks.push({
          id: brickId++,
          x: offsetX + col * (brickWidth + 5),
          y: offsetY + row * (brickHeight + 5),
          width: brickWidth,
          height: brickHeight,
          health,
          maxHealth: health,
          points: health * 10,
          color: BRICK_COLORS[row % BRICK_COLORS.length],
          isDestroyed: false
        });
      }
    }
    
    return {
      score: 0,
      lives: 3,
      level: 1,
      gameActive: false,
      gameStarted: false,
      gameCompleted: false,
      gamePaused: false,
      gameOver: false,
  balls: [{
    id: 0,
    x: 400,
    y: 450,
    vx: 0,
    vy: 0,
    radius: 8,
    speed: 8,
    trail: [],
    lastHitBrickId: null
  }],
      paddle: {
        x: 350,
        y: 550,
        width: 100,
        height: 15,
        speed: 8,
        color: '#2196F3'
      },
      bricks,
      powerUps: [],
      particles: [],
      activePowerUps: [],
      lastTime: Date.now(),
      deltaTime: 0,
      bricksDestroyed: 0,
      totalBricks: bricks.length,
      combo: 0,
      maxCombo: 0,
      powerUpsCollected: 0,
      highScore: parseInt(localStorage.getItem('breakoutHighScore') || '0'),
      levelHighScore: 0
    };
  }

  // Custom hook for Breakout game logic
  export const useBreakout = () => {
    const [state, dispatch] = useReducer(breakoutReducer, getInitialState());
    const animationFrameRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(Date.now());
    
    // Game loop using requestAnimationFrame
    useEffect(() => {
      if (state.gameActive && !state.gamePaused) {
        const gameLoop = (currentTime: number) => {
          const deltaTime = (currentTime - lastTimeRef.current) / 1000;
          lastTimeRef.current = currentTime;
          
          dispatch({ type: 'UPDATE_PHYSICS', deltaTime });
          
          animationFrameRef.current = requestAnimationFrame(gameLoop);
        };
        
        animationFrameRef.current = requestAnimationFrame(gameLoop);
        
        return () => {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
        };
      }
    }, [state.gameActive, state.gamePaused]);
    
    // High score persistence
    useEffect(() => {
      if (state.gameOver && state.score > 0) {
        localStorage.setItem('breakoutHighScore', state.highScore.toString());
      }
    }, [state.gameOver, state.highScore, state.score]);
    
    // Mouse movement handler
    const handleMouseMove = useCallback((x: number) => {
      if (state.gameActive && !state.gamePaused) {
        dispatch({ type: 'MOVE_PADDLE', x });
      }
    }, [state.gameActive, state.gamePaused]);
    
    // Game controls
    const startGame = useCallback(() => {
      dispatch({ type: 'START_GAME' });
    }, []);
    
    const pauseGame = useCallback(() => {
      dispatch({ type: 'PAUSE_GAME' });
    }, []);
    
    const resumeGame = useCallback(() => {
      dispatch({ type: 'RESUME_GAME' });
    }, []);
    
    const resetGame = useCallback(() => {
      dispatch({ type: 'RESET_GAME' });
    }, []);
    
    const launchBall = useCallback(() => {
      dispatch({ type: 'LAUNCH_BALL' });
    }, []);
    
    const nextLevel = useCallback(() => {
      dispatch({ type: 'NEXT_LEVEL' });
    }, []);
    
    // Calculate statistics using reduce
    const accuracy = state.bricksDestroyed > 0 
      ? Math.round((state.bricksDestroyed / state.totalBricks) * 100)
      : 0;
    
    return {
      state,
      accuracy,
      handleMouseMove,
      startGame,
      pauseGame,
      resumeGame,
      resetGame,
      launchBall,
      nextLevel
    };
  };
