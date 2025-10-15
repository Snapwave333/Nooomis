/*
  NOOOMIS Daily Challenges System
  Unique modifiers and daily progression
*/

class DailyChallengeSystem {
  constructor() {
    this.challenges = {
      // Challenge templates
      templates: [
        {
          id: 'speed_demon',
          name: 'Speed Demon',
          description: 'Complete 15 rounds in Speed mode with 1.5x speed modifier',
          modifiers: ['speed_1.5x'],
          targetScore: 15,
          reward: { shards: 15, unlock: null },
          difficulty: 'medium'
        },
        {
          id: 'chaos_master',
          name: 'Chaos Master',
          description: 'Survive 20 rounds with chaos layout and inverted controls',
          modifiers: ['chaos_layout', 'inverted_controls'],
          targetScore: 20,
          reward: { shards: 20, unlock: 'lore_fragment_chaos' },
          difficulty: 'hard'
        },
        {
          id: 'echo_champion',
          name: 'Echo Champion',
          description: 'Complete 12 rounds in Echo mode with reduced timing',
          modifiers: ['echo_mode', 'timing_0.8x'],
          targetScore: 12,
          reward: { shards: 18, unlock: 'audio_echo' },
          difficulty: 'hard'
        },
        {
          id: 'mirror_master',
          name: 'Mirror Master',
          description: 'Complete 10 rounds in Mirror mode with fake flashes',
          modifiers: ['mirror_mode', 'fake_flashes'],
          targetScore: 10,
          reward: { shards: 16, unlock: 'theme_mirror' },
          difficulty: 'medium'
        },
        {
          id: 'survival_expert',
          name: 'Survival Expert',
          description: 'Survive 25 rounds with all modifiers active',
          modifiers: ['speed_1.2x', 'chaos_layout', 'fake_flashes', 'inverted_controls'],
          targetScore: 25,
          reward: { shards: 25, unlock: 'mode_nightmare' },
          difficulty: 'expert'
        },
        {
          id: 'perfect_streak',
          name: 'Perfect Streak',
          description: 'Complete 8 rounds without any mistakes',
          modifiers: ['perfect_mode'],
          targetScore: 8,
          reward: { shards: 12, unlock: null },
          difficulty: 'medium'
        },
        {
          id: 'boss_slayer',
          name: 'Boss Slayer',
          description: 'Defeat 3 boss rounds with enhanced difficulty',
          modifiers: ['boss_mode', 'enhanced_difficulty'],
          targetScore: 3,
          reward: { shards: 22, unlock: 'lore_fragment_boss' },
          difficulty: 'hard'
        },
        {
          id: 'zen_master',
          name: 'Zen Master',
          description: 'Complete 30 rounds in Zen mode with meditation timing',
          modifiers: ['zen_mode', 'meditation_timing'],
          targetScore: 30,
          reward: { shards: 20, unlock: 'theme_zen' },
          difficulty: 'medium'
        }
      ],
      
      // Weekly challenge templates
      weekly: [
        {
          id: 'weekend_warrior',
          name: 'Weekend Warrior',
          description: 'Complete all daily challenges in a week',
          requirements: ['complete_7_dailies'],
          reward: { shards: 50, unlock: 'theme_weekend' },
          difficulty: 'expert'
        },
        {
          id: 'mode_master',
          name: 'Mode Master',
          description: 'Complete a challenge in each game mode',
          requirements: ['classic', 'speed', 'zen', 'chaos', 'mirror', 'echo', 'survival', 'boss'],
          reward: { shards: 75, unlock: 'mode_prestige' },
          difficulty: 'expert'
        }
      ]
    };
    
    this.currentChallenge = null;
    this.challengeProgress = 0;
    this.challengeModifiers = [];
  }
  
