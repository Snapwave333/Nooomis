interface WelcomePageProps {
  onStart: () => void;
  onSettings: () => void;
  onTutorial: () => void;
  onChallenges: () => void;
}

export function WelcomePage({ onStart, onSettings, onTutorial, onChallenges }: WelcomePageProps) {
  return (
    <div className="game-shell" style={{ flexDirection: 'column', gap: '1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '0.2em' }}>NOOOMIS</div>
        <div style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>A modern, accessible Simon memory game</div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
        <button className="game-button" onClick={onStart}>Start</button>
        <button className="game-button" onClick={onTutorial}>Tutorial</button>
        <button className="game-button" onClick={onChallenges}>Challenges</button>
        <button className="game-button" onClick={onSettings}>Settings</button>
      </div>
    </div>
  );
}