import React from 'react';

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = ''
}) {
  const sizeStyles = {
    sm: 'text-[10px] px-2.5 py-0.5 font-bold',
    md: 'text-xs px-3 py-1 font-bold',
    lg: 'text-sm px-3.5 py-1.5 font-bold',
  };

  const variantStyles = {
    volt: 'bg-volt/15 text-volt border border-volt/40 shadow-sm shadow-volt/10',
    success: 'bg-volt/15 text-volt border border-volt/40 shadow-sm shadow-volt/10',
    flame: 'bg-flame/15 text-flame border border-flame/40 shadow-sm shadow-flame/10',
    orange: 'bg-flame/15 text-flame border border-flame/40 shadow-sm shadow-flame/10',
    warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/35',
    danger: 'bg-rose-500/15 text-rose-400 border border-rose-500/35',
    cyan: 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/40 shadow-sm shadow-neon-cyan/10',
    info: 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/40 shadow-sm shadow-neon-cyan/10',
    purple: 'bg-neon-purple/15 text-neon-purple border border-neon-purple/40 shadow-sm shadow-neon-purple/10',
    neutral: 'bg-dark-850 text-slate-300 border border-slate-700/80',
  };

  const dotColors = {
    volt: 'bg-volt shadow-[0_0_8px_#00F59B]',
    success: 'bg-volt shadow-[0_0_8px_#00F59B]',
    flame: 'bg-flame shadow-[0_0_8px_#FF5E00]',
    orange: 'bg-flame shadow-[0_0_8px_#FF5E00]',
    warning: 'bg-amber-400 shadow-[0_0_8px_#FBBF24]',
    danger: 'bg-rose-500 shadow-[0_0_8px_#F43F5E]',
    cyan: 'bg-neon-cyan shadow-[0_0_8px_#00F0FF]',
    info: 'bg-neon-cyan shadow-[0_0_8px_#00F0FF]',
    purple: 'bg-neon-purple shadow-[0_0_8px_#A855F7]',
    neutral: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full uppercase tracking-wider font-display ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.neutral} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.neutral} animate-pulse`}
        />
      )}
      {children}
    </span>
  );
}
