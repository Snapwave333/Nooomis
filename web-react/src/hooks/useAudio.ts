import { useRef, useCallback } from 'react';
import { AudioManager } from '../lib/audio';

export function useAudio() {
  const audioManagerRef = useRef<AudioManager | null>(null);
  
  const getAudioManager = useCallback(() => {
    if (!audioManagerRef.current) {
      audioManagerRef.current = new AudioManager();
    }
    return audioManagerRef.current;
  }, []);
  
  const playPad = useCallback(async (index: number, duration: number) => {
    const audioManager = getAudioManager();
    return audioManager.playPad(index, duration);
  }, [getAudioManager]);
  
  return { playPad };
}
