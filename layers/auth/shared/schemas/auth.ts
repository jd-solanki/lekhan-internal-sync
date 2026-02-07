import { z } from 'zod/v4'
import { plainPasswordSchema } from '~~/layers/auth/shared/schemas'
import { dbSchemaUserInsert } from './db/user'
import { dbSchemaVerificationInsert } from './db/verification'

// Sign Up
export const schemaSignUp = z.strictObject({
  ...dbSchemaUserInsert.pick({ email: true }).shape,
  password: plainPasswordSchema,
})
export type SchemaSignUp = z.infer<typeof schemaSignUp>

export const schemaSignUpWithName = schemaSignUp.extend({
  ...dbSchemaUserInsert.pick({ name: true }).shape,
})
export type SchemaSignUpWithName = z.infer<typeof schemaSignUpWithName>

// Sign In
export const schemaSignIn = schemaSignUp
export type SchemaSignIn = z.infer<typeof schemaSignIn>

// Magic Link
export const schemaMagicLink = schemaSignIn.pick({ email: true }).strict()
export type SchemaMagicLink = z.infer<typeof schemaMagicLink>

// Forgot Password
export const schemaForgotPassword = schemaMagicLink
export type SchemaForgotPassword = z.infer<typeof schemaForgotPassword>

// Reset Password
export const schemaResetPassword = z.strictObject({
  token: dbSchemaVerificationInsert.pick({ identifier: true }).shape.identifier,
  ...schemaSignIn.pick({ password: true }).shape,
})
export type SchemaResetPassword = z.infer<typeof schemaResetPassword>

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
export const schemaUpdateProfile = z.strictObject({
  ...dbSchemaUserInsert.pick({ name: true }).shape,
})
export type SchemaUpdateProfile = z.infer<typeof schemaUpdateProfile>
