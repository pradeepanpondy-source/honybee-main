/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        honeybee: {
          primary: '#FFD700', // Gold
          secondary: '#000000', // Black
          accent: '#FFA500', // Orange
          background: '#FFFACD', // Light yellow
          dark: '#8B4513', // Brown
          light: '#FFFFE0', // Very light yellow
        },
      },
    },
  },
  plugins: [],
};
