# User Story: Profile & Account Settings

## Story
**As an** authenticated user  
**I want** to manage my profile, linked accounts, and account security  
**So that** I can keep my information current and control my account

**Module:** auth

## Acceptance Criteria
- [ ] User can access account settings via `/app/account-settings`
- [ ] Default redirect to `/app/account-settings/profile` tab
- [ ] User can upload avatar image via file picker
- [ ] Avatar uploaded to storage via `/api/me/avatar`
- [ ] User can delete current avatar
- [ ] User can update display name
- [ ] Changes reflect immediately across app UI
- [ ] User can view linked social accounts at `/app/account-settings/linked-accounts`
- [ ] User can connect/disconnect social providers
- [ ] User can change password at `/app/account-settings/security`
- [ ] User can deactivate account with confirmation
- [ ] Deactivation sets `deactivatedAt` timestamp (soft delete)
- [ ] Deactivated users can reactivate by signing in

## How it Works
1. User navigates to `/app/account-settings` from dashboard or menu
2. System displays tabbed interface with profile, linked accounts, security
3. User makes changes in desired tab
4. System validates and saves changes to database
5. User store updates to reflect changes immediately
6. UI across app shows updated profile information

## Alternate Flows
- **Avatar upload**: File validated for size/type, uploaded to storage, URL stored in user table
- **Avatar deletion**: File removed from storage, user.image set to null
- **Unlink social account**: If last auth method, user warned to set password first
- **Account deactivation**: Confirmation modal prevents accidental deactivation

## Edge Cases
- Upload invalid file type for avatar
- Upload avatar exceeding size limit
- Unlink last remaining authentication method
- Deactivate account while having active subscription
- Name update with invalid characters or too long
- Multiple avatar uploads in quick succession

## Notes
- Avatar storage handled separately from user table
- Account linking managed by BetterAuth
- Deactivation is reversible (soft delete pattern)
- Password changes redirect to BetterAuth password flow
- Unlinking social accounts may prevent social login
- User data changes propagate to user store automatically
