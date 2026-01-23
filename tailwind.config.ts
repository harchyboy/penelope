import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Hartz AI Brand Colors
        hartz: {
          white: '#FFFFFF',
          black: '#0A0A0A',
          blue: '#4A90E2',
          muted: '#666666',
          border: 'rgba(0,0,0,0.08)',
        },
        // Semantic mappings
        primary: {
          DEFAULT: '#4A90E2',
          50: '#EBF3FC',
          100: '#D7E7F9',
          200: '#AFCFF3',
          300: '#87B7ED',
          400: '#5FA0E7',
          500: '#4A90E2',
          600: '#2171C9',
          700: '#19569A',
          800: '#113B6A',
          900: '#09203B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Custom sizes with tight tracking for headlines
        'display-xl': ['4.5rem', { lineHeight: '0.95', letterSpacing: '-0.05em', fontWeight: '800' }],
        'display-lg': ['3.5rem', { lineHeight: '0.95', letterSpacing: '-0.05em', fontWeight: '800' }],
        'display': ['2.5rem', { lineHeight: '1.0', letterSpacing: '-0.04em', fontWeight: '700' }],
        'heading': ['1.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'subheading': ['1.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        'meta': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.2em', fontWeight: '700' }],
      },
      borderRadius: {
        'bento': '2rem',
        'bento-lg': '2.5rem',
      },
      boxShadow: {
        'bento': '0 1px 3px rgba(0,0,0,0.04)',
        'bento-hover': '0 4px 20px rgba(74, 144, 226, 0.1)',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.05)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 4s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { opacity: '0.3', transform: 'scale(1)' },
          '100%': { opacity: '0.6', transform: 'scale(1.1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
