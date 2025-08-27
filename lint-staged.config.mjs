/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*': 'pnpm lint',
  '*.{vue,js,jsx,ts,tsx}': () => 'pnpm typecheck',
}
