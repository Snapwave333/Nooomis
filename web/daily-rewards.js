/*
  NOOOMIS Daily Return Rewards System
  Incentivize daily play with progressive rewards
*/

class DailyRewardsSystem {
  constructor() {
    this.rewards = [
      { day: 1, type: 'shards', amount: 5, description: 'Welcome back!', icon: '💎' },
      { day: 2, type: 'audio', item: 'synth', description: 'New audio pack!', icon: '🎵' },
      { day: 3, type: 'shards', amount: 10, description: 'Memory shards bonus', icon: '💎' },
      { day: 4, type: 'theme', item: 'retro', description: 'Retro theme unlocked!', icon: '🎨' },
      { day: 5, type: 'shards', amount: 15, description: 'Big shard reward', icon: '💎' },
      { day: 6, type: 'lore', item: 'fragment_1', description: 'Lore fragment discovered', icon: '📜' },
      { day: 7, type: 'theme', item: 'loyalty', description: 'Exclusive Loyalty theme!', icon: '👑' },
      { day: 8, type: 'shards', amount: 20, description: 'Week 2 bonus', icon: '💎' },
      { day: 9, type: 'audio', item: 'soft', description: 'Soft audio pack', icon: '🎵' },
      { day: 10, type: 'shards', amount: 25, description: 'Double digits reward', icon: '💎' },
      { day: 11, type: 'mode', item: 'mirror', description: 'Mirror mode unlocked!', icon: '🪞' },
      { day: 12, type: 'shards', amount: 30, description: 'Mid-week bonus', icon: '💎' },
      { day: 13, type: 'theme', item: 'vaporwave', description: 'Vaporwave theme', icon: '🎨' },
      { day: 14, type: 'shards', amount: 35, description: 'Two weeks strong!', icon: '💎' },
      { day: 15, type: 'mode', item: 'echo', description: 'Echo mode unlocked!', icon: '🔊' },
      { day: 16, type: 'shards', amount: 40, description: 'Sweet sixteen bonus', icon: '💎' },
      { day: 17, type: 'audio', item: 'chiptune', description: 'Chiptune audio pack', icon: '🎵' },
      { day: 18, type: 'shards', amount: 45, description: 'Growing stronger', icon: '💎' },
      { day: 19, type: 'theme', item: 'glitch', description: 'Glitch theme unlocked', icon: '🎨' },
      { day: 20, type: 'shards', amount: 50, description: 'Twenty days milestone!', icon: '💎' },
      { day: 21, type: 'mode', item: 'survival', description: 'Survival mode unlocked!', icon: '⚔️' },
      { day: 22, type: 'shards', amount: 55, description: 'Three weeks strong', icon: '💎' },
      { day: 23, type: 'lore', item: 'fragment_2', description: 'Ancient lore fragment', icon: '📜' },
      { day: 24, type: 'shards', amount: 60, description: 'Almost a month!', icon: '💎' },
      { day: 25, type: 'theme', item: 'zen', description: 'Zen theme unlocked', icon: '🎨' },
      { day: 26, type: 'shards', amount: 65, description: 'Quarter century bonus', icon: '💎' },
      { day: 27, type: 'mode', item: 'boss', description: 'Boss mode unlocked!', icon: '👹' },
      { day: 28, type: 'shards', amount: 70, description: 'Four weeks complete!', icon: '💎' },
      { day: 29, type: 'theme', item: 'mirror', description: 'Mirror theme unlocked', icon: '🎨' },
      { day: 30, type: 'shards', amount: 100, description: 'MONTHLY MILESTONE!', icon: '🏆' }
    ];
    
    this.maxStreak = 30;
    this.loadRewardData();
  }
  
  // Load reward data from localStorage
  loadRewardData() {
    try {
      const saved = localStorage.getItem('nomis-daily-rewards');
      if (saved) {
        const data = JSON.parse(saved);
        this.lastClaimDate = data.lastClaimDate;
        this.currentStreak = data.currentStreak || 0;
        this.claimedRewards = data.claimedRewards || [];
        this.totalDaysPlayed = data.totalDaysPlayed || 0;
      } else {
        this.lastClaimDate = null;
        this.currentStreak = 0;
        this.claimedRewards = [];
        this.totalDaysPlayed = 0;
      }
    } catch (e) {
      console.warn('Failed to load daily rewards data:', e);
      this.lastClaimDate = null;
      this.currentStreak = 0;
      this.claimedRewards = [];
      this.totalDaysPlayed = 0;
    }
  }
  
  // Save reward data to localStorage
  saveRewardData() {
    try {
      const data = {
        lastClaimDate: this.lastClaimDate,
        currentStreak: this.currentStreak,
        claimedRewards: this.claimedRewards,
        totalDaysPlayed: this.totalDaysPlayed
      };
      localStorage.setItem('nomis-daily-rewards', JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save daily rewards data:', e);
    }
  }
  
  // Check if player can claim daily reward
  canClaimReward() {
    const today = new Date().toDateString();
    const lastClaim = this.lastClaimDate;
    
    // First time playing
    if (!lastClaim) return true;
    
    // Already claimed today
    if (lastClaim === today) return false;
    
    // Check if streak is broken (missed a day)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    if (lastClaim !== yesterdayStr && lastClaim !== today) {
      // Streak broken, reset to 0
      this.currentStreak = 0;
    }
    
    return true;
  }
  
