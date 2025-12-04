/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#1B4332', // Deep Forest Green
        secondary: '#F8F9FA', // Off-white
        accent: '#D8F3DC', // Pale Green
        highlight: '#40916C', // Medium Green
        text: '#2D3748', // Dark Gray for text
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
