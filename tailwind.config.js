/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./composables/**/*.ts",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      width: {
        136: "34rem",
        150: "37.5rem",
        188: "47rem",
      },
      fontSize: {
        "2xs": "0.625rem",
        "1.5xl": ["1.35rem", { lineHeight: "1.75rem" }],
      },
      height: {
        136: "34rem",
        150: "37.5rem",
        188: "47rem",
        225: "56.25rem",
        screen: ["100vh", "100dvh"],
      },
      minWidth: {
        12: "3rem",
        24: "6rem",
        32: "8rem",
        96: "24rem",
        "1/6": "16.666667%",
        "1/5": "20%",
        "1/4": "25%",
        "1/3": "33.333333%",
        "2/3": "66%",
      },
      minHeight: {
        10: "2.5rem",
        12: "3rem",
        32: "8rem",
        96: "24rem",
        screen: ["100vh", "100dvh"],
      },
      maxWidth: {
        12: "3rem",
        32: "8rem",
        48: "12rem",
        "2/5": "40%",
        "1/2": "50%",
        "1/4": "25%",
      },
      maxHeight: {
        188: "47rem",
      },
      opacity: {
        6: "0.06",
      },
      spacing: {
        112: "30rem",
        128: "36rem",
        196: "48rem",
      },
      padding: {
        225: "56.25rem",
      },
      screens: {
        // should correspond to the `nuxt-viewport` breakpoints
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1600px",
        "4xl": "1920px",
        "5xl": "2400px",
      },
      flex: {
        2: "2 2 0%",
        3: "3 3 0%",
      },
      keyframes: {
        appear: {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
      },
      animation: {
        appear: "appear 0.5s ease-out",
        pulseAppear: "appear 1s ease-in-out, pulse 2s infinite",
        float: "float 3s ease-in-out infinite",
      },
      colors: {
        woodsmoke: {
          '50': '#f6f6f6',
          '100': '#e7e7e7',
          '200': '#d1d1d1',
          '300': '#b0b0b0',
          '400': '#888888',
          '500': '#6d6d6d',
          '600': '#5d5d5d',
          '700': '#4f4f4f',
          '800': '#454545',
          '900': '#3d3d3d',
          '950': '#181818',
        },
        brandy: {
          '50': '#faf7f2',
          '100': '#f4ece0',
          '200': '#e7d8c1',
          '300': '#dcc4a3',
          '400': '#c89d6f',
          '500': '#bc8553',
          '600': '#ae7248',
          '700': '#915b3d',
          '800': '#754a37',
          '900': '#5f3e2f',
          '950': '#331f17',
        },
      }
    },
  },
};
