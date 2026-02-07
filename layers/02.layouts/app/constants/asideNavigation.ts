import type { NavigationMenuItem } from '@nuxt/ui'

export const navigationItems: NavigationMenuItem[] = [
  {
    label: 'Home',
    to: '/app',
    icon: 'lucide:home',
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
  {
    label: 'Polar Dashboard',
    onClick: () => window.open(useRuntimeConfig().public.app.polarDashboardUrl, '_blank'),
    icon: 'i-lucide-circle-dollar-sign',
    target: '_blank',
  },
]

export const navigationFooterItems: NavigationMenuItem[] = [
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
