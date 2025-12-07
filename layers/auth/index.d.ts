declare module '#app' {
  interface PageMeta {
    isAdminOnly?: boolean /* If true, the page is only accessible to admin users */
    isAuthRequired?: boolean /* If true, the page requires authentication */
    redirectIfSignedIn?: boolean /* If true, the page redirects if the user is already logged in */
    isEmailVerificationRequired?: boolean /* If true, the page requires email verification */
    redirectIfEmailVerified?: boolean /* If true, the page redirects if the user has already verified their email */
  }
}
