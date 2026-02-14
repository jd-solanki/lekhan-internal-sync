# User Story: Password Management

## Story
**As a** user who forgot password or wants to change it  
**I want** to reset or update my password  
**So that** I can maintain account security and regain access

**Module:** auth

## Acceptance Criteria
- [ ] User can request password reset from `/auth/forgot-password`
- [ ] Password reset email sent with time-limited token
- [ ] Reset link navigates to `/auth/reset-password?token=xyz`
- [ ] Middleware validates token presence before showing form
- [ ] User can set new password via reset form
- [ ] Token validated and password updated in database
- [ ] Used tokens immediately invalidated
- [ ] Authenticated user can change password in `/app/account-settings/security`
- [ ] Password change requires current password confirmation
- [ ] Password strength requirements enforced on both flows
- [ ] User can sign in with new password immediately

## How it Works

**Forgot Password Flow:**
1. User clicks "Forgot Password" and enters email
2. System generates reset token and stores in verification table
3. System sends email with reset link containing token
4. User clicks link and navigates to reset form
5. System validates token before displaying form
6. User enters new password
7. System updates password hash and invalidates token

**Change Password Flow:**
1. User navigates to `/app/account-settings/security`
2. User enters current password and new password
3. System validates current password via BetterAuth
4. System updates password hash
5. User remains signed in with existing session

## Alternate Flows
- **Token expiration**: User can request new reset email; old token invalidated
- **Invalid token**: System shows error and redirects to request new reset
- **Change password while having reset token**: Both flows independent and work concurrently

## Edge Cases
- Reset token clicked multiple times
- Password reset requested for non-existent email
- User requests multiple reset tokens before using first
- Session handling when password changed (keep alive or invalidate)
- Password change attempted with incorrect current password

## Notes
- Reset tokens single-use and time-limited for security
- BetterAuth handles password hashing and validation
- Email module delivers reset instructions
- Password strength requirements configurable
- Changing password does not invalidate existing sessions by default
