using UnityEngine;

namespace UNISA.Audio
{
    public class AudioManager : MonoBehaviour
    {
        public static AudioManager Instance { get; private set; }

        [Header("Buses")]
        public AudioSource musicBus;
        public AudioSource sfxBus;

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

        public void PlayMusic(AudioClip clip, float volume = 0.6f, bool loop = true)
        {
            if (clip == null) return;
            musicBus.clip = clip;
            musicBus.volume = volume;
            musicBus.loop = loop;
            musicBus.Play();
        }

        public void StopMusic()
        {
            musicBus.Stop();
        }

        public void PlaySfx(AudioClip clip, float volume = 1f)
        {
            if (clip == null) return;
            sfxBus.PlayOneShot(clip, volume);
        }
    }
}