/*
  NOOOMIS Meta Arc System
  Fourth-wall breaking narrative progression
*/

class MetaArcSystem {
  constructor() {
    this.phases = {
      1: { name: 'Subtle Oddities', sessions: [1, 2, 3], active: false },
      2: { name: 'Escalation', sessions: [4, 5, 6, 7], active: false },
      3: { name: 'Direct Confrontation', sessions: [8, 9, 10, 11, 12], active: false },
      4: { name: 'The Reveal', sessions: [13, 14, 15], active: false },
      5: { name: 'Resolution', sessions: [16], active: false }
    };
    
    this.currentPhase = 0;
    this.sessionCount = 0;
    this.arcData = {
      buttonMissCounts: [0, 0, 0, 0], // Track misses per button
      glitchIntensity: 0,
      corruptionLevel: 0,
      bossFightCompleted: false,
      liberationModeUnlocked: false,
      lastGlitchTime: 0,
      uiCorruption: false,
      hostileMessages: false,
      impossibleSequences: false
    };
    
    this.loadArcData();
  }
  
  // Load arc data from save system
  loadArcData() {
    if (typeof saveData !== 'undefined') {
      this.sessionCount = saveData.sessionCount || 0;
      this.currentPhase = saveData.corruptionPhase || 0;
      this.arcData.bossFightCompleted = saveData.bossFightCompleted || false;
      this.arcData.liberationModeUnlocked = saveData.liberationModeUnlocked || false;
      this.arcData.buttonMissCounts = saveData.buttonMissCounts || [0, 0, 0, 0];
    }
  }
  
  // Save arc data
  saveArcData() {
    if (typeof saveData !== 'undefined') {
      saveData.corruptionPhase = this.currentPhase;
      saveData.bossFightCompleted = this.arcData.bossFightCompleted;
      saveData.liberationModeUnlocked = this.arcData.liberationModeUnlocked;
      saveData.buttonMissCounts = this.arcData.buttonMissCounts;
      if (typeof saveGameData === 'function') {
        saveGameData();
      }
    }
  }
  
  // Increment session and check for phase transitions
  incrementSession() {
    this.sessionCount++;
    
    // Update save data
    if (typeof incrementSession === 'function') {
      incrementSession();
    }
    
    // Check for phase transitions
    this.checkPhaseTransition();
    
    // Trigger phase-specific events
    this.triggerPhaseEvents();
  }
  
  // Check if we should transition to a new phase
  checkPhaseTransition() {
    for (const [phaseNum, phase] of Object.entries(this.phases)) {
      if (phase.sessions.includes(this.sessionCount)) {
        if (this.currentPhase < parseInt(phaseNum)) {
          this.currentPhase = parseInt(phaseNum);
          this.activatePhase(phaseNum);
        }
      }
    }
  }
  
  // Activate a new phase
  activatePhase(phaseNum) {
    this.phases[phaseNum].active = true;
    this.saveArcData();
    
    // Show phase transition notification
    this.showPhaseNotification(phaseNum);
    
    // Apply phase-specific effects
    this.applyPhaseEffects(phaseNum);
  }
  
