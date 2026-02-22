export default defineAppConfig({
  themePreferences: [
    {
      label: 'System',
      icon: 'i-lucide-monitor',
      onSelect: () => useColorMode().preference = 'system',
    },
    {
      label: 'Light',
      icon: 'i-lucide-sun',
      onSelect: () => useColorMode().preference = 'light',
    },
    {
      label: 'Dark',
      icon: 'i-lucide-moon',
      onSelect: () => useColorMode().preference = 'dark',
    },
  ],
  ui: {
    card: {
      slots: {
        root: 'py-4 sm:*:py-6 divide-none gap-6 flex flex-col',
        header: 'py-0!',
        body: 'py-0!',
        footer: 'py-0!',
      },
    },
    table: {
      slots: {
        thead: 'text-nowrap',
      },
    },
    dropdownMenu: {
      slots: {
        // Set content width to trigger width for consistency & better UX
        content: 'min-w-(--reka-dropdown-menu-trigger-width)',
      },
    },
  },
})
