# User Journey: Admin Platform Moderation

## Overview
**Name:** Administrator Moderating Platform Users and Revenue
**User:** Administrator enforcing platform rules
**Goal:** Identify problematic user, review their purchase history, and ban account to prevent further access
**Modules Involved:** base, auth, payments

## Journey Steps

### 1. User Complaint Review
- **Module:** base
- **Action:** Admin receives complaint about user behavior; navigates to `/app/admin/users` from dashboard
- **Result:** Admin sees full user list with search capabilities

### 2. User Investigation
- **Module:** auth
- **Action:** Admin searches for reported user; reviews user details (email, name, verification status, existing bans)
- **Result:** Admin identifies target user needing moderation action

### 3. Purchase History Review
- **Module:** payments
- **Action:** Admin navigates to `/app/admin/orders` to check user's purchase history and determine refund needs
- **Result:** Admin sees all orders from the problematic user with products, amounts, and dates

### 4. Account Ban
- **Module:** auth
- **Action:** Admin returns to users page; clicks "Ban" on target user; modal opens for ban reason and expiration date
- **Result:** User record updated with `banned = true`, `banReason`, `banExpires`; user immediately cannot sign in

### 5. Ban Enforcement
- **Module:** auth
- **Action:** Banned user attempts to sign in
- **Result:** System rejects signin with 403 error; user sees "Account banned" message with reason

### 6. Automatic Ban Lift (Optional)
- **Module:** auth
- **Action:** Cron job runs daily via `/api/cron/lift-ban` to check for expired bans
- **Result:** If ban expiration passed, ban flags cleared; user can sign in again

### 7. Manual Ban Lift (Optional)
- **Module:** auth
- **Action:** Admin decides to lift ban early; clicks "Lift Ban" on user
- **Result:** Ban flags immediately cleared; user can sign in

## Success = Admin successfully investigates user across modules, reviews purchase history, and enforces ban; banned user cannot access platform

## Notes
- Journey spans 3 modules: base (navigation) → auth (user management) → payments (order review) → auth (ban enforcement)
- Admin role required for all steps (enforced by middleware)
- Bans can be temporary (with expiration) or permanent (null expiration)
- Banned users immediately lose access on next signin attempt
- Active sessions may continue until user navigates or session expires
- Cron job provides automatic cleanup of expired bans
- Admin actions should be logged for audit trail
- Purchase history informs refund decisions (handled externally via Polar)
