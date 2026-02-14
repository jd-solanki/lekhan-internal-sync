# Payments Module

Manages payment processing, subscription lifecycle, and order tracking through Polar platform integration for both authenticated users and guests.

## Responsibility

> _Defines precisely what this module owns and what it must never own. Prevents responsibility drift and boundary violations._

**This module is responsible for:**

- Processing payments and checkouts via Polar SDK for one-time purchases and recurring subscriptions
- Managing product catalog synchronized from Polar (recurring and one-time products)
- Tracking subscription lifecycle (active, trialing, canceled, ended) with period management
- Recording and updating order history with payment status, amounts, and billing details
- Handling Polar webhook events to keep local database synchronized with payment provider state
- Providing customer billing portal access for subscription and payment management
- Supporting both authenticated user checkouts and guest checkouts (configuration-dependent)
- Syncing products, subscriptions, and orders between Polar and local database
- Managing subscription modifications (cancel, resume, update)
- Tracking usage for metered billing capabilities

## Domain Model

> _Defines entities this module owns, their relationships, and semantic meaning. Focus on WHAT data represents, never HOW it's stored._

### Entities

#### Product

**Meaning:** Represents a purchasable offering synchronized from Polar, either one-time purchase or recurring subscription.

**Key Attributes:**

- **polarId**: Unique identifier from Polar platform, immutable, used for synchronization
- **name**: Product display name, set in Polar dashboard
- **description**: Product description text, optional
- **isRecurring**: Boolean indicating subscription vs one-time purchase, immutable after creation
- **recurringInterval**: For subscriptions—billing cycle unit (month, year), null for one-time products
- **trialInterval**: Trial period unit (day, month), optional for subscriptions
- **isArchived**: Product archived status in Polar, archived products not displayed to new customers
- **prices**: JSON array of price points with amounts and currencies
- **benefits**: JSON array of product benefits/features

**Lifecycle Rules:**

- Created when Polar webhooks arrive or via manual sync task
- Updated when Polar sends product updates
- Local record synchronized from Polar as single source of truth for product definition
- Archiving product in Polar marks isArchived=true; archived products excluded from active catalog
- Deletion not supported—products archived instead to preserve order/subscription history integrity
- Pricing and benefits managed in Polar dashboard, synced to local database as read-only reference

#### Subscription

**Meaning:** Represents recurring payment agreement between customer and organization for ongoing product access.

**Key Attributes:**

- **polarId**: Unique identifier from Polar platform, immutable
- **userId**: Reference to User from Auth Module, null if guest checkout, populated when guest converts
- **productId**: Reference to Product being subscribed to
- **status**: Current subscription state—`active`, `trialing`, `canceled`, `past_due`, `incomplete`, `incomplete_expired`, `unpaid`, `paused`
- **amount**: Recurring billing amount in smallest currency unit (cents)
- **currency**: Three-letter currency code (USD, EUR, etc.)
- **recurringInterval**: Billing cycle unit (month, year)
- **currentPeriodStart**: Start timestamp of current billing period
- **currentPeriodEnd**: End timestamp of current billing period, subscription renews at this time
- **cancelAtPeriodEnd**: Boolean—true if subscription will not renew after current period (soft cancel)
- **canceledAt**: Timestamp when cancellation initiated
- **endsAt**: Scheduled end timestamp if subscription set to end

**Lifecycle Rules:**

- Created when customer completes checkout or via Polar webhook synchronization
- Status transitions triggered by webhook events from Polar
- Soft cancellation sets cancelAtPeriodEnd=true, subscription remains active until currentPeriodEnd
- Resume cancellation sets cancelAtPeriodEnd=false, subscription continues renewing
- Hard cancellation sets status=canceled and endsAt timestamp
- Trial subscriptions have status=trialing until trial ends, then transition to active or canceled
- Guest subscriptions (userId=null) can be claimed when guest creates account via polarCustomerId matching
- Subscription updates (plan changes, seat modifications) sync via webhooks
- Current period advances on successful renewal, new currentPeriodStart and currentPeriodEnd set
- Failed payments may transition to past_due or unpaid status depending on Polar retry settings

#### Order

**Meaning:** Represents completed or pending payment transaction for product purchase, either one-time or subscription billing cycle.

**Key Attributes:**

- **polarId**: Unique identifier from Polar platform, immutable
- **userId**: Reference to User from Auth Module, null if guest checkout
- **productId**: Reference to purchased Product
- **subscriptionId**: Reference to Subscription if order is subscription billing event, null for one-time purchases
- **status**: Order status—`pending`, `paid`, `failed`, `refunded`, `partially_refunded`
- **paid**: Boolean—true if order fully paid
- **billingReason**: Reason for charge—`purchase`, `subscription_create`, `subscription_cycle`, `subscription_update`
- **totalAmount**: Final amount charged in smallest currency unit
- **currency**: Three-letter currency code
- **refundedAmount**: Amount refunded if partial/full refund issued

**Lifecycle Rules:**

