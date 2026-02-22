import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe } from 'vitest'
import { publicDbZodSchemaNaming } from '../rules/public-db-zod-schema-naming'

RuleTester.afterAll = afterAll
RuleTester.describe = describe

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
})

ruleTester.run('public-db-zod-schema-naming', publicDbZodSchemaNaming, {
  valid: [
    `const publicSchemaCreateNote = dbSchemaInsertNote.pick({ title: true }).required()`,
    `const publicSchemaUpdateNote = dbSchemaUpdateNote.partial().refine(Boolean)`,
    `export const publicSchemaReadUser = dbSchemaSelectUser.omit({ password: true }).readonly()`,
    `const publicSchemaCreateUser = dbSchemaInsertUser.extend({ role: z.string() }).nullable()`,

    // non-db schema roots should not be flagged
    `const schemaSignIn = z.object({ email: z.string() }).pick({ email: true })`,
    `const schemaFromUtility = makeSchema().pick({ id: true })`,
    `const publicSchemaCreateNote = customInsertSchema.pick({ title: true })`,

    // db schema root with unsupported chain method should be ignored to avoid false positives
    `const maybeSchema = dbSchemaInsertNote.strict()`,

    // db schema root but no allowed chain should be ignored
    `const copy = dbSchemaInsertNote`,

    // non-const declarations should be ignored
    `let schema = dbSchemaInsertNote.pick({ title: true })`,
  ],
  invalid: [
    {
      code: `const noteCreateSchema = dbSchemaInsertNote.pick({ title: true, content: true }).required()`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'noteCreateSchema',
          expected: 'publicSchemaCreateNote',
        },
      }],
    },
    {
      code: `const publicSchemaInsertNote = dbSchemaInsertNote.pick({ title: true })`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'publicSchemaInsertNote',
          expected: 'publicSchemaCreateNote',
        },
      }],
    },
    {
      code: `const publicSchemaUpdateUser = dbSchemaSelectUser.omit({ password: true })`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'publicSchemaUpdateUser',
          expected: 'publicSchemaReadUser',
        },
      }],
    },
    {
      code: `export const schemaUpdateNote = dbSchemaUpdateNote.partial().required()`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'schemaUpdateNote',
          expected: 'publicSchemaUpdateNote',
        },
      }],
    },
  ],
})
