import type { NavigationMenuItem } from '@nuxt/ui'
import appConfig from '../app.config'

export const navigationItems: NavigationMenuItem[] = [
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
]

export const adminNavigationItems: NavigationMenuItem[] = [
  {
    label: 'Users',
    to: '/admin/users',
    icon: 'i-lucide-users',
  },
  {
    label: 'Orders',
    to: '/admin/orders',
    icon: 'i-lucide-shopping-bag',
  },
]

export const navigationFooterItems: NavigationMenuItem[] = [
  // {
  //   label: 'Feedback',
  //   icon: 'i-lucide-message-square',
  //   // Nuxt: Doesn't support importing components in appConfig due to nitro
  //   // Issue: https://github.com/nuxt/nuxt/issues/33109
  //   // onClick: () => useOverlay().create(FeedbackForm).open(),
  // },
  {
    label: 'Documentation',
    to: '/docs',
    icon: 'i-lucide-book',
    target: '_blank',
  },
  {
    label: 'Support',
    to: appConfig.socials.discord,
    icon: 'i-lucide-life-buoy',
    target: '_blank',
  },
]
