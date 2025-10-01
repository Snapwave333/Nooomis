using UnityEngine;
using UnityEngine.UI;

namespace UNISA.Core
{
    public enum ThemeRoleType { Background, Panel, Text, Accent }

    public class ThemeRole : MonoBehaviour
    {
        public ThemeRoleType role = ThemeRoleType.Panel;
        public Graphic target;

        public void Apply(ThemePalette palette)
        {
            var g = target != null ? target : GetComponent<Graphic>();
            if (g == null) return;
            switch (role)
            {
                case ThemeRoleType.Background: g.color = palette.Background; break;
                case ThemeRoleType.Panel: g.color = palette.Panel; break;
                case ThemeRoleType.Text: g.color = palette.Text; break;
                case ThemeRoleType.Accent: g.color = palette.Accent; break;
            }
        }
    }
}