import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0050D0', // primary blue, from the AQ mark
          dark: '#001450', // deep navy from the wordmark
          darker: '#000C30',
          light: '#00A0F0', // bright cyan-blue from the AQ ring gradient
        },
        accent: {
          DEFAULT: '#F5A623', // orange/gold from the swoosh + bar chart
          light: '#FFC24D',
          teal: '#00C8F0', // bright accent blue, used for links/highlights
        },
        ink: '#0B1220',
        surface: {
          DEFAULT: '#FFFFFF',
          off: '#F4F8FC',
        },
        success: '#1E9E5A',
      },
      fontFamily: {
        // System-first stack: matches the brief's "system or one elegant
        // pair" guidance and keeps builds fast/offline-safe. To switch to
        // next/font/google's Inter later, see the README note.
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Inter',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Inter',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      maxWidth: {
        prose: '68ch',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        soft: '0 6px 24px -8px rgba(0, 20, 80, 0.18)',
        card: '0 2px 10px -2px rgba(0, 20, 80, 0.10)',
        glow: '0 0 40px -8px rgba(0, 160, 240, 0.35)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #001450 0%, #0050D0 55%, #00A0F0 100%)',
        'accent-gradient': 'linear-gradient(90deg, #F5A623 0%, #00A0F0 100%)',
        'grid-pattern':
          'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
