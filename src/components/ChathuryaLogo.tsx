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
      symbolWidth: 34,
      symbolHeight: 18,
      titleSize: 'text-sm font-extrabold tracking-wider',
      taglineSize: 'text-[7.5px] font-bold tracking-[0.14em]',
      gap: 'gap-2.5',
      textGap: 'gap-0.5'
    },
    md: {
      symbolWidth: 46,
      symbolHeight: 24,
      titleSize: 'text-base sm:text-lg font-extrabold tracking-wider',
      taglineSize: 'text-[8.5px] sm:text-[9.5px] font-bold tracking-[0.16em]',
      gap: 'gap-3',
      textGap: 'gap-0.5'
    },
    lg: {
      symbolWidth: 68,
      symbolHeight: 36,
      titleSize: 'text-2xl sm:text-3xl font-extrabold tracking-wider',
      taglineSize: 'text-xs sm:text-sm font-bold tracking-[0.18em]',
      gap: 'gap-3.5 sm:gap-4',
      textGap: 'gap-1'
    },
    xl: {
      symbolWidth: 92,
      symbolHeight: 48,
      titleSize: 'text-3xl sm:text-4xl font-extrabold tracking-wider',
      taglineSize: 'text-sm sm:text-base font-bold tracking-[0.2em]',
      gap: 'gap-4 sm:gap-5',
      textGap: 'gap-1'
    }
  }[size];

  // Neon CX Infinity Symbol matching Screenshot 2026-08-31 212519.png
  const CXGlyph = (
    <svg
      width={config.symbolWidth}
      height={config.symbolHeight}
      viewBox="0 0 106 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-[0_0_10px_rgba(198,255,0,0.45)]"
    >
      {/* C shaped left arc */}
      <path
        d="M 37 9 C 22 9 9 16 9 27 C 9 38 22 45 37 45"
        stroke="#C6FF00"
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right Infinity / X Loop with vertical slit separation from C */}
      <path
        d="M 40 45 C 50 45 58 35 68 27 L 76 19 C 83 11 93 11 97 18 C 101 24 101 30 97 36 C 93 43 83 43 76 35 L 68 27 C 58 19 50 9 40 9"
        stroke="#C6FF00"
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className={`inline-flex items-center ${config.gap} select-none ${className}`}>
      {CXGlyph}
      <div className={`flex flex-col justify-center ${config.textGap}`}>
        <span 
          className={`text-white ${config.titleSize} uppercase leading-none font-sans`}
          style={{ fontFamily: "'Space Grotesk', system-ui, -apple-system, sans-serif" }}
        >
          CHATHURYA
        </span>
        {showTagline && (
          <span 
            className={`text-zinc-400 ${config.taglineSize} uppercase leading-none font-sans`}
            style={{ fontFamily: "'Space Grotesk', system-ui, -apple-system, sans-serif" }}
          >
            STUDENT DEVELOPERS CLUB
          </span>
        )}
      </div>
    </div>
  );
};
