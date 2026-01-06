# NuxtStart — Detailed Technical Blueprint

## Executive Summary

**NuxtStart** is a production-ready Nuxt.js SaaS boilerplate targeting startup founders, freelancers, and teams building commercial web applications. It provides a secure, opinionated tech stack with authentication, payments, data persistence, email, UI components, and developer tooling to reduce time-to-market by eliminating months of foundational setup.

**Author**: Single developer with 6+ years of Vue/Nuxt experience.  
**License**: Proprietary (with usage rights granted via paid purchase); not open-source.  
**Target Platforms**: Edge deployment, Vercel, Netlify, traditional VPS, Docker.

---

## Project Vision & Goals

### Primary Objectives
1. **Accelerate SaaS launches**: Provide day-one-ready infrastructure so teams focus on business logic, not boilerplate
2. **Secure by default**: Enforce email verification, role-based access, session management, and admin controls
3. **Type-safe data layer**: Drizzle ORM + Zod ensures compile-time and runtime data integrity
4. **Flexible authentication**: Support email/password, OAuth, magic links, and admin impersonation without refactoring
5. **Built-in billing**: Polar integration for subscriptions, one-time sales, and usage-based pricing
6. **Developer ergonomics**: Clear conventions, composable utilities, comprehensive error handling, and linting guards
7. **SEO-ready**: Automatic sitemaps, meta tags, Open Graph images, and structured data without manual effort

### Non-Goals
- AI-native or AI-first platform (though roadmap includes AI layer)
- Mobile-first design (web-only)
- Multi-tenant or SaaS-for-SaaS infrastructure
- Headless CMS or e-commerce-specific features
- Support for older browsers or legacy frameworks

---

## Architecture Overview

### High-Level System Design

```
┌─────────────────────────────────────────────────────────┐
│                    Nuxt.js Application                   │
│  (Vue 3 Components, Pages, Layouts, Client State)        │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼──────────────┐   ┌─────────▼───────────────┐
│  Client Libraries    │   │   Nitro Server         │
│  - Pinia (state)     │   │   (Node.js Runtime)    │
│  - Composables       │   │                         │
│  - Utils             │   │  ┌─────────────────┐   │
│  - Components        │   │  │  API Routes     │   │
└──────────────────────┘   │  │  Auth Handlers  │   │
                           │  │  Server Utils   │   │
                           │  └────────┬────────┘   │
                           └───────────┼────────────┘
                                       │
        ┌──────────────┬───────────────┴──────────────┐
        │              │                              │
┌───────▼────────┐   ┌─▼──────────────┐   ┌────────▼──────────┐
│  PostgreSQL    │   │  Polar SDK     │   │  Resend/Email     │
│  Database      │   │  (Payments)    │   │  (Notifications)  │
│  (Drizzle ORM) │   │                │   │                   │
└────────────────┘   └────────────────┘   └───────────────────┘

        ┌──────────────┐
        │   S3/File    │
        │   Storage    │
        └──────────────┘
```

### Nuxt Layers Architecture

NuxtStart uses a modular layer-based approach rather than a monolithic structure:

#### **01.base** (Foundation)
- **Purpose**: Core infrastructure shared across all layers
- **Contents**:
  - Generic UI components (`ConfirmModal`, `SearchInput`, `TablePagination`)
  - Common composables (`usePagination`, `useConfirm`, `useToastMessage`)
  - Shared utilities (SEO, types, formatting)
  - Nuxt UI configuration
  - Health check API (`/api/health`)
  - Countries list endpoint (`/api/countries.json`)
  - Database mixins (ID, timestamps, soft delete)

#### **02.layouts** (Navigation & Layouts)
- **Purpose**: Global layout templates and navigation
- **Contents**:
  - Page layouts (default, admin, auth)
  - Navigation components
  - Header/footer structures
  - Route meta configuration

#### **auth** (Authentication)
- **Purpose**: User identity, registration, login, session management
- **Contents**:
  - BetterAuth integration (magic link, OAuth, email/password)
  - Polar plugin for customer creation on signup
  - Database schema (`user`, `session`, `account`, `verification`)
  - API routes: `/api/auth/*`, `/api/me/*`, `/api/users/*`
  - Auth pages (`/auth/sign-in`, `/auth/verify-email`)
  - User store (Pinia)
  - Scheduled tasks (lift expired bans via cron)

#### **payments** (Billing)
- **Purpose**: Payment processing, subscriptions, entitlements
- **Contents**:
  - Polar SDK wrapper and client
  - API routes: `/api/polar/*` (products, subscriptions, customer state)
  - Store for billing state
  - Checkout and portal pages
  - Usage-based billing support

#### **email** (Notifications)
- **Purpose**: Email templating and delivery
- **Contents**:
  - Vue Email components
  - Email renderer utility
  - Sender configurations (security, alerts, system)
  - Integration with Resend or compatible service

