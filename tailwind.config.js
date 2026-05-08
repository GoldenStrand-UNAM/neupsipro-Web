/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./Front/src/**/*.{html,js}", "./Front/public/views/**/*.html", "./Front/views/**/*.ejs", "./front/Public/js/**/*.js"],
  theme: {
    extend: {

      fontFamily: {
        sans: ['Roboto'],
      },

      colors: {

        brand: {
          primary: '#3350A9',
        },

        status: {

          neutral: {
            bg: '#F3F4F6',
            badge: '#6B7280',
          },

          warning: {
            bg: '#FEF3C7',
            badge: '#F59E0B',
          },

          success: {
            bg: '#DCFCE7',
            badge: '#22C55E',
          },

          fatal: {
            bg: '#FEE2E2',
            badge: '#EF4444',
          },

        },

      },

    },
  },
  plugins: [],
}