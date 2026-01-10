interface AppLogoAppConfig {
  app: {
    logo: Logo
  }
}

declare module 'nuxt/schema' {
  interface AppConfigInput extends AppLogoAppConfig {}
  interface AppConfig extends AppLogoAppConfig {}
}

declare module '#app' {
  interface PageMeta {
    requiredQueryParamsOrRedirect?: { /* If present, the page requires these query params or redirects */
      [key: string]: {
        redirectUrl: string /* URL to redirect to if the query param is missing */
        errorMessage?: string /* Optional error message to show if the query param is missing */
        redirectOptions?: Parameters<typeof navigateTo>[1] /* Options for the middleware redirect */
      }
    }
    flashMessageErrorQueryAlias?: string /* Custom query param name to use as alias for error flash messages */
    flashMessageSuccessQueryAlias?: string /* Custom query param name to use as alias for success flash messages */
    flashMessageInfoQueryAlias?: string /* Custom query param name to use as alias for info flash messages */
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {}
