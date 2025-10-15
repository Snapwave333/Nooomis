interface ScoreDisplayProps {
  score: number;
  lives: number;
  round: number;
  streak: number;
}

export function ScoreDisplay({ score, lives, round, streak }: ScoreDisplayProps) {
  return (
    <div className="score-display">
      <div className="score-value">{score}</div>
      <div className="score-label">Score</div>
      
      <div className="score-stats">
        <div className="score-stat">
          <span className="score-stat-label">Round:</span>
          <span className="score-stat-value">{round}</span>
        </div>
        <div className="score-stat">
          <span className="score-stat-label">Lives:</span>
          <span className="score-stat-value">{lives}</span>
        </div>
        {streak > 0 && (
          <div className="score-stat">
            <span className="score-stat-label">Streak:</span>
            <span className="score-stat-value score-stat-streak">{streak}</span>
          </div>
        )}
      </div>
    </div>
  );
}
