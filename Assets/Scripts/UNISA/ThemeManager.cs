using UnityEngine;
using UnityEngine.UI;

namespace UNISA.Core
{
    public class ThemeManager : MonoBehaviour
    {
        public static ThemeManager Instance { get; private set; }

        public ThemePalette Palette { get; private set; } = ThemePalette.Default();

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        public void SetTheme(string name)
        {
            switch ((name ?? "default").ToLowerInvariant())
            {
                case "retro": Palette = ThemePalette.Retro(); break;
                case "sci-fi": Palette = ThemePalette.SciFi(); break;
                case "fantasy": Palette = ThemePalette.Fantasy(); break;
                default: Palette = ThemePalette.Default(); break;
            }
        }

        public void ApplyToScene()
        {
            // First: apply explicit ThemeRole mappings
            var roles = GameObject.FindObjectsOfType<ThemeRole>(true);
            foreach (var r in roles) r.Apply(Palette);

            // Fallback: basic heuristics for remaining UI
            var texts = GameObject.FindObjectsOfType<Text>(true);
            foreach (var t in texts) t.color = Palette.Text;

            var images = GameObject.FindObjectsOfType<Image>(true);
            foreach (var img in images)
            {
                img.color = Palette.Panel;
            }
        }
    }

    public struct ThemePalette
    {
        public Color Background;
        public Color Panel;
        public Color Text;
        public Color Accent;

        public static ThemePalette Default()
        {
            return new ThemePalette
            {
                Background = new Color(0.05f, 0.05f, 0.08f, 1f),
                Panel = new Color(0.12f, 0.12f, 0.16f, 0.9f),
                Text = Color.white,
                Accent = new Color(0.39f, 0.76f, 1f, 1f)
            };
        }

        public static ThemePalette Retro()
        {
            return new ThemePalette
            {
                Background = new Color(0.12f, 0.08f, 0.04f, 1f),
                Panel = new Color(0.26f, 0.23f, 0.12f, 0.92f),
                Text = new Color(1f, 0.92f, 0.6f, 1f),
                Accent = new Color(1f, 0.6f, 0.2f, 1f)
            };
        }

        public static ThemePalette SciFi()
        {
            return new ThemePalette
            {
                Background = new Color(0.02f, 0.06f, 0.12f, 1f),
                Panel = new Color(0.14f, 0.18f, 0.22f, 0.94f),
                Text = new Color(0.85f, 0.95f, 1f, 1f),
                Accent = new Color(0.24f, 0.72f, 1f, 1f)
            };
        }

        public static ThemePalette Fantasy()
        {
            return new ThemePalette
            {
                Background = new Color(0.12f, 0.04f, 0.16f, 1f),
                Panel = new Color(0.26f, 0.16f, 0.32f, 0.94f),
                Text = new Color(0.95f, 0.9f, 1f, 1f),
                Accent = new Color(1f, 0.84f, 0.2f, 1f)
            };
        }
    }
}