import { z } from 'zod'
import 'dotenv/config'

const EnvSchema = z.object({
  // 🛠️ General
  NODE_ENV: z.enum(['development', 'production', 'test']),

  // 🌐 App
  APP_NAME: z.string(),
  APP_BASE_URL: z.url().optional().default('http://localhost:3000'),
  API_BASE_URL: z.url().optional().default('http://localhost:3000/api'),

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
  RESEND_API_KEY: z.string().optional(),
  AWS_ACCESS_KEY: z.string().optional(),
  AWS_SECRET_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),

  // 🔒 AUTH
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.url(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  NUXT_PUBLIC_IS_EMAIL_VERIFICATION_REQUIRED_FOR_ACCESS: z.stringbool().default(true),

  // 💰 Polar
  POLAR_ACCESS_TOKEN: z.string(),
  POLAR_SERVER: z.enum(['sandbox', 'production']),
}).refine(
  data => data.NODE_ENV === 'production'
    ? data.RESEND_API_KEY || (data.AWS_ACCESS_KEY && data.AWS_SECRET_KEY && data.AWS_REGION)
    : true,
  {
    error: 'It seems you haven\'t configured Email service for production. Please set API Key or Credentials of your preferred email service provider in the environment variables.',
  },
)

// eslint-disable-next-line ts/no-redeclare
export type EnvSchema = z.infer<typeof EnvSchema>

const parseResult = EnvSchema.safeParse(process.env)

if (!parseResult.success) {
  console.error(z.prettifyError(parseResult.error))

  process.exit(1)
}

export default parseResult.data
