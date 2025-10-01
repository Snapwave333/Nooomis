/*
  UNISA: NOMIS Says — Digital, Dazzling, Delightfully Chaotic
  This button glows brighter than my future after debugging.
*/

const pads = Array.from(document.querySelectorAll('.pad'));
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const modeSelect = document.getElementById('modeSelect');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const speakerEl = document.querySelector('.speaker');
const boardList = document.getElementById('boardList');
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
const settingsBtn = document.getElementById('settingsBtn');
const settingsOverlay = document.getElementById('settingsOverlay');
const themeSelect = document.getElementById('themeSelect');
const soundPackSelect = document.getElementById('soundPackSelect');
const muteSfx = document.getElementById('muteSfx');
const muteMusic = document.getElementById('muteMusic');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const livesEl = document.getElementById('lives');
const timerBar = document.getElementById('timerBar');

let sequence = [];
let inputIndex = 0;
let playingBack = false;
let paused = true; // start paused with start overlay
let score = 0;
let best = parseInt(localStorage.getItem('best') || '0', 10);
bestEl.textContent = best;

let mode = 'classic';
let lives = 3;
let inputDeadline = 0;
let prefs = { theme: 'neon', soundPack: 'classic', muteSfx: false, muteMusic: false };

// Simple WebAudio tones
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// Sound packs: simple oscillator-based flavors
const soundPacks = {
  classic: { freqs: [220, 277, 329, 392], type: 'sine', gain: 0.07, duration: 0.18 },
  synth:   { freqs: [246.94, 293.66, 369.99, 440.00], type: 'sawtooth', gain: 0.06, duration: 0.20 },
  soft:    { freqs: [196.00, 246.94, 293.66, 329.63], type: 'triangle', gain: 0.05, duration: 0.22 }
};
let currentPack = soundPacks.classic;
let sampleBuffers = null; // optional decoded AudioBuffers for the current pack
let musicGain = audioCtx.createGain();
musicGain.gain.value = 0.0; // silent until start
musicGain.connect(audioCtx.destination);
let musicOsc = audioCtx.createOscillator();
musicOsc.type = 'triangle';
musicOsc.frequency.value = 120; // low drone-ish
musicOsc.connect(musicGain);
musicOsc.start();

function setSoundPack(name) {
  currentPack = soundPacks[name] || soundPacks.classic;
  // Try to load sample buffers for this pack. Fallback to oscillators if missing.
  const base = `assets/audio/${name}`;
  const files = ["tone0.wav", "tone1.wav", "tone2.wav", "tone3.wav"];
  Promise.all(files.map(async (f) => {
    try {
      const res = await fetch(`${base}/${f}`);
      if (!res.ok) throw new Error('not found');
      const arr = await res.arrayBuffer();
      return await audioCtx.decodeAudioData(arr);
    } catch {
      return null;
    }
  })).then(buffers => {
    if (buffers.every(b => !!b)) {
      sampleBuffers = buffers;
    } else {
      sampleBuffers = null;
    }
  }).catch(() => { sampleBuffers = null; });
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
  const freq = currentPack.freqs[index % currentPack.freqs.length];
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = currentPack.type;
  osc.frequency.value = freq;
  const vol = prefs.muteSfx ? 0 : currentPack.gain;
  gain.gain.value = vol;
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  const d = duration != null ? duration : currentPack.duration;
  setTimeout(() => { osc.stop(); }, d * 1000);
}

function setMusicIntensity(norm) {
  // 0..1 -> gain and slight pitch change
  const baseGain = Math.min(0.2, 0.05 + norm * 0.15);
  musicGain.gain.value = prefs.muteMusic ? 0 : baseGain;
  musicOsc.frequency.value = 100 + norm * 60;
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
    const total = 900; // matches input window in speed mode
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
  pad.classList.add('playback');
  playTone(idx, strong ? 0.26 : 0.18);
  setTimeout(() => pad.classList.remove('playback'), strong ? 260 : 180);
}

async function playSequence() {
  playingBack = true;
  let delay = 700;
  if (mode === 'speed') delay = 480;
  if (mode === 'zen') delay = 900;

  if (mode === 'chaos') {
    shuffleLayout();
  }

  await new Promise(r => setTimeout(r, delay));
  for (const idx of sequence) {
    if (paused) break;
    pulsePad(idx);
    await new Promise(r => setTimeout(r, delay));
  }
  playingBack = false;
  if (mode === 'speed') inputDeadline = performance.now() + 900;
  updateTimerBar();
}

function startGame() {
  sequence = [];
  inputIndex = 0;
  updateScore(0);
  lives = 3;
  updateLives();
  resetTimerBar();
  appendStep();
  playSequence();
  paused = false;
  document.querySelector('.board').classList.remove('dimmed');
  setMusicIntensity(Math.min(1, 0.2 + score * 0.05));
}

function fail() {
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
  const expected = sequence[inputIndex];
  if (idx === expected) {
    inputIndex += 1;
    if (mode === 'speed') {
      inputDeadline = performance.now() + 900;
      updateTimerBar();
    }
    if (inputIndex >= sequence.length) {
      updateScore(score + 1);
      inputIndex = 0;
      appendStep();
      playSequence();
    }
  } else {
    fail();
  }
}

function shuffleLayout() {
  const container = document.querySelector('.board');
  // Fisher-Yates shuffle to avoid bias
  const shuffled = [...pads];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  shuffled.forEach(p => container.appendChild(p));
}

