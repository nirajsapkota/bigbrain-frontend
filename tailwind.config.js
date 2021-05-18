module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        roman: '#EA5B57',
        christalle: '#2F0865'
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      margin: {
        '-1/2': '-50%',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
