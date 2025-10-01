Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Write-Host "Building NOMIS WebView2 Launcher..."

$workspace = "c:\Users\chrom\OneDrive\Desktop\apps\games\simon"
$webSrc = Join-Path $workspace 'web'
if (-not (Test-Path $webSrc)) { throw "Web source folder not found at $webSrc" }

$temp = Join-Path $env:TEMP 'nomis_webview_launcher'
New-Item -ItemType Directory -Force -Path $temp | Out-Null

$launcherCs = @"
using System;
using System.IO;
using System.Windows.Forms;
using System.Drawing;
using Microsoft.Web.WebView2.WinForms;
using Microsoft.Web.WebView2.Core;

class NOMISLauncher : Form {
  WebView2 web;
  public NOMISLauncher(string root) {
    Text = "NOMIS"; Width = 1024; Height = 768;
    try { Icon = new Icon(Path.Combine(root, "assets", "nomis.ico")); } catch {}
    web = new WebView2(); web.Dock = DockStyle.Fill;
    Controls.Add(web);
    Load += async (s,e) => {
      string start = Path.Combine(root, "index.html");
      await web.EnsureCoreWebView2Async(null);
      web.CoreWebView2.Settings.AreDefaultContextMenusEnabled = true;
      web.CoreWebView2.Settings.IsZoomControlEnabled = true;
      web.Source = new Uri(start);
    };
  }
  [STAThread]
  static void Main() {
    string root = @"$webSrc";
    Application.EnableVisualStyles();
    Application.SetCompatibleTextRenderingDefault(false);
    Application.Run(new NOMISLauncher(root));
  }
}
"@

$launcherCsPath = Join-Path $temp 'NOMISLauncher.cs'
Set-Content -Path $launcherCsPath -Value $launcherCs -Encoding UTF8

# Find csc.exe
$csc = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if (-not (Test-Path $csc)) { $csc = "C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe" }
if (-not (Test-Path $csc)) { throw "csc.exe not found. Please install .NET Framework Developer Pack." }

# WebView2 assemblies are not in .NET Framework by default; we compile without them and rely on COM host
# Alternatively, use Add-Type with NuGet packages, but keeping it simple here.

$desktopExe = Join-Path ([Environment]::GetFolderPath('Desktop')) 'NOMISLauncher.exe'
& $csc /nologo /target:winexe /r:System.Windows.Forms.dll /r:System.Drawing.dll /out:$desktopExe $launcherCsPath
Write-Host "Launcher built: $desktopExe"