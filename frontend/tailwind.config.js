/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pulse: {
          bg: '#0a0a0f',
          surface: '#12121a',
          border: '#1e1e2e',
          accent: '#3b82f6',
          flight: '#22d3ee',
          conflict: '#ef4444',
          earthquake: '#f59e0b',
          news: '#8b5cf6',
        },
      },
    },
  },
  plugins: [],
};
