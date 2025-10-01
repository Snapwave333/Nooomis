using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;

namespace UNISA.Core
{
    public class AccentPulse : MonoBehaviour, IPointerEnterHandler, IPointerExitHandler, ISelectHandler, IDeselectHandler
    {
        public bool onlyOnHover = true;
        public float scaleAmplitude = 0.02f;
        public float brightnessAmplitude = 0.06f;
        public float speed = 3f;
        public Graphic targetGraphic; // optional override

        private RectTransform rt;
        private Graphic g;
        private Color baseColor;
        private Vector3 baseScale;
        private bool isPulsing = false;

        private void Awake()
        {
            rt = GetComponent<RectTransform>();
            g = targetGraphic != null ? targetGraphic : GetComponent<Graphic>();
            baseScale = rt != null ? rt.localScale : Vector3.one;
            baseColor = g != null ? g.color : Color.white;
        }

        private void OnEnable()
        {
            if (!onlyOnHover) StartPulse();
        }

        private void OnDisable()
        {
            StopPulse();
            ResetVisuals();
        }

        public void OnPointerEnter(PointerEventData eventData) { if (onlyOnHover) StartPulse(); }
        public void OnPointerExit(PointerEventData eventData) { if (onlyOnHover) StopPulse(); }
        public void OnSelect(BaseEventData eventData) { if (onlyOnHover) StartPulse(); }
        public void OnDeselect(BaseEventData eventData) { if (onlyOnHover) StopPulse(); }

        private void StartPulse()
        {
            if (isPulsing) return;
            isPulsing = true;
            StopAllCoroutines();
            StartCoroutine(Pulse());
        }

        private void StopPulse()
        {
            if (!isPulsing) return;
            isPulsing = false;
            StopAllCoroutines();
            ResetVisuals();
        }

        private System.Collections.IEnumerator Pulse()
        {
            while (isPulsing)
            {
                float t = Time.unscaledTime * speed;
                float s = 1f + Mathf.Sin(t) * scaleAmplitude;
                if (rt != null) rt.localScale = baseScale * s;

                if (g != null)
                {
                    float k = (Mathf.Sin(t) * 0.5f + 0.5f) * brightnessAmplitude;
                    var targetColor = Color.white;
                    // Keep alpha from base color
                    var c = Color.Lerp(baseColor, targetColor, k);
                    c.a = baseColor.a;
                    g.color = c;
                }
                yield return null;
            }
        }

        private void ResetVisuals()
        {
            if (rt != null) rt.localScale = baseScale;
            if (g != null) g.color = baseColor;
        }
    }
}