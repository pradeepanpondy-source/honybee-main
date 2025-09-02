/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        honeybee: {
          primary: '#E9B824', // Golden honey
          secondary: '#2D2B29', // Dark charcoal
          accent: '#F0A04B', // Warm amber
          background: '#FFFBF2', // Cream white
          dark: '#5F4B32', // Rich brown
          'dark-brown': '#3C2A21',
          light: '#FFF8E6', // Light cream
        },
      cream: '#FFFBF2',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'drip': 'drip 4s ease-in-out infinite',
        'wave': 'wave 8s ease-in-out infinite',
      },
      keyframes: {
        drip: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(15px)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
