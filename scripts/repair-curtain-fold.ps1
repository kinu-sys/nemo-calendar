param(
  [Parameter(Mandatory = $true)][string]$RepairImage
)

# Use the image tool's inpainted cloth only in the small requested area.
# Keep the original cutout and every pixel outside that area unchanged.
Add-Type -AssemblyName System.Drawing
$originalPath = Join-Path $PSScriptRoot '../public/decorations/rose-curtain.png'
$outputPath = Join-Path $PSScriptRoot '../public/decorations/rose-curtain-repaired.png'
$original = [System.Drawing.Bitmap]::new($originalPath)
$generated = [System.Drawing.Bitmap]::new((Resolve-Path -LiteralPath $RepairImage).Path)
$scaled = [System.Drawing.Bitmap]::new($original.Width, $original.Height)
$graphics = [System.Drawing.Graphics]::FromImage($scaled)
try {
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.DrawImage($generated, 0, 0, $original.Width, $original.Height)
  $graphics.Dispose()
  $result = $original.Clone()
  try {
    for ($y = 0; $y -lt 79; $y++) {
      for ($x = 286; $x -lt 366; $x++) {
        # Preserve the flower fastener and blend inside the existing cloth.
        if ($x -ge 343 -and $y -ge 68) { continue }
        $weight = [Math]::Min(1.0, ($x - 286) / 24.0)
        $weight *= [Math]::Min(1.0, (78 - $y) / 18.0)
        $before = $original.GetPixel($x, $y)
        $after = $scaled.GetPixel($x, $y)
        $alpha = (1 - $weight) * $before.A + $weight * $after.A
        if ($alpha -le 0) {
          $result.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
          continue
        }
        $channels = @(foreach ($channel in @('R', 'G', 'B')) {
          [int][Math]::Round(((1 - $weight) * $before.A * $before.$channel + $weight * $after.A * $after.$channel) / $alpha)
        })
        $result.SetPixel($x, $y, [System.Drawing.Color]::FromArgb([int][Math]::Round($alpha), $channels[0], $channels[1], $channels[2]))
      }
    }
    $changed = 0
    for ($y = 0; $y -lt $original.Height; $y++) {
      for ($x = 0; $x -lt $original.Width; $x++) {
        if ($original.GetPixel($x, $y).ToArgb() -eq $result.GetPixel($x, $y).ToArgb()) { continue }
        if ($x -lt 286 -or $x -ge 366 -or $y -ge 79 -or ($x -ge 343 -and $y -ge 68)) {
          throw 'A pixel outside the cloth repair changed.'
        }
        $changed++
      }
    }
    $result.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Output "Saved 628 x 288 PNG. Changed pixels: $changed. All pixels outside the requested cloth area are identical."
  } finally { $result.Dispose() }
} finally {
  $graphics.Dispose()
  $scaled.Dispose()
  $generated.Dispose()
  $original.Dispose()
}
