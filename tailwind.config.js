/** @type {import('tailwindcss').Config} */
export default {
  content: ['./resources/**/*.edge', './resources/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      // Add custom keyframes
      keyframes: {
        scroll: {
          '100%': {
            transform: 'translateX(calc(-50% - .5rem))',
          },
        },
      },
      // Add custom animations
      animation: {
        marquee: 'scroll 20s linear infinite',
      },
    },
  },
}
