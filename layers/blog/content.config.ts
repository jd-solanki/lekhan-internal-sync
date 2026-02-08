import { defineCollection, defineContentConfig } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'
import * as z from 'zod'

export default defineContentConfig({
  collections: {
    blog: defineCollection(
      /*
        adds the robots frontmatter key to the collection
        Nuxt SEO Docs: https://nuxtseo.com/docs/sitemap/guides/content
      */
      asSitemapCollection({
        type: 'page',
        source: {
          include: 'blog/**',
        },
        // Define custom schema for docs collection
        schema: z.object({
          title: z.string(),
          description: z.string(),
          image: z.string(),
          date: z.coerce.date(),
          category: z.enum(['Release', 'Tutorial', 'Announcement', 'Article']).default('Article'),
        }),
      }),
    ),
  },
})
