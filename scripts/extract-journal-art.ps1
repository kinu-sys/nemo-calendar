param(
  [Parameter(Mandatory = $true)][string]$SourceImage,
  [string]$OutputDirectory = '',
  [switch]$FrameOnly,
  [switch]$DoubleRuleOnly,
  [switch]$BannerOnly
)

if (-not $OutputDirectory) { $OutputDirectory = Join-Path $PSScriptRoot '../public/decorations' }

# Crop the supplied reference; never redraw or synthesize illustration pixels.
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Collections.Generic;
public static class JournalArt {
  public static void RoundedFrame(Bitmap stroke, string destination) {
    // Bend the sampled ink around rounded corners; never substitute a flat color.
    const int size = 338;
    const double radius = 28, inset = 4.5;
    double center = size / 2.0, half = center - inset;
    using (var frame = new Bitmap(size, size, PixelFormat.Format32bppArgb)) {
      for (int y = 0; y < size; y++) for (int x = 0; x < size; x++) {
        double px = x + 0.5 - center, py = y + 0.5 - center;
        double qx = Math.Abs(px) - (half - radius);
        double qy = Math.Abs(py) - (half - radius);
        double distance = Math.Sqrt(Math.Pow(Math.Max(qx, 0), 2) + Math.Pow(Math.Max(qy, 0), 2))
          + Math.Min(Math.Max(qx, qy), 0) - radius;
        double sy = distance + 4;
        if (sy < 0 || sy >= stroke.Height - 1) continue;
        double sx = (Math.Atan2(py, px) + Math.PI) * (size * 4) / (2 * Math.PI);
        int ix = (int)Math.Floor(sx), iy = (int)Math.Floor(sy);
        double fx = sx - ix, fy = sy - iy;
        double a = 0, r = 0, g = 0, b = 0;
        for (int dy = 0; dy < 2; dy++) for (int dx = 0; dx < 2; dx++) {
          Color c = stroke.GetPixel((ix + dx) % stroke.Width, iy + dy);
          double weight = (dx == 0 ? 1 - fx : fx) * (dy == 0 ? 1 - fy : fy);
          a += c.A * weight;
          r += c.R * c.A * weight;
          g += c.G * c.A * weight;
          b += c.B * c.A * weight;
        }
        if (a > 0) frame.SetPixel(x, y, Color.FromArgb((int)Math.Round(a),
          (int)Math.Round(r / a), (int)Math.Round(g / a), (int)Math.Round(b / a)));
      }
      frame.Save(destination, ImageFormat.Png);
    }
  }
  public static void Crop(Bitmap source, string destination, Rectangle bounds, Point[] outline) {
    using (var result = new Bitmap(bounds.Width, bounds.Height, PixelFormat.Format32bppArgb))
    using (var shape = new GraphicsPath()) {
      if (outline != null) shape.AddPolygon(outline);
      var background = new bool[bounds.Width * bounds.Height];
      var pending = new Queue<int>();
      for (int y = 0; y < bounds.Height; y++) for (int x = 0; x < bounds.Width; x++) {
        Color c = source.GetPixel(bounds.X + x, bounds.Y + y);
        bool inside = outline == null || shape.IsVisible(bounds.X + x, bounds.Y + y);
        result.SetPixel(x, y, inside ? c : Color.Transparent);
        if (!inside || x == 0 || y == 0 || x == bounds.Width - 1 || y == bounds.Height - 1)
          pending.Enqueue(y * bounds.Width + x);
      }
      // Only remove pale paper connected to the outside, preserving enclosed highlights.
      while (pending.Count > 0) {
        int p = pending.Dequeue();
        if (background[p]) continue;
        int x = p % bounds.Width, y = p / bounds.Width;
        Color c = result.GetPixel(x, y);
        int low = Math.Min(c.R, Math.Min(c.G, c.B));
        int high = Math.Max(c.R, Math.Max(c.G, c.B));
        if (c.A != 0 && !(low > 211 && high - low < 39)) continue;
        background[p] = true;
        if (x > 0) pending.Enqueue(p - 1);
        if (x + 1 < bounds.Width) pending.Enqueue(p + 1);
        if (y > 0) pending.Enqueue(p - bounds.Width);
        if (y + 1 < bounds.Height) pending.Enqueue(p + bounds.Width);
      }
      for (int y = 0; y < bounds.Height; y++) for (int x = 0; x < bounds.Width; x++)
        if (background[y * bounds.Width + x]) result.SetPixel(x, y, Color.Transparent);
      result.Save(destination, ImageFormat.Png);
    }
  }
}
'@

