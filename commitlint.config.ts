import type { UserConfig } from '@commitlint/types'

const config = {
  extends: ['@commitlint/config-conventional'],
  // This function returns true if the message should be ignored
  ignores: [message => message.includes('Merge ') || message.includes('Revert ')],
} satisfies UserConfig

export default config
