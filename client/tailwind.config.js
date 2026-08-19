/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde047',
          300: '#facc15',
          400: '#eab308',
          500: '#f59e0b', // Core Electric Gold
          600: '#d97706',
          700: '#b45309',
          800: '#78350f',
          900: '#451a03',
        },
        dark: {
          base: '#0B0F17',
          card: '#131B2E',
          hover: '#1E293B',
          border: '#1F293D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
