/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        'fontProjects': ['Cuprum', 'Inter', 'Coda']
      },
      colors: {
        'inputColor': '#00CC66'
      }
    },
  },
  plugins: [],
}

