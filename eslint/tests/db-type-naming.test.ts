import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe } from 'vitest'
import { dbTypeNaming } from '../rules/db-type-naming'

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

ruleTester.run('db-type-naming', dbTypeNaming, {
  valid: [
    // Correct InferSelectModel pattern
    `export type DBSelectUser = InferSelectModel<typeof dbTableUser>`,
    `export type DBSelectAccount = InferSelectModel<typeof dbTableAccount>`,
    `export type DBSelectProduct = InferSelectModel<typeof dbTableProduct>`,
    `export type DBSelectPost = InferSelectModel<typeof dbTablePost>`,

    // Correct InferInsertModel pattern
    `export type DBInsertUser = InferInsertModel<typeof dbTableUser>`,
    `export type DBInsertAccount = InferInsertModel<typeof dbTableAccount>`,
    `export type DBInsertProduct = InferInsertModel<typeof dbTableProduct>`,
    `export type DBInsertPost = InferInsertModel<typeof dbTablePost>`,

    // Multi-word entities in PascalCase
    `export type DBSelectUserProfile = InferSelectModel<typeof dbTableUserProfile>`,
    `export type DBInsertUserProfile = InferInsertModel<typeof dbTableUserProfile>`,
    `export type DBSelectAccountVerification = InferSelectModel<typeof dbTableAccountVerification>`,
    `export type DBInsertAccountVerification = InferInsertModel<typeof dbTableAccountVerification>`,
    `export type DBSelectShoppingCart = InferSelectModel<typeof dbTableShoppingCart>`,
    `export type DBInsertOrderItem = InferInsertModel<typeof dbTableOrderItem>`,

    // Non-Infer types (should be ignored)
    `export type User = { id: string }`,
    `export type SelectUser = Pick<User, 'id'>`,
    `export type InsertUser = Omit<User, 'id'>`,
    `export type UserWithProfile = User & Profile`,

    // Non-exported types
    `type DBSelectUser = InferSelectModel<typeof dbTableUser>`,

    // Other exports
    `export const dbTableUser = pgTable('user', {})`,
    `export function getUser() {}`,
  ],
  invalid: [
    // Missing DB prefix - InferSelectModel
    {
      code: `export type SelectUser = InferSelectModel<typeof dbTableUser>`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'SelectUser',
          expected: 'DBSelectUser',
          prefix: 'DBSelect',
          typeName: 'InferSelectModel',
        },
      }],
    },
    {
      code: `export type User = InferSelectModel<typeof dbTableUser>`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'User',
          expected: 'DBSelectUser',
          prefix: 'DBSelect',
          typeName: 'InferSelectModel',
        },
      }],
    },

    // Missing DB prefix - InferInsertModel
    {
      code: `export type InsertUser = InferInsertModel<typeof dbTableUser>`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'InsertUser',
          expected: 'DBInsertUser',
          prefix: 'DBInsert',
          typeName: 'InferInsertModel',
        },
      }],
    },
    {
      code: `export type User = InferInsertModel<typeof dbTableUser>`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'User',
          expected: 'DBInsertUser',
          prefix: 'DBInsert',
          typeName: 'InferInsertModel',
        },
      }],
    },

    // Wrong prefix pattern
    {
      code: `export type DbSelectUser = InferSelectModel<typeof dbTableUser>`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'DbSelectUser',
          expected: 'DBSelectUser',
          prefix: 'DBSelect',
          typeName: 'InferSelectModel',
        },
      }],
    },
    {
      code: `export type dbSelectUser = InferSelectModel<typeof dbTableUser>`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbSelectUser',
          expected: 'DBSelectUser',
          prefix: 'DBSelect',
          typeName: 'InferSelectModel',
        },
      }],
    },
    {
      code: `export type DBInsertuser = InferInsertModel<typeof dbTableUser>`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'DBInsertuser',
          expected: 'DBInsertUser',
          prefix: 'DBInsert',
          typeName: 'InferInsertModel',
        },
      }],
    },

    // Wrong type mapping (Insert vs Select)
    {
      code: `export type DBInsertUser = InferSelectModel<typeof dbTableUser>`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'DBInsertUser',
          expected: 'DBSelectUser',
          prefix: 'DBSelect',
          typeName: 'InferSelectModel',
        },
      }],
    },
    {
      code: `export type DBSelectUser = InferInsertModel<typeof dbTableUser>`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'DBSelectUser',
          expected: 'DBInsertUser',
          prefix: 'DBInsert',
          typeName: 'InferInsertModel',
        },
      }],
    },

    // Wrong entity name
    {
      code: `export type DBSelectProduct = InferSelectModel<typeof dbTableUser>`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'DBSelectProduct',
          expected: 'DBSelectUser',
          prefix: 'DBSelect',
          typeName: 'InferSelectModel',
        },
      }],
    },
    {
      code: `export type DBInsertAccount = InferInsertModel<typeof dbTableUser>`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'DBInsertAccount',
          expected: 'DBInsertUser',
          prefix: 'DBInsert',
          typeName: 'InferInsertModel',
        },
      }],
    },

    // Entity not in PascalCase
    {
      code: `export type DBSelectuser = InferSelectModel<typeof dbTableUser>`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'DBSelectuser',
          expected: 'DBSelectUser',
          prefix: 'DBSelect',
          typeName: 'InferSelectModel',
        },
      }],
    },
    {
      code: `export type DBSelectUSER = InferSelectModel<typeof dbTableUser>`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'DBSelectUSER',
          expected: 'DBSelectUser',
          prefix: 'DBSelect',
          typeName: 'InferSelectModel',
        },
      }],
    },
    {
      code: `export type DBInsertUSER = InferInsertModel<typeof dbTableUser>`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'DBInsertUSER',
          expected: 'DBInsertUser',
          prefix: 'DBInsert',
          typeName: 'InferInsertModel',
        },
      }],
    },

    // Multi-word entity errors
    {
      code: `export type DBSelectuserProfile = InferSelectModel<typeof dbTableUserProfile>`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'DBSelectuserProfile',
          expected: 'DBSelectUserProfile',
          prefix: 'DBSelect',
          typeName: 'InferSelectModel',
        },
      }],
    },
    {
      code: `export type DBSelectUserprofile = InferSelectModel<typeof dbTableUserProfile>`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'DBSelectUserprofile',
          expected: 'DBSelectUserProfile',
          prefix: 'DBSelect',
          typeName: 'InferSelectModel',
        },
      }],
    },
    {
      code: `export type DBInsertAccountverification = InferInsertModel<typeof dbTableAccountVerification>`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'DBInsertAccountverification',
          expected: 'DBInsertAccountVerification',
          prefix: 'DBInsert',
          typeName: 'InferInsertModel',
        },
      }],
    },

    // Wrong order (entity before type)
    {
      code: `export type UserDBSelect = InferSelectModel<typeof dbTableUser>`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'UserDBSelect',
          expected: 'DBSelectUser',
          prefix: 'DBSelect',
          typeName: 'InferSelectModel',
        },
      }],
    },
    {
      code: `export type UserDBInsert = InferInsertModel<typeof dbTableUser>`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'UserDBInsert',
          expected: 'DBInsertUser',
          prefix: 'DBInsert',
          typeName: 'InferInsertModel',
        },
      }],
    },
  ],
})
