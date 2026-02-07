import type { DocsCollectionItem } from '@nuxt/content'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('sitemap:sources', async (ctx) => {
    const blogDocs: DocsCollectionItem[] = await queryCollection(ctx.event, 'blog').select('path').all()

    // Collect all paths
    const blog_docs_urls = blogDocs.map(doc => doc.path).filter(path => !!path)

    ctx.sources.push({
      context: {
        name: 'blog:urls',
        description: 'Blog pages',
      },
      urls: blog_docs_urls,
      sourceType: 'app',
    })
  })
})
