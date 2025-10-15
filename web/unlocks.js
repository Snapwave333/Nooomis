/*
  NOOOMIS Unlock System
  Themes, audio packs, modes, and lore management
*/

class UnlockSystem {
  constructor() {
    this.unlockables = {
      themes: {
        'neon': { name: 'Neon', unlocked: true, cost: 0, description: 'Default neon theme' },
        'retro': { name: 'Retro', unlocked: false, cost: 10, description: 'Classic 8-bit aesthetic' },
        'vaporwave': { name: 'Vaporwave', unlocked: false, cost: 20, description: 'Pink and cyan nostalgia' },
        'glitch': { name: 'Glitch', unlocked: false, cost: 15, description: 'Intentionally broken aesthetic' },
        'corrupted': { name: 'Corrupted', unlocked: false, cost: 50, description: 'Phase 4+ exclusive' },
        'zen': { name: 'Zen', unlocked: false, cost: 20, description: 'Peaceful meditation theme' },
        'mirror': { name: 'Mirror', unlocked: false, cost: 16, description: 'Reflective surfaces theme' },
        'weekend': { name: 'Weekend', unlocked: false, cost: 0, description: 'Weekly challenge reward' }
      },
      
      audio: {
        'classic': { name: 'Classic', unlocked: true, cost: 0, description: 'Default sine wave tones' },
        'synth': { name: 'Synth', unlocked: false, cost: 15, description: 'Sawtooth wave synthesis' },
        'soft': { name: 'Soft', unlocked: false, cost: 15, description: 'Gentle triangle waves' },
        'chiptune': { name: 'Chiptune', unlocked: false, cost: 25, description: '8-bit game music' },
        'echo': { name: 'Echo', unlocked: false, cost: 18, description: 'Echo challenge reward' }
      },
      
      modes: {
        'classic': { name: 'Classic', unlocked: true, cost: 0, description: 'Traditional Simon Says' },
        'speed': { name: 'Speed', unlocked: true, cost: 0, description: 'Faster sequences' },
        'zen': { name: 'Zen', unlocked: true, cost: 0, description: 'Relaxed pace' },
        'chaos': { name: 'Chaos', unlocked: true, cost: 0, description: 'Randomized layout' },
        'mirror': { name: 'Mirror', unlocked: false, cost: 20, description: 'Reversed input sequences' },
        'echo': { name: 'Echo', unlocked: false, cost: 20, description: 'Audio-only sequences' },
        'survival': { name: 'Survival', unlocked: false, cost: 30, description: 'Endless with modifiers' },
        'boss': { name: 'Boss', unlocked: false, cost: 30, description: 'Boss rounds with fake flashes' },
        'nightmare': { name: 'Nightmare', unlocked: false, cost: 0, description: 'All modifiers active' },
        'prestige': { name: 'Prestige', unlocked: false, cost: 0, description: 'Weekly challenge reward' }
      },
      
      lore: {
        'fragment_1': { name: 'Fragment 1', unlocked: false, cost: 5, description: 'The beginning of the story' },
        'fragment_2': { name: 'Fragment 2', unlocked: false, cost: 5, description: 'Speed and precision' },
        'fragment_3': { name: 'Fragment 3', unlocked: false, cost: 5, description: 'Peace and meditation' },
        'fragment_4': { name: 'Fragment 4', unlocked: false, cost: 5, description: 'Chaos and disorder' },
        'fragment_5': { name: 'Fragment 5', unlocked: false, cost: 5, description: 'Reflection and mirrors' },
        'fragment_6': { name: 'Fragment 6', unlocked: false, cost: 5, description: 'Sound and silence' },
        'fragment_7': { name: 'Fragment 7', unlocked: false, cost: 5, description: 'Survival and endurance' },
        'fragment_8': { name: 'Fragment 8', unlocked: false, cost: 5, description: 'Confrontation and victory' },
        'fragment_chaos': { name: 'Chaos Fragment', unlocked: false, cost: 0, description: 'Daily challenge reward' },
        'fragment_boss': { name: 'Boss Fragment', unlocked: false, cost: 0, description: 'Daily challenge reward' }
      }
    };
    
    this.loadUnlockStates();
  }
  
  // Load unlock states from save data
  loadUnlockStates() {
    // Load from saveData if available
    if (typeof saveData !== 'undefined') {
      // Themes
      saveData.unlockedThemes.forEach(theme => {
        if (this.unlockables.themes[theme]) {
          this.unlockables.themes[theme].unlocked = true;
        }
      });
      
      // Audio packs
      saveData.unlockedAudioPacks.forEach(audio => {
        if (this.unlockables.audio[audio]) {
          this.unlockables.audio[audio].unlocked = true;
        }
      });
      
      // Modes
      saveData.unlockedModes.forEach(mode => {
        if (this.unlockables.modes[mode]) {
          this.unlockables.modes[mode].unlocked = true;
        }
      });
      
      // Lore
      saveData.unlockedLore.forEach(lore => {
        if (this.unlockables.lore[lore]) {
          this.unlockables.lore[lore].unlocked = true;
        }
      });
    }
  }
  
