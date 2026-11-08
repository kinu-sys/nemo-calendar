# 月移動アイコン

- `month-chevron-handdrawn-vine-ivory.png`: 現在の表示用。枠寄りの植物の位置と大きさは保ち、紙のピンク味を抜いて白に近いベージュへ変更。植物の輪郭と色を少しはっきりさせた1254×1254px透過PNG。手描きの水彩感、矢印・外形・表示サイズを維持。
- `month-chevron-handdrawn-vine-edge.png`: 植物を約75％へ縮小し、枠との余白を詰めた色調整前の版。比較・復元用として保持。
- `month-chevron-handdrawn-vine-75.png` / `month-chevron-handdrawn-vine-attached.png`: 植物縮小後・枠への接続後の中間版。比較・復元用として保持。
- `month-chevron-handdrawn-vine-compact.png`: 植物を大きく広げた以前の版。比較・復元用として保持。
- `month-chevron-handdrawn-vine.png`: 植物拡大前の手描き版。比較・復元用として保持。
- `month-chevron-square-natural-90.png`: 以前の金の植物枠。比較・復元用として保持。
- `month-chevron-square-natural.png`: 90％縮小前の承認済み画像。比較・復元用として保持。
- `month-chevron-square.png`: 最初に好評だった初版。比較・復元用として保持。
- `month-chevron-square-ornate.png`: 模様拡大の比較版。金色が強すぎたため不採用とし、表示には使用しない。
- 見た目: 白寄りのベージュの紙、暖かい金茶色の線、セージ色の葉と淡いピンクの小花、濃い金茶色の矢印。
- 制作: 組み込みimagegen。現在の制作指示は [handdrawn-vine-ivory-prompt.md](../../output/design-proposals/month-navigation/handdrawn-vine-ivory-prompt.md)。75％縮小・枠への接続など以前の制作指示も同フォルダーに保持。

CalendarViewで前月の画像として使用し、次月はCSSで左右反転して対称に表示します。
画像表示はPCで39.6×39.6px、639px以下で43.2×43.2px（従来の90％）。操作領域はPC44×44px・狭幅48×48pxを維持。Next.jsの画像最適化を使用。
ヘッダー136px＋年月ナビ48pxに戻し、カレンダー本体の縦位置は維持。
操作の名前はボタンのaria-labelとtitleで保持し、画像自体は読み上げ対象から外しています。
元の `public/calendar_prev.png`・`public/calendar_next.png` も保持しています。

## 今日に戻るボタン

採用画像: [利用者が添付で指定した、左下の花と右上のつぼみの版](../../output/design-proposals/today-rectangular/README.md)。紙の背景、太めの線と少し大きい花・葉で配置しています。

- `today-en-floral-paper.png`: 現在の表示用。添付で選択された左下のピンクの花と右上のつぼみを使い、枠線を太く、花と葉を少し大きくした1774×887px PNG。内側は淡いアイボリーの紙、外側は透過。文字は縦横中央、画像表示領域は88×44px。
- `today-en-embroidered-paper.png`: 左上と右下の小花を使った以前の紙背景版。比較・復元用として保持。
- `today-en-botanical-garland.png`: 植物だけで囲む以前の版。比較・復元用として保持。
- `today-en-botanical-diagonal.png`: 一本枠と対角の植物を使った以前の版。比較・復元用として保持。
- `today-en-botanical.png`: 左下の植物と外枠を参考にした、淡い一本枠と植物の初版。比較・復元用として保持。
- `today-en-text-85.png`: 金の植物枠で文字を約85％へ縮小した比較・復元用の版。
- `today-en-centered.png`: 文字縮小前の中央配置版。比較・復元用として保持。
- `today-ja.png`・`today-en.png`: 日本語と英語の最初の比較案。`today-en-large-text.png` は文字拡大後・中央調整前の版として保持。
- 制作は組み込みimagegen。[制作指示・比較案](../../output/design-proposals/today-controls/README.md)に各画像とプロンプトへのリンクを記載。
- 操作は既存のonTodayを使用。「今日に戻る」のaria-labelとtitle、キーボード操作とフォーカス表示を維持。装飾画像はpointer-events:none、altは空。