#### **blog** (Content)
- **Purpose**: Blog post management and SEO
- **Contents**:
  - Nuxt Content integration
  - Blog pages at `/blog/*`
  - Sitemap plugin for auto-indexing
  - Sample blog posts

#### **docs** (Documentation)
- **Purpose**: User-facing documentation and guides
- **Contents**:
  - Nuxt Content integration
  - Docs pages at `/docs/*`
  - Sitemap plugin
  - Technical details and tutorials

#### **website** (Marketing)
- **Purpose**: Public landing page and legal pages
- **Contents**:
  - Marketing homepage
  - Pricing page
  - FAQ, ROI calculator
  - Feature showcase
  - Legal pages (Terms, Privacy)
  - Sitemap plugin

---

## Folder & File Structure Explanation

```
nuxtstart.com/
├── app/                              # Root app entry point
│   ├── app.vue                       # Root component (NuxtApp wrapper)
│   ├── app.config.ts                 # App config (Nuxt UI overrides)
│   ├── error.vue                     # Global error boundary
│   ├── pages/
│   │   └── app/
│   │       └── index.vue             # App home (dashboard)
│   ├── assets/
│   │   ├── css/                      # Global styles (Tailwind, transitions)
│   │   └── icons/app/                # Custom app icons
│
├── layers/                           # Nuxt layers (modular features)
│   ├── 01.base/                      # Foundation layer
│   │   ├── app/
│   │   │   ├── components/           # Shared UI components
│   │   │   ├── composables/          # Utilities (usePagination, useConfirm, etc.)
│   │   │   ├── stores/               # Banner, command palette state
│   │   │   ├── middleware/           # Auth, tracking, validation
│   │   │   ├── utils/                # SEO, formatting, helpers
│   │   │   └── assets/css/           # Transitions, animations
│   │   ├── server/
│   │   │   ├── api/
│   │   │   │   ├── health.get.ts     # Health check
│   │   │   │   └── countries.json.get.ts  # Country list
│   │   │   ├── db/
│   │   │   │   └── schemas/
│   │   │   │       ├── functions/    # SQL functions (lower, etc.)
│   │   │   │       └── mixins/       # Drizzle column mixins
│   │   │   └── utils/                # Server helpers (validation, storage)
│   │   ├── shared/
│   │   │   ├── schemas/              # Zod schemas (request/response)
│   │   │   └── utils/                # Constants, types, formatters
│   │   └── config/nuxt-ui.ts         # UI component config
│   │
│   ├── 02.layouts/                   # Layout layer
│   │   ├── app/
│   │   │   ├── components/           # Layout-specific components
│   │   │   ├── layouts/              # Page layouts (default, auth)
│   │   │   └── composables/          # Layout utilities
│   │
│   ├── auth/                         # Authentication layer
│   │   ├── app/
│   │   │   ├── pages/
│   │   │   │   ├── auth/             # Sign in, sign up, verify email
│   │   │   │   ├── admin/            # Admin user management, impersonate
│   │   │   │   └── app/              # User app pages
│   │   │   ├── components/           # Auth-specific UI
│   │   │   ├── stores/               # User state (Pinia)
│   │   │   ├── libs/                 # Auth client utilities
│   │   │   └── composables/          # useAuth, useSession, etc.
│   │   ├── server/
│   │   │   ├── api/
│   │   │   │   ├── auth/[...all].ts  # BetterAuth handler
│   │   │   │   ├── me/               # Current user endpoints
│   │   │   │   │   ├── accounts.get.ts
│   │   │   │   │   ├── avatar/
│   │   │   │   │   │   ├── index.post.ts
│   │   │   │   │   │   └── index.delete.ts
│   │   │   │   │   └── profile.patch.ts
│   │   │   │   └── users/            # Admin user mgmt
│   │   │   │       ├── [id].patch.ts
│   │   │   │       └── deactivate.post.ts
│   │   │   ├── db/
│   │   │   │   └── schemas/tables/
│   │   │   │       ├── user.ts       # User table + roles
│   │   │   │       ├── account.ts    # OAuth accounts
│   │   │   │       ├── session.ts    # Sessions
│   │   │   │       └── verification.ts  # Email tokens
│   │   │   ├── libs/
│   │   │   │   └── auth.ts           # BetterAuth config
│   │   │   ├── tasks/
│   │   │   │   └── liftBan.ts        # Scheduled ban expiry
│   │   │   └── utils/
│   │   │       └── auth.ts           # defineAuthenticatedEventHandler
│   │   └── shared/schemas/           # Auth schemas
│   │
│   ├── payments/                     # Payments/Billing layer
│   │   ├── app/
│   │   │   ├── pages/
│   │   │   │   ├── app/billing       # Billing dashboard
│   │   │   │   └── polar/            # Polar checkout, success
│   │   │   ├── components/           # Billing UI
│   │   │   └── stores/               # Billing state
│   │   ├── server/
│   │   │   ├── api/polar/
│   │   │   │   ├── products.get.ts
│   │   │   │   ├── customers/state.get.ts
│   │   │   │   └── subscriptions/
│   │   │   │       └── [id].delete.ts
│   │   │   ├── libs/
│   │   │   │   └── polar.ts          # Polar SDK client
│   │   │   └── utils/                # Billing helpers
│   │   ├── shared/schemas/           # Payment schemas
│   │   └── README.md                 # Polar API conventions
│   │
│   ├── email/                        # Email layer
│   │   ├── app/
│   │   │   └── emails/               # Vue email templates
│   │   │       └── EmailActionButton.vue
│   │   ├── server/
│   │   │   └── utils/
│   │   │       └── email.ts          # Send email utility
│   │   └── shared/schemas/           # Email schemas
│   │
│   ├── blog/                         # Blog layer
│   │   ├── app/pages/
│   │   ├── content/blog/             # Markdown blog posts
│   │   ├── server/plugins/
│   │   │   └── sitemap.ts            # Auto-add blog to sitemap
│   │   └── content.config.ts
│   │
│   ├── docs/                         # Docs layer
│   │   ├── app/
│   │   │   ├── pages/
│   │   │   ├── layouts/              # Docs-specific layout
│   │   │   └── components/
│   │   ├── content/docs/             # Markdown documentation
│   │   └── server/plugins/
│   │       └── sitemap.ts
│   │
│   └── website/                      # Marketing website layer
│       ├── app/
│       │   ├── app.config.ts
│       │   ├── pages/
│       │   │   └── index.vue         # Homepage
│       │   ├── components/
│       │   │   ├── page/website/     # Landing page sections
│       │   │   └── landing/          # Shared landing components
│       │   ├── libs/                 # Animations, helpers
│       │   └── assets/
│       │       ├── css/              # Brand colors, animations
│       │       └── images/           # Landing graphics
│       ├── content/legal/            # Terms, Privacy
│       ├── public/images/            # Static assets
│       ├── server/plugins/
│       │   └── sitemap.ts
│       └── content.config.ts
│
├── server/                           # Root server utilities
│   ├── db/
│   │   ├── index.ts                  # Drizzle client setup
│   │   ├── migrations/               # SQL migrations
│   │   └── schemas/
│   │       └── tables/               # Database schema
│   ├── libs/
│   │   └── env.ts                    # Env validation (Zod)
│   └── utils/                        # Shared server utilities
│
├── public/                           # Static assets
│   ├── _robots.txt
│   ├── favicon.ico
│   ├── favicon-light.ico
│   └── logo.svg
│
├── tests/                            # Vitest tests
│   ├── useWithLoading.test.ts
│   └── validation.test.ts
│
├── scripts/                          # Utility scripts
│   ├── createTable.ts
│   ├── generateMermaidSVGs.ts
│   ├── migrateProdDB.ts
│   └── testMail.ts
│
├── .ai/                              # AI documentation & instructions
│   ├── docs/
│   │   ├── project.md                # High-level overview
│   │   └── project-full.md           # This file
│   ├── rules/
│   │   ├── nuxt-ui.instructions.md
│   │   ├── coding-guidelines.instructions.md
│   │   └── project.instructions.md
│   └── commands/
│       └── docs.md
│
├── nuxt.config.ts                    # Root Nuxt config
├── app.config.ts                     # App config (branding, UI)
├── drizzle.config.ts                 # Drizzle ORM config
├── tsconfig.json                     # TypeScript config
├── eslint.config.mjs                 # ESLint rules
├── vite.config.ts                    # Vite build config
├── vitest.config.ts                  # Test runner config
├── commitlint.config.ts              # Commit message validation
├── lint-staged.config.mjs            # Pre-commit hooks
├── pnpm-workspace.yaml               # Workspace config
├── package.json                      # Dependencies & scripts
└── README.md                         # Project intro
```

