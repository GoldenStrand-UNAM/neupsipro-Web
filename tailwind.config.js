/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./Front/src/**/*.{html,js}", "./Front/public/views/**/*.html", "./Front/views/**/*.ejs",],
  theme: {
    extend: {
      fontFamily:{
        sans: ['Roboto'],
      },
    },
  },
  plugins: [],
}