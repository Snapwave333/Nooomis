/*
  NOOOMIS Progression System
  Memory Shards, unlocks, and progression tracking
*/

// Progression system
class ProgressionSystem {
  constructor() {
    this.milestones = {
      // Score milestones
      score: [
        { threshold: 10, shards: 5, unlock: null },
        { threshold: 25, shards: 10, unlock: 'theme_retro' },
        { threshold: 50, shards: 15, unlock: 'audio_synth' },
        { threshold: 100, shards: 25, unlock: 'mode_mirror' },
        { threshold: 200, shards: 40, unlock: 'mode_echo' }
      ],
      
      // Mode completion milestones
      modes: [
        { mode: 'classic', shards: 5, unlock: null },
        { mode: 'speed', shards: 8, unlock: null },
        { mode: 'zen', shards: 8, unlock: null },
        { mode: 'chaos', shards: 10, unlock: null },
        { mode: 'mirror', shards: 15, unlock: 'theme_vaporwave' },
        { mode: 'echo', shards: 15, unlock: 'audio_soft' },
        { mode: 'survival', shards: 20, unlock: 'mode_boss' },
        { mode: 'boss', shards: 30, unlock: 'theme_corrupted' }
      ],
      
      // Special achievements
      achievements: [
        { id: 'perfect_10', name: 'Perfect 10', description: 'Complete 10 rounds without any mistakes', shards: 10, unlock: 'lore_fragment_1' },
        { id: 'speed_demon', name: 'Speed Demon', description: 'Reach score 25 in Speed mode', shards: 15, unlock: 'lore_fragment_2' },
        { id: 'zen_master', name: 'Zen Master', description: 'Reach score 50 in Zen mode', shards: 15, unlock: 'lore_fragment_3' },
        { id: 'chaos_lord', name: 'Chaos Lord', description: 'Reach score 30 in Chaos mode', shards: 20, unlock: 'lore_fragment_4' },
        { id: 'mirror_master', name: 'Mirror Master', description: 'Reach score 20 in Mirror mode', shards: 25, unlock: 'lore_fragment_5' },
        { id: 'echo_champion', name: 'Echo Champion', description: 'Reach score 15 in Echo mode', shards: 25, unlock: 'lore_fragment_6' },
        { id: 'survival_expert', name: 'Survival Expert', description: 'Survive 20 rounds with modifiers', shards: 30, unlock: 'lore_fragment_7' },
        { id: 'boss_slayer', name: 'Boss Slayer', description: 'Complete 5 boss rounds', shards: 40, unlock: 'lore_fragment_8' }
      ]
    };
    
    this.unlockCosts = {
      themes: {
        'retro': 10,
        'vaporwave': 20,
        'corrupted': 50,
        'glitch': 15
      },
      audio: {
        'synth': 15,
        'soft': 15,
        'chiptune': 25
      },
      modes: {
        'mirror': 20,
        'echo': 20,
        'survival': 30,
        'boss': 30
      },
      lore: {
        'fragment_1': 5,
        'fragment_2': 5,
        'fragment_3': 5,
        'fragment_4': 5,
        'fragment_5': 5,
        'fragment_6': 5,
        'fragment_7': 5,
        'fragment_8': 5
      }
    };
  }
  
  checkScoreMilestone(score) {
    const milestone = this.milestones.score.find(m => m.threshold === score);
    if (milestone) {
      this.awardShards(milestone.shards);
      if (milestone.unlock) {
        this.unlockContent(milestone.unlock);
      }
      this.showMilestoneNotification(`Score ${score}!`, milestone.shards, milestone.unlock);
      return true;
    }
    return false;
  }
  
  checkModeCompletion(mode, score) {
    const milestone = this.milestones.modes.find(m => m.mode === mode);
    if (milestone && score >= 5) { // Minimum 5 rounds to count as completion
      this.awardShards(milestone.shards);
      if (milestone.unlock) {
        this.unlockContent(milestone.unlock);
      }
      this.showMilestoneNotification(`${mode.charAt(0).toUpperCase() + mode.slice(1)} Master!`, milestone.shards, milestone.unlock);
      return true;
    }
    return false;
  }
  
  checkAchievement(achievementId, gameData = {}) {
    const achievement = this.milestones.achievements.find(a => a.id === achievementId);
    if (!achievement) return false;
    
    let unlocked = false;
    
    switch (achievementId) {
      case 'perfect_10':
        unlocked = gameData.perfectRounds >= 10;
        break;
      case 'speed_demon':
        unlocked = gameData.mode === 'speed' && gameData.score >= 25;
        break;
      case 'zen_master':
        unlocked = gameData.mode === 'zen' && gameData.score >= 50;
        break;
      case 'chaos_lord':
        unlocked = gameData.mode === 'chaos' && gameData.score >= 30;
        break;
      case 'mirror_master':
        unlocked = gameData.mode === 'mirror' && gameData.score >= 20;
        break;
      case 'echo_champion':
        unlocked = gameData.mode === 'echo' && gameData.score >= 15;
        break;
      case 'survival_expert':
        unlocked = gameData.mode === 'survival' && gameData.survivalRounds >= 20;
        break;
      case 'boss_slayer':
        unlocked = gameData.mode === 'boss' && gameData.bossRounds >= 5;
        break;
    }
    
    if (unlocked) {
      this.awardShards(achievement.shards);
      if (achievement.unlock) {
        this.unlockContent(achievement.unlock);
      }
      this.showAchievementNotification(achievement.name, achievement.description, achievement.shards, achievement.unlock);
      return true;
    }
    
    return false;
  }
  
