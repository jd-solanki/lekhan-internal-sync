import type { PageMeta } from '#app'
import type { NuxtPage } from 'nuxt/schema'
import { defineNuxtModule } from 'nuxt/kit'

export interface ModuleOptions {
  defaults?: Partial<PageMeta>
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'page-meta-defaults',
    configKey: 'pageMetaDefaults',
  },
  defaults: {
    defaults: {},
  },
  setup(options, nuxt) {
    // If no defaults provided, do nothing
    if (!options.defaults || Object.keys(options.defaults).length === 0) {
      return
    }

    nuxt.hook('pages:resolved', (pages) => {
      function setPageMetaDefaults(page: NuxtPage) {
        page.meta ||= {}
        for (const [key, value] of Object.entries(options.defaults || {})) {
          page.meta[key] = page.meta[key] ?? value
        }
      }

      function processPages(pages: NuxtPage[]) {
        for (const page of pages) {
          setPageMetaDefaults(page)

          if (page.children) {
            processPages(page.children)
          }
        }
      }

      processPages(pages)
    })
  },
})
