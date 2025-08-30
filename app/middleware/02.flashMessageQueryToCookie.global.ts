export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.server)
    return

  const successMessage = getFirstQueryValue('flash_message__success', { route: to })
  const infoMessage = getFirstQueryValue('flash_message__info', { route: to })
  const errorMessage = getFirstQueryValue('flash_message__error', { route: to })

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
    const { flash_message__success, flash_message__info, flash_message__error, ...newQuery } = to.query
    return navigateTo({ ...to, query: newQuery }, { replace: true })
  }
})
