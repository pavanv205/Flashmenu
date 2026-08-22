import React from 'react';
import { Zap } from 'lucide-react';

export default function FlashLogoBadge({ size = 'md', variant = 'gold', className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-11 h-11 rounded-2xl',
    xl: 'w-14 h-14 rounded-2xl',
  };

  const zapSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  if (variant === 'qr') {
    return (
      <div
        className={`relative bg-white text-black flex items-center justify-center shadow-md overflow-hidden shrink-0 ${
          sizeClasses[size] || sizeClasses.md
        } ${className}`}
      >
        {/* Silver QR Code Pattern Background */}
        <svg
          className="absolute inset-0 w-full h-full text-[#A0A0A0] pointer-events-none p-0.5"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="14" y="14" width="26" height="26" rx="7" stroke="currentColor" strokeWidth="4.5" fill="none" />
          <rect x="21" y="21" width="12" height="12" rx="3.5" fill="currentColor" />
          <rect x="60" y="14" width="26" height="26" rx="7" stroke="currentColor" strokeWidth="4.5" fill="none" />
          <rect x="67" y="21" width="12" height="12" rx="3.5" fill="currentColor" />
          <rect x="14" y="60" width="26" height="26" rx="7" stroke="currentColor" strokeWidth="4.5" fill="none" />
          <rect x="21" y="67" width="12" height="12" rx="3.5" fill="currentColor" />
          <rect x="47.5" y="16" width="5.5" height="5.5" rx="1.5" fill="currentColor" />
          <rect x="70.5" y="47.5" width="5.5" height="5.5" rx="1.5" fill="currentColor" />
          <rect x="47.5" y="70.5" width="5.5" height="5.5" rx="1.5" fill="currentColor" />
          <rect x="63" y="63" width="12" height="12" rx="3.5" fill="currentColor" />
        </svg>

        {/* Centered Solid Black Lightning Bolt */}
        <Zap className={`${zapSize[size] || zapSize.md} text-black fill-black relative z-10`} />
      </div>
    );
  }

  // Default Gold/Amber Badge (Image 1)
  return (
    <div
      className={`relative bg-amber-500 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-black flex items-center justify-center shadow-lg shadow-amber-500/25 overflow-hidden shrink-0 ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      <Zap className={`${zapSize[size] || zapSize.md} text-black fill-black relative z-10`} />
    </div>
  );
}
