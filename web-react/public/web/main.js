/*
  UNISA: NOOOMIS Says — Digital, Dazzling, Delightfully Chaotic
  This button glows brighter than my future after debugging.
*/

// Enhanced save data structure - must be defined first
let saveData = {
  bestScore: parseInt(localStorage.getItem('best') || '0', 10),
  sessionCount: parseInt(localStorage.getItem('sessionCount') || '0', 10),
  totalGamesPlayed: parseInt(localStorage.getItem('totalGamesPlayed') || '0', 10),
  memoryShards: parseInt(localStorage.getItem('memoryShards') || '0', 10),
  unlockedThemes: JSON.parse(localStorage.getItem('unlockedThemes') || '["neon"]'),
  unlockedAudioPacks: JSON.parse(localStorage.getItem('unlockedAudioPacks') || '["classic"]'),
  unlockedModes: JSON.parse(localStorage.getItem('unlockedModes') || '["classic", "speed", "zen", "chaos"]'),
  unlockedLore: JSON.parse(localStorage.getItem('unlockedLore') || '[]'),
  corruptionPhase: parseInt(localStorage.getItem('corruptionPhase') || '0', 10),
  arcPhaseUnlocked: JSON.parse(localStorage.getItem('arcPhaseUnlocked') || '[true, false, false, false, false, false]'),
  buttonMissCounts: JSON.parse(localStorage.getItem('buttonMissCounts') || '[0, 0, 0, 0]'),
  liberationModeUnlocked: localStorage.getItem('liberationModeUnlocked') === 'true',
  bossFightCompleted: localStorage.getItem('bossFightCompleted') === 'true'
};

const pads = Array.from(document.querySelectorAll('.pad'));
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const modeSelect = document.getElementById('modeSelect');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const speakerEl = document.querySelector('.speaker');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayMsg = document.getElementById('overlayMsg');
const submitScore = document.getElementById('submitScore');
const playerName = document.getElementById('playerName');
const closeOverlay = document.getElementById('closeOverlay');
const startOverlay = document.getElementById('startOverlay');
const beginBtn = document.getElementById('beginBtn');
const startModeSelect = document.getElementById('startModeSelect');
const pauseOverlay = document.getElementById('pauseOverlay');
const resumeBtn = document.getElementById('resumeBtn');
const quitBtn = document.getElementById('quitBtn');
const livesEl = document.getElementById('lives');
const timerBar = document.getElementById('timerBar');

let sequence = [];
let inputIndex = 0;
let playingBack = false;
let paused = true;
let score = 0;
let best = saveData.bestScore;
bestEl.textContent = best;

let mode = 'classic';
let lives = 3;
let inputDeadline = 0;

let activeModifiers = [];
let modifierMultiplier = 1.0;
let survivalRounds = 0;

let bossRounds = 0;
let fakeFlashes = [];

let adaptiveDifficulty = {
  recentFails: [],
  recentScores: [],
  performanceHistory: [],
  currentMultiplier: 1.0,
  baseDelay: 700,
  minDelay: 300,
  maxDelay: 1200
};

let prefs = { theme: 'neon', soundPack: 'classic', muteSfx: false, muteMusic: true };

let accessibilitySettings = {
  colorblindMode: false,
  highContrastMode: false,
  vibrationEnabled: false,
  timingMultiplier: 1.0
};

