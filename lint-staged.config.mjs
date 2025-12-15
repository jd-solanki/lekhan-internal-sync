/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*': stagedFiles => `eslint ${stagedFiles.join(' ')}`,
  // '*.{vue,js,jsx,ts,tsx}': () => 'pnpm typecheck', // Disabled due to several vue-tsc issues with nuxt layers
}
