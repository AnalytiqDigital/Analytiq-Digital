import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0B3D3A', // deep teal / navy-green
          dark: '#082826',
          light: '#12534F',
        },
        accent: {
          DEFAULT: '#C7942C', // restrained gold
          light: '#E0B24F',
          teal: '#1FA98C', // bright but restrained teal, used sparingly
        },
        ink: '#0F172A', // charcoal
        surface: {
          DEFAULT: '#FFFFFF',
          off: '#F8FAFC',
        },
        success: '#1E7A4C',
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
        soft: '0 6px 24px -8px rgba(15, 23, 42, 0.12)',
        card: '0 2px 10px -2px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
