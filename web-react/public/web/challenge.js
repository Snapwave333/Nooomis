/*
  NOOOMIS Challenge-a-Friend System
  Generate shareable links with custom sequences
*/

class ChallengeSystem {
  constructor() {
    this.currentChallenge = null;
    this.challengeMode = 'normal'; // normal, timeAttack, perfect
    this.challengeData = null;
  }
  
  // Generate a new challenge
  generateChallenge(options = {}) {
    const challenge = {
      id: this.generateChallengeId(),
      creator: options.creator || 'Player',
      mode: options.mode || 'classic',
      difficulty: options.difficulty || 'medium',
      type: options.type || 'normal',
      sequence: this.generateSequence(options.difficulty || 'medium'),
      timestamps: [],
      timeLimit: options.timeLimit || null,
      perfectMode: options.perfectMode || false,
      createdAt: new Date().toISOString(),
      expiresAt: this.getExpirationDate(),
      attempts: 0,
      bestScore: 0,
      bestTime: null,
      completed: false
    };
    
    this.currentChallenge = challenge;
    this.saveChallenge(challenge);
    
    return challenge;
  }
  
  // Generate challenge ID
  generateChallengeId() {
    return 'challenge_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Generate sequence based on difficulty
  generateSequence(difficulty) {
    const difficulties = {
      easy: { length: 8, speed: 1.0 },
      medium: { length: 12, speed: 0.8 },
      hard: { length: 16, speed: 0.6 },
      expert: { length: 20, speed: 0.5 }
    };
    
    const config = difficulties[difficulty] || difficulties.medium;
    const sequence = [];
    
    for (let i = 0; i < config.length; i++) {
      sequence.push(Math.floor(Math.random() * 4));
    }
    
    return sequence;
  }
  
  // Get expiration date (7 days from now)
  getExpirationDate() {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString();
  }
  
  // Save challenge to localStorage
  saveChallenge(challenge) {
    try {
      const challenges = this.getSavedChallenges();
      challenges[challenge.id] = challenge;
      localStorage.setItem('nomis-challenges', JSON.stringify(challenges));
    } catch (e) {
      console.warn('Failed to save challenge:', e);
    }
  }
  
  // Get saved challenges
  getSavedChallenges() {
    try {
      const saved = localStorage.getItem('nomis-challenges');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.warn('Failed to load challenges:', e);
      return {};
    }
  }
  
  // Load challenge by ID
  loadChallenge(challengeId) {
    const challenges = this.getSavedChallenges();
    return challenges[challengeId] || null;
  }
  
  // Create shareable link
  createShareableLink(challenge) {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      challenge: challenge.id,
      mode: challenge.mode,
      type: challenge.type
    });
    
