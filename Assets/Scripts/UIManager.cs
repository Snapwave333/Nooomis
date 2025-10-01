using UnityEngine;
using UnityEngine.UI;

namespace Unisa.Simon
{
    public class UIManager : MonoBehaviour
    {
        public GameObject startPanel;
        public GameObject pausePanel;
        public GameObject gameOverPanel;

        public Text scoreText;
        public Text bestScoreText;

        public SimonGameManager game;

        public void ShowStart()
        {
            startPanel.SetActive(true);
            pausePanel.SetActive(false);
            gameOverPanel.SetActive(false);
        }

        public void ShowPause(bool show)
        {
            pausePanel.SetActive(show);
        }

        public void ShowGameOver()
        {
            startPanel.SetActive(false);
            pausePanel.SetActive(false);
            gameOverPanel.SetActive(true);
        }

        public void UpdateScore(int s)
        {
            scoreText.text = $"Score: {s}";
        }

        public void UpdateBest(int b)
        {
            bestScoreText.text = $"Best: {b}";
        }

        public void StartClassic() { game.SetMode(GameMode.Classic); game.StartGame(); }
        public void StartSpeed() { game.SetMode(GameMode.Speed); game.StartGame(); }
        public void StartZen() { game.SetMode(GameMode.Zen); game.StartGame(); }
        public void StartChaos() { game.SetMode(GameMode.Chaos); game.StartGame(); }
    }
}