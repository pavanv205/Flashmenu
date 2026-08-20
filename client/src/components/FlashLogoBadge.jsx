import React from 'react';
import { Zap } from 'lucide-react';

export default function FlashLogoBadge({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-11 h-11 rounded-2xl',
    xl: 'w-14 h-14 rounded-3xl',
  };

  const zapSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  return (
    <div
      className={`bg-amber-500 text-black flex items-center justify-center shadow-lg shadow-amber-500/20 overflow-hidden shrink-0 ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      <Zap className={`${zapSize[size] || zapSize.md} text-black fill-black`} />
    </div>
  );
}
