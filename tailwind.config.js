/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5CF6',
          dark: '#6D28D9',
          light: '#C4B5FD',
        },
        accent: '#7DA777',
        tertiary: '#A7777D',
        background: '#F5F5F5',
        surface: '#FFFFFF',
        'surface-variant': '#FAFAFA',
        'on-surface': '#212121',
        'on-surface-variant': '#757575',
        error: '#FF5757',
      },
    },
  },
  plugins: [],
}

