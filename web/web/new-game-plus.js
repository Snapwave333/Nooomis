/*
  NOOOMIS New Game+ System
  Post-resolution content and prestige features
*/

class NewGamePlusSystem {
  constructor() {
    this.prestigeLevel = 0;
    this.prestigeRewards = [
      { level: 1, name: 'Golden Theme', description: 'Everything shines with gold', unlock: 'theme_golden' },
      { level: 2, name: 'Nightmare Mode', description: 'All modifiers active simultaneously', unlock: 'mode_nightmare' },
      { level: 3, name: 'Speedrun Mode', description: 'Race against the clock', unlock: 'mode_speedrun' },
      { level: 4, name: 'Infinite Mode', description: 'Endless sequences with no failure', unlock: 'mode_infinite' },
      { level: 5, name: 'Master Theme', description: 'Ultimate visual experience', unlock: 'theme_master' }
    ];
    
    this.speedrunLeaderboard = [];
    this.nightmareModifiers = [
      'speed_2x',
      'chaos_layout',
      'inverted_controls',
      'fake_flashes',
      'timing_0.5x',
      'random_audio'
    ];
  }
  
  // Check if New Game+ is available
  isNewGamePlusAvailable() {
    return typeof isLiberationModeAvailable === 'function' && isLiberationModeAvailable();
  }
  
  // Start New Game+
  startNewGamePlus() {
    if (!this.isNewGamePlusAvailable()) return false;
    
    this.prestigeLevel++;
    this.savePrestigeData();
    
    this.showPrestigeNotification();
    this.unlockPrestigeRewards();
    
    return true;
  }
  
  // Show prestige notification
  showPrestigeNotification() {
    const reward = this.prestigeRewards[this.prestigeLevel - 1];
    const notification = document.createElement('div');
    notification.className = 'prestige-notification';
    notification.innerHTML = `
      <div class="prestige-content">
        <h2>🌟 NEW GAME+ LEVEL ${this.prestigeLevel}</h2>
        <h3>${reward.name}</h3>
        <p>${reward.description}</p>
        <p>Unlocked: ${reward.unlock}</p>
        <br>
        <p>Welcome to the next level of mastery.</p>
        <button class="continue-prestige-btn">Continue</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add event listener
    notification.querySelector('.continue-prestige-btn').addEventListener('click', () => {
      document.body.removeChild(notification);
    });
  }
  
  // Unlock prestige rewards
  unlockPrestigeRewards() {
    const reward = this.prestigeRewards[this.prestigeLevel - 1];
    
    // Unlock the reward
    if (typeof unlockContent === 'function') {
      unlockContent(reward.unlock);
    }
    
    // Add to unlocked content
    if (typeof saveData !== 'undefined') {
      const unlockType = reward.unlock.split('_')[0];
      const unlockId = reward.unlock.split('_')[1];
      
      switch (unlockType) {
        case 'theme':
          if (!saveData.unlockedThemes.includes(unlockId)) {
            saveData.unlockedThemes.push(unlockId);
          }
          break;
        case 'mode':
          if (!saveData.unlockedModes.includes(unlockId)) {
            saveData.unlockedModes.push(unlockId);
          }
          break;
      }
      
      if (typeof saveGameData === 'function') {
        saveGameData();
      }
    }
  }
  
  // Start Nightmare Mode
  startNightmareMode() {
    // Apply all modifiers simultaneously
    this.nightmareModifiers.forEach(modifier => {
      this.applyNightmareModifier(modifier);
    });
    
    this.showNightmareNotification();
  }
  
  // Apply nightmare modifier
  applyNightmareModifier(modifier) {
    switch (modifier) {
      case 'speed_2x':
        // Double speed
        break;
      case 'chaos_layout':
        // Randomize layout every round
        break;
      case 'inverted_controls':
        // Invert all controls
        break;
      case 'fake_flashes':
        // Add fake flashes to every sequence
        break;
      case 'timing_0.5x':
        // Half timing windows
        break;
      case 'random_audio':
        // Randomize audio frequencies
        break;
    }
  }
  
  // Show nightmare mode notification
  showNightmareNotification() {
    const notification = document.createElement('div');
    notification.className = 'nightmare-notification';
    notification.innerHTML = `
      <div class="nightmare-content">
        <h2>👹 NIGHTMARE MODE</h2>
        <p>All modifiers are active simultaneously:</p>
        <ul>
          <li>2x Speed</li>
          <li>Chaos Layout</li>
          <li>Inverted Controls</li>
          <li>Fake Flashes</li>
          <li>Half Timing Windows</li>
          <li>Random Audio</li>
        </ul>
        <p><strong>Survive if you can...</strong></p>
        <button class="start-nightmare-btn">BEGIN NIGHTMARE</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add event listener
    notification.querySelector('.start-nightmare-btn').addEventListener('click', () => {
      document.body.removeChild(notification);
      // Start nightmare game
      if (typeof startGame === 'function') {
        startGame();
      }
    });
  }
  
