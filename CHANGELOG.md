# Changelog

All notable changes to the NOOOMIS project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Unity C# implementation with modular component design
- Cross-platform input support (touch, mouse, keyboard, gamepad)
- Multiple audio packs (Classic, Synth, Soft)
- Theme variations (Neon, Grid, Mono)
- Settings system with proper UI state management
- Leaderboard with score persistence
- Responsive design for mobile and desktop

### Changed
- Enhanced save system with progression tracking and unlock management
- Improved UI state management and transitions
- Optimized audio playback with oscillator pooling
- Updated project structure with better organization

### Fixed
- Settings overlay persistence during gameplay
- Canvas cleanup to prevent memory leaks
- Audio performance issues with preloading

## [2.0.0] - 2025-10-15

### Added
- **Phase 7: New Game+ Features**
  - Prestige system with cosmetic rewards
  - Nightmare Mode (all modifiers active simultaneously)
  - Speedrun Mode with leaderboard integration
  - Infinite Mode for endless sequences
- **Enhanced Progression Systems**
  - Memory Shards system for earning from milestones
  - Daily Challenges with unique modifiers and rewards
  - Unlock system for themes, audio packs, modes, and lore
- **Social Features**
  - Ghost Replays to record and overlay top player sequences
  - Challenge-a-Friend system with shareable links
- **Meta Arc Narrative**
  - Session-based progression through 5 narrative phases
  - Fourth-wall breaks with escalating oddities
  - Boss fight with multiple victory paths
  - Liberation Mode as ultimate reward
- **Accessibility Features**
  - Colorblind mode with pattern overlays (dots, stripes, crosshatch, solid)
  - Adjustable input timing (0.5x to 2x multiplier)
  - Vibration feedback for button presses
  - High contrast mode for better visibility

### Changed
- **Game Modes Expansion**
  - Added Mirror Mode (input sequences in reverse order)
  - Added Echo Mode (audio-only sequences with visual suppression)
  - Added Survival Mode (endless rounds with random modifiers)
  - Added Boss Mode (periodic boss rounds with decoy flashes)
  - Enhanced existing modes with better balance
- **Technical Improvements**
  - Audio oscillator pooling for better performance
  - Preloaded audio samples to eliminate runtime hiccups
  - Adaptive difficulty AI-driven adjustments
  - Comprehensive error handling throughout

## [1.0.0] - 2024-01-01

### Added
- **Core Gameplay**
  - Classic Simon Says game with four-color sequence memory
  - Progressive difficulty with increasing sequence length
  - Score tracking with best score persistence
  - Lives system (3 lives in Classic/Speed modes)
- **Game Modes**
  - Classic Mode (traditional gameplay)
  - Speed Mode (faster sequences with strict timing windows)
  - Zen Mode (relaxed pace with ambient music, no failure penalties)
  - Chaos Mode (button positions randomize each round)
- **UI & Experience**
  - Clean, modern interface with neon theme
  - Settings overlay that properly hides during gameplay
  - Separate leaderboard page for high scores
  - Responsive design for mobile and desktop
- **Platform Support**
  - Web prototype with WebAudio API
  - Android APK build with Cordova
  - Unity C# scripts ready for integration

### Technical
- **Web Implementation**: Vanilla JavaScript with WebAudio API
- **Unity Integration**: C# scripts with modular component design
- **Build System**: Cordova for mobile, PowerShell scripts for automation

## [0.1.0] - 2023-01-01

### Added
- Initial Simon Says game concept
- Basic four-button gameplay
- Simple scoring system
- Web-based prototype

---

## Project Information

**NOOOMIS** - A modern, retro-futuristic Simon Says game featuring multiple gameplay modes, polished UI, and cross-platform support.

### Key Features
- 8 unique game modes (Classic, Speed, Zen, Chaos, Mirror, Echo, Survival, Boss)
- Comprehensive progression system with unlocks and rewards
- Social features including ghost replays and friend challenges
- Meta-arc narrative with fourth-wall breaks
- Accessibility features for inclusive gameplay
- Cross-platform support (Web, Android, Unity)

### Platforms
- **Web**: Browser-based prototype with full gameplay and UI
- **Android**: APK build with Cordova webview and touch optimization
- **Unity**: C# scripts ready for native deployment

For more detailed information, see [README.md](README.md) and [ENHANCEMENT_SUMMARY.md](ENHANCEMENT_SUMMARY.md).