---

## Core Domain Concepts & Terminology

### Authentication & User Management

**User**:
- Fields: `id`, `email`, `emailVerified`, `name`, `image` (avatar), `role`, `banned`, `banExpires`, `lastSignInAt`, `createdAt`, `updatedAt`, `deactivatedAt` (soft delete)
- **Role**: `'admin'` or `'user'` (enum `UserRole`)
- Soft-deleted via `deactivatedAt` timestamp; not permanently removed

**Account**:
- OAuth/social login records linked to a user
- Fields: `id`, `userId`, `providerId` (e.g., 'google', 'github'), `accessToken`, `refreshToken`, `password`, `scope`
- Multiple accounts can reference the same user for social login merging

**Session**:
- BetterAuth session token stored in database
- Tracks login/logout state
- Expires based on configuration

**Verification**:
- One-time tokens for email verification and password resets
- Used in `/api/auth/[...all]` (BetterAuth handler)

**Social Provider ID**:
- Union type of supported OAuth providers: `'google'`, `'github'`, etc.
- Configured in `nuxt.config.ts` runtime config

### Authorization & Access Control

**Role-Based Access Control (RBAC)**:
- `'admin'` users can access `/admin/*`, impersonate users, and manage bans
- `'user'` users access `/app/*` (user dashboard)
- Enforced via `defineAdminEventHandler` and `defineAuthenticatedEventHandler`

