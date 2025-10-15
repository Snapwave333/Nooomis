import { ScoreDisplay } from './ScoreDisplay';
import { ModeIndicator } from './ModeIndicator';

interface GameHubProps {
  score: number;
  lives: number;
  round: number;
  streak: number;
  mode: string;
  isActive: boolean;
}

export function GameHub({ score, lives, round, streak, mode, isActive }: GameHubProps) {
  return (
    <div className="game-hub">
      <div className="game-hub-content">
        <div className="game-hub-inner">
          <ScoreDisplay score={score} lives={lives} round={round} streak={streak} />
          <ModeIndicator mode={mode} isActive={isActive} />
        </div>
      </div>
    </div>
  );
}
