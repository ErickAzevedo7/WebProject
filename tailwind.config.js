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
          to: {
            transform: 'translateX(calc(-50%))',
          },
        },
      },
      // Add custom animations
      animation: {
        marquee: 'scroll 40s linear infinite',
      },
    },
  },
}
