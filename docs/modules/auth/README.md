# Auth Module

Manages user authentication, authorization, session lifecycle, and account administration across all authentication methods using better-auth

## Responsibility

> _Defines precisely what this module owns and what it must never own. Prevents responsibility drift and boundary violations._

**This module is responsible for:**

- User registration with email/password and email verification flow
- User authentication via email/password, magic link, and OAuth (Google, GitHub)
- Session creation, validation, and lifecycle management (token-based with expiration)
- Account linking across multiple OAuth providers for single user
- User profile management (name, email, avatar)
- Password management (change password, forgot password, reset password flows)
- User role assignment and enforcement (admin vs regular user)
- Admin capabilities: user impersonation, user management, ban/unban users
- Account deactivation (soft delete with retention)
- User ban system with optional expiration dates

## Domain Model

> _Defines entities this module owns, their relationships, and semantic meaning. Focus on WHAT data represents, never HOW it's stored._

### Entities

#### User

**Meaning:** Represents an authenticated person who can access the application with verified identity and assigned permissions

**Key Attributes:**

- **id**: Unique user identifier
- **email**: User's primary email address with unique constraint
- **emailVerified**: Email ownership verification status
- **name**: Display name for user
- **image**: Reference to user's avatar image
- **role**: Permission level ('admin' or 'user')
- **banned**: Whether user is currently banned from access
- **banReason**: Optional explanation for ban
- **banExpires**: Optional date when ban automatically lifts (null = permanent)
- **lastSignInAt**: Most recent successful authentication timestamp
- **polarCustomerId**: Link to Polar payment platform customer record
- **createdAt**: Account creation timestamp
- **updatedAt**: Last profile modification timestamp
- **deactivatedAt**: Soft delete timestamp (null if active)

**Lifecycle Rules:**

- Created during signup (email/password) or first OAuth login with unverified email initially
- Email verification required before accessing private application pages
- Name defaults to email prefix if not provided by OAuth
- Avatar uploaded via separate API endpoint, stored in S3, image field stores S3 key
- Role can only be changed by admin users
- Banning sets banned=true and records reason; expired bans auto-lifted by scheduled task
- Deactivation sets deactivatedAt timestamp (soft delete), user cannot sign in after deactivation
- Polar customer ID auto-generated on signup for future payment linking

#### Session

**Meaning:** Represents an active authenticated browser session with security context and admin impersonation capability

**Key Attributes:**

- **id**: Unique session identifier
- **token**: Session authentication token for validation
- **expiresAt**: Timestamp when session becomes invalid
- **userId**: References owning user with cascade delete
- **ipAddress**: IP address where session was created
- **userAgent**: Browser/client user agent string
- **impersonatedBy**: Optional reference to admin user who initiated impersonation (null = normal session)
- **createdAt**: Session start timestamp
- **updatedAt**: Last session activity timestamp

**Lifecycle Rules:**

- Created on successful sign-in (email/password, magic link, or OAuth)
- Token must be included in authenticated requests for validation
- Auto-deleted when expiresAt timestamp passes (expired sessions rejected)
- Cascade deleted when owning user is deleted from database
- Impersonation creates new session with impersonatedBy pointing to admin user
- Stopping impersonation ends impersonated session and restores admin's original session

#### Account

**Meaning:** Represents a linked OAuth provider account or password credential associated with a user, enabling multi-provider authentication

**Key Attributes:**

- **id**: Unique account record identifier
- **accountId**: Provider-specific user identifier
- **providerId**: Authentication provider name ('google', 'github', 'credential')
- **userId**: References owning user with cascade delete
- **accessToken**: OAuth access token for provider API calls
- **refreshToken**: OAuth refresh token for obtaining new access tokens
- **idToken**: OAuth ID token containing user claims
- **accessTokenExpiresAt**: Access token expiration timestamp
- **refreshTokenExpiresAt**: Refresh token expiration timestamp
- **scope**: OAuth scopes granted by user
- **password**: Hashed password for credential provider
- **createdAt**: Account linking timestamp
- **updatedAt**: Last token refresh or credential change timestamp

**Lifecycle Rules:**

- Created when user signs up with email/password (providerId='credential') or first OAuth login
- Account linking allows multiple providers for same user (one Google + one GitHub account)
- Password field only populated for 'credential' provider, stored as bcrypt hash
- OAuth tokens refreshed automatically when expired if refresh token available
- Cascade deleted when owning user deleted
- Email mismatch during OAuth linking triggers confirmation flow before account link

#### Verification

**Meaning:** Represents a time-limited verification code or magic link token for email verification, password reset, or passwordless authentication

