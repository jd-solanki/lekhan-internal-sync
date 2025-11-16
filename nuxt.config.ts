import type { SocialProviderId } from './server/libs/auth'
import env from './shared/libs/env'
import { CRON_SCHEDULES_PRESET } from './shared/utils/constants'
import { exhaustive } from './shared/utils/types'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    // pageTransition: { name: 'page-transition-zoom-fade', mode: 'out-in' },
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', media: '(prefers-color-scheme: light)', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/x-icon', media: '(prefers-color-scheme: dark)', href: '/favicon-light.ico' },
      ],
    },
    rootAttrs: {
      // Add banner height CSS variable if app/global or impersonating banner is visible
      class: 'has-[>_.banner]:[--app-banner-height:48px]',
    },
  },
  runtimeConfig: {
    // INFO: Private config will be server only so no need to separate in app, server & shared

    mail: {
      // NOTE: We shouldn't make adminEmails public as it may contain personal information.
      // Add admin emails here to receive notifications about unexpected errors
      adminEmails: env.ADMIN_EMAILS,
      from: {
        email: process.env.NODE_ENV === 'development' ? 'no-reply@example.com' : `no-reply@${env.NUXT_PUBLIC_APP_DOMAIN}`,
        name: env.NUXT_PUBLIC_APP_NAME,
      },
    },

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
        // NOTE: Ensure these are according to your app/pages directory
        routes: {
          home: '/app',
          signIn: '/auth/sign-in',
          verifyEmail: '/auth/verify-email',
          billing: '/app/billing',
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
              id: 'google' satisfies SocialProviderId,
              name: 'Google',
              icon: 'i-logos-google-icon',
            },
            {
              id: 'github' satisfies SocialProviderId,
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
  css: ['~/assets/css/main.css', '~/assets/css/routerTransitions.css'],
  icon: {
    customCollections: [
      {
        prefix: 'arrows',
        dir: './app/assets/icons/arrows',
      },
    ],
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@pinia/nuxt',
    'nuxt-email-renderer',
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
      '../shared/schemas/**',
      './libs/auth/index.ts',
    ],
  },
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      [CRON_SCHEDULES_PRESET.EVERY_DAY]: ['liftBan'],
    },
    imports: {
      dirs: [
        'shared/schemas/**/*',
        'server/utils/**/*',
        'server/db/index',
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
      domains: [
        // Let netlify handle images from S3 bucket
        `${env.APP_AWS_BUCKET_NAME}.s3.${env.APP_AWS_REGION}.amazonaws.com`,
        // ...any other remote domains you use
      ],
    },
  },
})
