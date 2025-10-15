using UnityEngine;
using UnityEngine.UI;
using UNISA.Core;

namespace UNISA.UIRuntime
{
    public class SettingsUIBuilder : MonoBehaviour
    {
        private Canvas canvas;
        private RectTransform root;
        private SettingsData current;
        private bool isBuilt = false;

        private void Start()
        {
            current = SaveSystem.Instance?.Data.settings ?? new SettingsData();
            Build();
            // Toggle the whole Settings canvas via UIManager to avoid overlay lingering
            UIManager.Instance.settingsRoot = canvas.gameObject;
            UIManager.Instance.ShowMenu(GameManager.Instance.CurrentState);
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
            
            canvas = new GameObject("SettingsCanvas").AddComponent<Canvas>();
            isBuilt = true;
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvas.gameObject.AddComponent<CanvasScaler>().uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            canvas.gameObject.AddComponent<GraphicRaycaster>();
            root = new GameObject("SettingsRoot").AddComponent<RectTransform>();
            root.SetParent(canvas.transform, false);
            root.anchorMin = Vector2.zero; root.anchorMax = Vector2.one; root.offsetMin = Vector2.zero; root.offsetMax = Vector2.zero;
            var bgImage = root.gameObject.AddComponent<Image>();
            bgImage.color = ThemeManager.Instance.Palette.Background;
            var bgRole = root.gameObject.AddComponent<ThemeRole>();
            bgRole.role = ThemeRoleType.Background;

            CreateSlider("Music Volume", new Vector2(0.5f, 0.7f), current.musicVolume, v => current.musicVolume = v);
            CreateSlider("SFX Volume", new Vector2(0.5f, 0.6f), current.sfxVolume, v => current.sfxVolume = v);
            CreateSlider("Difficulty", new Vector2(0.5f, 0.5f), current.difficulty, v => current.difficulty = v);
            CreateToggle("Mute Music", new Vector2(0.5f, 0.4f), current.muteMusic, v => current.muteMusic = v);
            CreateToggle("Mute SFX", new Vector2(0.5f, 0.35f), current.muteSfx, v => current.muteSfx = v);
            CreateToggle("Accent Pulse", new Vector2(0.5f, 0.3f), current.accentPulseEnabled, v => current.accentPulseEnabled = v);
            CreateToggle("Fullscreen", new Vector2(0.5f, 0.25f), current.fullscreen, v => current.fullscreen = v);
            CreateAccentButton("Apply", new Vector2(0.45f, 0.2f), () => SettingsManager.Instance.SaveAndApply(current));
            CreateButton("Back", new Vector2(0.55f, 0.2f), () => GameManager.Instance.SetState(GameState.MainMenu));

            // Theme selectors
            CreateThemeButton("Default", new Vector2(0.35f, 0.15f), "default");
            CreateThemeButton("Retro", new Vector2(0.45f, 0.15f), "retro");
            CreateThemeButton("Sci-Fi", new Vector2(0.55f, 0.15f), "sci-fi");
            CreateThemeButton("Fantasy", new Vector2(0.65f, 0.15f), "fantasy");
        }

        private void CreateSlider(string label, Vector2 anchor, float value, System.Action<float> onChanged)
        {
            var container = new GameObject(label);
            var rt = container.AddComponent<RectTransform>();
            rt.SetParent(root, false);
            rt.anchorMin = anchor; rt.anchorMax = anchor; rt.sizeDelta = new Vector2(300, 60);

            var text = new GameObject("Label").AddComponent<Text>();
            text.text = label; text.alignment = TextAnchor.MiddleLeft; text.color = ThemeManager.Instance.Palette.Text; text.fontSize = 20;
            var role = text.gameObject.AddComponent<ThemeRole>();
            role.role = ThemeRoleType.Text;
            text.rectTransform.SetParent(rt, false);
            text.rectTransform.anchorMin = new Vector2(0f, 0f); text.rectTransform.anchorMax = new Vector2(0.5f, 1f);
            text.rectTransform.offsetMin = Vector2.zero; text.rectTransform.offsetMax = Vector2.zero;

            var sliderGO = new GameObject("Slider");
            var sliderRT = sliderGO.AddComponent<RectTransform>();
            sliderRT.SetParent(rt, false);
            sliderRT.anchorMin = new Vector2(0.5f, 0.25f); sliderRT.anchorMax = new Vector2(1f, 0.75f); sliderRT.offsetMin = Vector2.zero; sliderRT.offsetMax = Vector2.zero;
            var slider = sliderGO.AddComponent<Slider>();
            slider.minValue = 0f; slider.maxValue = 1f; slider.value = value;
            slider.onValueChanged.AddListener(v => onChanged(v));
        }

        private void CreateToggle(string label, Vector2 anchor, bool value, System.Action<bool> onChanged)
        {
            var container = new GameObject(label);
            var rt = container.AddComponent<RectTransform>();
            rt.SetParent(root, false);
            rt.anchorMin = anchor; rt.anchorMax = anchor; rt.sizeDelta = new Vector2(300, 40);

            var text = new GameObject("Label").AddComponent<Text>();
            text.text = label; text.alignment = TextAnchor.MiddleLeft; text.color = Color.white; text.fontSize = 20;
            text.rectTransform.SetParent(rt, false);
            text.rectTransform.anchorMin = new Vector2(0f, 0f); text.rectTransform.anchorMax = new Vector2(0.8f, 1f);
            text.rectTransform.offsetMin = Vector2.zero; text.rectTransform.offsetMax = Vector2.zero;

            var toggleGO = new GameObject("Toggle");
            var toggleRT = toggleGO.AddComponent<RectTransform>();
            toggleRT.SetParent(rt, false);
            toggleRT.anchorMin = new Vector2(0.8f, 0.25f); toggleRT.anchorMax = new Vector2(1f, 0.75f); toggleRT.offsetMin = Vector2.zero; toggleRT.offsetMax = Vector2.zero;
            var toggle = toggleGO.AddComponent<Toggle>();
            toggle.isOn = value;
            toggle.onValueChanged.AddListener(v => onChanged(v));
        }

        private void CreateButton(string label, Vector2 anchor, UnityEngine.Events.UnityAction onClick)
        {
            var btnGO = new GameObject(label);
            var rt = btnGO.AddComponent<RectTransform>();
            rt.SetParent(root, false);
            rt.anchorMin = anchor; rt.anchorMax = anchor; rt.sizeDelta = new Vector2(150, 45);
            var img = btnGO.AddComponent<Image>();
            img.color = new Color(0.12f, 0.12f, 0.16f, 0.9f);
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
            rt.anchorMin = anchor; rt.anchorMax = anchor; rt.sizeDelta = new Vector2(160, 48);
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

        private void CreateThemeButton(string label, Vector2 anchor, string themeName)
        {
            CreateButton(label, anchor, () => {
                current.theme = themeName;
                SettingsManager.Instance.Apply(current);
            });
        }
    }
}