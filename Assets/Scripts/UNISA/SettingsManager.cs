using UnityEngine;

namespace UNISA.Core
{
    public class SettingsManager : MonoBehaviour
    {
        public static SettingsManager Instance { get; private set; }

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        public void Apply(SettingsData s)
        {
            var audio = UNISA.Audio.AudioManager.Instance;
            if (audio != null)
            {
                audio.musicBus.volume = s.muteMusic ? 0f : s.musicVolume;
                audio.sfxBus.volume = s.muteSfx ? 0f : s.sfxVolume;
            }

            // Difficulty: if active scene has a DifficultyScaler, adjust it
            var scaler = FindObjectOfType<UNISA.Gameplay.DifficultyScaler>();
            if (scaler != null)
            {
                scaler.difficulty = Mathf.Clamp01(s.difficulty);
            }

            // Theme
            ThemeManager.Instance?.SetTheme(s.theme);
            ThemeManager.Instance?.ApplyToScene();

            // Accent Pulse
            var pulses = GameObject.FindObjectsOfType<AccentPulse>(true);
            foreach (var p in pulses)
            {
                p.enabled = s.accentPulseEnabled;
            }

            // Fullscreen
            Screen.fullScreen = s.fullscreen;
        }

        public void SaveAndApply(SettingsData s)
        {
            SaveSystem.Instance?.SetSettings(s);
            Apply(s);
        }
    }
}