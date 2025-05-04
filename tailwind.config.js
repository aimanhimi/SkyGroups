/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'sky-blue': {
          50: '#e6f2ff',
          100: '#cce5ff',
          200: '#99cbff',
          300: '#66b0ff',
          400: '#3396ff',
          500: '#0770e3', // Primary blue
          600: '#0057b3',
          700: '#004080',
          800: '#002a53',
          900: '#001527',
        },
        'sky-green': {
          50: '#e6fffc',
          100: '#ccfff9',
          200: '#99fff2',
          300: '#66ffec',
          400: '#33ffe5',
          500: '#00a698', // Accent green
          600: '#008073',
          700: '#005a53',
          800: '#003d39',
          900: '#001f1c',
        },
        'sky-gray': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        'sky-warn': '#ff9500',
        'sky-error': '#ff3b30',
        'sky-success': '#34c759',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 20px rgba(0, 0, 0, 0.12)',
        'button': '0 1px 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};