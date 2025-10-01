using UnityEngine;

namespace UNISA.Gameplay
{
    public class DifficultyScaler : MonoBehaviour
    {
        [Range(0f, 2f)] public float difficulty = 0f; // 0..2
        public EnemySpawner spawner;

        private void Update()
        {
            if (spawner == null) return;
            float t = Mathf.Clamp01(difficulty);
            spawner.spawnInterval = Mathf.Lerp(2f, 0.6f, t);
            spawner.maxAlive = Mathf.RoundToInt(Mathf.Lerp(6, 20, t));
        }
    }
}