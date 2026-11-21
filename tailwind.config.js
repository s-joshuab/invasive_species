/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        app: '#f5f5f1',
        panel: '#ffffff',
        hover: '#efefe9',
        border: '#e1e1da',
        ink: '#1d1d1b',
        muted: '#5f5f59',
        subtle: '#85857d',
        brand: {
          DEFAULT: '#23855a',
          hover: '#1b6b49',
        },
        'inv-high': '#c92a1d',
        'inv-mod': '#b85c08',
        'inv-low': '#5f8114',
        native: '#23855a',
        info: '#1d4ed8',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        content: '1400px',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'slide-in': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(.98) translateY(-4px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 150ms ease-out',
        'slide-in-left': 'slide-in-left 150ms ease-out',
        'fade-in': 'fade-in 150ms ease-out',
        'scale-in': 'scale-in 150ms ease-out',
        'toast-in': 'toast-in 180ms ease-out',
      },
    },
  },
  plugins: [],
}
