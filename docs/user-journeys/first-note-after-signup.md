# First Note Creation After Signup

## Overview
**Name:** First note creation after signup
**User:** New user
**Goal:** Complete registration and create first note to start using the product
**Modules Involved:** Auth, Payments, Notes

## Journey Steps

### 1. Sign Up
- **Module:** Auth
- **Action:** User creates account with email/password
- **Result:** User authenticated, session created, redirected to onboarding

### 2. Choose Plan
- **Module:** Payments
- **Action:** User selects subscription plan (Starter: 50 notes, Pro: 200, Max: unlimited)
- **Result:** Plan activated (trial or paid), note limit established

### 3. Create First Note
- **Module:** Notes
- **Action:** User clicks "New Note" and starts typing in visual editor
- **Result:** Blank note created, auto-save triggers every 3s, note appears in sidebar

### 4. Save and View
- **Module:** Notes
- **Action:** User finishes writing, sees auto-save confirmation
- **Result:** Note persisted as markdown, visible in notes list, ready for future editing

## Success = User has active account with subscription plan and at least one saved note they can access

## Notes
- First-time users must complete plan selection before creating notes (enforced by Payments module)
- Trial plan counts as active subscription for note creation
- Auto-save gives immediate feedback to reassure new users their content is safe
- Onboarding may include guided tour of visual editor features
