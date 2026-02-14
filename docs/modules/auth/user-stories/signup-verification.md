# User Story: Signup & Email Verification

## Story
**As a** guest visitor  
**I want** to create an account and verify my email  
**So that** I can access protected app features

**Module:** auth

## Acceptance Criteria
- [ ] User can register with email/password on `/auth/sign-up`
- [ ] User can register with social providers (Google, GitHub, etc.)
- [ ] Account created with unverified status in database
- [ ] Verification token generated and stored
- [ ] Welcome email sent with verification link
- [ ] User redirected to `/auth/verify-email` with instructions
- [ ] User can click verification link to mark email as verified
- [ ] User can request new verification email if token expires
- [ ] Verified users can sign in and access private routes
- [ ] Unverified users blocked from private routes by middleware

## How it Works
1. User visits `/auth/sign-up` and chooses registration method
2. System creates user account in database with `emailVerified = false`
3. System generates verification token and stores in verification table
4. System sends welcome email via email module with verification link
5. User clicks link or navigates to `/auth/verify-email`
6. System validates token and sets `emailVerified = true`
7. User can now sign in and access `/app/*` routes

## Alternate Flows
- **Social provider registration**: OAuth flow may auto-verify email depending on provider configuration
- **Token expiration**: User can request new verification email; old token invalidated
- **Already verified**: If user tries to verify again, system shows success message
- **Invalid token**: System shows error and offers to resend verification email

## Edge Cases
- Verification link clicked multiple times
- Verification token expired before user clicks link
- User tries to access private routes before verification
- Email delivery fails or goes to spam
- User changes email before verification (requires new verification flow)

## Notes
- BetterAuth handles core authentication logic
- Email module provides template rendering and sending
- Verification tokens single-use and time-limited
- Middleware enforces verification requirement on private routes
- Social provider accounts may bypass email verification
