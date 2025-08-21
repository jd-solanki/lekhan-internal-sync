import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createAuthMiddleware, magicLink } from 'better-auth/plugins'
import { eq } from 'drizzle-orm'
import { sendEmail } from '~~/server/utils/email'
import env from '~~/shared/lib/env'
import { db } from '../../db'

export const auth = betterAuth({
  hooks: {
    /*
      When BetterAuth returns session data, its null when user is not authenticated.
      Due to this nuxt refetch the session on client (duplication) and throws warning.
      Ref: https://github.com/better-auth/better-auth/issues/1707#issuecomment-2752071258
    */
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/get-session") {
        if (!ctx.context.session) {
          return ctx.json({
            session: null,
            user: null,
          });
        }
        return ctx.json(ctx.context.session);
      }
    }),
  },
  databaseHooks: {
    // account: {
    //   create: {
    //     before: async (account, _ctx) => {
    //       // If provider id is not credentials, it's a social login
    //       if (account.providerId !== 'credentials') {
    //         // Check if credential account already exists with given email
    //         // If it exists, throw an error that user already has an account with credentials
    //         const existingAccount = await db
    //           .select()
    //           .from(accountTable)
    //           .where(
    //             // TODO: Why BA is not considering userId as number?
    //             eq(accountTable.userId, account.userId as unknown as number),
    //           )
    //           .limit(1)

    //         if (existingAccount) {
    //           throw new Error('User already has an account with credentials')
    //         }
    //       }
    //     },
    //   },
    // },
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
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        await sendEmail({
          to: { email },
          subject: 'Magic Link',
          text: `Click the link to sign in to your account: ${url}`,
        })
      },
    }),
  ],
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendEmail({
        to: { email: user.email },
        subject: 'Verify your email address',
        text: `Click the link to verify your email: ${url}`,
      })
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: env.NUXT_PUBLIC_IS_EMAIL_VERIFICATION_REQUIRED_FOR_ACCESS,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url, token }, request) => {
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
