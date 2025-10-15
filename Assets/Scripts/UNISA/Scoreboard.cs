using UnityEngine;
using System.Collections.Generic;

public class Scoreboard : MonoBehaviour {
  public int maxEntries = 10;
  public List<int> scores = new List<int>();
  const string Key = "UNISA_SCORES";
  void Awake(){ Load(); }
  public void Add(int score){ scores.Add(score); scores.Sort((a,b)=>b.CompareTo(a)); if(scores.Count>maxEntries) scores.RemoveRange(maxEntries, scores.Count-maxEntries); Save(); }
  public void Save(){ PlayerPrefs.SetString(Key, string.Join(",", scores)); PlayerPrefs.Save(); }
  public void Load(){ scores.Clear(); var s=PlayerPrefs.GetString(Key,""); if(!string.IsNullOrEmpty(s)){ foreach(var p in s.Split(',')){ if(int.TryParse(p,out var v)){ scores.Add(v);} } } }
}