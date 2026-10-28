import React from 'react';

export default function Card({
  children,
  variant = 'glass',
  interactive = false,
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = 'rounded-2xl transition-all duration-300 relative';

  const variantStyles = {
    glass:
      'bg-dark-900/85 backdrop-blur-xl border border-slate-800/90 shadow-xl shadow-black/50',
    glassVolt:
      'bg-dark-900/90 backdrop-blur-xl border border-volt/35 shadow-xl shadow-volt/10',
    glassFlame:
      'bg-dark-900/90 backdrop-blur-xl border border-flame/35 shadow-xl shadow-flame/10',
    glassCyan:
      'bg-dark-900/90 backdrop-blur-xl border border-neon-cyan/35 shadow-xl shadow-neon-cyan/10',
    glassPurple:
      'bg-dark-900/90 backdrop-blur-xl border border-neon-purple/35 shadow-xl shadow-neon-purple/10',
    dark:
      'bg-dark-850 border border-slate-800 shadow-lg',
  };

  const interactiveStyles = interactive
    ? 'hover:-translate-y-1.5 hover:border-volt/60 hover:shadow-2xl hover:shadow-volt/15 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.glass} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
