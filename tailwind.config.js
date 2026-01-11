/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'funnel': ['Funnel Display', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
