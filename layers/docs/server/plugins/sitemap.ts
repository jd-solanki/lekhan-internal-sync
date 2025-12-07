import type { DocsCollectionItem } from '@nuxt/content'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('sitemap:sources', async (ctx) => {
    // Query docs collection
    const docs: DocsCollectionItem[] = await queryCollection(ctx.event, 'docs').select('path').all()

    // Collect all paths
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
