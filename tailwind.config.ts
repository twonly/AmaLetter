import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#f4ecd8',
          kraft: '#e8dcc0',
          warm: '#f4ece8',
          ash: '#ececec',
        },
        ink: {
          DEFAULT: '#1a1a1a',
          soft: '#2a2a2a',
          faint: '#4a4a4a',
          deep: '#1a2a4a',
        },
        seal: {
          red: '#8b3a3a',
          purple: '#5a3a5a',
          brown: '#8a6a3a',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'serif'],
        master: ['"LXGW WenKai"', '"Noto Serif SC"', 'serif'],
      },
      keyframes: {
        'fade-in-slow': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'ink-bleed': {
          '0%': { opacity: '0', filter: 'blur(4px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        'paper-grain': {
          '0%, 100%': { backgroundPosition: '0 0' },
          '50%': { backgroundPosition: '4px 4px' },
        },
      },
      animation: {
        'fade-in-slow': 'fade-in-slow 1.8s ease-out forwards',
        'ink-bleed': 'ink-bleed 1.2s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