  // Claim daily reward
  claimDailyReward() {
    if (!this.canClaimReward()) return false;
    
    const today = new Date().toDateString();
    const rewardDay = Math.min(this.currentStreak + 1, this.maxStreak);
    const reward = this.rewards[rewardDay - 1];
    
    if (!reward) return false;
    
    // Update streak
    this.currentStreak = rewardDay;
    this.lastClaimDate = today;
    this.totalDaysPlayed++;
    
    // Award the reward
    this.awardReward(reward);
    
    // Mark as claimed
    this.claimedRewards.push({
      day: rewardDay,
      date: today,
      reward: reward
    });
    
    // Save data
    this.saveRewardData();
    
    // Show reward notification
    this.showRewardNotification(reward, rewardDay);
    
    return true;
  }
  
  // Award the actual reward
  awardReward(reward) {
    switch (reward.type) {
      case 'shards':
        if (typeof addMemoryShards === 'function') {
          addMemoryShards(reward.amount);
        }
        break;
      case 'audio':
        if (typeof unlockContent === 'function') {
          unlockContent(`audio_${reward.item}`);
        }
        break;
      case 'theme':
        if (typeof unlockContent === 'function') {
          unlockContent(`theme_${reward.item}`);
        }
        break;
      case 'mode':
        if (typeof unlockContent === 'function') {
          unlockContent(`mode_${reward.item}`);
        }
        break;
      case 'lore':
        if (typeof unlockContent === 'function') {
          unlockContent(`lore_${reward.item}`);
        }
        break;
    }
  }
  
