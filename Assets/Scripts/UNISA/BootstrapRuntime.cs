using UnityEngine;

namespace UNISA.Core
{
    public class BootstrapRuntime : MonoBehaviour
    {
        private void Awake()
        {
            // Create persistent root
            var root = new GameObject("UNISA_Bootstrap");
            DontDestroyOnLoad(root);

            // Managers
            root.AddComponent<GameManager>();
            root.AddComponent<UIManager>();
            root.AddComponent<SaveSystem>();
            root.AddComponent<SettingsManager>();
            root.AddComponent<ThemeManager>();

            // Audio buses
            var audioRoot = new GameObject("AudioRoot");
            audioRoot.transform.SetParent(root.transform);
            var music = audioRoot.AddComponent<AudioSource>();
            music.loop = true; music.playOnAwake = false;
            var sfx = audioRoot.AddComponent<AudioSource>();
            sfx.loop = false; sfx.playOnAwake = false;

            var audioMgrGO = new GameObject("AudioManager");
            audioMgrGO.transform.SetParent(root.transform);
            var audioMgr = audioMgrGO.AddComponent<UNISA.Audio.AudioManager>();
            audioMgr.musicBus = music;
            audioMgr.sfxBus = sfx;
        }
    }
}