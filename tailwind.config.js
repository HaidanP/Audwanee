/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Crimson Text', 'Georgia', 'serif'],
        'display': ['Cormorant Garamond', 'Libre Baskerville', 'serif'],
        'elegant': ['Libre Baskerville', 'Georgia', 'serif'],
        'logo': ['Playfair Display SC', 'Abril Fatface', 'serif'],
      },
    },
  },
  plugins: [],
};
