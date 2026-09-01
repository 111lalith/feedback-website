import React from 'react';

interface ChathuryaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const ChathuryaLogo: React.FC<ChathuryaLogoProps> = ({
  size = 'md',
  className = '',
  showTagline = true
}) => {
  const config = {
    sm: {
      symbolWidth: 36,
      symbolHeight: 18,
      titleSize: 'text-sm font-bold tracking-tight',
      taglineSize: 'text-[6.5px] font-bold tracking-[0.14em]',
      gap: 'gap-2.5',
      textGap: 'gap-0'
    },
    md: {
      symbolWidth: 48,
      symbolHeight: 23,
      titleSize: 'text-base sm:text-lg font-bold tracking-tight',
      taglineSize: 'text-[7.5px] sm:text-[8.5px] font-bold tracking-[0.15em]',
      gap: 'gap-3',
      textGap: 'gap-0.5'
    },
    lg: {
      symbolWidth: 68,
      symbolHeight: 33,
      titleSize: 'text-2xl sm:text-3xl font-bold tracking-tight',
      taglineSize: 'text-xs sm:text-sm font-bold tracking-[0.16em]',
      gap: 'gap-3.5',
      textGap: 'gap-1'
    },
    xl: {
      symbolWidth: 92,
      symbolHeight: 44,
      titleSize: 'text-3xl sm:text-4xl font-bold tracking-tight',
      taglineSize: 'text-sm sm:text-base font-bold tracking-[0.18em]',
      gap: 'gap-4',
      textGap: 'gap-1'
    }
  }[size];

  // Exact vector reproduction of the CX infinity symbol from Screenshot 2026-08-31 212519.png
  const CXGlyph = (
    <svg
      width={config.symbolWidth}
      height={config.symbolHeight}
      viewBox="0 0 132 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-[0_0_6px_rgba(212,255,0,0.45)]"
      aria-label="Chathurya CX Symbol"
    >
      {/* Left 'C' Curve with crisp vertical cut gap */}
      <path
        d="M 40 11 C 23 11 10 20 10 32 C 10 44 23 53 40 53"
        stroke="#D4FF00"
        strokeWidth="11"
        strokeLinecap="butt"
        strokeLinejoin="round"
      />
      {/* Right 'X' / Infinity Loop with crisp vertical cut gap matching C */}
      <path
        d="M 47 11 C 56 11 61 21 66 32 C 71 43 79 53 96 53 C 112 53 122 44 122 32 C 122 20 112 11 96 11 C 79 11 71 21 66 32 C 61 43 56 53 47 53"
        stroke="#D4FF00"
        strokeWidth="11"
        strokeLinecap="butt"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className={`inline-flex items-center ${config.gap} select-none ${className}`}>
      {CXGlyph}
      <div className={`flex flex-col justify-center ${config.textGap}`}>
        <span 
          className={`text-white ${config.titleSize} uppercase leading-none`}
          style={{ fontFamily: "Arial, Helvetica, sans-serif", fontWeight: 900, letterSpacing: '0.02em' }}
        >
          CHATHURYA
        </span>
        {showTagline && (
          <span 
            className={`text-zinc-400 ${config.taglineSize} uppercase leading-none`}
            style={{ fontFamily: "Arial, Helvetica, sans-serif", fontWeight: 700 }}
          >
            STUDENT DEVELOPERS CLUB
          </span>
        )}
      </div>
    </div>
  );
};
