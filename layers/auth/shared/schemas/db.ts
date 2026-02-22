import { z } from 'zod/v4'
import { plainPasswordSchema } from '~~/layers/auth/shared/schemas'
import { dbSchemaInsertUser } from './db/user'
import { dbSchemaInsertVerification } from './db/verification'

// Sign Up
export const publicSchemaSignUp = z.strictObject({
  ...dbSchemaInsertUser.pick({ email: true }).shape,
  password: plainPasswordSchema,
})
export type SchemaSignUp = z.infer<typeof publicSchemaSignUp>

export const publicSchemaSignUpWithName = publicSchemaSignUp.extend({
  ...dbSchemaInsertUser.pick({ name: true }).shape,
})
export type SchemaSignUpWithName = z.infer<typeof publicSchemaSignUpWithName>

// Sign In
export const publicSchemaSignIn = publicSchemaSignUp
export type SchemaSignIn = z.infer<typeof publicSchemaSignIn>

// Magic Link
export const publicSchemaMagicLink = publicSchemaSignIn.pick({ email: true }).strict()
export type SchemaMagicLink = z.infer<typeof publicSchemaMagicLink>

// Forgot Password
export const publicSchemaForgotPassword = publicSchemaMagicLink
export type SchemaForgotPassword = z.infer<typeof publicSchemaForgotPassword>

// Reset Password
export const publicSchemaResetPassword = z.strictObject({
  token: dbSchemaInsertVerification.pick({ identifier: true }).shape.identifier,
  ...publicSchemaSignIn.pick({ password: true }).shape,
})
export type SchemaResetPassword = z.infer<typeof publicSchemaResetPassword>

// Change Password
export const schemaChangePassword = z.strictObject({
  currentPassword: plainPasswordSchema,
  newPassword: plainPasswordSchema,
  confirmNewPassword: plainPasswordSchema,
}).refine(
  data => data.newPassword === data.confirmNewPassword,
  { message: 'Passwords don\'t match', path: ['confirmNewPassword'] },
)
export type SchemaChangePassword = z.infer<typeof schemaChangePassword>

// Update Profile
export const publicSchemaUpdateProfile = z.strictObject({
  ...dbSchemaInsertUser.pick({ name: true }).shape,
})
export type SchemaUpdateProfile = z.infer<typeof publicSchemaUpdateProfile>
