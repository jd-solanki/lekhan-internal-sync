import type { NuxtPage } from 'nuxt/schema'

export function addMiddlewareToPage(page: NuxtPage, middlewareName: string) {
  page.meta ||= {}

  if (!page.meta.middleware) {
    page.meta.middleware = [middlewareName]
  }
  else if (Array.isArray(page.meta.middleware)) {
    if (!page.meta.middleware.includes(middlewareName)) {
      page.meta.middleware.push(middlewareName)
    }
  }
  else if (typeof page.meta.middleware === 'string') {
    if (page.meta.middleware !== middlewareName) {
      page.meta.middleware = [page.meta.middleware, middlewareName]
    }
  }
}
