import React from 'react';

interface ChathuryaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'vertical';
  className?: string;
  showTagline?: boolean;
}

export const ChathuryaLogo: React.FC<ChathuryaLogoProps> = ({
  size = 'md',
  layout = 'horizontal',
  className = '',
  showTagline = true
}) => {
  // Dimension scales
  const dimensions = {
    sm: { iconWidth: 32, iconHeight: 18, titleSize: 'text-sm', subSize: 'text-[9px]', gap: 'gap-2' },
    md: { iconWidth: 42, iconHeight: 24, titleSize: 'text-base sm:text-lg', subSize: 'text-[10px] sm:text-[11px]', gap: 'gap-2.5' },
    lg: { iconWidth: 68, iconHeight: 38, titleSize: 'text-2xl sm:text-3xl', subSize: 'text-xs sm:text-sm', gap: 'gap-3' },
    xl: { iconWidth: 110, iconHeight: 62, titleSize: 'text-3xl sm:text-4xl', subSize: 'text-sm sm:text-base', gap: 'gap-4' }
  }[size];

  // Precision vector SVG of the Chathurya Infinity / C-glyph
  const IconSVG = (
    <svg
      width={dimensions.iconWidth}
      height={dimensions.iconHeight}
      viewBox="0 0 160 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
    >
      <defs>
        <filter id="chathuryaNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="chathuryaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CCFF00" />
          <stop offset="50%" stopColor="#B0FF00" />
          <stop offset="100%" stopColor="#95E600" />
        </linearGradient>
      </defs>

      {/* Background shadow glow */}
      <g filter="url(#chathuryaNeonGlow)">
        {/* Continuous Infinity Ribbon */}
        <path
          d="M 46 22 
             C 24 22, 12 33, 12 45 
             C 12 57, 24 68, 46 68 
             C 66 68, 77 56, 80 45 
             C 83 34, 94 22, 114 22 
             C 136 22, 148 33, 148 45 
             C 148 57, 136 68, 114 68 
             C 94 68, 83 56, 80 45 
             C 77 34, 66 22, 46 22 Z"
          stroke="url(#chathuryaGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Center left C-stem vertical glyph accent for Chathurya branding */}
        <path
          d="M 44 26 L 44 64"
          stroke="url(#chathuryaGrad)"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Inner glow dot */}
        <circle cx="80" cy="45" r="3.5" fill="#CCFF00" />
      </g>
    </svg>
  );

  if (layout === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center ${dimensions.gap} ${className}`}>
        <div className="p-3.5 rounded-2xl bg-black border border-[#B0FF00]/40 shadow-[0_0_30px_rgba(176,255,0,0.18)] flex items-center justify-center">
          {IconSVG}
        </div>
        <div className="space-y-0.5">
          <span className={`font-extrabold tracking-wide text-[#B0FF00] font-sans ${dimensions.titleSize} block drop-shadow-[0_0_10px_rgba(176,255,0,0.35)]`}>
            Chathurya
          </span>
          {showTagline && (
            <span className={`font-mono text-zinc-200 font-medium tracking-widest uppercase block ${dimensions.subSize}`}>
              &lt;STUDENT DEVELOPERS CLUB&gt;
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${dimensions.gap} ${className}`}>
      <div className="p-1.5 sm:p-2 rounded-xl bg-black border border-[#B0FF00]/30 shadow-[0_0_18px_rgba(176,255,0,0.15)] flex items-center justify-center">
        {IconSVG}
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold tracking-tight text-[#B0FF00] font-sans ${dimensions.titleSize} leading-none drop-shadow-[0_0_10px_rgba(176,255,0,0.3)]`}>
            Chathurya
          </span>
        </div>
        {showTagline && (
          <span className={`font-mono text-zinc-200 font-medium tracking-wider uppercase ${dimensions.subSize} leading-tight mt-0.5`}>
            &lt;STUDENT DEVELOPERS CLUB&gt;
          </span>
        )}
      </div>
    </div>
  );
};

