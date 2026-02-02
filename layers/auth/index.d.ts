declare module '#app' {
  interface PageMeta {
    isEmailVerificationRequired?: boolean /* If true, the page requires email verification */
    redirectIfEmailVerified?: boolean /* If true, the page redirects if the user has already verified their email */
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {}
