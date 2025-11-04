# LaunchDayOne — Project Introduction & Goals

## What this project is
LaunchDayOne is a production‑ready Nuxt.js SaaS boilerplate to help you ship fast. It gives you a secure, opinionated foundation for auth, billing, data, UI, and developer workflows so you can focus on product value instead of setup.

## Primary goals
- Accelerate new SaaS projects with a ready‑to‑use Nuxt codebase and clear patterns.
- Provide flexible, secure authentication with email verification and optional OAuth.
- Include billing, subscriptions, and payments with a server‑side integration.
- Offer a typed data layer on Postgres via Drizzle with sensible defaults.
- Deliver a clean UI baseline with layouts, navigation, and state management.
- Encourage solid engineering hygiene and developer experience out of the box.

## What you get out of the box
- Authentication
  - Email/password and magic link sign‑in; password reset; optional social providers (guarded by email verification).
- Billing & payments
  - Checkout, customer portal, and usage‑based hooks via Polar.
- Email delivery
  - Ready to send transactional emails with Vue Email templates.
  - Swappable providers through Unemail (SMTP by default) — works with Resend, AWS SES, and more.
- Data & schemas
  - Postgres + Drizzle ORM with typed schemas and migrations.
  - Compatible with managed Postgres (Neon, Vercel Postgres, Supabase). Turso/SQLite is possible with Drizzle, but this template targets Postgres.
- App structure & UX
  - Nuxt 4, typed pages, route middleware for auth and redirects, Pinia stores, and Nuxt UI components.
  - Example pages for auth and an app area (dashboard, billing, payments, playground).

## Tech stack snapshot
- Nuxt 4, Vue 3, Nitro, Vite
- Nuxt UI, Pinia, Vue Router, @unhead/vue
- BetterAuth (+ @polar-sh/better-auth), Polar SDK
- Drizzle ORM, Postgres, drizzle‑zod
- Unemail, Nuxt Email Renderer
- TypeScript, ESLint, Husky, pnpm, tsx

## Configuration conventions
- Environment‑driven setup with validation and safe defaults.
- Clear separation of private vs public runtime configuration.
- Centralized app config for branding, navigation, and UI tokens.
- Simple provider swaps for email and database hosting without changing calling code.
- Guardrails around auth (e.g., email verification before enabling social sign‑in) and sensible redirects.

In short: LaunchDayOne is a secure, batteries‑included Nuxt SaaS baseline—auth, billing, data, and UI—so day one can be about your product, not setup.
