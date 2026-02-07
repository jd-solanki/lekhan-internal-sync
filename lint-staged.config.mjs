/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{js,mjs,cjs,ts,mts,cts,vue,json,jsonc,yaml,yml,toml,md,mdx}': 'eslint --fix',
  // '*.{vue,js,jsx,ts,tsx}': () => 'pnpm typecheck', // Disabled due to several vue-tsc issues with nuxt layers
}
