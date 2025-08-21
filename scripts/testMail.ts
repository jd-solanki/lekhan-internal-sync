import { createEmailService } from 'unemail'
import smtpProvider from 'unemail/providers/smtp'

const emailService = createEmailService({
  provider: smtpProvider({
    host: 'localhost',
    port: 1025, // default MailCrab port
    secure: false, // typically false for development
  }),
})

// Send an email
const result = await emailService.sendEmail({
  from: { email: 'sender@example.com', name: 'Sender Name' },
  to: { email: 'recipient@example.com', name: 'Recipient Name' },
  subject: 'Hello from unemail',
  text: 'This is a test email sent using unemail library',
  html: '<p>This is a test email sent using <strong>unemail</strong> library</p>',
})

if (result.success) {
  console.log('Email sent successfully!', result.data?.messageId)
}
else {
  console.error('Failed to send email:', result.error)
}
