export default ({
  imports: {
    dirs: [
      'shared/schemas/**', // Shared schemas
    ],
  },
  nitro: {
    imports: {
      dirs: [
        'shared/schemas/**/*', // Shared schemas
        'server/utils/**/*', // Server utils
      ],
    },
  },
})
