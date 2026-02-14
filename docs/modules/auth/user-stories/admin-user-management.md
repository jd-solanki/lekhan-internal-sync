# User Story: Admin User Management

## Story
**As an** administrator  
**I want** to manage user accounts and enforce platform rules  
**So that** I can maintain platform safety and handle user issues

**Module:** auth

## Acceptance Criteria
- [ ] Admin can access `/app/admin/users` (role-protected route)
- [ ] Admin sees list of all users with search, pagination, sorting
- [ ] User list shows email, name, role, verification status, ban status
- [ ] Admin can ban user with reason and optional expiration date
- [ ] Banned users cannot sign in (receive 403 error)
- [ ] Admin can lift ban manually
- [ ] Cron job automatically lifts expired bans via `/api/cron/lift-ban`
- [ ] Admin can create new user accounts manually
- [ ] Admin can update user details via `/api/users/[id]` PATCH
- [ ] Admin actions logged for audit trail
- [ ] Non-admin users cannot access admin routes

## How it Works
1. Admin navigates to `/app/admin/users`
2. Admin middleware validates user.role === 'admin'
3. System displays paginated user list with actions
4. Admin selects action (ban, lift ban, create, update)
5. System validates admin permission and performs action
6. Database updated with new user state
7. Changes visible immediately in admin panel

## Alternate Flows
- **Ban user**: Modal opens for ban reason and expiration; sets `banned = true`, `banReason`, `banExpires`
- **Lift ban**: Clears ban flags; user can immediately sign in
- **Create user**: Modal opens with form; admin creates account with specified role
- **Automatic ban lift**: Cron job runs periodically to clear expired bans

## Edge Cases
- Ban user who is currently signed in
- Lift ban for user who was never banned
- Create user with email that already exists
- Admin demotes their own role (last admin edge case)
- Ban expiration date in the past
- Cron job fails to run or encounters errors

## Notes
- Admin middleware runs after private middleware (authentication required)
- Only users with `role = 'admin'` can access admin routes
- Bans can be temporary (with expiration) or permanent (no expiration)
- Cron job endpoint should be protected from unauthorized access
- Admin actions should be logged for compliance and auditing
- User sees appropriate error message when banned
