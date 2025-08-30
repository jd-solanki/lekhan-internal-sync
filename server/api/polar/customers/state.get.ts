export default defineAuthenticatedEventHandler(async (event) => {
  return getPolarCustomerState(event.context.user.id)
})