  // Start Speedrun Mode
  startSpeedrunMode() {
    this.showSpeedrunNotification();
  }
  
  // Show speedrun mode notification
  showSpeedrunNotification() {
    const notification = document.createElement('div');
    notification.className = 'speedrun-notification';
    notification.innerHTML = `
      <div class="speedrun-content">
        <h2>⏱️ SPEEDRUN MODE</h2>
        <p>Race against the clock!</p>
        <p>Complete sequences as fast as possible.</p>
        <p>Leaderboard tracks your best times.</p>
        <br>
        <div class="speedrun-leaderboard">
          <h3>Best Times</h3>
          <div id="speedrunTimes">
            ${this.getSpeedrunLeaderboardHTML()}
          </div>
        </div>
        <button class="start-speedrun-btn">START SPEEDRUN</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add event listener
    notification.querySelector('.start-speedrun-btn').addEventListener('click', () => {
      document.body.removeChild(notification);
      // Start speedrun game
      if (typeof startGame === 'function') {
        startGame();
      }
    });
  }
  
  // Get speedrun leaderboard HTML
  getSpeedrunLeaderboardHTML() {
    if (this.speedrunLeaderboard.length === 0) {
      return '<p>No times recorded yet.</p>';
    }
    
    return this.speedrunLeaderboard
      .sort((a, b) => a.time - b.time)
      .slice(0, 10)
      .map((entry, index) => `
        <div class="speedrun-entry">
          <span class="rank">${index + 1}.</span>
          <span class="time">${entry.time.toFixed(2)}s</span>
          <span class="score">Score: ${entry.score}</span>
        </div>
      `).join('');
  }
  
  // Record speedrun time
  recordSpeedrunTime(time, score) {
    this.speedrunLeaderboard.push({
      time: time,
      score: score,
      date: new Date().toISOString()
    });
    
    // Keep only top 50 times
    this.speedrunLeaderboard = this.speedrunLeaderboard
      .sort((a, b) => a.time - b.time)
      .slice(0, 50);
    
    this.saveSpeedrunData();
  }
  
  // Start Infinite Mode
  startInfiniteMode() {
    this.showInfiniteNotification();
  }
  
  // Show infinite mode notification
  showInfiniteNotification() {
    const notification = document.createElement('div');
    notification.className = 'infinite-notification';
    notification.innerHTML = `
      <div class="infinite-content">
        <h2>∞ INFINITE MODE</h2>
        <p>Endless sequences with no failure.</p>
        <p>Perfect for meditation and relaxation.</p>
        <p>Track your longest streak.</p>
        <br>
        <p>Current Best Streak: ${this.getBestInfiniteStreak()}</p>
        <button class="start-infinite-btn">BEGIN INFINITE</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add event listener
    notification.querySelector('.start-infinite-btn').addEventListener('click', () => {
      document.body.removeChild(notification);
      // Start infinite game
      if (typeof startGame === 'function') {
        startGame();
      }
    });
  }
  
  // Get best infinite streak
  getBestInfiniteStreak() {
    const saved = localStorage.getItem('nomis-infinite-streak');
    return saved ? parseInt(saved) : 0;
  }
  
