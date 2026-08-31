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
      symbolWidth: 32,
      symbolHeight: 16,
      titleSize: 'text-sm font-extrabold tracking-wider',
      taglineSize: 'text-[7.5px] font-bold tracking-[0.14em]',
      gap: 'gap-2',
      textGap: 'gap-0.5'
    },
    md: {
      symbolWidth: 44,
      symbolHeight: 22,
      titleSize: 'text-base sm:text-lg font-extrabold tracking-wider',
      taglineSize: 'text-[8.5px] sm:text-[9.5px] font-bold tracking-[0.16em]',
      gap: 'gap-2.5 sm:gap-3',
      textGap: 'gap-0.5'
    },
    lg: {
      symbolWidth: 64,
      symbolHeight: 32,
      titleSize: 'text-2xl sm:text-3xl font-extrabold tracking-wider',
      taglineSize: 'text-xs sm:text-sm font-bold tracking-[0.18em]',
      gap: 'gap-3 sm:gap-4',
      textGap: 'gap-1'
    },
    xl: {
      symbolWidth: 84,
      symbolHeight: 42,
      titleSize: 'text-3xl sm:text-4xl font-extrabold tracking-wider',
      taglineSize: 'text-sm sm:text-base font-bold tracking-[0.2em]',
      gap: 'gap-4 sm:gap-5',
      textGap: 'gap-1'
    }
  }[size];

  // Neon CX Infinity Symbol matching exact geometry from user screenshot
  const CXGlyph = (
    <svg
      width={config.symbolWidth}
      height={config.symbolHeight}
      viewBox="0 0 100 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-[0_0_8px_rgba(198,255,0,0.35)]"
    >
      {/* Top arc of C */}
      <path
        d="M 33 8 C 21 8 9 14 9 22"
        stroke="#C6FF00"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom arc of C */}
      <path
        d="M 9 26 C 9 34 21 40 33 40"
        stroke="#C6FF00"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right Infinity / X crossing Loop */}
      <path
        d="M 33 40 C 43 40 52 32 60 24 L 68 15 C 74 8 84 8 90 14 C 96 20 96 28 90 34 C 84 40 74 40 68 33 L 60 24 C 52 16 43 8 33 8"
        stroke="#C6FF00"
        strokeWidth="7"
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
