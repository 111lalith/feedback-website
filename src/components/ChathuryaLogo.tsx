import React from 'react';

interface ChathuryaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'vertical' | 'badge';
  className?: string;
  showTagline?: boolean;
}

export const ChathuryaLogo: React.FC<ChathuryaLogoProps> = ({
  size = 'md',
  layout = 'horizontal',
  className = '',
  showTagline = true
}) => {
  // Dimension scales matching exact proportions from screenshot
  const dimensions述 = {
    sm: { 
      cardPadding: 'px-3 py-2.5',
      symbolWidth: 54, 
      symbolHeight: 28, 
      titleSize: 'text-sm tracking-normal font-normal', 
      taglineSize: 'text-[9px] tracking-wider font-bold', 
      gap: 'gap-1',
      hGap: 'gap-2.5'
    },
    md: { 
      cardPadding: 'px-4 py-3',
      symbolWidth: 78, 
      symbolHeight: 40, 
      titleSize: 'text-lg tracking-normal font-normal', 
      taglineSize: 'text-[10px] sm:text-[11px] tracking-wider font-bold', 
      gap: 'gap-1.5',
      hGap: 'gap-3'
    },
    lg: { 
      cardPadding: 'px-6 py-5',
      symbolWidth: 120, 
      symbolHeight: 62, 
      titleSize: 'text-2xl sm:text-3xl tracking-normal font-normal', 
      taglineSize: 'text-xs sm:text-sm tracking-wider font-bold', 
      gap: 'gap-2',
      hGap: 'gap-4'
    },
    xl: { 
      cardPadding: 'px-8 py-7',
      symbolWidth: 170, 
      symbolHeight: 88, 
      titleSize: 'text-4xl tracking-normal font-normal', 
      taglineSize: 'text-sm sm:text-base tracking-wider font-bold', 
      gap: 'gap-2.5',
      hGap: 'gap-5'
    }
  }[size];

  // Exact 1:1 Vector CX Infinity Glyph
  // - Clean vertical inner stem for 'C' on left
  // - Upper and lower curves merging into the 'X' crossing
  // - Right loop mirroring the infinity loop
  // - Top and bottom right stems terminating cleanly at the vertical boundary
  const CXSymbol = (
    <svg
      width={dimensions述.symbolWidth}
      height={dimensions述.symbolHeight}
      viewBox="0 0 200 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* C on left with vertical inner edge */}
      <path
        d="M 74 18 
           C 42 18, 18 32, 18 50 
           C 18 68, 42 82, 74 82"
        stroke="#D4FF00"
        strokeWidth="20"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />

      {/* Infinity / X intersecting on right with vertical inner edge */}
      <path
        d="M 86 18 
           C 96 18, 106 32, 114 50 
           C 122 68, 138 82, 158 82 
           C 178 82, 188 68, 188 50 
           C 188 32, 178 18, 158 18 
           C 138 18, 122 32, 114 50 
           C 106 68, 96 82, 86 82"
        stroke="#D4FF00"
        strokeWidth="20"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </svg>
  );

  // Full Card Badge Layout matching the uploaded logo screenshot
  if (layout === 'vertical' || layout === 'badge') {
    return (
      <div 
        className={`inline-flex flex-col items-center justify-center text-center rounded-xl bg-[#2A2E2B] border border-[#3A403B] shadow-lg ${dimensions述.cardPadding} ${dimensions述.gap} ${className}`}
      >
        {/* Symbol */}
        <div className="flex items-center justify-center my-0.5">
          {CXSymbol}
        </div>

        {/* Brand Name "Chathurya" */}
        <div className="flex flex-col items-center justify-center">
          <span 
            className={`text-[#D4FF00] ${dimensions述.titleSize} leading-none`}
            style={{ 
              fontFamily: "'Space Grotesk', system-ui, -apple-system, sans-serif",
              letterSpacing: '0.01em'
            }}
          >
            Chathurya
          </span>

          {/* Tagline "<STUDENT DEVELOPERS CLUB>" */}
          {showTagline && (
            <span 
              className={`text-[#C2C9C2] ${dimensions述.taglineSize} leading-none mt-1`}
              style={{ 
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.04em'
              }}
            >
              &lt;STUDENT DEVELOPERS CLUB&gt;
            </span>
          )}
        </div>
      </div>
    );
  }

  // Horizontal Header / Inline Layout
  return (
    <div className={`flex items-center ${dimensions述.hGap} ${className}`}>
      {/* Dark container for CX Symbol */}
      <div className="p-1.5 sm:p-2 rounded-xl bg-[#2A2E2B] border border-[#3A403B] flex items-center justify-center">
        {CXSymbol}
      </div>

      {/* Brand Text Lockup */}
      <div className="flex flex-col justify-center">
        <span 
          className={`text-[#D4FF00] ${dimensions述.titleSize} leading-none`}
          style={{ 
            fontFamily: "'Space Grotesk', system-ui, -apple-system, sans-serif",
            letterSpacing: '0.01em'
          }}
        >
          Chathurya
        </span>
        {showTagline && (
          <span 
            className={`text-[#C2C9C2] ${dimensions述.taglineSize} leading-none mt-1`}
            style={{ 
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.04em'
            }}
          >
            &lt;STUDENT DEVELOPERS CLUB&gt;
          </span>
        )}
      </div>
    </div>
  );
};


