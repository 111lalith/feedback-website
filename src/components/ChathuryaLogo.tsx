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
      titleSize: 'text-sm font-black tracking-wider',
      taglineSize: 'text-[7.5px] font-bold tracking-[0.16em]',
      textGap: 'gap-0.5'
    },
    md: {
      titleSize: 'text-lg sm:text-xl font-black tracking-wider',
      taglineSize: 'text-[8.5px] sm:text-[9.5px] font-bold tracking-[0.16em]',
      textGap: 'gap-0.5'
    },
    lg: {
      titleSize: 'text-2xl sm:text-3xl font-black tracking-wider',
      taglineSize: 'text-xs sm:text-sm font-bold tracking-[0.18em]',
      textGap: 'gap-1'
    },
    xl: {
      titleSize: 'text-3xl sm:text-4xl font-black tracking-wider',
      taglineSize: 'text-sm sm:text-base font-bold tracking-[0.2em]',
      textGap: 'gap-1'
    }
  }[size];

  return (
    <div className={`inline-flex flex-col justify-center select-none ${config.textGap} ${className}`}>
      <span 
        className={`text-white ${config.titleSize} uppercase leading-none font-sans`}
        style={{ fontFamily: "'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      >
        CHATHURYA
      </span>
      {showTagline && (
        <span 
          className={`text-zinc-400 ${config.taglineSize} uppercase leading-none font-sans`}
          style={{ fontFamily: "'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
        >
          STUDENT DEVELOPERS CLUB
        </span>
      )}
    </div>
  );
};
