import type { WebhookCustomerCreatedPayload } from '@polar-sh/sdk/models/components/webhookcustomercreatedpayload'
import type { WebhookEventType } from '@polar-sh/sdk/models/components/webhookeventtype'
import type { WebhookOrderCreatedPayload } from '@polar-sh/sdk/models/components/webhookordercreatedpayload'
import type { WebhookOrderPaidPayload } from '@polar-sh/sdk/models/components/webhookorderpaidpayload'
import type { WebhookOrderRefundedPayload } from '@polar-sh/sdk/models/components/webhookorderrefundedpayload'
import type { WebhookOrderUpdatedPayload } from '@polar-sh/sdk/models/components/webhookorderupdatedpayload'
import type { WebhookProductCreatedPayload } from '@polar-sh/sdk/models/components/webhookproductcreatedpayload'
import type { WebhookProductUpdatedPayload } from '@polar-sh/sdk/models/components/webhookproductupdatedpayload'
import type { WebhookSubscriptionActivePayload } from '@polar-sh/sdk/models/components/webhooksubscriptionactivepayload'
import type { WebhookSubscriptionCanceledPayload } from '@polar-sh/sdk/models/components/webhooksubscriptioncanceledpayload'
import type { WebhookSubscriptionCreatedPayload } from '@polar-sh/sdk/models/components/webhooksubscriptioncreatedpayload'
import type { WebhookSubscriptionRevokedPayload } from '@polar-sh/sdk/models/components/webhooksubscriptionrevokedpayload'
import type { WebhookSubscriptionUncanceledPayload } from '@polar-sh/sdk/models/components/webhooksubscriptionuncanceledpayload'
import type { WebhookSubscriptionUpdatedPayload } from '@polar-sh/sdk/models/components/webhooksubscriptionupdatedpayload'

export interface PolarWebhookEvent<T extends Record<string, any> = Record<string, any>> {
  type: WebhookEventType
  timestamp: string
  data: T
}

export type PolarEventHandler<T extends Record<string, any> = Record<string, any>> = (event: PolarWebhookEvent<T>) => Promise<void>

export type PolarWebhookEventDataMap = Record<WebhookEventType, Record<string, any>> & {
  'customer.created': WebhookCustomerCreatedPayload['data']
  'product.created': WebhookProductCreatedPayload['data']
  'product.updated': WebhookProductUpdatedPayload['data']
  'subscription.active': WebhookSubscriptionActivePayload['data']
  'subscription.canceled': WebhookSubscriptionCanceledPayload['data']
  'subscription.created': WebhookSubscriptionCreatedPayload['data']
  'subscription.revoked': WebhookSubscriptionRevokedPayload['data']
  'subscription.uncanceled': WebhookSubscriptionUncanceledPayload['data']
  'subscription.updated': WebhookSubscriptionUpdatedPayload['data']
  'order.created': WebhookOrderCreatedPayload['data']
  'order.paid': WebhookOrderPaidPayload['data']
  'order.updated': WebhookOrderUpdatedPayload['data']
  'order.refunded': WebhookOrderRefundedPayload['data']
}

export type PolarEventHandlerMap = {
  [K in WebhookEventType]: PolarEventHandler<PolarWebhookEventDataMap[K]>
}

export type PolarWebhookEventForType<K extends WebhookEventType> = PolarWebhookEvent<PolarWebhookEventDataMap[K]> & {
  type: K
}

export type PolarWebhookEventUnion = {
  [K in WebhookEventType]: PolarWebhookEventForType<K>
}[WebhookEventType]
