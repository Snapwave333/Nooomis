using UnityEngine;
using UnityEngine.Events;

namespace Unisa.Simon
{
    public class SimonButton : MonoBehaviour
    {
        public int buttonIndex; // 0=green,1=red,2=blue,3=yellow
        public Renderer targetRenderer; // for 3D; set Image for UI in another variant
        public Color baseColor = Color.white;
        public Color pulseColor = Color.white;
        public float pulseDuration = 0.2f;
        public UnityEvent<int> OnPressed;

        private float pulseUntil = 0f;

        private void Update()
        {
            if (targetRenderer == null) return;
            var t = Time.time;
            if (t < pulseUntil)
            {
                targetRenderer.material.SetColor("_Color", pulseColor);
            }
            else
            {
                targetRenderer.material.SetColor("_Color", baseColor);
            }
        }

        public void Pulse(bool strong)
        {
            pulseUntil = Time.time + (strong ? pulseDuration * 1.6f : pulseDuration);
        }

        private void OnMouseDown()
        {
            // desktop testing via mouse
            OnPressed?.Invoke(buttonIndex);
        }

        // For Unity UI Button hook
        public void ClickUI()
        {
            OnPressed?.Invoke(buttonIndex);
        }
    }
}