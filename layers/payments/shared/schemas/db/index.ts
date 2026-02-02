import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { dbTablePolarOrder, dbTablePolarProduct, dbTablePolarSubscription } from '~~/server/db/schemas/tables'

export const dbSchemaPolarProductSelect = createSelectSchema(dbTablePolarProduct)
export const dbSchemaPolarProductInsert = createInsertSchema(dbTablePolarProduct)
export const dbSchemaPolarProductUpdate = createUpdateSchema(dbTablePolarProduct)

export const dbSchemaPolarSubscriptionSelect = createSelectSchema(dbTablePolarSubscription)
export const dbSchemaPolarSubscriptionInsert = createInsertSchema(dbTablePolarSubscription)
export const dbSchemaPolarSubscriptionUpdate = createUpdateSchema(dbTablePolarSubscription)

export const dbSchemaPolarOrderSelect = createSelectSchema(dbTablePolarOrder)
export const dbSchemaPolarOrderInsert = createInsertSchema(dbTablePolarOrder)
export const dbSchemaPolarOrderUpdate = createUpdateSchema(dbTablePolarOrder)

export type DBSelectPolarProduct = InferSelectModel<typeof dbTablePolarProduct>
export type DBInsertPolarProduct = InferInsertModel<typeof dbTablePolarProduct>

export type DBSelectPolarSubscription = InferSelectModel<typeof dbTablePolarSubscription>
export type DBInsertPolarSubscription = InferInsertModel<typeof dbTablePolarSubscription>

export type DBSelectPolarOrder = InferSelectModel<typeof dbTablePolarOrder>
export type DBInsertPolarOrder = InferInsertModel<typeof dbTablePolarOrder>