- Created when customer initiates checkout or via Polar webhook synchronization
- Status transitions: pending → paid (on successful payment) or pending → failed (on payment failure)
- Paid orders trigger fulfillment workflows via webhook processing
- Refunds update refundedAmount, status becomes refunded or partially_refunded
- Guest orders (userId=null) can be associated with user when guest registers via polarCustomerId
- Subscription orders link to subscription via subscriptionId for renewal tracking
- One-time purchase orders have subscriptionId=null
- Order amounts immutable after payment completion except for refund fields

### Relationships

**Within Module:**

- **Order** → **Product**: Many-to-one (many orders can reference same product)
  - **Meaning**: Orders record which product was purchased
  - **Integrity Rule**: Product must exist before order created; product archival does not delete historical orders

- **Order** → **Subscription**: Many-to-one optional (subscription billing generates multiple orders)
  - **Meaning**: Recurring subscription billing creates new order each cycle
  - **Integrity Rule**: One-time purchase orders have no subscription; subscription orders link to parent subscription for lifecycle context

- **Subscription** → **Product**: Many-to-one (many subscriptions can be for same product)
  - **Meaning**: Subscriptions define recurring access to product
  - **Integrity Rule**: Product must exist before subscription created; product archival prevents new subscriptions but does not cancel existing

**Cross-Module References:**

- **Product/Subscription/Order** → **User** (Auth Module): Many-to-one optional
  - **Integration Point**: Payments Module stores `userId` reference to Auth Module's user table
  - **Contract**: If `POLAR_CHECKOUT_FOR_AUTHENTICATED_USERS_ONLY=true` environment variable set, userId required; otherwise nullable to support guest checkouts. Guest orders/subscriptions associated with user when guest registers by matching polarCustomerId.

- **Payments Module** ↔ **Polar Platform** (External): Bidirectional synchronization
  - **Integration Point**: Polar webhooks push events to `/api/webhooks/polar`, Payments Module calls Polar SDK APIs
  - **Contract**: Polar is authoritative source for product definitions, payment state, and subscription status. Local database maintains synchronized copy for query performance and offline access. Webhook signature validation required for security.

### Business Rules & Invariants

> _Domain constraints that must always hold true. These are module-level rules distinct from product-wide rules._

- **Single source of truth**: Polar platform is authoritative for product definitions, payment status, and subscription state—local database is synchronized cache
- **Webhook idempotency**: Processing same webhook event multiple times must produce identical database state (use polarModifiedAt timestamp to detect stale updates)
- **User isolation for authenticated**: If user authenticated at checkout, they can only access their own orders/subscriptions (enforced by userId match with session)
- **Guest to user migration**: Guest orders/subscriptions can be claimed by newly registered user if polarCustomerId matches
- **Subscription single active**: User can have multiple subscriptions but typically only one active subscription per product at a time
- **Soft cancel grace period**: Canceled subscriptions with cancelAtPeriodEnd=true remain active until currentPeriodEnd
- **Product sync before dependencies**: Products must sync before orders/subscriptions referencing them (enforced in webhook handlers and sync tasks)
- **Order immutability post-payment**: Paid order amounts cannot be modified except for refund fields
- **Currency consistency**: All amounts for single order/subscription must use same currency
- **Webhook signature validation**: All incoming Polar webhooks must pass signature verification before processing
- **Stale update prevention**: Incoming webhook data rejected if polarModifiedAt older than existing local record
- **Admin notification on failure**: Webhook processing failures and invalid payloads trigger email alerts to administrators

## Module Dependencies

> _Which other modules this module depends on, and why. Must align with product README dependency graph._

**Depends on:**

- **01.base Module**: For database utilities, shared composables, environment configuration, and foundational primitives
  - **Reason**: Payments uses base database schemas, mixins (id, createdAt, updatedAt), environment variable access, and shared utility functions

- **Auth Module**: For user authentication, session validation, and user identity management
  - **Reason**: Authenticated checkouts require user context; orders/subscriptions link to users via userId; customer portal requires session validation. Guest checkout support means dependency is soft—payments can function without user at checkout, associated later.

**Depended on by:**

- No other modules currently depend on Payments Module
- **Potential future dependents**: Any module needing subscription status checks (feature gating, analytics, usage tracking)

**Integration Contract:**

- Other modules should not directly access payment database tables—instead call Payments Module APIs
- Subscription status queries exposed via `/api/polar/subscriptions` for feature gating use cases
- Order/subscription data considered user-private—access requires authentication and ownership verification
- Product catalog publicly accessible via `/api/polar/products` for marketing/pricing pages

## UX Philosophy

> _If module has user-facing components, define interaction principles. Frontend modules MUST have this section. Backend-only modules can omit._

**Core Interaction Principles:**

- **Transparent subscription control**: Users clearly see subscription status, next billing date, and cancellation consequences before taking action
- **Soft cancellation preference**: Cancel requests preserve access until period end rather than immediate termination, reducing accidental disruption
- **Reversible cancellation**: Scheduled cancellations can be undone via "Resume" action while subscription still active, forgiving user indecision
- **Billing clarity**: Display all amounts, taxes, discounts, and billing dates explicitly—no surprise charges
- **Polar-native flows**: Checkout and customer portal leverage Polar's hosted pages for security and PCI compliance—minimal custom payment UI
- **Guest checkout flexibility**: Support anonymous purchases when configured, allowing faster conversion without forced registration
- **Graceful Polar integration**: Payment flows redirect to Polar-hosted checkout, return to success page with clear confirmation
- **Progressive disclosure**: Show active subscription details prominently, archive/history behind secondary navigation

