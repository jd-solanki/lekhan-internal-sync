import { defineCollection, defineContentConfig } from '@nuxt/content'
import * as z from 'zod'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
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
  },
})
