# User Journey: Content-Driven Product Discovery

## Overview
**Name:** Documentation Reader to One-Time Product Purchaser
**User:** Guest or authenticated user seeking solutions
**Goal:** Find helpful documentation, discover relevant product, and make one-time purchase
**Modules Involved:** docs, payments, auth, email, base

## Journey Steps

### 1. Documentation Discovery
- **Module:** docs
- **Action:** User searches online for solution to problem; lands on `/docs/[...slug]` page via SEO
- **Result:** User finds relevant documentation explaining product capabilities

### 2. Documentation Navigation
- **Module:** docs
- **Action:** User browses related docs using sidebar navigation; reads multiple pages
- **Result:** User understands how product solves their problem; sees call-to-action for relevant add-on

### 3. Product Exploration
- **Module:** payments (public)
- **Action:** User clicks "Buy [Product]" link embedded in documentation; navigates to pricing page
- **Result:** User sees one-time product details with pricing and features

### 4. Direct Purchase (Guest)
- **Module:** payments
- **Action:** User clicks "Buy Now" for one-time product; Polar checkout opens with guest checkout enabled
- **Result:** User completes purchase without creating account; receives product immediately

### 5. Order Confirmation
- **Module:** payments
- **Action:** Polar redirects to `/polar/success?checkout_id={ID}`; order synced via API and webhook
- **Result:** Order record created; success page shows confirmation and access instructions

### 6. Optional Account Creation
- **Module:** auth, email
- **Action:** Success page prompts guest purchaser to create account for order history; user signs up
- **Result:** Account created and linked to existing order; verification email sent

### 7. Access Dashboard
- **Module:** base
- **Action:** After email verification, user navigates to `/app/billing` to see purchase
- **Result:** User sees owned product in billing dashboard; can upgrade to subscription if desired

## Success = User discovers product through documentation, completes purchase (with or without account), and receives product access

## Notes
- Journey spans 4-5 modules: docs → payments → (optional: auth → email) → base
- Guest checkout allows purchase without authentication for one-time products
- Documentation serves as conversion funnel with embedded CTAs
- Order can be associated with account retroactively
- Public middleware initializes payments store to show pricing in docs
- Post-purchase account creation helps build user base
- One-time products may grant permanent entitlements or downloads
