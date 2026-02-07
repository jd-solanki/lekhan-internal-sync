import type { DocsCollectionItem } from '@nuxt/content'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('sitemap:sources', async (ctx) => {
    const legalDocs: DocsCollectionItem[] = await queryCollection(ctx.event, 'legal').select('path').all()

    // Collect all paths
    const legal_docs_urls = legalDocs.map(doc => doc.path).filter(path => !!path)

    ctx.sources.push({
      context: {
        name: 'legal:urls',
        description: 'Legal pages',
      },
      urls: legal_docs_urls,
      sourceType: 'app',
    })
  })
})
