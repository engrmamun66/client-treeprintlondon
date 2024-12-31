// // https://nuxt.com/docs/api/configuration/nuxt-config
// export default defineNuxtConfig({
//   compatibilityDate: '2024-11-01',
//   devtools: { enabled: true }
// })

// https://nuxt.com/docs/api/configuration/nuxt-config

const THEME = process.env?.THEME || "default";

export default defineNuxtConfig({
  dir: {
    public: `public`,
    middleware: `middlewares`,
    pages: `themes/${THEME}/pages`,
    assets: `themes/${THEME}/assets`,
    layouts: `themes/${THEME}/layouts`,
    static: `themes/${THEME}/static`,
  },

  components: {
    dirs: [`components`],
  },

  modules: [
    "@pinia/nuxt",

    "@nuxtjs/sitemap",
  ],

  // site: {
  //   url: process.env?.SEO_PUBLIC_SITE_URL,
  //   trailingSlash: !!process.env?.SEO_USE_TRAILING_SLASH,
  //   name: process.env?.SEO_SITE_NAME,
  //   description: process.env?.SEO_SITE_DESCRIPTION,
  //   // defaultLocale: process.env?.LOCAL || "en", // not needed if you have @nuxtjs/i18n installed
  // },

  build: {
    transpile: ["@googlemaps/js-api-loader"],
  },

  sourcemap: {
    server: false,
    client: false,
  },

  runtimeConfig: {
    public: { ...process.env }, //process.env
  },

  app: {
    keepalive: false,
    pageTransition: { name: "page", mode: "out-in" },
    // layoutTransition: { name: "layout", mode: "out-in" },
  },

  debug: false,

  vite: {
    build: {
      chunkSizeWarningLimit: 2400,
    },
  },

  // show:: in-place-store.md
  ignore: ["**.store.js", "**.store.ts"],

  nitro: {
    /* https://nitro.unjs.io/config#output */
    output: {
      dir: process.env?.BUILD_OUTPUT_DIRECTORY || ".output",
    },
    prerender: {
      crawlLinks: true,
      routes: ["/sitemap.xml"],
      ignore: ["/", "/inventory", "/vms", "/login", "/settings", "/rental"],
    },
  },

  // sitemap: {
  //   sources: ["/api/sitemap"],
  // },

  devtools: { enabled: true },
  compatibilityDate: "2024-10-21",
});