# Email Module

Provides multi-provider email service abstraction and transactional template management for authenticated and system communications.

## Responsibility

> _Defines precisely what this module owns and what it must never own. Prevents responsibility drift and boundary violations._

**This module is responsible for:**

- Abstracting email provider configuration across AWS SES, Resend, and SMTP
- Selecting email provider based on environment and available credentials
- Providing email sending utilities with automatic sender categorization
- Managing reusable email templates for transactional communications
- Rendering email templates with consistent branding and layout
- Supporting multi-sender identity (security, events, alerts, system)
- Sending administrative notifications to configured admin email addresses

## Domain Model

> _Defines entities this module owns, their relationships, and semantic meaning. Focus on WHAT data represents, never HOW it's stored._

### Entities

Email Module owns **no persistent entities**. It provides transient service abstractions and template definitions.

### Conceptual Domain Elements

#### Email Provider Configuration

**Meaning:** Runtime selection of email service provider based on environment and credentials

**Provider Types:**

- **SMTP**: Local development server, used in development mode
- **Resend**: Cloud email service, activated when `RESEND_API_KEY` present in production
- **AWS SES**: Amazon Simple Email Service, activated when AWS credentials present in production

#### Sender Categories

**Meaning:** Email identity categories that communicate purpose and trustworthiness to recipients

**Category Types:**

- **security**: High-trust authentication emails (password resets, email verification, 2FA codes, magic links)
- **events**: Informational non-critical account activity (welcome emails, account updates)
- **alerts**: Important user-initiated or system alerts (account deactivation, billing failures)
- **system**: Internal admin notifications (runtime errors, crash reports, monitoring alerts)

#### Email Templates

**Meaning:** Reusable Vue components that render consistent HTML email layouts

**Template Types:**

- **EmailActionButton**: Generic action-oriented email with button CTA (used for verification, password reset, magic link)
- **Welcome**: Onboarding email sent after user registration or purchase
- **EmailLayoutDefault**: Base layout providing consistent branding, header, footer
- **EmailComponentCard**: Container component for email content sections

**Rendering:**

- Templates rendered server-side to static HTML
- All templates use shared layout for brand consistency
- Responsive design with consistent branding

### Relationships

**Within Module:**

- **Email Templates** → **EmailLayoutDefault**: All templates wrap content in default layout
  - **Meaning**: Ensures consistent branding, header with logo, and footer across all emails
  - **Integrity Rule**: Templates must use shared layout, not implement duplicate branding

- **EmailLayoutDefault** → **EmailComponentCard**: Layout uses card component for content container
  - **Meaning**: Provides white card container with padding, border, rounded corners on colored background
  - **Integrity Rule**: Card styles defined once, reused across templates

**Cross-Module References:**

- **Email Module** ← **Auth Module**: Auth consumes email sending utilities and templates
  - **Integration Point**: Auth calls `sendEmail()` with sender type and template-rendered HTML
  - **Contract**: Email Module provides `sendEmail()`, `sendEmailToAdmins()`, and `renderEmailComponent()` utilities; Auth owns verification/reset/magic link content

- **Email Module** ← **Any Module**: Modules can send emails via exposed utilities
  - **Integration Point**: Import `sendEmail` or `sendEmailToAdmins` from server utils
  - **Contract**: Consumers provide recipient, subject, HTML content, and sender type; Email Module handles provider and delivery

### Business Rules & Invariants

> _Domain constraints that must always hold true. These are module-level rules distinct from product-wide rules._

- **Single provider per environment**: Only one email provider active at runtime, selected on first send
- **Production provider required**: Production environment must have valid provider credentials or throw error on startup
- **Sender type required**: Every email must specify sender category (security/events/alerts/system)
- **Subject auto-prefixing**: All email subjects automatically prefixed with `${APP_NAME} -` pattern
- **Admin emails system-only**: `sendEmailToAdmins()` always uses `system` sender, sent only to configured admin addresses
- **Template rendering server-side**: Email templates rendered on server, never sent as Vue components
- **Development SMTP default**: Development environment uses localhost:1025 SMTP (no external provider calls)
- **Provider lazy initialization**: Email service instance created on first send, not at app startup
- **Sender addresses environment-aware**: Development uses example.com, production uses real app domain

