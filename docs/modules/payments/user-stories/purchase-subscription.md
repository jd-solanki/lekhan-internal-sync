# User Story: Product Purchase & Subscription

## Story
**As a** user browsing pricing  
**I want** to purchase one-time products or subscribe to recurring plans  
**So that** I can access premium features and content

**Module:** payments

## Acceptance Criteria
- [ ] User can view products on pricing page via `/api/polar/products`
- [ ] Products displayed with pricing, features, one-time vs recurring indicator
- [ ] User can purchase one-time product (guest checkout if configured)
- [ ] User can subscribe to recurring plan (authentication required)
- [ ] Payment modal opens via Polar checkout integration
- [ ] Successful payment redirects to `/polar/success?checkout_id={ID}`
- [ ] Order synchronized from Polar via webhook or manual sync API
- [ ] Subscription record created in database for recurring purchases
- [ ] Order record created in database for all purchases
- [ ] User entitlements activated immediately after sync
- [ ] Payments store populated with products, subscriptions, orders

## How it Works
1. User browses pricing page; products loaded from `/api/polar/products`
2. User clicks "Buy Now" or "Subscribe" button
3. System checks authentication (required for subscriptions)
4. Polar checkout modal opens with selected product
5. User completes payment in Polar interface
6. Polar redirects to success page with checkout ID
7. Success page calls `/api/polar/orders/sync` to fetch order data
8. Webhook also triggers background sync from Polar
9. Database updated with order/subscription records
10. Payments store refreshed; entitlements active

## Alternate Flows
- **Guest checkout**: Non-authenticated users can purchase one-time products if enabled
- **Authentication required**: Subscriptions require signin; user prompted to create account or login
- **Payment failure**: Polar shows error; user can retry or cancel
- **Webhook sync**: Background webhook creates records even if success page sync fails

## Edge Cases
- User closes checkout modal before completing payment
- Webhook arrives before success page sync call
- Duplicate order sync attempts (idempotency)
- Payment succeeds but redirect fails
- User already has active subscription to same product

## Notes
- Polar handles all payment processing and PCI compliance
- Guest checkout configurable per product
- Webhook events ensure reliable data synchronization
- Success page provides immediate feedback and confirmation
- Customer ID created in Polar and stored in user record
