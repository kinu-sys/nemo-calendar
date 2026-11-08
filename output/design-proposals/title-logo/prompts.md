# Nemo Calendar タイトルロゴ：制作指示
+
## ③の透過仕上げ

初稿に残った紙色のにじみと影を除くため、初稿を対象に次の編集を追加しました。
最終の `03-botanical-emblem.png` はこの編集後のPNGです。

```text
Use case: background-extraction / precise-object-edit.
Edit the provided Nemo Calendar wordmark. Preserve the dark umber serif lettering, gold line details, blush flowers, sage leaves, small burgundy flower, tiny teal jewel, and the existing shapes and watercolor texture of these objects.
REMOVE the entire pale ivory/white paper wash and the diffuse beige/gray halo or cast shadow around the lettering and foliage. Those are unwanted background. Make all background, all space between letters, counters inside letters, and the area around the thin ornament lines genuinely alpha-transparent. No white, ivory, beige or gray backing, no glow, no shadow cloud, no paper rectangle. The only opaque pixels should belong to the actual letters, gold strokes, leaves, petals and jewel.
Text must read exactly "Nemo Calendar", with a clear small word space between "Nemo" and "Calendar"; do not add any other letters. Keep a wide single-line wordmark. Keep a little transparent safety margin at all four edges; no leaf tips or letter swashes cut off. Do not add or replace any other elements. Return the clean transparent PNG.
```


使用ツール: 組み込み imagegen。各案を別々に生成し、背景透過を指定。

