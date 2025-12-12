import type { SocialProviderId } from './layers/auth/server/libs/auth'
import { exhaustive } from './layers/01.base/shared/utils/types'
import env from './server/libs/env'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  routeRules: {
    '/docs/': { redirect: '/docs/getting-started/introduction' },
    '/admin/**': { robots: false },
    '/app/**': { robots: false },
    '/polar/customer-portal': { robots: false },
    '/polar/success': { robots: false },
  },
  app: {
    // pageTransition: { name: 'page-transition-zoom-fade', mode: 'out-in' },
    head: {
      bodyAttrs: {
        // Add banner height CSS variable if app/global or impersonating banner is visible
        class: 'has-[>div>_.banner]:[--app-banner-height:48px]',
      },
      title: env.NUXT_PUBLIC_APP_NAME,
      titleTemplate: `%s | ${env.NUXT_PUBLIC_APP_NAME}`,
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', media: '(prefers-color-scheme: light)', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/x-icon', media: '(prefers-color-scheme: dark)', href: '/favicon-light.ico' },

        // Apple Devices Icons
        { rel: 'apple-touch-icon', href: '/favicon.ico', sizes: '180x180', media: '(prefers-color-scheme: light)' },
        { rel: 'apple-touch-icon', href: '/favicon-light.ico', sizes: '180x180', media: '(prefers-color-scheme: dark)' },
      ],
    },
  },
  // Docs: https://nuxtseo.com/docs/site-config/guides/setting-site-config
  site: {
    url: env.NUXT_PUBLIC_APP_BASE_URL,
    name: env.NUXT_PUBLIC_APP_NAME,
    env: env.NODE_ENV,
  },
  seo: {
    meta: {
      description: 'Production ready Nuxt.js SaaS boilerplate to launch your SaaS app faster.',
      themeColor: [
        { content: '#fff', media: '(prefers-color-scheme: dark)' },
        { content: '#000', media: '(prefers-color-scheme: light)' },
      ],
      colorScheme: 'dark light',
    },
  },
  runtimeConfig: {
    // INFO: Private config will be server only so no need to separate in app, server & shared

    mail: {
      // NOTE: We shouldn't make adminEmails public as it may contain personal information.
      // Add admin emails here to receive notifications about unexpected errors
      adminEmails: env.ADMIN_EMAILS,

      // INFO: Update `index.d.ts` if you change sender types or add new ones
      senders: {
        // For high-trust, security-related emails (password resets, email verification, 2FA codes)
        security: {
          email: process.env.NODE_ENV === 'development'
            ? 'security@example.com'
            : `security@app.${env.NUXT_PUBLIC_APP_DOMAIN}`,
          name: `${env.NUXT_PUBLIC_APP_NAME} Security`,
        },
        // For important system or user-initiated alerts (account deactivation, billing failures)
        alerts: {
          email: process.env.NODE_ENV === 'development'
            ? 'alerts@example.com'
            : `alerts@app.${env.NUXT_PUBLIC_APP_DOMAIN}`,
          name: env.NUXT_PUBLIC_APP_NAME,
        },
        // For internal system notifications sent to admins (runtime errors, crash reports)
        system: {
          email: process.env.NODE_ENV === 'development'
            ? 'system-alerts@example.com'
            : `system-alerts@app.${env.NUXT_PUBLIC_APP_DOMAIN}`,
          name: `${env.NUXT_PUBLIC_APP_NAME} [System Alert]`,
        },
      },
    },

    // INFO: Types are defined in `index.d.ts`
    public: {
      // Server Config
      server: {
        apiBaseUrl: env.NUXT_PUBLIC_API_BASE_URL,
      },

      // App Config
      app: {
        name: env.NUXT_PUBLIC_APP_NAME,
        domain: env.NUXT_PUBLIC_APP_DOMAIN,
        baseUrl: env.NUXT_PUBLIC_APP_BASE_URL,
        polarDashboardUrl: env.POLAR_DASHBOARD_URL,
        // NOTE: Ensure these are according to your app/pages directory
        routes: {
          home: '/app',
          adminHome: '/admin/users',
          signIn: '/auth/sign-in',
          verifyEmail: '/auth/verify-email',
          billing: '/app/billing',
        },
        /*
        Default values for route meta properties.
        Based on runtime configuration of `isEmailVerificationRequiredForAccess`,
        set the default value for `isEmailVerificationRequired` in route meta.

        If `isEmailVerificationRequiredForAccess` is true, then `isEmailVerificationRequired` will also be true by default.
        If `isEmailVerificationRequiredForAccess` is false, then `isEmailVerificationRequired` will also be false by default.
        */
        routeMetaDefaults: {
          isAdminOnly: false,
          isAuthRequired: true,
          redirectIfSignedIn: false,
          isEmailVerificationRequired: env.NUXT_PUBLIC_IS_EMAIL_VERIFICATION_REQUIRED_FOR_ACCESS,
        },
      },

      // Shared across server & app
      shared: {
        aws: {
          s3: {
            bucketName: env.APP_AWS_BUCKET_NAME,
            region: env.APP_AWS_REGION,
          },
        },

        // Auth Config
        auth: {
          socialProviders: exhaustive<SocialProviderId>()([
            {
              id: 'google',
              name: 'Google',
              icon: 'i-logos-google-icon',
            },
            {
              id: 'github',
              name: 'GitHub',
              icon: 'i-logos-github-icon',
              iconClass: 'dark:invert',
            },
          ]),
        },
        /**
         * Determines if email verification is required for a user to access protected parts of the app.
         * This is controlled by the `NUXT_EMAIL_VERIFICATION_IS_REQUIRED_FOR_ACCESS` environment variable.
         * It defaults to `true` (verification is mandatory) for safety in production.
         * Set to `false` in your `.env` for local development to bypass the verification check.
         */
        isEmailVerificationRequiredForAccess: env.NUXT_PUBLIC_IS_EMAIL_VERIFICATION_REQUIRED_FOR_ACCESS,
      },
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    'nuxt-llms',
    '@pinia/nuxt',
    'nuxt-email-renderer',
    '@nuxt/content',
    '@nuxtjs/seo',
    '@nuxt/hints',
  ],
  features: {
    devLogs: true,
  },
  experimental: {
    cookieStore: true,
    typedPages: true,
    checkOutdatedBuildInterval: 1000 * 60, // Check every minute
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  imports: {
    dirs: [
      // Shared schemas of app & layers
      '../shared/schemas/**',
      '../layers/*/shared/schemas/**',

      // INFO: We added this because nuxt was not auto importing stores from layers
      '../layers/*/app/stores/*.ts',
    ],
  },
  nitro: {
    imports: {
      dirs: [
        'server/db/index',

        // Utils of app & layers
        'server/utils/**/*',
        'layers/*/server/utils/**/*',

        // Shared schemas of app & layers
        'shared/schemas/**/*',
        'layers/*/shared/schemas/**/*',
      ],
    },
    storage: {
      file: {
        driver: 's3',
        accessKeyId: env.APP_AWS_ACCESS_KEY,
        secretAccessKey: env.APP_AWS_SECRET_KEY,
        endpoint: env.APP_AWS_ENDPOINT,
        bucket: env.APP_AWS_BUCKET_NAME,
        region: env.APP_AWS_REGION,
      },
    },
    devStorage: {
      file: {
        driver: 'fs',
        // NOTE: Sync it with `shared/utils/file.ts`'s `genImgUrlFromKey`
        base: 'public/.tmp/',
      },
    },
  },
  // INFO: Production-only settings
  $production: {
    // Only configure netlify image provider in production because in dev we serve from local filesystem
    image: {
      // INFO: Project is hosted on Netlify and we have to configure remote domains hence this config is needed
      //   If you're deploying elsewhere, adjust accordingly
      provider: 'netlify',
      // Let netlify handle images from other domains like S3 bucket, Google Images, etc
      domains: [
        `${env.APP_AWS_BUCKET_NAME}.s3.${env.APP_AWS_REGION}.amazonaws.com`,
        'lh3.googleusercontent.com', // Google profile pics [Google Social Sign In]
        'avatars.githubusercontent.com', // GitHub profile pics [GitHub Social Sign In]
        // ...any other remote domains you use
      ],
    },
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'dracula',
          },
        },
      },
    },
  },
  llms: {
    domain: env.NUXT_PUBLIC_APP_BASE_URL,
    title: env.NUXT_PUBLIC_APP_NAME,
    description: `Documentation for ${env.NUXT_PUBLIC_APP_NAME}`,
    full: {
      title: `${env.NUXT_PUBLIC_APP_NAME} Full Documentation`,
      description: `Comprehensive documentation of ${env.NUXT_PUBLIC_APP_NAME}`,
    },
  },
})
