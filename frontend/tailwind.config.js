/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ig-blue': '#0095f6',
        'ig-blue-hover': '#1877f2',
        'ig-blue-disabled': '#b2dffc',
        'ig-facebook': '#385185',
        'ig-primary-text': '#262626',
        'ig-secondary-text': '#737373',
        'ig-border': '#dbdbdb',
        'ig-bg': '#fafafa',
        'ig-input-bg': '#fafafa',
        'ig-red': '#ed4956',
        'ig-link': '#00376b',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        instagram: [
          'Grand Hotel',
          'cursive',
        ],
      },
      backgroundImage: {
        'ig-gradient': 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
        'ig-story-gradient': 'linear-gradient(45deg, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
      }
    },
  },
  plugins: [],
}
