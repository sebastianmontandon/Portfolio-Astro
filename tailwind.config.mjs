/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6fffa',
          100: '#b3f5ec',
          200: '#80ede3',
          300: '#4de4d9',
          400: '#1adbd0',
          500: '#00c2b8',
          600: '#009b93',
          700: '#00746e',
          800: '#004d49',
          900: '#002624',
        },
        dark: {
          100: '#d5d5d5',
          200: '#ababab',
          300: '#818181',
          400: '#575757',
          500: '#2d2d2d',
          600: '#242424',
          700: '#1b1b1b',
          800: '#121212',
          900: '#090909',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'text-gradient': 'text-gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'text-gradient': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};