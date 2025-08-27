import type { UserConfig } from '@commitlint/types'

const config = {
  extends: ['@commitlint/config-conventional'],
  /* Docs: https://commitlint.js.org/reference/rules-configuration.html */
  rules: {
    'subject-case': [
      2, /* 0 => disable rule, 1 => warning & 2 => error */
      'always',
      ['lower-case'],
    ],
  },
} satisfies UserConfig

export default config
