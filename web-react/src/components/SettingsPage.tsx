import { useEffect, useMemo, useState } from 'react';
import { loadGame, saveGame } from '../lib/storage';
import { useAudio } from '../hooks/useAudio';

// Keep only core audio and theme settings
export type Wave = 'sine' | 'square' | 'triangle' | 'sawtooth';

export function SettingsPage({ onBack }: { onBack: () => void }) {
  const initial = useMemo(() => loadGame(), []);
  const initialWave: Wave = (initial.settings.waveform || 'sine') as Wave;

  const [volume, setVolume] = useState(initial.settings.volume ?? 0.7);
  const [muted, setMuted] = useState(!!initial.settings.muted);
  const [waveform, setWaveform] = useState<Wave>(initialWave);
  const [theme, setTheme] = useState(initial.settings.theme || 'default');

  const { setVolume: applyVolume, setMuted: applyMuted, setWaveform: applyWave } = useAudio();

  // Apply current settings
  useEffect(() => { applyVolume(volume); }, [volume, applyVolume]);
  useEffect(() => { applyMuted(muted); }, [muted, applyMuted]);
  useEffect(() => { applyWave(waveform); }, [waveform, applyWave]);
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  const handleSave = () => {
    const data = loadGame();
    data.settings.volume = volume;
    data.settings.theme = theme;
    data.settings.waveform = waveform;
    data.settings.muted = muted;
    saveGame(data);
    onBack();
  };

  return (
    <div className="game-shell" style={{ flexDirection: 'column', gap: '1rem' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Settings</div>

      <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '0.75rem', minWidth: '22rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Volume</span>
            <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
          </label>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Mute</span>
            <input type="checkbox" checked={muted} onChange={(e) => setMuted(e.target.checked)} />
          </label>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Waveform</span>
            <select value={waveform} onChange={(e) => setWaveform(e.target.value as Wave)}>
              <option value="sine">Sine (classic)</option>
              <option value="square">Square</option>
              <option value="triangle">Triangle</option>
              <option value="sawtooth">Saw</option>
            </select>
          </label>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Theme</span>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="default">Default</option>
            </select>
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="game-button" onClick={handleSave}>Save</button>
        <button className="game-button" onClick={onBack}>Back</button>
      </div>
    </div>
  );
}
