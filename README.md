# NOOOMIS — Digital, Dazzling, Delightfully Chaotic

![NOOOMIS Banner](branding/social-banner.svg)

A modern, retro-futuristic Simon Says game with multiple gameplay modes, polished UI, and cross-platform support. Features both Unity C# implementation and a web prototype for rapid iteration.

## ✨ Features

### 🎮 Game Modes
- **Classic Mode**: Traditional Simon Says gameplay
- **Speed Mode**: Faster sequences with strict timing windows
- **Zen Mode**: Relaxed pace with ambient music, no failure penalties
- **Chaos Mode**: Button positions randomize each round

### 🎯 Core Gameplay
- Four-color Simon Says sequence memory game
- Progressive difficulty with increasing sequence length
- Score tracking with best score persistence
- Lives system (3 lives in Classic/Speed modes)
- Real-time timer bar for Speed mode input windows

### 🎨 UI & Experience
- Clean, modern interface with neon theme
- Settings overlay that properly hides during gameplay
- Separate leaderboard page for high scores
- Responsive design for mobile and desktop
- Multiple audio packs (Classic, Synth, Soft)
- Theme variations (Neon, Grid, Mono)

### 📱 Platform Support
- **Android**: Full APK build with emulator testing
- **Web**: Browser-based prototype with WebAudio
- **Unity**: C# scripts ready for Unity integration
- **Cross-platform**: Touch, mouse, keyboard, and gamepad support

## 📁 Project Structure
- `Assets/` — Unity-ready C# scripts with complete game logic
- `web/` — Browser prototype with full gameplay and UI
- `tools/` — Build scripts for Android, Windows, and asset generation
- `branding/` — Logos and social banner assets

## 🚀 Quick Start

### Web Demo
1. Start a local server: `python -m http.server 5500`
2. Open `http://localhost:5500/web/` in your browser
3. Click "Start" to begin playing!

### Android Build
**Prerequisites**: Node.js 18+, Java JDK 17+, Android SDK commandline tools

```powershell
powershell -ExecutionPolicy Bypass -File tools/build_android.ps1
```

This script will:
- Install/update Android SDK components
- Create a Cordova project
- Build debug APK
- Launch Android emulator
- Install and run the game

### Windows Installer
```powershell
powershell -ExecutionPolicy Bypass -File tools/build_installer.ps1
```
Produces a local installed copy with desktop shortcut.

## 🎮 Gameplay Controls

### Input Methods
- **Touch/Mouse**: Tap/click the colored buttons
- **Keyboard**: Arrow keys, WASD, or number keys 1-4
- **Gamepad**: A/B/X/Y buttons (Xbox/PlayStation mapping)

### Game Flow
1. **Start**: Click "Start" → Select mode → Click "Begin"
2. **Play**: Watch the sequence, then repeat it
3. **Progress**: Each successful round adds one more step
4. **Failure**: Lose a life (Classic/Speed) or restart sequence (Zen)
5. **Game Over**: Submit your score to the leaderboard

## 🛠️ Unity Integration

### Setup Steps
1. Copy `Assets/` folder contents into your Unity project
2. Create a scene with:
   - `SimonGameManager` (core game logic)
   - `AudioManager` (sound system)
   - `UIManager` (UI management)
   - Four `SimonButton` GameObjects with colliders
3. Wire button events to `SimonGameManager.OnButtonPressed(color)`
4. Configure GameMode via inspector or UI

### Key Components
- **SimonGameManager**: Handles game state, sequences, scoring
- **UIManager**: Manages UI overlays and state transitions
- **AudioManager**: Sound effects and music
- **SettingsManager**: User preferences and settings
- **ThemeManager**: Visual theme management

## 🎨 Customization

### Audio Packs
- **Classic**: Traditional Simon tones
- **Synth**: Electronic synthesizer sounds
- **Soft**: Gentle, ambient tones
- Located in `web/assets/audio/` or Unity AudioClips

### Themes
- **Neon**: Bright, futuristic colors
- **Grid**: Minimalist grid pattern
- **Mono**: Monochrome aesthetic

## 📋 Current Status

### ✅ Completed Features
- [x] Core Simon Says gameplay with 4 modes
- [x] Settings system with proper UI state management
- [x] Leaderboard with score persistence
- [x] Android APK build and emulator testing
- [x] Web prototype with WebAudio
- [x] Cross-platform input support
- [x] Multiple audio packs and themes
- [x] Responsive UI design
- [x] Unity C# implementation

### 🚧 Roadmap
- [ ] Signed Android release build for Play Store
- [ ] iOS build and App Store submission
- [ ] Steam integration with achievements
- [ ] Enhanced visual effects and animations
- [ ] Social sharing features
- [ ] Cloud leaderboard synchronization
- [ ] Additional game modes
- [ ] Accessibility features

## 🔧 Technical Details

### Architecture
- **Web**: Vanilla JavaScript with WebAudio API
- **Unity**: C# scripts with modular component design
- **Build**: Cordova for mobile, PowerShell scripts for automation

### Audio System
- **WebAudio**: Oscillator-based tones with fallback to sample files
- **Unity**: AudioSource components with AudioClip support
- **Packs**: Classic, Synth, and Soft audio variations
- **Generation**: Stable Audio Open integration for custom tones

### UI System
- **Web**: CSS3 with theme variables and responsive design
- **Unity**: Canvas-based UI with proper state management
- **Themes**: CSS custom properties for easy customization
- **Accessibility**: ARIA labels and keyboard navigation

## 📱 Platform Support

### Android
- **Target**: Android API 34+ (Android 14+)
- **Build**: Cordova with Gradle
- **Architecture**: ARM64 optimized
- **Permissions**: None required (offline game)

### Web
- **Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile**: Responsive design for touch devices
- **Audio**: WebAudio API with graceful fallbacks
- **Storage**: LocalStorage for settings and scores

### Unity
- **Version**: Unity 2022.3 LTS+
- **Platforms**: Windows, macOS, Linux, Android, iOS
- **Rendering**: Built-in and URP compatible
- **Input**: Unity Input System ready

## 🤝 Contributing

We welcome contributions! Please see `CONTRIBUTING.md` for guidelines.

### Development Setup
1. Fork the repository
2. Clone your fork locally
3. Test changes in the web prototype first
4. Update Unity scripts if needed
5. Test Android build with `tools/build_android.ps1`
6. Submit a pull request

### Areas for Contribution
- New game modes
- Visual effects and animations
- Audio improvements
- Accessibility features
- Platform-specific optimizations
- Documentation improvements

## 📄 License

MIT License - see LICENSE file for details.

### Third-Party Assets
- Audio samples in `web/assets/audio/` are included under MIT license
- Unity packages may have their own licenses
- Branding assets are original work

## 🎯 Recent Updates

### Latest Changes
- ✅ Fixed settings overlay persistence during gameplay
- ✅ Moved leaderboard to separate page for cleaner UI
- ✅ Reduced repetitive branding elements
- ✅ Improved UI state management
- ✅ Enhanced Android build process
- ✅ Added comprehensive README documentation

### Performance Optimizations
- Proper canvas cleanup to prevent memory leaks
- Efficient UI state transitions
- Optimized audio playback
- Responsive design improvements

---

**NOOOMIS** — Where digital meets dazzling, and chaos becomes delightful! 🎮✨