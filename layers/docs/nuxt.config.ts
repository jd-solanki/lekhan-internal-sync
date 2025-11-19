export default defineNuxtConfig({
  modules: ['@nuxt/ui', 'nuxt-llms', '@nuxt/content'],
  routeRules: {
    '/docs/**': { prerender: true },
  },
})
