using System;
using System.IO;
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
        public int bestScore = 0;
        public string[] unlockedContent = Array.Empty<string>();
        public SettingsData settings = new SettingsData();
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
    }
}