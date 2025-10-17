import { useState } from 'react';
import { SimonBoard } from './SimonBoard/SimonBoard';
import { useAudio } from '../hooks/useAudio';

export function TutorialPage({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  const { playPad } = useAudio();
  const [active, setActive] = useState<number | undefined>();

  const handleDemoPress = async (pad: number) => {
    setActive(pad);
    await playPad(pad, 300);
    setActive(undefined);
  };

  return (
    <div className="game-shell" style={{ flexDirection: 'column', gap: '1rem', maxWidth: 900, margin: '0 auto' }}>
      {/* Top bar */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="game-button" onClick={onBack}>Back</button>
        <div style={{ fontWeight: 700, opacity: 0.85 }}>Tutorial</div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Welcome to NOOOMIS</div>
        <div style={{ color: 'var(--muted)' }}>Tap a pad to hear its tone. The game plays a sequence; repeat it to advance.</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <SimonBoard onPadPress={handleDemoPress} activePad={active} isDisabled={false} />
      </div>

      <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '0.75rem' }}>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.6 }}>
          <li>Watch and listen as the board lights up a pattern.</li>
          <li>Press the pads in the same order.</li>
          <li>The sequence grows by one each round.</li>
          <li>You have limited lives; mistakes cost a life.</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button className="game-button" onClick={onStart}>Start Classic</button>
        <button className="game-button" onClick={onBack}>Back</button>
      </div>
    </div>
  );
}