New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$source = [System.Drawing.Bitmap]::new((Resolve-Path -LiteralPath $SourceImage).Path)
try {
  if ($source.Width -ne 1448 -or $source.Height -ne 1086) {
    throw 'The crop coordinates require the original 1448 x 1086 reference image.'
  }
  function Export-Crop($Name, $X, $Y, $Width, $Height, $Coordinates) {
    $outline = $null
    if ($Coordinates) {
      $outline = [System.Drawing.Point[]]@(
        for ($i = 0; $i -lt $Coordinates.Length; $i += 2) {
          [System.Drawing.Point]::new($Coordinates[$i], $Coordinates[$i + 1])
        }
      )
    }
    [JournalArt]::Crop($source, (Join-Path $OutputDirectory $Name), [System.Drawing.Rectangle]::new($X, $Y, $Width, $Height), $outline)
  }
  # Extend only the upper-right crop so the original leafy branch is complete.
  Export-Crop 'heraldic-banner-complete.png' 5 0 250 225 @(5,0,255,0,255,28,222,28,216,62,160,62,126,70,123,165,101,169,102,225,64,225,64,179,5,225)
  if ($BannerOnly) { return }

  # Keep both pale strokes of the original upper decorative rule together.
  Export-Crop 'handdrawn-double-rule.png' 275 1032 310 12 $null
  if ($DoubleRuleOnly) { return }

  # Sample the lower hand-drawn line immediately to the left of the central book.
  Export-Crop 'handdrawn-rule.png' 270 1047 320 9 $null
  $stroke = [System.Drawing.Bitmap]::new((Join-Path $OutputDirectory 'handdrawn-rule.png'))
  $verticalStroke = $stroke.Clone()
  $verticalStroke.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone)
  $frame = [System.Drawing.Bitmap]::new(338, 338)
  $frameGraphics = [System.Drawing.Graphics]::FromImage($frame)
  try {
    # A transparent nine-slice frame made only from the sampled stroke.
    # Small overlaps at the corners let the horizontal and vertical ink meet.
    $frameGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $frameGraphics.DrawImage($stroke, [System.Drawing.Rectangle]::new(4, 0, 330, 9))
    $frameGraphics.DrawImage($stroke, [System.Drawing.Rectangle]::new(4, 329, 330, 9))
    $frameGraphics.DrawImage($verticalStroke, [System.Drawing.Rectangle]::new(0, 4, 9, 330))
    $frameGraphics.DrawImage($verticalStroke, [System.Drawing.Rectangle]::new(329, 4, 9, 330))
    $frame.Save((Join-Path $OutputDirectory 'handdrawn-frame.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    [JournalArt]::RoundedFrame($stroke, (Join-Path $OutputDirectory 'handdrawn-frame-rounded.png'))
  } finally {
    $frameGraphics.Dispose()
    $frame.Dispose()
    $verticalStroke.Dispose()
    $stroke.Dispose()
  }
  if ($FrameOnly) { return }

  Export-Crop 'heraldic-banner.png' 5 0 151 225 @(5,0,156,0,156,32,126,70,123,165,101,169,102,225,64,225,64,179,5,225)
  Export-Crop 'rose-curtain.png' 820 0 628 288 @(820,0,1150,0,1150,59,1205,80,1287,61,1381,60,1448,49,1448,288,1421,266,1380,243,1300,231,1229,216,1176,189,1158,143,1110,145,1040,135,980,113,962,132,915,130,917,48,870,40,820,38)
  # The cat overlaps the upper book. Keep the visible books, bottle and flowers only.
  Export-Crop 'books-and-herbs.png' 125 75 277 121 @(125,141,150,114,157,96,160,75,194,75,202,107,211,122,338,122,345,139,359,122,380,124,390,143,402,151,402,186,358,196,326,176,170,196,125,180)
  Export-Crop 'botanical-corner.png' 13 916 258 139 @(13,916,40,916,40,953,115,953,140,994,271,1018,271,1055,13,1055)
  Export-Crop 'botanical-corner-right.png' 1170 881 264 174 $null
  Export-Crop 'open-book.png' 601 1009 240 48 $null
  Export-Crop 'card-corner.png' 33 265 52 43 $null
  Export-Crop 'month-flourish.png' 616 132 219 28 $null
} finally {
  $source.Dispose()
}
