# 「今日」「Today」ボタン

このフォルダーは以前のToday案の制作記録です。現在は [添付で指定された左下の花・右上のつぼみに、紙の背景と太めの枠を加えた版](../today-rectangular/README.md) を採用しています。

- [今日](../../../public/controls/today-ja.png): 日本語の明朝体案。
- [Today](../../../public/controls/today-en.png): 英語の斜体案。利用者がこちらを選択。
- [2案の比較画像](comparison.png)・[比較HTML](preview.html): 最初の80×40pxの表示目安。
- [初版の制作指示](prompts.md): 組み込みimagegenで制作。英語版は日本語版の文字編集。
- [文字拡大版](../../../public/controls/today-en-large-text.png)・[拡大の制作指示](large-text-prompt.md): 利用者の追加指定により表示を88×44px（10％拡大）にし、文字まわりの余白を削減。
- [中央配置版](../../../public/controls/today-en-centered.png)・[中央配置の制作指示](center-prompt.md): 大きな斜体の文字全体を、枠の上下左右の中央にそろえた版。縮小前の比較用として保持。
- [文字85％版](../../../public/controls/today-en-text-85.png)・[85％縮小の制作指示](text-85-prompt.md): 以前の金の植物枠で、文字だけを約85％に縮小した版。
- [植物の初版](../../../public/controls/today-en-botanical.png)・[制作指示](botanical-prompt.md): 左下の植物（botanical-corner-open.png）と外枠（handdrawn-frame-rounded.png）を参考に組み込みimagegenで制作した淡い版。
- [対角の植物版](../../../public/controls/today-en-botanical-diagonal.png)・[制作指示](botanical-diagonal-prompt.md): 一本枠と対角の植物を使った以前の版。
- [植物の囲み版](../../../public/controls/today-en-botanical-garland.png)・[制作指示](botanical-garland-prompt.md): 対角の植物版と元の左下植物画像を参考に組み込みimagegenで制作した以前の版。

元画像はいずれも1774×887px。アプリでは日本語の操作ラベル「今日に戻る」を保持し、既存の onToday を使用します。