  // Show reward notification
  showRewardNotification(reward, day) {
    const notification = document.createElement('div');
    notification.className = 'daily-reward-notification';
    notification.innerHTML = `
      <div class="daily-reward-content">
        <h3>${reward.icon} Daily Reward!</h3>
        <h4>Day ${day} - ${reward.description}</h4>
        <div class="reward-details">
          ${this.getRewardDetails(reward)}
        </div>
        <div class="streak-info">
          <p>Streak: ${this.currentStreak} days</p>
          <p>Total days played: ${this.totalDaysPlayed}</p>
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
  
  // Get reward details for display
  getRewardDetails(reward) {
    switch (reward.type) {
      case 'shards':
        return `<p>+${reward.amount} Memory Shards</p>`;
      case 'audio':
        return `<p>Audio Pack: ${reward.item}</p>`;
      case 'theme':
        return `<p>Theme: ${reward.item}</p>`;
      case 'mode':
        return `<p>Mode: ${reward.item}</p>`;
      case 'lore':
        return `<p>Lore Fragment: ${reward.item}</p>`;
      default:
        return `<p>${reward.description}</p>`;
    }
  }
  
  // Get current reward info
  getCurrentRewardInfo() {
    const nextDay = Math.min(this.currentStreak + 1, this.maxStreak);
    const reward = this.rewards[nextDay - 1];
    
    return {
      day: nextDay,
      reward: reward,
      canClaim: this.canClaimReward(),
      streak: this.currentStreak,
      totalDays: this.totalDaysPlayed
    };
  }
  
  // Get upcoming rewards (next 7 days)
  getUpcomingRewards() {
    const upcoming = [];
    const startDay = this.currentStreak + 1;
    
    for (let i = 0; i < 7; i++) {
      const day = startDay + i;
      if (day <= this.maxStreak) {
        const reward = this.rewards[day - 1];
        upcoming.push({
          day: day,
          reward: reward,
          isClaimable: i === 0 && this.canClaimReward()
        });
      }
    }
    
    return upcoming;
  }
  
  // Get reward statistics
  getRewardStats() {
    return {
      currentStreak: this.currentStreak,
      totalDaysPlayed: this.totalDaysPlayed,
      claimedRewards: this.claimedRewards.length,
      maxStreak: this.maxStreak,
      canClaimToday: this.canClaimReward()
    };
  }
  
  // Reset streak (for testing)
  resetStreak() {
    this.currentStreak = 0;
    this.lastClaimDate = null;
    this.saveRewardData();
  }
  
  // Check if player has missed days
  hasMissedDays() {
    if (!this.lastClaimDate) return false;
    
    const today = new Date();
    const lastClaim = new Date(this.lastClaimDate);
    const daysDiff = Math.floor((today - lastClaim) / (1000 * 60 * 60 * 24));
    
    return daysDiff > 1;
  }
  
  // Get days until next reward
  getDaysUntilNextReward() {
    if (this.canClaimReward()) return 0;
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const msUntilMidnight = tomorrow.getTime() - today.getTime();
    const hoursUntilMidnight = msUntilMidnight / (1000 * 60 * 60);
    
    return Math.ceil(hoursUntilMidnight / 24);
  }
}

// Global daily rewards system instance
const dailyRewardsSystem = new DailyRewardsSystem();

// Helper functions for main.js integration
function checkDailyReward() {
  return dailyRewardsSystem.canClaimReward();
}

function claimDailyReward() {
  return dailyRewardsSystem.claimDailyReward();
}

function getDailyRewardInfo() {
  return dailyRewardsSystem.getCurrentRewardInfo();
}

function getUpcomingRewards() {
  return dailyRewardsSystem.getUpcomingRewards();
}

function getDailyRewardStats() {
  return dailyRewardsSystem.getRewardStats();
}

function showDailyRewardsPanel() {
  const panel = document.createElement('div');
  panel.className = 'daily-rewards-panel';
  
  const info = getDailyRewardInfo();
  const upcoming = getUpcomingRewards();
  const stats = getDailyRewardStats();
  
  panel.innerHTML = `
    <div class="daily-rewards-content">
      <h2>📅 Daily Rewards</h2>
      
      <div class="current-reward">
        <h3>Today's Reward</h3>
        ${info.canClaim ? `
          <div class="reward-claimable">
            <p>Day ${info.day}: ${info.reward.description}</p>
            <p>${info.reward.icon} ${info.reward.description}</p>
            <button class="claim-btn">Claim Reward</button>
          </div>
        ` : `
          <div class="reward-claimed">
            <p>✅ Already claimed today!</p>
            <p>Next reward in ${dailyRewardsSystem.getDaysUntilNextReward()} day(s)</p>
          </div>
        `}
      </div>
      
      <div class="streak-info">
        <h3>Streak Information</h3>
        <p>Current Streak: ${stats.currentStreak} days</p>
        <p>Total Days Played: ${stats.totalDaysPlayed}</p>
        <p>Rewards Claimed: ${stats.claimedRewards}</p>
      </div>
      
      <div class="upcoming-rewards">
        <h3>Upcoming Rewards</h3>
        <div class="rewards-list">
          ${upcoming.map(reward => `
            <div class="reward-item ${reward.isClaimable ? 'claimable' : ''}">
              <span class="reward-day">Day ${reward.day}</span>
              <span class="reward-icon">${reward.reward.icon}</span>
              <span class="reward-desc">${reward.reward.description}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="panel-actions">
        <button class="close-panel">Close</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(panel);
  
  // Add event listeners
  panel.querySelector('.claim-btn')?.addEventListener('click', () => {
    if (claimDailyReward()) {
      document.body.removeChild(panel);
    }
  });
  
  panel.querySelector('.close-panel').addEventListener('click', () => {
    document.body.removeChild(panel);
  });
}

// Add CSS for daily rewards
const dailyRewardsStyle = document.createElement('style');
dailyRewardsStyle.textContent = `
  .daily-reward-notification {
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
  
  .daily-reward-notification.show {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  
  .daily-reward-content h3 {
    margin: 0 0 8px 0;
    color: var(--accent);
    font-size: 18px;
    text-align: center;
  }
  
  .daily-reward-content h4 {
    margin: 0 0 12px 0;
    color: var(--text);
    font-size: 16px;
    text-align: center;
  }
  
  .reward-details {
    background: rgba(101, 195, 255, 0.1);
    border: 1px solid var(--accent);
    border-radius: 8px;
    padding: 12px;
    margin: 12px 0;
    text-align: center;
  }
  
  .streak-info {
    text-align: center;
    font-size: 14px;
    opacity: 0.8;
  }
  
  .daily-rewards-panel {
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
  
  .daily-rewards-content {
    background: var(--panel);
    border: 2px solid var(--accent);
    border-radius: 12px;
    padding: 20px;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
  }
  
  .daily-rewards-content h2 {
    margin: 0 0 16px 0;
    color: var(--accent);
    text-align: center;
  }
  
  .current-reward, .streak-info, .upcoming-rewards {
    margin: 16px 0;
    padding: 12px;
    background: rgba(101, 195, 255, 0.05);
    border: 1px solid var(--accent);
    border-radius: 8px;
  }
  
  .current-reward h3, .streak-info h3, .upcoming-rewards h3 {
    margin: 0 0 8px 0;
    color: var(--accent);
    font-size: 16px;
  }
  
  .reward-claimable {
    text-align: center;
  }
  
  .claim-btn {
    background: var(--accent);
    color: #031225;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
  }
  
  .rewards-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .reward-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    background: rgba(101, 195, 255, 0.1);
    border-radius: 4px;
  }
  
  .reward-item.claimable {
    background: rgba(101, 195, 255, 0.2);
    border: 1px solid var(--accent);
  }
  
  .reward-day {
    font-weight: 600;
    min-width: 60px;
  }
  
  .reward-icon {
    font-size: 18px;
  }
  
  .reward-desc {
    flex: 1;
    font-size: 14px;
  }
  
  .panel-actions {
    text-align: center;
    margin-top: 16px;
  }
  
  .close-panel {
    background: var(--accent);
    color: #031225;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
  }
`;
document.head.appendChild(dailyRewardsStyle);
