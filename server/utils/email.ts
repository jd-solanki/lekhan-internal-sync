import { createEmailService } from 'unemail'
import awsSesProvider from 'unemail/providers/aws-ses'
import resendProvider from 'unemail/providers/resend'
import smtpProvider from 'unemail/providers/smtp'
import env from '~~/shared/libs/env'

let emailService: ReturnType<typeof createEmailService> | null = null
type EmailOptions = Parameters<(ReturnType<typeof getEmailService>)['sendEmail']>[0]

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
    else if (env.AWS_ACCESS_KEY && env.AWS_SECRET_KEY && env.AWS_REGION) {
      emailService = createEmailService({
        provider: awsSesProvider({
          accessKeyId: env.AWS_ACCESS_KEY,
          secretAccessKey: env.AWS_SECRET_KEY,
          region: env.AWS_REGION,
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
 * The 'from' field is set to the configured app email
 */
export function sendEmail(emailOptions: Omit<EmailOptions, 'from'>, options?: SendEmailOptions) {
  const { appConfig = useAppConfig() } = options || {}

  const emailServiceInstance = getEmailService()

  return emailServiceInstance.sendEmail({
    from: { email: appConfig.mail.from.email, name: appConfig.mail.from.name },
    ...emailOptions,
    subject: `${appConfig.app.title} - ${emailOptions.subject}`,
  })
}

export function sendEmailToAdmins(emailOptions: Omit<EmailOptions, 'from' | 'to'>, options?: SendEmailOptions) {
  const { runtimeConfig = useRuntimeConfig(), appConfig = useAppConfig() } = options || {}

  const emailServiceInstance = getEmailService()

  return emailServiceInstance.sendEmail({
    from: { email: appConfig.mail.from.email, name: appConfig.mail.from.name },
    ...emailOptions,
    to: runtimeConfig.mail.adminEmails.map(email => ({ email })),
    subject: `${appConfig.app.title} - ${emailOptions.subject}`,
  })
}
