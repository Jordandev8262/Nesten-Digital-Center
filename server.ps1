param(
  [int]$Port = 5500
)
$base = (Get-Location).Path
$prefix = "http://localhost:$Port/"
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "✅ Static server running at $prefix (root: $base). Press Ctrl+C to stop."

function Get-ContentType($ext){
  switch ($ext.ToLowerInvariant()) {
    ".html" { return "text/html; charset=utf-8" }
    ".css"  { return "text/css" }
    ".js"   { return "application/javascript" }
    ".svg"  { return "image/svg+xml" }
    ".json" { return "application/json" }
    default  { return "application/octet-stream" }
  }
}

try {
  while ($true) {
    $context   = $listener.GetContext()
    $request   = $context.Request
    $response  = $context.Response

    $reqPath = [Uri]::UnescapeDataString($request.Url.AbsolutePath.TrimStart('/'))
    if ([string]::IsNullOrWhiteSpace($reqPath)) { $reqPath = 'index.html' }
    $localPath = Join-Path $base $reqPath

    if (-not ($localPath.StartsWith($base))) {
      $response.StatusCode = 403
      $bytes = [Text.Encoding]::UTF8.GetBytes('Forbidden')
      $response.OutputStream.Write($bytes,0,$bytes.Length)
      $response.Close()
      continue
    }

    if (Test-Path $localPath -PathType Leaf) {
      $ext = [IO.Path]::GetExtension($localPath)
      $ct  = Get-ContentType $ext
      $bytes = [IO.File]::ReadAllBytes($localPath)
      $response.ContentType = $ct
      $response.ContentLength64 = $bytes.Length
      $response.StatusCode = 200
      $response.OutputStream.Write($bytes,0,$bytes.Length)
    } else {
      $response.StatusCode = 404
      $bytes = [Text.Encoding]::UTF8.GetBytes('Not Found')
      $response.OutputStream.Write($bytes,0,$bytes.Length)
    }
    $response.Close()
  }
}
finally {
  $listener.Stop(); $listener.Close()
}