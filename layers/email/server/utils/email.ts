import type { RuntimeConfig } from 'nuxt/schema'
import env from '#server/libs/env'
import { createEmailService } from 'unemail'
import awsSesProvider from 'unemail/providers/aws-ses'
import resendProvider from 'unemail/providers/resend'
import smtpProvider from 'unemail/providers/smtp'

let emailService: ReturnType<typeof createEmailService> | null = null
type EmailOptions = Parameters<(ReturnType<typeof getEmailService>)['sendEmail']>[0]

// Infer SenderType from RuntimeConfig
export type SenderType = keyof RuntimeConfig['mail']['senders']

/**
 * Gets or creates the email service instance
 * Lazy initialization with provider selection based on available config
 * @returns Email service instance
 */
export function getEmailService() {
  if (emailService)
    return emailService

  emailService = createEmailService({
    provider: smtpProvider({
      host: 'localhost',
      port: 1025,
      secure: false, // typically false for development
    }),
  })

  if (env.NODE_ENV === 'production') {
    // Resend
    if (env.RESEND_API_KEY) {
      emailService = createEmailService({
        provider: resendProvider({
          apiKey: env.RESEND_API_KEY,
        }),
      })
    }

    // AWS SES
    else if (env.APP_AWS_ACCESS_KEY && env.APP_AWS_SECRET_KEY && env.APP_AWS_REGION) {
      emailService = createEmailService({
        provider: awsSesProvider({
          accessKeyId: env.APP_AWS_ACCESS_KEY,
          secretAccessKey: env.APP_AWS_SECRET_KEY,
          region: env.APP_AWS_REGION,
        }),
      })
    }

    // Add other providers here as else if blocks

    // If not valid production email provider found raise error
    else {
      throw new Error('No valid email provider configured for production. Please set API Key or Credentials of your preferred email service provider in the environment variables.')
    }
  }

  return emailService
}

interface SendEmailOptions {
  runtimeConfig?: ReturnType<typeof useRuntimeConfig>
  appConfig?: ReturnType<typeof useAppConfig>
}

/**
 * Sends an email using the configured email service
 * Automatically prepends the app title to the subject
 * The 'from' field is set based on the sender type
 */
export function sendEmail(emailOptions: Omit<EmailOptions, 'from'> & { type: SenderType }, options?: SendEmailOptions) {
  const { runtimeConfig = useRuntimeConfig() } = options || {}
  const { type, ...restEmailOptions } = emailOptions

  const emailServiceInstance = getEmailService()

  return emailServiceInstance.sendEmail({
    from: runtimeConfig.mail.senders[type],
    ...restEmailOptions,
    subject: `${runtimeConfig.public.app.name} - ${restEmailOptions.subject}`,
  })
}

export function sendEmailToAdmins(emailOptions: Omit<EmailOptions, 'from' | 'to'>, options?: SendEmailOptions) {
  const { runtimeConfig = useRuntimeConfig() } = options || {}

  const emailServiceInstance = getEmailService()

  return emailServiceInstance.sendEmail({
    from: runtimeConfig.mail.senders.system,
    ...emailOptions,
    to: runtimeConfig.mail.adminEmails.map(email => ({ email })),
    subject: `${runtimeConfig.public.app.name} - ${emailOptions.subject}`,
  })
}