  // Generate daily challenge based on date seed
  generateDailyChallenge() {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Use seed to select challenge template
    const templateIndex = seed % this.challenges.templates.length;
    const template = this.challenges.templates[templateIndex];
    
    // Check if challenge was already completed today
    const lastReset = localStorage.getItem('challengeLastReset');
    const todayStr = today.toDateString();
    
    if (lastReset === todayStr) {
      // Load existing challenge
      const savedChallenge = localStorage.getItem('dailyChallenge');
      if (savedChallenge) {
        this.currentChallenge = JSON.parse(savedChallenge);
        this.challengeProgress = parseInt(localStorage.getItem('challengeProgress') || '0');
        return this.currentChallenge;
      }
    }
    
    // Generate new challenge
    this.currentChallenge = {
      ...template,
      date: todayStr,
      seed: seed,
      modifiers: [...template.modifiers],
      reward: { ...template.reward }
    };
    
    // Save challenge
    localStorage.setItem('dailyChallenge', JSON.stringify(this.currentChallenge));
    localStorage.setItem('challengeLastReset', todayStr);
    localStorage.setItem('challengeProgress', '0');
    
    this.challengeProgress = 0;
    return this.currentChallenge;
  }
  
  // Apply challenge modifiers to game
  applyModifiers() {
    if (!this.currentChallenge) return;
    
    this.challengeModifiers = [];
    
    this.currentChallenge.modifiers.forEach(modifier => {
      switch (modifier) {
        case 'speed_1.5x':
          this.challengeModifiers.push({
            type: 'speed',
            multiplier: 1.5,
            description: 'Speed +50%'
          });
          break;
        case 'speed_1.2x':
          this.challengeModifiers.push({
            type: 'speed',
            multiplier: 1.2,
            description: 'Speed +20%'
          });
          break;
        case 'chaos_layout':
          this.challengeModifiers.push({
            type: 'chaos',
            enabled: true,
            description: 'Chaos Layout'
          });
          break;
        case 'inverted_controls':
          this.challengeModifiers.push({
            type: 'inverted',
            enabled: true,
            description: 'Inverted Controls'
          });
          break;
        case 'fake_flashes':
          this.challengeModifiers.push({
            type: 'fake_flashes',
            enabled: true,
            description: 'Fake Flashes'
          });
          break;
        case 'echo_mode':
          this.challengeModifiers.push({
            type: 'echo',
            enabled: true,
            description: 'Echo Mode'
          });
          break;
        case 'mirror_mode':
          this.challengeModifiers.push({
            type: 'mirror',
            enabled: true,
            description: 'Mirror Mode'
          });
          break;
        case 'zen_mode':
          this.challengeModifiers.push({
            type: 'zen',
            enabled: true,
            description: 'Zen Mode'
          });
          break;
        case 'boss_mode':
          this.challengeModifiers.push({
            type: 'boss',
            enabled: true,
            description: 'Boss Mode'
          });
          break;
        case 'timing_0.8x':
          this.challengeModifiers.push({
            type: 'timing',
            multiplier: 0.8,
            description: 'Timing -20%'
          });
          break;
        case 'meditation_timing':
          this.challengeModifiers.push({
            type: 'timing',
            multiplier: 1.3,
            description: 'Meditation Timing'
          });
          break;
        case 'enhanced_difficulty':
          this.challengeModifiers.push({
            type: 'difficulty',
            multiplier: 1.5,
            description: 'Enhanced Difficulty'
          });
          break;
        case 'perfect_mode':
          this.challengeModifiers.push({
            type: 'perfect',
            enabled: true,
            description: 'Perfect Mode (1 life)'
          });
          break;
      }
    });
    
    return this.challengeModifiers;
  }
  
  // Update challenge progress
  updateProgress(score, gameData = {}) {
    if (!this.currentChallenge) return false;
    
    this.challengeProgress = Math.max(this.challengeProgress, score);
    localStorage.setItem('challengeProgress', this.challengeProgress.toString());
    
    // Check if challenge is completed
    if (this.challengeProgress >= this.currentChallenge.targetScore) {
      this.completeChallenge();
      return true;
    }
    
    return false;
  }
  
