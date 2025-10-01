using UnityEngine;
using UNISA.Core;

namespace UNISA.Core
{
    public class FullscreenToggle : MonoBehaviour
    {
        private void Update()
        {
            if (Input.GetKeyDown(KeyCode.F11))
            {
                var data = SaveSystem.Instance?.Data;
                if (data == null) return;
                data.settings.fullscreen = !Screen.fullScreen;
                Screen.fullScreen = data.settings.fullscreen;
                SaveSystem.Instance.Save();
            }
        }
    }
}