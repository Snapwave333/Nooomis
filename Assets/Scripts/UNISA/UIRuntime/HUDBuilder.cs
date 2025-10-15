using UnityEngine;
using UnityEngine.UI;
using UNISA.Core;

namespace UNISA.UIRuntime
{
    public class HUDBuilder : MonoBehaviour
    {
        private Canvas canvas;
        private RectTransform root;
        private Text scoreText;
        private bool isBuilt = false;

        private void Start()
        {
            Build();
            UIManager.Instance.hudRoot = root.gameObject;
            UIManager.Instance.scoreText = scoreText;
            UIManager.Instance.UpdateScore(GameManager.Instance.Score);
        }

        private void OnDestroy()
        {
            // Clean up the canvas when this component is destroyed
            if (canvas != null)
            {
                DestroyImmediate(canvas.gameObject);
            }
        }

        private void Build()
        {
            // Prevent duplicate canvas creation
            if (isBuilt) return;
            
            canvas = new GameObject("HUDCanvas").AddComponent<Canvas>();
            isBuilt = true;
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvas.gameObject.AddComponent<CanvasScaler>().uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            canvas.gameObject.AddComponent<GraphicRaycaster>();
            root = new GameObject("HUDRoot").AddComponent<RectTransform>();
            root.SetParent(canvas.transform, false);
            root.anchorMin = Vector2.zero; root.anchorMax = Vector2.one; root.offsetMin = Vector2.zero; root.offsetMax = Vector2.zero;

            var scoreGO = new GameObject("Score");
            scoreText = scoreGO.AddComponent<Text>();
            scoreText.text = "Score: 0"; scoreText.color = Color.white; scoreText.fontSize = 24; scoreText.alignment = TextAnchor.UpperLeft;
            scoreText.rectTransform.SetParent(root, false);
            scoreText.rectTransform.anchorMin = new Vector2(0f, 1f); scoreText.rectTransform.anchorMax = new Vector2(0f, 1f);
            scoreText.rectTransform.pivot = new Vector2(0f, 1f);
            scoreText.rectTransform.anchoredPosition = new Vector2(12f, -12f);
        }
    }
}