import '../styles/Splash.css';

export function Splash() {
  return (
    <div className="splash-overlay" role="status" aria-live="polite" aria-label="Loading">
      <div className="splash-inner">
        <div className="splash-title">NOOOMIS</div>
        <div className="splash-subtitle">Loading…</div>
      </div>
    </div>
  );
}
