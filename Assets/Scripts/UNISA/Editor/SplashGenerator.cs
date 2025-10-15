using UnityEditor;
using UnityEngine;
using System.IO;

public class SplashGenerator : EditorWindow {
  [MenuItem("UNISA/Generate Splash Images")]
  public static void Generate() {
    string dir = Path.Combine("Assets", "Generated", "Splash");
    Directory.CreateDirectory(dir);
    foreach (var size in new[]{256,512,1024}) {
      Texture2D tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
      for (int y=0;y<size;y++) for(int x=0;x<size;x++){
        float u = x/(float)size, v = y/(float)size;
        Color c = Color.Lerp(new Color(0.06f,0.09f,0.16f,1), new Color(0.04f,0.7f,1f,1), Mathf.PingPong(u+v,1f));
        tex.SetPixel(x,y,c);
      }
      tex.Apply();
      var bytes = tex.EncodeToPNG();
      File.WriteAllBytes(Path.Combine(dir, $"splash_{size}.png"), bytes);
    }
    AssetDatabase.Refresh();
    PlayerSettings.SplashScreen.show = true;
    PlayerSettings.SplashScreen.backgroundColor = new Color(0.06f,0.09f,0.16f,1);
  }
}