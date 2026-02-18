// Skip bundling prosemirror packages to avoid duplicate instance errors with TipTap/UEditor
export default defineNuxtConfig({
  vite: {
    optimizeDeps: {
      include: [
        'prosemirror-state',
        'prosemirror-transform',
        'prosemirror-model',
        'prosemirror-view',
        'prosemirror-gapcursor',
      ],
    },
  },
})