## Module Dependencies

> _Which other modules this module depends on, and why. Must align with product README dependency graph._

**Depends on:**

- **01.base Module**: For environment utilities, shared configuration access, and runtime config

**Depended on by:**

- **Auth Module**: Uses email templates and sending utilities for verification, magic link, password reset, and welcome emails

**Integration Contract:**

- Email Module exposes server utilities: `sendEmail()`, `sendEmailToAdmins()`, `getEmailService()`
- Email Module exposes Vue email templates via nuxt-email-renderer's `renderEmailComponent()`
- Consuming modules call utilities with recipient, subject, HTML content, and sender type
- Email Module does not track delivery; consumers handle success/failure responses
- No database interaction required from Email Module

## UX Philosophy

> _If module has user-facing components, define interaction principles. Frontend modules MUST have this section. Backend-only modules can omit._

Email Module is **server-only** with no user-facing pages. UX principles apply to email recipient experience:

**Core Interaction Principles:**

- **Trust through clarity**: Use sender categories (security@, events@) to signal email purpose before opening
- **Consistent branding**: Every email includes logo, app name, and visual identity for recognition
- **Mobile-first rendering**: Responsive design ensures readability on any device
- **Accessible fallbacks**: Plain button URLs provided below CTA buttons for email clients blocking images
- **Minimal distraction**: Clean white card layout focuses recipient on message and action
- **Privacy-conscious**: No tracking pixels, external images limited to logo from app domain

## Frontend Pages

> _User-facing pages this module provides. Backend-only modules can omit this section._

Email Module provides **no user-facing pages**. It is a server-side service layer consumed by other modules.

## API Surface

> _High-level overview of capabilities exposed to other modules or external clients. Detailed specs live in `backend/api/` subdirectories._

**Server Utilities:**

- **`getEmailService()`**: Returns configured email service instance with selected provider
- **`sendEmail()`**: Send email to specified recipient with sender type categorization
- **`sendEmailToAdmins()`**: Send system notification to all configured admin email addresses

**Email Templates:**

- **`EmailActionButton`**: Generic action email with personalized message and button CTA
- **`Welcome`**: Onboarding email for new users or customers
- **`EmailLayoutDefault`**: Base layout component for wrapping custom email content
- **`EmailComponentCard`**: Reusable card container component for email sections

## Glossary

> _Module-specific terminology. Product-wide terms live in product README. Only define terms unique to this module's domain._

**Module-specific terms:**

- **Email Provider**: External service (AWS SES, Resend, SMTP) responsible for sending emails
- **Sender Category**: Classification of email purpose (security, events, alerts, system) that determines sender identity
- **Email Template**: Vue component rendered server-side to static HTML for email content
- **Transactional Email**: Automated email triggered by user action or system event (not marketing campaigns)
- **Email Rendering**: Server-side process of converting Vue email components to HTML via nuxt-email-renderer
- **Admin Notification**: System-level email sent to configured admin addresses for monitoring/alerts
- **Provider Fallback**: Production behavior checking for Resend credentials first, then AWS SES, then error
- **Subject Prefixing**: Automatic prepending of application name to all email subjects

_Product-wide terms (User, API, Module, Layer) defined in product README._

## Notes for Future AI Agents

- **This module is pure infrastructure** - owns email sending, not email content logic
- **Provider selection is environment-aware** - dev uses SMTP, production requires real credentials
- **Sender types are semantic boundaries** - use `security` for auth, `system` for admin alerts
- **Email templates are Vue components** - rendered server-side via nuxt-email-renderer module
- **No email tracking or delivery confirmation** - consuming modules handle success/error responses
- **Subject prefixing is automatic** - no need to include app name in subject parameter
- **Admin emails configured globally** - `sendEmailToAdmins()` uses runtime config admin list
- **New providers must follow unemail patterns** - add as else-if block in provider selection
- **New sender categories require type updates** - update `index.d.ts` and runtime config
- **Templates should use shared layout** - maintain brand consistency across all emails
- **Do not add database dependencies** - Email Module is stateless service layer
- **Behavioral truth from product README** - email capabilities listed there must stay current
