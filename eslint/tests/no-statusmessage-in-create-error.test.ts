// eslint/tests/no-statusmessage-in-create-error.test.ts
import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe } from 'vitest'
import { noStatusMessageInCreateError } from '../rules/no-statusmessage-in-create-error'

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

ruleTester.run('no-statusmessage-in-create-error', noStatusMessageInCreateError, {
  valid: [
    `createError({ status: 403, statusText: 'Forbidden' })`,
    `createError({ statusText: 'Not Found' })`,
    `createError('error')`,
    `otherFunc({ statusMessage: 'test' })`,
    `createError({ message: 'error' })`,
  ],
  invalid: [
    {
      code: `createError({ statusMessage: 'Forbidden' })`,
      output: `createError({ statusText: 'Forbidden' })`,
      errors: [{ messageId: 'useStatusText' }],
    },
    {
      code: `createError({ status: 403, statusMessage: 'Forbidden' })`,
      output: `createError({ status: 403, statusText: 'Forbidden' })`,
      errors: [{ messageId: 'useStatusText' }],
    },
    {
      code: `throw createError({ statusCode: 404, statusMessage: 'Not Found' })`,
      output: `throw createError({ statusCode: 404, statusText: 'Not Found' })`,
      errors: [{ messageId: 'useStatusText' }],
    },
    {
      code: `createError({
        statusMessage: 'Subscription does not belong to this user.',
        status: 403
      })`,
      output: `createError({
        statusText: 'Subscription does not belong to this user.',
        status: 403
      })`,
      errors: [{ messageId: 'useStatusText' }],
    },
  ],
})
