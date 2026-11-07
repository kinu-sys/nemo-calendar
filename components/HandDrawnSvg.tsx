import React from 'react';
import { EMOJI_TO_SVG } from '@/lib/constants';

interface HandDrawnSvgProps {
  iconKey: string;
  className?: string;
}

export const HandDrawnSvg: React.FC<HandDrawnSvgProps> = ({ iconKey, className = "w-5 h-5 inline-block" }) => {
  const legacyImageKeys: Record<string, string> = {
    '08_食事.svg': '08_食事.png',
    '10_ヨガ.png': '10_リハビリ.png',
    '12_会話.png': '12_打合せ.png',
    '12_会話.svg': '12_打合せ.png',
    '14_打ち合わせ.png': '14_会議.png',
    '20_ビール.svg': '20_ビール.png',
    '27_買い物.png': 'パステルカラーのショッピングバッグ.png',
    '33_病気.svg': '33_病気.png',
  };
  const imageKey = legacyImageKeys[iconKey] || iconKey;
  if (/\.(png|svg)$/i.test(imageKey)) {
    const requestedIconScale = ['34_ビル.png', '09_病院.png', 'デート.png', 'パステルカラーのショッピングバッグ.png'].includes(imageKey)
      ? 'scale-[0.95]'
      : '';
    const assetVersions: Record<string, string> = {
      '02_誕生日ケーキ.png': '?v=5',
      '14_会議.png': '?v=4',
      'デート2.png': '?v=1',
      'date.png': '?v=2',
      'Dinner.png': '?v=2',
      'Lunch.png': '?v=2',
      '結婚記念日1.png': '?v=2',
      '20_ビール.png': '?v=3',
      '07_自転車.png': '?v=3',
      '24_ライブ.png': '?v=2',
    };
    const assetVersion = assetVersions[imageKey] || '';
    return <img src={`/icons/${encodeURIComponent(imageKey)}${assetVersion}`} alt="" className={`${className} object-contain ${requestedIconScale}`} />;
  }
  // 絵文字が渡された場合はSVGマッピングを確認
  const resolvedKey = EMOJI_TO_SVG[iconKey] || iconKey;

  switch (resolvedKey) {
    case 'cat':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cat-fur" x1="8" y1="5" x2="27" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fffdf8" />
              <stop offset="1" stopColor="#f0d9c7" />
            </linearGradient>
            <linearGradient id="cat-ear" x1="10" y1="7" x2="15" y2="15" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f8c7bd" />
              <stop offset="1" stopColor="#e99b91" />
            </linearGradient>
            <radialGradient id="cat-eye" cx="0" cy="0" r="1" gradientTransform="matrix(0 3.2 -2.4 0 13.5 19.3)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#738b78" />
              <stop offset="1" stopColor="#435449" />
            </radialGradient>
            <filter id="cat-shadow" x="2" y="2" width="32" height="34" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="1" />
            </filter>
          </defs>
          <ellipse cx="18" cy="31.2" rx="11.2" ry="1.7" fill="#8f6d5e" opacity=".16" filter="url(#cat-shadow)" />
          <path d="M7.3 14.6 6.8 5.9c-.1-1.5 1-2.2 2.2-1.1l6.3 5.5a13 13 0 0 1 5.4 0L27 4.8c1.2-1.1 2.3-.4 2.2 1.1l-.5 8.7c1.3 2 2 4.3 2 6.8 0 6.6-5 10.7-12.7 10.7S5.3 28 5.3 21.4c0-2.5.7-4.8 2-6.8Z" fill="#704f40" />
          <path d="M8.9 14.9 8.4 6.7l6.4 5.6c-2.6.4-4.6 1.3-5.9 2.6Zm18.2 0 .5-8.2-6.4 5.6c2.6.4 4.6 1.3 5.9 2.6Z" fill="url(#cat-ear)" />
          <path d="M8.2 15.2c1.5-2 4-3.2 7.5-3.5a12.8 12.8 0 0 1 4.6 0c3.5.3 6 1.5 7.5 3.5 1.1 1.6 1.7 3.7 1.7 6.1 0 5.4-4.3 8.7-11.5 8.7S6.5 26.7 6.5 21.3c0-2.4.6-4.5 1.7-6.1Z" fill="url(#cat-fur)" />
          <path d="M10.3 18.9c.7-1.1 1.8-1.7 3.2-1.7s2.5.6 3.2 1.7c-.7 1.1-1.8 1.7-3.2 1.7s-2.5-.6-3.2-1.7Zm9 0c.7-1.1 1.8-1.7 3.2-1.7s2.5.6 3.2 1.7c-.7 1.1-1.8 1.7-3.2 1.7s-2.5-.6-3.2-1.7Z" fill="url(#cat-eye)" />
          <circle cx="12.6" cy="18.3" r=".8" fill="white" />
          <circle cx="21.6" cy="18.3" r=".8" fill="white" />
          <path d="M18 20.9c-.5-.5-1.4-.1-1.4.6 0 .8 1.4 1.7 1.4 1.7s1.4-.9 1.4-1.7c0-.7-.9-1.1-1.4-.6Z" fill="#d98078" />
          <path d="M18 23.1c-.2 1-1 1.6-2 1.6m2-1.6c.2 1 1 1.6 2 1.6" stroke="#704f40" strokeWidth="1.1" strokeLinecap="round" />
          <ellipse cx="10.8" cy="22" rx="2.1" ry="1.15" fill="#efaaa2" opacity=".82" />
          <ellipse cx="25.2" cy="22" rx="2.1" ry="1.15" fill="#efaaa2" opacity=".82" />
          <path d="m6.7 21.5 4.1.5m-4 1.7 4-.1m19.5-2.1-4.1.5m4 1.7-4-.1" stroke="#9c7969" strokeWidth=".7" strokeLinecap="round" opacity=".75" />
          <path d="m17.7 5.1.5 1 .9.3-.9.4-.5 1-.4-1-.9-.4.9-.3.4-1Z" fill="#e6bb65" />
        </svg>
      );
    case 'cake':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 20 C8 20 8 28 8 28 C8 29.5 12.5 31 18 31 C23.5 31 28 29.5 28 28 C28 28 28 20 28 20" fill="#fbf0e8" stroke="#be766e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 24.5 C12 26 24 26 28 24.5" stroke="#f0c29e" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M8 20 C8 17.5 12.5 16 18 16 C23.5 16 28 17.5 28 20 C28 22 26 22 24.5 21 C23 20 21.5 22 20 22 C18.5 22 17 20 15.5 21 C14 22 12 22 10.5 21 C9.5 20.5 8 21.5 8 20 Z" fill="#fce4de" stroke="#be766e" strokeWidth="2" strokeLinejoin="round"/>
          <line x1="13" y1="17" x2="13" y2="10" stroke="#be766e" strokeWidth="2" strokeLinecap="round"/>
          <path d="M13 9 C11.5 7.5 13 4.5 13 4.5 C13 4.5 14.5 7.5 13 9 Z" fill="#e87869"/>
          <line x1="18" y1="16" x2="18" y2="8" stroke="#be766e" strokeWidth="2" strokeLinecap="round"/>
          <path d="M18 7 C16.5 5.5 18 2.5 18 2.5 C18 2.5 19.5 5.5 18 7 Z" fill="#e87869"/>
          <line x1="23" y1="17" x2="23" y2="10" stroke="#be766e" strokeWidth="2" strokeLinecap="round"/>
          <path d="M23 9 C21.5 7.5 23 4.5 23 4.5 C23 4.5 24.5 7.5 23 9 Z" fill="#e87869"/>
        </svg>
      );
    case 'coffee':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="18" cy="29" rx="13" ry="2.5" fill="#e8e1da" stroke="#7d6a5f" strokeWidth="2"/>
          <path d="M24 16 C28 16 30 20 28 23 C26.5 25 24 24.5 23 24" stroke="#7d6a5f" strokeWidth="2" strokeLinecap="round"/>
          <path d="M10 14 C10 24 13 27 18 27 C23 27 26 24 26 14 Z" fill="#f7f2eb" stroke="#7d6a5f" strokeWidth="2" strokeLinejoin="round"/>
          <ellipse cx="18" cy="14" rx="7.8" ry="2.2" fill="#6d493a"/>
          <path d="M18 5 L18 8" stroke="#d4957e" strokeWidth="2" strokeLinecap="round"/>
          <path d="M13 7 L14 9" stroke="#d4957e" strokeWidth="2" strokeLinecap="round"/>
          <path d="M23 7 L22 9" stroke="#d4957e" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case 'flower':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 20 L18 31" stroke="#5d8573" strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M18 26 C12 26 11 22 13 20 C16 20 17.5 23 18 26 Z" fill="#7ba895" stroke="#5d8573" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M18 26 C24 26 25 22 23 20 C20 20 18.5 23 18 26 Z" fill="#7ba895" stroke="#5d8573" strokeWidth="1.8" strokeLinejoin="round"/>
          <circle cx="18" cy="8" r="4.5" fill="#f49d91" stroke="#b86b61" strokeWidth="1.8"/>
          <circle cx="11.5" cy="12.5" r="4.5" fill="#f49d91" stroke="#b86b61" strokeWidth="1.8"/>
          <circle cx="24.5" cy="12.5" r="4.5" fill="#f49d91" stroke="#b86b61" strokeWidth="1.8"/>
          <circle cx="14" cy="19" r="4.5" fill="#f49d91" stroke="#b86b61" strokeWidth="1.8"/>
          <circle cx="22" cy="19" r="4.5" fill="#f49d91" stroke="#b86b61" strokeWidth="1.8"/>
          <circle cx="18" cy="14.5" r="4.2" fill="#fae8a8" stroke="#b86b61" strokeWidth="1.8"/>
        </svg>
      );
    case 'plane':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(18,18) rotate(-35) translate(-18,-18)">
            <path d="M18 16 L6 21 C5 21.5 5 23 6.5 22.5 L18 19 Z" fill="#9bc3de" stroke="#587d9a" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M18 16 L30 11 C31 10.5 31 9 29.5 9.5 L18 13 Z" fill="#9bc3de" stroke="#587d9a" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M31 16 C31 16 11 13 8 13 C5 13 4 16 4 16 C4 16 5 19 8 19 C11 19 31 16 31 16 Z" fill="#b1d4ec" stroke="#587d9a" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M8 14 L4 9 C3 8 2 9 3 10.5 L6 16 Z" fill="#9bc3de" stroke="#587d9a" strokeWidth="1.8" strokeLinejoin="round"/>
            <circle cx="24" cy="16" r="1.5" fill="#ffffff"/>
            <circle cx="19" cy="16" r="1.5" fill="#ffffff"/>
            <circle cx="14" cy="16" r="1.5" fill="#ffffff"/>
          </g>
        </svg>
      );
    case 'camera':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="9" y="8" width="5" height="3" rx="1.5" fill="#e8cfb8" stroke="#5c6d62" strokeWidth="1.8"/>
          <circle cx="25" cy="9.5" r="2" fill="#d99f8d" stroke="#5c6d62" strokeWidth="1.5"/>
          <rect x="6" y="10" width="24" height="18" rx="5" fill="#a4b8ab" stroke="#5c6d62" strokeWidth="2"/>
          <circle cx="18" cy="19" r="6" fill="#889e90" stroke="#5c6d62" strokeWidth="2"/>
          <circle cx="18" cy="19" r="3.5" fill="#678594"/>
          <circle cx="16.5" cy="17.5" r="1.2" fill="#ffffff"/>
          <rect x="9" y="13" width="3.5" height="2.5" rx="1" fill="#fdfcf9" stroke="#5c6d62" strokeWidth="1.5"/>
        </svg>
      );
    case 'gift':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="16" width="20" height="13" rx="3" fill="#cfc7d6" stroke="#6b5f73" strokeWidth="2"/>
          <rect x="7" y="11" width="22" height="5.5" rx="2" fill="#ded7e5" stroke="#6b5f73" strokeWidth="2"/>
          <rect x="16" y="11" width="4" height="18" fill="#e88d7d"/>
          <line x1="16" y1="11" x2="16" y2="29" stroke="#6b5f73" strokeWidth="1.5"/>
          <line x1="20" y1="11" x2="20" y2="29" stroke="#6b5f73" strokeWidth="1.5"/>
          <path d="M18 11 C15 7 10 7 12 11 C13 12 16 11.5 18 11 Z" fill="#f2a194" stroke="#c45d4c" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M18 11 C21 7 26 7 24 11 C23 12 20 11.5 18 11 Z" fill="#f2a194" stroke="#c45d4c" strokeWidth="1.8" strokeLinejoin="round"/>
          <circle cx="18" cy="11" r="2" fill="#d96a57"/>
        </svg>
      );
    case 'book':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 4 C17 6 18 8 18 8 C18 8 19 6 18 4 Z" fill="#e88578"/>
          <path d="M14 6 C13 7.5 14.5 9 14.5 9 C14.5 9 15 7.5 14 6 Z" fill="#e88578"/>
          <path d="M22 6 C23 7.5 21.5 9 21.5 9 C21.5 9 21 7.5 22 6 Z" fill="#e88578"/>
          <path d="M6 27 C12 25 17 26.5 18 28 C19 26.5 24 25 30 27 L30 25 C24 23 19 24.5 18 26 C17 24.5 12 23 6 25 Z" fill="#6c8ca6"/>
          <path d="M18 26 C16 23.5 11 22 6 24 L6 13 C11 11 16 12.5 18 15 Z" fill="#faf7f2" stroke="#4a657a" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M18 26 C20 23.5 25 22 30 24 L30 13 C25 11 20 12.5 18 15 Z" fill="#ffffff" stroke="#4a657a" strokeWidth="2" strokeLinejoin="round"/>
          <line x1="9" y1="16" x2="15" y2="17" stroke="#9bb1c2" strokeWidth="1.6" strokeLinecap="round"/>
          <line x1="9" y1="19.5" x2="15" y2="20.5" stroke="#9bb1c2" strokeWidth="1.6" strokeLinecap="round"/>
          <line x1="21" y1="17" x2="27" y2="16" stroke="#9bb1c2" strokeWidth="1.6" strokeLinecap="round"/>
          <line x1="21" y1="20.5" x2="27" y2="19.5" stroke="#9bb1c2" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      );
    case 'paw':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 17 C13 17 11 21 12 25 C13 28 15.5 30 18 29.5 C20.5 30 23 28 24 25 C25 21 23 17 18 17 Z" fill="#88a396" stroke="#52635a" strokeWidth="2" strokeLinejoin="round"/>
          <ellipse cx="9" cy="16.5" rx="2.8" ry="3.8" transform="rotate(-30 9 16.5)" fill="#c49b88" stroke="#52635a" strokeWidth="1.8"/>
          <ellipse cx="14" cy="11.5" rx="3" ry="4" transform="rotate(-10 14 11.5)" fill="#c49b88" stroke="#52635a" strokeWidth="1.8"/>
          <ellipse cx="22" cy="11.5" rx="3" ry="4" transform="rotate(10 22 11.5)" fill="#c49b88" stroke="#52635a" strokeWidth="1.8"/>
          <ellipse cx="27" cy="16.5" rx="2.8" ry="3.8" transform="rotate(30 27 16.5)" fill="#c49b88" stroke="#52635a" strokeWidth="1.8"/>
        </svg>
      );
    default:
      return <span className="text-base select-none leading-none inline-flex items-center justify-center">{iconKey}</span>;
  }
};
