# User Story: Subscription Plan Changes

## Story
**As a** user with active subscription  
**I want** to upgrade or downgrade my plan  
**So that** I can adjust my subscription to fit my changing needs

**Module:** payments

## Acceptance Criteria
- [ ] User can upgrade plan from billing dashboard
- [ ] User can downgrade plan with confirmation modal
- [ ] Downgrade confirmation prevents accidental changes
- [ ] Plan change request sent to `/api/polar/subscriptions/[id]` PATCH
- [ ] Polar handles proration calculations automatically
- [ ] Subscription updated immediately on success
- [ ] Billing dashboard reflects new plan immediately
- [ ] Next billing amount adjusted for proration
- [ ] Payments store refreshed with new subscription state
- [ ] User notified of successful plan change

## How it Works
1. User on billing dashboard views available plan changes
2. User clicks upgrade or downgrade option
3. System shows confirmation (downgrade requires extra confirmation)
4. User confirms plan change
5. System calls Polar API to change subscription plan
6. Polar calculates proration and updates subscription
7. Webhook or manual sync updates local database
8. Dashboard refreshes to show new plan details
9. User sees success notification

## Alternate Flows
- **Upgrade**: Immediate change with prorated charge
- **Downgrade**: Confirmation modal warns of feature loss; change scheduled or immediate based on config
- **Proration**: Credit or charge calculated by Polar based on billing cycle timing

## Edge Cases
- Plan change attempted on cancelled subscription
- User changes plan multiple times in same billing cycle
- Plan no longer available (product archived)
- Payment method fails during plan change charge
- User downgrades then immediately upgrades

## Notes
- Polar handles all proration logic
- Downgrades may be immediate or scheduled for next billing cycle
- Confirmation modal prevents accidental downgrades
- Plan changes sync via webhook for reliability
- User can manually sync if data appears stale
- Feature entitlements update immediately with plan change
