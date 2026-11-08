# カーテン補完の画像編集指示

使用: 組み込み imagegen（透過PNGの部分補完）。元PNGを編集対象として指定。
最終画像への適用範囲は README.md と scripts/repair-curtain-fold.ps1 を参照。

+Use case: precise-object-edit / inpainting.
Edit target: the attached transparent PNG curtain, 628 x 288 pixels. This is an existing watercolor illustration, NOT a request to redesign.
Primary request: repair ONLY the abruptly cropped rose-pink silk immediately to the LEFT and UPPER LEFT of the central flower fastener (flower centered approximately x=362,y=84). The current fabric is cut off by a straight vertical edge at x=330 from y=0 to y=59. Extend that truncated pink cloth just enough to form a continuous natural fold tapering into the flower, within roughly x=315..366, y=0..86. The repaired upper cloth can continue beyond the TOP edge of the canvas; keep the top edge crop.
Preserve exact existing layout, scale, original watercolor strokes, pale blush colors, gold floral embroidery, flower fastener, left tassel and leaves. The right half of the image (x>=366) MUST remain untouched; do NOT fill the transparent space above the ivory swag to the right of the flower. Everything outside this tiny cloth repair must remain unchanged. Keep the ivory embroidered swag and all dangling botanical details unchanged. Keep transparent background / existing alpha. No text, no buttons, no additional decorations, no scene, no background color.
Return the same entire 628 x 288 transparent PNG with ONLY this small missing fold restored.
