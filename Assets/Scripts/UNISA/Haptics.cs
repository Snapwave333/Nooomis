using UnityEngine;

public static class Haptics {
  public static void Vibrate(int milliseconds = 30, int amplitude = 128) {
    #if UNITY_ANDROID && !UNITY_EDITOR
    try {
      AndroidJavaObject activity = new AndroidJavaClass("com.unity3d.player.UnityPlayer").GetStatic<AndroidJavaObject>("currentActivity");
      AndroidJavaObject ctx = activity.Call<AndroidJavaObject>("getApplicationContext");
      AndroidJavaObject vib = ctx.Call<AndroidJavaObject>("getSystemService", "vibrator");
      if (vib != null) {
        int sdk = new AndroidJavaClass("android.os.Build$VERSION").GetStatic<int>("SDK_INT");
        if (sdk >= 26) {
          AndroidJavaClass vibCls = new AndroidJavaClass("android.os.VibrationEffect");
          AndroidJavaObject effect = vibCls.CallStatic<AndroidJavaObject>("createOneShot", (long)milliseconds, amplitude);
          vib.Call("vibrate", effect);
        } else {
          vib.Call("vibrate", (long)milliseconds);
        }
      }
    } catch { }
    #endif
  }
}