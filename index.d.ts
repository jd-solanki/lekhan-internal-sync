import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'
import type { SocialProviderId } from './layers/auth/server/libs/auth'

declare module '#app' {
  interface PageMeta {
    mainClass?: string /* Add class to layout's <main> element */
    search?: false | { /* Configure route appearance in command palette. Set to false to exclude from search */
      label?: string /* Custom label for the route in command palette */
      icon?: string /* Custom icon for the route in command palette */
    }
  }
}

declare module 'nuxt/schema' {
  interface AppConfigInput {
    layout?: {
      default?: {
        navigationFooterItems?: NavigationMenuItem[]
        themePreferences?: DropdownMenuItem[]
      }
    }
  }

  interface RuntimeConfig {
    mail: {
      adminEmails: string[]
      senders: {
        [K in 'security' | 'alerts' | 'system']: {
          email: string
          name: string
        }
      }
    }
  }

  interface PublicRuntimeConfig {
    app: {
      name: string
      domain?: string
      baseUrl: string
      polarDashboardUrl: string
      routes: {
        adminHome: string
        home: string
        signIn: string
        verifyEmail: string
        billing: string
      }
      pageMetaDefaults: {
        isAdminOnly: boolean
        isAuthRequired: boolean
        redirectIfSignedIn: boolean
        isEmailVerificationRequired: boolean
      }
    }
    shared: {
      aws: {
        s3: {
          bucketName: string
          region: string
        }
      }
      auth: {
        socialProviders: {
          id: SocialProviderId
          name: string
          icon: string
          iconClass?: string
        }[]
      }
      isEmailVerificationRequiredForAccess: boolean
    }
  }
}

// It is always important to ensure you import/export something when augmenting a type
export { }
