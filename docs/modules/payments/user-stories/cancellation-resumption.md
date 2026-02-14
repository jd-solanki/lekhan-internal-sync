# User Story: Subscription Cancellation & Resumption

## Story
**As a** user with active subscription  
**I want** to cancel my subscription or resume a cancelled one  
**So that** I can control when I'm charged for recurring services

**Module:** payments

## Acceptance Criteria
- [ ] User can cancel subscription from Polar customer portal
- [ ] Polar webhook sends `subscription.canceled` event on cancellation
- [ ] Subscription record updated with `cancelAtPeriodEnd = true`
- [ ] Subscription remains active until current period ends
- [ ] Billing dashboard shows cancellation notice with effective date
- [ ] "Resume" button displayed for cancelled subscriptions
- [ ] User can resume subscription before period ends
- [ ] Resume clears `cancelAtPeriodEnd` flag via API
- [ ] Polar revokes scheduled cancellation on resume
- [ ] Subscription continues normally after resume
- [ ] User charged at next billing cycle if resumed

## How it Works

**Cancellation:**
1. User clicks "Manage" and opens Polar customer portal
2. User cancels subscription in portal
3. Polar webhook sends cancellation event
4. System sets `cancelAtPeriodEnd = true` in database
5. Subscription status remains "active" until period end
6. Billing dashboard shows cancellation alert with resume option

**Resumption:**
1. User clicks "Resume" on billing dashboard
2. System calls `/api/polar/subscriptions/[id]` PATCH to clear cancellation
3. Polar revokes scheduled cancellation
4. Database updated to clear `cancelAtPeriodEnd`
5. Billing dashboard updated to show active subscription
6. User continues to be charged at next billing cycle

## Alternate Flows
- **Immediate cancellation**: Polar may support immediate cancellation; access revoked immediately
- **End of period**: Subscription automatically expires when period ends if not resumed
- **Grace period**: User may have access for short period after cancellation effective date

## Edge Cases
- User cancels and resumes multiple times before period end
- Cancellation webhook delayed or fails
- User attempts to resume after period already ended
- Payment method invalid when resume triggers next billing
- User cancels trial subscription (no charge taken)

## Notes
- Cancellation scheduled for end of paid period (user gets what they paid for)
- Polar customer portal handles cancellation UI
- Webhook ensures reliable cancellation status updates
- Resume option only available before cancellation takes effect
- After cancellation effective date, user must resubscribe (new subscription)
- Trial cancellations end immediately without charge
