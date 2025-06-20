/** @type {import('tailwindcss').Config} */
// tailwind.config.cjs
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ubuntu: ['Ubuntu', 'sans-serif'],
      },
      colors: {
        primary: '#FF5722',
        dark: '#000000',
        light: '#FFFFFF',
      },
    },
  },
  plugins: [],
}