  awardShards(amount) {
    if (typeof addMemoryShards === 'function') {
      addMemoryShards(amount);
    }
  }
  
  unlockContent(unlockId) {
    if (typeof unlockContent === 'function') {
      unlockContent(unlockId);
    }
  }
  
  showMilestoneNotification(title, shards, unlock) {
    const notification = document.createElement('div');
    notification.className = 'milestone-notification';
    notification.innerHTML = `
      <div class="milestone-content">
        <h3>${title}</h3>
        <p>+${shards} Memory Shards</p>
        ${unlock ? `<p class="unlock">Unlocked: ${this.getUnlockName(unlock)}</p>` : ''}
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
  
  showAchievementNotification(name, description, shards, unlock) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-content">
        <h3>🏆 ${name}</h3>
        <p>${description}</p>
        <p>+${shards} Memory Shards</p>
        ${unlock ? `<p class="unlock">Unlocked: ${this.getUnlockName(unlock)}</p>` : ''}
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
  
  getUnlockName(unlockId) {
    const unlockNames = {
      'theme_retro': 'Retro Theme',
      'theme_vaporwave': 'Vaporwave Theme',
      'theme_corrupted': 'Corrupted Theme',
      'theme_glitch': 'Glitch Theme',
      'audio_synth': 'Synth Audio Pack',
      'audio_soft': 'Soft Audio Pack',
      'audio_chiptune': 'Chiptune Audio Pack',
      'mode_mirror': 'Mirror Mode',
      'mode_echo': 'Echo Mode',
      'mode_survival': 'Survival Mode',
      'mode_boss': 'Boss Mode',
      'lore_fragment_1': 'Lore Fragment 1',
      'lore_fragment_2': 'Lore Fragment 2',
      'lore_fragment_3': 'Lore Fragment 3',
      'lore_fragment_4': 'Lore Fragment 4',
      'lore_fragment_5': 'Lore Fragment 5',
      'lore_fragment_6': 'Lore Fragment 6',
      'lore_fragment_7': 'Lore Fragment 7',
      'lore_fragment_8': 'Lore Fragment 8'
    };
    
    return unlockNames[unlockId] || unlockId;
  }
  
  canAfford(cost) {
    return saveData.memoryShards >= cost;
  }
  
  spendShards(cost) {
    if (this.canAfford(cost)) {
      if (typeof addMemoryShards === 'function') {
        addMemoryShards(-cost);
      }
      return true;
    }
    return false;
  }
}

// Global progression system instance
const progressionSystem = new ProgressionSystem();

// Helper functions for main.js integration
function checkProgression(gameData) {
  // Check score milestones
  progressionSystem.checkScoreMilestone(gameData.score);
  
  // Check mode completion
  progressionSystem.checkModeCompletion(gameData.mode, gameData.score);
  
  // Check achievements
  progressionSystem.checkAchievement('perfect_10', gameData);
  progressionSystem.checkAchievement('speed_demon', gameData);
  progressionSystem.checkAchievement('zen_master', gameData);
  progressionSystem.checkAchievement('chaos_lord', gameData);
  progressionSystem.checkAchievement('mirror_master', gameData);
  progressionSystem.checkAchievement('echo_champion', gameData);
  progressionSystem.checkAchievement('survival_expert', gameData);
  progressionSystem.checkAchievement('boss_slayer', gameData);
}

function unlockContent(unlockId) {
  const [type, id] = unlockId.split('_');
  
  switch (type) {
    case 'theme':
      if (!saveData.unlockedThemes.includes(id)) {
        saveData.unlockedThemes.push(id);
        saveGameData();
      }
      break;
    case 'audio':
      if (!saveData.unlockedAudioPacks.includes(id)) {
        saveData.unlockedAudioPacks.push(id);
        saveGameData();
      }
      break;
    case 'mode':
      if (!saveData.unlockedModes.includes(id)) {
        saveData.unlockedModes.push(id);
        saveGameData();
        updateModeSelect();
      }
      break;
    case 'lore':
      if (!saveData.unlockedLore.includes(id)) {
        saveData.unlockedLore.push(id);
        saveGameData();
      }
      break;
  }
}

function updateModeSelect() {
  const modeSelect = document.getElementById('modeSelect');
  const startModeSelect = document.getElementById('startModeSelect');
  
  if (modeSelect) {
    Array.from(modeSelect.options).forEach(option => {
      if (saveData.unlockedModes.includes(option.value)) {
        option.disabled = false;
        option.textContent = option.value.charAt(0).toUpperCase() + option.value.slice(1);
      }
    });
  }
  
  if (startModeSelect) {
    Array.from(startModeSelect.options).forEach(option => {
      if (saveData.unlockedModes.includes(option.value)) {
        option.disabled = false;
        option.textContent = option.value.charAt(0).toUpperCase() + option.value.slice(1);
      }
    });
  }
}
