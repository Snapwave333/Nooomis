import { useCallback, useEffect, useState } from 'react';
import '../styles/globals.css';
import { GameShell } from './GameShell';
import { WelcomePage } from './WelcomePage';
import { SettingsPage } from './SettingsPage';
import { Splash } from './Splash';
import { loadGame } from '../lib/storage';
import { TutorialPage } from './TutorialPage';
import { ChallengePage } from './ChallengePage';
import { useAudio } from '../hooks/useAudio';
import type { StartOptions } from '../hooks/useGame';

type Screen = 'welcome' | 'settings' | 'game' | 'tutorial' | 'challenge';

function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [modeLabel, setModeLabel] = useState<string>('Classic');
  const [startOptions, setStartOptions] = useState<StartOptions | undefined>(undefined);
  const { setVolume, setMuted, setWaveform } = useAudio();
  const [splashVisible, setSplashVisible] = useState(true);

  // Apply persisted theme (if any) on load
  useEffect(() => {
    const data = loadGame();
    document.documentElement.setAttribute('data-theme', data.settings.theme || 'default');
    // Apply audio settings early
    try {
      setVolume(data.settings.volume ?? 0.7);
      setMuted(!!data.settings.muted);
      setWaveform((data.settings.waveform || 'sine') as OscillatorType);
    } catch {}
  }, []);

  // Hide splash when fonts are ready, or after a short delay as fallback
  useEffect(() => {
    let canceled = false;
    const hide = () => { if (!canceled) setSplashVisible(false); };
    const fontsReady = (document as any).fonts?.ready;
    if (fontsReady && typeof fontsReady.then === 'function') {
      fontsReady.then(hide);
    } else {
      window.addEventListener('load', hide, { once: true });
    }
    const timer = setTimeout(hide, 1200);
    return () => { canceled = true; clearTimeout(timer); window.removeEventListener('load', hide); };
  }, []);

  const handleQuit = useCallback(() => {
    try {
      const nav: any = navigator;
      if (nav?.app?.exitApp) {
        nav.app.exitApp();
        return;
      }
    } catch {}
    setScreen('welcome');
  }, []);

  return (
    <div className="App">
      {splashVisible && <Splash />}
      {screen === 'welcome' && (
        <WelcomePage
          onStart={() => { setModeLabel('Classic'); setStartOptions(undefined); setScreen('game'); }}
          onSettings={() => setScreen('settings')}
          onTutorial={() => setScreen('tutorial')}
          onChallenges={() => setScreen('challenge')}
        />
      )}
      {screen === 'settings' && (
        <SettingsPage onBack={() => setScreen('welcome')} />
      )}
      {screen === 'tutorial' && (
        <TutorialPage onBack={() => setScreen('welcome')} onStart={() => { setModeLabel('Classic'); setStartOptions(undefined); setScreen('game'); }} />
      )}
      {screen === 'challenge' && (
        <ChallengePage
          onBack={() => setScreen('welcome')}
          onSelect={(label, options) => { setModeLabel(label); setStartOptions(options); setScreen('game'); }}
        />
      )}
      {screen === 'game' && (
        <GameShell onQuit={handleQuit} modeLabel={modeLabel} startOptions={startOptions} />
      )}
    </div>
  );
}

export default App;
