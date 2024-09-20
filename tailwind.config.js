/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.js',
  ],
  theme: {
    extend: {
      boxShadow: {
        'main': '0px 9px 9.2px 0px rgba(0,0,0,0.4)'
      }
    },
  },
  plugins: [],
}