function overlaysVisible() {
  return !startOverlay.classList.contains('hidden') ||
         !pauseOverlay.classList.contains('hidden') ||
         !gameOverOverlay.classList.contains('hidden');
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

class AudioPool {
  constructor(size = 8) {
    this.pool = [];
    this.available = [];
    this.initPool(size);
  }
  
  initPool(size) {
    // Don't pre-create oscillators to avoid drone
    this.poolSize = size;
  }
  
  get() {
    // Always create fresh oscillators
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.value = 0;
    return { osc, gain, temporary: true };
  }
  
  release(item) {
    try {
      item.gain.gain.value = 0;
      item.osc.stop();
      item.osc.disconnect();
      item.gain.disconnect();
    } catch (e) {}
  }
}

const audioPool = new AudioPool(8);

const soundPacks = {
  classic: { freqs: [220, 277, 329, 392], type: 'sine', gain: 0.07, duration: 0.18 },
  synth:   { freqs: [246.94, 293.66, 369.99, 440.00], type: 'sawtooth', gain: 0.06, duration: 0.20 },
  soft:    { freqs: [196.00, 246.94, 293.66, 329.63], type: 'triangle', gain: 0.05, duration: 0.22 }
};
let currentPack = soundPacks.classic;
let sampleBuffers = null;
let musicGain = audioCtx.createGain();
musicGain.gain.value = 0.0;
musicGain.connect(audioCtx.destination);
let musicOsc = null;

let audioPreloadProgress = 0;
let audioPreloadComplete = false;

function ensureMusic() {
  return; // Disable ambient music completely
}

function killMusic() {
  if (musicOsc) {
    try { musicOsc.stop(); } catch {}
    try { musicOsc.disconnect(); } catch {}
    musicOsc = null;
  }
  musicGain.gain.value = 0;
}

async function preloadAllAudio() {
  audioPreloadProgress = 0;
  audioPreloadComplete = false;
  
  const totalPacks = Object.keys(soundPacks).length;
  const totalFiles = totalPacks * 4;
  
  for (const [packName, pack] of Object.entries(soundPacks)) {
    const base = `assets/audio/${packName}`;
    const files = ["tone0.wav", "tone1.wav", "tone2.wav", "tone3.wav"];
    
    try {
      const buffers = await Promise.all(files.map(async (f) => {
        try {
          const res = await fetch(`${base}/${f}`);
          if (!res.ok) throw new Error('not found');
          const arr = await res.arrayBuffer();
          audioPreloadProgress++;
          return await audioCtx.decodeAudioData(arr);
        } catch {
          audioPreloadProgress++;
          return null;
        }
      }));
      
      if (buffers.every(b => !!b)) {
        soundPacks[packName].buffers = buffers;
      }
    } catch (e) {
      console.warn(`Failed to preload ${packName}:`, e);
    }
  }
  
  audioPreloadComplete = true;
  console.log(`Audio preload complete: ${audioPreloadProgress}/${totalFiles} files loaded`);
}

function setSoundPack(name) {
  currentPack = soundPacks[name] || soundPacks.classic;
  
  if (currentPack.buffers) {
    sampleBuffers = currentPack.buffers;
  } else {
    sampleBuffers = null;
  }
}

function playTone(index, duration = null) {
  if (sampleBuffers && sampleBuffers[index]) {
    const src = audioCtx.createBufferSource();
    src.buffer = sampleBuffers[index];
    const gain = audioCtx.createGain();
    gain.gain.value = prefs.muteSfx ? 0 : 0.8;
    src.connect(gain).connect(audioCtx.destination);
    src.start();
    return;
  }
  
  const audioItem = audioPool.get();
  const osc = audioItem.osc;
  const gain = audioItem.gain;
  
  const freq = currentPack.freqs[index % currentPack.freqs.length];
  osc.type = currentPack.type;
  osc.frequency.value = freq;
  const vol = prefs.muteSfx ? 0 : currentPack.gain;
  gain.gain.value = vol;
  
  try {
    osc.start();
  } catch (e) {
    const newItem = audioPool.get();
    newItem.osc.frequency.value = freq;
    newItem.osc.type = currentPack.type;
    newItem.gain.gain.value = vol;
    newItem.osc.start();
    
    const d = duration != null ? duration : currentPack.duration;
    setTimeout(() => {
      audioPool.release(newItem);
    }, d * 1000);
    return;
  }
  
  const d = duration != null ? duration : currentPack.duration;
  setTimeout(() => {
    audioPool.release(audioItem);
  }, d * 1000);
}

function setMusicIntensity(norm) {
  killMusic(); // Always kill music to prevent drone
  if (speakerEl) {
    const glow = Math.max(0, Math.min(1.5, norm));
    speakerEl.style.setProperty('--glow', String(glow));
  }
}

function updateScore(val) {
  score = val;
  scoreEl.textContent = score;
  setMusicIntensity(Math.min(1, 0.2 + score * 0.05));
}

function updateLives() {
  livesEl.textContent = lives;
}

function resetTimerBar() {
  if (timerBar) timerBar.style.width = '0%';
}

function updateTimerBar() {
  if (!timerBar) return;
  if (mode === 'speed' && !paused && !playingBack) {
    const now = performance.now();
    const remaining = Math.max(0, inputDeadline - now);
    const total = 900;
    const pct = Math.max(0, Math.min(100, (remaining / total) * 100));
    timerBar.style.width = `${pct}%`;
  } else {
    resetTimerBar();
  }
}

function appendStep() {
  const idx = Math.floor(Math.random() * pads.length);
  sequence.push(idx);
}

function pulsePad(idx, strong = false) {
  const pad = pads[idx];
  
  if (mode === 'echo' && playingBack) {
    speakerEl.style.setProperty('--glow', '0.5');
    setTimeout(() => speakerEl.style.setProperty('--glow', '0'), 200);
  } else {
    pad.classList.add('playback');
    setTimeout(() => pad.classList.remove('playback'), strong ? 260 : 180);
  }
  
  playTone(idx, strong ? 0.26 : 0.18);
}

function pulseFakePad(idx) {
  const pad = pads[idx];
  pad.classList.add('fake-flash');
  setTimeout(() => pad.classList.remove('fake-flash'), 180);
}

async function playSequence() {
  if (mode === 'boss' && fakeFlashes.length > 0) {
    return playBossSequence();
  }
  
  playingBack = true;
  let delay = adaptiveDifficulty.baseDelay;
  if (mode === 'speed') delay = 480;
  if (mode === 'zen') delay = 900;

  delay *= adaptiveDifficulty.currentMultiplier;
  delay *= accessibilitySettings.timingMultiplier;

  if (mode === 'chaos') {
    shuffleLayout();
  }

  await new Promise(r => setTimeout(r, delay));
  for (const idx of sequence) {
    if (paused) break;
    pulsePad(idx);
    vibrate([50]);
    await new Promise(r => setTimeout(r, delay));
  }
  playingBack = false;
  if (mode === 'speed') inputDeadline = performance.now() + (900 * accessibilitySettings.timingMultiplier * adaptiveDifficulty.currentMultiplier);
  updateTimerBar();
}

function startGame() {
  sequence = [];
  inputIndex = 0;
  updateScore(0);
  lives = 3;
  updateLives();
  resetTimerBar();
  
  resetAdaptiveDifficulty();
  
  if (mode === 'survival') {
    activeModifiers = [];
    modifierMultiplier = 1.0;
    survivalRounds = 0;
    lives = 999;
    updateLives();
  }
  
  if (mode === 'boss') {
    bossRounds = 0;
    fakeFlashes = [];
  }
  
  if (mode === 'liberation') {
    document.body.classList.remove('ui-glitch', 'boss-corruption');
  }
  
  appendStep();
  playSequence();
  paused = false;
  document.querySelector('.board').classList.remove('dimmed');
  document.querySelector('.speaker .controls').classList.add('hidden');
  setMusicIntensity(Math.min(1, 0.2 + score * 0.05));
}

function fail() {
  adaptiveDifficulty.recentFails.push(true);
  if (adaptiveDifficulty.recentFails.length > 5) {
    adaptiveDifficulty.recentFails.shift();
  }
  
  updateAdaptiveDifficulty();
  
  if (mode === 'zen') {
    inputIndex = 0;
    playSequence();
    return;
  }
  lives -= 1;
  updateLives();
  if (lives <= 0) {
    best = Math.max(best, score);
    localStorage.setItem('best', String(best));
    bestEl.textContent = best;
    gameOverOverlay.classList.remove('hidden');
    document.querySelector('.board').classList.add('dimmed');
    document.querySelector('.speaker .controls').classList.remove('hidden');
    
    overlayTitle.textContent = 'Game Over';
    overlayMsg.textContent = 'That sequence twisted harder than my spaghetti code.';
    
    resetTimerBar();
  } else {
    inputIndex = 0;
    playSequence();
  }
}

function handlePadPress(idx) {
  if (playingBack || paused) return;
  if (mode === 'speed' && performance.now() > inputDeadline) return fail();

  pulsePad(idx, true);
  vibrate([100]);
  
  let expected;
  if (mode === 'mirror') {
    expected = sequence[sequence.length - 1 - inputIndex];
  } else {
    expected = sequence[inputIndex];
  }
  
  if (idx === expected) {
    inputIndex += 1;
    if (mode === 'speed') {
      inputDeadline = performance.now() + (900 * accessibilitySettings.timingMultiplier);
      updateTimerBar();
    }
    if (inputIndex >= sequence.length) {
      updateScore(score + 1);
      inputIndex = 0;
      
      adaptiveDifficulty.recentFails.push(false);
      if (adaptiveDifficulty.recentFails.length > 5) {
        adaptiveDifficulty.recentFails.shift();
      }
      
      updateAdaptiveDifficulty();
      
      if (mode === 'survival') {
        survivalRounds++;
        if (survivalRounds % 3 === 0) {
          addSurvivalModifier();
        }
      }
      
      if (mode === 'boss') {
        bossRounds++;
        if (bossRounds % 5 === 0) {
          addBossFakeFlashes();
        }
      }
      
      appendStep();
      playSequence();
    }
  } else {
    recordButtonMiss(idx);
    vibrate([200, 100, 200]);
    fail();
  }
}

function shuffleLayout() {
  const container = document.querySelector('.board');
  const shuffled = [...pads];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  shuffled.forEach(p => container.appendChild(p));
}

function addSurvivalModifier() {
  const modifiers = [
    { name: 'speed', effect: 'Speed +20%', multiplier: 1.2 },
    { name: 'chaos', effect: 'Chaos Layout', multiplier: 1.3 },
    { name: 'inverted', effect: 'Inverted Controls', multiplier: 1.5 },
    { name: 'fake', effect: 'Fake Flashes', multiplier: 1.4 }
  ];
  
  const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
  activeModifiers.push(modifier);
  modifierMultiplier *= modifier.multiplier;
  
  showModifierNotification(modifier.effect);
  
  if (modifier.name === 'chaos') {
    shuffleLayout();
  }
}

function showModifierNotification(text) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--accent);
    color: #031225;
    padding: 16px 24px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 18px;
    z-index: 1000;
    animation: fadeInOut 2s ease-in-out;
  `;
  notification.textContent = text;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 2000);
}

const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
  }
`;
document.head.appendChild(style);

