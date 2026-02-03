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
        [K in 'security' | 'events' | 'alerts' | 'system']: {
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
        accountSettingsLinkedAccounts: string
        billing: string
        signUp: string
        support: string
      }
      pageMetaDefaults: {
        isEmailVerificationRequired: boolean
      }
    }
    shared: SharedPublicRuntimeConfig
  }

  /*
    INFO: We've separated SharedPublicRuntimeConfig so that other layers can extend it easily

    For example, payments layer extends it to add `polarCheckoutForAuthenticatedUsersOnly` flag

    Note that due to the limitation of typescript even though we've extended SharedPublicRuntimeConfig in payments layer
    we have to define it in root `nuxt.config.ts` instead of `layers/payments/nuxt.config.ts` to avoid missing property error
  */
  interface SharedPublicRuntimeConfig {
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

// It is always important to ensure you import/export something when augmenting a type
export { }
