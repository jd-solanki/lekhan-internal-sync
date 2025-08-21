import { z } from 'zod'

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
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

  // 🔒 AUTH
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.url(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  NUXT_PUBLIC_IS_EMAIL_VERIFICATION_REQUIRED_FOR_ACCESS: z.stringbool().default(true),
})

// eslint-disable-next-line ts/no-redeclare
export type EnvSchema = z.infer<typeof EnvSchema>

const parseResult = EnvSchema.safeParse(process.env)

if (!parseResult.success) {
  console.error(z.prettifyError(parseResult.error))

  process.exit(1)
}

export default parseResult.data
