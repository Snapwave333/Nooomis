Param(
  [int]$Port = 5500,
  [string]$Root = (Get-Location)
)

$listener = [System.Net.HttpListener]::new()
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Server started at $prefix"

try {
  while ($true) {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response

    $absPath = $req.Url.AbsolutePath.TrimStart('/')
    $path = [System.Uri]::UnescapeDataString($absPath)
    if ([string]::IsNullOrWhiteSpace($path)) {
      $path = 'web/index.html'
    } else {
      $path = Join-Path 'web' $path
    }
    $full = Join-Path $Root $path

    # If the requested path is a directory, serve index.html within it
    if (Test-Path $full -PathType Container) {
      $full = Join-Path $full 'index.html'
    }

    if (-not (Test-Path $full)) {
      $res.StatusCode = 404
      $bytes = [System.Text.Encoding]::UTF8.GetBytes('Not Found')
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      $res.OutputStream.Close()
      continue
    }

    $ext = [System.IO.Path]::GetExtension($full).ToLower()
    switch ($ext) {
      '.html' { $res.ContentType = 'text/html' }
      '.css' { $res.ContentType = 'text/css' }
      '.js' { $res.ContentType = 'application/javascript' }
      '.png' { $res.ContentType = 'image/png' }
      '.svg' { $res.ContentType = 'image/svg+xml' }
      '.ico' { $res.ContentType = 'image/x-icon' }
      default { $res.ContentType = 'application/octet-stream' }
    }

    $bytes = [System.IO.File]::ReadAllBytes($full)
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
    $res.OutputStream.Close()
  }
}
finally {
  $listener.Stop()
  $listener.Close()
}