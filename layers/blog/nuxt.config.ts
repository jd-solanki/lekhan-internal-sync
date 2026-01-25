export default defineNuxtConfig({
  routeRules: {
    '/blog/**': { prerender: true },
  },
})
