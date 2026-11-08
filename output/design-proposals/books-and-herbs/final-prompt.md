# 採用版の制作指示

使用ツール: 組み込み imagegen。3つの提案画像を参照し、背景透過で合成編集。
出力先: `public/decorations/books-and-herbs-final.png`（1774×887）。
①の本・乳鉢、②の瓶・ピンクの液体と花びら、③の下部の赤い花を含む花飾り。

```text
Use case: compositing / precise-object-edit.
Create the FINAL transparent PNG header illustration by combining exactly the selected parts of the THREE reference images, numbered in the order provided.
REFERENCE 1 = BASE: preserve its two stacked antique books (sage green upper book, dusty rose lower book with gold botanical details) and the IVORY AND GOLD MORTAR on top, the pestle, sage and thyme herbs. This is the selected overall design and watercolor rendering.
REFERENCE 2 = BOTTLE ONLY: replace Reference 1's left bottle with Reference 2's ornate transparent pale-aqua glass apothecary bottle, sculpted botanical gold stopper, blue-green jewel at the neck, gold botanical decoration on the glass, and the rose-pink liquid containing floating pale-gold and pink petals. Preserve the recognizable bottle shape, contents and elegant stopper from Reference 2. Do NOT bring in its rolled letter, wax seal, ribbon across the books, or flower lying on the letter.
REFERENCE 3 = LOWER FLOWERS ONLY: use the base floral arrangement from Reference 3, specifically pale blush flowers on both sides and the SMALL BURGUNDY-RED FLOWER nestled by the bottom-left blush flower, with soft sage leaves. Keep the red flower clearly visible at the lower left as a charming accent. Do NOT bring in Reference 3's hourglass, bookmark, ribbons or its bottle.
Output ONE harmonious compact still life: ornate bottle to the left, two horizontal books to the right, mortar/pestle/herbs on top, blush flowers and one burgundy-red flower along the base. Keep Reference 1's overall arrangement. All items share the same delicate warm watercolor washes, fine brown-gold outlines, ivory/antique gold/sage/dusty rose palette. No cats, no animals, no people, no readable text, no logos, no background scene or decorative frame.
Production constraints: truly transparent background / preserved alpha. Wide 2:1 canvas. Leave about 3% transparent breathing room at ALL edges so NOTHING is cropped, especially the tallest herb tips, gold bottle stopper and bottom flower petals. Shorten the tallest herb sprig slightly if necessary to keep its entire tip inside the canvas. No added objects. The asset will be shown at 190px wide in a website header: make the mortar, ornate bottle and small burgundy flower readable at that size. Return only the finished transparent illustration.
```
