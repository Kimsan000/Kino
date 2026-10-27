/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf4f4',
          100: '#fce7e7',
          500: '#e50914',
          600: '#b81d24',
          700: '#8b0000',
        },
        dark: {
          950: '#08080a',
          900: '#0e0f12',
          850: '#14161b',
          800: '#1b1d24',
          700: '#262933',
          600: '#343845',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