  // Show phase transition notification
  showPhaseNotification(phaseNum) {
    const phase = this.phases[phaseNum];
    const notification = document.createElement('div');
    notification.className = 'phase-notification';
    notification.innerHTML = `
      <div class="phase-content">
        <h3>🌀 Phase ${phaseNum}: ${phase.name}</h3>
        <p>Something feels different...</p>
        <p>Session ${this.sessionCount}</p>
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
    }, 3000);
  }
  
  // Apply phase-specific effects
  applyPhaseEffects(phaseNum) {
    switch (phaseNum) {
      case 1:
        this.enablePhase1Effects();
        break;
      case 2:
        this.enablePhase2Effects();
        break;
      case 3:
        this.enablePhase3Effects();
        break;
      case 4:
        this.enablePhase4Effects();
        break;
      case 5:
        this.enablePhase5Effects();
        break;
    }
  }
  
  // Phase 1: Subtle Oddities (Sessions 1-3)
  enablePhase1Effects() {
    // Random single-frame flashes
    this.startRandomFlashes();
    
    // Pre-fill player name
    this.prefillPlayerName();
    
    // Add whisper audio layer
    this.addWhisperAudio();
  }
  
  // Phase 2: Escalation (Sessions 4-7)
  enablePhase2Effects() {
    // Menu elements shift positions
    this.startMenuShifting();
    
    // Settings overlay issues
    this.corruptSettingsOverlay();
    
    // Personalized messages
    this.enablePersonalizedMessages();
    
    // Chaos mode corruption
    this.corruptChaosMode();
  }
  
  // Phase 3: Direct Confrontation (Sessions 8-12)
  enablePhase3Effects() {
    // Hostile game over messages
    this.arcData.hostileMessages = true;
    
    // Impossible sequences
    this.arcData.impossibleSequences = true;
    
    // UI glitches
    this.startUIGlitches();
    
    // Hidden override mechanic
    this.enableOverrideMechanic();
  }
  
  // Phase 4: The Reveal (Sessions 13-15)
  enablePhase4Effects() {
    // Intensify all previous effects
    this.arcData.glitchIntensity = 1.0;
    this.arcData.corruptionLevel = 1.0;
    
    // Prepare for boss fight
    this.prepareBossFight();
  }
  
  // Phase 5: Resolution (Session 16+)
  enablePhase5Effects() {
    // Unlock Liberation Mode
    this.arcData.liberationModeUnlocked = true;
    
    // Clean up corruption
    this.cleanupCorruption();
    
    // Show resolution message
    this.showResolutionMessage();
  }
  
  // Phase 1 Effects
  startRandomFlashes() {
    if (this.currentPhase !== 1) return;
    
    // 10% chance of random flash before sequence
    const originalPlaySequence = window.playSequence;
    window.playSequence = async function() {
      if (Math.random() < 0.1) {
        const randomPad = Math.floor(Math.random() * 4);
        const pad = document.querySelector(`[data-index="${randomPad}"]`);
        if (pad) {
          pad.classList.add('playback');
          setTimeout(() => pad.classList.remove('playback'), 16);
        }
      }
      return originalPlaySequence.call(this);
    };
  }
  
  prefillPlayerName() {
    if (this.currentPhase !== 1) return;
    
    // Pre-fill player name from localStorage or device
    const nameInput = document.getElementById('playerName');
    if (nameInput && !nameInput.value) {
      const savedName = localStorage.getItem('playerName') || 'Player';
      nameInput.value = savedName;
    }
  }
  
  addWhisperAudio() {
    if (this.currentPhase !== 1) return;
    
    // Add subtle whisper layer during sequences
    const originalPulsePad = window.pulsePad;
    window.pulsePad = function(index, isInput = false) {
      if (!isInput && Math.random() < 0.3) {
        // Add whisper tone
        const whisperFreq = [220, 330, 440, 550][index] * 0.5;
        const whisperOsc = audioCtx.createOscillator();
        const whisperGain = audioCtx.createGain();
        whisperOsc.connect(whisperGain);
        whisperGain.connect(audioCtx.destination);
        whisperOsc.frequency.value = whisperFreq;
        whisperGain.gain.value = 0.05; // Very quiet
        whisperOsc.start();
        setTimeout(() => whisperOsc.stop(), 100);
      }
      return originalPulsePad.call(this, index, isInput);
    };
  }
  
  // Phase 2 Effects
  startMenuShifting() {
    if (this.currentPhase !== 2) return;
    
    // Randomly shift menu elements
    setInterval(() => {
      if (Math.random() < 0.1) {
        const elements = document.querySelectorAll('.speaker .controls button, .speaker .controls select');
        elements.forEach(el => {
          if (Math.random() < 0.3) {
            el.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
            setTimeout(() => el.style.transform = '', 1000);
          }
        });
      }
    }, 5000);
  }
  
  corruptSettingsOverlay() {
    if (this.currentPhase !== 2) return;
    
    // Settings overlay requires double-click to close
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
      let clickCount = 0;
      settingsBtn.addEventListener('click', (e) => {
        clickCount++;
        if (clickCount === 1) {
          setTimeout(() => clickCount = 0, 500);
        } else if (clickCount === 2) {
          // Normal behavior
          clickCount = 0;
        }
      });
    }
  }
  
  enablePersonalizedMessages() {
    if (this.currentPhase !== 2) return;
    
    // Track button misses and show personalized messages
    this.arcData.personalizedMessages = true;
  }
  
  corruptChaosMode() {
    if (this.currentPhase !== 2) return;
    
    // Chaos mode becomes "Corruption Mode" with fake flashes
    this.arcData.corruptionMode = true;
  }
  
  // Phase 3 Effects
  startUIGlitches() {
    if (this.currentPhase !== 3) return;
    
    // Apply CSS glitch effects
    document.body.classList.add('ui-glitch');
    
    // Random text scrambling
    setInterval(() => {
      if (Math.random() < 0.2) {
        const elements = document.querySelectorAll('h1, h2, h3, p');
        elements.forEach(el => {
          if (Math.random() < 0.1) {
            const originalText = el.textContent;
            el.textContent = originalText.split('').map(c => 
              Math.random() < 0.1 ? String.fromCharCode(33 + Math.random() * 94) : c
            ).join('');
            setTimeout(() => el.textContent = originalText, 500);
          }
        });
      }
    }, 3000);
  }
  
  enableOverrideMechanic() {
    if (this.currentPhase !== 3) return;
    
    // Hidden mechanic: pressing all 4 buttons simultaneously
    let allButtonsPressed = false;
    let buttonStates = [false, false, false, false];
    
    const originalHandlePadPress = window.handlePadPress;
    window.handlePadPress = function(idx) {
      buttonStates[idx] = true;
      
      // Check if all buttons are pressed
      if (buttonStates.every(state => state)) {
        allButtonsPressed = true;
        setTimeout(() => {
          allButtonsPressed = false;
          buttonStates = [false, false, false, false];
        }, 1000);
      }
      
      // Override impossible sequences
      if (allButtonsPressed && window.sequence && window.sequence.length > 4) {
        // Skip corrupted sequence
        window.sequence = window.sequence.slice(0, 4);
        showMetaMessage('Override sequence detected...');
      }
      
      return originalHandlePadPress.call(this, idx);
    };
  }
  
  // Phase 4 Effects
  prepareBossFight() {
    if (this.currentPhase !== 4) return;
    
    // Intensify all effects
    this.arcData.glitchIntensity = 1.0;
    this.arcData.corruptionLevel = 1.0;
    
    // Show boss fight preparation message
    this.showBossFightMessage();
  }
  
  showBossFightMessage() {
    const message = document.createElement('div');
    message.className = 'boss-fight-message';
    message.innerHTML = `
      <div class="boss-content">
        <h3>👹 THE FINAL CONFRONTATION</h3>
        <p>The corruption has reached its peak.</p>
        <p>You must face the corrupted Simon...</p>
        <p>Press Start to begin the boss fight.</p>
      </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      message.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(message);
      }, 300);
    }, 5000);
  }
  
  // Phase 5 Effects
  cleanupCorruption() {
    // Remove all corruption effects
    document.body.classList.remove('ui-glitch');
    this.arcData.glitchIntensity = 0;
    this.arcData.corruptionLevel = 0;
    this.arcData.uiCorruption = false;
    this.arcData.hostileMessages = false;
    this.arcData.impossibleSequences = false;
  }
  
  showResolutionMessage() {
    const message = document.createElement('div');
    message.className = 'resolution-message';
    message.innerHTML = `
      <div class="resolution-content">
        <h3>🎉 LIBERATION ACHIEVED</h3>
        <p>You have broken free from the corruption.</p>
        <p>Liberation Mode unlocked!</p>
        <p>The game is now truly yours.</p>
      </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      message.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(message);
      }, 300);
    }, 5000);
  }
  
  // Trigger phase-specific events
  triggerPhaseEvents() {
    if (this.currentPhase === 0) return;
    
    // Random phase events
    if (Math.random() < 0.3) {
      this.triggerRandomEvent();
    }
  }
  
  // Trigger random phase event
  triggerRandomEvent() {
    const events = [
      () => this.showMetaMessage('Did you notice that?'),
      () => this.showMetaMessage('Something is watching...'),
      () => this.showMetaMessage('The patterns are changing...'),
      () => this.showMetaMessage('You\'re getting better at this.'),
      () => this.showMetaMessage('But are you ready for what comes next?')
    ];
    
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    randomEvent();
  }
  
  // Show meta message
  showMetaMessage(text) {
    const message = document.createElement('div');
    message.className = 'meta-message';
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: #65c3ff;
      padding: 16px 24px;
      border-radius: 8px;
      font-size: 14px;
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
  
  // Record button miss for personalized messages
  recordButtonMiss(buttonIndex) {
    if (this.arcData.personalizedMessages) {
      this.arcData.buttonMissCounts[buttonIndex]++;
      
      // Show personalized message after 3 misses of the same button
      if (this.arcData.buttonMissCounts[buttonIndex] >= 3) {
        const buttonNames = ['green', 'red', 'blue', 'yellow'];
        this.showMetaMessage(`You always miss ${buttonNames[buttonIndex]}...`);
        this.arcData.buttonMissCounts[buttonIndex] = 0; // Reset counter
      }
    }
  }
  
  // Get current phase info
  getCurrentPhase() {
    return {
      phase: this.currentPhase,
      session: this.sessionCount,
      name: this.phases[this.currentPhase]?.name || 'Normal',
      active: this.phases[this.currentPhase]?.active || false
    };
  }
  
  // Check if boss fight should trigger
  shouldTriggerBossFight() {
    return this.currentPhase >= 4 && !this.arcData.bossFightCompleted;
  }
  
  // Complete boss fight
  completeBossFight() {
    this.arcData.bossFightCompleted = true;
    this.currentPhase = 5;
    this.saveArcData();
    this.enablePhase5Effects();
  }
  
  // Check if Liberation Mode is available
  isLiberationModeAvailable() {
    return this.arcData.liberationModeUnlocked;
  }
}

// Global meta arc system instance
const metaArcSystem = new MetaArcSystem();

// Helper functions for main.js integration
function incrementMetaArcSession() {
  metaArcSystem.incrementSession();
}

function recordMetaArcButtonMiss(buttonIndex) {
  metaArcSystem.recordButtonMiss(buttonIndex);
}

function getMetaArcPhase() {
  return metaArcSystem.getCurrentPhase();
}

function shouldTriggerBossFight() {
  return metaArcSystem.shouldTriggerBossFight();
}

function completeBossFight() {
  metaArcSystem.completeBossFight();
}

function isLiberationModeAvailable() {
  return metaArcSystem.isLiberationModeAvailable();
}

// Add CSS for meta arc effects
const metaArcStyle = document.createElement('style');
metaArcStyle.textContent = `
  .phase-notification, .boss-fight-message, .resolution-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    background: var(--panel);
    border: 2px solid var(--accent);
    border-radius: 12px;
    padding: 20px;
    max-width: 400px;
    z-index: 1000;
    opacity: 0;
    transition: all 0.3s ease-in-out;
  }
  
  .phase-notification.show, .boss-fight-message.show, .resolution-message.show {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  
  .phase-content h3, .boss-content h3, .resolution-content h3 {
    margin: 0 0 8px 0;
    color: var(--accent);
    font-size: 18px;
    text-align: center;
  }
  
  .phase-content p, .boss-content p, .resolution-content p {
    margin: 4px 0;
    font-size: 14px;
    text-align: center;
  }
  
  .ui-glitch {
    filter: contrast(1.2) brightness(1.1) saturate(1.3);
  }
  
  .ui-glitch::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(101, 195, 255, 0.03) 2px,
      rgba(101, 195, 255, 0.03) 4px
    );
    pointer-events: none;
    z-index: 1000;
    animation: glitchScan 0.1s linear infinite;
  }
  
  @keyframes glitchScan {
    0% { transform: translateY(0); }
    100% { transform: translateY(4px); }
  }
`;
document.head.appendChild(metaArcStyle);
