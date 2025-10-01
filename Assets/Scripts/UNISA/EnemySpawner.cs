using UnityEngine;

namespace UNISA.Gameplay
{
    public class EnemySpawner : MonoBehaviour
    {
        public GameObject enemyPrefab;
        public float spawnInterval = 2f;
        public int maxAlive = 10;

        private float timer;
        private int alive;

        private void Update()
        {
            timer += Time.deltaTime;
            if (timer >= spawnInterval && alive < maxAlive)
            {
                timer = 0f;
                var go = Instantiate(enemyPrefab, transform.position, Quaternion.identity);
                alive++;
                go.AddComponent<EnemyMarker>().spawner = this;
            }
        }

        public void OnEnemyDestroyed()
        {
            alive = Mathf.Max(0, alive - 1);
        }

        private class EnemyMarker : MonoBehaviour
        {
            public EnemySpawner spawner;
            private void OnDestroy()
            {
                spawner?.OnEnemyDestroyed();
            }
        }
    }
}