# NuxtStart — Project Overview

## What This Project Is

**NuxtStart** is a production-ready Nuxt.js SaaS boilerplate designed to accelerate SaaS product launches. It provides a secure, opinionated foundation with authentication, billing, database, UI, and developer workflows pre-configured so teams can focus on product differentiation from day one.

## Problem It Solves

Building a SaaS from scratch requires months of setup: auth systems, payment processing, database design, UI patterns, deployment configuration, and security hardening. NuxtStart eliminates this repetition by shipping a battle-tested baseline refined through six years of production use.

## What the System Does

**Core Functionality:**
- **Authentication & Identity**: Email/password, OAuth (Google, GitHub, etc.), magic links, email verification, and admin impersonation
- **Billing & Payments**: Integrated Polar payment processor with subscriptions, one-time purchases, and usage-based billing
- **User Management**: User registration, profile management, avatar uploads, account deactivation, and role-based access control
- **Admin Panel**: User management, user impersonation, account controls, and ban/unban functionality with scheduled tasks
- **Email System**: Templated emails (security, alerts, system notifications) with Resend integration
- **Content Management**: Blog and docs sections powered by Nuxt Content with SEO optimization
- **Data Persistence**: PostgreSQL database with Drizzle ORM for type-safe queries
- **UI Library**: Pre-built components and layouts using Nuxt UI with Tailwind CSS
- **SEO Infrastructure**: Sitemaps, robots.txt, Open Graph images, structured data, and link health checks

## High-Level Architecture

**Layer-based modular structure:**
- `01.base` — Core infrastructure (components, composables, utilities, common UI patterns)
- `02.layouts` — Layout templates and page structures
- `auth` — Authentication system (BetterAuth + Polar integration)
- `payments` — Billing and subscription management (Polar SDK)
- `email` — Email rendering and delivery
- `blog` — Content management for blog posts
- `docs` — Documentation pages and guides
- `website` — Public marketing website and legal pages

**Tech Stack:**
- **Frontend**: Nuxt 4 (nightly), Vue 3, Vite, TypeScript, Pinia (state), Vue Router
- **Styling**: Tailwind CSS, Nuxt UI components
- **Backend**: Nitro (Nuxt server engine), BetterAuth, Drizzle ORM
- **Database**: PostgreSQL with Drizzle migrations
- **Payments**: Polar SDK for billing and subscriptions
- **Email**: Resend (via sendEmail utility)
- **Content**: Nuxt Content for blog/docs
- **DevOps**: Husky, ESLint, pnpm, TypeScript strict mode

## Major Components & Responsibilities

### Authentication Layer
- User registration, login, logout
- Social OAuth flows (Google, GitHub, etc.)
- Magic link authentication
- Email verification gates
- Admin impersonation and ban/unban logic
- Scheduled tasks to lift expired bans

### Payments Layer
- Product listing via Polar
- Subscription management
- Customer state tracking
- Checkout handling
- License key generation

### User Management
- Profile updates (name, email, avatar)
- Account deactivation
- Role-based access control (admin vs. user)
- Avatar upload to S3-compatible storage

### Email System
- Templated emails (Vue Email components)
- Multiple sender types (security, alerts, system)
- Automatic sending on key events (registration, password reset, alerts)

### Content & SEO
- Blog posts and documentation
- Automatic sitemap generation
- Meta tags and robots.txt
- Dynamic Open Graph images
- Link health checks

### Admin Infrastructure
- User lookup and management
- User impersonation for debugging
- Ban/unban workflows
- Analytics and audit trails

## How the System Is Typically Used

1. **Install & Configure**: Clone repo, set environment variables (auth keys, database URL, payment credentials, email API key)
2. **Customize**: Modify branding, add business logic, extend Drizzle schema for domain models
3. **Develop**: Build features on top of auth/billing/UI layer using provided composables and utilities
4. **Deploy**: Push to Git; platform auto-deploys (Vercel, Netlify, etc.)
5. **Operate**: Use admin panel for user management; monitor emails and errors

## What This Project Is NOT Responsible For

- **Domain-specific logic**: CRM, analytics, or business features are not included; you add them
- **Infrastructure as code**: No Terraform/CloudFormation provided; deploy to your chosen platform
- **Mobile apps**: Web-only; no React Native or Flutter
- **API documentation generation**: Auto-doc tools not included
- **Monitoring/logging backends**: External integrations (Sentry, LogRocket) require manual setup
- **Email provider choice**: Only Resend is configured; alternative providers require code changes
- **Payment processors**: Only Polar is integrated; other payment systems require new integrations

## Key Design Principles

- **Type Safety**: Full TypeScript with Zod schema validation
- **Security First**: Email verification, session management, CSRF protection, admin role checks
- **Separation of Concerns**: Server utils, shared schemas, client composables in distinct directories
- **Environment-Driven**: Centralized env validation with safe defaults
- **Modular Layers**: Features split into Nuxt layers to keep codebase organized
- **SEO-First**: Content routing, meta tags, and social previews built in from day one
- **Developer Experience**: ESLint rules, Husky hooks, clear naming conventions, composable utilities

## Project Status & Roadmap

**Available**: Auth, billing, user management, email, docs, blog, admin panel, SEO
**Coming Soon**: AI-based app layer, wishlist feature, OTP verification
**Planned**: Advanced analytics, enhanced payment flows

