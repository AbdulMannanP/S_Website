/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./frontend/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#c9a96e', // Royal Gold
          light: '#dcc69a',
          dim: 'rgba(201, 169, 110, 0.1)'
        },
        bronze: {
          DEFAULT: '#080809', // Deep Charcoal
          dark: '#000000'
        },
        ivory: {
          DEFAULT: '#FCFBF8', // Elegant Light Background
          darker: '#F5F2EA'
        }
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif']
      }
    },
  },
  plugins: [],
}
