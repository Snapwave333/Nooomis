Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Write-Host "Building NOMIS Installer with a sparkly unique icon..."

$workspace = "c:\Users\chrom\OneDrive\Desktop\apps\games\simon"
$webSrc = Join-Path $workspace 'web'
if (-not (Test-Path $webSrc)) { throw "Web source folder not found at $webSrc" }

$temp = Join-Path $env:TEMP 'nomis_installer'
New-Item -ItemType Directory -Force -Path $temp | Out-Null

# Generate icon at web/assets/nomis.ico
Add-Type -AssemblyName System.Drawing
$icoDir = Join-Path $webSrc 'assets'
New-Item -ItemType Directory -Force -Path $icoDir | Out-Null
$icoPath = Join-Path $icoDir 'nomis.ico'

$bmp = New-Object System.Drawing.Bitmap -ArgumentList 256,256
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$bg1 = [System.Drawing.Color]::FromArgb(15,23,40)
$bg2 = [System.Drawing.Color]::FromArgb(11,15,23)
$rect = New-Object System.Drawing.Rectangle -ArgumentList 0,0,256,256
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList $rect, $bg1, $bg2, 45
$g.FillRectangle($brush,0,0,256,256)
$accent = [System.Drawing.Color]::FromArgb(101,195,255)
$pen = New-Object System.Drawing.Pen -ArgumentList $accent, 14
$g.DrawEllipse($pen, 26,26,204,204)
$font = New-Object System.Drawing.Font -ArgumentList 'Segoe UI', 120.0, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = 'Center'; $sf.LineAlignment = 'Center'
$textBrush = New-Object System.Drawing.SolidBrush -ArgumentList ([System.Drawing.Color]::FromArgb(3,18,37))
$g.DrawString('N', $font, $textBrush, 128,128, $sf)
$g.Dispose()
$hicon = $bmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hicon)
$fs = [System.IO.File]::Open($icoPath, [System.IO.FileMode]::Create)
$icon.Save($fs); $fs.Close()
$bmp.Dispose()
Write-Host "Icon generated at $icoPath"

# Write Installer.cs
$installerCsPath = Join-Path $temp 'Installer.cs'
$installerCs = @"
using System;
using System.IO;
using System.Windows.Forms;
using System.Diagnostics;

