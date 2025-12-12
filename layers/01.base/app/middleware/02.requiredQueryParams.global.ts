export default defineNuxtRouteMiddleware(async (to, _) => {
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
})
