using UnityEngine;

public class AudioLatencyTuner : MonoBehaviour {
  [Range(0,512)] public int dspBufferSize = 256;
  [Range(0f,1f)] public float volumeScale = 1f;
  void Awake() {
    try {
      AudioConfiguration cfg = AudioSettings.GetConfiguration();
      cfg.dspBufferSize = dspBufferSize;
      AudioSettings.Reset(cfg);
      AudioListener.volume = volumeScale;
    } catch { }
  }
}