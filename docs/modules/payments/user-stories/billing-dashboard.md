# User Story: Billing Dashboard

## Story
**As a** user with purchases or subscriptions  
**I want** to view my billing information and manage my subscription  
**So that** I can track what I've purchased and control my recurring payments

**Module:** payments

## Acceptance Criteria
- [ ] User can access billing dashboard at `/app/billing`
- [ ] Dashboard displays all owned one-time products
- [ ] Dashboard shows active subscription with current plan details
- [ ] Subscription display includes status (active, trialing, cancelled)
- [ ] Dashboard shows next billing date for active subscription
- [ ] Trial dates displayed if subscription in trial period
- [ ] "Manage" button opens Polar customer portal
- [ ] Cancelled subscriptions show cancellation notice with resume option
- [ ] Dashboard refreshes when subscription state changes
- [ ] Empty state shown if no purchases or subscriptions

## How it Works
1. User navigates to `/app/billing`
2. System loads subscriptions via `/api/polar/subscriptions`
3. System loads orders via `/api/polar/orders`
4. Dashboard renders current subscription status and owned products
5. User can click "Manage" to open Polar customer portal
6. Portal opens in new tab for payment method updates, invoices

## Alternate Flows
- **No active subscription**: Dashboard shows available plans to subscribe
- **Trial subscription**: Dashboard highlights trial end date and upcoming charge
- **Cancelled subscription**: Shows cancellation effective date and resume button
- **Multiple products**: Lists all owned one-time products with purchase dates

## Edge Cases
- Subscription data stale (user clicks refresh/sync)
- User has subscription but no orders (data inconsistency)
- Billing date changes due to plan modification
- Trial converted to paid before trial end

## Notes
- Billing data synced from Polar on page load
- Polar customer portal handles payment method management
- User can download invoices from customer portal
- Subscription status automatically updated via webhooks
- Dashboard provides quick access to plan upgrades/downgrades
