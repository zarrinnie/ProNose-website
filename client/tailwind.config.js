/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Channel-based CSS vars so the whole brand palette re-themes per
        // prosthesis type (see index.css :root / [data-prosthesis="…"]).
        // Using "rgb(var(--x) / <alpha-value>)" keeps alpha utilities like
        // bg-brand/15 working.
        brand: {
          DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
          dark: 'rgb(var(--brand-dark) / <alpha-value>)',
          deep: 'rgb(var(--brand-deep) / <alpha-value>)',
          light: 'rgb(var(--brand-light) / <alpha-value>)',
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
