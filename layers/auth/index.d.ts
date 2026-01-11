declare module '#app' {
  interface PageMeta {
    isEmailVerificationRequired?: boolean /* If true, the page requires email verification */
    redirectIfEmailVerified?: boolean /* If true, the page redirects if the user has already verified their email */
  }
}