    return `${baseUrl}?${params.toString()}`;
  }
  
  // Parse challenge from URL
  parseChallengeFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const challengeId = urlParams.get('challenge');
    
    if (challengeId) {
      const challenge = this.loadChallenge(challengeId);
      if (challenge && !this.isChallengeExpired(challenge)) {
        this.currentChallenge = challenge;
        return challenge;
      }
    }
    
    return null;
  }
  
  // Check if challenge is expired
  isChallengeExpired(challenge) {
    return new Date() > new Date(challenge.expiresAt);
  }
  
  // Start challenge
  startChallenge(challenge) {
    if (!challenge) return false;
    
    this.currentChallenge = challenge;
    this.challengeData = {
      startTime: Date.now(),
      score: 0,
      mistakes: 0,
      sequence: [...challenge.sequence],
      inputIndex: 0
    };
    
    this.showChallengeStartNotification(challenge);
    return true;
  }
  
  // Update challenge progress
  updateChallengeProgress(score, time, mistakes = 0) {
    if (!this.currentChallenge || !this.challengeData) return;
    
    this.challengeData.score = Math.max(this.challengeData.score, score);
    this.challengeData.mistakes = mistakes;
    
    // Update challenge record
    this.currentChallenge.attempts++;
    this.currentChallenge.bestScore = Math.max(this.currentChallenge.bestScore, score);
    
    if (this.currentChallenge.timeLimit && time < this.currentChallenge.bestTime) {
      this.currentChallenge.bestTime = time;
    }
    
    this.saveChallenge(this.currentChallenge);
  }
  
  // Complete challenge
  completeChallenge(score, time, mistakes = 0) {
    if (!this.currentChallenge) return false;
    
    this.updateChallengeProgress(score, time, mistakes);
    
    const success = this.checkChallengeSuccess(score, time, mistakes);
    
    if (success) {
      this.currentChallenge.completed = true;
      this.saveChallenge(this.currentChallenge);
      this.showChallengeSuccessNotification();
    } else {
      this.showChallengeFailureNotification();
    }
    
    return success;
  }
  
  // Check if challenge was successful
  checkChallengeSuccess(score, time, mistakes) {
    if (!this.currentChallenge) return false;
    
    const challenge = this.currentChallenge;
    
    // Check score requirement
    if (score < challenge.sequence.length) return false;
    
    // Check time limit
    if (challenge.timeLimit && time > challenge.timeLimit) return false;
    
    // Check perfect mode
    if (challenge.perfectMode && mistakes > 0) return false;
    
    return true;
  }
  
  // Show challenge start notification
  showChallengeStartNotification(challenge) {
    const notification = document.createElement('div');
    notification.className = 'challenge-start-notification';
    notification.innerHTML = `
      <div class="challenge-start-content">
        <h3>🎯 Challenge Accepted!</h3>
        <h4>${challenge.creator}'s Challenge</h4>
        <p>Mode: ${challenge.mode}</p>
        <p>Difficulty: ${challenge.difficulty}</p>
        <p>Sequence Length: ${challenge.sequence.length}</p>
        ${challenge.timeLimit ? `<p>Time Limit: ${challenge.timeLimit}s</p>` : ''}
        ${challenge.perfectMode ? '<p>Perfect Mode: No mistakes allowed!</p>' : ''}
        <p>Complete the sequence to win!</p>
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
  
  // Show challenge success notification
  showChallengeSuccessNotification() {
    const notification = document.createElement('div');
    notification.className = 'challenge-success-notification';
    notification.innerHTML = `
      <div class="challenge-success-content">
        <h3>🎉 Challenge Completed!</h3>
        <p>You successfully completed the challenge!</p>
        <p>Score: ${this.challengeData?.score || 0}</p>
        <p>Mistakes: ${this.challengeData?.mistakes || 0}</p>
        <p>Well done!</p>
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
  
  // Show challenge failure notification
  showChallengeFailureNotification() {
    const notification = document.createElement('div');
    notification.className = 'challenge-failure-notification';
    notification.innerHTML = `
      <div class="challenge-failure-content">
        <h3>😔 Challenge Failed</h3>
        <p>You didn't complete the challenge this time.</p>
        <p>Score: ${this.challengeData?.score || 0}</p>
        <p>Mistakes: ${this.challengeData?.mistakes || 0}</p>
        <p>Try again!</p>
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
  
  // Get challenge statistics
  getChallengeStats() {
    const challenges = this.getSavedChallenges();
    const stats = {
      total: Object.keys(challenges).length,
      completed: 0,
      attempts: 0,
      bestScore: 0,
      averageScore: 0
    };
    
    if (stats.total === 0) return stats;
    
    Object.values(challenges).forEach(challenge => {
      if (challenge.completed) stats.completed++;
      stats.attempts += challenge.attempts;
      stats.bestScore = Math.max(stats.bestScore, challenge.bestScore);
    });
    
    stats.averageScore = Math.round(
      Object.values(challenges).reduce((sum, c) => sum + c.bestScore, 0) / stats.total
    );
    
    return stats;
  }
  
  // Clear expired challenges
  clearExpiredChallenges() {
    const challenges = this.getSavedChallenges();
    const activeChallenges = {};
    
    Object.entries(challenges).forEach(([id, challenge]) => {
      if (!this.isChallengeExpired(challenge)) {
        activeChallenges[id] = challenge;
      }
    });
    
    localStorage.setItem('nomis-challenges', JSON.stringify(activeChallenges));
  }
}

// Global challenge system instance
const challengeSystem = new ChallengeSystem();

// Helper functions for main.js integration
function createFriendChallenge(options = {}) {
  const challenge = challengeSystem.generateChallenge(options);
  const shareableLink = challengeSystem.createShareableLink(challenge);
  
  // Show share dialog
  showShareDialog(challenge, shareableLink);
  
  return { challenge, shareableLink };
}

function showShareDialog(challenge, shareableLink) {
  const dialog = document.createElement('div');
  dialog.className = 'share-dialog';
  dialog.innerHTML = `
    <div class="share-content">
      <h3>🎯 Challenge Created!</h3>
      <p>Share this link with your friend:</p>
      <div class="share-link">
        <input type="text" value="${shareableLink}" readonly>
        <button class="copy-btn">Copy</button>
      </div>
      <div class="challenge-info">
        <p><strong>Mode:</strong> ${challenge.mode}</p>
        <p><strong>Difficulty:</strong> ${challenge.difficulty}</p>
        <p><strong>Sequence Length:</strong> ${challenge.sequence.length}</p>
        ${challenge.timeLimit ? `<p><strong>Time Limit:</strong> ${challenge.timeLimit}s</p>` : ''}
        ${challenge.perfectMode ? '<p><strong>Perfect Mode:</strong> No mistakes allowed</p>' : ''}
      </div>
      <div class="share-actions">
        <button class="close-btn">Close</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  // Add event listeners
  dialog.querySelector('.copy-btn').addEventListener('click', () => {
    const input = dialog.querySelector('input');
    input.select();
    document.execCommand('copy');
    
    const btn = dialog.querySelector('.copy-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  });
  
  dialog.querySelector('.close-btn').addEventListener('click', () => {
    document.body.removeChild(dialog);
  });
}

function loadChallengeFromUrl() {
  return challengeSystem.parseChallengeFromUrl();
}

function startChallengeFromUrl() {
  const challenge = loadChallengeFromUrl();
  if (challenge) {
    return challengeSystem.startChallenge(challenge);
  }
  return false;
}

function updateChallengeProgress(score, time, mistakes = 0) {
  return challengeSystem.updateChallengeProgress(score, time, mistakes);
}

function completeChallenge(score, time, mistakes = 0) {
  return challengeSystem.completeChallenge(score, time, mistakes);
}

function getChallengeStats() {
  return challengeSystem.getChallengeStats();
}

// Add CSS for challenge notifications
const challengeStyle = document.createElement('style');
challengeStyle.textContent = `
  .challenge-start-notification, .challenge-success-notification, .challenge-failure-notification {
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
  
  .challenge-start-notification.show, .challenge-success-notification.show, .challenge-failure-notification.show {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  
  .challenge-start-content h3, .challenge-success-content h3, .challenge-failure-content h3 {
    margin: 0 0 8px 0;
    color: var(--accent);
    font-size: 18px;
  }
  
  .challenge-start-content h4 {
    margin: 0 0 8px 0;
    color: var(--text);
    font-size: 16px;
  }
  
  .challenge-start-content p, .challenge-success-content p, .challenge-failure-content p {
    margin: 4px 0;
    font-size: 14px;
  }
  
  .share-dialog {
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
  
  .share-content {
    background: var(--panel);
    border: 2px solid var(--accent);
    border-radius: 12px;
    padding: 20px;
    max-width: 500px;
  }
  
  .share-content h3 {
    margin: 0 0 16px 0;
    color: var(--accent);
    text-align: center;
  }
  
  .share-link {
    display: flex;
    gap: 8px;
    margin: 16px 0;
  }
  
  .share-link input {
    flex: 1;
    background: var(--panel);
    color: var(--text);
    border: 1px solid var(--accent);
    border-radius: 4px;
    padding: 8px;
    font-size: 12px;
  }
  
  .copy-btn {
    background: var(--accent);
    color: #031225;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
  }
  
  .challenge-info {
    background: rgba(101, 195, 255, 0.1);
    border: 1px solid var(--accent);
    border-radius: 8px;
    padding: 12px;
    margin: 16px 0;
  }
  
  .challenge-info p {
    margin: 4px 0;
    font-size: 14px;
  }
  
  .share-actions {
    text-align: center;
    margin-top: 16px;
  }
  
  .close-btn {
    background: var(--accent);
    color: #031225;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
  }
`;
document.head.appendChild(challengeStyle);
