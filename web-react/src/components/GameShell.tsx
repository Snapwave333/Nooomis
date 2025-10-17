import { SimonBoard } from './SimonBoard/SimonBoard';
import { GameHub } from './GameHub/GameHub';
import { useGame, type StartOptions } from '../hooks/useGame';
import { useKeyboard } from '../hooks/useKeyboard';
import { GameState } from '../lib/stateMachine';

interface GameShellProps {
  onQuit?: () => void;
  modeLabel?: string;
  startOptions?: StartOptions;
}

export function GameShell({ onQuit, modeLabel = 'Classic', startOptions }: GameShellProps) {
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
    pause,
    resume,
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
      
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        {/* Top bar */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {onQuit && (<button className="game-button" onClick={onQuit}>Back</button>)}
            {state === GameState.PLAYER_INPUT && (
              <button className="game-button" onClick={pause}>Pause</button>
            )}
            {state === GameState.PAUSED && (
              <button className="game-button" onClick={resume}>Resume</button>
            )}
          </div>
          <div style={{ fontWeight: 700, opacity: 0.85 }}>{modeLabel}</div>
        </div>
        
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
          mode={modeLabel}
          isActive={isGameActive}
        />
      </div>
      
      {state === GameState.IDLE && (
        <div className="game-idle">
          <button
            onClick={() => startGame('classic', startOptions)}
            className="game-button"
          >
            Start Game
          </button>
        </div>
      )}
      
      {state === GameState.PAUSED && (
        <div className="game-over">
          <div className="game-over-title">Paused</div>
          <button onClick={resume} className="game-button">Resume</button>
          {onQuit && (
            <button onClick={onQuit} className="game-button" style={{ marginLeft: '0.5rem' }}>Quit</button>
          )}
        </div>
      )}
      
      {state === GameState.GAME_OVER && (
        <div className="game-over">
          <div className="game-over-title">Game Over!</div>
          <div className="game-over-score">Final Score: {score}</div>
          <button
            onClick={() => startGame('classic', startOptions)}
            className="game-button"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
