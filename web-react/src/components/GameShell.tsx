import { SimonBoard } from './SimonBoard/SimonBoard';
import { GameHub } from './GameHub/GameHub';
import { useGame } from '../hooks/useGame';
import { useKeyboard } from '../hooks/useKeyboard';
import { GameState } from '../lib/stateMachine';

export function GameShell() {
  const {
    state,
    score,
    lives,
    round,
    streak,
    activePad,
    ariaMessage,
    startGame,
    handlePlayerPress,
  } = useGame();
  
  useKeyboard(handlePlayerPress);
  
  const isDisabled = state === GameState.PLAYBACK || state === GameState.IDLE;
  const isGameActive = state === GameState.PLAYER_INPUT || state === GameState.PLAYBACK;
  
  return (
    <div className="game-shell">
      {/* ARIA Live Region */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {ariaMessage}
      </div>
      
      <div style={{ position: 'relative' }}>
        <SimonBoard
          onPadPress={handlePlayerPress}
          activePad={activePad}
          isDisabled={isDisabled}
        />
        
        <GameHub
          score={score}
          lives={lives}
          round={round}
          streak={streak}
          mode="Classic"
          isActive={isGameActive}
        />
      </div>
      
      {state === GameState.IDLE && (
        <div className="game-idle">
          <button
            onClick={() => startGame('classic')}
            className="game-button"
          >
            Start Game
          </button>
        </div>
      )}
      
      {state === GameState.GAME_OVER && (
        <div className="game-over">
          <div className="game-over-title">Game Over!</div>
          <div className="game-over-score">Final Score: {score}</div>
          <button
            onClick={() => startGame('classic')}
            className="game-button"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
