export default defineNuxtConfig({
  routeRules: {
    '/docs/**': { prerender: true },
  },
})