**Middleware Guards**:
- Routes checked for `isAuthRequired`, `isAdminOnly`, `isEmailVerificationRequired`
- Redirects enforce role and verification gates

### Payments & Billing

**Polar Integration**:
- Third-party payment processor (Polar.sh)
- Handles payments, subscriptions, invoicing, taxes, compliance

**Customer**:
- Polar customer record auto-created on user signup (via `polar()` plugin)
- Tracks subscription and payment state

**Product**:
- Polar product (subscription tier or one-time offer)
- Fetched via `/api/polar/products`

**Subscription**:
- Active or past subscription tied to user/customer
- Managed via `/api/polar/subscriptions/*`

**Entitlements**:
- Polar feature: automatic grant of perks (license keys, GitHub access, downloads) after purchase
- Configured in Polar dashboard; no code needed

### Data Persistence

**Drizzle ORM**:
- Type-safe SQL builder for PostgreSQL
- Schema defined as TypeScript objects (no migration hand-coding required for basic tables)
- Migrations auto-generated via `drizzle-kit`

**Schema Mixins**:
- `mixinId()`: Auto-incrementing primary key
- `mixinCreatedAt()`, `mixinUpdatedAt()`: Timestamps
- `mixinDeletedAt()`: Soft-delete flag (e.g., `deactivatedAt`)

**Zod Schemas**:
- Runtime validation for API requests/responses
- Shared between server and client via `shared/schemas/`
- Paired with Drizzle schema for end-to-end type safety

### Email & Notifications

**Email Types**:
- `'security'`: High-trust emails (password reset, email verification, 2FA)
- `'alerts'`: User-initiated or account alerts (deactivation, billing failure)
- `'system'`: Internal admin notifications (runtime errors, crashes)

**Vue Email Components**:
- Reusable email templates (e.g., `EmailActionButton`)
- Rendered to HTML via `@vue-email/render`
- Sent via Resend or compatible service

### SEO & Content

**Sitemap & Robots**:
- Auto-generated via Nitro plugins
- Blog, docs, and legal pages indexed
- Configurable via `routeRules` in `nuxt.config.ts`

**Open Graph (OG) Images**:
- Dynamically generated via Vue templates
- Improves social preview when pages are shared
- Configured in `app.vue` with `defineOgImageComponent`

**Meta Tags**:
- Handled by `@nuxtjs/seo` module
- Page title, description, canonical URLs managed centrally
- Schema.org support for rich snippets

---

## Detailed Workflows & Algorithms

### User Registration Flow

1. User submits email/password on `/auth/sign-up`
2. **Validation**: Email checked for uniqueness (case-insensitive via SQL `lower()` function)
3. **Create User**: BetterAuth creates record in `user` table
4. **Create Polar Customer**: Polar plugin auto-creates customer (if enabled)
5. **Send Verification Email**: `sendEmail()` dispatched with magic link or confirmation code
6. **Email Verification Gate**: If `isEmailVerificationRequired`, user redirected to `/auth/verify-email`
7. **Redirect**: After verification, user directed to `/app` (dashboard) or social OAuth flow if configured

### Authentication via Magic Link

1. User enters email on `/auth/sign-in`
2. **Generate Token**: BetterAuth creates time-limited verification token
3. **Send Email**: Token embedded in URL sent via Resend
4. **Verify Link**: User clicks link; BetterAuth validates token
5. **Create Session**: Browser receives session cookie (secure, httpOnly)
6. **Redirect**: User sent to `/app`

### OAuth (Social) Login

1. User clicks "Sign in with Google" button
2. **Redirect to Provider**: Browser redirected to Google OAuth endpoint
3. **User Consents**: User grants app permission
4. **Callback**: Google redirects to `/api/auth/callback/google`
5. **Handle Callback**: BetterAuth validates state/code, fetches user profile
6. **Create/Link Account**: If new user, creates `user` record; links OAuth `account` record
7. **Session**: BetterAuth creates session
8. **Redirect**: User sent to app

### Admin Impersonation

