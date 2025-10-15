using UnityEngine;

public static class SocialShare {
  public static void ShareText(string text) {
    #if UNITY_ANDROID && !UNITY_EDITOR
    try {
      AndroidJavaClass intentClass = new AndroidJavaClass("android.content.Intent");
      AndroidJavaObject intent = new AndroidJavaObject("android.content.Intent", intentClass.GetStatic<string>("ACTION_SEND"));
      intent.Call<AndroidJavaObject>("setType", "text/plain");
      intent.Call<AndroidJavaObject>("putExtra", intentClass.GetStatic<string>("EXTRA_TEXT"), text);
      AndroidJavaObject activity = new AndroidJavaClass("com.unity3d.player.UnityPlayer").GetStatic<AndroidJavaObject>("currentActivity");
      AndroidJavaObject chooser = intentClass.CallStatic<AndroidJavaObject>("createChooser", intent, "Share your score");
      activity.Call("startActivity", chooser);
    } catch {}
    #endif
  }
}