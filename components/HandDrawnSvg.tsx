import React from 'react';
import { EMOJI_TO_SVG } from '@/lib/constants';

interface HandDrawnSvgProps {
  iconKey: string;
  className?: string;
}

export const HandDrawnSvg: React.FC<HandDrawnSvgProps> = ({ iconKey, className = "w-5 h-5 inline-block" }) => {
  // 絵文字が渡された場合はSVGマッピングを確認
  const resolvedKey = EMOJI_TO_SVG[iconKey] || iconKey;

  switch (resolvedKey) {
    case 'cat':
      return (
        <svg viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 30 C10 30 6 25 6 18 C6 13 8 9 10 7 L14 11 C15.5 10.5 16.7 10.3 18 10.3 C19.3 10.3 20.5 10.5 22 11 L26 7 C28 9 30 13 30 18 C30 25 26 30 18 30 Z" fill="#fdf2ed" stroke="#7d6155" strokeWidth="2" strokeLinejoin="round"/>
          <polygon points="10.5,9 13,12 10,13" fill="#f3bebe"/>
          <polygon points="25.5,9 23,12 26,13" fill="#f3bebe"/>
          <path d="M22 10.5 C25 12 28 15 28 18 C26 18 24 14 22 10.5 Z" fill="#e8a898"/>
          <path d="M12 17 Q14 14 16 17" stroke="#684d43" strokeWidth="2" strokeLinecap="round"/>
          <path d="M20 17 Q22 14 24 17" stroke="#684d43" strokeWidth="2" strokeLinecap="round"/>
          <polygon points="18,19.5 16.5,18 19.5,18" fill="#e89184"/>
          <path d="M18 19.5 L18 21.5 Q16 23 14.5 22 M18 21.5 Q20 23 21.5 22" stroke="#684d43" strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="11.5" cy="20.5" r="2.2" fill="#f5b8ad" opacity="0.8"/>
          <circle cx="24.5" cy="20.5" r="2.2" fill="#f5b8ad" opacity="0.8"/>
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
