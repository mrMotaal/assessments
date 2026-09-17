$port = 5055
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Output "Server listening on http://localhost:$port/"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath
        if ($path -eq "/" -or $path -eq "") { $path = "/index.html" }
        $localFile = Join-Path $PSScriptRoot ($path.TrimStart('/'))

        if (Test-Path $localFile -PathType Container) {
            $localFile = Join-Path $localFile "index.html"
        }

        # SPA Clean URL Fallback: If route has no file extension and file not found, serve index.html
        if (-not (Test-Path $localFile -PathType Leaf)) {
            if ([string]::IsNullOrEmpty([System.IO.Path]::GetExtension($localFile))) {
                $localFile = Join-Path $PSScriptRoot "index.html"
            }
        }

        if (Test-Path $localFile -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($localFile)
            $ext = [System.IO.Path]::GetExtension($localFile).ToLower()
            $contentType = "text/plain"
            switch ($ext) {
                ".html" { $contentType = "text/html; charset=utf-8" }
                ".css"  { $contentType = "text/css; charset=utf-8" }
                ".js"   { $contentType = "application/javascript; charset=utf-8" }
                ".png"  { $contentType = "image/png" }
                ".jpg"  { $contentType = "image/jpeg" }
                ".jpeg" { $contentType = "image/jpeg" }
                ".svg"  { $contentType = "image/svg+xml" }
                ".json" { $contentType = "application/json" }
            }
            $response.ContentType = $contentType
            $response.ContentLength64 = $content.Length
            $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
            $response.AddHeader("Pragma", "no-cache")
            $response.AddHeader("Expires", "0")
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
        }
        $response.Close()
    } catch {
        # Continue listening
    }
}
