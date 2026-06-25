/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EBF3FF',
          100: '#D7E6FF',
          200: '#AFCDFF',
          300: '#87B3FF',
          400: '#5F9AFF',
          500: '#4F8CFF',
          600: '#2D5FCC',
          700: '#1E4899',
          800: '#163166',
          900: '#0B1B33',
          DEFAULT: '#4F8CFF',
        },
        secondary: {
          50: '#F3EFFF',
          100: '#E5D6FF',
          200: '#CAADFF',
          300: '#B28AFF',
          400: '#9966FF',
          500: '#7C4DFF',
          600: '#5C35CC',
          700: '#432699',
          800: '#2B1966',
          900: '#160D33',
          DEFAULT: '#7C4DFF',
        },
        accent: {
          50: '#E6FFF2',
          100: '#B3FFD9',
          200: '#66FFB3',
          300: '#33FF8C',
          400: '#00FF66',
          500: '#00D084',
          600: '#00A066',
          700: '#00704D',
          800: '#004033',
          900: '#001F1A',
          DEFAULT: '#00D084',
        },
        background: {
          DEFAULT: '#07111F',
          light: '#0D1B2E',
          lighter: '#152238',
          card: 'rgba(13, 27, 46, 0.7)',
          glass: 'rgba(255, 255, 255, 0.05)',
        },
        success: {
          DEFAULT: '#00D084',
          light: '#33FFB3',
          dark: '#00A066',
        },
        warning: {
          DEFAULT: '#FFA500',
          light: '#FFB84D',
          dark: '#CC8400',
        },
        danger: {
          DEFAULT: '#FF6B6B',
          light: '#FF9B9B',
          dark: '#CC5555',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'confetti': 'confetti 1s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(79, 140, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(79, 140, 255, 0.6)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) rotate(720deg)', opacity: '0' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(79, 140, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(79, 140, 255, 0.4)',
        'glow-secondary': '0 0 20px rgba(124, 77, 255, 0.3)',
        'glow-accent': '0 0 20px rgba(0, 208, 132, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
    },
  },
  plugins: [],
};
