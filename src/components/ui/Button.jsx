import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed select-none overflow-hidden cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
    xl: 'text-lg px-8 py-4 gap-3',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-volt-400 via-volt to-emerald-400 text-dark-950 hover:brightness-110 shadow-lg shadow-volt/25 hover:shadow-volt/50 hover:-translate-y-0.5 font-bold focus:ring-volt',
    energy:
      'bg-gradient-to-r from-flame-400 via-flame-500 to-rose-500 text-white hover:brightness-110 shadow-lg shadow-flame/30 hover:shadow-flame/55 hover:-translate-y-0.5 font-bold focus:ring-flame',
    cyber:
      'bg-gradient-to-r from-neon-cyan via-sky-400 to-blue-500 text-dark-950 hover:brightness-110 shadow-lg shadow-neon-cyan/30 hover:shadow-neon-cyan/55 hover:-translate-y-0.5 font-bold focus:ring-neon-cyan',
    purple:
      'bg-gradient-to-r from-neon-purple to-pink-500 text-white hover:brightness-110 shadow-lg shadow-neon-purple/30 hover:shadow-neon-purple/50 hover:-translate-y-0.5 font-bold focus:ring-neon-purple',
    secondary:
      'bg-dark-850/90 text-slate-100 border border-slate-700/80 hover:bg-dark-800 hover:border-slate-500 hover:text-white focus:ring-slate-500 hover:-translate-y-0.5',
    outline:
      'bg-transparent border border-volt/50 text-volt hover:bg-volt/10 hover:border-volt focus:ring-volt hover:-translate-y-0.5',
    outlineFlame:
      'bg-transparent border border-flame/50 text-flame hover:bg-flame/10 hover:border-flame focus:ring-flame hover:-translate-y-0.5',
    ghost:
      'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60 focus:ring-slate-600',
    danger:
      'bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-600/30 focus:ring-rose-500',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
      )}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
      )}
    </button>
  );
}
