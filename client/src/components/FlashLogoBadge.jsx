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
      className={`relative bg-white text-black flex items-center justify-center shadow-lg overflow-hidden shrink-0 ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      {/* High-tech QR Code Matrix Pattern Background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-25 text-black pointer-events-none p-1"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top-Left Position Square */}
        <rect x="2" y="2" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="4.5" y="4.5" width="3" height="3" fill="currentColor" />

        {/* Top-Right Position Square */}
        <rect x="22" y="2" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="24.5" y="4.5" width="3" height="3" fill="currentColor" />

        {/* Bottom-Left Position Square */}
        <rect x="2" y="22" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="4.5" y="24.5" width="3" height="3" fill="currentColor" />

        {/* QR Data Dots */}
        <rect x="13" y="3" width="2.5" height="2.5" fill="currentColor" rx="0.5" />
        <rect x="17" y="5" width="2.5" height="2.5" fill="currentColor" rx="0.5" />
        <rect x="13" y="9" width="2.5" height="2.5" fill="currentColor" rx="0.5" />
        <rect x="23" y="13" width="2.5" height="2.5" fill="currentColor" rx="0.5" />
        <rect x="27" y="17" width="2.5" height="2.5" fill="currentColor" rx="0.5" />
        <rect x="13" y="23" width="2.5" height="2.5" fill="currentColor" rx="0.5" />
        <rect x="17" y="27" width="2.5" height="2.5" fill="currentColor" rx="0.5" />
        <rect x="24.5" y="24.5" width="4" height="4" fill="currentColor" rx="1" />
      </svg>

      {/* Foreground Lightning Bolt Icon */}
      <Zap className={`${zapSize[size] || zapSize.md} text-black fill-black relative z-10 drop-shadow-sm`} />
    </div>
  );
}
