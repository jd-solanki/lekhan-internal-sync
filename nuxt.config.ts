import vue from '@vitejs/plugin-vue'
import env from './shared/libs/env'
import { CRON_SCHEDULES_PRESET } from './shared/utils/constants'

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
      class: 'has-[>_.banner]:[--app-banner-height:60px]',
    },
  },
  runtimeConfig: {
    // INFO: Private config will be server only so no need to separate in app, server & shared

    mail: {
      // NOTE: We shouldn't make adminEmails public as it may contain personal information.
      // Add admin emails here to receive notifications about unexpected errors
      adminEmails: env.ADMIN_EMAILS,
    },

    public: {
      // Server Config
      server: {
        apiBaseUrl: env.API_BASE_URL,
      },

      // App Config
      app: {
        baseUrl: env.APP_BASE_URL,
        // NOTE: Ensure these are according to your app/pages directory
        routes: {
          home: '/app',
          signIn: '/auth/sign-in',
          verifyEmail: '/auth/verify-email',
        },

        // NON-SENSITIVE values from env to consume in app context
        // This is because we can't use `env.ts` in browser context directly as it contains sensitive values
        env: {
          NODE_ENV: env.NODE_ENV,
          APP_SCHEME: env.APP_SCHEME,
          APP_DOMAIN: env.APP_DOMAIN,
          APP_BASE_URL: env.APP_BASE_URL,
          API_BASE_URL: env.API_BASE_URL,
        },
      },

      // Shared across server & app
      shared: {
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
  ],
  features: {
    devLogs: true,
  },
  experimental: {
    cookieStore: true,
    typedPages: true,
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
    rollupConfig: {
      plugins: [vue()],
    },
    imports: {
      dirs: [
        'shared/schemas/**/*',
        'server/utils/**',
        'sever/db/index',
      ],
    },
  },
})
