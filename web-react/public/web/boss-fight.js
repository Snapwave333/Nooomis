/*
  NOOOMIS Boss Fight System
  Final confrontation with corrupted Simon
*/

class BossFightSystem {
  constructor() {
    this.isActive = false;
    this.currentRound = 0;
    this.maxRounds = 20;
    this.corruptionLevel = 0;
    this.victoryPaths = {
      sequence: false,    // Complete the sequence filtering fake flashes
      refusal: false,     // Refuse to play for 10 seconds
      override: false     // Press all buttons 3 times
    };
    this.bossData = {
      fakeFlashCount: 0,
      realSequence: [],
      corruptedSequence: [],
      uiCorruption: false,
      invertedControls: false,
      lastOverrideTime: 0,
      overrideCount: 0
    };
  }
  
  // Start the boss fight
  startBossFight() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.currentRound = 0;
    this.corruptionLevel = 0;
    this.resetVictoryPaths();
    this.resetBossData();
    
    this.showBossFightStart();
    this.prepareBossSequence();
  }
  
  // Show boss fight start message
  showBossFightStart() {
    const message = document.createElement('div');
    message.className = 'boss-fight-start';
    message.innerHTML = `
      <div class="boss-start-content">
        <h2>👹 FINAL CONFRONTATION</h2>
        <h3>The Corrupted Simon</h3>
        <p>The patterns have become sentient. They know you.</p>
        <p>They will try to deceive you with false flashes.</p>
        <p>They will invert your controls.</p>
        <p>They will corrupt the interface itself.</p>
        <br>
        <p><strong>Survive 20 rounds to win.</strong></p>
        <p>Or find another way...</p>
        <br>
        <button class="start-boss-btn">BEGIN THE FINAL BATTLE</button>
      </div>
    `;
    
    document.body.appendChild(message);
    
    // Add event listener
    message.querySelector('.start-boss-btn').addEventListener('click', () => {
      document.body.removeChild(message);
      this.beginBossSequence();
    });
  }
  
  // Begin the boss sequence
  beginBossSequence() {
    // Intensify UI corruption
    document.body.classList.add('boss-corruption');
    
    // Start corruption effects
    this.startCorruptionEffects();
    
    // Begin first round
    this.startNextRound();
  }
  
  // Prepare boss sequence
  prepareBossSequence() {
    // Generate real sequence (what player should follow)
    this.bossData.realSequence = [];
    for (let i = 0; i < this.maxRounds; i++) {
      this.bossData.realSequence.push(Math.floor(Math.random() * 4));
    }
    
    // Generate corrupted sequence (with fake flashes)
    this.bossData.corruptedSequence = [...this.bossData.realSequence];
    
    // Add fake flashes every 3rd round
    for (let i = 2; i < this.maxRounds; i += 3) {
      const fakeIdx = Math.floor(Math.random() * 4);
      this.bossData.corruptedSequence[i] = fakeIdx;
    }
  }
  
  // Start next round
  startNextRound() {
    if (this.currentRound >= this.maxRounds) {
      this.victoryPaths.sequence = true;
      this.endBossFight('sequence');
      return;
    }
    
    this.currentRound++;
    this.updateCorruptionLevel();
    
    // Show round notification
    this.showRoundNotification();
    
    // Play corrupted sequence
    this.playCorruptedSequence();
  }
  
  // Update corruption level
  updateCorruptionLevel() {
    this.corruptionLevel = Math.min(1.0, this.currentRound / this.maxRounds);
    
    // Apply corruption effects
    if (this.corruptionLevel > 0.3) {
      this.bossData.uiCorruption = true;
    }
    if (this.corruptionLevel > 0.6) {
      this.bossData.invertedControls = true;
    }
  }
  
  // Show round notification
  showRoundNotification() {
    const notification = document.createElement('div');
    notification.className = 'boss-round-notification';
    notification.innerHTML = `
      <div class="boss-round-content">
        <h3>ROUND ${this.currentRound}/${this.maxRounds}</h3>
        <p>Corruption Level: ${Math.round(this.corruptionLevel * 100)}%</p>
        ${this.bossData.invertedControls ? '<p>⚠️ Controls Inverted!</p>' : ''}
        ${this.bossData.uiCorruption ? '<p>⚠️ UI Corrupted!</p>' : ''}
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  }
  
  // Play corrupted sequence
  async playCorruptedSequence() {
    const sequence = this.bossData.corruptedSequence.slice(0, this.currentRound);
    let delay = 600 - (this.corruptionLevel * 200); // Faster as corruption increases
    
    await new Promise(r => setTimeout(r, delay));
    
    for (let i = 0; i < sequence.length; i++) {
      const idx = sequence[i];
      const isReal = this.bossData.realSequence[i] === idx;
      
      if (isReal) {
        // Real flash
        this.flashPad(idx, false);
      } else {
        // Fake flash
        this.flashPad(idx, true);
      }
      
      await new Promise(r => setTimeout(r, delay));
    }
    
    // Start input phase
    this.startInputPhase();
  }
  
  // Flash pad (real or fake)
  flashPad(idx, isFake) {
    const pad = document.querySelector(`[data-index="${idx}"]`);
    if (!pad) return;
    
    if (isFake) {
      pad.classList.add('boss-fake-flash');
      setTimeout(() => pad.classList.remove('boss-fake-flash'), 200);
    } else {
      pad.classList.add('playback');
      setTimeout(() => pad.classList.remove('playback'), 200);
    }
    
    // Play audio
    if (typeof pulsePad === 'function') {
      pulsePad(idx);
    }
  }
  
  // Start input phase
  startInputPhase() {
    // Enable input handling
    this.inputPhase = true;
    this.inputIndex = 0;
    this.inputSequence = this.bossData.realSequence.slice(0, this.currentRound);
    
    // Start refusal timer
    this.startRefusalTimer();
  }
  
  // Start refusal timer
  startRefusalTimer() {
    this.refusalTimer = setTimeout(() => {
      if (this.inputPhase) {
        this.victoryPaths.refusal = true;
        this.endBossFight('refusal');
      }
    }, 10000); // 10 seconds
  }
  
  // Handle boss input
  handleBossInput(idx) {
    if (!this.inputPhase) return;
    
    // Check for override sequence (all buttons pressed)
    this.checkOverrideSequence(idx);
    
    // Handle inverted controls
    const actualIdx = this.bossData.invertedControls ? (3 - idx) : idx;
    
    // Check input
    const expected = this.inputSequence[this.inputIndex];
    if (actualIdx === expected) {
      this.inputIndex++;
      
      if (this.inputIndex >= this.inputSequence.length) {
        // Round completed
        this.completeRound();
      }
    } else {
      // Wrong input
      this.failRound();
    }
  }
  
  // Check override sequence
  checkOverrideSequence(idx) {
    const now = Date.now();
    
    // Reset if too much time passed
    if (now - this.bossData.lastOverrideTime > 1000) {
      this.bossData.overrideCount = 0;
    }
    
    this.bossData.lastOverrideTime = now;
    this.bossData.overrideCount++;
    
    // Check if all 4 buttons pressed 3 times
    if (this.bossData.overrideCount >= 12) { // 4 buttons * 3 times
      this.victoryPaths.override = true;
      this.endBossFight('override');
    }
  }
  
  // Complete round
  completeRound() {
    this.inputPhase = false;
    clearTimeout(this.refusalTimer);
    
    // Show success message
    this.showBossMessage('Round completed! The corruption weakens...');
    
    // Start next round
    setTimeout(() => {
      this.startNextRound();
    }, 1500);
  }
  
  // Fail round
  failRound() {
    this.inputPhase = false;
    clearTimeout(this.refusalTimer);
    
    // Show failure message
    this.showBossMessage('The corruption grows stronger...');
    
    // Restart round
    setTimeout(() => {
      this.startNextRound();
    }, 1500);
  }
  
  // End boss fight
  endBossFight(victoryType) {
    this.isActive = false;
    this.inputPhase = false;
    clearTimeout(this.refusalTimer);
    
    // Clean up corruption
    document.body.classList.remove('boss-corruption');
    
    // Show victory message
    this.showVictoryMessage(victoryType);
    
    // Complete boss fight
    if (typeof completeBossFight === 'function') {
      completeBossFight();
    }
  }
  
  // Show victory message
  showVictoryMessage(victoryType) {
    const message = document.createElement('div');
    message.className = 'boss-victory';
    
    let title, description;
    
    switch (victoryType) {
      case 'sequence':
        title = '🎉 SEQUENCE VICTORY';
        description = 'You completed the corrupted sequence! The patterns are broken.';
        break;
      case 'refusal':
        title = '🛡️ REFUSAL VICTORY';
        description = 'You refused to play the game. The corruption cannot control you.';
        break;
      case 'override':
        title = '⚡ OVERRIDE VICTORY';
        description = 'You broke the rules. The system is overridden.';
        break;
    }
    
    message.innerHTML = `
      <div class="boss-victory-content">
        <h2>${title}</h2>
        <p>${description}</p>
        <p>The corrupted Simon has been defeated.</p>
        <p>Liberation Mode unlocked!</p>
        <br>
        <button class="continue-btn">Continue</button>
      </div>
    `;
    
    document.body.appendChild(message);
    
    // Add event listener
    message.querySelector('.continue-btn').addEventListener('click', () => {
      document.body.removeChild(message);
    });
  }
  
  // Show boss message
  showBossMessage(text) {
    const message = document.createElement('div');
    message.className = 'boss-message';
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 0, 0, 0.9);
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      z-index: 2000;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    `;
    message.textContent = text;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
      message.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(message);
      }, 300);
    }, 2000);
  }
  
  // Start corruption effects
  startCorruptionEffects() {
    // Intensify UI glitches
    document.body.classList.add('boss-corruption');
    
    // Random color shifts
    setInterval(() => {
      if (this.isActive) {
        const hue = Math.random() * 360;
        document.documentElement.style.setProperty('--accent', `hsl(${hue}, 70%, 60%)`);
        setTimeout(() => {
          document.documentElement.style.setProperty('--accent', '#65c3ff');
        }, 500);
      }
    }, 2000);
    
    // Button position shifts
    setInterval(() => {
      if (this.isActive && this.bossData.uiCorruption) {
        const pads = document.querySelectorAll('.pad');
        pads.forEach(pad => {
          if (Math.random() < 0.3) {
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 20;
            pad.style.transform = `translate(${x}px, ${y}px)`;
            setTimeout(() => {
              pad.style.transform = '';
            }, 1000);
          }
        });
      }
    }, 1500);
  }
  
  // Reset victory paths
  resetVictoryPaths() {
    this.victoryPaths = {
      sequence: false,
      refusal: false,
      override: false
    };
  }
  
  // Reset boss data
  resetBossData() {
    this.bossData = {
      fakeFlashCount: 0,
      realSequence: [],
      corruptedSequence: [],
      uiCorruption: false,
      invertedControls: false,
      lastOverrideTime: 0,
      overrideCount: 0
    };
  }
  
  // Check if boss fight is active
  isBossFightActive() {
    return this.isActive;
  }
  
  // Get boss fight progress
  getBossProgress() {
    return {
      round: this.currentRound,
      maxRounds: this.maxRounds,
      corruptionLevel: this.corruptionLevel,
      victoryPaths: this.victoryPaths
    };
  }
}

