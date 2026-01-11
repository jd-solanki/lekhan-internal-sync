export default defineNuxtRouteMiddleware(async (to, _) => {
  // SECTION Validation
  if (!Array.isArray(to.meta.middleware)) {
    throw new TypeError('Admin middleware requires auth middleware to be applied first.')
  }

  const privateIndex = to.meta.middleware.indexOf('private')
  const adminIndex = to.meta.middleware.indexOf('admin')

  if (privateIndex === -1 || adminIndex === -1 || privateIndex >= adminIndex) {
    throw new Error('Private middleware must exist before admin middleware in the middleware array.')
  }
  // !SECTION

  const userStore = useUserStore()

  // At this point, user is authenticated (private middleware passed)
  // Now check if user is admin
  if (userStore.user?.role !== 'admin') {
    // User is not admin, abort navigation with 403 error
    return abortNavigation(createError({ statusCode: 403, statusMessage: 'Forbidden' }))
  }
})
