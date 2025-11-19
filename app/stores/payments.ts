import type { InternalApi } from 'nitropack/types'

export const usePaymentsStore = defineStore('payments', () => {
  const userStore = useUserStore()
  const { infoToast } = useToastMessage()
  const runtimeConfig = useRuntimeConfig()

  const customerState = ref<InternalApi['/api/polar/customers/state']['get'] | undefined>(undefined)

  // INFO: We don't have any requirement to refetch the customer state but exposing this function
  // in case we need to refresh the state in future without reloading the app
  const refreshCustomerState = async () => {
    const { data } = await useFetch('/api/polar/customers/state')
    customerState.value = data.value
  }

  /*
    This function initializes the user session by fetching it from the authClient
    With this, our nuxt app won't re-fetch the user session on client side
    // NOTE: We've to call init() on app start
  */
  async function init() {
    await refreshCustomerState()
  }

  async function createCheckoutSession(productId: string) {
    // Check if user is authenticated as only authenticated users can create checkout sessions
    if (!userStore.user) {
      infoToast({
        title: 'Sign in required for purchase',
      })
      await navigateTo(`${runtimeConfig.public.app.routes.signIn}?nextAction=checkout&productId=${productId}`)
    }

    await authClient.checkout({
      products: [productId],
    })
  }

  return {
    init,
    refreshCustomerState,
    createCheckoutSession,

    customerState,
  }
})
