export default defineNuxtRouteMiddleware(async (to, _) => {
  const runtimeConfig = useRuntimeConfig()
  const userStore = useUserStore()
  const paymentStore = usePaymentsStore()

  // Initialize user session & fetch payment customer state
  await userStore.init()
  await paymentStore.init()

  if (userStore.user) {
    // Check if email verification is required
    if (to.meta.isEmailVerificationRequired && !userStore.user.emailVerified) {
      // Redirect to email verification page if email is not verified
      return navigateTo(runtimeConfig.public.app.routes.verifyEmail)
    }

    // Check if redirectIfEmailVerified is set
    if (to.meta.redirectIfEmailVerified && userStore.user.emailVerified) {
      // Redirect to home page
      return navigateTo(userStore.userHomeRoute)
    }
  }
  else {
    // Redirect to sign in page if not logged in
    let redirectUrl = runtimeConfig.public.app.routes.signIn
    if (to.fullPath !== userStore.userHomeRoute) {
      redirectUrl += `?redirectUrl=${encodeURIComponent(to.fullPath)}`
    }
    return navigateTo(redirectUrl)
  }
})