**Key Attributes:**

- **id**: Unique verification record identifier
- **identifier**: Email address or user identifier this verification applies to
- **value**: Secret verification token or code
- **expiresAt**: Timestamp when verification becomes invalid
- **createdAt**: Verification creation timestamp
- **updatedAt**: Modification tracking timestamp

**Lifecycle Rules:**

- Created when user signs up (email verification), requests password reset, or initiates magic link login
- Single-use: consumed and deleted on successful verification
- Expired verifications (past expiresAt) auto-rejected, eventually cleaned up
- New verification request invalidates previous codes for same identifier
- Used for email verification during signup and magic link authentication flows

### Relationships

**Within Module:**

- **User** → **Session**: One-to-many (one user can have multiple active sessions across devices)
  - **Meaning**: User can be signed in on multiple browsers/devices simultaneously
  - **Integrity Rule**: Deleting user cascade deletes all their sessions

- **User** → **Account**: One-to-many (one user can link multiple OAuth providers + password)
  - **Meaning**: User can authenticate via Google, GitHub, and email/password to same account
  - **Integrity Rule**: Deleting user cascade deletes all linked accounts

- **Session** → **User** (impersonatedBy): Optional many-to-one (admin creates impersonation sessions)
  - **Meaning**: Admin can impersonate users for support/debugging by creating special session
  - **Integrity Rule**: If impersonating admin deleted, impersonation reference set to null

**Cross-Module References:**

- **User** ↔ **Email Module**: One-way communication
  - **Integration Point**: Auth Module triggers email sends via Email Module composables/utilities
  - **Contract**: Auth calls Email Module functions to send verification, magic link, password reset, and welcome emails

- **User** → **Polar Customer** (Payments Module): One-to-one
  - **Integration Point**: User stores `polarCustomerId` referencing Payments Module customer entity
  - **Contract**: Polar customer auto-created on user signup; Payments Module queries users by polarCustomerId

- **Session** ← **Payments Module**: Read-only validation
  - **Integration Point**: Payments Module validates user session to ensure authenticated users for checkout
  - **Contract**: Payments Module reads session to link orders/subscriptions to authenticated users

### Business Rules & Invariants

> _Domain constraints that must always hold true. These are module-level rules distinct from product-wide rules._

- **Email uniqueness**: No two active users can share same email (case-insensitive comparison enforced at database level)
- **Email verification gate**: Users cannot access private pages until emailVerified=true
- **Session expiration enforcement**: Expired sessions (past expiresAt) always rejected for authentication
- **Admin-only impersonation**: Only users with role='admin' can create impersonation sessions
- **Cascade session cleanup**: Deleting user must delete all their sessions and accounts
- **Ban prevents access**: Banned users cannot create new sessions or use existing sessions
- **Ban expiration automation**: Scheduled task auto-lifts bans when banExpires date passes
- **Account linking email match**: OAuth account linking to existing user requires email address match or explicit confirmation
- **Single verification use**: Verification tokens consumed and deleted after first successful use
- **Deactivation prevents signin**: Users with deactivatedAt set cannot authenticate (soft delete)
- **Polar customer auto-creation**: Every new user signup creates corresponding Polar customer record
- **Admin middleware ordering**: Admin middleware must execute after private middleware in middleware chain

## Module Dependencies

> _Which other modules this module depends on, and why. Must align with product README dependency graph._

**Depends on:**

- **01.base Module**: For database utilities, shared composables, middleware patterns, and Nuxt UI configuration
- **Email Module** (optional): For sending transactional emails (verification, magic link, password reset, welcome)

**Depended on by:**

- **Payments Module**: Requires authenticated users and references user.polarCustomerId for customer linking
- **All other modules**: Consume auth middleware (private, guest, admin) to control page access based on authentication state

**Integration Contract:**

**Consuming Auth Module:**

- Other modules apply auth middleware (`definePageMeta({ middleware: ['private'] })`) to control access
- Modules use `useUserStore()` to access current authenticated user and session data
- Admin pages use `admin` middleware which requires `private` middleware first in chain
- Payment checkout requires session validation before linking orders to users

**Auth Module consuming others:**

- Calls Email Module functions (`sendEmail`, `renderEmailComponent`) to deliver auth-related emails
- Triggers Polar customer creation during user signup (via better-auth polar plugin)
- No direct code imports from feature modules; communication via composables and API contracts

## UX Philosophy

> _If module has user-facing components, define interaction principles. Frontend modules MUST have this section. Backend-only modules can omit._

**Core Interaction Principles:**

