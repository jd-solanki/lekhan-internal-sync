export default defineNuxtConfig({
  routeRules: {
    '/polar/customer-portal': { robots: false },
    '/polar/success': { robots: false },
  },
  imports: {
    dirs: [
      'shared/schemas/**', // Shared schemas
    ],
  },
  nitro: {
    imports: {
      dirs: [
        'shared/schemas/**/*', // Shared schemas
        'server/utils/**/*', // Server utils
      ],
    },
  },
})
