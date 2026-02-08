import type { Simplify } from 'type-fest'

import env from '#server/libs/env'
import { checkout, polar, portal, usage, webhooks } from '@polar-sh/better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { betterAuth } from 'better-auth/minimal'
import { admin, createAuthMiddleware, lastLoginMethod, magicLink } from 'better-auth/plugins'
import { eq } from 'drizzle-orm'
import * as z from 'zod'
import { handleOAuthAccountLinkEmailMismatch } from '~~/layers/auth/server/utils/auth'
import { sendEmail } from '~~/layers/email/server/utils/email'
import { polarClient } from '~~/layers/payments/server/libs/polar'
import { dbTableUser } from '~~/server/db/schemas/tables'
import {
  onAfterUserCreateDatabaseHookSyncPolarOrdersAndSubscriptionsForGuestCheckout,
  onBeforeUserCreateDatabaseHookDownloadOAuthImage,
  onBeforeUserCreateDatabaseHookInsertPolarCustomerId,
} from './utils'

const runtimeConfig = useRuntimeConfig()

export const auth = betterAuth({
  account: {
    modelName: 'dbTableAccount',
    accountLinking: {
      enabled: true,
    },
  },
  verification: { modelName: 'dbTableVerification' },
  session: { modelName: 'dbTableSession' },
  user: {
    modelName: 'dbTableUser',
    // Docs: https://www.better-auth.com/docs/concepts/database#extending-core-schema
    // NOTE: Don't add `fieldName` in `additionalFields` as its identifies DB col from schema. Adding `fieldName` will return `undefined`.
    additionalFields: {
      lastSignInAt: {
        type: 'date',
        validator: {
          input: z.iso.datetime(),
        },
        required: false,
        input: false,
      },
      deactivatedAt: {
        type: 'date',
        validator: {
          input: z.nullable(z.iso.datetime()),
        },
        required: false,
        input: false,
      },
      polarCustomerId: {
        type: 'string',
        validator: {
          input: z.uuidv4(),
        },
        // INFO: We have to set `polarCustomerId.required` false because we insert polarCustomerId in database hook after schema validation
        required: false,
        input: false,
      },
    },
  },
  plugins: [
    admin(),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          /*
            WARNING: When only authenticated user is allowed to checkout, `?checkout_id={CHECKOUT_ID}` is required to receive checkout_id on success page to fetch orders & subscriptions

            When using guest checkout we don't need checkout ID because we fetch all orders & subscriptions there
          */
          successUrl: env.POLAR_CHECKOUT_FOR_AUTHENTICATED_USERS_ONLY
            ? '/polar/success?checkout_id={CHECKOUT_ID}'
            : runtimeConfig.public.app.routes.signUp,
          authenticatedUsersOnly: env.POLAR_CHECKOUT_FOR_AUTHENTICATED_USERS_ONLY,
        }),
        portal({
          returnUrl: env.NUXT_PUBLIC_APP_BASE_URL + runtimeConfig.public.app.routes.billing,
        }),
        usage(),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,
        }),
      ],
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const emailSubject = 'Your Magic Link'

        const emailHTML = await renderEmailComponent('EmailActionButton', {
          emailPreview: `Here is your magic link to sign into ${env.NUXT_PUBLIC_APP_NAME}`,
          emailSubject,
          name: email.split('@')[0],
          message: 'Click the button below to sign in to your account:',
          btnText: 'Sign In',
          btnUrl: url,
        })

        await sendEmail({
          type: 'security',
          to: { email },
          subject: emailSubject,
          html: emailHTML,
        })
      },
    }),
    lastLoginMethod({
      customResolveMethod: (ctx) => {
        // Track magic link authentication
        if (ctx.path === '/magic-link/verify') {
          return 'magic-link'
        }

        // Return null to use default logic
        return null
      },
    }),
  ],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      handleOAuthAccountLinkEmailMismatch(ctx, runtimeConfig.public.app.routes.accountSettingsLinkedAccounts)
    }),
    after: createAuthMiddleware(async (ctx) => {
      // console.log('[hook:after] ctx.path :>> ', ctx.path)

      /*
        When BetterAuth returns session data, its null when user is not authenticated.
        Due to this nuxt refetch the session on client (duplication) and throws warning.
        Ref: https://github.com/better-auth/better-auth/issues/1707#issuecomment-2752071258
      */
      if (ctx.path === '/get-session') {
        // eslint-disable-next-line no-console
        console.log('✨ requesting session...')
        if (!ctx.context.session) {
          return ctx.json({
            session: null,
            user: null,
          })
        }
        return ctx.json(ctx.context.session)
      }

      // INFO: This can be also its own plugin
      // Reactive user by setting `deactivatedAt` col to null on various sign in methods
      if (
        ctx.path === '/sign-in/email'
        || ctx.path === '/magic-link/verify' // Do not use /sign-in/magic-link only send link and not actually verifies real user
        || ctx.path === '/callback/:id' // Do not use /sign-in/social as it only initiates the social sign in and does not actually verifies real user
      ) {
        const newSession = ctx.context.newSession
        if (newSession && newSession.user.deactivatedAt) {
          await db
            .update(dbTableUser)
            .set({ deactivatedAt: null })
            .where(eq(dbTableUser.id, newSession.user.id as unknown as number))
          // eslint-disable-next-line no-console
          console.log(`♻️  Reactivated user id=${newSession.user.id} by setting deactivatedAt to null`)
        }
      }
    }),
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session, _ctx) => {
          return {
            data: {
              ...session,
              /*
                We've to set ipAddress to null if not provided because our schema inet does not allow empty strings
                Which is set by better-auth
              */
              ipAddress: session.ipAddress || null,
            },
          }
        },
        async after(session, _ctx) {
          // Update last sign in time on session create on user table
          await db.update(dbTableUser)
            .set({ lastSignInAt: new Date() })
            .where(eq(dbTableUser.id, session.userId as unknown as number))
        },
      },
    },
    user: {
      create: {
        before: async (user, ctx) => {
          const imageResult = await onBeforeUserCreateDatabaseHookDownloadOAuthImage(user, ctx)

          // const nextUser = typeof imageResult === 'object' ? imageResult.data : user
          if (imageResult && typeof imageResult === 'object') {
            user.image = imageResult.data.image
          }

          return onBeforeUserCreateDatabaseHookInsertPolarCustomerId(user, ctx)
        },
        after: onAfterUserCreateDatabaseHookSyncPolarOrdersAndSubscriptionsForGuestCheckout,
      },
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const emailSubject = 'Verify your email address'

      const emailHTML = await renderEmailComponent('EmailActionButton', {
        emailPreview: `Verify your email address for ${env.NUXT_PUBLIC_APP_NAME}`,
        emailSubject,
        name: user.name,
        message: 'Click the button below to verify your email address:',
        btnText: 'Verify Email',
        btnUrl: url,
      })

      await sendEmail({
        type: 'security',
        to: { email: user.email },
        subject: emailSubject,
        html: emailHTML,
      })
    },
    async afterEmailVerification(user, _) {
      // Send welcome email after user creation
      const emailSubject = `Welcome to ${env.NUXT_PUBLIC_APP_NAME} 👋 Let's get you set up`

      const emailHTML = await renderEmailComponent('Welcome', {
        subject: emailSubject,
        name: user.name,
      })

      await sendEmail({
        type: 'events',
        to: { email: user.email },
        subject: emailSubject,
        html: emailHTML,
      })
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      const emailSubject = 'Reset your password'

      const emailHTML = await renderEmailComponent('EmailActionButton', {
        emailPreview: `Reset your password for ${env.NUXT_PUBLIC_APP_NAME}`,
        emailSubject,
        name: user.name,
        message: 'Click the button below to reset your password:',
        btnText: 'Reset Password',
        btnUrl: url,
      })

      await sendEmail({
        type: 'security',
        to: { email: user.email },
        subject: emailSubject,
        html: emailHTML,
      })
    },
  },
  // Social providers configured here must match the list in nuxt.config.ts -> runtimeConfig.public.shared.auth.socialProviders
  // nuxt.config.ts is the source of truth for which providers to display in the UI
  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.AUTH_GITHUB_CLIENT_SECRET,
    },
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  advanced: {
    database: {
      generateId: 'serial', // Use serial for auto incrementing integer IDs
    },
  },
})

export type Session = typeof auth.$Infer.Session
export type User = Simplify<Omit<Session['user'], 'id'> & { id: number }>
export type UserSession = Session['session']

// Extract configured social provider IDs as literal union type
export type SocialProviderId = keyof typeof auth.options.socialProviders
