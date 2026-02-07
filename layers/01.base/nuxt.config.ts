import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import remarkImportSnippetPlugin from './content/plugins/importSnippet'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  css: [
    join(currentDir, './app/assets/css/transitions.css'),
  ],
  content: {
    build: {
      markdown: {
        remarkPlugins: {
          // Because Nuxt Content loads plugins dynamically we need to pass absolute path
          [join(currentDir, './content/plugins/importSnippet.ts')]: {
            instance: remarkImportSnippetPlugin,
          },
        },
      },
    },
  },
})
