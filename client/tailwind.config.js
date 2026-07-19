/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1FB5AC',
          dark: '#0E7C88',
          deep: '#0A5866',
          light: '#7FDCD2',
        },
        ink: '#1F2547',
        muted: '#8F9BB3',
        input: '#EFF7F8',
        pastel: {
          lavender: '#B3AEF0',
          pink: '#F79CC5',
          peach: '#F6BE79',
          blue: '#84B4F5',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 14px 30px -12px rgba(14, 124, 136, 0.45)',
        card: '0 12px 34px -18px rgba(23, 74, 89, 0.25)',
        shell: '0 40px 90px -35px rgba(31, 68, 87, 0.45)',
        phone: '0 25px 60px -15px rgba(0, 0, 0, 0.25)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