1. Admin views user list at `/admin/users`
2. **Click Impersonate**: Calls `POST /api/users/{userId}/impersonate`
3. **Create Impersonation Session**: Server creates session with `impersonatedBy` flag
4. **Redirect**: Admin logged in as user; sees `AuthUserImpersonatingBanner` in `app.vue`
5. **Stop Impersonation**: Admin clicks banner button to revert to own session

### Ban/Unban Workflow

1. Admin calls `PATCH /api/users/{userId}` with `{ banned: true, banExpires: '2025-01-20' }`
2. **Update User**: Ban flag and expiry set in database
3. **Logout**: User's sessions invalidated (next request fails auth check)
4. **Automatic Unban**: Scheduled task `liftBan` runs daily (via cron preset)
5. **Query**: Find users with `banned=true` AND `banExpires < now()`
6. **Lift Ban**: Update `banned=false` for matching users

### Email Delivery

1. Trigger event (e.g., signup, password reset) calls `sendEmail()`
2. **Render Template**: Vue Email component rendered to HTML string
3. **Build Email**: Subject, from address, recipients prepared
4. **Send via Resend**: RESEND_API_KEY used to authenticate
5. **Log**: Error logged if send fails; admin notified via `adminEmails`

### File Upload (Avatar)

1. User submits avatar on `/app/profile`
2. **Extract File**: `extractUploadedFiles()` parses multipart form
3. **Validate**: Check MIME type (png, jpeg, gif), file size (max 1MB)
4. **Generate Path**: UUID generated; file stored to `avatars/{uuid}.{ext}`
5. **Upload to S3**: File written to configured S3 bucket via `useStorage('file')`
6. **Update User**: `image` field set to file path
7. **Old Avatar Cleanup**: Previous file deleted (if exists)

### Payment Checkout Flow

1. User navigates to `/app/billing` and clicks "Upgrade to Pro"
2. **Fetch Products**: `/api/polar/products` lists available subscriptions
3. **Create Checkout**: Client redirects to Polar checkout via `checkout()` plugin
4. **Polar Handles Payment**: User enters card, completes purchase on Polar's hosted UI
5. **Webhook**: Polar sends subscription creation webhook (handler in `/api/auth/[...all]` via plugin)
6. **Update Entitlements**: Polar auto-grants license keys or digital downloads
7. **Redirect Success**: User sent to `/polar/success` confirmation page
8. **Display Subscription**: `/api/polar/customers/state.get.ts` returns active subscription; UI reflects new tier

### Scheduled Task: Lift Expired Bans

1. **Trigger**: Cron job runs daily at configured time (via `CRON_SCHEDULES_PRESET.EVERY_DAY`)
2. **Query**: Task handler queries `user` table: `banned=true AND banExpires < now()`
3. **Update**: Set `banned=false` for matching users
4. **Result**: Banned users regain access on next login attempt

---

## API Contracts, Schemas & Interfaces

### Authentication Endpoints

**`POST /api/auth/sign-up`** (BetterAuth)
- Request: `{ email: string, password: string, name?: string }`
- Response: `{ user: User, session: Session }`

**`POST /api/auth/sign-in`** (BetterAuth)
- Request: `{ email: string, password: string }`
- Response: `{ user: User, session: Session }`

**`POST /api/auth/sign-out`** (BetterAuth)
- Request: (empty body)
- Response: `{ ok: true }`

**`POST /api/auth/magic-link/send`** (BetterAuth + plugin)
- Request: `{ email: string }`
- Response: `{ success: boolean }`

**`GET /api/auth/magic-link/verify?token={token}` (BetterAuth + plugin)**
- Response: Redirect to `/app` or `/auth/verify-email`

**`GET /api/auth/callback/{provider}` (OAuth callback)**
- Auto-handled by BetterAuth
- Redirect via provider after user consent

### User Endpoints

**`GET /api/me/accounts`** (Authenticated)
- Response: `{ accounts: { providerId: string, createdAt: Date }[], hasEmailAccount: boolean }`

**`POST /api/me/avatar`** (Authenticated, multipart)
- Request: FormData with file
- Response: `{ image: string }` (file path)

**`DELETE /api/me/avatar`** (Authenticated)
- Response: `204 No Content`

**`PATCH /api/users/{id}`** (Admin only)
- Request: `{ name?: string, email?: string, role?: UserRole, banned?: boolean, banExpires?: Date }`
- Response: `{ user: User }`

**`POST /api/users/{id}/deactivate`** (Admin or self)
- Response: `204 No Content` (soft delete)

### Payments Endpoints

**`GET /api/polar/products`** (Public)
- Response: `{ products: PolarProduct[] }`

**`GET /api/polar/customers/state`** (Authenticated)
- Response: `{ subscription?: PolarSubscription, customerId: string }`

