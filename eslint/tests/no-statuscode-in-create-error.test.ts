import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe } from 'vitest'
import { noStatusCodeInCreateError } from '../rules/no-statuscode-in-create-error'

// Required: set test framework
RuleTester.afterAll = afterAll
// For vitest < 1.0, might need: RuleTester.it = it; RuleTester.itOnly = it.only;
RuleTester.describe = describe

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
})

ruleTester.run('no-statuscode-in-create-error', noStatusCodeInCreateError, {
  valid: [
    `createError({ status: 403, message: 'Forbidden' })`,
    `createError('error')`,
    `otherFunc({ statusCode: 403 })`,
  ],
  invalid: [
    {
      code: `createError({ statusCode: 403, message: 'Subscription does not belong to this user.' })`,
      output: `createError({ status: 403, message: 'Subscription does not belong to this user.' })`,
      errors: [{ messageId: 'useStatus' }],
    },
    {
      code: `throw createError({ statusCode: 404 })`,
      output: `throw createError({ status: 404 })`,
      errors: [{ messageId: 'useStatus' }],
    },
  ],
})
