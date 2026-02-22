import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe } from 'vitest'
import { dbZodSchemaNaming } from '../rules/db-zod-schema-naming'

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

ruleTester.run('db-zod-schema-naming', dbZodSchemaNaming, {
  valid: [
    // Correct naming with dbTable prefix
    `export const dbSchemaSelectAccount = createSelectSchema(dbTableAccount)`,
    `export const dbSchemaInsertAccount = createInsertSchema(dbTableAccount)`,
    `export const dbSchemaUpdateAccount = createUpdateSchema(dbTableAccount)`,
    `export const dbSchemaSelectUser = createSelectSchema(dbTableUser)`,
    `export const dbSchemaInsertUser = createInsertSchema(dbTableUser)`,
    `export const dbSchemaUpdateUser = createUpdateSchema(dbTableUser)`,
    `export const dbSchemaSelectProduct = createSelectSchema(dbTableProduct)`,
    `export const dbSchemaInsertProduct = createInsertSchema(dbTableProduct)`,
    `export const dbSchemaUpdateProduct = createUpdateSchema(dbTableProduct)`,
    `export const dbSchemaSelectOrderItem = createSelectSchema(dbTableOrderItem)`,
    `export const dbSchemaInsertOrderItem = createInsertSchema(dbTableOrderItem)`,
    `export const dbSchemaUpdateOrderItem = createUpdateSchema(dbTableOrderItem)`,

    // Multi-word entities in PascalCase
    `export const dbSchemaSelectUserProfile = createSelectSchema(dbTableUserProfile)`,
    `export const dbSchemaSelectShoppingCart = createSelectSchema(dbTableShoppingCart)`,

    // Destructuring
    `export const { dbSchemaSelectPost } = createSelectSchema(dbTablePost)`,
    `export const { dbSchemaInsertComment } = createInsertSchema(dbTableComment)`,

    // Non-schema exports (should be ignored)
    `export const accountTable = pgTable('account', {})`,
    `export const config = { database: 'postgres' }`,
    `export const SOME_CONSTANT = 'value'`,
    `export const helper = () => {}`,
    `export const wrongName = someOtherFunction()`,

    // Not exported
    `const localSchema = createSelectSchema(dbTableAccount)`,

    // Other exports
    `export function createSchema() {}`,
    `export type DBSelectAccount = InferSelectModel<typeof dbTableAccount>`,
  ],
  invalid: [
    // Missing dbSchema prefix
    {
      code: `export const accountSelect = createSelectSchema(dbTableAccount)`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'accountSelect',
          expected: 'dbSchemaSelectAccount',
          suffix: 'Select',
          functionName: 'createSelectSchema',
        },
      }],
    },
    {
      code: `export const userInsert = createInsertSchema(dbTableUser)`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'userInsert',
          expected: 'dbSchemaInsertUser',
          suffix: 'Insert',
          functionName: 'createInsertSchema',
        },
      }],
    },

    // Wrong operation position (old dbSchema<Entity><Op> style)
    {
      code: `export const dbSchemaAccountInsert = createSelectSchema(dbTableAccount)`,
      errors: [{
        messageId: 'wrongSuffix',
        data: {
          actual: 'dbSchemaAccountInsert',
          expectedSuffix: 'Select',
          functionName: 'createSelectSchema',
        },
      }],
    },
    {
      code: `export const dbSchemaUserSelect = createInsertSchema(dbTableUser)`,
      errors: [{
        messageId: 'wrongSuffix',
        data: {
          actual: 'dbSchemaUserSelect',
          expectedSuffix: 'Insert',
          functionName: 'createInsertSchema',
        },
      }],
    },
    {
      code: `export const dbSchemaProductInsert = createUpdateSchema(dbTableProduct)`,
      errors: [{
        messageId: 'wrongSuffix',
        data: {
          actual: 'dbSchemaProductInsert',
          expectedSuffix: 'Update',
          functionName: 'createUpdateSchema',
        },
      }],
    },

    // Wrong entity name
    {
      code: `export const dbSchemaSelectUser = createSelectSchema(dbTableAccount)`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbSchemaSelectUser',
          expected: 'dbSchemaSelectAccount',
          suffix: 'Select',
          functionName: 'createSelectSchema',
        },
      }],
    },
    {
      code: `export const dbSchemaInsertProduct = createInsertSchema(dbTableUser)`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbSchemaInsertProduct',
          expected: 'dbSchemaInsertUser',
          suffix: 'Insert',
          functionName: 'createInsertSchema',
        },
      }],
    },

    // Entity not in PascalCase
    {
      code: `export const dbSchemaSelectaccount = createSelectSchema(dbTableAccount)`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbSchemaSelectaccount',
          expected: 'dbSchemaSelectAccount',
          suffix: 'Select',
          functionName: 'createSelectSchema',
        },
      }],
    },
    {
      code: `export const dbSchemaInsertuser = createInsertSchema(dbTableUser)`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbSchemaInsertuser',
          expected: 'dbSchemaInsertUser',
          suffix: 'Insert',
          functionName: 'createInsertSchema',
        },
      }],
    },
    {
      code: `export const dbSchemaSelectUSER = createSelectSchema(dbTableUser)`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbSchemaSelectUSER',
          expected: 'dbSchemaSelectUser',
          suffix: 'Select',
          functionName: 'createSelectSchema',
        },
      }],
    },

    // Case sensitivity on dbSchema prefix
    {
      code: `export const dbschemaSelectAccount = createSelectSchema(dbTableAccount)`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbschemaSelectAccount',
          expected: 'dbSchemaSelectAccount',
          suffix: 'Select',
          functionName: 'createSelectSchema',
        },
      }],
    },
    {
      code: `export const DbSchemaSelectAccount = createSelectSchema(dbTableAccount)`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'DbSchemaSelectAccount',
          expected: 'dbSchemaSelectAccount',
          suffix: 'Select',
          functionName: 'createSelectSchema',
        },
      }],
    },

    // Destructuring violations
    {
      code: `export const { accountSelect } = createSelectSchema(dbTableAccount)`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'accountSelect',
          expected: 'dbSchemaSelectAccount',
          suffix: 'Select',
          functionName: 'createSelectSchema',
        },
      }],
    },
    {
      code: `export const { dbSchemaAccountInsert } = createSelectSchema(dbTableAccount)`,
      errors: [{
        messageId: 'wrongSuffix',
        data: {
          actual: 'dbSchemaAccountInsert',
          expectedSuffix: 'Select',
          functionName: 'createSelectSchema',
        },
      }],
    },
    {
      code: `export const { dbSchemaSelectaccount } = createSelectSchema(dbTableAccount)`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbSchemaSelectaccount',
          expected: 'dbSchemaSelectAccount',
          suffix: 'Select',
          functionName: 'createSelectSchema',
        },
      }],
    },
  ],
})
