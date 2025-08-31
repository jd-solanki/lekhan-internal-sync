export default defineNuxtRouteMiddleware((to) => {
  const runtimeConfig = useRuntimeConfig()

  // Set default values for route meta properties
  if (to.meta) {
    to.meta.isAdminOnly = to.meta.isAdminOnly ?? false
    to.meta.isAuthRequired = to.meta.isAuthRequired ?? true
    to.meta.redirectIfSignedIn = to.meta.redirectIfSignedIn ?? false

    /*
    Based on runtime configuration of `isEmailVerificationRequiredForAccess`,
    set the default value for `isEmailVerificationRequired` in route meta.

    If `isEmailVerificationRequiredForAccess` is true, then `isEmailVerificationRequired` will also be true by default.
    If `isEmailVerificationRequiredForAccess` is false, then `isEmailVerificationRequired` will also be false by default.
    */
    to.meta.isEmailVerificationRequired = to.meta.isEmailVerificationRequired ?? runtimeConfig.public.shared.isEmailVerificationRequiredForAccess
  }
})
