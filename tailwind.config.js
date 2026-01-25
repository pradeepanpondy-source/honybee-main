/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        honeybee: {
          primary: '#FFB800', // Honey Gold
          'primary-dark': '#E6A500',
          secondary: '#1A1A1A', // Deep Black
          accent: '#004E89', // Sky Blue
          success: '#7CB342', // Nature Green
          background: '#FFFBF5', // Cream
          'dark-brown': '#2C1810', // Text
          light: '#FFFBF5',
        },
        cream: '#FEFCF3',
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
