export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/content'],
  routeRules: {
    '/docs/**': { prerender: true },
  },
})
