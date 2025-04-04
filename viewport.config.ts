import type { NuxtConfig } from "nuxt/schema";

/**
 * Should correspond to the tailwind screens defined in `tailwind.config.js`
 */
const breakpoints: Record<TailwindBreakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1600,
  "4xl": 1920,
  "5xl": 2400,
};

const viewportConfig = {
  breakpoints,
  defaultBreakpoints: {
    mobile: "xs",
    tablet: "md",
    desktop: "lg",
  },
  fallbackBreakpoint: "lg",
} satisfies Partial<NuxtConfig["viewport"]>;

export default viewportConfig;
