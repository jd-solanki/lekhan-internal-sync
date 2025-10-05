import type { Simplify } from 'type-fest'
import { checkout, polar, portal, usage } from '@polar-sh/better-auth'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, createAuthMiddleware, magicLink } from 'better-auth/plugins'
import { eq } from 'drizzle-orm'
import * as z from 'zod'
import { polarClient } from '~~/server/libs/polar'
import { sendEmail } from '~~/server/utils/email'
import env from '~~/shared/libs/env'
import { db } from '../../db'
import { user as userTable } from '../../db/schemas/tables'

const runtimeConfig = useRuntimeConfig()

export const auth = betterAuth({
  user: {
    // Docs: https://www.better-auth.com/docs/concepts/database#extending-core-schema
    // NOTE: Don't add `fieldName` in `additionalFields` as its identifies DB col from schema. Adding `fieldName` will return `undefined`.
    additionalFields: {
      lastSignInAt: {
        type: 'date',
        validator: {
          input: z.iso.datetime(),
        },
        required: true,
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
    },
  },
  plugins: [
    admin(),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          successUrl: '/app/polar/success',
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        // webhooks({ ... })
      ],
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const emailSubject = 'Your Magic Link'

        const emailHTML = await renderEmailActionButton({
          emailPreview: `Here is your magic link to sign into ${env.APP_NAME}`,
          emailSubject,
          name: email.split('@')[0],
          message: 'Click the button below to sign in to your account:',
          btnText: 'Sign In',
          btnUrl: url,
        })

        await sendEmail({
          to: { email },
          subject: emailSubject,
          html: emailHTML,
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
        async after(session, _ctx) {
          // Update last sign in time on session create on user table
          await db.update(userTable)
            .set({ lastSignInAt: new Date() })
            .where(eq(userTable.id, session.userId as unknown as number))
        },
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const emailSubject = 'Verify your email address'

      const emailHTML = await renderEmailActionButton({
        emailPreview: `Verify your email address for ${env.APP_NAME}`,
        emailSubject,
        name: user.name,
        message: 'Click the button below to verify your email address:',
        btnText: 'Verify Email',
        btnUrl: url,
      })

      await sendEmail({
        to: { email: user.email },
        subject: emailSubject,
        html: emailHTML,
      })
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: runtimeConfig.public.shared.isEmailVerificationRequiredForAccess,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      const emailSubject = 'Reset your password'

      const emailHTML = await renderEmailActionButton({
        emailPreview: `Reset your password for ${env.APP_NAME}`,
        emailSubject,
        name: user.name,
        message: 'Click the button below to reset your password:',
        btnText: 'Reset Password',
        btnUrl: url,
      })

      await sendEmail({
        to: { email: user.email },
        subject: emailSubject,
        html: emailHTML,
      })
    },
  },
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