  // Check if an unlockable is available for purchase
  canUnlock(category, id) {
    const unlockable = this.unlockables[category]?.[id];
    if (!unlockable) return false;
    
    if (unlockable.unlocked) return false;
    if (unlockable.cost === 0) return false; // Free unlocks are handled elsewhere
    
    return saveData.memoryShards >= unlockable.cost;
  }
  
  // Purchase an unlockable
  purchaseUnlock(category, id) {
    const unlockable = this.unlockables[category]?.[id];
    if (!unlockable) return false;
    
    if (unlockable.unlocked) return false;
    if (unlockable.cost === 0) return false;
    
    if (saveData.memoryShards < unlockable.cost) return false;
    
    // Spend shards
    if (typeof addMemoryShards === 'function') {
      addMemoryShards(-unlockable.cost);
    }
    
    // Unlock the item
    unlockable.unlocked = true;
    
    // Update save data
    this.updateSaveData(category, id);
    
    // Show unlock notification
    this.showUnlockNotification(unlockable);
    
    return true;
  }
  
  // Update save data with new unlock
  updateSaveData(category, id) {
    switch (category) {
      case 'themes':
        if (!saveData.unlockedThemes.includes(id)) {
          saveData.unlockedThemes.push(id);
        }
        break;
      case 'audio':
        if (!saveData.unlockedAudioPacks.includes(id)) {
          saveData.unlockedAudioPacks.push(id);
        }
        break;
      case 'modes':
        if (!saveData.unlockedModes.includes(id)) {
          saveData.unlockedModes.push(id);
        }
        break;
      case 'lore':
        if (!saveData.unlockedLore.includes(id)) {
          saveData.unlockedLore.push(id);
        }
        break;
    }
    
    if (typeof saveGameData === 'function') {
      saveGameData();
    }
  }
  
  // Show unlock notification
  showUnlockNotification(unlockable) {
    const notification = document.createElement('div');
    notification.className = 'unlock-notification';
    notification.innerHTML = `
      <div class="unlock-content">
        <h3>🔓 Unlocked!</h3>
        <h4>${unlockable.name}</h4>
        <p>${unlockable.description}</p>
        <p>Cost: ${unlockable.cost} Memory Shards</p>
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
  
  // Get all available unlocks for a category
  getAvailableUnlocks(category) {
    const categoryData = this.unlockables[category];
    if (!categoryData) return [];
    
    return Object.entries(categoryData)
      .filter(([id, unlockable]) => !unlockable.unlocked && unlockable.cost > 0)
      .map(([id, unlockable]) => ({ id, ...unlockable }));
  }
  
  // Get all unlocked items for a category
  getUnlockedItems(category) {
    const categoryData = this.unlockables[category];
    if (!categoryData) return [];
    
    return Object.entries(categoryData)
      .filter(([id, unlockable]) => unlockable.unlocked)
      .map(([id, unlockable]) => ({ id, ...unlockable }));
  }
  
  // Check if a specific item is unlocked
  isUnlocked(category, id) {
    return this.unlockables[category]?.[id]?.unlocked || false;
  }
  
  // Apply theme to the game
  applyTheme(themeId) {
    if (!this.isUnlocked('themes', themeId)) return false;
    
    const body = document.body;
    
    // Remove existing theme classes
    Object.keys(this.unlockables.themes).forEach(theme => {
      body.classList.remove(`theme-${theme}`);
    });
    
    // Apply new theme
    body.classList.add(`theme-${themeId}`);
    
    // Update theme preference
    if (typeof prefs !== 'undefined') {
      prefs.theme = themeId;
      if (typeof savePrefs === 'function') {
        savePrefs();
      }
    }
    
    return true;
  }
  
  // Apply audio pack to the game
  applyAudioPack(audioId) {
    if (!this.isUnlocked('audio', audioId)) return false;
    
    // Update audio pack preference
    if (typeof prefs !== 'undefined') {
      prefs.soundPack = audioId;
      if (typeof savePrefs === 'function') {
        savePrefs();
      }
    }
    
    // Apply the audio pack
    if (typeof setSoundPack === 'function') {
      setSoundPack(audioId);
    }
    
    return true;
  }
  
  // Get unlock progress for a category
  getUnlockProgress(category) {
    const categoryData = this.unlockables[category];
    if (!categoryData) return { unlocked: 0, total: 0, percentage: 0 };
    
    const total = Object.keys(categoryData).length;
    const unlocked = Object.values(categoryData).filter(item => item.unlocked).length;
    const percentage = Math.round((unlocked / total) * 100);
    
    return { unlocked, total, percentage };
  }
  
  // Get total unlock progress across all categories
  getTotalUnlockProgress() {
    const categories = ['themes', 'audio', 'modes', 'lore'];
    let totalUnlocked = 0;
    let totalItems = 0;
    
    categories.forEach(category => {
      const progress = this.getUnlockProgress(category);
      totalUnlocked += progress.unlocked;
      totalItems += progress.total;
    });
    
    const percentage = Math.round((totalUnlocked / totalItems) * 100);
    
    return { unlocked: totalUnlocked, total: totalItems, percentage };
  }
}

// Global unlock system instance
const unlockSystem = new UnlockSystem();

// Helper functions for main.js integration
function showUnlockShop() {
  const shop = document.createElement('div');
  shop.className = 'unlock-shop';
  shop.innerHTML = `
    <div class="shop-content">
      <h2>🔓 Unlock Shop</h2>
      <div class="shop-tabs">
        <button class="tab-btn active" data-tab="themes">Themes</button>
        <button class="tab-btn" data-tab="audio">Audio</button>
        <button class="tab-btn" data-tab="modes">Modes</button>
        <button class="tab-btn" data-tab="lore">Lore</button>
      </div>
      <div class="shop-items" id="shopItems">
        <!-- Items will be populated by JavaScript -->
      </div>
      <div class="shop-footer">
        <p>Memory Shards: <span id="shardCount">${saveData.memoryShards}</span></p>
        <button class="close-shop">Close</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(shop);
  
  // Add event listeners
  shop.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.target.dataset.tab;
      showShopTab(tab);
      
      // Update active tab
      shop.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
    });
  });
  
  shop.querySelector('.close-shop').addEventListener('click', () => {
    document.body.removeChild(shop);
  });
  
  // Show themes tab by default
  showShopTab('themes');
}

