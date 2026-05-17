import type { StyleKey } from '@/lib/styles';

interface SealProps {
  style: StyleKey;
  size?: number;
}

export function Seal({ style, size = 96 }: SealProps) {
  if (style === 'merchant') return <MerchantSeal size={size} />;
  if (style === 'maiden') return <MaidenSeal size={size} />;
  if (style === 'youth') return <YouthSeal size={size} />;
  return <RemembranceStamp size={size} />;
}

function MerchantSeal({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'url(#seal-grain)' }}
      aria-label="先生代笔印"
    >
      <defs>
        <filter id="seal-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.15 0" />
          <feComposite in2="SourceGraphic" operator="in" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode />
          </feMerge>
        </filter>
      </defs>
      <rect x="6" y="6" width="88" height="88" fill="none" stroke="#8b3a3a" strokeWidth="4" />
      <rect x="10" y="10" width="80" height="80" fill="#8b3a3a" opacity="0.92" />
      <text
        x="30"
        y="38"
        fontFamily="serif"
        fontSize="22"
        fill="#f4ecd8"
        fontWeight="bold"
        textAnchor="middle"
      >
        先
      </text>
      <text
        x="70"
        y="38"
        fontFamily="serif"
        fontSize="22"
        fill="#f4ecd8"
        fontWeight="bold"
        textAnchor="middle"
      >
        生
      </text>
      <text
        x="30"
        y="72"
        fontFamily="serif"
        fontSize="22"
        fill="#f4ecd8"
        fontWeight="bold"
        textAnchor="middle"
      >
        代
      </text>
      <text
        x="70"
        y="72"
        fontFamily="serif"
        fontSize="22"
        fill="#f4ecd8"
        fontWeight="bold"
        textAnchor="middle"
      >
        笔
      </text>
    </svg>
  );
}

function MaidenSeal({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="如晤印">
      <circle cx="50" cy="50" r="44" fill="#5a3a5a" opacity="0.92" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="#5a3a5a" strokeWidth="2" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#f4ece8" strokeWidth="1.2" />
      <text
        x="50"
        y="44"
        fontFamily="serif"
        fontSize="22"
        fill="#f4ece8"
        fontWeight="bold"
        textAnchor="middle"
      >
        如
      </text>
      <text
        x="50"
        y="72"
        fontFamily="serif"
        fontSize="22"
        fill="#f4ece8"
        fontWeight="bold"
        textAnchor="middle"
      >
        晤
      </text>
    </svg>
  );
}

function YouthSeal({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="游印">
      <path
        d="M50 6 C 38 6 30 14 30 28 C 30 36 36 40 36 46 C 28 50 18 58 18 76 C 18 90 32 96 50 96 C 68 96 82 90 82 76 C 82 58 72 50 64 46 C 64 40 70 36 70 28 C 70 14 62 6 50 6 Z"
        fill="#8a6a3a"
        opacity="0.92"
      />
      <path
        d="M50 6 C 38 6 30 14 30 28 C 30 36 36 40 36 46 C 28 50 18 58 18 76 C 18 90 32 96 50 96 C 68 96 82 90 82 76 C 82 58 72 50 64 46 C 64 40 70 36 70 28 C 70 14 62 6 50 6 Z"
        fill="none"
        stroke="#8a6a3a"
        strokeWidth="2"
      />
      <text
        x="50"
        y="78"
        fontFamily="serif"
        fontSize="34"
        fill="#f4ecd8"
        fontWeight="bold"
        textAnchor="middle"
      >
        游
      </text>
    </svg>
  );
}

function RemembranceStamp({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="未寄达邮戳"
    >
      <rect
        x="6"
        y="10"
        width="108"
        height="80"
        fill="none"
        stroke="#6a6a6a"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <text
        x="76"
        y="34"
        fontFamily="serif"
        fontSize="18"
        fill="#6a6a6a"
        textAnchor="middle"
      >
        未
      </text>
      <text
        x="76"
        y="56"
        fontFamily="serif"
        fontSize="18"
        fill="#6a6a6a"
        textAnchor="middle"
      >
        寄
      </text>
      <text
        x="76"
        y="78"
        fontFamily="serif"
        fontSize="18"
        fill="#6a6a6a"
        textAnchor="middle"
      >
        达
      </text>
    </svg>
  );
}