入力画像:
- `public/leaf-logo.png`: 正確な名称と横長比率の参考。
- `public/decorations/books-and-herbs-final.png`: 水彩タッチと配色の参考。
- [原画展公式キービジュアル](https://www.clarines-kingdom-fest.com/wp_akgm/wp-content/themes/akgm_thema/images/key02.png): 宮廷風の雰囲気と配色のみの参考。

## ① 金箔の書名風

出力: `01-gilded-book-title.png`

```text
Use case: logo-brand / original watercolor wordmark for a fantasy botanical calendar.
Create ONE finished transparent PNG wordmark for the exact brand name:
"Nemo Calendar"
Spell it exactly: N e m o [space] C a l e n d a r. Uppercase N and C, all other letters lowercase. One single horizontal line. No other text, no Japanese lettering, no subtitle.
Input roles: Image 1 is the CURRENT logo, for the exact name, wide horizontal proportions, and suitable header footprint only. Image 2 is the newly adopted header illustration, for MATCHING its delicate watercolor texture, warm ivory, antique gold, sage leaves, pale blush flowers and tiny burgundy-red accent; do not include its books, bottle, mortar or other objects. Image 3 is solely a reference for an elegant European royal-court feeling and warm ivory/gold colors; do not copy its characters, costumes, seals, or artwork.
The new design should feel like the title of a refined European fantasy storybook / royal botanical journal: graceful, romantic, finely drawn, mature and understated. It will sit beside the herbal mortar-and-bottle illustration in an ivory calendar header. Main lettering MUST be dark warm sepia / umber, clearly readable at 310px wide, with only subtle antique gold accents. Do NOT make the main letters pale gold on ivory.
Composition: wide 3:1 canvas, name filling most of the width, modest ornamentation above/below, minimal empty padding but leave at least 4% transparent breathing room so no letters, swashes or leaves are clipped. The lettering must remain the visual focus. Keep ornaments small and delicate. Clean genuine alpha transparency, no background rectangle or checkerboard, no outer border, no big shield, no badge disk, no glowing halo.
No people, no animals, no cats, no books or bottles, no UI, no borrowed brand logos. Create an original Nemo Calendar wordmark.

Typography: elegant old-style serif title lettering, slightly italic, with beautifully shaped capital N and C, light fine hairlines and confident readable thicker downstrokes. Dark sepia letterfaces with very restrained thin antique-gold inner edging, as if the title were tooled on a leather-bound journal. Add one extremely fine botanical gold underline with small sage leaves toward the right and a single tiny burgundy-red flower nestled into the underline. Warm delicate watercolor ink, not metallic 3D. Favor legibility and a premium classic book-title feeling. The name stays on one line.
```

## ② 赤い花と手書き文字

出力: `02-rose-calligraphy.png`

```text
Use case: logo-brand / original watercolor wordmark for a fantasy botanical calendar.
Create ONE finished transparent PNG wordmark for the exact brand name:
"Nemo Calendar"
Spell it exactly: N e m o [space] C a l e n d a r. Uppercase N and C, all other letters lowercase. One single horizontal line. No other text, no Japanese lettering, no subtitle.
Input roles: Image 1 is the CURRENT logo, for the exact name, wide horizontal proportions, and suitable header footprint only. Image 2 is the newly adopted header illustration, for MATCHING its delicate watercolor texture, warm ivory, antique gold, sage leaves, pale blush flowers and tiny burgundy-red accent; do not include its books, bottle, mortar or other objects. Image 3 is solely a reference for an elegant European royal-court feeling and warm ivory/gold colors; do not copy its characters, costumes, seals, or artwork.
The new design should feel like the title of a refined European fantasy storybook / royal botanical journal: graceful, romantic, finely drawn, mature and understated. It will sit beside the herbal mortar-and-bottle illustration in an ivory calendar header. Main lettering MUST be dark warm sepia / umber, clearly readable at 310px wide, with only subtle antique gold accents. Do NOT make the main letters pale gold on ivory.
Composition: wide 3:1 canvas, name filling most of the width, modest ornamentation above/below, minimal empty padding but leave at least 4% transparent breathing room so no letters, swashes or leaves are clipped. The lettering must remain the visual focus. Keep ornaments small and delicate. Clean genuine alpha transparency, no background rectangle or checkerboard, no outer border, no big shield, no badge disk, no glowing halo.
No people, no animals, no cats, no books or bottles, no UI, no borrowed brand logos. Create an original Nemo Calendar wordmark.

Typography: graceful readable hand-lettered calligraphy, warm dark sepia ink, flowing but controlled strokes, gently slanted with refined capital N and C. Do not tangle letters or join the two words so closely that their space disappears. Let a thin gold-and-sage botanical swash run BELOW the lettering. A single small burgundy-red five-petal flower with a gold center decorates the LEFT end of that swash, balanced by two little sage leaves at the right. Romantic handwritten royal correspondence, watercolor softness, delicately gold-accented. Keep the main lettering large and uncluttered; no additional symbols.
```

## ③ 王宮の紋章風

出力: `03-botanical-emblem.png`

```text
Use case: logo-brand / original watercolor wordmark for a fantasy botanical calendar.
Create ONE finished transparent PNG wordmark for the exact brand name:
"Nemo Calendar"
Spell it exactly: N e m o [space] C a l e n d a r. Uppercase N and C, all other letters lowercase. One single horizontal line. No other text, no Japanese lettering, no subtitle.
Input roles: Image 1 is the CURRENT logo, for the exact name, wide horizontal proportions, and suitable header footprint only. Image 2 is the newly adopted header illustration, for MATCHING its delicate watercolor texture, warm ivory, antique gold, sage leaves, pale blush flowers and tiny burgundy-red accent; do not include its books, bottle, mortar or other objects. Image 3 is solely a reference for an elegant European royal-court feeling and warm ivory/gold colors; do not copy its characters, costumes, seals, or artwork.
The new design should feel like the title of a refined European fantasy storybook / royal botanical journal: graceful, romantic, finely drawn, mature and understated. It will sit beside the herbal mortar-and-bottle illustration in an ivory calendar header. Main lettering MUST be dark warm sepia / umber, clearly readable at 310px wide, with only subtle antique gold accents. Do NOT make the main letters pale gold on ivory.
Composition: wide 3:1 canvas, name filling most of the width, modest ornamentation above/below, minimal empty padding but leave at least 4% transparent breathing room so no letters, swashes or leaves are clipped. The lettering must remain the visual focus. Keep ornaments small and delicate. Clean genuine alpha transparency, no background rectangle or checkerboard, no outer border, no big shield, no badge disk, no glowing halo.
No people, no animals, no cats, no books or bottles, no UI, no borrowed brand logos. Create an original Nemo Calendar wordmark.

Typography: poised old-world Roman serif title case, dark umber letters, subtle decorative caps N and C, with a gentle, airy rhythm and a very slight calligraphic influence. Below the name, a tiny original gold botanical emblem: two fine mirrored herb sprigs surrounding a small burgundy-red flower bud and a tiny blue-green drop jewel, connected by a hairline gold horizontal flourish. The emblem is a delicate accent, not a badge or shield. The lettering is the clear focus and more formal than handwritten script. Ivory and gold royal-library atmosphere, elegant watercolor details, not heavy or ornate.
```