function updateAdaptiveDifficulty() {
  if (adaptiveDifficulty.recentFails.length < 3) return;
  
  const failRate = adaptiveDifficulty.recentFails.filter(f => f).length / adaptiveDifficulty.recentFails.length;
  const successRate = 1 - failRate;
  
  if (failRate >= 0.6) {
    adaptiveDifficulty.currentMultiplier = Math.min(1.2, adaptiveDifficulty.currentMultiplier * 1.1);
  } else if (successRate >= 0.8) {
    adaptiveDifficulty.currentMultiplier = Math.max(0.8, adaptiveDifficulty.currentMultiplier * 0.9);
  }
  
  adaptiveDifficulty.performanceHistory.push({
    timestamp: Date.now(),
    score: score,
    failRate: failRate,
    multiplier: adaptiveDifficulty.currentMultiplier
  });
  
  if (adaptiveDifficulty.performanceHistory.length > 20) {
    adaptiveDifficulty.performanceHistory.shift();
  }
}

function resetAdaptiveDifficulty() {
  adaptiveDifficulty.currentMultiplier = 1.0;
  adaptiveDifficulty.recentFails = [];
  adaptiveDifficulty.performanceHistory = [];
}

function addBossFakeFlashes() {
  const numFakes = Math.floor(Math.random() * 2) + 1;
  fakeFlashes = [];
  
  for (let i = 0; i < numFakes; i++) {
    let fakeIdx;
    do {
      fakeIdx = Math.floor(Math.random() * pads.length);
    } while (sequence.includes(fakeIdx) || fakeFlashes.includes(fakeIdx));
    
    fakeFlashes.push(fakeIdx);
  }
  
  showModifierNotification(`BOSS ROUND! ${numFakes} fake flash${numFakes > 1 ? 'es' : ''} added!`);
}

