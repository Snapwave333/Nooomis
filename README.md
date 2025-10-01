# NOMIS — Digital, Dazzling, Delightfully Chaotic

![NOMIS Banner](branding/social-banner.svg)

A modern, retro-futuristic Simon game. Built for Unity (Android, iOS, Steam, Windows) with a lightweight web prototype for rapid UI iteration.

## Highlights
- Unity C# gameplay core and UI builders
- Web prototype for instant UX tweaks
- One-click Android build script (Cordova) and Windows installer generator

## Project Structure
- `Assets/` — Unity-ready C# scripts (drop into a Unity project)
- `web/` — Browser prototype to preview UI and gameplay
- `tools/` — Build & asset generation scripts
- `branding/` — Logos and social banner assets for GitHub and marketing

## Quick Preview (Web)
1. Start a local static server (Python example):
   - `python -m http.server 5500`
2. Open `http://localhost:5500/web/` in your browser.

## Android (Scripted Build)
- Prereqs: Node.js 18+, Java JDK 17+, Android SDK commandline tools
- Run: `powershell -ExecutionPolicy Bypass -File tools/build_android.ps1`
  - Installs/updates SDK components
  - Scaffolds Cordova app
  - Builds debug APK and boots emulator
  - Installs and launches `com.nomis.simon`

## Windows Installer
- Run: `powershell -ExecutionPolicy Bypass -File tools/build_installer.ps1`
- Produces a local installed copy and desktop shortcut

## Unity Setup
1. Open or create a Unity project.
2. Copy the `Assets/` folder contents into your Unity project root (merge if needed).
3. Create a scene and add:
   - `SimonGameManager` (required)
   - `AudioManager` (required)
   - `UIManager` (optional but recommended)
   - Four `SimonButton` GameObjects (with colliders/UI Button components) tagged or referenced by color.
4. Wire button events to `SimonGameManager.OnButtonPressed(color)`.
5. Set GameMode via inspector or UI.

## Asset Generation
- Images (SVG branding included under `branding/`).
- Audio packs: use `web/assets/audio/` or Unity audio pipeline; fallbacks to oscillators if missing.

## Roadmap
- [ ] Signed Android release build and Play-ready bundle
- [ ] Splash screens & polished UI shaders
- [ ] Native plugins (audio latency, haptics)
- [ ] Scoreboard & social sharing
- [ ] CI/CD (GitHub Actions) for web demo & APK artifacts

## Contributing
Please read `CONTRIBUTING.md`. Issues and PRs are welcome.

## License
MIT
  - `web/assets/audio/classic/tone0.wav`–`tone3.wav`
  - `web/assets/audio/synth/tone0.wav`–`tone3.wav`
  - `web/assets/audio/soft/tone0.wav`–`tone3.wav`
- Switch packs in the Settings overlay. If the WAVs are present, NOMIS uses them; otherwise, it uses built-in WebAudio oscillators.

## Platforms
- Touch (mobile), mouse (desktop), controller (Gamepad API / Unity Input System)
- Follow platform publishing guidelines (icons, permissions, privacy disclosures)

### Build Targets
- Android: 
  - Use `IL2CPP` for release, ARM64.
  - Set icons and adaptive icons; add `INTERNET` only if needed (analytics or services).
  - Sign with release keystore and align with Google Play requirements.
- iOS:
  - Use `IL2CPP`, `Metal` graphics; set minimum iOS version per App Store.
  - Configure privacy strings if any data collection occurs.
- Windows:
  - `x86_64` build; include `UnityPlayer.dll` with exe.
  - Provide installer or zip; add `.ico` branding.
- Steam:
  - Use Windows build; integrate Steamworks SDK if achievements/leaderboards later.
  - Prepare capsule art and page assets; follow Valve content guidelines.

### Input Handling
- Unity Input System: map `Gamepad`/`Keyboard`/`Touch` to the four buttons and menu controls.
- Mobile: `GraphicRaycaster` + `EventSystem` ensure reliable touch.
- Desktop: mouse clicks on UI Buttons or colliders; optional gamepad navigation.

## Modes
- Speed Mode: Faster playback and stricter input window.
- Zen Mode: Slower pace, ambient music, no hard fail.
- Chaos Mode: Randomizes button positions each round.

## Notes
- The web prototype uses WebAudio oscillators by default with graceful fallback if remote audio fails.
- Unity scripts include placeholders for audio and asset injection.
- 3D mesh option: generate NOMIS device mesh via Trellis-3D; import into Unity as FBX/GLTF and assign materials matching generated button textures.

## Audio Generation (Stable Audio Open)
- If you self-host Stable Audio Open, set env `SAO_URL` and optional `SAO_TOKEN`, then run `tools/generate_audio.py`.
- Import produced WAVs as `AudioClip`s in Unity and assign to `AudioManager.buttonClips`.