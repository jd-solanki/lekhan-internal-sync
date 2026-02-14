# User Login

## Story
**As a** returning user with verified account  
**I want** to sign in to my account  
**So that** I can access my personalized dashboard and app features

**Module:** auth

## Acceptance Criteria
- [ ] User can sign in with email/password on `/auth/sign-in`
- [ ] User can sign in with social provider buttons
- [ ] Invalid credentials show clear error message
- [ ] Successful authentication creates session in database
- [ ] Session cookie stored in browser
- [ ] User redirected to `/app` or last visited private page
- [ ] Private middleware initializes user store with current user data
- [ ] Session tracks IP address and user agent
- [ ] "Remember me" option controls session persistence
- [ ] Banned users cannot sign in (receive 403 error)
- [ ] Deactivated accounts can be reactivated by signing in

## How it Works
1. User navigates to `/auth/sign-in` and enters credentials
2. System validates credentials via BetterAuth
3. System creates session record in database
4. System stores session cookie in browser
5. User redirected to private dashboard
6. Middleware initializes user and payments stores
7. User sees personalized dashboard with their data

## Alternate Flows
- **Social login**: OAuth flow redirects to provider, then back to create session
- **Deactivated account reactivation**: Signin clears `deactivatedAt` timestamp
- **Email not verified**: User blocked from signin with verification required error
- **First-time signin**: User may be prompted for additional profile setup

## Edge Cases
- User banned during active session
- Session expires while user is active
- Multiple concurrent sessions from different devices
- OAuth provider returns error or denies access
- User's email changed on OAuth provider since last signin

## Notes
- BetterAuth manages session lifecycle and OAuth flows
- Session duration configurable based on "remember me" setting
- IP and user agent tracking for security monitoring
- Admin users see additional navigation options after signin
- Middleware enforces email verification before dashboard access
