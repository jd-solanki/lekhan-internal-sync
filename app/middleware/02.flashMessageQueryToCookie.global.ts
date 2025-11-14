export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.server)
    return

  // TODO(@copilot): Add support for aliases of info & success messages like error message alias
  // Issue URL: https://github.com/LaunchDayOne/LaunchDayOne/issues/77
  const { flashMessageErrorQueryAlias } = to.meta as { flashMessageErrorQueryAlias?: string }

  const successMessage = getFirstQueryValue('flash_message__success', { route: to })
  const infoMessage = getFirstQueryValue('flash_message__info', { route: to })
  let errorMessage = getFirstQueryValue('flash_message__error', { route: to })

  if (!errorMessage && flashMessageErrorQueryAlias) {
    errorMessage = getFirstQueryValue(flashMessageErrorQueryAlias, { route: to })
  }

  if (!successMessage && !infoMessage && !errorMessage)
    return

  if (successMessage)
    useCookie('flash_message__success').value = successMessage

  if (infoMessage)
    useCookie('flash_message__info').value = infoMessage

  if (errorMessage)
    useCookie('flash_message__error').value = errorMessage

  // Remove above three queries params and redirect
  if (successMessage || infoMessage || errorMessage) {
    const { flash_message__success, flash_message__info, flash_message__error, error, ...newQuery } = to.query

    // Also remove custom error query alias if present
    if (flashMessageErrorQueryAlias) {
      delete newQuery[flashMessageErrorQueryAlias]
    }

    return navigateTo({ ...to, query: newQuery }, { replace: true })
  }
})
