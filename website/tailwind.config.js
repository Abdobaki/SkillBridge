/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1e3a5f',    // الأزرق الغامق تاع التطبيق
          primary: '#10b981', // الأخضر الزمردي
          bg: '#f8fafc',      // لون الخلفية
          surface: '#ffffff', // لون البطاقات
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}