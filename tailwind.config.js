/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#1E2761",
          navyDark: "#161D4A",
          teal: "#0D9488",
          tealDark: "#0B7A70",
          tealLight: "#5EEAD4",
          amber: "#F5A623",
        },
      },
    },
  },
  plugins: [],
};
