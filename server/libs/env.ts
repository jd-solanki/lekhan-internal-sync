import { z } from 'zod'
import 'dotenv/config'

// NOTE: It isn't meant to be used in `app` directory/context because it contains sensitive & server only info.
//       Even though if you try to import & use it in `app`, You'll get and error.
//       It is placed inside `shared` so that it can be imported in both `server` & other server only contexts.

const EnvSchema = z.object({
  // 🛠️ General
  NODE_ENV: z.enum(['development', 'production', 'test']),

  // 🌐 App
  NUXT_PUBLIC_APP_NAME: z.string(),
  NUXT_PUBLIC_APP_DOMAIN: z.string().optional(),
  NUXT_PUBLIC_APP_BASE_URL: z.url().optional().default('http://localhost:3000'),
  NUXT_PUBLIC_API_BASE_URL: z.url().optional().default('http://localhost:3000/api'),

  // 💬 Contact Us
  NUXT_PUBLIC_CONTACT_EMAIL: z.email(),

  // 🧙🏻 Admin
  ADMIN_EMAILS: z.preprocess((val) => {
    if (typeof val === 'string') {
      // CSV
      return val.split(',').map(email => email.trim())
    }
    return val
  }, z.array(z.email())),

  // 📦 Database
  DATABASE_URL: z.string(),

  // Email
  // NOTE: Kept on top of AWS to get picked up as email service as AWS is configured for storage
  RESEND_API_KEY: z.string().optional(),

  // Storage
  APP_AWS_ACCESS_KEY: z.string(),
  APP_AWS_SECRET_KEY: z.string(),
  APP_AWS_REGION: z.string(),
  APP_AWS_BUCKET_NAME: z.string(),
  // Auto generate from `https://s3.[region].amazonaws.com/`
  APP_AWS_ENDPOINT: z.string().optional(),

  // 🔒 AUTH
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.url(),

  AUTH_GOOGLE_CLIENT_ID: z.string(),
  AUTH_GOOGLE_CLIENT_SECRET: z.string(),
  AUTH_GITHUB_CLIENT_ID: z.string(),
  AUTH_GITHUB_CLIENT_SECRET: z.string(),
  NUXT_PUBLIC_IS_EMAIL_VERIFICATION_REQUIRED_FOR_ACCESS: z.stringbool().default(true),

  // 💰 Polar
  POLAR_DASHBOARD_URL: z.url(),
  POLAR_ACCESS_TOKEN: z.string(),
  POLAR_SERVER: z.enum(['sandbox', 'production']),
})
  .refine(
    data => data.NODE_ENV === 'production'
      ? data.RESEND_API_KEY || (data.APP_AWS_ACCESS_KEY && data.APP_AWS_SECRET_KEY && data.APP_AWS_REGION)
      : true,
    {
      error: 'It seems you haven\'t configured Email service for production. Please set API Key or Credentials of your preferred email service provider in the environment variables.',
    },
  )
  .transform(data => ({
    ...data,
    APP_AWS_ENDPOINT: data.APP_AWS_ENDPOINT ?? `https://s3.${data.APP_AWS_REGION}.amazonaws.com`,
  }))

// eslint-disable-next-line ts/no-redeclare
export type EnvSchema = z.infer<typeof EnvSchema>

const parseResult = EnvSchema.safeParse(process.env)

if (!parseResult.success) {
  console.error(z.prettifyError(parseResult.error))

  process.exit(1)
}

export default parseResult.data
