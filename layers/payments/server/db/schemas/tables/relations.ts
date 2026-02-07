import {
  dbTablePolarOrder,
  dbTablePolarProduct,
  dbTableUser,
} from '#server/db/schemas/tables'
import { relations } from 'drizzle-orm'
import { dbTablePolarSubscription } from '~~/layers/payments/server/db/schemas/tables/subscription'

export const dbTablePolarOrderRelations = relations(dbTablePolarOrder, ({ one }) => ({
  user: one(dbTableUser, {
    fields: [dbTablePolarOrder.userId],
    references: [dbTableUser.id],
  }),
  product: one(dbTablePolarProduct, {
    fields: [dbTablePolarOrder.productId],
    references: [dbTablePolarProduct.id],
  }),
  subscription: one(dbTablePolarSubscription, {
    fields: [dbTablePolarOrder.subscriptionId],
    references: [dbTablePolarSubscription.id],
  }),
}))

export const dbTablePolarProductRelations = relations(dbTablePolarProduct, ({ many }) => ({
  orders: many(dbTablePolarOrder),
  subscriptions: many(dbTablePolarSubscription),
}))

export const dbTablePolarSubscriptionRelations = relations(dbTablePolarSubscription, ({ one, many }) => ({
  user: one(dbTableUser, {
    fields: [dbTablePolarSubscription.userId],
    references: [dbTableUser.id],
  }),
  product: one(dbTablePolarProduct, {
    fields: [dbTablePolarSubscription.productId],
    references: [dbTablePolarProduct.id],
  }),
  orders: many(dbTablePolarOrder),
}))

export const dbTableUserRelations = relations(dbTableUser, ({ many }) => ({
  polarOrders: many(dbTablePolarOrder),
  polarSubscriptions: many(dbTablePolarSubscription),
}))
