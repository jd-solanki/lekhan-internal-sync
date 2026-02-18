# PATCH /api/notes/reorder — Test Scenarios

## Happy Path

- [ ] Reorder 3 notes → 200 OK with updated: 3, positions array with new positions
- [ ] Reorder single note → 200 OK with updated: 1
- [ ] Reorder all user's notes (50 for Starter) → 200 OK with all positions updated
- [ ] Large batch (500 notes for Max plan) → 200 OK
- [ ] Response.updated matches length of updates array
- [ ] Response.positions matches request updates

## Authentication

- [ ] Missing Authorization header → 401 Unauthorized
- [ ] Invalid token format → 401 Unauthorized
- [ ] Expired token → 401 Unauthorized
- [ ] Valid token → 200 OK

## Authorization

- [ ] All note IDs owned by user → 200 OK
- [ ] One note ID owned by different user → 403 Forbidden (entire batch rejected)
- [ ] One note ID doesn't exist → 403 Forbidden
- [ ] Mix of owned and non-owned IDs → 403 Forbidden
- [ ] User A reorders User A's notes → 200 OK
- [ ] User A includes User B's note ID → 403 Forbidden

## Validation - Updates Array

- [ ] Empty array [] → 422 Unprocessable Entity "Must provide at least one note"
- [ ] Array with 1 item → 200 OK
- [ ] Array with 500 items → 200 OK
- [ ] Array with 501 items → 422 Unprocessable Entity "Cannot reorder more than 500"
- [ ] Missing "updates" field → 400 Bad Request

## Validation - ID Field

- [ ] id = valid positive integer → 200 OK (if owned)
- [ ] id = 0 → 422 Unprocessable Entity
- [ ] id = negative → 422 Unprocessable Entity
- [ ] id = non-integer "abc" → 422 Unprocessable Entity
- [ ] id = float 3.14 → 422 Unprocessable Entity
- [ ] id field missing → 422 Unprocessable Entity
- [ ] Duplicate id in array → 422 Unprocessable Entity "Duplicate note ID: {id}"

## Validation - Position Field

- [ ] position = 1 → 200 OK
- [ ] position = 1000 → 200 OK
- [ ] position = 0 → 422 Unprocessable Entity
- [ ] position = negative → 422 Unprocessable Entity
- [ ] position = non-integer "abc" → 422 Unprocessable Entity
- [ ] position field missing → 422 Unprocessable Entity

## Edge Cases

- [ ] Non-sequential positions (1, 3, 5, 7) → 200 OK (accepted as-is)
- [ ] Position collisions (two notes at position 5) → 200 OK (frontend's responsibility)
- [ ] Reorder note to same position → 200 OK (idempotent)
- [ ] Reorder notes to reverse order (5→1, 4→2, 3→3, 2→4, 1→5) → 200 OK
- [ ] updatedAt unchanged after reorder → verify timestamps unchanged
- [ ] Reorder with very high positions (1000, 2000) → 200 OK

## Atomicity

- [ ] All updates succeed together → 200 OK
- [ ] One invalid note ID → entire batch fails with 403
- [ ] Database error mid-transaction → entire batch rolled back, 500 error
- [ ] After partial failure, no positions changed → verify rollback

## Cache Invalidation

- [ ] Reorder notes, then GET /api/notes → list cache invalidated, new order reflected
- [ ] Individual note caches (GET /api/notes/:id) unchanged → position not in note detail

## Performance

- [ ] Response time < 500ms at p95 for 10 notes
- [ ] Response time < 1000ms at p99 for 100 notes
- [ ] 100 reorder requests in 60 seconds → all succeed
- [ ] 101st request in 60 seconds → 429 Too Many Requests

## Concurrent Operations

- [ ] Two simultaneous reorder requests → both succeed, last write wins
- [ ] Reorder while another user reorders their notes → both succeed independently
- [ ] Reorder while fetching list (GET) → eventual consistency, may return old or new order

## Debouncing (Client-Side Context)

- [ ] Rapid drag operations → client debounces, sends single batch
- [ ] Server accepts multiple rapid reorder requests (no server-side debounce)

## Request Body Variations

- [ ] Malformed JSON → 400 Bad Request
- [ ] Extra fields in request → ignored, 200 OK if valid
- [ ] "updates" as object instead of array → 400 or 422
- [ ] Nested arrays in updates → 422

## Response Structure

- [ ] Response has "updated" (integer) and "positions" (array)
- [ ] positions array length matches updates array length
- [ ] Each position object has "id" and "position" fields
- [ ] positions array reflects successfully applied updates

## Integration

- [ ] Frontend recalculates positions for affected notes
- [ ] Batch update sent after drag completes (not during drag)
- [ ] GET /api/notes after reorder shows notes in new order
