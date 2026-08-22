import React from 'react';
import { Zap } from 'lucide-react';

export default function FlashLogoBadge({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-[22%]',
    md: 'w-9 h-9 rounded-[24%]',
    lg: 'w-11 h-11 rounded-[24%]',
    xl: 'w-14 h-14 rounded-[26%]',
  };

  const zapSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  return (
    <div
      className={`relative bg-amber-500 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-black flex items-center justify-center shadow-lg shadow-amber-500/30 overflow-hidden shrink-0 ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      {/* Centered Solid Black Lightning Bolt Icon */}
      <Zap className={`${zapSize[size] || zapSize.md} text-black fill-black relative z-10`} />
    </div>
  );
}
