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
        // New Design Palette (Stitch)
        stitch: {
          'surface-container-low': '#f5f4ec',
          'outline-variant': '#d3c5ac',
          'on-secondary-fixed': '#2c160e',
          'tertiary-fixed': '#e9e2d0',
          'on-surface-variant': '#4f4633',
          'surface-container-high': '#eae8e0',
          'surface-container-highest': '#e4e3db',
          'tertiary-fixed-dim': '#ccc6b4',
          'primary-fixed': '#ffdf9a',
          'on-tertiary-fixed-variant': '#4a4739',
          'error': '#ba1a1a',
          'primary-fixed-dim': '#f7be1d',
          'on-secondary-fixed-variant': '#5d4037',
          'on-surface': '#1b1c17',
          'surface-container-lowest': '#ffffff',
          'on-primary-container': '#604700',
          'on-error': '#ffffff',
          'on-primary-fixed-variant': '#5a4300',
          'on-primary-fixed': '#251a00',
          'on-secondary-container': '#795950',
          'outline': '#817660',
          'secondary-container': '#fed3c7',
          'surface-dim': '#dcdad2',
          'surface-bright': '#fbf9f1',
          'secondary-fixed-dim': '#e7bdb1',
          'inverse-surface': '#30312c',
          'primary-container': '#eab308',
          'secondary': '#77574d',
          'on-tertiary-fixed': '#1e1c10',
          'inverse-primary': '#f7be1d',
          'tertiary': '#625e50',
          'surface-variant': '#e4e3db',
          'inverse-on-surface': '#f3f1e9',
          'primary': '#785a00',
          'surface-container': '#f0eee6',
          'secondary-fixed': '#ffdbd0',
          'on-primary': '#ffffff',
          'on-secondary': '#ffffff',
          'on-error-container': '#93000a',
          'surface': '#fbf9f1',
          'on-tertiary': '#ffffff',
          'error-container': '#ffdad6',
          'background': '#fbf9f1',
          'on-background': '#1b1c17',
          'on-tertiary-container': '#4e4b3d',
          'tertiary-container': '#c1bbaa',
          'surface-tint': '#785a00'
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        headline: ['Noto Serif', 'serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        label: ['Plus Jakarta Sans', 'sans-serif'],
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
