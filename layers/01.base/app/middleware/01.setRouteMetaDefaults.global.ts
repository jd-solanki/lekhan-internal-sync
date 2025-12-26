export default defineNuxtRouteMiddleware((to) => {
  const runtimeConfig = useRuntimeConfig()
  const defaults = runtimeConfig.public.app.pageMetaDefaults

  if (to.meta) {
    for (const [key, value] of Object.entries(defaults)) {
      to.meta[key] = to.meta[key] ?? value
    }
  }
})
