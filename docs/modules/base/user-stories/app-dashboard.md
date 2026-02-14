# User Story: Private App Dashboard

## Story
**As an** authenticated user with verified email  
**I want** to access my personalized app dashboard  
**So that** I can use app features and navigate to different sections

**Module:** base

## Acceptance Criteria
- [ ] User can navigate to `/app` after authentication
- [ ] Private middleware validates authentication before page loads
- [ ] Email verification required to access dashboard
- [ ] User store initialized with current user data
- [ ] Payments store initialized with subscription/order data
- [ ] Dashboard displays welcome message with user's name
- [ ] Dashboard shows subscription status if applicable
- [ ] Quick links to billing and account settings displayed
- [ ] Admin users see additional admin menu options
- [ ] Navigation menu shows all available private routes
- [ ] Banned users redirected with error message
- [ ] Deactivated accounts prompted to reactivate

## How it Works
1. User navigates to `/app` (directly or via redirect after signin)
2. Private middleware executes to validate authentication
3. Middleware checks email verification status
4. User and payments stores initialized with current data
5. Dashboard page renders with personalized content
6. User sees their name, subscription status, navigation options
7. User can click links to access other app features

## Alternate Flows
- **First-time access**: User may see onboarding tips or setup wizard
- **Subscription trial**: Dashboard highlights trial expiration date
- **Admin access**: Additional menu items for user/order management
- **Redirect after signin**: User returned to last visited private page

## Edge Cases
- User accesses `/app` without authentication (redirected to signin)
- Email not verified (blocked with verification reminder)
- Session expired during navigation
- User banned mid-session (kicked out on next route change)
- Store initialization fails or takes long time

## Notes
- Private middleware runs on all `/app/*` routes
- Middleware enforces authentication and email verification
- User store provides reactive authentication state
- Payments store provides subscription/entitlement state
- Admin middleware runs in addition to private middleware for admin routes
- Dashboard serves as central navigation hub for all app features
