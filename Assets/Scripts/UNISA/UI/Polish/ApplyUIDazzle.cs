using UnityEngine;
using UnityEngine.UI;

public class ApplyUIDazzle : MonoBehaviour {
  public Color tint = new Color(1f,1f,1f,0.6f);
  public float blend = 0.35f;
  void Start() {
    var img = GetComponent<Image>();
    if (img != null) {
      var mat = new Material(Shader.Find("UNISA/UIDazzle"));
      mat.SetColor("_Color", tint);
      mat.SetFloat("_Blend", blend);
      img.material = mat;
    }
  }
}