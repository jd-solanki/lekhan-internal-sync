# Approach Note Limit Warning

## Story
**As a** authenticated user  
**I want** to see a warning when approaching my plan's note limit  
**So that** I can plan ahead and upgrade before hitting the limit

**Module:** Notes

## Acceptance Criteria
- [ ] Warning appears when user reaches 90% of plan limit (45/50 for Starter, 180/200 for Pro)
- [ ] Warning shows current count and limit: "You've used 45 of 50 notes"
- [ ] Warning includes upgrade CTA: "Upgrade to Pro for 200 notes"
- [ ] Warning dismissable but reappears next session until resolved
- [ ] Warning non-intrusive (banner/toast, not blocking modal)
- [ ] No warning for Max plan (unlimited notes)

## How it Works
1. After note creation or page load, system calculates note count
2. If count ≥ 90% of plan limit, warning displayed
3. Banner appears at top of notes interface or as persistent toast
4. Shows: "You're approaching your [plan] limit ([count]/[limit] notes). [Upgrade link]"
5. User can dismiss with X button (hidden until next session or page refresh)
6. Clicking upgrade link navigates to `/settings/subscription`
7. Warning disappears when user upgrades or deletes notes below 90% threshold

## Alternate Flows
- **User at exactly 100% limit**: Different message — "You've reached your limit" with stronger upgrade CTA (see "create-note.md" for creation blocking)
- **User upgrades**: Warning disappears immediately after plan change
- **User deletes notes**: Warning disappears if count drops below 90%

## Edge Cases
- User rapidly creates notes approaching limit: Warning appears after first note crosses 90% threshold (not multiple warnings)
- User dismisses warning, creates another note: Warning reappears on next page load
- Max plan users: Never show warning (unlimited notes means no limit to approach)
- Trial plan expiring soon: Could show separate warning about trial expiration (separate from note limit warning)
- User downgrades while at high count: If over new limit (e.g., 150 notes on Starter 50 limit), show "over limit" message instead of "approaching"

## Notes
- Warning threshold configurable: 90% default, could adjust to 80% or 95% based on user feedback
- Non-blocking design: user can continue working, warning doesn't interrupt flow
- Warning persistence: store dismissed state in localStorage or user preferences
- Design: subtle banner style (yellow/warning color) with clear but non-alarming tone
- Include specific upgrade benefit: "Upgrade to Pro to unlock 150 more notes" (calculated difference)
- Consider batching warning with other account notifications to reduce notification fatigue