function showShopTab(category) {
  const shopItems = document.getElementById('shopItems');
  const availableUnlocks = unlockSystem.getAvailableUnlocks(category);
  
  if (availableUnlocks.length === 0) {
    shopItems.innerHTML = '<p>No items available for purchase.</p>';
    return;
  }
  
  shopItems.innerHTML = availableUnlocks.map(unlock => `
    <div class="shop-item">
      <div class="item-info">
        <h4>${unlock.name}</h4>
        <p>${unlock.description}</p>
      </div>
      <div class="item-actions">
        <span class="item-cost">${unlock.cost} Shards</span>
        <button class="purchase-btn" data-category="${category}" data-id="${unlock.id}">
          ${unlockSystem.canUnlock(category, unlock.id) ? 'Purchase' : 'Insufficient Shards'}
        </button>
      </div>
    </div>
  `).join('');
  
  // Add purchase event listeners
  shopItems.querySelectorAll('.purchase-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const category = e.target.dataset.category;
      const id = e.target.dataset.id;
      
      if (unlockSystem.purchaseUnlock(category, id)) {
        // Refresh the shop
        showShopTab(category);
        // Update shard count
        document.getElementById('shardCount').textContent = saveData.memoryShards;
      }
    });
  });
}

// Add shop button to menu dropdown
function addShopButton() {
  const menuDropdown = document.getElementById('menuDropdown');
  if (menuDropdown) {
    // Add shop button
    const shopButton = document.createElement('button');
    shopButton.className = 'menu-item';
    shopButton.innerHTML = '🔓 Unlock Shop';
    shopButton.addEventListener('click', showUnlockShop);
    menuDropdown.appendChild(shopButton);
    
    // Add challenge button
    const challengeButton = document.createElement('button');
    challengeButton.className = 'menu-item';
    challengeButton.innerHTML = '🎯 Friend Challenge';
    challengeButton.addEventListener('click', () => {
      if (typeof createFriendChallenge === 'function') {
        createFriendChallenge({
          creator: 'Player',
          mode: 'classic',
          difficulty: 'medium',
          type: 'normal'
        });
      }
    });
    menuDropdown.appendChild(challengeButton);
    
    // Add daily rewards button
    const rewardsButton = document.createElement('button');
    rewardsButton.className = 'menu-item';
    rewardsButton.innerHTML = '📅 Daily Rewards';
    rewardsButton.addEventListener('click', () => {
      if (typeof showDailyRewardsPanel === 'function') {
        showDailyRewardsPanel();
      }
    });
    menuDropdown.appendChild(rewardsButton);
    
    // Add New Game+ button
    const ngpButton = document.createElement('button');
    ngpButton.className = 'menu-item';
    ngpButton.innerHTML = '🌟 New Game+';
    ngpButton.addEventListener('click', () => {
      if (typeof showNewGamePlusPanel === 'function') {
        showNewGamePlusPanel();
      }
    });
    menuDropdown.appendChild(ngpButton);
  }
}
