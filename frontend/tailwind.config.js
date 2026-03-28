/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          green: '#1a5632',
          light: '#2d7a4c',
          olive: '#6b705c',
          brown: '#cb997e',
          offwhite: '#f7ede2',
          dark: '#333333',
        }
      },
      fontFamily: {
        sans: ['"Noto Sans"', 'sans-serif'],
      },
      spacing: {
        'touch': '48px',
      },
      borderRadius: {
        'agri': '12px',
        'round': '24px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
