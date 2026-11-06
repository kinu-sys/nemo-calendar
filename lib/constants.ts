export interface DefaultIconDef {
  key: string;
  label: string;
}

export const DEFAULT_ICONS: DefaultIconDef[] = [
  { key: '01_カフェ.png', label: 'カフェ' },
  { key: '02_誕生日ケーキ.png', label: '誕生日ケーキ' },
  { key: '03_映画.png', label: '映画' },
  { key: '04_車.png', label: '車' },
  { key: '05_飛行機.png', label: '飛行機' },
  { key: '06_電車.png', label: '電車' },
  { key: '07_自転車.png', label: '自転車' },
  { key: '08_食事.png', label: '食事' },
  { key: '34_ビル.png', label: 'ビル' },
  { key: '09_病院.png', label: '病院' },
  { key: '整形外科.png', label: '整形外科' },
  { key: '10_リハビリ.png', label: 'リハビリ' },
  { key: '11_歯科.png', label: '歯科' },
  { key: '33_病気.png', label: '風邪' },
  { key: '12_打合せ.png', label: '打合せ' },
  { key: '13_プレゼン・会議.png', label: 'プレゼン・会議' },
  { key: '14_会議.png', label: '会議' },
  { key: '15_美容室.png', label: '美容室' },
  { key: '16_ネイル.png', label: 'ネイル' },
  { key: '17_旅行.png', label: '旅行' },
  { key: '18_電話.png', label: '電話' },
  { key: '19_パソコン.png', label: 'パソコン' },
  { key: '20_ビール.png', label: 'ビール' },
  { key: '結婚記念日1.png', label: '結婚記念日' },
  { key: '21_家.png', label: '家' },
  { key: '22_掃除.png', label: '掃除' },
  { key: '23_家族.png', label: '家族' },
  { key: '24_ライブ.png', label: 'ライブ' },
  { key: '25_サッカー.png', label: 'サッカー' },
  { key: '26_プレゼント.png', label: 'プレゼント' },
  { key: '28_カメラ.png', label: 'カメラ' },
  { key: '29_花束.png', label: '花束' },
  { key: 'デート.png', label: 'デート' },
  { key: 'パステルカラーのショッピングバッグ.png', label: 'ショッピングバッグ' },
];

export const EMOJI_TO_SVG: Record<string, string> = {
  '🐱': 'cat',
  '🎂': 'cake',
  '☕': 'coffee',
  '🌷': 'flower',
  '✈️': 'plane',
  '📷': 'camera',
  '🎁': 'gift',
  '📖': 'book',
  '🐾': 'paw',
};