  // Update infinite streak
  updateInfiniteStreak(streak) {
    const currentBest = this.getBestInfiniteStreak();
    if (streak > currentBest) {
      localStorage.setItem('nomis-infinite-streak', streak.toString());
    }
  }
  
  // Save prestige data
  savePrestigeData() {
    localStorage.setItem('nomis-prestige-level', this.prestigeLevel.toString());
  }
  
  // Load prestige data
  loadPrestigeData() {
    const saved = localStorage.getItem('nomis-prestige-level');
    this.prestigeLevel = saved ? parseInt(saved) : 0;
  }
  
  // Save speedrun data
  saveSpeedrunData() {
    localStorage.setItem('nomis-speedrun-leaderboard', JSON.stringify(this.speedrunLeaderboard));
  }
  
  // Load speedrun data
  loadSpeedrunData() {
    const saved = localStorage.getItem('nomis-speedrun-leaderboard');
    this.speedrunLeaderboard = saved ? JSON.parse(saved) : [];
  }
  
  // Get prestige level
  getPrestigeLevel() {
    return this.prestigeLevel;
  }
  
  // Get next prestige reward
  getNextPrestigeReward() {
    if (this.prestigeLevel >= this.prestigeRewards.length) {
      return null;
    }
    return this.prestigeRewards[this.prestigeLevel];
  }
  
