/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*': stagedFiles => `pnpm lint ${stagedFiles.join(' ')}`,
  '*.{vue,js,jsx,ts,tsx}': () => 'pnpm typecheck',
}
