/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        honeybee: {
          primary: '#FFD700', // Bright golden yellow
          secondary: '#1a1a1a', // Deep black for contrast
          accent: '#FF6B35', // Vibrant coral orange
          background: '#FFFFFF', // Pure white for brightness
          dark: '#2D3748', // Modern dark gray
          'dark-brown': '#4A5568', // Medium gray
          light: '#FEFCF3', // Warm light cream
          'bright-yellow': '#FFE55C', // Bright yellow accent
          'vibrant-orange': '#FF8C42', // Vibrant orange
          'sunny-yellow': '#FFD23F', // Sunny yellow
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
