// NOOOMIS Core - Clean Simon implementation
class SimonCore {
  constructor() {
    this.sequence = [];
    this.playerInput = [];
    this.currentRound = 0;
    this.score = 0;
    this.lives = 3;
    this.mode = 'classic';
    this.isPlaying = false;
    this.isPlayerTurn = false;
    
    // Audio context - create only when needed
    this.audioCtx = null;
    this.initAudio();
    
    // Pad frequencies
    this.frequencies = [220, 277, 329, 392]; // G3, C#4, E4, G4
  }
  
  initAudio() {
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Audio not supported');
    }
  }
  
  playTone(padIndex, duration = 300) {
    if (!this.audioCtx) return;
    
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    osc.frequency.value = this.frequencies[padIndex];
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration / 1000);
    
    osc.start(this.audioCtx.currentTime);
    osc.stop(this.audioCtx.currentTime + duration / 1000);
  }
  
  startGame(mode = 'classic') {
    this.mode = mode;
    this.sequence = [];
    this.playerInput = [];
    this.currentRound = 0;
    this.score = 0;
    this.lives = 3;
    this.nextRound();
  }
  
  nextRound() {
    this.currentRound++;
    this.playerInput = [];
    this.sequence.push(Math.floor(Math.random() * 4));
    this.playSequence();
  }
  
  async playSequence() {
    this.isPlaying = true;
    this.isPlayerTurn = false;
    
    const delay = this.mode === 'speed' ? Math.max(200, 600 - this.currentRound * 30) : 600;
    
    for (let i = 0; i < this.sequence.length; i++) {
      const padIndex = this.sequence[i];
      
      // Visual feedback
      this.highlightPad(padIndex, true);
      this.playTone(padIndex, delay * 0.7);
      
      await this.wait(delay);
      this.highlightPad(padIndex, false);
      await this.wait(200);
    }
    
    this.isPlaying = false;
    this.isPlayerTurn = true;
  }
  
  playerPress(padIndex) {
    if (!this.isPlayerTurn || this.isPlaying) return false;
    
    // Resume audio context on user interaction
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    
    this.playTone(padIndex, 200);
    this.highlightPad(padIndex, true);
    setTimeout(() => this.highlightPad(padIndex, false), 200);
    
    this.playerInput.push(padIndex);
    
    // Check if input matches sequence so far
    const currentIndex = this.playerInput.length - 1;
    if (this.playerInput[currentIndex] !== this.sequence[currentIndex]) {
      return this.handleFailure();
    }
    
    // Check if sequence is complete
    if (this.playerInput.length === this.sequence.length) {
      return this.handleSuccess();
    }
    
    return true;
  }
  
  handleSuccess() {
    this.score += this.currentRound * 10;
    this.updateUI();
    
    setTimeout(() => {
      this.nextRound();
    }, 1000);
    
    return true;
  }
  
  handleFailure() {
    if (this.mode === 'zen') {
      // In zen mode, just replay the sequence
      setTimeout(() => {
        this.playerInput = [];
        this.playSequence();
      }, 1000);
      return false;
    }
    
    this.lives--;
    if (this.lives <= 0) {
      this.gameOver();
      return false;
    }
    
    // Retry the round
    setTimeout(() => {
      this.playerInput = [];
      this.playSequence();
    }, 1000);
    
    return false;
  }
  
  gameOver() {
    this.isPlayerTurn = false;
    this.isPlaying = false;
    
    // Save best score
    const bestScore = parseInt(localStorage.getItem('nooomis-best') || '0');
    if (this.score > bestScore) {
      localStorage.setItem('nooomis-best', this.score.toString());
    }
    
    this.onGameOver && this.onGameOver(this.score);
  }
  
  highlightPad(padIndex, active) {
    const pad = document.querySelector(`[data-pad="${padIndex}"]`);
    if (pad) {
      if (active) {
        pad.classList.add('active');
      } else {
        pad.classList.remove('active');
      }
    }
  }
  
  updateUI() {
    const scoreEl = document.getElementById('score');
    const livesEl = document.getElementById('lives');
    const roundEl = document.getElementById('round');
    
    if (scoreEl) scoreEl.textContent = this.score;
    if (livesEl) livesEl.textContent = this.lives;
    if (roundEl) roundEl.textContent = this.currentRound;
  }
  
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export for use
window.SimonCore = SimonCore;