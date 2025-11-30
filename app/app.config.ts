export default defineAppConfig({
  app: {
    logoUrl: '/logo.svg',
    logoClass: 'dark:invert',
  },
  layout: {
    default: {
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
    },
  },
  ui: {
    colors: {
      primary: 'black',
      neutral: 'neutral',
    },
    card: {
      slots: {
        root: 'py-4 sm:*:py-6',
        header: 'py-0!',
        body: 'py-0!',
        footer: 'py-0!',
      },
      variants: {
        variant: {
          outline: {
            root: 'divide-none gap-6 flex flex-col',
          },
        },
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

  // Docs
  github: {
    url: 'https://github.com/LaunchDayOne/LaunchDayOne',
    branch: 'main',
  },
  socials: {
    x: 'https://x.com/me_jd_solanki',
    discord: 'https://discord.gg/xXPJRpnv',
  },
})
