import { authClient } from '~/libs/auth'

export default defineNuxtRouteMiddleware(async (to, _) => {
  const runtimeConfig = useRuntimeConfig()

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

  let { data: session } = await authClient.getSession()
  if (import.meta.server) {
    // Dynamic import of auth to avoid compilation & env issues
    const { auth } = await import('~~/server/libs/auth')
    const event = useRequestEvent()!

    session = await auth.api.getSession({
      headers: event.headers,
    })
  }

  if (to.meta.isAuthRequired) {
    if (session.user) {
      // Check if email verification is required
      if (to.meta.isEmailVerificationRequired && !session.user.emailVerified) {
        // Redirect to email verification page if email is not verified
        return navigateTo(runtimeConfig.public.app.routes.verifyEmail)
      }

      // Check if redirectIfEmailVerified is set
      if (to.meta.redirectIfEmailVerified && session.user.emailVerified) {
        // Redirect to home page
        return navigateTo(runtimeConfig.public.app.routes.home)
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

  if (to.meta.redirectIfLoggedIn) {
    if (session.user) {
      // Redirect to home page if already logged in
      return navigateTo(runtimeConfig.public.app.routes.home)
    }
  }
})