**`DELETE /api/polar/subscriptions/{id}`** (Authenticated)
- Response: `204 No Content`

**`GET /api/polar/checkout`** (Authenticated)
- Response: Redirect to Polar hosted checkout

### Utility Endpoints

**`GET /api/health`** (Public)
- Response: `{ status: 'ok', timestamp: string }`

**`GET /api/countries.json`** (Public, cached)
- Response: `[{ name: string, code: string, emoji: string }, ...]`

### Common Request Validation

All endpoints validate:
- **Query params** via `getValidatedQuery(event, schema.parse)`
- **Router params** via `getValidatedRouterParams(event, schema.parse)`
- **Request body** via `readValidatedBody(event, schema.parse)`

Example:
```typescript
const schema = z.object({ email: z.string().email() })
const body = await readValidatedBody(event, schema.parse)
```

### Response Format Convention

All APIs return either:
- **Success**: Direct object or array
- **Error**: `{ statusCode: number, statusMessage: string }` (Nuxt error throw)
- **Pagination**: `{ data: T[], total: number }` (for list endpoints)

---

## State Management & Data Persistence

### Pinia Stores

**`useUserStore`** (auth layer):
- State: `user`, `userSession`, `isLoggedIn`
- Actions: `fetchUser()`, `logout()`, `stopImpersonating()`
- Used in `app.vue` to display user info and banners

**`useBannerStore`** (01.base):
- State: `props` (title, description, icon, etc.)
- Used to display app-wide notification banners
- Cleared on route change or manual dismiss

**`useCommandPaletteStore`** (01.base):
- State: `isOpen`, `searchQuery`
- Used for command palette shortcut (Cmd+K)

**`useBillingStore`** (payments):
- State: `subscription`, `products`, `isLoading`
- Fetches from `/api/polar/customers/state` on mount

### Database Layer (Drizzle)

**Connection**:
```typescript
const db = drizzle(client, { schema, logger: false, casing: 'snake_case' })
```

**Query Example**:
```typescript
const user = await db.query.user.findFirst({
  where: eq(user.id, userId),
  columns: { name: true, email: true }
})
```

**Transaction Support**:
```typescript
await db.transaction(async (tx) => {
  await tx.update(user).set({ role: 'admin' })
})
```

**Migrations**:
- Auto-generated via `drizzle-kit generate`
- Applied via `drizzle-kit push` (dev) or `drizzle-kit migrate` (prod)
- Stored in `server/db/migrations/*.sql`

---

## Error Handling, Logging & Observability

### Error Handling

**Server-side**:
```typescript
throw createError({
  statusCode: 401,
  statusMessage: 'Unauthorized',
  data: { cause: 'Session expired' }
})
```

**Client-side**:
```typescript
try {
  await $fetch('/api/users')
} catch (error) {
  if (error.data?.statusCode === 401) {
    // Handle auth error
  }
}
```

### Logging

- **Development**: Nitro logs requests/responses to console
- **Production**: Errors sent to admin emails via email layer
- **Admin Notifications**: Runtime errors trigger `system` sender type email

### Email Alerts

Configured in `nuxt.config.ts` `runtimeConfig.mail`:
- Security alerts sent to `security@app.{domain}`
- System alerts sent to `system-alerts@app.{domain}` (admins only)
- User alerts (billing) sent to `alerts@app.{domain}`

---

## Security Considerations & Assumptions

### Authentication Security

- **Session Storage**: Secure, httpOnly cookies (set by BetterAuth)
- **CSRF Protection**: BetterAuth includes CSRF token validation
- **Email Verification**: Enforced before granting full access (if `isEmailVerificationRequired`)
- **Magic Link Expiry**: Tokens expire after short window (BetterAuth config)
- **OAuth State**: Validated to prevent CSRF in social login

### Authorization Security

- **Admin Checks**: All admin endpoints verify `user.role === 'admin'`
- **User Isolation**: API routes check `userId === event.context.user.id` for self endpoints
- **Role-Based Middleware**: Routes gated by role before handler execution

### Data Security

- **Password Hashing**: BetterAuth uses bcrypt (not stored in plaintext)
- **Token Entropy**: BetterAuth generates cryptographically secure tokens
- **Soft Delete**: Users can be deactivated without data loss
- **Env Separation**: Private config never sent to client; server-only utils prevent leaks

### File Upload Security

- **MIME Type Validation**: Only png, jpeg, gif allowed for avatars
- **Size Limits**: Max 1MB per file
- **Path Sanitization**: UUIDs prevent directory traversal
- **S3 ACLs**: Can configure to private; CDN provides access

### Third-Party Trust

- **Polar**: PCI-DSS compliant; handles sensitive payment data
- **Resend**: Email delivery service; credentials isolated via env
- **Better Auth**: Community-audited; industry standard

### Assumptions

