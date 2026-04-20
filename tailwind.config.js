/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#112031',
        mist: '#f5f7fb',
        tide: '#d9e3f0',
        lagoon: '#0f766e',
        coral: '#ff7a59',
        slate: '#314158',
      },
      boxShadow: {
        panel: '0 24px 60px -28px rgba(17, 32, 49, 0.35)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(17, 32, 49, 0.08) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
}
