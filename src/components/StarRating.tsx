import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  required?: boolean;
}

const RATING_DESCRIPTIONS: Record<number, string> = {
  1: 'Needs Significant Improvement',
  2: 'Fair / Below Expectations',
  3: 'Good / Met Expectations',
  4: 'Very Good / High Quality',
  5: 'Outstanding / Exceptional'
};

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  label,
  sublabel,
  size = 'md',
  readonly = false,
  required = false
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6 sm:w-7 sm:h-7',
    lg: 'w-8 h-8 sm:w-9 sm:h-9'
  };

  const displayRating = hovered !== null ? hovered : value;

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-200 flex items-center gap-1">
            {label}
            {required && <span className="text-[#B0FF00] font-mono">*</span>}
          </label>
          {displayRating > 0 && (
            <span className="text-xs font-mono text-[#B0FF00] tracking-wide">
              {displayRating}/5 {RATING_DESCRIPTIONS[displayRating] ? `— ${RATING_DESCRIPTIONS[displayRating]}` : ''}
            </span>
          )}
        </div>
      )}

      {sublabel && (
        <p className="text-xs text-gray-400 font-sans">{sublabel}</p>
      )}

      <div className="flex items-center gap-1.5 pt-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayRating;
          return (
            <button
              type="button"
              key={star}
              disabled={readonly}
              onClick={() => !readonly && onChange(star)}
              onMouseEnter={() => !readonly && setHovered(star)}
              onMouseLeave={() => !readonly && setHovered(null)}
              className={`p-1 rounded-md transition-all ${
                readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'
              } ${isFilled ? 'text-[#B0FF00]' : 'text-zinc-700 hover:text-zinc-500'}`}
              aria-label={`Rate ${star} out of 5 stars`}
            >
              <Star 
                className={`${starSizes[size]} transition-all ${
                  isFilled 
                    ? 'fill-[#B0FF00] text-[#B0FF00] drop-shadow-[0_0_8px_rgba(176,255,0,0.4)]' 
                    : 'fill-transparent'
                }`} 
              />
            </button>
          );
        })}

        {!label && displayRating > 0 && (
          <span className="ml-2 text-xs font-mono text-[#B0FF00]">
            {displayRating}/5
          </span>
        )}
      </div>
    </div>
  );
};
