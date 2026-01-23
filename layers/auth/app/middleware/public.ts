export default defineNuxtRouteMiddleware(async () => {
  const paymentStore = usePaymentsStore()

  // Fetch payment data on public pages as well
  // This is because you will should buy now button on public pages like landing pages, docs, etc
  await paymentStore.init()
})
