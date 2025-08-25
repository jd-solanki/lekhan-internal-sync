// import { authClient } from '~/libs/auth';

export const usePaymentsStore = defineStore('payments', () => {
  async function createCheckoutSession(productId: string) {
    const userStore = useUserStore()
    const { infoToast } = useToastMessage()
    const runtimeConfig = useRuntimeConfig()

    // Check if user is authenticated as only authenticated users can create checkout sessions
    if (!userStore.user) {
      infoToast({
        title: 'Sign in required for purchase',
      })
      await navigateTo(`${runtimeConfig.public.app.routes.signIn}?nextAction=checkout&productId=${productId}`)
    }

    authClient.checkout({
      products: [productId],
    })
  }

  return {
    createCheckoutSession,
  }
})
