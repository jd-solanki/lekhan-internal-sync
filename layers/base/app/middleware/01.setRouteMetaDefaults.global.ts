export default defineNuxtRouteMiddleware((to) => {
  const runtimeConfig = useRuntimeConfig()
  const defaults = runtimeConfig.public.app.routeMetaDefaults

  if (to.meta) {
    for (const [key, value] of Object.entries(defaults)) {
      to.meta[key] = to.meta[key] ?? value
    }
  }
})
