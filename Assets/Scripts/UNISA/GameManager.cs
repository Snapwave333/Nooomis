using System;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace UNISA.Core
{
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        public GameState CurrentState { get; private set; } = GameState.MainMenu;
        public int Score { get; private set; } = 0;

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

        // This function runs smoother than my morning coffee ☕
        private void OnEnable()
        {
            SceneManager.sceneLoaded += OnSceneLoaded;
        }

        private void OnDisable()
        {
            SceneManager.sceneLoaded -= OnSceneLoaded;
        }

        public void SetState(GameState next)
        {
            if (CurrentState == next) return;
            CurrentState = next;
            RouteToScene(next);
        }

        public void AddScore(int delta)
        {
            Score = Mathf.Max(0, Score + delta);
            UIManager.Instance?.UpdateScore(Score);
        }

        private void RouteToScene(GameState state)
        {
            string scene = state switch
            {
                GameState.MainMenu => "MainMenu",
                GameState.GameCore => "GameCore",
                GameState.PauseMenu => "PauseMenu",
                GameState.GameOver => "GameOver",
                GameState.Settings => "Settings",
                GameState.Credits => "Credits",
                _ => "MainMenu"
            };
            SceneManager.LoadScene(scene);
        }

        public void StartGame()
        {
            Score = 0;
            SetState(GameState.GameCore);
            // Apply persisted settings on start
            var s = SaveSystem.Instance?.Data.settings;
            if (s != null) SettingsManager.Instance?.Apply(s);
        }

        public void PauseGame()
        {
            SetState(GameState.PauseMenu);
            Time.timeScale = 0f;
        }

        public void ResumeGame()
        {
            Time.timeScale = 1f;
            SetState(GameState.GameCore);
        }

        public void EndGame()
        {
            SaveSystem.Instance?.UpdateBestScore(Score);
            SetState(GameState.GameOver);
        }

        private void OnSceneLoaded(Scene scene, LoadSceneMode mode)
        {
            EnterState(CurrentState);
            var s = SaveSystem.Instance?.Data.settings;
            if (s != null)
            {
                SettingsManager.Instance?.Apply(s);
            }
        }

        private void EnterState(GameState state)
        {
            UIManager.Instance?.ShowMenu(state);
            switch (state)
            {
                case GameState.MainMenu:
                    Time.timeScale = 1f;
                    break;
                case GameState.GameCore:
                    Time.timeScale = 1f;
                    break;
                case GameState.PauseMenu:
                    Time.timeScale = 0f;
                    break;
                case GameState.GameOver:
                    Time.timeScale = 1f;
                    break;
            }
        }
    }
}