using UnityEngine;
using UnityEngine.UI;
using UNISA.Core;

namespace UNISA.UIRuntime
{
    public class ThemeBackgroundBuilder : MonoBehaviour
    {
        private void Start()
        {
            var canvas = new GameObject("ThemeCanvas").AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            var scaler = canvas.gameObject.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            canvas.gameObject.AddComponent<GraphicRaycaster>();

            var bg = new GameObject("ThemeBackground");
            var rt = bg.AddComponent<RectTransform>();
            rt.SetParent(canvas.transform, false);
            rt.anchorMin = Vector2.zero; rt.anchorMax = Vector2.one; rt.offsetMin = Vector2.zero; rt.offsetMax = Vector2.zero;
            var img = bg.AddComponent<Image>();
            img.color = ThemeManager.Instance.Palette.Background;
            var role = bg.AddComponent<ThemeRole>();
            role.role = ThemeRoleType.Background;
        }
    }
}