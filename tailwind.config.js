/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#050811',
          900: '#0A0F1E',
          850: '#10182E',
          800: '#15213F',
          750: '#1D2D54',
          700: '#25396A',
          600: '#344F94',
        },
        volt: {
          300: '#D9FF66',
          400: '#CCFF00',
          500: '#00F59B',
          600: '#10B981',
          DEFAULT: '#00F59B',
        },
        flame: {
          400: '#FF7A00',
          500: '#FF5E00',
          600: '#E04E00',
          DEFAULT: '#FF5E00',
        },
        neon: {
          cyan: '#00F0FF',
          blue: '#38BDF8',
          purple: '#A855F7',
          pink: '#EC4899',
          amber: '#F59E0B',
        },
        electric: {
          green: '#00F59B',
          lime: '#10B981',
          emerald: '#059669',
          orange: '#FF5E00',
          amber: '#F59E0B',
          cyan: '#00F0FF',
          blue: '#38BDF8',
          purple: '#8B5CF6',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-volt': '0 0 30px -5px rgba(0, 245, 155, 0.5)',
        'glow-flame': '0 0 30px -5px rgba(255, 94, 0, 0.5)',
        'glow-cyan': '0 0 30px -5px rgba(0, 240, 255, 0.45)',
        'glow-purple': '0 0 30px -5px rgba(168, 85, 247, 0.45)',
        'glow-card': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'radar-ping': 'radarPing 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'gradient-x': 'gradientX 8s ease infinite',
        'flame-flicker': 'flameFlicker 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(0, 245, 155, 0.6))' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 5px rgba(0, 245, 155, 0.2))' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(2deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(14px) rotate(-2deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        radarPing: {
          '75%, 100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        flameFlicker: {
          '0%': { transform: 'scale(1) rotate(-1deg)', filter: 'drop-shadow(0 0 10px rgba(255, 94, 0, 0.7))' },
          '100%': { transform: 'scale(1.08) rotate(1deg)', filter: 'drop-shadow(0 0 18px rgba(255, 122, 0, 0.9))' },
        }
      }
    },
  },
  plugins: [],
}
