/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ikea: {
          blue: '#0058a3',
          'blue-dark': '#004f93',
          yellow: '#ffdb00',
          'yellow-dark': '#febd11',
          black: '#111111',
          gray: {
            50: '#f5f5f5',
            100: '#eeeeee',
            200: '#e5e5e5',
            300: '#cccccc',
            400: '#959595',
            500: '#767676',
            600: '#484848',
            900: '#111111',
          },
          red: '#cc0008',
          green: '#0a8a00',
        },
      },
      fontFamily: {
        sans: [
          'Noto Sans',
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      maxWidth: {
        page: '1440px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
