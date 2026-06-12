/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        lavender: {
          50: '#FAF8FF',
          100: '#F5F0FF',
          200: '#EDE9FE',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 24px rgba(124, 58, 237, 0.12)',
        'sidebar': '2px 0 16px rgba(0,0,0,0.06)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7C3AED, #EC4899)',
        'gradient-hero': 'linear-gradient(135deg, #F5F0FF 0%, #FAF8FF 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      }
    },
  },
  plugins: [],
}
