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
    `export const dbSchemaAccountSelect = createSelectSchema(dbTableAccount)`,
    `export const dbSchemaAccountInsert = createInsertSchema(dbTableAccount)`,
    `export const dbSchemaAccountUpdate = createUpdateSchema(dbTableAccount)`,
    `export const dbSchemaUserSelect = createSelectSchema(dbTableUser)`,
    `export const dbSchemaUserInsert = createInsertSchema(dbTableUser)`,
    `export const dbSchemaUserUpdate = createUpdateSchema(dbTableUser)`,
    `export const dbSchemaProductSelect = createSelectSchema(dbTableProduct)`,
    `export const dbSchemaProductInsert = createInsertSchema(dbTableProduct)`,
    `export const dbSchemaProductUpdate = createUpdateSchema(dbTableProduct)`,
    `export const dbSchemaOrderItemSelect = createSelectSchema(dbTableOrderItem)`,
    `export const dbSchemaOrderItemInsert = createInsertSchema(dbTableOrderItem)`,
    `export const dbSchemaOrderItemUpdate = createUpdateSchema(dbTableOrderItem)`,

    // Multi-word entities in PascalCase
    `export const dbSchemaUserProfileSelect = createSelectSchema(dbTableUserProfile)`,
    `export const dbSchemaShoppingCartSelect = createSelectSchema(dbTableShoppingCart)`,

    // Destructuring
    `export const { dbSchemaPostSelect } = createSelectSchema(dbTablePost)`,
    `export const { dbSchemaCommentInsert } = createInsertSchema(dbTableComment)`,

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
          expected: 'dbSchemaAccountSelect',
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
          expected: 'dbSchemaUserInsert',
          suffix: 'Insert',
          functionName: 'createInsertSchema',
        },
      }],
    },

    // Wrong suffix
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
      code: `export const dbSchemaUserSelect = createSelectSchema(dbTableAccount)`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbSchemaUserSelect',
          expected: 'dbSchemaAccountSelect',
          suffix: 'Select',
          functionName: 'createSelectSchema',
        },
      }],
    },
    {
      code: `export const dbSchemaProductInsert = createInsertSchema(dbTableUser)`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbSchemaProductInsert',
          expected: 'dbSchemaUserInsert',
          suffix: 'Insert',
          functionName: 'createInsertSchema',
        },
      }],
    },

    // Entity not in PascalCase
    {
      code: `export const dbSchemaaccountSelect = createSelectSchema(dbTableAccount)`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbSchemaaccountSelect',
          expected: 'dbSchemaAccountSelect',
          suffix: 'Select',
          functionName: 'createSelectSchema',
        },
      }],
    },
    {
      code: `export const dbSchemauserInsert = createInsertSchema(dbTableUser)`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbSchemauserInsert',
          expected: 'dbSchemaUserInsert',
          suffix: 'Insert',
          functionName: 'createInsertSchema',
        },
      }],
    },
    {
      code: `export const dbSchemaUSERSelect = createSelectSchema(dbTableUser)`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbSchemaUSERSelect',
          expected: 'dbSchemaUserSelect',
          suffix: 'Select',
          functionName: 'createSelectSchema',
        },
      }],
    },

    // Case sensitivity on dbSchema prefix
    {
      code: `export const dbschemaAccountSelect = createSelectSchema(dbTableAccount)`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbschemaAccountSelect',
          expected: 'dbSchemaAccountSelect',
          suffix: 'Select',
          functionName: 'createSelectSchema',
        },
      }],
    },
    {
      code: `export const DbSchemaAccountSelect = createSelectSchema(dbTableAccount)`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'DbSchemaAccountSelect',
          expected: 'dbSchemaAccountSelect',
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
          expected: 'dbSchemaAccountSelect',
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
      code: `export const { dbSchemaaccountSelect } = createSelectSchema(dbTableAccount)`,
      errors: [{
        messageId: 'invalidNaming',
        data: {
          actual: 'dbSchemaaccountSelect',
          expected: 'dbSchemaAccountSelect',
          suffix: 'Select',
          functionName: 'createSelectSchema',
        },
      }],
    },
  ],
})
