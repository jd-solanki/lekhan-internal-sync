// @ts-check
import antfu from '@antfu/eslint-config'
import pluginCasePolice from 'eslint-plugin-case-police'
import harlanzw from 'eslint-plugin-harlanzw'
import regexPlugin from 'eslint-plugin-regex'
import { createJiti } from 'jiti'
import withNuxt from './.nuxt/eslint.config.mjs'

// INFO: We're planning to create separate package for custom rules in future.
const jiti = createJiti(import.meta.url)
const { rules } = jiti('./eslint/index.ts')

export default withNuxt(
  // Global ignores - applies to all configurations
  {
    ignores: [
      './server/db/migrations/**/*',
      // This is downloaded from remote source, we don't want to lint it.
      './.ai/rules/nuxt-ui.instructions.md',
    ],
  },
  antfu({
    vue: {
      overrides: {
        'vue/max-attributes-per-line': 'error',
      },
    },
    typescript: true,
    stylistic: {},

    // Disable md linting
    markdown: false,
  }),
  {
    plugins: {
      'local': { rules },
      'case-police': pluginCasePolice,
      'regex': regexPlugin,
      harlanzw,
    },
    rules: {
      // Local rules
      'local/no-statuscode-in-create-error': 'error',
      'local/no-statusmessage-in-create-error': 'error',
      'local/db-table-naming': 'error',
      'local/db-zod-schema-naming': 'error',
      'local/db-type-naming': 'error',

      'case-police/string-check': 'warn',

      // Import rules
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: [
              '**/shared/schemas/db',
              '**/shared/schemas/db/**',
            ],
            message: 'Database table schemas & its types are auto imported, do not import them manually.',
          },
          {
            group: [
              '*server/db/schemas/tables',
              '*server/db/schemas/tables/**',
              '**/server/db/schemas/tables',
              '**/server/db/schemas/tables/**',
            ],
            message: 'Database tables are auto imported, do not import them manually.',
          },
        ],
      }],

      'harlanzw/link-ascii-only': 'error',
      'harlanzw/link-lowercase': 'error',
      'harlanzw/link-no-double-slashes': 'error',
      'harlanzw/link-no-whitespace': 'error',
      'harlanzw/nuxt-await-navigate-to': 'error',
      'harlanzw/nuxt-no-redundant-import-meta': 'error',
      'harlanzw/nuxt-no-side-effects-in-async-data-handler': 'error',
      'harlanzw/nuxt-no-side-effects-in-setup': 'error',
      'harlanzw/nuxt-prefer-navigate-to-over-router-push-replace': 'error',
      'harlanzw/nuxt-prefer-nuxt-link-over-router-link': 'error',
      // 'harlanzw/vue-no-faux-composables': 'error', /* This isn't working accurately due to auto-imports */
      'harlanzw/vue-no-nested-reactivity': 'error',
      'harlanzw/vue-no-passing-refs-as-props': 'error',
      'harlanzw/vue-no-reactive-destructuring': 'error',
      'harlanzw/vue-no-ref-access-in-templates': 'error',
      'harlanzw/vue-no-torefs-on-props': 'error',
      'regex/invalid': [
        // NOTE: Regex rules are quickest way to add restrictions project-wide
        // without needing to write custom rules or TS code.
        // These should be used sparingly, as they can be brittle and cause false positives.
        // INFO: We'll migrate these rules to AST based custom rules after couple of releases.
        'error',
        [
          {
            regex: 'useUserSession\\(\\)',
            message: 'Prefer `useUserStore()` instead of `useUserSession()`',
            files: { ignore: 'stores\\/user\.ts' },
          },
          {
            regex: 'router\.(push|replace)\((.*)\)',
            message: 'Prefer `navigateTo()` instead of `router.replace()` or `router.push()`',
          },
          {
            regex: 'authClient\.(signOut)\(\)',
            message: 'Prefer `userStore.signOut()` instead of `authClient.signOut()`',
          },
          {
            regex: 'db.transaction\\(async ',
            message: 'Prefer <entity>_crud over manual db import & initiating transaction.',
          },
          {
            regex: '</NuxtLink>',
            message: 'Prefer <ULink> instead of <NuxtLink>.',
          },
          {
            regex: 'import { .*\bdb\b.* }',
            message: 'Do not directly use `db` outside crud directory.',
            files: { ignore: '.*\\/crud\\/.*' },
          },
          {
            regex: 'import env from',
            message: 'You might not want to make this module server only in shared scope',
            files: { inspect: 'shared\\/.*\\.ts' },
          },
          {
            regex: 'z\.date()',
            message: 'Use z.coerce.date() instead of z.date() for better parsing.',
          },
        ],
      ],
    },
    ignores: ['eslint.config.mjs'],
  },
).overrideRules({
  'node/prefer-global/process': ['error', 'always'],
})
