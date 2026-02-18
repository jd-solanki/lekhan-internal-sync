# GET /api/notes — Test Scenarios

## Happy Path

- [ ] User with 0 notes → 200 OK with empty data array, meta.total = 0
- [ ] User with 1 note → 200 OK with 1 item in data array, meta.total = 1
- [ ] User with 5 notes → 200 OK with 5 items, ordered by position ASC
- [ ] User with 50 notes → 200 OK with all 50 returned
- [ ] Response includes id, title, position, createdAt, updatedAt for each note
- [ ] Response excludes content field
- [ ] Notes ordered by position ASC (1, 2, 3, ...)

## Authentication

- [ ] Missing Authorization header → 401 Unauthorized
- [ ] Invalid token format → 401 Unauthorized
- [ ] Expired token → 401 Unauthorized
- [ ] Valid token → 200 OK

## Authorization

- [ ] User A cannot see User B's notes → only returns User A's notes
- [ ] Two users with same note titles → each sees only own notes

## Response Structure

- [ ] Response has "data" array and "meta" object
- [ ] meta.total equals length of data array
- [ ] Each note has id (integer), title (string), position (integer)
- [ ] Each note has createdAt and updatedAt (ISO8601 strings)
- [ ] No "content" field in response

## Edge Cases

- [ ] User with notes at positions 1, 3, 5 (gaps) → returned in order 1, 3, 5
- [ ] Notes with Unicode titles → returned correctly
- [ ] Note with very long title (255 chars) → returned fully
- [ ] User with 500 notes (Max plan) → all returned in single response
- [ ] Recently created note appears in list

## Caching

- [ ] First request → 200 OK, cache MISS
- [ ] Second request within 60s → 200 OK, cache HIT (same data)
- [ ] Create note, then list → cache invalidated, new note appears
- [ ] Update note title, then list → cache invalidated, updated title appears
- [ ] Delete note, then list → cache invalidated, note removed from list

## Performance

- [ ] Response time < 100ms at p95
- [ ] Response with 200 notes < 200ms
- [ ] Response with 500 notes < 500ms
- [ ] 100 list requests in 60 seconds → all succeed
- [ ] 101st request in 60 seconds → 429 Too Many Requests

## Concurrent Operations

- [ ] List while another user lists → both succeed independently
- [ ] List while creating note → list may not include new note (eventual consistency)
- [ ] Two simultaneous list requests from same user → both return same data

## Order Verification

- [ ] Notes with positions 3, 1, 2 → returned in order 1, 2, 3
- [ ] After reordering notes, list reflects new positions
- [ ] New note added → appears at its position in ordered list
