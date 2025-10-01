Unity Scene Setup Guide (UNISA Scaffold)

Scenes to create:
- MainMenu: Canvas with Play, Settings, Credits, Exit; add UNISA.Core.SceneLoader and UNISA.Core.GameManager (singleton) to a bootstrap object.
- GameCore: Gameplay environment, Player with UNISA.Actors.PlayerController, EnemySpawner and DifficultyScaler, a HUD Canvas controlled by UNISA.Core.UIManager.
- PauseMenu: Canvas with Resume and Main Menu; hook buttons to GameManager.ResumeGame and SceneLoader.LoadMainMenu.
- GameOver: Canvas with score display (UIManager updates via GameManager.Score), Retry and Main Menu buttons.
- Settings: Canvas for audio sliders (bind to UNISA.Audio.AudioManager buses), difficulty slider (bind to UNISA.Gameplay.DifficultyScaler), theme toggles.
- Credits: Canvas with static text, back button to MainMenu.

Bootstrap (persistent):
- Create an empty GameObject named "UNISA_Bootstrap" in MainMenu and add:
  - UNISA.Core.GameManager
  - UNISA.Core.UIManager (assign menu/hud roots and score Text when applicable)
  - UNISA.Audio.AudioManager (assign musicBus and sfxBus AudioSources)
- Mark this object as persistent via GameManager/AudioManager/UIManager (already call DontDestroyOnLoad).

UI Wiring Notes:
- For each scene, set UIManager menu roots to the scene’s Canvas panels. UIManager.ShowMenu(CurrentState) can be called on scene load to reflect visibility.
- Hook Button onClick to SceneLoader methods or GameManager.StartGame/PauseGame/ResumeGame/EndGame.

Gameplay Wiring:
- Player: Add CharacterController and UNISA.Actors.PlayerController.
- Spawner: Add UNISA.Gameplay.EnemySpawner and reference an enemy prefab; add UNISA.Gameplay.DifficultyScaler and link the spawner.

Audio:
- Add two AudioSources to the bootstrap: MusicBus (looped) and SfxBus.
- Use UNISA.Audio.AudioManager.Instance.PlayMusic/PlaySfx to control audio.

Build Order Tips:
- Ensure all scenes are added to Build Settings in this order: MainMenu, GameCore, PauseMenu, GameOver, Settings, Credits.
- Test scene transitions via GameManager.SetState or SceneLoader.