- Database credentials and API keys stored securely (e.g., GitHub Secrets, platform env vars)
- SSL/HTTPS enforced in production
- Platform firewall blocks direct database access (app server only)
- Admin email list (`ADMIN_EMAILS`) kept private; not exposed to clients

---

## Deployment, Environment Configuration & CI/CD

### Environment Variables

**Public (visible to client)**:
- `NUXT_PUBLIC_APP_NAME`: App display name
- `NUXT_PUBLIC_APP_DOMAIN`: Primary domain
- `NUXT_PUBLIC_APP_BASE_URL`: Root URL (e.g., `https://nuxtstart.com`)
- `NUXT_PUBLIC_CONTACT_EMAIL`: Support email
- `NUXT_PUBLIC_API_BASE_URL`: API base (defaults to root URL)

**Private (server-only)**:
- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Session encryption key
- `BETTER_AUTH_URL`: Root URL for auth callbacks
- `AUTH_GOOGLE_CLIENT_ID`, `AUTH_GOOGLE_CLIENT_SECRET`: OAuth credentials
- `RESEND_API_KEY`: Email service API key
- `POLAR_API_KEY`, `POLAR_ACCESS_TOKEN`: Payment processor credentials
- `APP_AWS_ACCESS_KEY`, `APP_AWS_SECRET_KEY`, `APP_AWS_REGION`, `APP_AWS_BUCKET_NAME`: S3 storage

All validated via `server/libs/env.ts` (Zod schema) on startup.

### Build & Deployment

**Build**:
```bash
pnpm install       # Install dependencies
pnpm build         # Compile app and server
pnpm db:migrate    # Apply migrations (optional; auto-run on platform)
```

**Deployment Platforms**:
- **Vercel**: Native Nuxt support; auto-detects config
- **Netlify**: Requires Nitro configuration
- **Docker**: Can containerize via Dockerfile (not provided)
- **Traditional VPS**: Node.js + PostgreSQL required

**Database Migrations**:
- Dev: `pnpm db:push` (instant schema updates)
- Prod: Run `pnpm db:migrate` before deploying app code

**Post-Deploy**:
- Verify `/api/health` returns `{ status: 'ok' }`
- Check admin email receives system notifications
- Verify OAuth redirects work (callback URLs must match registered)

### Continuous Integration (CI)

**Pre-commit** (Husky):
- ESLint checks via `eslint . --fix`
- Commit message validation (conventional commits)

**Pull Request** (suggested):
- TypeScript typecheck: `pnpm typecheck`
- Linting: `pnpm lint`
- Tests: `pnpm test:run`
- Build: `pnpm build`

**Environment-Specific**:
- Dev: All features enabled; mock email (logs to console)
- Prod: Email sent via Resend; all security checks enforced

---

## Known Limitations & Design Tradeoffs

### Limitations

1. **Single-Tenant Only**: Not architected for multi-tenant SaaS; would require schema changes
2. **Polar Dependency**: Tight coupling to Polar for payments; swapping requires significant refactor
3. **PostgreSQL Only**: Drizzle config targets Postgres; other databases require schema migration
4. **No API Documentation**: No OpenAPI/Swagger auto-generation; must maintain manually
5. **Limited Analytics**: No built-in user journey or product analytics
6. **Email Provider Lock-in**: Resend integration hardcoded; alternatives require code changes
7. **No Real-Time Features**: WebSockets not set up; would require Nitro upgrading or external service

### Design Tradeoffs

1. **Layer-Based Modularity vs. Complexity**: More files/folders but cleaner separation; steeper mental model initially
2. **Zod Validation Everywhere**: Runtime safety but small performance overhead on high-traffic APIs
3. **Soft Delete via Timestamp**: Easier recovery but deleted data clutters queries; must always check `deactivatedAt`
4. **BetterAuth Flexibility**: Highly extensible but learning curve steeper than Firebase or Clerk
5. **Nuxt UI Dependency**: Beautiful default components but tie-in to Tailwind and component API
6. **Drizzle ORM Type Safety**: Excellent DX but less intuitive than query builders for complex joins

---

## Integration Points & External Services

### Polar (Payments)

**What it handles**:
- Subscription management
- One-time purchases
- Invoicing & tax compliance
- Entitlements (license keys, Discord access, etc.)
- Merchant of record (regulatory)

**Integration Points**:
- `layers/payments/server/libs/polar.ts`: SDK client initialization
- `layers/auth/server/libs/auth.ts`: `polar()` plugin for customer creation
- `/api/polar/*` endpoints: Proxied API calls

**Event Flow**:
- User signup → Polar customer created
- User subscribes → Webhook updates subscription state
- User cancels → Subscription marked inactive

### Resend (Email)

**What it handles**:
- Email delivery
- Template rendering
- Bouncing/complaint handling
- Analytics (opens, clicks)

