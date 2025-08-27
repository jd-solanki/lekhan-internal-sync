import { checkout, polar, portal, usage, webhooks } from '@polar-sh/better-auth'
import { render } from '@vue-email/render'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createAuthMiddleware, magicLink } from 'better-auth/plugins'
import EmailTemplateVerifyEmail from '~~/server/emails/auth/verifyEmail.vue'
import { polarClient } from '~~/server/libs/polar'
import { sendEmail } from '~~/server/utils/email'
import env from '~~/shared/libs/env'
import { db } from '../../db'

const runtimeConfig = useRuntimeConfig()

export const auth = betterAuth({
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          successUrl: '/app?paymentStatus=success',
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        // webhooks({ ... })
      ],
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmail({
          to: { email },
          subject: 'Magic Link',
          text: `Click the link to sign in to your account: ${url}`,
        })
      },
    }),
  ],
  hooks: {
    /*
      When BetterAuth returns session data, its null when user is not authenticated.
      Due to this nuxt refetch the session on client (duplication) and throws warning.
      Ref: https://github.com/better-auth/better-auth/issues/1707#issuecomment-2752071258
    */
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/get-session') {
        console.log('✨ requesting session...')
        if (!ctx.context.session) {
          return ctx.json({
            session: null,
            user: null,
          })
        }
        return ctx.json(ctx.context.session)
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
      const html = await render(EmailTemplateVerifyEmail, {
        url,
      }, {
        pretty: true,
      })
      await sendEmail({
        to: { email: user.email },
        subject: 'Verify your email address',
        // text: `Click the link to verify your email: ${url}`,
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
      await sendEmail({
        to: { email: user.email },
        subject: 'Reset your password',
        text: `Click the link to reset your password: ${url}`,
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
