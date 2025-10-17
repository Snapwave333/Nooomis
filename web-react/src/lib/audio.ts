export class AudioManager {
  private audioContext?: AudioContext;
  private masterGain?: GainNode;
  private readonly frequencies = [440, 523, 349, 293]; // Green, Red, Blue, Yellow
  private volume = 0.7;
  private muted = false;
  private waveform: OscillatorType = 'sine';
  private currentPack: string = 'classic';
  private padBuffers: (AudioBuffer | null)[] = [null, null, null, null];
  private ambientBuffer: AudioBuffer | null = null;
  private ambientSource: AudioBufferSourceNode | null = null;

  private ensureContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (!this.masterGain && this.audioContext) {
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.muted ? 0 : this.volume;
      this.masterGain.connect(this.audioContext.destination);
    }
  }

  setVolume(value: number) {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.masterGain && this.audioContext) {
      const now = this.audioContext.currentTime;
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : this.volume, now, 0.01);
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.masterGain && this.audioContext) {
      const now = this.audioContext.currentTime;
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : this.volume, now, 0.01);
    }
  }

  setWaveform(type: OscillatorType) {
    this.waveform = type;
  }

  /**
   * Attempt to load an audio pack of WAV files located under
   * web/assets/audio/<pack>/tone0.wav .. tone3.wav and optional ambient.wav
   * (relative path works in both Vite dev and Cordova file:// www/).
   * Falls back gracefully to oscillator tones if files are missing.
   */
  async setAudioPack(pack: string) {
    this.currentPack = pack;
    this.ensureContext();
    const ctx = this.audioContext!;

    const fetchAndDecode = async (url: string): Promise<AudioBuffer | null> => {
      try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const arrayBuffer = await res.arrayBuffer();
        return await ctx.decodeAudioData(arrayBuffer);
      } catch {
        return null;
      }
    };

    // Load pad samples
    const base = `web/assets/audio/${pack}`;
    const buffers = await Promise.all([
      fetchAndDecode(`${base}/tone0.wav`),
      fetchAndDecode(`${base}/tone1.wav`),
      fetchAndDecode(`${base}/tone2.wav`),
      fetchAndDecode(`${base}/tone3.wav`),
    ]);
    this.padBuffers = buffers.map(b => b || null);

    // Load optional ambient loop
    this.ambientBuffer = await fetchAndDecode(`${base}/ambient.wav`);
  }

  /** Start ambient loop if a buffer is available */
  startAmbientLoop() {
    if (!this.audioContext || !this.ambientBuffer || this.muted) return;
    this.stopAmbientLoop();
    const source = this.audioContext.createBufferSource();
    source.buffer = this.ambientBuffer;
    source.loop = true;
    source.connect(this.masterGain!);
    source.start();
    this.ambientSource = source;
  }

  stopAmbientLoop() {
    try {
      this.ambientSource?.stop();
    } catch {}
    this.ambientSource = null;
  }

  async playPad(index: number, duration: number): Promise<void> {
    this.ensureContext();
    const ctx = this.audioContext!;

    // Resume on user gesture; if this is called from a click it will succeed
    if (ctx.state === 'suspended') {
      try { await ctx.resume(); } catch {}
    }

    const now = ctx.currentTime;
    const padGain = ctx.createGain();
    padGain.gain.setValueAtTime(0, now);
    padGain.gain.linearRampToValueAtTime(0.3, now + 0.01);
    padGain.gain.linearRampToValueAtTime(0.3, now + duration / 1000 - 0.01);
    padGain.gain.linearRampToValueAtTime(0, now + duration / 1000);
    padGain.connect(this.masterGain!);

    const buffer = this.padBuffers[index];
    if (buffer) {
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(padGain);
      src.start(now);
      src.stop(now + duration / 1000);
    } else {
      const oscillator = ctx.createOscillator();
      oscillator.frequency.value = this.frequencies[index];
      oscillator.type = this.waveform;
      oscillator.connect(padGain);
      oscillator.start(now);
      oscillator.stop(now + duration / 1000);
    }

    return new Promise(resolve => setTimeout(resolve, duration));
  }
}
