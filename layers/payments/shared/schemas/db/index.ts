import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { dbTableOrder, dbTableProduct, dbTableSubscription } from '~~/server/db/schemas/tables'

// Pattern: dbSchema<entity><operation>
export const dbSchemaProductSelect = createSelectSchema(dbTableProduct)
export const dbSchemaProductInsert = createInsertSchema(dbTableProduct)
export const dbSchemaProductUpdate = createUpdateSchema(dbTableProduct)

export const dbSchemaSubscriptionSelect = createSelectSchema(dbTableSubscription)
export const dbSchemaSubscriptionInsert = createInsertSchema(dbTableSubscription)
export const dbSchemaSubscriptionUpdate = createUpdateSchema(dbTableSubscription)

export const dbSchemaOrderSelect = createSelectSchema(dbTableOrder)
export const dbSchemaOrderInsert = createInsertSchema(dbTableOrder)
export const dbSchemaOrderUpdate = createUpdateSchema(dbTableOrder)

// Pattern: DB<entity><operation>
export type DBProductSelect = InferSelectModel<typeof dbTableProduct>
export type DBProductInsert = InferInsertModel<typeof dbTableProduct>

export type DBSSubscriptionSelect = InferSelectModel<typeof dbTableSubscription>
export type DBSubscriptionInsert = InferInsertModel<typeof dbTableSubscription>

export type DBOrderSelect = InferSelectModel<typeof dbTableOrder>
export type DBOrderInsert = InferInsertModel<typeof dbTableOrder>
