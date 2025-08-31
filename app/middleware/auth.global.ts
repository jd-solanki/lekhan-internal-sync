export default defineNuxtRouteMiddleware(async (to, _) => {
  const nuxtApp = useNuxtApp()
  const runtimeConfig = useRuntimeConfig()
  const userStore = useUserStore()

  // If it's 404 page, don't perform any authentication checks
  if (!to.matched.length) {
    return
  }

  // Initialize user session on server & initial load
  // This will only fetch session once
  if ((import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) || import.meta.server) {
    await userStore.init()
  }

  // Check if the route requires any specific query parameters
  // If missing, redirect to the specified URL
  if (to.meta.requiredQueryParamsOrRedirect) {
    const missingParams = Object.entries(to.meta.requiredQueryParamsOrRedirect).filter(([key, _]) => {
      return !getFirstQueryValue(key, { route: to })
    })

    if (missingParams.length > 0) {
      // Redirect to the specified URL for the first missing parameter
      const [_, { redirectUrl, errorMessage, redirectOptions }] = missingParams[0]!

      // Set error cookie if errorMessage present
      if (errorMessage) {
        useCookie('flash_message__error').value = errorMessage
      }

      return navigateTo(redirectUrl, redirectOptions)
    }
  }

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
        return navigateTo(runtimeConfig.public.app.routes.home)
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
      if (to.fullPath !== runtimeConfig.public.app.routes.home) { // Don't add query param for root path
        redirectUrl += `?redirectUrl=${encodeURIComponent(to.fullPath)}`
      }
      return navigateTo(redirectUrl)
    }
  }

  if (to.meta.redirectIfSignedIn) {
    if (userStore.user) {
      // Redirect to home page if already logged in
      return navigateTo(runtimeConfig.public.app.routes.home)
    }
  }
})
