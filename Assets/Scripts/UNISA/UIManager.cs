using UnityEngine;
using UnityEngine.UI;

namespace UNISA.Core
{
    public class UIManager : MonoBehaviour
    {
        public static UIManager Instance { get; private set; }

        [Header("HUD")]
        public Text scoreText;
        public GameObject hudRoot;

        [Header("Menus")]
        public GameObject mainMenuRoot;
        public GameObject pauseMenuRoot;
        public GameObject gameOverRoot;
        public GameObject settingsRoot;
        public GameObject creditsRoot;

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

        public void UpdateScore(int value)
        {
            if (scoreText != null)
            {
                scoreText.text = $"Score: {value}";
                StopAllCoroutines();
                StartCoroutine(FlashScore());
            }
        }

        private System.Collections.IEnumerator FlashScore()
        {
            var t = scoreText;
            if (t == null) yield break;
            var original = t.color;
            var accent = ThemeManager.Instance != null ? ThemeManager.Instance.Palette.Accent : Color.yellow;
            float d = 0.25f;
            float elapsed = 0f;
            while (elapsed < d)
            {
                elapsed += Time.unscaledDeltaTime;
                float k = Mathf.PingPong(elapsed * 6f, 1f);
                t.color = Color.Lerp(original, accent, k);
                yield return null;
            }
            t.color = original;
        }

        public void ShowMenu(GameState state)
        {
            // Simple visibility toggles for demo scaffolding
            SetActive(mainMenuRoot, state == GameState.MainMenu);
            SetActive(pauseMenuRoot, state == GameState.PauseMenu);
            SetActive(gameOverRoot, state == GameState.GameOver);
            SetActive(settingsRoot, state == GameState.Settings);
            SetActive(creditsRoot, state == GameState.Credits);
            SetActive(hudRoot, state == GameState.GameCore);
            
            // Ensure settings UI is properly hidden when not in settings state
            if (state != GameState.Settings && settingsRoot != null)
            {
                settingsRoot.SetActive(false);
            }
        }

        private void SetActive(GameObject go, bool active)
        {
            if (go != null) go.SetActive(active);
        }
    }
}