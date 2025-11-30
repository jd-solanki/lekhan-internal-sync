export default defineNuxtConfig({
  css: [
    // INFO: Can't use relative path here, must use alias
    '~~/layers/launchdayone-core/app/assets/css/main.css',
  ],
  icon: {
    customCollections: [
      {
        prefix: 'arrows',
        dir: './app/assets/icons/arrows',
      },
    ],
  },
  imports: {
    dirs: [
      'shared/schemas/**',
    ],
  },
  nitro: {
    imports: {
      dirs: [
        'shared/schemas/**/*',
        'server/utils/**/*',
      ],
    },
  },
})
