export default defineNuxtRouteMiddleware(async (to, _) => {
  const runtimeConfig = useRuntimeConfig()
  const userStore = useUserStore()
  const paymentStore = usePaymentsStore()

  // If it's 404 page, don't perform any authentication checks
  if (!to.matched.length) {
    return
  }

  await callOnce(async () => {
    // Perf: Wait for both init in parallel
    await Promise.all([
      userStore.init(),
      paymentStore.init(),
    ])
  })

  if (to.meta.isAuthRequired) {
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

      // Check if route is admin only
      if (to.meta.isAdminOnly && userStore.user.role !== 'admin') {
        // Redirect to 403 page if user is not admin
        return navigateTo('/auth/forbidden')
      }
    }
    else {
      // Redirect to sign in page if not logged in
      let redirectUrl = runtimeConfig.public.app.routes.signIn
      if (to.fullPath !== userStore.userHomeRoute) { // Don't add query param for root path
        redirectUrl += `?redirectUrl=${encodeURIComponent(to.fullPath)}`
      }
      return navigateTo(redirectUrl)
    }
  }

  if (to.meta.redirectIfSignedIn) {
    if (userStore.user) {
      // Redirect to home page if already logged in
      return navigateTo(userStore.userHomeRoute)
    }
  }
})
