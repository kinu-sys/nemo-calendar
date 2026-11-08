# 月移動アイコンの模様拡大版：制作指示

組み込みimagegenで初版のPNGを参照して編集。背景透過を指定。
出力: `public/controls/month-chevron-square-ornate.png`（1254×1254px）。
PC表示を52pxに拡大し、ヘッダーと年月ナビの合計高さは維持。狭幅は48px。

```text
Use case: precise-object-edit / refine an existing watercolor UI icon.
Edit this EXACT square left-chevron button design. The user loves its appearance; keep its identity, ivory/sage watercolor colors, antique gold double rim, dark left chevron, rounded square shape and the burgundy flower at the lower left. Do not redesign it into a different motif.
Main requested change: make the GOLD FRAME AND BOTANICAL DECORATIONS much easier to see when the tile is displayed at 48 to 52 pixels wide. Reduce the large unused ivory space around the central chevron by letting the ornamentation extend inward.
Specifically: enlarge the gold leaf corner sprigs and the lower-left burgundy flower with sage leaves to about 1.7–1.9 times their current sizes. Make their gold strokes and stems noticeably firmer, not hairline-thin. Enlarge the flower's gold center so it remains readable when reduced. The gold corner vines should extend farther toward the chevron, with only a modest quiet gap; do not cover or touch the chevron. Widen the antique-gold double rim to about 1.5 times its current thickness. Retain watercolor texture and tasteful gold highlights.
Keep the chevron's size and dark color approximately the same, or reduce it very slightly if the enlarged ornaments need room. Do NOT make the arrow bigger at the expense of the decorative frame. Maintain a crisp readable LEFT direction. Keep the same single flower motif, not multiple new flowers.
Perfect 1:1 SQUARE canvas. Whole icon visible, clean alpha transparency outside the tile, very small even safety margin (around 2%) outside the rim. Opaque ivory interior. No rectangular banner, no scene, no text, no extra symbols, no heavy cast shadow. The finished master will be mirrored by CSS to create a matched next-month button.
Deliver the revised full transparent PNG.
```
