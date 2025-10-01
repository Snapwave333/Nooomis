using UnityEngine;
using UnityEngine.UI;
using UNISA.Core;

namespace UNISA.UIRuntime
{
    public class PauseMenuUIBuilder : MonoBehaviour
    {
        private Canvas canvas;
        private RectTransform root;

        private void Start()
        {
            Build();
            UIManager.Instance.pauseMenuRoot = root.gameObject;
            UIManager.Instance.ShowMenu(GameManager.Instance.CurrentState);
        }

        private void Build()
        {
            canvas = new GameObject("PauseCanvas").AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvas.gameObject.AddComponent<CanvasScaler>().uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            canvas.gameObject.AddComponent<GraphicRaycaster>();
            root = new GameObject("PauseRoot").AddComponent<RectTransform>();
            root.SetParent(canvas.transform, false);
            root.anchorMin = Vector2.zero; root.anchorMax = Vector2.one; root.offsetMin = Vector2.zero; root.offsetMax = Vector2.zero;
            var bgImage = root.gameObject.AddComponent<Image>();
            bgImage.color = ThemeManager.Instance.Palette.Background;
            var bgRole = root.gameObject.AddComponent<ThemeRole>();
            bgRole.role = ThemeRoleType.Background;

            CreateAccentButton("Resume", new Vector2(0.5f, 0.6f), () => GameManager.Instance.ResumeGame());
            CreateButton("Main Menu", new Vector2(0.5f, 0.5f), () => GameManager.Instance.SetState(GameState.MainMenu));
        }

        private void CreateButton(string label, Vector2 anchor, UnityEngine.Events.UnityAction onClick)
        {
            var btnGO = new GameObject(label);
            var rt = btnGO.AddComponent<RectTransform>();
            rt.SetParent(root, false);
            rt.anchorMin = anchor; rt.anchorMax = anchor; rt.sizeDelta = new Vector2(220, 55);
            var img = btnGO.AddComponent<Image>();
            img.color = ThemeManager.Instance.Palette.Panel;
            var role = btnGO.AddComponent<ThemeRole>();
            role.role = ThemeRoleType.Panel;
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
            text.text = label; text.alignment = TextAnchor.MiddleCenter; text.color = ThemeManager.Instance.Palette.Text; text.fontSize = 22;
            var textRole = textGO.AddComponent<ThemeRole>();
            textRole.role = ThemeRoleType.Text;
            text.rectTransform.SetParent(rt, false);
            text.rectTransform.anchorMin = Vector2.zero; text.rectTransform.anchorMax = Vector2.one; text.rectTransform.offsetMin = Vector2.zero; text.rectTransform.offsetMax = Vector2.zero;
        }

        private void CreateAccentButton(string label, Vector2 anchor, UnityEngine.Events.UnityAction onClick)
        {
            var btnGO = new GameObject(label);
            var rt = btnGO.AddComponent<RectTransform>();
            rt.SetParent(root, false);
            rt.anchorMin = anchor; rt.anchorMax = anchor; rt.sizeDelta = new Vector2(230, 58);
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
            text.text = label; text.alignment = TextAnchor.MiddleCenter; text.color = ThemeManager.Instance.Palette.Background; text.fontSize = 22;
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