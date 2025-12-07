export default defineAppConfig({
  ui: {
    prose: {
      accordion: {
        slots: {
          root: 'bg-muted border border-(--ui-border-muted) ps-4 pe-4 rounded-lg',
        },
      },
      pre: {
        slots: {
          base: 'whitespace-pre',
        },
      },
    },
  },
})
