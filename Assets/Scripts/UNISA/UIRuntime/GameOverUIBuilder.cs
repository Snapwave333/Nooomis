using UnityEngine;
using UnityEngine.UI;
using UNISA.Core;

namespace UNISA.UIRuntime
{
    public class GameOverUIBuilder : MonoBehaviour
    {
        private Canvas canvas;
        private RectTransform root;
        private Text scoreText;

        private void Start()
        {
            Build();
            UIManager.Instance.gameOverRoot = root.gameObject;
            UIManager.Instance.ShowMenu(GameManager.Instance.CurrentState);
            UpdateScore();
        }

        private void Build()
        {
            canvas = new GameObject("GameOverCanvas").AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvas.gameObject.AddComponent<CanvasScaler>().uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            canvas.gameObject.AddComponent<GraphicRaycaster>();
            root = new GameObject("GameOverRoot").AddComponent<RectTransform>();
            root.SetParent(canvas.transform, false);
            root.anchorMin = Vector2.zero; root.anchorMax = Vector2.one; root.offsetMin = Vector2.zero; root.offsetMax = Vector2.zero;

            var titleGO = new GameObject("Title");
            var title = titleGO.AddComponent<Text>();
            title.text = "Game Over"; title.fontSize = 36; title.color = Color.white; title.alignment = TextAnchor.MiddleCenter;
            title.rectTransform.SetParent(root, false);
            title.rectTransform.anchorMin = new Vector2(0.5f, 0.8f); title.rectTransform.anchorMax = new Vector2(0.5f, 0.8f);
            title.rectTransform.sizeDelta = new Vector2(360, 60);

            var scoreGO = new GameObject("Score");
            scoreText = scoreGO.AddComponent<Text>();
            scoreText.fontSize = 28; scoreText.color = Color.white; scoreText.alignment = TextAnchor.MiddleCenter;
            scoreText.rectTransform.SetParent(root, false);
            scoreText.rectTransform.anchorMin = new Vector2(0.5f, 0.7f); scoreText.rectTransform.anchorMax = new Vector2(0.5f, 0.7f);
            scoreText.rectTransform.sizeDelta = new Vector2(300, 50);

            CreateAccentButton("Retry", new Vector2(0.45f, 0.55f), () => GameManager.Instance.StartGame());
            CreateButton("Main Menu", new Vector2(0.55f, 0.55f), () => GameManager.Instance.SetState(GameState.MainMenu));
        }

        private void UpdateScore()
        {
            scoreText.text = $"Score: {GameManager.Instance.Score}\nBest: {SaveSystem.Instance?.Data.bestScore ?? 0}";
        }

        private void CreateButton(string label, Vector2 anchor, UnityEngine.Events.UnityAction onClick)
        {
            var btnGO = new GameObject(label);
            var rt = btnGO.AddComponent<RectTransform>();
            rt.SetParent(root, false);
            rt.anchorMin = anchor; rt.anchorMax = anchor; rt.sizeDelta = new Vector2(160, 45);
            var img = btnGO.AddComponent<Image>();
            img.color = new Color(0.1f, 0.1f, 0.14f, 0.9f);
            var btn = btnGO.AddComponent<Button>();
            btn.onClick.AddListener(onClick);
            btnGO.AddComponent<UNISA.Core.AccentPulse>();
            var colors = btn.colors;
            colors.normalColor = img.color;
            colors.highlightedColor = img.color * 1.06f;
            colors.pressedColor = img.color * 0.95f;
            colors.selectedColor = colors.highlightedColor;
            colors.disabledColor = new Color(img.color.r, img.color.g, img.color.b, 0.4f);
            btn.colors = colors;
            var textGO = new GameObject("Text");
            var text = textGO.AddComponent<Text>();
            text.text = label; text.alignment = TextAnchor.MiddleCenter; text.color = Color.white; text.fontSize = 20;
            text.rectTransform.SetParent(rt, false);
            text.rectTransform.anchorMin = Vector2.zero; text.rectTransform.anchorMax = Vector2.one; text.rectTransform.offsetMin = Vector2.zero; text.rectTransform.offsetMax = Vector2.zero;
        }

        private void CreateAccentButton(string label, Vector2 anchor, UnityEngine.Events.UnityAction onClick)
        {
            var btnGO = new GameObject(label);
            var rt = btnGO.AddComponent<RectTransform>();
            rt.SetParent(root, false);
            rt.anchorMin = anchor; rt.anchorMax = anchor; rt.sizeDelta = new Vector2(170, 48);
            var img = btnGO.AddComponent<Image>();
            img.color = ThemeManager.Instance.Palette.Accent;
            var role = btnGO.AddComponent<ThemeRole>();
            role.role = ThemeRoleType.Accent;
            var btn = btnGO.AddComponent<Button>();
            btn.onClick.AddListener(onClick);
            var colors = btn.colors;
            colors.normalColor = img.color;
            colors.highlightedColor = img.color * 1.06f;
            colors.pressedColor = img.color * 0.95f;
            colors.selectedColor = colors.highlightedColor;
            colors.disabledColor = new Color(img.color.r, img.color.g, img.color.b, 0.4f);
            btn.colors = colors;
            var textGO = new GameObject("Text");
            var text = textGO.AddComponent<Text>();
            text.text = label; text.alignment = TextAnchor.MiddleCenter; text.color = ThemeManager.Instance.Palette.Background; text.fontSize = 20;
            var shadow = textGO.AddComponent<Shadow>();
            shadow.effectColor = new Color(ThemeManager.Instance.Palette.Background.r, ThemeManager.Instance.Palette.Background.g, ThemeManager.Instance.Palette.Background.b, 0.6f);
            shadow.effectDistance = new Vector2(0.5f, -0.5f);
            text.rectTransform.SetParent(rt, false);
            text.rectTransform.anchorMin = Vector2.zero; text.rectTransform.anchorMax = Vector2.one; text.rectTransform.offsetMin = Vector2.zero; text.rectTransform.offsetMax = Vector2.zero;
            var outline = btnGO.AddComponent<Outline>();
            outline.effectColor = new Color(ThemeManager.Instance.Palette.Background.r, ThemeManager.Instance.Palette.Background.g, ThemeManager.Instance.Palette.Background.b, 0.5f);
            outline.effectDistance = new Vector2(2f, -2f);
        }
    }
}