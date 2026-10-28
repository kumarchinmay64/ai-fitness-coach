import React from 'react';

export default function LoadingSpinner({
  size = 'md',
  message = 'Loading biometrics...',
  className = ''
}) {
  const sizeMap = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 space-y-4 ${className}`}>
      <div className="relative">
        {/* Glow backdrop */}
        <div className="absolute inset-0 rounded-full bg-electric-green/20 blur-xl animate-pulse"></div>

        {/* Outer Ring */}
        <div
          className={`${sizeMap[size] || sizeMap.md} rounded-full border-slate-800 border-t-electric-green border-r-emerald-400 animate-spin`}
        />
      </div>

      {message && (
        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
