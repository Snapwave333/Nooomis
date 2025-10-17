# NOOOMIS — React client

A modern React + TypeScript implementation of the NOOOMIS Simon memory game.

This is the primary web client used for development. It works in Vite dev, static web builds, and is packaged for Android/Windows by scripts in the repository root. For packaging instructions, see the root README.

## Features

- Pages: Welcome, Tutorial, Classic, Challenges, and Settings
- Tutorial page with a demo Simon board and basic how-to-play
- Challenge modes:
  - Speed Up: tempo increases over rounds (shorter tone/gap)
  - Reverse: sequence plays reversed and requires reversed input
- GameShell top bar with Back, Pause/Resume, and contextual mode label
- Audio settings persisted (volume, mute, waveform, and audio packs)
- Audio packs: Classic, Synth, Soft (sample-based) with relative asset paths for web and Cordova
- Responsive controls for mouse, touch, and keyboard

## Quick Start

```bash
npm ci
npm run dev
```

Vite will print a local URL (e.g. http://localhost:5173/). Open it in your browser.

## Build & Preview

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

## Controls

- Mouse/Touch: tap/click pads to play
- Keyboard:
  - 1, Q, ← for Green
  - 2, W, ↑ for Red
  - 3, E, ↓ for Blue
  - 4, R, → for Yellow

## Pages and UI

- Welcome: entry point with navigation to Tutorial, Challenges, Classic, Settings
- Tutorial: demo board to try tones and read quick instructions
- Challenges: select Speed Up or Reverse; starts game with those rules
- Settings: volume, mute, waveform, and audio pack selection
- GameShell: top bar with Back, Pause/Resume, and a mode label (e.g., Classic, Speed Up)

## Audio Packs

The client can use sample-based audio packs in addition to oscillator tones. Packs are loaded via relative paths so they work in Vite dev, static web builds, and Cordova file:// environments.

- Place packs under: public/web/assets/audio/
- Structure per pack:

```
public/web/assets/audio/<PackName>/
  ├─ tone0.wav
  ├─ tone1.wav
  ├─ tone2.wav
  └─ tone3.wav
```

Notes:
- Short, mono WAV recommended (44.1k/48kHz)
- Pack names appear in Settings (e.g., Classic, Synth, Soft)
- Ensure all four toneX.wav files exist for a pack to be selectable

## Settings & Persistence

- Volume and Mute
- Waveform (oscillator type)
- Audio Pack (sample set)
- Preferences are saved in localStorage and applied on app start

## Architecture (high level)

- Components: modular React components in src/components
- Hooks:
  - useGame: game state, sequence, lives, correctness, StartOptions support
  - useAudio: AudioManager integration (volume, mute, waveform, audio packs)
- Storage: localStorage for user preferences
- Build tooling: Vite + TypeScript

Developer note: Challenge rules are configured via StartOptions (see src/hooks/useGame.ts) and passed down from App to GameShell.

## Troubleshooting

- No audio in dev: check browser autoplay policy; interact with the page first
- No audio on Android: verify audio packs exist under public/web/assets/audio/<PackName>/tone0-3.wav
- Missing assets after packaging: re-run repository root build scripts to ensure web-react/dist is fresh

## License

MIT — see repository root LICENSE.