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
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        appear: "appear 1s ease-in-out",
        pulseAppear: "appear 1s ease-in-out, pulse 2s infinite",
      },
    },
  },
};
