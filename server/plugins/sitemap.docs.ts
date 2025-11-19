import type { DocsCollectionItem } from '@nuxt/content'

// TODO: Is it possible to auto register this to sitemap from layers/docs?
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('sitemap:sources', async (ctx) => {
    const docs: DocsCollectionItem[] = await queryCollection(ctx.event, 'docs').select('path').all()

    // Collect all doc paths
    const docs_urls = docs.map(doc => doc.path).filter(path => !!path)

    // Push as a sitemap source
    ctx.sources.push({
      context: {
        name: 'docs:urls',
        description: 'Documentation pages',
      },
      urls: docs_urls,
      sourceType: 'app',
    })
  })
})
