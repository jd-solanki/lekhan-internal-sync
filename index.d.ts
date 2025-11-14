import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'
import type { SocialProviderId } from './server/libs/auth'

declare module '#app' {
  interface PageMeta {
    mainClass?: string /* Add class to layout's <main> element */
    isAdminOnly?: boolean /* If true, the page is only accessible to admin users */
    isAuthRequired?: boolean /* If true, the page requires authentication */
    redirectIfSignedIn?: boolean /* If true, the page redirects if the user is already logged in */
    isEmailVerificationRequired?: boolean /* If true, the page requires email verification */
    redirectIfEmailVerified?: boolean /* If true, the page redirects if the user has already verified their email */
    requiredQueryParamsOrRedirect?: { /* If present, the page requires these query params or redirects */
      [key: string]: {
        redirectUrl: string /* URL to redirect to if the query param is missing */
        errorMessage?: string /* Optional error message to show if the query param is missing */
        redirectOptions?: Parameters<typeof navigateTo>[1] /* Options for the middleware redirect */
      }
    }
  }
}

declare module 'nuxt/schema' {
  interface AppConfigInput {
    layout?: {
      default?: {
        navigationItems?: NavigationMenuItem[]
        adminNavigationItems?: NavigationMenuItem[]
        navigationFooterItems?: NavigationMenuItem[]
        themePreferences?: DropdownMenuItem[]
      }
    }
  }

  interface SocialProvider {
    id: SocialProviderId
    name: string
    icon: string
    iconClass?: string
  }

  interface RuntimeConfig {
    mail: {
      adminEmails: string[]
      from: {
        email: string
        name: string
      }
    }
  }

  interface PublicRuntimeConfig {
    app: {
      name: string
      domain?: string
      baseUrl: string
      routes: {
        home: string
        signIn: string
        verifyEmail: string
        billing: string
      }
    }
    shared: {
      auth: {
        socialProviders: SocialProvider[]
      }
      isEmailVerificationRequiredForAccess: boolean
    }
  }
}

// It is always important to ensure you import/export something when augmenting a type
export { }
