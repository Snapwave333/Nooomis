# Roadmap

This roadmap reflects the current React client (web-react) as the primary app and the new UI flow and challenge modes introduced in v2.1.0.

## Current (v2.1.0)
- Tutorial page with demo board and quick instructions
- Challenges page with two modes: Speed Up and Reverse
- GameShell top bar: Back, Pause/Resume, contextual mode label
- StartOptions plumbed through useGame (tempo, reverse, lives)
- Audio packs (Classic, Synth, Soft), persisted audio settings (volume, mute, waveform)
- Android build scripts and CI updated to always package fresh web-react assets
- Relative audio paths for Cordova compatibility

## Near-term (2.1.x → 2.2)

Gameplay & Challenges
- Tune Speed Up curves (toneMs/gapMs) and pacing by round
- Validate Reverse correctness edge-cases and add better feedback
- Persist last challenge choice and show mode label in end-of-game/results
- Add optional Strict Timing variant (narrow input windows)

UI/UX & Accessibility
- Polish navigation flow between Welcome ↔ Tutorial/Challenges/Classic/Settings
- Refine Back/Pause/Resume behavior and visual states in GameShell
- Add focus outlines, improved keyboard help, and colorblind-friendly palettes
- Respect reduced motion and add subtle animations for pad press/sequence playback

Audio
- Normalize pack levels; preload samples; improve fade ramps to avoid pops
- Optional ambient loop with start/stop tied to game state

Quality & Testing
- Unit tests for useGame (reverse logic, lives, timing)
- Integration tests for GameShell controls (pause/resume/back)
- E2E smoke tests for flows: Tutorial, Classic, Speed Up, Reverse

Build & Packaging
- Signed Android release build and Play-ready bundle
- Ensure Windows packaging uses latest web-react assets (already part of script) and consider CI for Windows

## Mid-term (2.3+)

Progression & Social
- Leaderboards (local → cloud), achievements, and player stats
- Daily/Weekly Challenge (seeded sequences) and shareable results

More Challenge Modes
- Randomize Layout, Endless Speed, Memory Wipe between rounds
- Boss-style sequences and “Ghost” replay from best runs

Settings & Personalization
- Key remapping, haptics toggle, color themes, and per-pack gain
- Latency compensation controls and audio device selection (where supported)

## Long-term
- Cross-platform distribution (Steam, macOS), PWA install, and iOS build
- Modding support (custom audio packs/themes) with in-app pack manager
- Multiplayer/versus modes
- ZK-based or server-side score verification (experimental)