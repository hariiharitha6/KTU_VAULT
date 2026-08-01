/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Calming study palette (WCAG AA compliant)
        atlas: {
          bg: '#0f1419',        // Soft charcoal (not harsh black)
          surface: '#1a2028',   // Elevated surface
          panel: '#232b36',     // Panels / cards
          border: '#2f3844',    // Subtle borders
          text: '#e6ebf2',      // Primary text (high contrast)
          muted: '#9ba7b8',     // Secondary text
          faint: '#6b7787',     // Tertiary text
          accent: '#7c9eff',    // Calming periwinkle
          accent2: '#a78bfa',   // Soft violet
          success: '#86dfba',   // Muted green
          warning: '#f0c987',   // Warm amber
          error: '#e8a598',     // Soft coral (not alarming red)
          info: '#8ecae6',      // Soft sky
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI',
               'Inter', 'Roboto', 'Helvetica Neue', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'monospace'],
      },
      fontSize: {
        // WCAG AA min 14px body
        'xs': ['12px', { lineHeight: '1.5' }],
        'sm': ['14px', { lineHeight: '1.6' }],
        'base': ['16px', { lineHeight: '1.7' }],
        'lg': ['18px', { lineHeight: '1.7' }],
        'xl': ['20px', { lineHeight: '1.5' }],
        '2xl': ['24px', { lineHeight: '1.4' }],
        '3xl': ['30px', { lineHeight: '1.3' }],
        '4xl': ['36px', { lineHeight: '1.2' }],
        '5xl': ['48px', { lineHeight: '1.1' }],
      },
      animation: {
        'breathe': 'breathe 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'aurora': 'aurora 20s ease infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -20px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 30px) scale(0.95)' },
        },
      },
    },
  },
  plugins: [],
};