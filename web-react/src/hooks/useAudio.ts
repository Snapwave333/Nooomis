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
  
  const setVolume = useCallback((vol: number) => {
    const audioManager = getAudioManager();
    audioManager.setVolume(vol);
  }, [getAudioManager]);
  
  const setMuted = useCallback((muted: boolean) => {
    const audioManager = getAudioManager();
    audioManager.setMuted(muted);
  }, [getAudioManager]);
  
  const setWaveform = useCallback((type: OscillatorType) => {
    const audioManager = getAudioManager();
    audioManager.setWaveform(type);
  }, [getAudioManager]);

  const setAudioPack = useCallback(async (pack: string) => {
    const audioManager = getAudioManager();
    await audioManager.setAudioPack(pack);
  }, [getAudioManager]);

  const startAmbient = useCallback(() => {
    const audioManager = getAudioManager();
    audioManager.startAmbientLoop();
  }, [getAudioManager]);

  const stopAmbient = useCallback(() => {
    const audioManager = getAudioManager();
    audioManager.stopAmbientLoop();
  }, [getAudioManager]);

  return { playPad, setVolume, setMuted, setWaveform, setAudioPack, startAmbient, stopAmbient };
}
