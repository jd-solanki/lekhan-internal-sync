import type { InternalApi } from 'nitropack/types'

interface PlaceholderOrder {
  productId?: number
  status?: string
}

export const usePaymentsStore = defineStore('payments', () => {
  const userStore = useUserStore()
  const { infoToast, successToast } = useToastMessage()
  const runtimeConfig = useRuntimeConfig()

  // Fetch from DB
  const products = ref<InternalApi['/api/polar/products']['get']['products']>([])
  const orders = ref<PlaceholderOrder[]>([])
  const subscriptions = ref<InternalApi['/api/polar/subscriptions']['get']['subscriptions']>([])

  // One time
  const oneTimeProducts = computed(() => products.value.filter(product => !product.isRecurring))
  const oneTimePurchases = computed(() => {
    const oneTimeIds = new Set(oneTimeProducts.value.map(product => product.id))
    return orders.value.filter(order => order.productId
      && oneTimeIds.has(order.productId)
      && order.status === 'paid')
  })

  // Subscription/Recurring
  const recurringProducts = computed(() => products.value.filter(product => product.isRecurring))
  const activeSubscription = computed(() => subscriptions.value.find(subscription => subscription.status === 'active' || subscription.status === 'trialing'))
  // Identify soft-canceled subscriptions that can be resumed.
  const isSubscriptionPendingCancel = computed(() => activeSubscription.value?.cancelAtPeriodEnd === true)

  // Fetch Data
  const fetchProducts = async () => {
    // As this will be called on init (on SSR) we've to forward cookies
    const headers = useRequestHeaders(['cookie'])

    const { products: _products = [] } = await $fetch('/api/polar/products', { headers })
    products.value = _products
    return _products
  }

  const fetchSubscriptions = async () => {
    // As this will be called on init (on SSR) we've to forward cookies
    const headers = useRequestHeaders(['cookie'])

    const { subscriptions: _subscriptions = [] } = await $fetch('/api/polar/subscriptions', {
      query: {
        page: 1,
        size: 100,
      },
      headers,
    })
    subscriptions.value = _subscriptions
    return _subscriptions
  }

  const fetchOrders = async () => {
    // As this will be called on init (on SSR) we've to forward cookies
    const headers = useRequestHeaders(['cookie'])

    const { orders: _orders = [] } = await $fetch('/api/polar/orders', {
      query: {
        page: 1,
        size: 100,
      },
      headers,
    })
    orders.value = _orders
    return _orders
  }

  const refreshSubscriptionsAndOrders = async () => {
    await Promise.all([
      fetchSubscriptions(),
      fetchOrders(),
    ])
  }

  const syncOrderByCheckoutIdWithPolar = async (checkoutId: string) => {
    // Fetch latest order from Polar so UI can unlock features immediately.
    const response = await $fetch('/api/polar/orders/sync', {
      method: 'POST',
      body: {
        checkoutId,
      },
    })

    // Refresh orders in store to reflect latest data
    await fetchOrders()

    return response
  }

  const syncSubscriptionByPolarSubscriptionIdWithPolar = async (polarSubscriptionId: string) => {
    // Pull latest subscription from Polar to avoid waiting for webhooks.
    const response = await $fetch('/api/polar/subscriptions/sync', {
      method: 'POST',
      body: {
        polarSubscriptionId,
      },
    })

    // Refresh subscriptions in store to reflect latest data
    await fetchSubscriptions()

    return response
  }

  const hasActiveSubscription = (productIds: number[]) => {
    if (!productIds.length) {
      return false
    }

    const idSet = new Set(productIds)
    return subscriptions.value.some(subscription => idSet.has(subscription.productId)
      && (subscription.status === 'active' || subscription.status === 'trialing'))
  }

  const hasPurchasedOneTimeProduct = (productIds: number[]) => {
    if (!productIds.length) {
      return false
    }

    // Check both one time purchases and active subscriptions

    const idSet = new Set(productIds)
    return oneTimePurchases.value.some(order => order.productId && idSet.has(order.productId))
  }

  const hasPurchasedProduct = (productIds: number[]) => {
    // Check both one time purchases and active subscriptions
    return hasPurchasedOneTimeProduct(productIds) || hasActiveSubscription(productIds)
  }

  const getPolarProductId = (productId: number) => {
    const product = products.value.find(p => p.id === productId)
    return product ? product.polarId : null
  }

  // NOTE: We've to call init() on app start
  async function init() {
    await Promise.all([
      fetchProducts(),
      // Only fetch subscriptions and orders if user is authenticated
      ...(userStore.user
        ? [
            fetchSubscriptions(),
            fetchOrders(),
          ]
        : []),
    ])
  }

  const buyProduct = async (productId: number, options?: { refetchOrdersAndSubscriptions: boolean }) => {
    const { refetchOrdersAndSubscriptions = true } = options || {}

    // Check if user is authenticated as only authenticated users can create checkout sessions
    if (!userStore.user) {
      infoToast({
        title: 'Sign in required for purchase',
      })
      await navigateTo(`${runtimeConfig.public.app.routes.signIn}?nextAction=checkout&productId=${productId}`)
    }

    // Only refetch orders and subscriptions if needed
    if (refetchOrdersAndSubscriptions) {
      await refreshSubscriptionsAndOrders()
    }

    // Verify if user is not purchasing already owned product
    if (hasPurchasedProduct([productId])) {
      // Navigate to billing page if already purchased
      await navigateTo(runtimeConfig.public.app.routes.billing, { replace: true })
      infoToast({
        title: 'You have already purchased this product',
        description: 'Redirected to billing page',
      })
    }

    // Get polar product id or throw
    const polarProductId = getPolarProductId(productId)
    if (!polarProductId) {
      throw createError({ status: 404, message: `Product with id=${productId} not found` })
    }

    await authClient.checkout({
      products: [polarProductId],
    })
  }

  const changePlan = async (productId: number, isDowngrade: boolean) => {
    const subscription = activeSubscription.value
    if (!subscription) {
      throw createError({ status: 400, message: 'No active subscription' })
    }

    const polarProductId = getPolarProductId(productId)
    if (!polarProductId) {
      throw createError({ status: 404, message: `Product with id=${productId} not found` })
    }

    const executeChangePlan = async () => {
      const updatedPolarSubscription = await $fetch<{ id: string }>(`/api/polar/subscriptions/${subscription.polarId}`, {
        method: 'PATCH',
        body: {
          productId: polarProductId,
          prorationBehavior: 'invoice',
        },
      })

      // Sync immediately so the UI reflects new entitlements without refresh
      await syncSubscriptionByPolarSubscriptionIdWithPolar(updatedPolarSubscription.id)

      successToast({
        title: 'Plan updated',
        description: 'Your plan has been refreshed with the latest data.',
      })
    }

    if (isDowngrade) {
      const { confirm } = useConfirm({
        title: 'Downgrade Plan?',
        body: 'Your plan will be downgraded. You may lose access to some features at the end of the current billing period.',
        confirmBtnProps: {
          label: 'Downgrade',
          color: 'warning',
        },
        onConfirm: executeChangePlan,
      })

      await confirm()
      return
    }

    await executeChangePlan()
  }

  const resumeSubscription = async () => {
    const subscription = activeSubscription.value
    if (!subscription) {
      throw createError({ status: 400, message: 'No active subscription' })
    }

    // Uncancel subscription that is scheduled to end.
    const updatedPolarSubscription = await $fetch<{ id: string }>(`/api/polar/subscriptions/${subscription.polarId}`, {
      method: 'PATCH',
      body: {
        cancelAtPeriodEnd: false,
      },
    })

    // Sync immediately so the UI reflects latest status.
    await syncSubscriptionByPolarSubscriptionIdWithPolar(updatedPolarSubscription.id)

    successToast({
      title: 'Subscription resumed',
      description: 'Your subscription will continue after the current period.',
    })
  }

  return {
    init,
    fetchProducts,
    fetchSubscriptions,
    fetchOrders,
    refreshSubscriptionsAndOrders,
    syncOrderByCheckoutIdWithPolar,
    syncSubscriptionByPolarSubscriptionIdWithPolar,
    buyProduct,
    changePlan,
    hasPurchasedProduct,
    hasActiveSubscription,
    resumeSubscription,

    products,
    orders,
    subscriptions,
    oneTimeProducts,
    recurringProducts,
    oneTimePurchases,
    activeSubscription,
    isSubscriptionPendingCancel,
  }
})
