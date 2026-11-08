# Nemo Calendar の装飾画像

基本の装飾は、利用者から提供された参考画像「ChatGPT 画像 2026年11月8日 16_39_00.png」
（1448 × 1086）から切り出した透過 PNG です。
カーテンの欠損補完と、採用版の本・瓶・乳鉢のイラストは、利用者の指定に従って組み込みimagegenで編集しています。
画面全体の画像、参考画像内のボタン、予定データは含めていません。

- `heraldic-banner.png`: 左上の旗と蔓
- `heraldic-banner-complete.png`: 現在の左上表示用。元画像の右上の葉の枝を枝先まで含めて250×225pxで採取。元の旗部分は同一画素を維持
- `rose-curtain.png`: 右上のカーテン。参考画像内の操作ボタンは除外
- `rose-curtain-repaired.png`: 現在の表示用。花留め左上の布だけを補完し、元の切り出し画像も保持
- `books-and-herbs.png`: 猫に隠れていない本・薬草瓶・花
- `books-and-herbs-final.png`: 現在の本・瓶の表示用。①の乳鉢と本、②の瓶と花びら入りのピンクの液体、③の下部の花（小さな赤い花を含む）を組み合わせた1774×887pxの透過PNG
- `botanical-corner.png` / `botanical-corner-right.png`: 下部左右の植物
- `botanical-corner-open.png` / `botanical-corner-right-open.png`: 現在の下部表示用。根元の下の直線だけを透過した派生画像（元画像は保持）
- `open-book.png`: 下部中央の本と小花
- `card-corner.png`: 細い金色の角飾り
- `month-flourish.png`: 年月上の金色の罫線
- `handdrawn-rule.png`: 元画像の中央の本の左下にある線を320×9pxで採取した透過PNG。筆跡の揺れ・かすれを保持
- `handdrawn-double-rule.png`: 下部の上側に使う薄い二重線。元画像x275/y1032から310×12pxで採取し、2本の色・間隔・筆跡を保持
- `handdrawn-frame.png`: 角丸にする前の、採取した線を回転・配置した338×338pxの枠
- `handdrawn-frame-rounded.png`: 現在の外枠。採取した筆跡を半径28pxの丸い角に沿わせた338×338pxの透過PNG。40pxで9分割して配置

再切り出しは、リポジトリのルートで次を実行します（Windows / PowerShell）。
元画像はリポジトリに保存していません。

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/extract-journal-art.ps1 -SourceImage '元画像の絶対パス'
```

線と枠だけを作り直す場合は、上のコマンドに `-FrameOnly` を付けます。
採取位置は元画像の x=270、y=1047、幅320、高さ9です。新しく線を描き直したり、
画像生成は行わず、元の画素から紙色を透過し、枠用に回転・配置しています。
外枠の線の中心とPNG内の下線の高さを合わせ、左右の下角で縦枠に接続します。
現在は角丸版を使い、画像内の下線を外枠の下辺に重ねています。
上側の線は、左右のツタの先端（左y122・右y157）にそれぞれ合わせています。
上側には現在、薄い二重線の素材を使い、2本のうち下側の筆跡をツタの先端に合わせています。
二重線だけを再採取する場合は切り出しコマンドに `-DoubleRuleOnly` を指定します。
旗の枝先を含めた版だけを採取する場合は `-BannerOnly` を指定します。
旗の表示幅は切り出し幅の増加分（151→250）を補正しているため、旗本体の大きさと位置は変わりません。

現在の左右の飾りは、元画像の切り出し余白と同じく画面端から13pxの位置に配置しています。
下枠は中央の本と内側の茎、左右の根元の下でCSSマスクにより途切れさせています。
左右PNGに含まれる根元下の直線は `scripts/prepare-footer-gaps.ps1` で取り除きます。
左は x=34..107/y>=134、右は x=159..231/y>=169 だけを透過し、
それ以外の画素と、元の切り出しPNGは維持します。
元PNGを再切り出しした場合は次のコマンドで表示用画像を更新します。

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/prepare-footer-gaps.ps1
```

処理は対象領域を切り出し、外側につながった淡い紙色の背景を透過します。
残る不透明部分の RGB は元画像のままです。猫に隠れた部分は復元しません。
装飾の操作無効化と画面幅ごとの配置は `app/globals.css` が担当します。
採用版の本と瓶は既存と同じ表示幅で配置し、Next.jsの画像最適化で必要な大きさに配信します。
比較用の3案と制作指示は `output/design-proposals/books-and-herbs/`、
採用版の完全な指示は同フォルダーの `final-prompt.md` に保存しています。

補完版は元と同じ 628 × 288 の透過PNGです。画像編集には組み込みのimagegenを使用し、
補完結果の布部分だけを `scripts/repair-curtain-fold.ps1` で元PNGに適用しました。
変更範囲は x=286..365、y=0..78 の中だけ（花留めの x>=343 かつ y>=68 は除外）。
範囲外の全ピクセルが元画像と一致することをスクリプトで確認しています。
元画像の再切り出しを行っても補完版は上書きされません。
編集指示は `curtain-repair-prompt.md` を参照してください。
