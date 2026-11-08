# Todayの植物を濃く大きく、対角配置へ

制作方法: 組み込みimagegenの画像編集。
参照: public/controls/today-en-botanical.png
保存先: public/controls/today-en-botanical-diagonal.png
表示領域: 88×44pxを維持。

Use case: precise-object-edit / small calendar UI asset.
Edit target: the attached watercolor Today button. Keep its light botanical journal design, warm almost-white ivory, rounded horizontal plate, transparent exterior and elegant olive-brown italic serif lettering. The user likes the botanical direction, but it disappears at the actual 88x44px display size.
Make these EXACT changes:
1. Increase contrast moderately: make the single hand-drawn ochre border and plant outlines darker, more opaque and slightly more substantial, roughly a 0.8–1px drawn border when displayed at 88px wide. Use warm antique ochre/brown ink, never saturated shiny yellow gold. Strengthen natural sage leaf color and dusty pink flower color just enough to remain visible in a small UI. Keep translucent painted variation.
2. SIMPLIFY and ENLARGE the LOWER LEFT plant: fewer and larger leaves and petals, fewer tiny curls and twigs, ONE clear dusty pink five-petal blossom with a few sage leaves, graceful warm ochre stems. Larger uncomplicated shapes should read well at thumbnail size. Keep it anchored to the lower-left corner and framing the word without touching letters.
3. Add a SMALLER complementary botanical ornament at the diagonally opposite UPPER RIGHT: a short simple curved sprig with 2–3 sage leaves and one small pink blossom or bud. It should trace the right and top edge, reaching inward slightly so the lower-left and upper-right plants loosely ENCIRCLE the text. Only these TWO diagonal corners should be decorated; keep upper-left and lower-right quiet. Do not create a full dense wreath or four-corner gold flourishes.
4. Enlarge the entire word "Today" by 30% in BOTH width and height relative to this input, same graceful italic serif lettering and dark warm olive-brown color. Aim for roughly 56–60% of canvas width. Center the visible word on BOTH axes of the entire plate, including the italic T overhang and y descender. Keep a small clear gap to all botanical shapes, no overlap or occluded letters. Do not make text bold or change type style.
Invariants: the application's display remains 88x44px; preserve the 2:1 canvas, same rounded plate silhouette/placement and near-white watercolor interior, genuinely transparent alpha outside. Avoid gaudy ornaments, thick gold bands, embossed metallic leaves, bevels, glow, strong shadows, bright neon colors, diamond shapes, extra words and symbols. Return ONE standalone transparent PNG with text EXACTLY "Today".
