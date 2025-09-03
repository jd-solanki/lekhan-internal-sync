// @ts-check
import antfu from '@antfu/eslint-config'
import harlanzw from 'eslint-plugin-harlanzw'
import regexPlugin from 'eslint-plugin-regex'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Global ignores - applies to all configurations
  {
    ignores: [
      './.prompts/nuxt-ui.instructions.md',
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
  }),
  // Add regex plugin for custom rules
  {
    plugins: {
      regex: regexPlugin,
      harlanzw,
    },
    rules: {
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
      'harlanzw/vue-no-faux-composables': 'error',
      'harlanzw/vue-no-nested-reactivity': 'error',
      'harlanzw/vue-no-passing-refs-as-props': 'error',
      'harlanzw/vue-no-reactive-destructuring': 'error',
      'harlanzw/vue-no-ref-access-in-templates': 'error',
      'harlanzw/vue-no-torefs-on-props': 'error',
      'regex/invalid': [
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
            regex: 'db.transaction\\(async ',
            message: 'Prefer <entity>_crud over manual db import & initiating transaction.',
          },
          {
            regex: 'import { .*\bdb\b.* }',
            message: 'Do not directly use `db` outside crud directory.',
            files: { ignore: '.*\\/crud\\/.*' },
          },
        ],
      ],
    },
    ignores: ['eslint.config.mjs'],
  },
).overrideRules({
  'node/prefer-global/process': ['error', 'always'],
})
