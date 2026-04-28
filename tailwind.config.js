/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      colors: {
        void:   '#04060f',
        frost:  '#00D4FF',
        ember:  '#8B5CF6',
        mint:   '#2DD4BF',
        danger: '#ff2050',
        warn:   '#f59e0b',
      },
    },
  },
  plugins: [],
}
