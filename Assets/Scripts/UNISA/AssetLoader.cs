using System.Collections;
using UnityEngine;

namespace UNISA.Pipeline
{
    public class AssetLoader : MonoBehaviour
    {
        // Placeholder hooks; integrate Stability AI, Trellis-3D, AIMLAPI as needed.

        public IEnumerator LoadTextureFromDisk(string path, System.Action<Texture2D> done)
        {
            var www = new UnityEngine.Networking.UnityWebRequest(path);
            yield return www.SendWebRequest();
            done?.Invoke(null);
        }

        public IEnumerator LoadAudioFromDisk(string path, System.Action<AudioClip> done)
        {
            var www = new UnityEngine.Networking.UnityWebRequest(path);
            yield return www.SendWebRequest();
            done?.Invoke(null);
        }
    }
}