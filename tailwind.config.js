/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(94.06deg, #CE1919 -1.21%, #FF5252 58.66%, #FFA3A3 116.84%)',
      },
      screens: {
        'msm': '360px',
        'xxsm': '390px',
        'xsm': '375px',
        'vsm': '393px',
        'rsm': '412px',
        'nsm': '414px',
        'small': '430px',
        'tablet': '570px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        'large': '1343px',
        '2xl': '1536px',
        'xxl': '1620px',
        'vl': '1728px',
        '3xl': '1800px',
        '4xl': '1920px',
        '5xl': '5120px',

      },
    },
  },
  plugins: [require('tailwindcss-motion')],
}