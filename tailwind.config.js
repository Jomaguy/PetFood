/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2E5E4E',
        primaryGreen: '#2E5E4E',
        primaryGreenLight: '#4A7862',
        primaryGreenDark: '#1A3C32',
        primaryBrown: '#fae5d3',
        primaryBrownLight: '#fdf2e9',
        primaryBrownDark: '#f5cba7',
      },
    },
  },
  plugins: [],
}; 