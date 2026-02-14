# User Journey: Password Recovery to App Re-engagement

## Overview
**Name:** Returning User Recovering Access and Re-engaging
**User:** Returning user who forgot password
**Goal:** Reset password, regain access to account, and resume using app features
**Modules Involved:** auth, email, base, payments

## Journey Steps

### 1. Failed Signin Attempt
- **Module:** auth
- **Action:** User navigates to `/auth/sign-in` and attempts to sign in; realizes password forgotten
- **Result:** User clicks "Forgot Password" link

### 2. Password Reset Request
- **Module:** auth, email
- **Action:** User enters email on `/auth/forgot-password`; submits request
- **Result:** Reset token generated; password reset email sent with link

### 3. Email Link Click
- **Module:** auth, email
- **Action:** User receives email; clicks reset link containing token
- **Result:** User navigated to `/auth/reset-password?token=xyz`; middleware validates token

### 4. New Password Set
- **Module:** auth
- **Action:** User enters new password; submits form
- **Result:** Token validated; password hash updated in database; token invalidated

### 5. Successful Signin
- **Module:** auth
- **Action:** User returns to `/auth/sign-in` with new password; signs in
- **Result:** Session created; user redirected to dashboard

### 6. Dashboard Access
- **Module:** base, payments
- **Action:** User lands on `/app` dashboard; private middleware initializes stores
- **Result:** User sees dashboard with welcome back message; subscription status loaded

### 7. Subscription Status Check
- **Module:** payments
- **Action:** User navigates to `/app/billing` to check subscription after time away
- **Result:** User sees active subscription or cancelled status; can take action if needed

### 8. Continued Usage
- **Module:** base
- **Action:** User returns to using app features from dashboard
- **Result:** User re-engaged and actively using product

## Success = User successfully recovers access via password reset, signs in, and resumes using app with full awareness of subscription status

## Notes
- Journey spans 4 modules: auth → email → auth → base → payments
- Password reset flow independent of subscription status
- Email delivery critical for password recovery (fallback support channels needed)
- Token expiration requires user to request new reset if delayed
- Re-engagement opportunity to show value and prevent churn
- Billing dashboard helps user assess account status after absence
- User may discover cancelled subscription and resume if still within period