class Installer {
  [STAThread]
  static void Main() {
    try {
      string src = @"$webSrc";
      string dest = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "NOMIS");
      if (Directory.Exists(dest)) Directory.Delete(dest, true);
      CopyDir(src, dest);
      // Write Launcher.cs
      string launcherSrc = Path.Combine(Path.GetTempPath(), "NOMIS_Launcher.cs");
      File.WriteAllText(launcherSrc, GetLauncherSource(dest));
      // Find csc
      string csc = FindCsc();
      if (string.IsNullOrEmpty(csc) || !File.Exists(csc)) throw new Exception("csc.exe not found");
      // Compile launcher
      string launcherExe = Path.Combine(dest, "NOMISLauncher.exe");
      string ico = Path.Combine(dest, "assets", "nomis.ico");
      var psi = new ProcessStartInfo(csc, "/nologo /target:winexe /win32icon:" + Quote(ico) + " /r:System.Windows.Forms.dll /out:" + Quote(launcherExe) + " " + Quote(launcherSrc));
      psi.CreateNoWindow = true; psi.UseShellExecute = false;
      var p = Process.Start(psi); p.WaitForExit();
      if (p.ExitCode != 0) throw new Exception("Failed to build launcher (csc exit code " + p.ExitCode + ")");

      // Create Desktop shortcut to launcher
      string desktop = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
      string shortcutPath = Path.Combine(desktop, "NOMIS.lnk");
      Type shellType = Type.GetTypeFromProgID("WScript.Shell");
      dynamic shell = Activator.CreateInstance(shellType);
      var shortcut = shell.CreateShortcut(shortcutPath);
      shortcut.TargetPath = launcherExe;
      shortcut.WorkingDirectory = dest;
      shortcut.IconLocation = ico;
      shortcut.Save();
      MessageBox.Show("Installed to " + dest + "\nLauncher and Desktop shortcut created.", "NOMIS Installer");
    } catch (Exception ex) {
      MessageBox.Show("Install failed: " + ex.Message, "NOMIS Installer");
    }
  }
  static void CopyDir(string sourceDir, string destDir) {
    Directory.CreateDirectory(destDir);
    foreach (string dir in Directory.GetDirectories(sourceDir, "*", SearchOption.AllDirectories)) {
      string rel = dir.Substring(sourceDir.Length).TrimStart(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
      Directory.CreateDirectory(Path.Combine(destDir, rel));
    }
    foreach (string file in Directory.GetFiles(sourceDir, "*", SearchOption.AllDirectories)) {
      string rel = file.Substring(sourceDir.Length).TrimStart(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
      string target = Path.Combine(destDir, rel);
      Directory.CreateDirectory(Path.GetDirectoryName(target));
      File.Copy(file, target, true);
    }
  }
  static string Quote(string s) { return "\"" + s + "\""; }
  static string FindCsc() {
    string[] paths = new string[] {
      @"C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe",
      @"C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\csc.exe"
    };
    foreach (var p in paths) if (File.Exists(p)) return p;
    return null;
  }
  static string GetLauncherSource(string root) {
    string escRoot = root.Replace("\"", "\"\"");
    return
      "using System;\n" +
      "using System.IO;\n" +
      "using System.Net;\n" +
      "using System.Threading;\n" +
      "using System.Windows.Forms;\n\n" +
      "class NOMISLauncher {\n" +
      "  [STAThread]\n" +
      "  static void Main() {\n" +
      "    string root = @\"" + escRoot + "\";\n" +
      "    int port = FindPort(12000,13000);\n" +
      "    if (port == -1) { MessageBox.Show(\"No free port found\"); return; }\n\n" +
      "    HttpListener listener = new HttpListener();\n" +
      "    string prefix = \"http://localhost:\" + port + \"/\";\n" +
      "    listener.Prefixes.Add(prefix);\n" +
      "    try { listener.Start(); } catch (Exception ex) { MessageBox.Show(\"Server start failed: \" + ex.Message); return; }\n\n" +
      "    Thread t = new Thread(() => Serve(listener, root)); t.IsBackground = true; t.Start();\n" +
      "    try { System.Diagnostics.Process.Start(prefix + \"index.html\"); } catch {}\n" +
      "    Application.Run(new ApplicationContext());\n" +
      "    listener.Stop();\n" +
      "  }\n" +
      "  static int FindPort(int start, int end) {\n" +
      "    for (int p = start; p <= end; p++) {\n" +
      "      HttpListener l = new HttpListener();\n" +
      "      try { l.Prefixes.Add(\"http://localhost:\" + p + \"/\"); l.Start(); l.Stop(); return p; } catch { }\n" +
      "    }\n" +
      "    return -1;\n" +
      "  }\n" +
      "  static void Serve(HttpListener l, string root) {\n" +
      "    while (l.IsListening) {\n" +
      "      try { var ctx = l.GetContext(); Handle(ctx, root); } catch { break; }\n" +
      "    }\n" +
      "  }\n" +
      "  static void Handle(HttpListenerContext ctx, string root) {\n" +
      "    string path = ctx.Request.Url.AbsolutePath.TrimStart('/');\n" +
      "    if (string.IsNullOrEmpty(path)) path = \"index.html\";\n" +
      "    string full = Path.Combine(root, path.Replace('/', Path.DirectorySeparatorChar));\n" +
      "    if (!File.Exists(full)) { ctx.Response.StatusCode = 404; ctx.Response.Close(); return; }\n" +
      "    string ext = Path.GetExtension(full).ToLowerInvariant();\n" +
      "    string mime = ext == \".html\" ? \"text/html\" : ext == \".css\" ? \"text/css\" : ext == \".js\" ? \"application/javascript\" : ext == \".svg\" ? \"image/svg+xml\" : ext == \".ico\" ? \"image/x-icon\" : ext == \".png\" ? \"image/png\" : ext == \".jpg\" || ext == \".jpeg\" ? \"image/jpeg\" : ext == \".mp3\" ? \"audio/mpeg\" : ext == \".ogg\" ? \"audio/ogg\" : ext == \".wav\" ? \"audio/wav\" : \"application/octet-stream\";\n" +
      "    byte[] bytes = File.ReadAllBytes(full);\n" +
      "    ctx.Response.ContentType = mime; ctx.Response.ContentLength64 = bytes.Length;\n" +
      "    ctx.Response.OutputStream.Write(bytes, 0, bytes.Length); ctx.Response.OutputStream.Close();\n" +
      "  }\n" +
      "}";
  }
}
"@
Set-Content -Path $installerCsPath -Value $installerCs -Encoding UTF8
Write-Host "Installer source written to $installerCsPath"

# Find csc.exe
$csc = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if (-not (Test-Path $csc)) { $csc = "C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe" }
if (-not (Test-Path $csc)) { throw "csc.exe not found. Please install .NET Framework Developer Pack." }

$desktopExe = Join-Path ([Environment]::GetFolderPath('Desktop')) 'NOMISInstaller.exe'
& $csc /nologo /target:winexe /win32icon:$icoPath /r:System.Windows.Forms.dll /out:$desktopExe $installerCsPath
Write-Host "Installer built: $desktopExe"