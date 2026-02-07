import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe } from 'vitest'
import { dbTableNaming } from '../rules/db-table-naming'

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

ruleTester.run('db-table-naming', dbTableNaming, {
  valid: [
    // Exported: export const dbTable... = pgTable(...)
    `export const dbTableUser = pgTable('user', {})`,
    `export const dbTableAccount = pgTable('account', {})`,
    `export const dbTableProduct = pgTable('product', {})`,
    `export const dbTablePost = pgTable('post', {})`,

    // Non-exported: const dbTable... = pgTable(...)
    `const dbTableUser = pgTable('user', {})`,
    `const dbTableAccount = pgTable('account', {})`,

    // Multi-word entities (snake_case to PascalCase)
    `export const dbTableUserProfile = pgTable('user_profile', {})`,
    `export const dbTableAccountVerification = pgTable('account_verification', {})`,
    `export const dbTableShoppingCart = pgTable('shopping_cart', {})`,
    `export const dbTableOrderItem = pgTable('order_item', {})`,
    `export const dbTableProductCategory = pgTable('product_category', {})`,
    `const dbTableUserProfile = pgTable('user_profile', {})`,

    // Non-pgTable exports (should be ignored)
    `export const userSchema = z.object({})`,
    `export const config = { database: 'postgres' }`,
    `export const SOME_CONSTANT = 'value'`,
    `export const helper = () => {}`,
    `export const wrongName = someOtherFunction()`,
    `export const { dbTableUser } = tables`,

    // Other exports
    `export function createTable() {}`,
    `export type User = { id: string }`,
  ],
  invalid: [
    // Missing dbTable prefix - exported
    {
      code: `export const user = pgTable('user', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'user',
          expected: 'dbTableUser',
          tableName: 'user',
        },
      }],
    },
    {
      code: `export const account = pgTable('account', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'account',
          expected: 'dbTableAccount',
          tableName: 'account',
        },
      }],
    },
    {
      code: `export const userProfile = pgTable('user_profile', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'userProfile',
          expected: 'dbTableUserProfile',
          tableName: 'user_profile',
        },
      }],
    },

    // Missing dbTable prefix - non-exported
    {
      code: `const user = pgTable('user', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'user',
          expected: 'dbTableUser',
          tableName: 'user',
        },
      }],
    },
    {
      code: `const userProfile = pgTable('user_profile', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'userProfile',
          expected: 'dbTableUserProfile',
          tableName: 'user_profile',
        },
      }],
    },

    // Wrong prefix patterns
    {
      code: `export const dbUser = pgTable('user', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbUser',
          expected: 'dbTableUser',
          tableName: 'user',
        },
      }],
    },
    {
      code: `export const userTable = pgTable('user', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'userTable',
          expected: 'dbTableUser',
          tableName: 'user',
        },
      }],
    },
    {
      code: `export const tableUser = pgTable('user', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'tableUser',
          expected: 'dbTableUser',
          tableName: 'user',
        },
      }],
    },
    {
      code: `const dbUser = pgTable('user', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbUser',
          expected: 'dbTableUser',
          tableName: 'user',
        },
      }],
    },

    // Entity not in PascalCase
    {
      code: `export const dbTableuser = pgTable('user', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbTableuser',
          expected: 'dbTableUser',
          tableName: 'user',
        },
      }],
    },
    {
      code: `export const dbTableUSER = pgTable('user', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbTableUSER',
          expected: 'dbTableUser',
          tableName: 'user',
        },
      }],
    },
    {
      code: `export const dbTableuserProfile = pgTable('user_profile', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbTableuserProfile',
          expected: 'dbTableUserProfile',
          tableName: 'user_profile',
        },
      }],
    },
    {
      code: `export const dbTableUserprofile = pgTable('user_profile', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbTableUserprofile',
          expected: 'dbTableUserProfile',
          tableName: 'user_profile',
        },
      }],
    },
    {
      code: `const dbTableuser = pgTable('user', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbTableuser',
          expected: 'dbTableUser',
          tableName: 'user',
        },
      }],
    },

    // Wrong entity name
    {
      code: `export const dbTableProduct = pgTable('user', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbTableProduct',
          expected: 'dbTableUser',
          tableName: 'user',
        },
      }],
    },
    {
      code: `export const dbTableUser = pgTable('account', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbTableUser',
          expected: 'dbTableAccount',
          tableName: 'account',
        },
      }],
    },
    {
      code: `const dbTableProduct = pgTable('user', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbTableProduct',
          expected: 'dbTableUser',
          tableName: 'user',
        },
      }],
    },

    // Snake_case conversion errors
    {
      code: `export const dbTableUser_Profile = pgTable('user_profile', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbTableUser_Profile',
          expected: 'dbTableUserProfile',
          tableName: 'user_profile',
        },
      }],
    },
    {
      code: `export const dbTableAccountverification = pgTable('account_verification', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbTableAccountverification',
          expected: 'dbTableAccountVerification',
          tableName: 'account_verification',
        },
      }],
    },

    // Case sensitivity on dbTable prefix
    {
      code: `export const dbtableUser = pgTable('user', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbtableUser',
          expected: 'dbTableUser',
          tableName: 'user',
        },
      }],
    },
    {
      code: `export const DbTableUser = pgTable('user', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'DbTableUser',
          expected: 'dbTableUser',
          tableName: 'user',
        },
      }],
    },
    {
      code: `export const DBTableUser = pgTable('user', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'DBTableUser',
          expected: 'dbTableUser',
          tableName: 'user',
        },
      }],
    },
    {
      code: `const dbtableUser = pgTable('user', {})`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbtableUser',
          expected: 'dbTableUser',
          tableName: 'user',
        },
      }],
    },

    // Destructuring from pgTable (not allowed)
    {
      code: `export const { dbTableUser } = pgTable('user', {})`,
      errors: [{
        messageId: 'noDestructuring',
        data: {
          expected: 'dbTableUser',
        },
      }],
    },
    {
      code: `export const { user } = pgTable('user', {})`,
      errors: [{
        messageId: 'noDestructuring',
        data: {
          expected: 'dbTableUser',
        },
      }],
    },
    {
      code: `const { dbTableUser } = pgTable('user', {})`,
      errors: [{
        messageId: 'noDestructuring',
        data: {
          expected: 'dbTableUser',
        },
      }],
    },
    {
      code: `const { user } = pgTable('user', {})`,
      errors: [{
        messageId: 'noDestructuring',
        data: {
          expected: 'dbTableUser',
        },
      }],
    },
  ],
})
