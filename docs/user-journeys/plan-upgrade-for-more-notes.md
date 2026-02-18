# Plan Upgrade to Unlock More Notes

## Overview
**Name:** Plan upgrade to unlock more notes
**User:** Existing user at plan limit
**Goal:** Increase note capacity by upgrading subscription plan
**Modules Involved:** Notes, Payments

## Journey Steps

### 1. Hit Note Limit
- **Module:** Notes
- **Action:** User attempts to create new note but has reached plan limit (50 for Starter, 200 for Pro)
- **Result:** Creation blocked, upgrade prompt displayed with clear messaging about current limit

### 2. Review Plan Options
- **Module:** Payments
- **Action:** User clicks upgrade prompt, sees available plans with note limits and pricing
- **Result:** User understands cost/benefit of upgrading (e.g., Starter→Pro unlocks 150 more notes)

### 3. Complete Upgrade
- **Module:** Payments
- **Action:** User selects higher plan, completes payment
- **Result:** Subscription upgraded, new note limit applied to account immediately

### 4. Create Additional Notes
- **Module:** Notes
- **Action:** User returns to notes interface, clicks "New Note"
- **Result:** Note creation succeeds, user can now create notes up to new plan limit

## Success = User upgraded plan and can create notes beyond previous limit

## Notes
- Existing notes remain accessible even when at limit (only creation is blocked)
- Upgrade prompt should appear contextually when user hits limit, not intrusively during editing
- Payment processing must complete before new limit takes effect
- Immediate limit update (no delay or manual refresh required)
