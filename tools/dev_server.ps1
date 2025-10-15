param(
  [int]$Port = 8000,
  [string]$Root = 'web'
)

$rootPath = (Resolve-Path $Root).Path
Write-Host "Serving $rootPath on http://localhost:$Port/welcome.html"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $rawUrl = $ctx.Request.RawUrl
    if ($rawUrl -eq '/') { $rawUrl = '/welcome.html' }
    $file = Join-Path $rootPath ($rawUrl.TrimStart('/'))
    if (-not (Test-Path $file)) {
      $ctx.Response.StatusCode = 404
      $bytesNF = [Text.Encoding]::UTF8.GetBytes('Not Found')
      $ctx.Response.OutputStream.Write($bytesNF, 0, $bytesNF.Length)
      $ctx.Response.Close()
      continue
    }
    $ext = [IO.Path]::GetExtension($file).ToLowerInvariant()
    switch ($ext) {
      '.html' { $mime = 'text/html' }
      '.js'   { $mime = 'application/javascript' }
      '.css'  { $mime = 'text/css' }
      '.png'  { $mime = 'image/png' }
      '.jpg'  { $mime = 'image/jpeg' }
      '.svg'  { $mime = 'image/svg+xml' }
      default { $mime = 'application/octet-stream' }
    }
    $bytes = [IO.File]::ReadAllBytes($file)
    $ctx.Response.ContentType = $mime
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $ctx.Response.Close()
  }
}
finally {
  try { $listener.Stop() } catch {}
}