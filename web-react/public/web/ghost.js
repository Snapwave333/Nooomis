/*
  NOOOMIS Ghost Replay System
  Record and replay top player sequences
*/

class GhostReplaySystem {
  constructor() {
    this.maxGhosts = 3;
    this.ghostData = [];
    this.currentGhost = null;
    this.ghostPlaying = false;
    this.ghostIndex = 0;
    
    this.loadGhostData();
  }
  
  // Load ghost data from localStorage
  loadGhostData() {
    try {
      const saved = localStorage.getItem('nomis-ghosts');
      if (saved) {
        this.ghostData = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load ghost data:', e);
      this.ghostData = [];
    }
  }
  
  // Save ghost data to localStorage
  saveGhostData() {
    try {
      localStorage.setItem('nomis-ghosts', JSON.stringify(this.ghostData));
    } catch (e) {
      console.warn('Failed to save ghost data:', e);
    }
  }
  
  // Record a new ghost from leaderboard data
  recordGhost(leaderboardEntry) {
    if (!leaderboardEntry || !leaderboardEntry.sequence) return;
    
    const ghost = {
      id: Date.now(),
      name: leaderboardEntry.name,
      score: leaderboardEntry.score,
      mode: leaderboardEntry.mode || 'classic',
      sequence: leaderboardEntry.sequence,
      timestamps: leaderboardEntry.timestamps || [],
      date: new Date().toISOString(),
      version: '1.0'
    };
    
    // Add to ghost data
    this.ghostData.push(ghost);
    
    // Sort by score and keep only top ghosts
    this.ghostData.sort((a, b) => b.score - a.score);
    this.ghostData = this.ghostData.slice(0, this.maxGhosts);
    
    this.saveGhostData();
    return ghost;
  }
  
  // Get available ghosts for a specific mode
  getGhostsForMode(mode) {
    return this.ghostData.filter(ghost => ghost.mode === mode);
  }
  
  // Start playing a ghost
  startGhostPlayback(ghostId) {
    const ghost = this.ghostData.find(g => g.id === ghostId);
    if (!ghost) return false;
    
    this.currentGhost = ghost;
    this.ghostIndex = 0;
    this.ghostPlaying = true;
    
    this.showGhostNotification(ghost);
    return true;
  }
  
  // Stop ghost playback
  stopGhostPlayback() {
    this.currentGhost = null;
    this.ghostIndex = 0;
    this.ghostPlaying = false;
  }
  
  // Play next ghost input
  playNextGhostInput() {
    if (!this.currentGhost || !this.ghostPlaying) return false;
    
    if (this.ghostIndex >= this.currentGhost.sequence.length) {
      this.stopGhostPlayback();
      return false;
    }
    
    const input = this.currentGhost.sequence[this.ghostIndex];
    const timestamp = this.currentGhost.timestamps[this.ghostIndex] || 0;
    
    // Show ghost input
    this.showGhostInput(input);
    
    this.ghostIndex++;
    return true;
  }
  
  // Show ghost input overlay
  showGhostInput(buttonIndex) {
    const pad = document.querySelector(`[data-index="${buttonIndex}"]`);
    if (!pad) return;
    
    // Create ghost overlay
    const ghostOverlay = document.createElement('div');
    ghostOverlay.className = 'ghost-overlay';
    ghostOverlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(101, 195, 255, 0.3);
      border: 2px solid #65c3ff;
      border-radius: 50%;
      pointer-events: none;
      z-index: 100;
      animation: ghostPulse 0.3s ease-in-out;
    `;
    
    pad.appendChild(ghostOverlay);
    
    // Remove overlay after animation
    setTimeout(() => {
      if (pad.contains(ghostOverlay)) {
        pad.removeChild(ghostOverlay);
      }
    }, 300);
  }
  
  // Show ghost notification
  showGhostNotification(ghost) {
    const notification = document.createElement('div');
    notification.className = 'ghost-notification';
    notification.innerHTML = `
      <div class="ghost-content">
        <h3>👻 Ghost Replay</h3>
        <p>Playing: ${ghost.name}</p>
        <p>Score: ${ghost.score} (${ghost.mode})</p>
        <p>Watch the blue overlays for ghost inputs</p>
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
  
  // Generate ghost from current game session
  generateGhostFromSession(gameData) {
    if (!gameData.sequence || gameData.sequence.length === 0) return null;
    
    const ghost = {
      id: Date.now(),
      name: 'Player',
      score: gameData.score || 0,
      mode: gameData.mode || 'classic',
      sequence: [...gameData.sequence],
      timestamps: gameData.timestamps || [],
      date: new Date().toISOString(),
      version: '1.0'
    };
    
    return ghost;
  }
  
  // Check if ghost should be recorded (top 3 scores)
  shouldRecordGhost(score, mode) {
    const modeGhosts = this.getGhostsForMode(mode);
    
    // Always record if we have less than max ghosts
    if (modeGhosts.length < this.maxGhosts) return true;
    
    // Record if score is higher than lowest ghost
    const lowestScore = Math.min(...modeGhosts.map(g => g.score));
    return score > lowestScore;
  }
  
  // Get ghost statistics
  getGhostStats() {
    const stats = {
      total: this.ghostData.length,
      byMode: {},
      topScore: 0,
      averageScore: 0
    };
    
    if (this.ghostData.length === 0) return stats;
    
    // Calculate by mode
    this.ghostData.forEach(ghost => {
      if (!stats.byMode[ghost.mode]) {
        stats.byMode[ghost.mode] = 0;
      }
      stats.byMode[ghost.mode]++;
    });
    
    // Calculate top and average scores
    stats.topScore = Math.max(...this.ghostData.map(g => g.score));
    stats.averageScore = Math.round(
      this.ghostData.reduce((sum, g) => sum + g.score, 0) / this.ghostData.length
    );
    
    return stats;
  }
  
  // Clear all ghost data
  clearAllGhosts() {
    this.ghostData = [];
    this.saveGhostData();
  }
  
  // Export ghost data
  exportGhostData() {
    return JSON.stringify(this.ghostData, null, 2);
  }
  
  // Import ghost data
  importGhostData(data) {
    try {
      const imported = JSON.parse(data);
      if (Array.isArray(imported)) {
        this.ghostData = imported;
        this.saveGhostData();
        return true;
      }
    } catch (e) {
      console.warn('Failed to import ghost data:', e);
    }
    return false;
  }
}

// Global ghost system instance
const ghostSystem = new GhostReplaySystem();

// Helper functions for main.js integration
function recordGhostFromGame(gameData) {
  if (!ghostSystem.shouldRecordGhost(gameData.score, gameData.mode)) return;
  
  const ghost = ghostSystem.generateGhostFromSession(gameData);
  if (ghost) {
    ghostSystem.recordGhost(ghost);
  }
}

function startGhostReplay(ghostId) {
  return ghostSystem.startGhostPlayback(ghostId);
}

function stopGhostReplay() {
  ghostSystem.stopGhostPlayback();
}

function playGhostInput() {
  return ghostSystem.playNextGhostInput();
}

function getGhostsForMode(mode) {
  return ghostSystem.getGhostsForMode(mode);
}

function getGhostStats() {
  return ghostSystem.getGhostStats();
}

// Add CSS for ghost animations
const ghostStyle = document.createElement('style');
ghostStyle.textContent = `
  @keyframes ghostPulse {
    0% { transform: scale(0.8); opacity: 0; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 0.7; }
  }
  
  .ghost-notification {
    position: fixed;
    top: 20px;
    left: 20px;
    background: var(--panel);
    border: 2px solid #65c3ff;
    border-radius: 12px;
    padding: 16px;
    max-width: 300px;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
  }
  
  .ghost-notification.show {
    transform: translateX(0);
  }
  
  .ghost-content h3 {
    margin: 0 0 8px 0;
    color: #65c3ff;
    font-size: 16px;
  }
  
  .ghost-content p {
    margin: 4px 0;
    font-size: 14px;
  }
`;
document.head.appendChild(ghostStyle);
