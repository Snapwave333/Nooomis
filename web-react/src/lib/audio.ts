export class AudioManager {
  private audioContext: AudioContext;
  private frequencies = [440, 523, 349, 293]; // Green, Red, Blue, Yellow
  
  constructor() {
    this.audioContext = new AudioContext();
  }
  
  async playPad(index: number, duration: number): Promise<void> {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.frequency.value = this.frequencies[index];
    oscillator.type = 'sine';
    
    // 10ms fade in/out to prevent pops
    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.linearRampToValueAtTime(0.3, now + duration / 1000 - 0.01);
    gainNode.gain.linearRampToValueAtTime(0, now + duration / 1000);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start(now);
    oscillator.stop(now + duration / 1000);
    
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    });
  }
}
