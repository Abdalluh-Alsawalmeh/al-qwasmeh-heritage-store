/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ivory: '#F8F4EC',
          cream: '#EEE5D8',
          burgundy: '#6D1F32',
          red: '#9E2639',
          olive: '#596247',
          charcoal: '#25221F',
          gold: '#B59A67',
        }
      },
      fontFamily: {
        arabic: ['"IBM Plex Sans Arabic"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      }
    },
  },
  plugins: [],
}