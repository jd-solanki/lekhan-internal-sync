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

  const fetchUserOrdersForProduct = async (productId: string) => {
    if (!customerState.value?.id) {
      return null
    }

    const { data } = await useFetch('/api/polar/orders', {
      query: {
        customerId: customerState.value.id,
        productId,
      },
    })

    return data.value
  }

  const hasPurchasedProduct = async (productId: string) => {
    if (!customerState.value?.id) {
      return false
    }

    const response = await fetchUserOrdersForProduct(productId)

    if (response && response.result.items.length > 0) {
      return true
    }

    return false
  }

  const buyProduct = async (productId: string) => {
    await refreshCustomerState()
    const _hasPurchasedProduct = await hasPurchasedProduct(productId)

    if (!_hasPurchasedProduct) {
      await createCheckoutSession(productId)
    }
    else {
      // Navigate to home if already purchased
      await navigateTo(runtimeConfig.public.app.routes.billing, { replace: true })
      infoToast({
        title: 'You have already purchased this product',
        description: 'Redirected to billing page',
      })
    }
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
    buyProduct,
    refreshCustomerState,
    hasPurchasedProduct,
    fetchUserOrdersForProduct,
    createCheckoutSession,

    customerState,
  }
})
