using UnityEngine;
using UnityEngine.UI;
using UNISA.Core;

namespace UNISA.UIRuntime
{
    public class CreditsUIBuilder : MonoBehaviour
    {
        private Canvas canvas;
        private RectTransform root;

        private void Start()
        {
            Build();
            UIManager.Instance.creditsRoot = root.gameObject;
            UIManager.Instance.ShowMenu(GameManager.Instance.CurrentState);
        }

        private void Build()
        {
            canvas = new GameObject("CreditsCanvas").AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvas.gameObject.AddComponent<CanvasScaler>().uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            canvas.gameObject.AddComponent<GraphicRaycaster>();
            root = new GameObject("CreditsRoot").AddComponent<RectTransform>();
            root.SetParent(canvas.transform, false);
            root.anchorMin = Vector2.zero; root.anchorMax = Vector2.one; root.offsetMin = Vector2.zero; root.offsetMax = Vector2.zero;

            var textGO = new GameObject("CreditsText");
            var text = textGO.AddComponent<Text>();
            text.text = "Credits\n\nDesign & Code: UNISA\nArt: Stability AI\nAudio: Stable Audio Open\n3D: Trellis-3D\nSpecial Thanks: You";
            text.color = Color.white; text.alignment = TextAnchor.MiddleCenter; text.fontSize = 22;
            text.rectTransform.SetParent(root, false);
            text.rectTransform.anchorMin = new Vector2(0.5f, 0.6f); text.rectTransform.anchorMax = new Vector2(0.5f, 0.6f);
            text.rectTransform.sizeDelta = new Vector2(500, 200);

            CreateButton("Back", new Vector2(0.5f, 0.3f), () => GameManager.Instance.SetState(GameState.MainMenu));
        }

        private void CreateButton(string label, Vector2 anchor, UnityEngine.Events.UnityAction onClick)
        {
            var btnGO = new GameObject(label);
            var rt = btnGO.AddComponent<RectTransform>();
            rt.SetParent(root, false);
            rt.anchorMin = anchor; rt.anchorMax = anchor; rt.sizeDelta = new Vector2(180, 45);
            var img = btnGO.AddComponent<Image>();
            img.color = new Color(0.1f, 0.1f, 0.14f, 0.9f);
            var btn = btnGO.AddComponent<Button>();
            btn.onClick.AddListener(onClick);
            var textGO = new GameObject("Text");
            var text = textGO.AddComponent<Text>();
            text.text = label; text.alignment = TextAnchor.MiddleCenter; text.color = Color.white; text.fontSize = 20;
            text.rectTransform.SetParent(rt, false);
            text.rectTransform.anchorMin = Vector2.zero; text.rectTransform.anchorMax = Vector2.one; text.rectTransform.offsetMin = Vector2.zero; text.rectTransform.offsetMax = Vector2.zero;
        }
    }
}