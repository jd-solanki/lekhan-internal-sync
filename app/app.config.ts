export default defineAppConfig({
  app: {
    logoUrl: '/logo.svg',
    logoClass: 'dark:invert',
  },
  layout: {
    default: {
      navigationItems: [
        {
          label: 'Dashboard',
          to: '/app',
          icon: 'lucide:home',
        },
        {
          label: 'Playground',
          to: '/app/playground',
          icon: 'lucide:gamepad-2',
        },
        {
          label: 'Billing',
          to: '/app/billing',
          icon: 'lucide:credit-card',
        },
        {
          label: 'Customer Portal',
          icon: 'i-lucide-store',
          to: '/polar/customer-portal',
          target: '_blank',
        },
      ],
      adminNavigationItems: [
        {
          label: 'Users',
          to: '/admin/users',
          icon: 'i-lucide-users',
        },
      ],
      navigationFooterItems: [
        {
          label: 'Feedback',
          icon: 'i-lucide-message-square',
          // Nuxt: Doesn't support importing components in appConfig due to nitro
          // Issue: https://github.com/nuxt/nuxt/issues/33109
          // onClick: () => useOverlay().create(FeedbackForm).open(),
        },
        {
          label: 'Docs',
          // to: '/docs',
          icon: 'i-lucide-book',
          target: '_blank',
        },
        {
          label: 'Support',
          // to: '/support',
          icon: 'i-lucide-life-buoy',
          target: '_blank',
        },
      ],
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
        header: '!py-0',
        body: '!py-0',
        footer: '!py-0',
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
})