  // Complete the current challenge
  completeChallenge() {
    if (!this.currentChallenge) return;
    
    // Award shards
    if (this.currentChallenge.reward.shards > 0) {
      if (typeof addMemoryShards === 'function') {
        addMemoryShards(this.currentChallenge.reward.shards);
      }
    }
    
    // Unlock content
    if (this.currentChallenge.reward.unlock) {
      if (typeof unlockContent === 'function') {
        unlockContent(this.currentChallenge.reward.unlock);
      }
    }
    
    // Mark as completed
    const completedChallenges = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
    completedChallenges.push({
      id: this.currentChallenge.id,
      date: this.currentChallenge.date,
      score: this.challengeProgress
    });
    localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
    
    // Show completion notification
    this.showCompletionNotification();
    
    // Clear current challenge
    this.currentChallenge = null;
    localStorage.removeItem('dailyChallenge');
  }
  
  // Show challenge completion notification
  showCompletionNotification() {
    const notification = document.createElement('div');
    notification.className = 'challenge-completion-notification';
    notification.innerHTML = `
      <div class="challenge-completion-content">
        <h3>🎉 Challenge Complete!</h3>
        <p>${this.currentChallenge?.name || 'Daily Challenge'}</p>
        <p>Score: ${this.challengeProgress}</p>
        <p>+${this.currentChallenge?.reward.shards || 0} Memory Shards</p>
        ${this.currentChallenge?.reward.unlock ? `<p class="unlock">Unlocked: ${this.getUnlockName(this.currentChallenge.reward.unlock)}</p>` : ''}
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
    }, 4000);
  }
  
  // Get unlock name for display
  getUnlockName(unlockId) {
    const unlockNames = {
      'lore_fragment_chaos': 'Chaos Lore Fragment',
      'audio_echo': 'Echo Audio Pack',
      'theme_mirror': 'Mirror Theme',
      'mode_nightmare': 'Nightmare Mode',
      'lore_fragment_boss': 'Boss Lore Fragment',
      'theme_zen': 'Zen Theme',
      'theme_weekend': 'Weekend Theme',
      'mode_prestige': 'Prestige Mode'
    };
    
    return unlockNames[unlockId] || unlockId;
  }
  
  // Check if challenge is active
  isChallengeActive() {
    return this.currentChallenge !== null;
  }
  
  // Get challenge progress percentage
  getProgressPercentage() {
    if (!this.currentChallenge) return 0;
    return Math.min(100, (this.challengeProgress / this.currentChallenge.targetScore) * 100);
  }
  
  // Get challenge streak
  getChallengeStreak() {
    const completedChallenges = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toDateString();
      
      if (completedChallenges.some(c => c.date === dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  }
}

// Global challenge system instance
const challengeSystem = new DailyChallengeSystem();

// Helper functions for main.js integration
function startDailyChallenge() {
  const challenge = challengeSystem.generateDailyChallenge();
  const modifiers = challengeSystem.applyModifiers();
  
  // Show challenge notification
  showChallengeNotification(challenge);
  
  return { challenge, modifiers };
}

function showChallengeNotification(challenge) {
  const notification = document.createElement('div');
  notification.className = 'challenge-notification';
  notification.innerHTML = `
    <div class="challenge-content">
      <h3>📅 Daily Challenge</h3>
      <h4>${challenge.name}</h4>
      <p>${challenge.description}</p>
      <p>Target: ${challenge.targetScore} rounds</p>
      <p>Reward: ${challenge.reward.shards} Memory Shards</p>
      ${challenge.reward.unlock ? `<p class="unlock">Unlock: ${challengeSystem.getUnlockName(challenge.reward.unlock)}</p>` : ''}
      <div class="modifiers">
        ${challenge.modifiers.map(mod => `<span class="modifier">${mod}</span>`).join('')}
      </div>
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
  }, 5000);
}

function updateChallengeProgress(score, gameData = {}) {
  return challengeSystem.updateProgress(score, gameData);
}

function getChallengeModifiers() {
  return challengeSystem.challengeModifiers;
}

function isChallengeActive() {
  return challengeSystem.isChallengeActive();
}

function getChallengeProgress() {
  return {
    progress: challengeSystem.challengeProgress,
    target: challengeSystem.currentChallenge?.targetScore || 0,
    percentage: challengeSystem.getProgressPercentage()
  };
}
