import { defineCollection, defineContentConfig } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'

export default defineContentConfig({
  collections: {
    legal: defineCollection(
      /*
        adds the robots frontmatter key to the collection
        Nuxt SEO Docs: https://nuxtseo.com/docs/sitemap/guides/content
      */
      asSitemapCollection({
        type: 'page',
        source: {
          include: 'legal/**',
        },
      }),
    ),
  },
})
