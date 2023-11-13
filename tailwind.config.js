/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'Inter var,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
        'montserrat': ['Montserrat', 'sans-serif'],
        'poppins': 'Poppins, sans-serif',
        'roboto': 'Roboto, sans-serif'
      },
      screens: {
        'xs': '300px',
        '3xl': '2000px',
      },
      colors: {
        bkg: 'rgb(var(--color-bkg) / <alpha-value>)',
        content: 'rgb(var(--color-content) / <alpha-value>)',
        accent: {
          1: 'hsl(var(--color-accent1) / <alpha-value>)',
          2: 'hsl(var(--color-accent2) / <alpha-value>)'
        }
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
  darkMode: 'class'
}