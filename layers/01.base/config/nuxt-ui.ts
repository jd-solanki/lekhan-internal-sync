export type NuxtUIConfig = Parameters<typeof defineAppConfig>[0]['ui']

export const outlineCardWOBorders: NuxtUIConfig = {
  card: {
    slots: {
      root: 'py-4 sm:*:py-6 divide-none gap-6 flex flex-col',
      header: 'py-0!',
      body: 'py-0!',
      footer: 'py-0!',
    },
  },
}
