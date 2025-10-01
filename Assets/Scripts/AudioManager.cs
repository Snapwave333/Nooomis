using UnityEngine;

namespace Unisa.Simon
{
    public class AudioManager : MonoBehaviour
    {
        public static AudioManager Instance { get; private set; }

        public AudioSource sfxSource;
        public AudioSource musicSource;

        public AudioClip startClip;
        public AudioClip successClip;
        public AudioClip failClip;

        public AudioClip[] buttonClips = new AudioClip[4];

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        public void PlayStart() { if (startClip) sfxSource.PlayOneShot(startClip); }
        public void PlaySuccess() { if (successClip) sfxSource.PlayOneShot(successClip); }
        public void PlayFail() { if (failClip) sfxSource.PlayOneShot(failClip); }

        public void PlayTone(int index)
        {
            if (index >= 0 && index < buttonClips.Length && buttonClips[index] != null)
            {
                sfxSource.PlayOneShot(buttonClips[index]);
            }
        }

        public void SetMusicIntensity(float normalized)
        {
            musicSource.pitch = Mathf.Lerp(0.9f, 1.2f, normalized);
            musicSource.volume = Mathf.Lerp(0.3f, 0.8f, normalized);
        }
    }
}