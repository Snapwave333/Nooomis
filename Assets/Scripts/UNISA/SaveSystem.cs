using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEngine;

namespace UNISA.Core
{
    [Serializable]
    public class SettingsData
    {
        public float musicVolume = 0.6f;
        public float sfxVolume = 1.0f;
        public float difficulty = 0.0f; // 0..1
        public string theme = "default";
        public bool muteMusic = false;
        public bool muteSfx = false;
        public bool accentPulseEnabled = true;
        public bool fullscreen = false;
    }

    [Serializable]
    public class SaveData
    {
        // Existing
        public int bestScore = 0;
        public string[] unlockedContent = Array.Empty<string>();
        public SettingsData settings = new SettingsData();
        
        // New progression fields
        public int sessionCount = 0;
        public int totalGamesPlayed = 0;
        public int memoryShards = 0;
        public string[] unlockedThemes = Array.Empty<string>();
        public string[] unlockedAudioPacks = Array.Empty<string>();
        public string[] unlockedModes = Array.Empty<string>();
        public string[] unlockedLore = Array.Empty<string>();
        public bool[] dailyChallengesCompleted = Array.Empty<bool>();
        public long lastDailyResetTime = 0;
        public int corruptionPhase = 0; // 0-5 for meta arc
        public string[] modeStats = Array.Empty<string>(); // JSON serialized Dictionary<string, int>
        
        // Meta arc specific
        public bool[] arcPhaseUnlocked = new bool[6]; // Track which phases have been reached
        public int[] buttonMissCounts = new int[4]; // Track misses per button for personalized messages
        public long lastSessionTime = 0;
        public bool liberationModeUnlocked = false;
        public bool bossFightCompleted = false;
    }

    public class SaveSystem : MonoBehaviour
    {
        public static SaveSystem Instance { get; private set; }

        public SaveData Data { get; private set; } = new SaveData();
        public string FileName = "save.json";

        private string SavePath => Path.Combine(Application.persistentDataPath, FileName);

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
            Load();
        }

        // This runs smoother than my morning coffee — and it saves it ☕
        public void Load()
        {
            try
            {
                if (File.Exists(SavePath))
                {
                    string json = File.ReadAllText(SavePath);
                    var loaded = JsonUtility.FromJson<SaveData>(json);
                    if (loaded != null) Data = loaded;
                }
            }
            catch (Exception e)
            {
                Debug.LogWarning($"SaveSystem.Load failed: {e.Message}");
            }
        }

        public void Save()
        {
            try
            {
                string json = JsonUtility.ToJson(Data, true);
                File.WriteAllText(SavePath, json);
            }
            catch (Exception e)
            {
                Debug.LogWarning($"SaveSystem.Save failed: {e.Message}");
            }
        }

        public void UpdateBestScore(int score)
        {
            if (score > Data.bestScore)
            {
                Data.bestScore = score;
                Save();
            }
        }

        public void SetSettings(SettingsData settings)
        {
            Data.settings = settings;
            Save();
        }

        // Progression methods
        public void IncrementSession()
        {
            Data.sessionCount++;
            Data.lastSessionTime = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            Save();
        }

        public void IncrementGamesPlayed()
        {
            Data.totalGamesPlayed++;
            Save();
        }

        public void AddMemoryShards(int amount)
        {
            Data.memoryShards += amount;
            Save();
        }

        public bool SpendMemoryShards(int amount)
        {
            if (Data.memoryShards >= amount)
            {
                Data.memoryShards -= amount;
                Save();
                return true;
            }
            return false;
        }

        public void UnlockTheme(string themeName)
        {
            if (!Data.unlockedThemes.Contains(themeName))
            {
                var themes = Data.unlockedThemes.ToList();
                themes.Add(themeName);
                Data.unlockedThemes = themes.ToArray();
                Save();
            }
        }

        public void UnlockAudioPack(string packName)
        {
            if (!Data.unlockedAudioPacks.Contains(packName))
            {
                var packs = Data.unlockedAudioPacks.ToList();
                packs.Add(packName);
                Data.unlockedAudioPacks = packs.ToArray();
                Save();
            }
        }

        public void UnlockMode(string modeName)
        {
            if (!Data.unlockedModes.Contains(modeName))
            {
                var modes = Data.unlockedModes.ToList();
                modes.Add(modeName);
                Data.unlockedModes = modes.ToArray();
                Save();
            }
        }

        public void UnlockLore(string loreId)
        {
            if (!Data.unlockedLore.Contains(loreId))
            {
                var lore = Data.unlockedLore.ToList();
                lore.Add(loreId);
                Data.unlockedLore = lore.ToArray();
                Save();
            }
        }

        public void UpdateCorruptionPhase(int phase)
        {
            if (phase > Data.corruptionPhase)
            {
                Data.corruptionPhase = phase;
                if (phase < Data.arcPhaseUnlocked.Length)
                {
                    Data.arcPhaseUnlocked[phase] = true;
                }
                Save();
            }
        }

        public void RecordButtonMiss(int buttonIndex)
        {
            if (buttonIndex >= 0 && buttonIndex < Data.buttonMissCounts.Length)
            {
                Data.buttonMissCounts[buttonIndex]++;
                Save();
            }
        }

        public void SetLiberationModeUnlocked(bool unlocked)
        {
            Data.liberationModeUnlocked = unlocked;
            Save();
        }

        public void SetBossFightCompleted(bool completed)
        {
            Data.bossFightCompleted = completed;
            Save();
        }
    }
}