pads.forEach(p => {
  p.addEventListener('click', () => handlePadPress(parseInt(p.dataset.index, 10)));
});

startBtn.addEventListener('click', () => {
  startOverlay.classList.remove('hidden');
  startOverlay.setAttribute('aria-hidden', 'false');
  document.querySelector('.board').classList.add('dimmed');
});

pauseBtn.addEventListener('click', () => {
  paused = true;
  pauseOverlay.classList.remove('hidden');
  pauseOverlay.setAttribute('aria-hidden', 'false');
  document.querySelector('.board').classList.add('dimmed');
  pauseBtn.textContent = 'Resume';
  updateTimerBar();
});

modeSelect.addEventListener('change', () => {
  mode = modeSelect.value;
});

beginBtn.addEventListener('click', () => {
  // apply selected start mode
  mode = startModeSelect.value;
  // resume audio after user gesture to avoid autoplay policies
  if (audioCtx.state !== 'running') {
    audioCtx.resume();
  }
  startOverlay.classList.add('hidden');
  startOverlay.setAttribute('aria-hidden', 'true');
  document.querySelector('.board').classList.remove('dimmed');
  startGame();
});

resumeBtn.addEventListener('click', () => {
  if (audioCtx.state !== 'running') {
    audioCtx.resume();
  }
  paused = false;
  pauseOverlay.classList.add('hidden');
  pauseOverlay.setAttribute('aria-hidden', 'true');
  document.querySelector('.board').classList.remove('dimmed');
  pauseBtn.textContent = 'Pause';
  updateTimerBar();
});

quitBtn.addEventListener('click', () => {
  paused = true;
  sequence = [];
  inputIndex = 0;
  document.querySelector('.board').classList.add('dimmed');
  startOverlay.classList.remove('hidden');
  startOverlay.setAttribute('aria-hidden', 'false');
  resetTimerBar();
});

// Leaderboard (local)
function renderBoard() {
  const raw = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  boardList.innerHTML = '';
  raw.slice(0, 10).forEach(({ name, score }, i) => {
    const li = document.createElement('li');
    li.textContent = `${i + 1}. ${name} — ${score}`;
    boardList.appendChild(li);
  });
}

renderBoard();

submitScore.addEventListener('click', () => {
  const raw = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  raw.push({ name: playerName.value || 'Player', score });
  raw.sort((a, b) => b.score - a.score);
  localStorage.setItem('leaderboard', JSON.stringify(raw));
  renderBoard();
  gameOverOverlay.classList.add('hidden');
  gameOverOverlay.setAttribute('aria-hidden', 'true');
  document.querySelector('.board').classList.remove('dimmed');
});

closeOverlay.addEventListener('click', () => {
  gameOverOverlay.classList.add('hidden');
  gameOverOverlay.setAttribute('aria-hidden', 'true');
  document.querySelector('.board').classList.remove('dimmed');
});

// Gamepad support: map buttons A,B,X,Y to pads 0..3
let gamepadIndex = null;
window.addEventListener('gamepadconnected', (e) => {
  gamepadIndex = e.gamepad.index;
});
window.addEventListener('gamepaddisconnected', () => { gamepadIndex = null; });

function pollGamepad() {
  if (gamepadIndex === null) return;
  const gp = navigator.getGamepads()[gamepadIndex];
  if (!gp) return;
  // Xbox/PS mapping: 0=A/Cross,1=B/Circle,2=X/Square,3=Y/Triangle
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
loop();
// Settings overlay
settingsBtn.addEventListener('click', () => {
  settingsOverlay.classList.remove('hidden');
  settingsOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add(`theme-${prefs.theme}`);
});

function applyTheme() {
  document.body.classList.remove('theme-neon', 'theme-grid', 'theme-mono');
  document.body.classList.add(`theme-${prefs.theme}`);
}

function loadPrefs() {
  try {
    const saved = JSON.parse(localStorage.getItem('nomis-prefs') || '{}');
    prefs = { ...prefs, ...saved };
  } catch {}
  themeSelect.value = prefs.theme;
  soundPackSelect.value = prefs.soundPack;
  muteSfx.checked = !!prefs.muteSfx;
  muteMusic.checked = !!prefs.muteMusic;
  applyTheme();
  setSoundPack(prefs.soundPack);
  // Adjust music gain if needed
  setMusicIntensity(Math.min(1, 0.2 + score * 0.05));
  updateLives();
  resetTimerBar();
}

function savePrefs() {
  localStorage.setItem('nomis-prefs', JSON.stringify(prefs));
}

saveSettingsBtn.addEventListener('click', () => {
  prefs.theme = themeSelect.value;
  prefs.soundPack = soundPackSelect.value;
  prefs.muteSfx = muteSfx.checked;
  prefs.muteMusic = muteMusic.checked;
  applyTheme();
  setSoundPack(prefs.soundPack);
  savePrefs();
  settingsOverlay.classList.add('hidden');
  settingsOverlay.setAttribute('aria-hidden', 'true');
});

closeSettingsBtn.addEventListener('click', () => {
  settingsOverlay.classList.add('hidden');
  settingsOverlay.setAttribute('aria-hidden', 'true');
});

loadPrefs();

// Keyboard support: map arrows, WASD/QWAS, and 1-4 to pads 0..3
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