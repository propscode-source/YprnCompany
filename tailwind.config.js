/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        // Background color - dark navy
        dark: {
          DEFAULT: '#020C1B',
          50: '#0A1929',
          100: '#0D2137',
          200: '#112A45',
          300: '#1A3A5C',
          400: '#234B73',
          500: '#2C5C8A',
        },
        // Primary color - neon green
        primary: {
          DEFAULT: '#00FFA3',
          50: '#E6FFF5',
          100: '#B3FFE0',
          200: '#80FFCC',
          300: '#4DFFB8',
          400: '#1AFFA3',
          500: '#00FFA3',
          600: '#00E692',
          700: '#00CC82',
          800: '#00B371',
          900: '#008055',
        },
        // Secondary color - cyan/blue glow
        secondary: {
          DEFAULT: '#00D4FF',
          50: '#E6FAFF',
          100: '#B3F0FF',
          200: '#80E6FF',
          300: '#4DDBFF',
          400: '#1AD1FF',
          500: '#00D4FF',
          600: '#00BFE6',
          700: '#00AACC',
          800: '#0095B3',
          900: '#006B80',
        },
        // Text colors
        text: {
          heading: '#FFFFFF',
          body: '#8892B0',
          muted: '#5A6785',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00FFA3, 0 0 10px #00FFA3, 0 0 15px #00FFA3' },
          '100%': { boxShadow: '0 0 10px #00FFA3, 0 0 20px #00FFA3, 0 0 30px #00FFA3' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(0, 255, 163, 0.3)',
        'glow-secondary': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-primary-lg': '0 0 40px rgba(0, 255, 163, 0.4)',
        'glow-secondary-lg': '0 0 40px rgba(0, 212, 255, 0.4)',
      },
    },
  },
  plugins: [],
}
