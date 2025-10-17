import { useState } from 'react';
import type { StartOptions } from '../hooks/useGame';

interface ChallengePageProps {
  onBack: () => void;
  onSelect: (label: string, options: StartOptions) => void;
}

export function ChallengePage({ onBack, onSelect }: ChallengePageProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const pick = (label: string, options: StartOptions) => {
    setSelected(label);
    onSelect(label, options);
  };

  return (
    <div className="game-shell" style={{ flexDirection: 'column', gap: '1rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="game-button" onClick={onBack}>Back</button>
        <div style={{ fontWeight: 700, opacity: 0.85 }}>Challenges</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', width: '100%' }}>
        <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '0.75rem' }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Speed Up</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 8 }}>Faster playback and tighter gaps.</div>
          <button className="game-button" onClick={() => pick('Speed Up', { speedMultiplier: 1.6, gapScale: 0.8 })} disabled={selected !== null}>Play</button>
        </div>

        <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '0.75rem' }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Reverse</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 8 }}>Playback and input are reversed.</div>
          <button className="game-button" onClick={() => pick('Reverse', { reverse: true })} disabled={selected !== null}>Play</button>
        </div>
      </div>

      <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
        More challenge variants coming soon.
      </div>
    </div>
  );
}