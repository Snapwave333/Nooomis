using UnityEngine;
using UnityEngine.SceneManagement;

namespace UNISA.Core
{
    public class SceneLoader : MonoBehaviour
    {
        public void LoadMainMenu() => SceneManager.LoadScene("MainMenu");
        public void LoadGameCore() => SceneManager.LoadScene("GameCore");
        public void LoadPauseMenu() => SceneManager.LoadScene("PauseMenu");
        public void LoadGameOver() => SceneManager.LoadScene("GameOver");
        public void LoadSettings() => SceneManager.LoadScene("Settings");
        public void LoadCredits() => SceneManager.LoadScene("Credits");
        public void Quit() => Application.Quit();
    }
}