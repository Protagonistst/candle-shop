/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        cream: '#FAF5EC',
        parchment: '#F2E8D8',
        sand: '#E6D6BE',
        espresso: '#2A1C13',
        bark: '#4A3426',
        smoke: '#7A6556',
        ember: {
          DEFAULT: '#B4561E',
          dark: '#8F4113',
          light: '#F6E3D3',
        },
        honey: '#D99A3E',
        moss: '#56613F',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(42, 28, 19, 0.04), 0 8px 24px -12px rgba(42, 28, 19, 0.18)',
        lift: '0 2px 4px rgba(42, 28, 19, 0.05), 0 22px 44px -18px rgba(42, 28, 19, 0.35)',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { transform: 'scaleY(1) rotate(-1deg)', opacity: '1' },
          '50%': { transform: 'scaleY(1.08) rotate(1.5deg)', opacity: '0.92' },
        },
      },
      animation: { flicker: 'flicker 2.4s ease-in-out infinite' },
    },
  },
  plugins: [],
};