- **Frictionless signup**: Email/password signup requires only email and password; name defaults to email prefix
- **Immediate OAuth**: Social login (Google/GitHub) completes in 1-2 clicks without additional form fields
- **Transparent email verification**: Clear guidance after signup to check inbox; verify-email page shows different states (waiting, sent, verified)
- **Magic link convenience**: Passwordless authentication option sends one-click login link to email
- **Unified authentication UI**: All sign-in methods (password, magic link, OAuth) presented together on single page
- **Last-used method memory**: UI highlights authentication method user last successfully used
- **Graceful redirects**: After sign-in, redirect to intended destination (captured in redirectUrl query param) or user's home route
- **Admin impersonation visibility**: Banner prominently displays when admin is impersonating another user with clear "stop impersonating" action
- **Account settings organization**: Profile, security, and linked accounts separated into focused tabs
- **Protective confirmation**: Account deactivation requires explicit confirmation to prevent accidental deletion
- **Ban clarity**: Banned users see clear error explaining ban reason (if provided) when attempting to sign in

## Frontend Pages

> _User-facing pages this module provides. Backend-only modules can omit this section._

**Guest Pages (unauthenticated users only):**

- **/auth/sign-in**: Sign-in form with email/password, magic link, and OAuth options
- **/auth/sign-up**: Registration form with email/password and OAuth options
- **/auth/forgot-password**: Request password reset link via email
- **/auth/reset-password**: Set new password using reset token from email

**Public Pages (accessible by anyone):**

- **/auth/verify-email**: Email verification status page with resend option

**Private Pages (authenticated users only):**

- **/app/account-settings**: User account management with tabbed interface
- **/app/account-settings/profile**: Edit profile information (name, avatar)
- **/app/account-settings/linked-accounts**: View and manage linked OAuth providers
- **/app/account-settings/security**: Change password and deactivate account

**Admin Pages (admin role required):**

- **/admin/users**: User management table with search, sort, filter, ban, and impersonate actions
- **/admin/orders**: Order management view (shared with Payments Module)

## API Surface

> _High-level overview of capabilities exposed to other modules or external clients._

**BetterAuth Core Capabilities:**

BetterAuth handles core authentication endpoints including signup, signin, signout, session management, email verification, password flows (forgot/reset/change), OAuth callbacks (Google, GitHub), magic link authentication, account linking, and profile updates.

**BetterAuth Admin Plugin:**

Provides admin-specific endpoints for user impersonation (start/stop impersonation sessions).

**Custom Extensions:**

Custom endpoints extend BetterAuth for avatar management (upload/delete user avatars to S3), account deactivation (soft delete), admin user operations (update user fields, ban/unban), and automated ban expiration (scheduled task to lift expired bans).

## Glossary

> _Module-specific terminology. Product-wide terms live in product README. Only define terms unique to this module's domain._

**Module-specific terms:**

- **Session**: Time-limited authenticated browser session identified by unique token
- **Account**: Linked authentication provider (OAuth or credential) associated with a user
- **Email Verification**: Process confirming user owns email address before granting full access
- **Magic Link**: Passwordless authentication via time-limited URL sent to email
- **Account Linking**: Connecting multiple OAuth providers (Google + GitHub) to single user account
- **Impersonation**: Admin capability to temporarily assume another user's session for support/debugging
- **Deactivation**: Soft delete allowing user to voluntarily close account (sets deactivatedAt timestamp)
- **Ban**: Administrative suspension of user access with optional reason and expiration date
- **OAuth Provider**: Third-party authentication service (Google, GitHub) used for social login
- **Verification Token**: Single-use secret code sent via email for email verification or password reset
- **Private Route**: Page requiring authenticated user with verified email (enforced by private middleware)
- **Guest Route**: Page accessible only to unauthenticated users (signin/signup)
- **Admin Route**: Page requiring authenticated user with role='admin'

_Product-wide terms (User, API, Module, Layer) defined in product README._

## Notes for Future AI Agents

- **This document defines module-level WHAT, never HOW**
- **All auth behavioral truth flows from here**
- **Module must respect product README authority (higher in hierarchy)**
- **BetterAuth library handles core authentication logic; custom endpoints extend it**
- **Middleware ordering critical: private before admin in middleware array**
- **Email Module dependency is optional; auth works without emails but loses verification flows**
- **Polar customer creation coupled to user signup via better-auth polar plugin**
- **Page route groups `(guest)`, `(public)`, `(private)`, `(admin)` control middleware application**
- **Implementation may change; domain semantics must not**
- **If product README contradicts this, product README wins**
