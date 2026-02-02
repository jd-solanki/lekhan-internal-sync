declare module 'nuxt/schema' {
  interface SharedPublicRuntimeConfig {
    polarCheckoutForAuthenticatedUsersOnly: boolean
  }
}

// It is always important to ensure you import/export something when augmenting a type
export { }
