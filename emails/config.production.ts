import type { Config } from '@maizzle/framework'
import { defu } from 'defu'

// @ts-expect-error We're importing .ts files
import baseConfig from './config.ts'

/*
|-------------------------------------------------------------------------------
| Production config                       https://maizzle.com/docs/environments
|-------------------------------------------------------------------------------
|
| This is the production configuration that Maizzle will use when you run the
| `npm run build` command. Settings here will be merged on top of the base
| `config.js`, so you only need to add the options that are changing.
|
*/

export default defu(baseConfig, {
  build: {
    content: ['emails/**/*.html'],
    output: {
      path: 'emails/dist',
      extension: 'html',
      from: 'emails/templates/*.html',
    },
  },
  css: {
    // inline: true,
    // purge: true,
    purge: {
      removeHTMLComments: true,
      uglify: true,
    },
    shorthand: true,
  },
  prettify: true,
} satisfies Config)
