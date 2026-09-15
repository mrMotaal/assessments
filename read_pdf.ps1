Add-Type -AssemblyName System.IO.Compression.FileSystem

$pdfPath = "C:\Users\Mr Motaal\.gemini\antigravity-ide\brain\828b760e-a792-4f2e-a69b-83866c850529\.user_uploaded\media_1789507778890.pdf"
$bytes = [System.IO.File]::ReadAllBytes($pdfPath)
$text = [System.Text.Encoding]::ASCII.GetString($bytes)

# Find all stream ... endstream positions
$streamMatches = [regex]::Matches($text, 'stream\r?\n')
Write-Output "Found streams: $($streamMatches.Count)"

$streamIndex = 0
foreach ($sm in $streamMatches) {
    $streamIndex++
    $start = $sm.Index + $sm.Length
    $end = $text.IndexOf("endstream", $start)
    if ($end -gt $start) {
        $length = $end - $start
        # skip any trailing newline before endstream
        while ($length -gt 0 -and ($bytes[$start + $length - 1] -eq 10 -or $bytes[$start + $length - 1] -eq 13)) {
            $length--
        }
        $streamBytes = New-Object byte[] $length
        [Array]::Copy($bytes, $start, $streamBytes, 0, $length)

        try {
            # Try to decompress assuming zlib header (2 bytes)
            $ms = New-Object System.IO.MemoryStream($streamBytes, 2, $length - 2)
            $ds = New-Object System.IO.Compression.DeflateStream($ms, [System.IO.Compression.CompressionMode]::Decompress)
            $outMs = New-Object System.IO.MemoryStream
            $ds.CopyTo($outMs)
            $decompressed = [System.Text.Encoding]::UTF8.GetString($outMs.ToArray())
            
            if ($decompressed -match 'subtracting|Group|Week 5|First') {
                Write-Output "=== STREAM $streamIndex matches ==="
                $lines = $decompressed -split "`r?`n"
                foreach ($line in $lines) {
                    if ($line -match 'TJ|Tj|subtracting|equal|result') {
                        Write-Output $line
                    }
                }
            }
        } catch {
            # Not zlib or error
        }
    }
}