async function playBossSequence() {
  playingBack = true;
  let delay = 700;
  
  delay *= accessibilitySettings.timingMultiplier;
  
  await new Promise(r => setTimeout(r, delay));
  
  for (const idx of sequence) {
    if (paused) break;
    pulsePad(idx);
    vibrate([50]);
    await new Promise(r => setTimeout(r, delay));
  }
  
  for (const idx of fakeFlashes) {
    if (paused) break;
    pulseFakePad(idx);
    await new Promise(r => setTimeout(r, delay));
  }
  
  playingBack = false;
  updateTimerBar();
}

function saveGameData() {
  localStorage.setItem('best', saveData.bestScore.toString());
  localStorage.setItem('sessionCount', saveData.sessionCount.toString());
  localStorage.setItem('totalGamesPlayed', saveData.totalGamesPlayed.toString());
  localStorage.setItem('memoryShards', saveData.memoryShards.toString());
  localStorage.setItem('unlockedThemes', JSON.stringify(saveData.unlockedThemes));
  localStorage.setItem('unlockedAudioPacks', JSON.stringify(saveData.unlockedAudioPacks));
  localStorage.setItem('unlockedModes', JSON.stringify(saveData.unlockedModes));
  localStorage.setItem('unlockedLore', JSON.stringify(saveData.unlockedLore));
  localStorage.setItem('corruptionPhase', saveData.corruptionPhase.toString());
  localStorage.setItem('arcPhaseUnlocked', JSON.stringify(saveData.arcPhaseUnlocked));
  localStorage.setItem('buttonMissCounts', JSON.stringify(saveData.buttonMissCounts));
  localStorage.setItem('liberationModeUnlocked', saveData.liberationModeUnlocked.toString());
  localStorage.setItem('bossFightCompleted', saveData.bossFightCompleted.toString());
}