// Global boss fight system instance
const bossFightSystem = new BossFightSystem();

// Helper functions for main.js integration
function startBossFight() {
  return bossFightSystem.startBossFight();
}

function handleBossInput(idx) {
  return bossFightSystem.handleBossInput(idx);
}

function isBossFightActive() {
  return bossFightSystem.isBossFightActive();
}

function getBossProgress() {
  return bossFightSystem.getBossProgress();
}

// Add CSS for boss fight effects
const bossFightStyle = document.createElement('style');
bossFightStyle.textContent = `
  .boss-fight-start, .boss-victory {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .boss-start-content, .boss-victory-content {
    background: var(--panel);
    border: 2px solid #ff4444;
    border-radius: 12px;
    padding: 30px;
    max-width: 500px;
    text-align: center;
  }
  
  .boss-start-content h2, .boss-victory-content h2 {
    margin: 0 0 16px 0;
    color: #ff4444;
    font-size: 24px;
  }
  
  .boss-start-content h3, .boss-victory-content h3 {
    margin: 0 0 16px 0;
    color: var(--text);
    font-size: 18px;
  }
  
  .boss-start-content p, .boss-victory-content p {
    margin: 8px 0;
    font-size: 14px;
    line-height: 1.4;
  }
  
  .start-boss-btn, .continue-btn {
    background: #ff4444;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 20px;
  }
  
  .boss-round-notification {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 68, 68, 0.9);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  
  .boss-round-notification.show {
    opacity: 1;
  }
  
  .boss-round-content h3 {
    margin: 0 0 4px 0;
    font-size: 16px;
  }
  
  .boss-round-content p {
    margin: 2px 0;
    font-size: 12px;
  }
  
  .boss-corruption {
    filter: contrast(1.3) brightness(1.2) saturate(1.5);
    animation: bossCorruption 0.1s linear infinite;
  }
  
  @keyframes bossCorruption {
    0% { filter: contrast(1.3) brightness(1.2) saturate(1.5); }
    25% { filter: contrast(1.1) brightness(0.8) saturate(0.8); }
    50% { filter: contrast(1.5) brightness(1.5) saturate(2.0); }
    75% { filter: contrast(0.9) brightness(0.9) saturate(0.9); }
    100% { filter: contrast(1.3) brightness(1.2) saturate(1.5); }
  }
  
  .pad.boss-fake-flash {
    background: #ff4444 !important;
    box-shadow: 0 0 30px #ff4444 !important;
    animation: bossFakeFlash 0.2s ease-in-out;
  }
  
  @keyframes bossFakeFlash {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.1); }
    100% { opacity: 1; transform: scale(1); }
  }
`;
document.head.appendChild(bossFightStyle);
