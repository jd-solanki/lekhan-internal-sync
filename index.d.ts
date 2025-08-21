declare module '#app' {
  interface PageMeta {
    mainClass?: string /* Add class to layout's <main> element */
    isAuthRequired?: boolean /* If true, the page requires authentication */
    redirectIfLoggedIn?: boolean /* If true, the page redirects if the user is already logged in */
    isEmailVerificationRequired?: boolean /* If true, the page requires email verification */
    redirectIfEmailVerified?: boolean /* If true, the page redirects if the user has already verified their email */
    requiredQueryParamsOrRedirect?: { /* If present, the page requires these query params or redirects */
      [key: string]: {
        redirectUrl: string /* URL to redirect to if the query param is missing */
        errorMessage?: string /* Optional error message to show if the query param is missing */
        redirectOptions?: Parameters<typeof navigateTo>[1] /* Options for the middleware redirect */
      }
    }
  }
}

// It is always important to ensure you import/export something when augmenting a type
export { }
