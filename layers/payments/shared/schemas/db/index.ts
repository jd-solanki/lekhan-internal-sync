import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { dbTablePolarOrder, dbTablePolarProduct, dbTablePolarSubscription } from '~~/server/db/schemas/tables'

export const dbSchemaSelectPolarProduct = createSelectSchema(dbTablePolarProduct)
export const dbSchemaInsertPolarProduct = createInsertSchema(dbTablePolarProduct)
export const dbSchemaUpdatePolarProduct = createUpdateSchema(dbTablePolarProduct)

export const dbSchemaSelectPolarSubscription = createSelectSchema(dbTablePolarSubscription)
export const dbSchemaInsertPolarSubscription = createInsertSchema(dbTablePolarSubscription)
export const dbSchemaUpdatePolarSubscription = createUpdateSchema(dbTablePolarSubscription)

export const dbSchemaSelectPolarOrder = createSelectSchema(dbTablePolarOrder)
export const dbSchemaInsertPolarOrder = createInsertSchema(dbTablePolarOrder)
export const dbSchemaUpdatePolarOrder = createUpdateSchema(dbTablePolarOrder)

export type DBSelectPolarProduct = InferSelectModel<typeof dbTablePolarProduct>
export type DBInsertPolarProduct = InferInsertModel<typeof dbTablePolarProduct>

export type DBSelectPolarSubscription = InferSelectModel<typeof dbTablePolarSubscription>
export type DBInsertPolarSubscription = InferInsertModel<typeof dbTablePolarSubscription>

export type DBSelectPolarOrder = InferSelectModel<typeof dbTablePolarOrder>
export type DBInsertPolarOrder = InferInsertModel<typeof dbTablePolarOrder>
