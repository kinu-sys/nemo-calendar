export interface DefaultIconDef {
  key: string;
  label: string;
}

export const DEFAULT_ICONS: DefaultIconDef[] = [
  { key: 'cat', label: 'ねこ' },
  { key: 'cake', label: 'ケーキ' },
  { key: 'coffee', label: 'カフェ' },
  { key: 'flower', label: 'お花' },
  { key: 'plane', label: '飛行機' },
  { key: 'camera', label: 'カメラ' },
  { key: 'gift', label: 'ギフト' },
  { key: 'book', label: '本' },
  { key: 'paw', label: '肉球' },
];

export const PRESET_EMOJIS: string[] = [
  '🎬', '🍽️', '🛍️', '🏃', '🥖', '🏥', '🦷', '🚗', '🧹',
  '🐶', '🍦', '🎀', '🧸', '💻', '🌸', '🍷', '🎨', '🎵',
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
