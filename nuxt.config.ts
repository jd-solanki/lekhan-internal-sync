import type { SocialProviderId } from './layers/auth/server/libs/auth'
import { exhaustive } from './layers/01.base/shared/utils/types'
import env from './server/libs/env'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  routeRules: {
    '/admin/**': { robots: false, ssr: false },
    '/app/**': { robots: false, ssr: false },
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
        // SECTION Favicon
        // Single Color Scheme favicon
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },

        // Light/Dark Color Scheme favicon
        // { rel: 'icon', type: 'image/x-icon', media: '(prefers-color-scheme: light)', href: '/favicon.ico' },
        // { rel: 'icon', type: 'image/x-icon', media: '(prefers-color-scheme: dark)', href: '/favicon-dark.ico' },
        // !SECTION

        // SECTION Apple Devices Icons
        // Single Color Scheme favicon
        { rel: 'apple-touch-icon', href: '/favicon.ico' },

        // Single Color Apple Devices Icons
        // { rel: 'apple-touch-icon', href: '/favicon.ico', sizes: '180x180', media: '(prefers-color-scheme: light)' },
        // { rel: 'apple-touch-icon', href: '/favicon-light.ico', sizes: '180x180', media: '(prefers-color-scheme: dark)' },
        // !SECTION
      ],
    },
  },
  /*
    Most of the time your sitemap only changes when you deploy a new version of your app
    This reduces ~50kb from the server bundle and improves performance by generating sitemap at build time instead of runtime
    Refer to when to use section: https://nuxtseo.com/docs/sitemap/guides/zero-runtime#when-to-use

    Docs: https://nuxtseo.com/docs/sitemap/guides/zero-runtime
  */
  sitemap: {
    zeroRuntime: true,
  },
  // Docs: https://nuxtseo.com/docs/site-config/guides/setting-site-config
  site: {
    // Disable indexing of the site by search engines but keep OG tags for better link previews when shared on social media
    indexable: false,

    url: env.NUXT_PUBLIC_APP_BASE_URL,
    name: env.NUXT_PUBLIC_APP_NAME,
    env: env.NODE_ENV,
  },
  seo: {
    meta: {
      description: 'Simple & Elegant note taking app.',
      // INFO: It's recommended to update these colors to match your brand identity
      themeColor: [
        // Light/Dark Color Scheme (From https://nuxt.com/design-kit)
        { content: '#020420', media: '(prefers-color-scheme: dark)' },
        { content: '#fff', media: '(prefers-color-scheme: light)' },
      ],
      colorScheme: 'dark light',
    },
  },
  runtimeConfig: {
    cronSecret: env.CRON_SECRET,
    webhook: {
      polar: {
        secretKey: env.POLAR_WEBHOOK_SECRET,
      },
    },
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
        // For informational, non-critical account activity
        events: {
          email: process.env.NODE_ENV === 'development'
            ? 'events@example.com'
            : `events@app.${env.NUXT_PUBLIC_APP_DOMAIN}`,
          name: env.NUXT_PUBLIC_APP_NAME,
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
      server: {},

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
          accountSettingsLinkedAccounts: '/app/account-settings/linked-accounts',
          billing: '/app/billing',

          // When magic link auth is enabled instead of email, sign up page will be /auth/sign-in and that page will render magic link form
          signUp: '/auth/sign-up',
          /*
            Most of the time support page is at "/support"

            You can also set this to discord or some other support channel link if you don't have dedicated support page

            TIP: You can search where it's being used by searching `routes.support` in the project
          */
          support: '/support',
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

        // Payments Layer Config
        polarCheckoutForAuthenticatedUsersOnly: env.POLAR_CHECKOUT_FOR_AUTHENTICATED_USERS_ONLY,
      },
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/test-utils/module',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    'nuxt-llms',
    '@pinia/nuxt',
    'nuxt-email-renderer',
    '@nuxt/content',
    // '@nuxt/hints', // INFO: Disabled until it reaches stable release
    '@nuxtjs/seo',
    'nuxt-webhook-validators',
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
      // // DB Tables of app & layers (exclude index.ts using glob pattern)
      // '../server/db/schemas/tables/!(index).ts',
      // '../layers/*/server/db/schemas/tables/!(index).ts',

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
        'server/db/*', // Allow db const auto import

        // // DB Tables of app & layers (exclude index.ts using glob pattern)
        // 'server/db/schemas/tables/!(index).ts',
        // 'layers/*/server/db/schemas/tables/!(index).ts',

        // Utils of app & layers
        'server/utils/**',
        'layers/*/server/utils/**',

        // Shared schemas of app & layers
        'shared/schemas/**',
        'layers/*/shared/schemas/**',
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
    // Only configure vercel image provider in production because in dev we serve from local filesystem
    image: {
      // INFO: Project is hosted on vercel and we have to configure remote domains hence this config is needed
      //   If you're deploying elsewhere, adjust accordingly
      provider: 'vercel',
      // Let vercel handle images from other domains like S3 bucket, Google Images, etc
      domains: [
        'images.unsplash.com', // Unsplash images
        `${env.APP_AWS_BUCKET_NAME}.s3.${env.APP_AWS_REGION}.amazonaws.com`,
        // ...any other remote domains you use
      ],
    },
    content: {
      /*
        When on vercel it's required to use Node's native SQLite connector
        Issue: https://github.com/nuxt/content/issues/3689
      */
      experimental: { sqliteConnector: 'native' },
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
  devServer: {
    port: 3020,
  },
  $development: {
    vite: {
      server: {
        allowedHosts: ['lekhan.loca.lt'],
      },
    },
  },
})
