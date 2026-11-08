Add-Type -AssemblyName System.Drawing
$decorationDirectory = Join-Path $PSScriptRoot '../public/decorations'
foreach ($item in @(
  @{ Name = 'botanical-corner'; StartX = 34; EndX = 108; StartY = 134 },
  @{ Name = 'botanical-corner-right'; StartX = 159; EndX = 232; StartY = 169 }
)) {
  $original = [System.Drawing.Bitmap]::new((Join-Path $decorationDirectory ($item.Name + '.png')))
  $result = $original.Clone()
  try {
    # Remove the straight border under the root, preserving the curling outline.
    for ($y = $item.StartY; $y -lt $result.Height; $y++) {
      for ($x = $item.StartX; $x -lt $item.EndX; $x++) {
        $result.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
      }
    }
    $result.Save((Join-Path $decorationDirectory ($item.Name + '-open.png')), [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Output ($item.Name + ': retained original dimensions; only the lower straight border segment was cleared.')
  } finally {
    $result.Dispose()
    $original.Dispose()
  }
}