**Integration Points**:
- `layers/email/server/utils/email.ts`: `sendEmail()` function
- Vue Email components: Email templates
- Environment: `RESEND_API_KEY`

**Event Flow**:
- Trigger event (signup, reset) → `renderEmailComponent()` → `sendEmail()` → Resend API

### AWS S3 (File Storage)

**What it handles**:
- Avatar file uploads
- Static asset hosting (optional)

**Integration Points**:
- `server/db/index.ts`: Storage via `useStorage('file')`
- `/api/me/avatar/*`: Upload/delete endpoints
- Environment: `APP_AWS_*` (region, bucket, credentials)

**Event Flow**:
- User uploads avatar → File stored to S3 → Path saved in user record

### BetterAuth (Authentication)

**What it handles**:
- Session management
- OAuth provider integration
- Email/password hashing
- Magic link generation & verification
- Session cookie management

**Integration Points**:
- `layers/auth/server/libs/auth.ts`: Main config
- `layers/auth/server/api/auth/[...all].ts`: Catch-all handler
- `layers/auth/server/utils/auth.ts`: Helper wrappers

**Plugins**:
- `admin()`: Admin user creation & impersonation
- `polar()`: Auto-create Polar customer
- `magicLink()`: Magic link flow with email
- `lastLoginMethod()`: Track auth method (email, OAuth, magic)

---

## Code Patterns & Best Practices

### Composables

**Pattern**:
```typescript
export function useExample() {
  const route = useRoute()
  const data = ref([])
  const error = ref(null)

  const fetch = async () => {
    try {
      data.value = await $fetch('/api/example')
    } catch (e) {
      error.value = e
    }
  }

  onMounted(fetch)

  return { data, error, fetch }
}
```

**Usage**:
```typescript
const { data, fetch } = useExample()
```

### API Handlers

**Pattern**:
```typescript
import * as z from 'zod'

const schema = z.object({ id: z.string() })

export default defineAuthenticatedEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, schema.parse)
  const user = event.context.user

  // Business logic
  const result = await db.query.example.findFirst({ where: eq(example.userId, user.id) })

  return result
})
```

**Validation**:
- Always use `getValidatedQuery`, `getValidatedRouterParams`, `readValidatedBody`
- Define Zod schema in `shared/schemas/` for reuse

### Component Structure

**Pattern**:
```vue
<script lang="ts" setup>
interface Props { title: string }
const props = defineProps<Props>()

const isLoading = ref(false)
const emit = defineEmits<{ 'update:title': [value: string] }>()

const handleClick = async () => {
  isLoading.value = true
  try {
    // Action
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <button @click="handleClick" :disabled="isLoading">
    {{ title }}
  </button>
</template>
```

### Error Handling in Composables

**Pattern**:
```typescript
const { data, error } = useExample()

watch(error, (e) => {
  if (e) {
    showErrorToast(e.message)
  }
})
```

---

## Testing Strategy

**Current**:
- Two test files in `tests/` (validation, composables)
- Vitest configured via `vitest.config.ts`

**Suggested Additions**:
- API endpoint integration tests
- Store action tests
- Component snapshot tests
- E2E tests via Playwright

**Run Tests**:
```bash
pnpm test           # Watch mode
pnpm test:run       # Single run
pnpm test:ui        # UI dashboard
```

---

## Documentation & Learning Resources

### Onboarding Docs
- `/layers/docs/content/docs/` – Getting started, technical details
- `README.md` – Project intro

### Code Documentation
- `.ai/rules/coding-guidelines.instructions.md` – API conventions, naming
- `.ai/rules/nuxt-ui.instructions.md` – UI component patterns
- Inline comments for complex logic

### External Resources
- [BetterAuth Docs](https://www.better-auth.com)
- [Polar API Docs](https://api.polar.sh)
- [Drizzle ORM](https://orm.drizzle.team)
- [Nuxt 4 Guide](https://nuxt.com)
- [Nitro](https://nitro.unjs.io)

---

## Roadmap & Future Features

**Coming Soon**:
- AI app layer (API endpoints + UI for AI-first projects)
- Wishlist layer (pre-launch waitlist & email collection)
- OTP verification (two-factor authentication)

**Planned**:
- Advanced usage analytics
- Enhanced payment flows (invoicing, subscriptions management)
- Team/organization support
- Webhook management UI
- Automated backups

---

## Summary

**NuxtStart** is a thoughtfully architected, production-grade SaaS boilerplate that combines modern tooling (Nuxt 4, Vue 3, Drizzle, BetterAuth, Polar) with solid engineering practices (type safety, validation, security) to enable rapid, confident SaaS product launches. The layer-based modularity allows teams to customize and extend each feature independently while maintaining a cohesive, well-documented foundation.

