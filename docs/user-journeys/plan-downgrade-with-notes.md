# Plan Downgrade with Existing Notes

## Overview
**Name:** Plan downgrade with existing notes
**User:** Existing user with notes who wants to downgrade subscription
**Goal:** Reduce subscription cost while understanding impact on existing notes
**Modules Involved:** Payments, Notes

## Journey Steps

### 1. Initiate Downgrade
- **Module:** Payments
- **Action:** User navigates to subscription settings, selects lower-tier plan
- **Result:** System warns if user has more notes than new plan allows (e.g., 150 notes but downgrading to Starter with 50 limit)

### 2. Understand Impact
- **Module:** Payments
- **Action:** User reads warning about note limit reduction
- **Result:** User understands: existing notes remain accessible (read/edit/delete), but cannot create new notes until count drops below new limit

### 3. Confirm Downgrade
- **Module:** Payments
- **Action:** User confirms downgrade despite note limit warning
- **Result:** Subscription downgraded, new lower note limit applied to account

### 4. Access Existing Notes
- **Module:** Notes
- **Action:** User opens notes interface with 150 existing notes and new 50-note limit
- **Result:** All 150 notes visible and editable, but "New Note" button disabled with message: "Delete 100 notes to create new ones (50 limit on Starter plan)"

## Success = User downgraded plan, retains access to all existing notes, understands creation is blocked until note count drops below new limit

## Notes
- Existing notes NEVER deleted automatically during downgrade (user data preservation)
- User can delete notes manually to get back under limit and unlock creation
- Clear messaging explains exactly how many notes must be deleted to create new ones
- Read/edit/delete operations remain fully functional regardless of limit overage
- Upgrade prompt available if user changes mind and wants to restore creation ability without deleting notes
