/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./auth/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        agh1: ['Agh1', 'sans-serif'],
        agh2: ['Agh2', 'sans-serif'],
        agh3: ['Agh3', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        '32px': ['32px', { lineHeight: '40px' }],
      },
    },
  },
  plugins: [],
}
