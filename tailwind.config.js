/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B2E6B',
          light: '#1F6FEB',
        },
        secondary: {
          DEFAULT: '#F1C40F',
        },
        accent: {
          DEFAULT: '#1F6FEB',
        },
        slate: {
          DEFAULT: '#64748B',
        },
        success: {
          DEFAULT: '#10B981',
        },
        warning: {
          DEFAULT: '#F59E0B',
        },
        danger: {
          DEFAULT: '#F43F5E',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0B2E6B 0%, #1F6FEB 100%)',
      },
    },
  },
  plugins: [],
}
