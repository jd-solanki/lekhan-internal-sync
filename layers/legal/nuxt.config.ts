import env from '../launchdayone-core/shared/libs/env'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      layers: {
        legal: {
          ownerName: env.NUXT_PUBLIC_OWNER_NAME,
          contactEmail: env.NUXT_PUBLIC_CONTACT_EMAIL,
          lawCountry: 'India',
          terms: {
            lastUpdatedDate: '2025-11-20',
          },
          privacy: {
            lastUpdatedDate: '2025-11-20',
          },
        },
      },
    },
  },
})