## Frontend Pages

> _User-facing pages this module provides. Backend-only modules can omit this section. Detailed specs live in `frontend/pages/` subdirectories._
>
> _**SEO & Routing Convention**: Use semantic, descriptive URLs following Nuxt's filesystem-based routing. URLs should reflect page purpose and create logical hierarchy for both users and search engines._

**Pages:**

- **/app/billing**: Main billing dashboard displaying active subscription status, one-time purchases, plan details, and subscription management actions (cancel/resume)

- **/polar/customer-portal**: Redirects authenticated user to Polar-hosted customer portal for managing payment methods, viewing invoices, and updating billing information

- **/polar/success**: Post-checkout success page confirming payment completed, displays order details and next steps

## API Surface

> _High-level overview of capabilities exposed to other modules or external clients. Detailed specs live in `backend/api/` subdirectories._

**Capabilities:**

- **Product catalog queries**: List and retrieve product offerings with pricing and metadata
- **Subscription management**: List, detail, update, cancel, and sync subscription data
- **Order management**: List and sync order history
- **Customer state queries**: Retrieve customer payment and subscription state
- **Webhook integration**: Real-time Polar event processing for product updates, subscription lifecycle events, and order status changes

## Glossary

> _Module-specific terminology. Product-wide terms live in product README. Only define terms unique to this module's domain._

**Module-specific terms:**

- **Polar**: Payment platform (polar.sh) providing checkout, subscription management, and payment processing infrastructure—NuxtStart integrates via Polar SDK and webhooks
- **Polar Customer ID** (`polarCustomerId`): Unique customer identifier in Polar platform, used to link NuxtStart users with Polar payment accounts—enables guest-to-user conversion
- **Soft Cancellation**: Subscription cancellation that preserves access until end of current billing period (`cancelAtPeriodEnd=true`)—user can resume before period ends
- **Hard Cancellation**: Immediate subscription termination (status=canceled, endedAt set)—typically admin action or payment failure after retries
- **Guest Checkout**: Payment flow allowing unauthenticated users to purchase without registration—order/subscription created with userId=null, associated when guest registers via polarCustomerId match
- **Authenticated-Only Checkout**: Payment flow requiring user login before purchase—enforced via `POLAR_CHECKOUT_FOR_AUTHENTICATED_USERS_ONLY` environment variable
- **Billing Cycle**: Recurring interval for subscription charges (e.g., monthly, annually)—defined by recurringInterval and recurringIntervalCount
- **Billing Reason**: Categorization of why order created—`purchase` (one-time), `subscription_create` (initial subscription), `subscription_cycle` (renewal), `subscription_update` (plan change)
- **Webhook Idempotency**: Guarantee that processing same webhook event multiple times produces identical result—achieved by checking polarModifiedAt timestamp before updating
- **Stale Update**: Incoming webhook data older than existing local record based on polarModifiedAt comparison—rejected to prevent overwriting newer state with older data
- **Product Sync**: Process of fetching product definitions from Polar and updating local database—triggered by webhook or manual sync task
- **Customer Portal**: Polar-hosted page where customers manage payment methods, view invoices, and update billing info—accessed via redirect from NuxtStart billing page
- **Metered Billing**: Usage-based subscription pricing where charges calculated from consumption metrics tracked in subscription meters

_Product-wide terms (User, API, Module, Layer) defined in product README._

## Notes for Future AI Agents

- **This document defines module-level WHAT, never HOW**
- **All module behavioral truth flows from here**
- **Polar is authoritative source**: Local database is synchronized cache, never modify payment state locally without Polar API call
- **Webhook security critical**: All webhook endpoints must validate Polar signature before processing
- **Guest checkout is optional**: Environment variable `POLAR_CHECKOUT_FOR_AUTHENTICATED_USERS_ONLY` controls whether userId required—check before assuming user presence
- **Timestamp comparison prevents races**: Always check polarModifiedAt before updating to avoid overwriting newer data with stale webhook
- **Product sync dependency**: Products must exist before orders/subscriptions can reference them—sync products first in webhook handlers
- **Error notifications required**: Webhook/sync failures must alert admins via email for manual investigation
- **Currency amounts in cents**: All monetary amounts stored as integers in smallest currency unit (cents for USD)—convert to decimal for display
- **Subscription status transitions**: Complex state machine with many statuses—reference Polar documentation for valid transitions
- **Frontend pages live in private route group**: All payment UIs require authentication except when guest checkout enabled
- **Product-level authority**: `docs/README.md` overrides this file on conflict
- **Implementation may evolve**: Specific API endpoints, database fields, or webhook handlers may change—domain semantics and boundaries must remain stable
