export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore()
  const paymentStore = usePaymentsStore()

  // Fetch user & payment data on public pages as well
  // This is because we will show buy now button on public pages like landing pages, docs, etc
  // We need to initialize userStore as well because paymentStore depend on userStore data (E.g. user signed in or not)
  await userStore.init()
  await paymentStore.init()
})
