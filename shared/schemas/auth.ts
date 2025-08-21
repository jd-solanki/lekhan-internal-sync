import { z } from 'zod/v4'
import { dbVerificationInsertSchema } from './db/verification'
import { dbUserInsertSchema } from './db/user'
import { plainPasswordSchema } from '.'

// Sign Up
export const schemaSignUp = z.strictObject({
  ...dbUserInsertSchema.pick({ email: true }).shape,
  password: plainPasswordSchema,
  ...dbUserInsertSchema.pick({ name: true }).shape,
})
export type SchemaSignUp = z.infer<typeof schemaSignUp>

// Sign In
export const schemaSignIn = schemaSignUp.omit({ name: true })
export type SchemaSignIn = z.infer<typeof schemaSignIn>

// Magic Link
export const schemaMagicLink = schemaSignIn.pick({ email: true }).strict()
export type SchemaMagicLink = z.infer<typeof schemaMagicLink>

// Forgot Password
export const schemaForgotPassword = schemaMagicLink
export type SchemaForgotPassword = z.infer<typeof schemaForgotPassword>

// Reset Password
export const schemaResetPassword = z.strictObject({
  token: dbVerificationInsertSchema.pick({ identifier: true }).shape.identifier,
  ...schemaSignIn.pick({ password: true }).shape,
})
export type SchemaResetPassword = z.infer<typeof schemaResetPassword>
