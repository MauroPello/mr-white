import { companyLogo, companySEODescription, companySEOTitle, companyUrl } from "./constants/company";
import robotsConfig from "./robots.config";
import viewportConfig from "./viewport.config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/sitemap',
    "@nuxt/image",
    "@nuxtjs/robots",
    ["nuxt-viewport", viewportConfig],
    '@nuxt/ui',
    "@nuxt/eslint",
    "@nuxtjs/color-mode",
  ],
  components: ["~/components"],
  robots: robotsConfig,
  image: {
    dir: "assets/images",
  },
  site: {
    name: companySEOTitle,
    url: companyUrl,
    description: companySEODescription,
    logo: companyLogo,
  },
  colorMode: {
    preference: "light",
    fallback: "light",
  },
  sitemap: {
    credits: false,
  },
  sourcemap: {
    client: "hidden",
  },
  css: ["~/assets/css/tailwind.css", "~/assets/css/main.scss"],
  postcss: {
    plugins: {
      "tailwindcss/nesting": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  tailwindcss: {
    viewer: false,
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "it",
      },
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
        },
      ],
    },
  },
})