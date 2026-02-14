# User Journey: Subscription Lifecycle Management

## Overview
**Name:** Active Subscriber Managing Subscription Lifecycle
**User:** Authenticated user with active subscription
**Goal:** Manage subscription through upgrade, downgrade, cancellation, and resumption scenarios
**Modules Involved:** payments, base

## Journey Steps

### 1. Current Subscription Review
- **Module:** base, payments
- **Action:** User navigates from dashboard to `/app/billing` to review current subscription
- **Result:** User sees current plan, billing date, subscription status, and available plan options

### 2. Plan Upgrade Decision
- **Module:** payments
- **Action:** User decides to upgrade; clicks upgrade option; confirms in modal
- **Result:** Polar processes upgrade with proration; subscription updated immediately; user gains access to enhanced features

### 3. Enhanced Feature Usage
- **Module:** base
- **Action:** User returns to `/app` dashboard and uses new features unlocked by upgraded plan
- **Result:** User benefits from enhanced subscription tier

### 4. Downgrade Consideration
- **Module:** payments
- **Action:** User later decides to downgrade; clicks downgrade option; sees confirmation modal warning of feature loss
- **Result:** User confirms downgrade; Polar processes with proration credit; plan changed

### 5. Cancellation
- **Module:** payments
- **Action:** User clicks "Manage" to open Polar customer portal; cancels subscription
- **Result:** Polar webhook sets `cancelAtPeriodEnd = true`; billing page shows cancellation notice; subscription remains active until period end

### 6. Resumption
- **Module:** payments
- **Action:** User reconsiders; clicks "Resume" on billing dashboard before period ends
- **Result:** Cancellation revoked via Polar API; subscription continues normally; next billing cycle proceeds as scheduled

### 7. Continued Usage
- **Module:** base
- **Action:** User returns to `/app` dashboard and continues using app with active subscription
- **Result:** User retains full access to subscription features; charged at next billing cycle

## Success = User successfully manages entire subscription lifecycle through upgrades, downgrades, cancellation, and resumption while maintaining access to appropriate features

## Notes
- Journey spans 2 modules: payments ↔ base (with base as usage context)
- All plan changes handle proration automatically via Polar
- Downgrades require confirmation to prevent accidental feature loss
- Cancelled subscriptions remain active until period end (user gets what they paid for)
- Resume only available before cancellation takes effect
- Feature entitlements update immediately with plan changes
- Billing dashboard provides real-time subscription status