function incrementSession() {
  saveData.sessionCount++;
  saveGameData();
}

function incrementGamesPlayed() {
  saveData.totalGamesPlayed++;
  saveGameData();
}

function updateBestScore(newScore) {
  if (newScore > saveData.bestScore) {
    saveData.bestScore = newScore;
    best = newScore;
    bestEl.textContent = best;
    saveGameData();
  }
}

function recordButtonMiss(buttonIndex) {
  if (buttonIndex >= 0 && buttonIndex < saveData.buttonMissCounts.length) {
    saveData.buttonMissCounts[buttonIndex]++;
    saveGameData();
  }
}

function vibrate(pattern = [100]) {
  if (accessibilitySettings.vibrationEnabled && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

function loadAccessibilitySettings() {
  try {
    const settings = JSON.parse(localStorage.getItem('nomis-settings') || '{}');
    accessibilitySettings = {
      colorblindMode: settings.colorblindMode || false,
      highContrastMode: settings.highContrast || false,
      vibrationEnabled: settings.vibrationEnabled || false,
      timingMultiplier: parseFloat(settings.timingMultiplier) || 1.0
    };
  } catch {}
  
  applyAccessibilitySettings();
}

function applyAccessibilitySettings() {
  const body = document.body;
  
  if (accessibilitySettings.colorblindMode) {
    body.classList.add('colorblind');
    pads.forEach(pad => pad.classList.add('colorblind'));
  } else {
    body.classList.remove('colorblind');
    pads.forEach(pad => pad.classList.remove('colorblind'));
  }
  
  if (accessibilitySettings.highContrastMode) {
    body.classList.add('high-contrast');
  } else {
    body.classList.remove('high-contrast');
  }
  
  if (accessibilitySettings.vibrationEnabled) {
    body.classList.add('vibration-enabled');
  } else {
    body.classList.remove('vibration-enabled');
  }
}

function loadPrefs() {
  try {
    const saved = JSON.parse(localStorage.getItem('nomis-prefs') || '{}');
    prefs = { ...prefs, ...saved };
  } catch {}
  applyTheme();
  setSoundPack(prefs.soundPack);
  killMusic();
  updateLives();
  resetTimerBar();
}

function applyTheme() {
  document.body.classList.remove('theme-neon', 'theme-grid', 'theme-mono');
  document.body.classList.add(`theme-${prefs.theme}`);
}

// Event listeners
pads.forEach(p => {
  p.addEventListener('click', () => handlePadPress(parseInt(p.dataset.index, 10)));
});

startBtn.addEventListener('click', () => {
  startOverlay.classList.remove('hidden');
  startOverlay.setAttribute('aria-hidden', 'false');
  document.querySelector('.board').classList.add('dimmed');
  document.querySelector('.speaker .controls').classList.remove('hidden');
  killMusic();
});

pauseBtn.addEventListener('click', () => {
  paused = true;
  pauseOverlay.classList.remove('hidden');
  pauseOverlay.setAttribute('aria-hidden', 'false');
  document.querySelector('.board').classList.add('dimmed');
  document.querySelector('.speaker .controls').classList.remove('hidden');
  pauseBtn.textContent = 'Resume';
  updateTimerBar();
  killMusic();
});

modeSelect.addEventListener('change', () => {
  mode = modeSelect.value;
});

if (beginBtn) {
  beginBtn.addEventListener('click', () => {
    mode = startModeSelect.value;
    if (audioCtx.state !== 'running') {
      audioCtx.resume();
    }
    startOverlay.classList.add('hidden');
    startOverlay.setAttribute('aria-hidden', 'true');
    document.querySelector('.board').classList.remove('dimmed');
    startGame();
    setMusicIntensity(Math.min(1, 0.2 + score * 0.05));
  });
}

resumeBtn.addEventListener('click', () => {
  if (audioCtx.state !== 'running') {
    audioCtx.resume();
  }
  paused = false;
  pauseOverlay.classList.add('hidden');
  pauseOverlay.setAttribute('aria-hidden', 'true');
  document.querySelector('.board').classList.remove('dimmed');
  document.querySelector('.speaker .controls').classList.add('hidden');
  pauseBtn.textContent = 'Pause';
  updateTimerBar();
  setMusicIntensity(Math.min(1, 0.2 + score * 0.05));
});

quitBtn.addEventListener('click', () => {
  try {
    if (window.cordova && navigator && navigator.app && typeof navigator.app.exitApp === 'function') {
      navigator.app.exitApp();
      return;
    }
  } catch {}
  killMusic();
  window.location.href = 'welcome.html';
});

submitScore.addEventListener('click', () => {
  const raw = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  raw.push({ name: playerName.value || 'Player', score });
  raw.sort((a, b) => b.score - a.score);
  localStorage.setItem('leaderboard', JSON.stringify(raw));
  
  updateBestScore(score);
  incrementGamesPlayed();
  
  gameOverOverlay.classList.add('hidden');
  gameOverOverlay.setAttribute('aria-hidden', 'true');
  document.querySelector('.board').classList.remove('dimmed');
  document.querySelector('.speaker .controls').classList.remove('hidden');
});

closeOverlay.addEventListener('click', () => {
  gameOverOverlay.classList.add('hidden');
  gameOverOverlay.setAttribute('aria-hidden', 'true');
  document.querySelector('.board').classList.remove('dimmed');
  document.querySelector('.speaker .controls').classList.remove('hidden');
});

// Gamepad support
let gamepadIndex = null;
window.addEventListener('gamepadconnected', (e) => {
  gamepadIndex = e.gamepad.index;
});
window.addEventListener('gamepaddisconnected', () => { gamepadIndex = null; });

function pollGamepad() {
  if (gamepadIndex === null) return;
  const gp = navigator.getGamepads()[gamepadIndex];
  if (!gp) return;
  gp.buttons.forEach((btn, i) => {
    if (btn.pressed && i >= 0 && i <= 3) {
      handlePadPress(i);
    }
  });
}

function loop() {
  pollGamepad();
  updateTimerBar();
  requestAnimationFrame(loop);
}

// Keyboard support
window.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const map = {
    ArrowLeft: 0,
    ArrowDown: 1,
    ArrowUp: 2,
    ArrowRight: 3,
    KeyQ: 0,
    KeyW: 1,
    KeyA: 2,
    KeyS: 3,
    Digit1: 0,
    Digit2: 1,
    Digit3: 2,
    Digit4: 3,
  };
  const idx = map[e.code];
  if (idx !== undefined) {
    e.preventDefault();
    handlePadPress(idx);
  }
});

// Initialize
incrementSession();
loadPrefs();
loadAccessibilitySettings();
preloadAllAudio();
loop();