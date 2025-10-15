using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using UNISA.Core;

namespace Unisa.Simon
{
    public class SimonGameManager : MonoBehaviour
    {
        [Header("Config")] public GameMode mode = GameMode.Classic;
        [Range(0.25f, 2f)] public float basePlaybackDelay = 0.9f; // time between notes during playback
        [Range(0.1f, 1.0f)] public float pressWindow = 0.9f; // time allowed for next input in speed mode
        public int lives = 3;

        [Header("Visuals")] public List<SimonButton> buttons;
        public Transform chaosParent; // container for chaos re-layout

        [Header("Events")] public UnityEvent OnRoundStart;
        public UnityEvent OnRoundEnd;
        public UnityEvent OnGameOver;
        public UnityEvent<int> OnScoreChanged;
        public UnityEvent<int> OnBestScoreChanged;
        public UnityEvent OnFail;
        public UnityEvent OnSuccess;

        private List<int> sequence = new List<int>();
        private int inputIndex = 0;
        private bool isPlayingBack = false;
        private int score = 0;
        private int bestScore = 0;
        private float nextInputDeadline = 0f;

        private void Awake()
        {
            bestScore = PlayerPrefs.GetInt("BestScore", 0);
            OnBestScoreChanged?.Invoke(bestScore);
        }

        public void StartGame()
        {
            score = 0;
            lives = Mathf.Max(lives, 1);
            sequence.Clear();
            inputIndex = 0;
            OnScoreChanged?.Invoke(score);
            AppendRandomStep();
            PlaySequence();
        }

        public void SetMode(GameMode newMode)
        {
            mode = newMode;
        }

        private void AppendRandomStep()
        {
            int idx = UnityEngine.Random.Range(0, buttons.Count);
            sequence.Add(idx);
        }

        public void OnButtonPressed(int buttonIndex)
        {
            if (isPlayingBack || buttons == null || buttons.Count == 0) return;

            // Speed mode: enforce input window
            if (mode == GameMode.Speed && Time.time > nextInputDeadline)
            {
                HandleFail();
                return;
            }

            var expected = sequence[inputIndex];
            if (buttonIndex == expected)
            {
                buttons[buttonIndex].Pulse(true);
                Haptics.Vibrate(20, 200);
                inputIndex++;
                AudioManager.Instance?.PlayTone(buttonIndex);
                if (mode == GameMode.Speed) nextInputDeadline = Time.time + pressWindow;

                if (inputIndex >= sequence.Count)
                {
                    score++;
                    SaveSystem.Instance?.UpdateBestScore(score);
                    OnScoreChanged?.Invoke(score);
                    OnSuccess?.Invoke();
                    inputIndex = 0;
                    AppendRandomStep();
                    PlaySequence();
                }
            }
            else
            {
                HandleFail();
            }
        }

        private void HandleFail()
        {
            OnFail?.Invoke();
            AudioManager.Instance?.PlayFail();
            Haptics.Vibrate(60, 255);

            if (mode == GameMode.Zen)
            {
                // Zen mode: do not deduct lives, replay sequence calmly
                inputIndex = 0;
                PlaySequence();
                return;
            }

            lives--;
            if (lives <= 0)
            {
                if (score > bestScore)
                {
                    bestScore = score;
                    PlayerPrefs.SetInt("BestScore", bestScore);
                    OnBestScoreChanged?.Invoke(bestScore);
                    // Also push to UNISA.Scoreboard if available
                    var sb = GameObject.FindObjectOfType<Scoreboard>();
                    if (sb != null) sb.Add(score);
                }
                OnGameOver?.Invoke();
                // reset game
                sequence.Clear();
                inputIndex = 0;
            }
            else
            {
                inputIndex = 0;
                PlaySequence();
            }
        }

        private void PlaySequence()
        {
            if (buttons == null || buttons.Count == 0) return;
            isPlayingBack = true;
            OnRoundStart?.Invoke();

            float delay = basePlaybackDelay;
            switch (mode)
            {
                case GameMode.Speed:
                    delay *= 0.7f;
                    break;
                case GameMode.Zen:
                    delay *= 1.2f;
                    break;
            }

            // Chaos mode: randomize positions each round
            if (mode == GameMode.Chaos && chaosParent != null)
            {
                ShuffleLayout();
            }

            // schedule coroutines
            StopAllCoroutines();
            StartCoroutine(PlaybackCoroutine(delay));
        }

        private System.Collections.IEnumerator PlaybackCoroutine(float delay)
        {
            yield return new WaitForSeconds(delay);
            foreach (var idx in sequence)
            {
                AudioManager.Instance?.PlayTone(idx);
                buttons[idx].Pulse(false);
                yield return new WaitForSeconds(delay);
            }
            isPlayingBack = false;
            OnRoundEnd?.Invoke();
            if (mode == GameMode.Speed) nextInputDeadline = Time.time + pressWindow;
        }

        private void ShuffleLayout()
        {
            // This button glows brighter than my future after debugging
            List<Transform> children = new List<Transform>();
            foreach (Transform t in chaosParent)
                children.Add(t);
            for (int i = 0; i < children.Count; i++)
            {
                int swap = UnityEngine.Random.Range(i, children.Count);
                var tmp = children[i].position;
                children[i].position = children[swap].position;
                children[swap].position = tmp;
            }
        }
    }
}