$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$live = [System.IO.File]::ReadAllText((Join-Path $root "templo-interno.html"))
$start = "    <!-- Container principal -->"
$end = "    <script>"
$i = $live.IndexOf($start)
$j = $live.IndexOf($end, $i)
if ($i -lt 0 -or $j -lt 0) { throw "live markers missing" }
$chunk = $live.Substring($i, $j - $i)

$funcs = @"
        function abrirDestino(el) {
            const url = el && el.getAttribute('data-url');
            if (!url) {
                return;
            }
            window.open(url, '_blank', 'noopener,noreferrer');
        }

        function enviarEmail() {
            window.location.href = 'mailto:teris.ofc777@gmail.com';
        }

"@

$files = @(
    "templo-interno-android-fix.html",
    "templo-interno-fixado.html",
    "templo-interno-mobile-fix.html"
)

$pattern = "(?s)\r?\n        function downloadPDF\(filename\) \{.*?\r?\n        function visitarYouTube\(\) \{.*?\r?\n        \}\r?\n"

foreach ($name in $files) {
    $path = Join-Path $root $name
    $text = [System.IO.File]::ReadAllText($path)
    $i = $text.IndexOf($start)
    $j = $text.IndexOf($end, $i)
    if ($i -lt 0 -or $j -lt 0) { throw "markers missing in $name" }
    $text = $text.Substring(0, $i) + $chunk + $text.Substring($j)
    $text = $text.Replace("window.location.href = '../index.html';", "window.location.href = './index.html';")
    $replaced = [regex]::Replace($text, $pattern, "`r`n$funcs", 1)
    if ($replaced -eq $text) { throw "functions not found in $name" }
    $utf8 = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($path, $replaced, $utf8)
    Write-Output "$name updated"
}
