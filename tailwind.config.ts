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
        // CSS variable-based colors (for shadcn/ui compatibility)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Hartz AI Design System
        'hartz-blue': '#4A90E2',
        'hartz-black': '#0A0A0A',
        'hartz-gray': '#F8F8F8',
        'hartz-muted': '#666666',
        'hartz-border': 'rgba(0,0,0,0.08)',
        // Premium Editorial Brand Colors (used by dashboard, create, etc.)
        'brand-teal': '#3498A3',
        'brand-teal-dark': '#2a7a86',
        'brand-coral': '#E87D4E',
        'brand-coral-dark': '#d66a3d',
        'brand-dark': '#1a2a3a',
        'brand-dark-lighter': '#2c3e50',
        'gray-text': '#6b7c8c',
        'light-bg': '#F8FAFB',
        // Legacy hartz colors (for backward compatibility with other components)
        'hartz-sky-blue': '#3498A3',
        'hartz-growth-green': '#3498A3',
        'hartz-confidence-coral': '#E87D4E',
        'hartz-warm-amber': '#E87D4E',
        'hartz-charcoal': '#1a2a3a',
        'hartz-warm-grey': '#6b7c8c',
        'hartz-light-grey': '#e8eef2',
        'hartz-off-white': '#F8FAFB',
        // Legacy brand colors (for backwards compatibility)
        brand: {
          teal: '#3498A3',
          coral: '#E87D4E',
          dark: '#1a2a3a',
          light: '#F8FAFB',
        },
        // Semantic colors
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#f0fafb',
          100: '#d4f0f3',
          200: '#a9e1e7',
          300: '#7dd2db',
          400: '#52c3cf',
          500: '#3498A3',
          600: '#2a7a86',
          700: '#205c66',
          800: '#163e45',
          900: '#0c2025',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          50: '#fef6f3',
          100: '#fde8e0',
          200: '#fbd1c1',
          300: '#f7b092',
          400: '#f28f63',
          500: '#E87D4E',
          600: '#d66a3d',
          700: '#b3552e',
          800: '#8f4025',
          900: '#6b2b1c',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'xl': '18px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '48px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'var(--font-dm-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'Inter', 'var(--font-dm-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
        serif: ['var(--font-source-serif)', 'Source Serif 4', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 15px 35px rgba(0,0,0,0.03)',
        'soft-lg': '0 25px 50px rgba(0,0,0,0.05)',
        'glow-teal': '0 10px 40px rgba(52,152,163,0.15)',
        'glow-coral': '0 10px 40px rgba(232,125,78,0.25)',
        'bento': '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        'bento-hover': '0 4px 16px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.04)',
        'bento-lg': '0 8px 24px rgba(0,0,0,0.06), 0 20px 48px rgba(0,0,0,0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