  // Show New Game+ panel
  showNewGamePlusPanel() {
    const panel = document.createElement('div');
    panel.className = 'new-game-plus-panel';
    
    panel.innerHTML = `
      <div class="ngp-content">
        <h2>🌟 New Game+</h2>
        
        <div class="prestige-info">
          <h3>Prestige Level: ${this.prestigeLevel}</h3>
          ${this.getNextPrestigeReward() ? `
            <p>Next Reward: ${this.getNextPrestigeReward().name}</p>
            <p>${this.getNextPrestigeReward().description}</p>
          ` : '<p>Maximum prestige level reached!</p>'}
        </div>
        
        <div class="ngp-modes">
          <h3>Unlocked Modes</h3>
          <div class="mode-grid">
            <button class="ngp-mode-btn" data-mode="nightmare">
              <h4>👹 Nightmare</h4>
              <p>All modifiers active</p>
            </button>
            <button class="ngp-mode-btn" data-mode="speedrun">
              <h4>⏱️ Speedrun</h4>
              <p>Race against time</p>
            </button>
            <button class="ngp-mode-btn" data-mode="infinite">
              <h4>∞ Infinite</h4>
              <p>Endless sequences</p>
            </button>
          </div>
        </div>
        
        <div class="ngp-actions">
          <button class="prestige-btn">Start New Game+</button>
          <button class="close-ngp-btn">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // Add event listeners
    panel.querySelectorAll('.ngp-mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.dataset.mode;
        this.startNewGamePlusMode(mode);
      });
    });
    
    panel.querySelector('.prestige-btn').addEventListener('click', () => {
      this.startNewGamePlus();
    });
    
    panel.querySelector('.close-ngp-btn').addEventListener('click', () => {
      document.body.removeChild(panel);
    });
  }
  
  // Start New Game+ mode
  startNewGamePlusMode(mode) {
    switch (mode) {
      case 'nightmare':
        this.startNightmareMode();
        break;
      case 'speedrun':
        this.startSpeedrunMode();
        break;
      case 'infinite':
        this.startInfiniteMode();
        break;
    }
  }
  
  // Initialize New Game+ system
  initialize() {
    this.loadPrestigeData();
    this.loadSpeedrunData();
  }
}

// Global New Game+ system instance
const newGamePlusSystem = new NewGamePlusSystem();

// Helper functions for main.js integration
function showNewGamePlusPanel() {
  if (typeof newGamePlusSystem !== 'undefined') {
    newGamePlusSystem.showNewGamePlusPanel();
  }
}

function startNewGamePlus() {
  if (typeof newGamePlusSystem !== 'undefined') {
    return newGamePlusSystem.startNewGamePlus();
  }
  return false;
}

function getPrestigeLevel() {
  if (typeof newGamePlusSystem !== 'undefined') {
    return newGamePlusSystem.getPrestigeLevel();
  }
  return 0;
}

function recordSpeedrunTime(time, score) {
  if (typeof newGamePlusSystem !== 'undefined') {
    newGamePlusSystem.recordSpeedrunTime(time, score);
  }
}

function updateInfiniteStreak(streak) {
  if (typeof newGamePlusSystem !== 'undefined') {
    newGamePlusSystem.updateInfiniteStreak(streak);
  }
}

// Initialize New Game+ system
if (typeof newGamePlusSystem !== 'undefined') {
  newGamePlusSystem.initialize();
}

// Add CSS for New Game+ features
const newGamePlusStyle = document.createElement('style');
newGamePlusStyle.textContent = `
  .prestige-notification, .nightmare-notification, .speedrun-notification, .infinite-notification {
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
  
  .prestige-content, .nightmare-content, .speedrun-content, .infinite-content {
    background: var(--panel);
    border: 2px solid var(--accent);
    border-radius: 12px;
    padding: 30px;
    max-width: 500px;
    text-align: center;
  }
  
  .prestige-content h2, .nightmare-content h2, .speedrun-content h2, .infinite-content h2 {
    margin: 0 0 16px 0;
    color: var(--accent);
    font-size: 24px;
  }
  
  .prestige-content h3, .nightmare-content h3, .speedrun-content h3, .infinite-content h3 {
    margin: 0 0 16px 0;
    color: var(--text);
    font-size: 18px;
  }
  
  .prestige-content p, .nightmare-content p, .speedrun-content p, .infinite-content p {
    margin: 8px 0;
    font-size: 14px;
    line-height: 1.4;
  }
  
  .nightmare-content ul {
    text-align: left;
    margin: 16px 0;
  }
  
  .nightmare-content li {
    margin: 4px 0;
  }
  
  .speedrun-leaderboard {
    background: rgba(101, 195, 255, 0.1);
    border: 1px solid var(--accent);
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
  }
  
  .speedrun-entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
    border-bottom: 1px solid rgba(101, 195, 255, 0.2);
  }
  
  .speedrun-entry:last-child {
    border-bottom: none;
  }
  
  .rank {
    font-weight: 600;
    color: var(--accent);
  }
  
  .time {
    font-weight: 600;
  }
  
  .score {
    opacity: 0.8;
    font-size: 12px;
  }
  
  .start-boss-btn, .continue-prestige-btn, .start-nightmare-btn, .start-speedrun-btn, .start-infinite-btn {
    background: var(--accent);
    color: #031225;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 20px;
  }
  
  .new-game-plus-panel {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .ngp-content {
    background: var(--panel);
    border: 2px solid var(--accent);
    border-radius: 12px;
    padding: 20px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
  }
  
  .ngp-content h2 {
    margin: 0 0 16px 0;
    color: var(--accent);
    text-align: center;
  }
  
  .prestige-info, .ngp-modes {
    margin: 16px 0;
    padding: 12px;
    background: rgba(101, 195, 255, 0.05);
    border: 1px solid var(--accent);
    border-radius: 8px;
  }
  
  .prestige-info h3, .ngp-modes h3 {
    margin: 0 0 8px 0;
    color: var(--accent);
    font-size: 16px;
  }
  
  .mode-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    margin-top: 12px;
  }
  
  .ngp-mode-btn {
    background: rgba(101, 195, 255, 0.1);
    border: 1px solid var(--accent);
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .ngp-mode-btn:hover {
    background: rgba(101, 195, 255, 0.2);
  }
  
  .ngp-mode-btn h4 {
    margin: 0 0 4px 0;
    color: var(--accent);
    font-size: 14px;
  }
  
  .ngp-mode-btn p {
    margin: 0;
    font-size: 12px;
    opacity: 0.8;
  }
  
  .ngp-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 20px;
  }
  
  .prestige-btn, .close-ngp-btn {
    background: var(--accent);
    color: #031225;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
  }
  
  .close-ngp-btn {
    background: #666;
    color: white;
  }
`;
document.head.appendChild(newGamePlusStyle);
