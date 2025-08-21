export async function showFlashMessageFromCookie() {
  // If this runs of server, it suppresses the error toast
  if (import.meta.server)
    return

  const { errorToast, infoToast, successToast } = useToastMessage()

  const errorCookie = useCookie('flash_message__error')
  const infoCookie = useCookie('flash_message__info')
  const successCookie = useCookie('flash_message__success')

  const error = errorCookie.value
  errorCookie.value = undefined // Clear the cookie after reading it

  const info = infoCookie.value
  infoCookie.value = undefined // Clear the cookie after reading it

  const success = successCookie.value
  successCookie.value = undefined // Clear the cookie after reading it

  if (!error && !info && !success)
    return

  onMounted(() => {
    if (error) {
      errorToast({
        title: 'Error',
        description: error ?? undefined,
      })
    }

    if (info) {
      infoToast({
        title: 'Info',
        description: info ?? undefined,
      })
    }

    if (success) {
      successToast({
        title: 'Success',
        description: success ?? undefined,
      })
    }
  })
}
