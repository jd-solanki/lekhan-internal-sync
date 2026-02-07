export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore()

  // Initialize user session
  await userStore.init()

  if (userStore.user) {
    // Redirect to home page if already logged in
    return navigateTo(userStore.userHomeRoute)
  }
})
