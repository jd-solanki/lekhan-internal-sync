# User Journey: Guest to Paid Subscriber

## Overview
**Name:** Guest Visitor to Active Paid Subscriber
**User:** Anonymous visitor discovering the product
**Goal:** Learn about product, create account, verify email, purchase subscription, and start using app
**Modules Involved:** blog, auth, email, payments, base

## Journey Steps

### 1. Content Discovery
- **Module:** blog
- **Action:** Guest visitor browses marketing site and reads blog articles about product features and benefits
- **Result:** User understands product value; sees pricing prompts embedded in blog content

### 2. Pricing Exploration
- **Module:** payments (public)
- **Action:** User clicks "View Pricing" or "Get Started"; views pricing page showing subscription plans with features and pricing
- **Result:** User selects desired subscription plan; clicks "Subscribe" button

### 3. Account Creation Prompt
- **Module:** auth
- **Action:** System detects unauthenticated user attempting subscription purchase; redirects to `/auth/sign-up`
- **Result:** User creates account with email/password or social provider; account created with unverified status

### 4. Email Verification
- **Module:** auth, email
- **Action:** Welcome email sent with verification link; user clicks link or enters code
- **Result:** Email verified; user can now complete subscription purchase

### 5. Subscription Purchase
- **Module:** payments
- **Action:** User redirected back to pricing; clicks "Subscribe" again; Polar checkout modal opens
- **Result:** User completes payment; Polar creates subscription and redirects to success page

### 6. Subscription Activation
- **Module:** payments
- **Action:** Success page syncs order data; webhook from Polar confirms subscription creation
- **Result:** Subscription record created in database; user entitlements activated; payments store populated

### 7. Dashboard Access
- **Module:** base
- **Action:** User navigates to `/app` dashboard for first time
- **Result:** User sees personalized welcome with subscription status; can access all premium features

## Success = User has verified email, active paid subscription, and full access to private app features

## Notes
- Journey spans 5 modules: blog → auth → email → payments → base
- Guest checkout not allowed for subscriptions (authentication required)
- Email verification required before completing subscription
- Polar webhook ensures reliable subscription activation even if success page sync fails
- First-time dashboard access may show onboarding tips
- Trial subscriptions follow same flow but no immediate payment
