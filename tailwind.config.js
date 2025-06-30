/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./App.tsx",
  "./src/**/*.{js,jsx,ts,tsx}", // Adicione esta linha
  "./components/**/*.{js,jsx,ts,tsx}",
],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}