import type { Simplify } from 'type-fest'
import { checkout, polar, portal, usage } from '@polar-sh/better-auth'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, createAuthMiddleware, magicLink } from 'better-auth/plugins'
import { eq } from 'drizzle-orm'
import * as z from 'zod'
import appConfig from '~~/app/app.config'
import ButtonLinkEmailTemplate from '~~/emails/templates/button-link.html'
import { polarClient } from '~~/server/libs/polar'
import { sendEmail } from '~~/server/utils/email'
import env from '~~/shared/libs/env'
import { db } from '../../db'
import { user as userTable } from '../../db/schemas/tables'

const runtimeConfig = useRuntimeConfig()

export const auth = betterAuth({
  user: {
    // TODO: Why this isn't working. We're not getting these fields in `admin.listUsers`
    // Docs: https://www.better-auth.com/docs/concepts/database#extending-core-schema
    additionalFields: {
      lastSignInAt: {
        type: 'date',
        fieldName: 'last_sign_in_at',
        validator: {
          input: z.iso.datetime(),
        },
        required: true,
        input: false,
      },
      deactivatedAt: {
        type: 'date',
        fieldName: 'deactivated_at',
        validator: {
          input: z.nullable(z.iso.datetime()),
        },
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
          successUrl: `/app?flash_message__success=${encodeURIComponent('Payment processed successfully')}`,
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        // webhooks({ ... })
      ],
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const { html } = await renderEmail(ButtonLinkEmailTemplate, {
          btnText: 'Sign In',
          btnUrl: url,
          message: 'Please click on below button to sign in to your account.',
        })

        await sendEmail({
          to: { email },
          subject: 'Magic Link',
          html,
        })
      },
    }),
  ],
  hooks: {
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
            .update(userTable)
            .set({ deactivatedAt: null })
            .where(eq(userTable.id, newSession.user.id as unknown as number))
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
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const { html } = await renderEmail(ButtonLinkEmailTemplate, {
        user: user.name,
        btnText: 'Verify Email',
        btnUrl: url,
        message: 'We\'re happy to have you on board! Please verify your email address in order to activate your account.',
      })

      await sendEmail({
        to: { email: user.email },
        subject: 'Verify your email address',
        html,
      })
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: runtimeConfig.public.shared.isEmailVerificationRequiredForAccess,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      const { html } = await renderEmail(ButtonLinkEmailTemplate, {
        user: user.name,
        btnText: 'Reset Password',
        btnUrl: url,
        message: `A request to reset your ${appConfig.app.title} password has been made. If you did not make this request, simply ignore this email. If you did make this request, please reset your password by clicking on below button.`,
      })

      await sendEmail({
        to: { email: user.email },
        subject: 'Reset your password',
        html,
      })
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  advanced: {
    database: {
      useNumberId: true,
    },
  },
})

/*
  🚨 NEVER enable social sign in without email verification
  CASE 1: User sign in via Google. This will create user record & account record.
    Now attacker can use password based sign in with the same email. This will create a new account record and map it to the existing user record.
    As there was not email verification, the attacker can access the existing user account.
  CASE 2: User X sign up via password but uses User Y's email. This will create user record & account record.
    Now another user Y sign in via google. This will create a new account record and map it to the existing user record.
    Now User X unintentionally gains access to User Y's account.
*/
if (
  Object.prototype.hasOwnProperty.call(auth.options, 'emailAndPassword')
  && Object.prototype.hasOwnProperty.call(auth.options.emailAndPassword, 'requireEmailVerification')
  && !auth.options.emailAndPassword.requireEmailVerification
  && Object.prototype.hasOwnProperty.call(auth.options, 'socialProviders')
) {
  throw new Error('Social Sign In is not allowed without email verification. Reason: Someone can hijack other users\' accounts.')
}

export type Session = typeof auth.$Infer.Session
export type User = Simplify<Omit<Session['user'], 'id'> & { id: number }>
export type UserSession = Session['session']
