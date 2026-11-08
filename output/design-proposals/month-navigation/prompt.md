# 前月・次月アイコンの制作指示

使用ツール: 組み込みimagegen。背景透過を指定。
参照: 採用済みの本・瓶のイラストと、ロゴ②の色・水彩タッチ。
出力: `public/controls/month-chevron-square.png`（1254×1254px）。
左向きの原画を一つ制作し、次月はCSSで左右反転して完全に対称に表示。

```text
Use case: original watercolor UI icon / calendar month navigation button.
Create ONE PREVIOUS-MONTH button image, pointing LEFT. This single master image will be mirrored in the website to make an exactly matching next-month button.
REQUIRED CANVAS: a perfect 1:1 SQUARE transparent PNG. Not a horizontal oval. The visible button itself is a square with modest softly rounded corners (corner radius around 10% of its width), nearly filling the canvas with 4% transparent breathing room all around.
Composition: front-facing, flat, centered square ivory enamel / parchment tile with an extremely light sage-green watercolor wash. A fine antique-gold double rim with tiny refined botanical gold corner accents. At the lower-left corner of the tile, only a VERY SMALL burgundy-red five-petal flower and two little sage leaves. Keep these decorations restrained, much smaller than the arrow.
The center must contain ONE large clear LEFT-POINTING CHEVRON "<", no shaft: dark forest-sage / warm dark umber, thick enough to read instantly at a 44 x 44 pixel displayed size, approximately 40% of the tile width and 50% of its height. The chevron must dominate over the decoration, be centered in both directions, and have a clear ivory quiet area around it. No lettering, no numerals, no other symbols, no text "previous", no text "Nemo Calendar".
Reference image 1 is the adopted books-and-herbs illustration: use its restrained watercolor rendering, ivory, antique gold, sage, dusty rose and burgundy flower palette ONLY; do not include books, bottles, mortar, people or objects from it. Reference image 2 is the adopted wordmark: match its elegant fantasy royal botanical journal atmosphere and delicate gold detail ONLY, do not include its text or long underline.
Overall feeling: refined European fantasy royal apothecary / botanical journal, graceful and mature, matching the calendar's current watercolor decorations. Fine hand-drawn warm outlines, soft subtle watercolor texture. Avoid saturated candy colors, cartoon bubbles, glossy 3D plastic, heavy drop shadows, large ornamental flourishes outside the square, badges or shields. Keep the tile clearly square.
Transparent alpha OUTSIDE the tile; the ivory tile interior is opaque for readable contrast. All corners and leaves entirely inside the canvas. No checkerboard background, no scene, no mockup. Output only the finished square left-chevron button asset.
```
